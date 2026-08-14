"""Tests for the audio delivery invariants.

These cover the properties that are easy to break silently and expensive to
notice: a spatial image that has collapsed, a master that cancels on a speaker, a
peak measurement that is wrong, and an assembly whose seams show.
"""

from __future__ import annotations

import numpy as np
import pytest
from scipy.signal import resample_poly

from studio.audio.beds import drifting_soundscape, room_tone
from studio.audio.hrtf import (
    HEAD_RADIUS_M,
    KEMAR_REFERENCE_DISTANCE_M,
    HrtfError,
    Placement,
    near_field_ild_db,
)
from studio.audio.master import (
    MasterTarget,
    mono_compatibility_db,
    normalise,
    to_speaker_safe,
    true_peak_dbtp,
)

RATE = 48000


def _signal(seconds: float = 3.0, seed: int = 0) -> np.ndarray:
    rng = np.random.default_rng(seed)
    n = int(RATE * seconds)
    env = np.interp(
        np.linspace(0, 1, n), [0, 0.25, 0.5, 0.75, 1.0], [0.05, 0.6, 0.1, 0.9, 0.2]
    )
    mono = rng.standard_normal(n) * env * 0.2
    return np.stack([mono, np.roll(mono, 21) * 0.4], axis=1)


# -- true peak -------------------------------------------------------------


@pytest.mark.parametrize("seconds", [0.5, 2.0, 7.0])
def test_chunked_true_peak_is_exact(seconds: float) -> None:
    """Chunking must not change the answer — the result is a maximum."""
    x = _signal(seconds, seed=3)
    x[len(x) // 3] = 0.9

    naive = 20 * np.log10(
        max(float(np.max(np.abs(resample_poly(x, 4, 1, axis=0)))), 1e-12)
    )
    assert true_peak_dbtp(x, RATE) == pytest.approx(naive, abs=1e-9)


def test_true_peak_is_independent_of_chunk_size() -> None:
    x = _signal(4.0, seed=5)
    reference = true_peak_dbtp(x, RATE, chunk_samples=1 << 24)
    for chunk in (4096, 20_000, 65_536):
        assert true_peak_dbtp(x, RATE, chunk_samples=chunk) == pytest.approx(
            reference, abs=1e-9
        )


def test_true_peak_detects_intersample_overshoot() -> None:
    """A signal at 0 dBFS sample peak can still exceed 0 dBTP between samples."""
    n = RATE
    # Half-Nyquist square-ish alternation is the classic overshoot case.
    x = np.zeros((n, 2))
    x[::2] = 0.99
    x[1::2] = -0.99
    assert true_peak_dbtp(x, RATE) > 0.0


def test_true_peak_of_silence_is_negative_infinity() -> None:
    assert true_peak_dbtp(np.zeros((0, 2)), RATE) == -np.inf


# -- speaker safety --------------------------------------------------------


def test_binaural_master_fails_mono_fold_and_speaker_fold_fixes_it() -> None:
    x = _signal(5.0, seed=7)
    assert mono_compatibility_db(x) < -2.0
    folded = to_speaker_safe(x, RATE)
    assert mono_compatibility_db(folded) > -1.0


def test_speaker_fold_keeps_some_width() -> None:
    x = _signal(3.0, seed=9)
    folded = to_speaker_safe(x, RATE)
    correlation = np.corrcoef(folded[:, 0], folded[:, 1])[0, 1]
    assert 0.5 < correlation < 0.9999, "should be narrowed, not collapsed to true mono"


def test_speaker_fold_removes_subsonic_content() -> None:
    n = RATE * 2
    t = np.arange(n) / RATE
    low = np.sin(2 * np.pi * 40 * t) * 0.5
    x = np.stack([low, low], axis=1)
    folded = to_speaker_safe(x, RATE)
    assert np.max(np.abs(folded)) < 0.25, "40 Hz should be strongly attenuated"


# -- loudness --------------------------------------------------------------


def test_normalise_hits_target_and_reports_no_shortfall() -> None:
    x = _signal(6.0, seed=11) * 0.05
    out, meas = normalise(x, MasterTarget(rate=RATE))
    assert meas["output_lufs"] == pytest.approx(-22.0, abs=0.3)
    assert not meas["peak_limited"]
    assert meas["loudness_shortfall_db"] == pytest.approx(0.0, abs=0.5)


def test_normalise_reports_shortfall_when_peaks_bind() -> None:
    """A high-crest signal hits the peak ceiling before the loudness target."""
    n = RATE * 5
    x = np.zeros((n, 2))
    x[:, 0] = 0.001
    x[:, 1] = 0.001
    # Sparse, very tall transients: low loudness, high peak.
    x[:: RATE // 4] = 0.98
    _, meas = normalise(x, MasterTarget(rate=RATE, integrated_lufs=-10.0))
    assert meas["peak_limited"]
    assert meas["loudness_shortfall_db"] > 0.5


def test_isolated_transient_does_not_ruin_the_whole_render() -> None:
    """A single mouth click must not drag an entire episode off its target.

    Close-mic intimate recording produces isolated 2 ms transients tens of dB above
    the surrounding whisper as a matter of routine. A whole-file gain trim landed
    such a render 5.8 LU below target and then reported two misleading QC failures
    about loudness and over-compression.
    """
    rng = np.random.default_rng(0)
    n = RATE * 20
    whisper = rng.standard_normal(n) * 0.01
    x = np.stack([whisper, np.roll(whisper, 17) * 0.5], axis=1)
    click = int(RATE * 6)
    x[click : click + int(RATE * 0.002)] = 0.8

    out, meas = normalise(x, MasterTarget(rate=RATE))
    assert meas["output_lufs"] == pytest.approx(-22.0, abs=0.3)
    assert meas["true_peak_dbtp"] <= -1.5 + 1e-6
    assert meas["peak_reduction_db"] > 5.0, "the click itself should have been reduced"


def test_clean_material_is_left_completely_alone() -> None:
    rng = np.random.default_rng(1)
    mono = rng.standard_normal(RATE * 5) * 0.01
    x = np.stack([mono, np.roll(mono, 13) * 0.5], axis=1)
    _, meas = normalise(x, MasterTarget(rate=RATE))
    assert meas["peak_reduction_db"] == pytest.approx(0.0, abs=1e-9)


def test_normalise_rejects_mismatched_rate() -> None:
    x = _signal(2.0)
    with pytest.raises(ValueError, match="resample first"):
        normalise(x, MasterTarget(rate=48000), rate=44100)


def test_normalise_removes_dc() -> None:
    x = _signal(3.0, seed=13) + 0.02
    out, _ = normalise(x, MasterTarget(rate=RATE))
    assert abs(float(np.mean(out))) < 1e-6


def test_normalise_rejects_silence() -> None:
    with pytest.raises(ValueError, match="silent"):
        normalise(np.zeros((RATE * 2, 2)), MasterTarget(rate=RATE))


# -- near-field model ------------------------------------------------------


def test_near_field_ild_is_zero_at_measurement_distance() -> None:
    """Nothing may be added at the distance the HRTF was measured at."""
    for az in (0.0, 30.0, 90.0, 150.0):
        assert near_field_ild_db(az, KEMAR_REFERENCE_DISTANCE_M) == pytest.approx(
            0.0, abs=1e-9
        )


def test_near_field_ild_is_zero_dead_ahead() -> None:
    for distance in (0.1, 0.2, 0.5, 1.0):
        assert near_field_ild_db(0.0, distance) == pytest.approx(0.0, abs=1e-9)


def test_near_field_ild_grows_as_source_approaches() -> None:
    values = [near_field_ild_db(90.0, d) for d in (1.0, 0.5, 0.3, 0.2, 0.15, 0.1)]
    assert values == sorted(values), "closer must mean larger ILD"
    assert values[-1] > 15.0, "at 10 cm the effect should be large"


def test_near_field_ild_is_antisymmetric() -> None:
    for az in (15.0, 45.0, 80.0):
        assert near_field_ild_db(az, 0.15) == pytest.approx(
            -near_field_ild_db(-az, 0.15), abs=1e-9
        )


def test_placement_rejects_sources_inside_the_head() -> None:
    with pytest.raises(HrtfError, match="head radius"):
        Placement(azimuth_deg=0.0, distance_m=HEAD_RADIUS_M * 0.5)


# -- beds ------------------------------------------------------------------


def test_room_tone_is_quiet_and_dc_free() -> None:
    bed = room_tone(duration_s=3.0, rate=RATE, level_db=-48.0, seed=2)
    assert np.max(np.abs(bed)) < 0.05
    assert abs(float(np.mean(bed))) < 1e-6


@pytest.mark.parametrize("level_db", [-60.0, -48.0, -36.0])
def test_room_tone_level_is_rms_and_reproducible(level_db: float) -> None:
    """`level_db` must mean what an operator thinks it means.

    Peak normalisation delivered roughly 8 dB below the stated level, varying with
    the noise's crest factor, so bed gain staging was neither predictable nor
    reproducible between seeds.
    """
    achieved = []
    for seed in (1, 2, 3, 4):
        bed = room_tone(duration_s=2.0, rate=RATE, level_db=level_db, seed=seed)
        achieved.append(20 * np.log10(float(np.sqrt(np.mean(bed**2)))))
    for value in achieved:
        assert value == pytest.approx(level_db, abs=0.2)
    assert max(achieved) - min(achieved) < 0.2, "level must not vary with seed"


def test_soundscape_is_partially_decorrelated() -> None:
    """Fully independent noise in each ear is fatiguing over long listens."""
    scape = drifting_soundscape(duration_s=6.0, rate=RATE, seed=4)
    correlation = np.corrcoef(scape[:, 0], scape[:, 1])[0, 1]
    assert 0.05 < correlation < 0.95


def test_soundscape_is_deterministic_for_a_seed() -> None:
    a = drifting_soundscape(duration_s=2.0, rate=RATE, seed=8)
    b = drifting_soundscape(duration_s=2.0, rate=RATE, seed=8)
    assert np.array_equal(a, b)

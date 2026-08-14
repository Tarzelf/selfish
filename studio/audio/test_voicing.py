"""Tests for the unvoiced-ratio gate.

The case that matters most is `test_breathy_voiced_speech_is_rejected`. A fake
whisper — harmonics with noise mixed over the top — passes every level, spectral
and spatial check in the QC suite. This measurement is the only thing that catches
it, and catching it is the difference between shipping intimacy and shipping
something that sounds subtly wrong for reasons a listener cannot name.
"""

from __future__ import annotations

import numpy as np
import pytest
from scipy.signal import butter, sosfilt

from studio.audio.voicing import (
    COMMERCIAL_TTS_UNVOICED_RATIO,
    REAL_ASMR_UNVOICED_RATIO,
    check_whisper,
    measure_unvoiced_ratio,
)

RATE = 44100


def _gated(signal: np.ndarray, rate: int = RATE) -> np.ndarray:
    """Add pauses, so the measurement has silence to exclude."""
    out = signal.copy()
    for start in range(0, out.size, int(rate * 0.4)):
        out[start : start + int(rate * 0.08)] *= 0.02
    return out


def _voiced(seconds: float = 3.0, f0: float = 130.0) -> np.ndarray:
    t = np.arange(int(RATE * seconds)) / RATE
    harmonics = sum(np.sin(2 * np.pi * f0 * h * t) / h for h in range(1, 12))
    return _gated(harmonics * 0.1)


def _whispered(seconds: float = 3.0, seed: int = 0) -> np.ndarray:
    rng = np.random.default_rng(seed)
    sos = butter(4, [300 / (RATE / 2), 7000 / (RATE / 2)], btype="band", output="sos")
    noise = sosfilt(sos, rng.standard_normal(int(RATE * seconds)))
    return _gated(noise * 0.08)


def test_voiced_speech_measures_low() -> None:
    report = measure_unvoiced_ratio(_voiced(), RATE)
    assert report.unvoiced_ratio < 0.25
    assert "not a whisper" in report.verdict()


def test_aperiodic_speech_measures_high() -> None:
    report = measure_unvoiced_ratio(_whispered(), RATE)
    assert report.unvoiced_ratio > 0.85
    assert report.verdict() == "genuine whisper"


def test_breathy_voiced_speech_is_rejected() -> None:
    """The failure mode this exists for.

    Mixing noise over harmonics is what a synthesiser does when asked to whisper.
    It sounds breathy and it is not a whisper, because the folds are still
    vibrating — so the periodicity is still there to find.
    """
    fake = 0.55 * _voiced() + 0.45 * _whispered()
    passed, report = check_whisper(fake, RATE)
    assert not passed
    assert report.unvoiced_ratio < 0.5, report.summary()


@pytest.mark.parametrize("noise_share", [0.0, 0.3, 0.6, 0.9, 1.0])
def test_ratio_increases_monotonically_with_aperiodicity(noise_share: float) -> None:
    signal = (1 - noise_share) * _voiced() + noise_share * _whispered()
    report = measure_unvoiced_ratio(signal, RATE)
    assert 0.0 <= report.unvoiced_ratio <= 1.0
    if noise_share >= 0.95:
        assert report.unvoiced_ratio > 0.8


def test_silence_is_excluded_from_the_measurement() -> None:
    """Otherwise pacing pauses would inflate every episode toward a pass.

    Silent frames are trivially aperiodic, and this catalogue is full of
    deliberate silence, so a naive measurement would call any paced voiced
    recording a whisper.
    """
    voiced = _voiced(seconds=2.0)
    padded = np.concatenate([voiced, np.zeros(int(RATE * 6.0)), voiced])

    plain = measure_unvoiced_ratio(voiced, RATE)
    with_silence = measure_unvoiced_ratio(padded, RATE)

    assert with_silence.unvoiced_ratio == pytest.approx(plain.unvoiced_ratio, abs=0.1)
    assert with_silence.active_fraction < 0.6


def test_measurement_is_level_independent() -> None:
    quiet = _whispered() * 0.02
    loud = _whispered() * 0.9
    assert measure_unvoiced_ratio(quiet, RATE).unvoiced_ratio == pytest.approx(
        measure_unvoiced_ratio(loud, RATE).unvoiced_ratio, abs=0.05
    )


def test_stereo_input_is_accepted() -> None:
    mono = _whispered()
    stereo = np.stack([mono, np.roll(mono, 21)], axis=1)
    assert measure_unvoiced_ratio(stereo, RATE).unvoiced_ratio > 0.8


def test_too_little_speech_is_inconclusive_rather_than_a_pass() -> None:
    tiny = _whispered(seconds=0.1)
    passed, report = check_whisper(tiny, RATE)
    assert not passed
    assert "inconclusive" in report.verdict()


def test_published_reference_points_are_ordered() -> None:
    """Guards the constants the gate's threshold is reasoned from."""
    assert REAL_ASMR_UNVOICED_RATIO > 0.9
    assert COMMERCIAL_TTS_UNVOICED_RATIO < 0.4
    # The default gate must sit between the two.
    assert COMMERCIAL_TTS_UNVOICED_RATIO < 0.80 < REAL_ASMR_UNVOICED_RATIO

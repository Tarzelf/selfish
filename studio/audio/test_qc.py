"""Tests for the QC gates.

Two properties matter more than the rest, and both are about a gate being useful
rather than merely present: it must not cry wolf, because a noisy gate gets
ignored and then misses the real thing; and it must not average away the very
defect it exists to catch.
"""

from __future__ import annotations

import numpy as np
import pytest

from studio.audio.master import MasterTarget, normalise
from studio.audio.qc import check_render, verify_transcript

RATE = 48000
LINE = (
    "Stay just like that. I am not going anywhere, and there is nothing you need "
    "to do right now except breathe out, slowly, and let your shoulders drop."
)
LONG_SCRIPT = (LINE + " ") * 20


def _dynamic_stereo(seconds: float, correlated: bool, seed: int = 0) -> np.ndarray:
    rng = np.random.default_rng(seed)
    n = int(RATE * seconds)
    env = np.interp(
        np.linspace(0, 1, n), [0, 0.2, 0.45, 0.7, 1.0], [0.04, 0.7, 0.08, 0.95, 0.15]
    )
    mono = rng.standard_normal(n) * env * 0.15
    if correlated:
        return np.stack([mono, mono], axis=1)
    return np.stack([mono, np.roll(mono, 23) * 0.45], axis=1)


# -- transcript verification ----------------------------------------------


def test_identical_transcript_passes() -> None:
    report = verify_transcript(LONG_SCRIPT, LONG_SCRIPT)
    assert report.passed
    assert report.measurements["word_error_rate"] == pytest.approx(0.0)
    assert report.measurements["worst_window_error_rate"] == pytest.approx(0.0)


def test_contractions_are_not_counted_as_errors() -> None:
    """Otherwise the gate rejects good renders over ASR spelling preferences."""
    heard = LONG_SCRIPT.replace("there is", "there's").replace("I am", "I'm")
    report = verify_transcript(LONG_SCRIPT, heard)
    assert report.passed, report.summary()
    assert report.measurements["word_error_rate"] < 0.01


def test_localised_mangle_is_caught_although_the_global_average_hides_it() -> None:
    """The whole point of the windowed scan.

    Fifteen consecutive words destroyed inside a 2,800-word episode is a small
    global error rate and an obvious, immersion-breaking defect to a listener.
    """
    words = LONG_SCRIPT.split()
    words[300:315] = ["the"] * 15
    report = verify_transcript(LONG_SCRIPT, " ".join(words))

    assert report.measurements["word_error_rate"] < 0.05, "global rate would pass"
    assert report.measurements["worst_window_error_rate"] > 0.20
    assert not report.passed
    # The error should be localised near where it was introduced.
    assert 200 <= report.measurements["worst_window_start_word"] <= 320


def test_repeated_phrasing_does_not_hide_a_mangle() -> None:
    """This genre repeats endearments and refrains, so alignment must stay local.

    With a free-roaming per-window search, a destroyed passage was scored clean
    because an identical passage sat nearby and matched instead.
    """
    words = LONG_SCRIPT.split()
    words[100:160] = ["um"] * 60
    report = verify_transcript(LONG_SCRIPT, " ".join(words))
    assert report.measurements["worst_window_error_rate"] > 0.5
    assert not report.passed


def test_a_single_dropped_word_is_tolerated() -> None:
    words = LONG_SCRIPT.split()
    del words[150]
    report = verify_transcript(LONG_SCRIPT, " ".join(words))
    assert report.passed, report.summary()


def test_empty_reference_fails() -> None:
    assert not verify_transcript("", "anything").passed


# -- spatial and silence gates --------------------------------------------


def test_centred_render_is_not_reported_as_collapsed() -> None:
    """A genuinely centred voice has correlation 1.0 and that is correct."""
    centred = _dynamic_stereo(6.0, correlated=True)
    mastered, _ = normalise(centred, MasterTarget(rate=RATE))

    honest = check_render(
        mastered, RATE, MasterTarget(rate=RATE), expect_binaural=True, expect_lateral=False
    )
    assert not any("collapsed" in f for f in honest.failures), honest.summary()

    misdeclared = check_render(
        mastered, RATE, MasterTarget(rate=RATE), expect_binaural=True, expect_lateral=True
    )
    assert any("collapsed" in f for f in misdeclared.failures)


def test_lateral_render_that_collapsed_is_still_caught() -> None:
    collapsed = _dynamic_stereo(6.0, correlated=True)
    mastered, _ = normalise(collapsed, MasterTarget(rate=RATE))
    report = check_render(
        mastered, RATE, MasterTarget(rate=RATE), expect_binaural=True, expect_lateral=True
    )
    assert any("collapsed" in f for f in report.failures)


def test_deliberate_pauses_are_not_flagged_as_dropped_lines() -> None:
    """A slow-burn arc creates long silences on purpose."""
    speech = _dynamic_stereo(4.0, correlated=False, seed=5)
    gap = np.zeros((int(RATE * 2.4), 2))
    episode = np.concatenate([speech, gap, speech], axis=0)
    mastered, _ = normalise(episode, MasterTarget(rate=RATE))

    naive = check_render(mastered, RATE, MasterTarget(rate=RATE), expect_lateral=True)
    informed = check_render(
        mastered,
        RATE,
        MasterTarget(rate=RATE),
        expect_lateral=True,
        max_expected_silence_s=2.5,
    )
    assert any("silence" in w for w in naive.warnings), naive.summary()
    assert not any("silence" in w for w in informed.warnings), informed.summary()
    assert not any("silence" in f for f in informed.failures), informed.summary()


def test_genuinely_missing_line_is_still_caught() -> None:
    speech = _dynamic_stereo(4.0, correlated=False, seed=6)
    gap = np.zeros((int(RATE * 9.0), 2))
    episode = np.concatenate([speech, gap, speech], axis=0)
    mastered, _ = normalise(episode, MasterTarget(rate=RATE))
    report = check_render(
        mastered,
        RATE,
        MasterTarget(rate=RATE),
        expect_lateral=True,
        max_expected_silence_s=2.5,
    )
    assert any("silence" in f for f in report.failures)


def test_hf_ratio_uses_the_whole_file_not_just_the_opening() -> None:
    """The opening is the quietest, most whispered part of an intimate episode."""
    rng = np.random.default_rng(3)
    n = RATE * 20
    # Dull first half, detailed second half.
    dull = rng.standard_normal(n // 2) * 0.05
    from scipy.signal import butter, sosfilt

    sos = butter(4, 3000 / (RATE / 2), btype="lowpass", output="sos")
    dull = sosfilt(sos, dull)
    bright = rng.standard_normal(n // 2) * 0.05
    mono = np.concatenate([dull, bright])
    x = np.stack([mono, np.roll(mono, 19) * 0.5], axis=1)

    report = check_render(x, RATE, MasterTarget(rate=RATE), expect_lateral=True)
    # If only the first 30 s were measured this would look almost entirely dull.
    assert report.measurements["hf_energy_ratio_above_8k"] > 0.05

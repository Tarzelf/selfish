"""Automated quality control for rendered episodes.

A studio that produces audio faster than humans can listen to it needs machine
listening in the loop, otherwise the volume advantage is spent on re-listening.
These checks catch the failures that are both common and immersion-breaking:

- levels that are wrong, clipped, or flattened by over-compression
- a binaural render that silently collapsed to mono (a real risk: one bad
  parameter and the entire spatial signature disappears, while the file still
  sounds fine in isolation)
- the tingle band being missing or dull
- dead air from a TTS engine dropping a line

The script-versus-audio check lives in `verify_transcript` and is the most
valuable of them: an ASR pass over the render, diffed against the source text,
catches dropped and mispronounced words — synthetic speech's most frequent and
most jarring failure — without a human hearing every minute.
"""

from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np
import pyloudnorm as pyln

from .master import MasterTarget, mono_compatibility_db, true_peak_dbtp


@dataclass
class QcReport:
    passed: bool = True
    measurements: dict = field(default_factory=dict)
    failures: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

    def fail(self, msg: str) -> None:
        self.passed = False
        self.failures.append(msg)

    def warn(self, msg: str) -> None:
        self.warnings.append(msg)

    def summary(self) -> str:
        status = "PASS" if self.passed else "FAIL"
        lines = [f"[{status}]"]
        for k, v in self.measurements.items():
            lines.append(f"  {k}: {v:.2f}" if isinstance(v, float) else f"  {k}: {v}")
        for f in self.failures:
            lines.append(f"  FAIL {f}")
        for w in self.warnings:
            lines.append(f"  WARN {w}")
        return "\n".join(lines)


def _loudness_range(stereo: np.ndarray, rate: int) -> float:
    """Short-term loudness range (rough EBU LRA: 95th minus 10th percentile)."""
    meter = pyln.Meter(rate)
    win = int(rate * 3.0)
    hop = int(rate * 1.0)
    if stereo.shape[0] < win:
        return 0.0
    values = []
    for start in range(0, stereo.shape[0] - win, hop):
        block = stereo[start : start + win]
        loud = meter.integrated_loudness(block)
        if np.isfinite(loud) and loud > -70.0:
            values.append(loud)
    if len(values) < 3:
        return 0.0
    return float(np.percentile(values, 95) - np.percentile(values, 10))


def _longest_silence_s(stereo: np.ndarray, rate: int, floor_db: float = -60.0) -> float:
    mono = stereo.mean(axis=1)
    hop = max(1, rate // 100)
    n = mono.size // hop
    if n == 0:
        return 0.0
    frames = mono[: n * hop].reshape(n, hop)
    rms_db = 20.0 * np.log10(np.sqrt(np.mean(frames**2, axis=1)) + 1e-12)
    quiet = rms_db < floor_db

    longest = current = 0
    for q in quiet:
        current = current + 1 if q else 0
        longest = max(longest, current)
    return longest * hop / rate


def _stereo_correlation(stereo: np.ndarray) -> float:
    left, right = stereo[:, 0], stereo[:, 1]
    if np.std(left) < 1e-9 or np.std(right) < 1e-9:
        return 1.0
    return float(np.corrcoef(left, right)[0, 1])


def _average_spectrum(stereo: np.ndarray, rate: int) -> tuple[np.ndarray, np.ndarray]:
    """Welch-style average spectrum across the whole file.

    Averaged rather than measured on the opening, because the first thirty seconds
    of an intimate episode are typically its quietest and most whispered passage —
    the least representative part of the render.
    """
    mono = stereo.mean(axis=1)
    if mono.size == 0:
        return np.zeros(1), np.zeros(1)

    segment = min(mono.size, rate * 4)
    window = np.hanning(segment)
    freqs = np.fft.rfftfreq(segment, 1.0 / rate)

    accumulated = np.zeros(freqs.size)
    blocks = 0
    for start in range(0, mono.size - segment + 1, segment):
        accumulated += np.abs(np.fft.rfft(mono[start : start + segment] * window)) ** 2
        blocks += 1
    if blocks == 0:
        padded = np.zeros(segment)
        padded[: mono.size] = mono[:segment]
        accumulated = np.abs(np.fft.rfft(padded * window)) ** 2
    return freqs, accumulated


def _hf_energy_ratio(stereo: np.ndarray, rate: int, split_hz: float = 8000.0) -> float:
    """Fraction of spectral energy above `split_hz`. Reported, not gated."""
    freqs, spectrum = _average_spectrum(stereo, rate)
    total = spectrum.sum()
    if total <= 0:
        return 0.0
    return float(spectrum[freqs >= split_hz].sum() / total)


def _bandwidth_hz(stereo: np.ndarray, rate: int, energy_fraction: float = 0.999) -> float:
    """Frequency below which `energy_fraction` of the spectral energy sits.

    This is the measurement that actually matters, and it is not the same as
    brightness. Whether a mix *emphasises* high frequencies is an aesthetic choice
    the evidence argues against; whether the high band is *present at all* is a
    defect question, because a 24 kHz TTS source or an over-compressed encode
    imposes a hard ceiling that no later processing can undo.
    """
    freqs, spectrum = _average_spectrum(stereo, rate)
    total = spectrum.sum()
    if total <= 0:
        return 0.0
    cumulative = np.cumsum(spectrum) / total
    index = int(np.searchsorted(cumulative, energy_fraction))
    return float(freqs[min(index, freqs.size - 1)])


def check_render(
    stereo: np.ndarray,
    rate: int,
    target: MasterTarget | None = None,
    expect_binaural: bool = True,
    max_expected_silence_s: float = 1.5,
    expect_lateral: bool = True,
) -> QcReport:
    """Inspect a finished render.

    `max_expected_silence_s` must be supplied by the assembler when a pacing arc
    creates deliberately long pauses. Without it this check flags every slow-burn
    episode as having a dropped line, and a gate that cries wolf gets ignored —
    which would cost us the genuinely missing lines it exists to catch.

    `expect_lateral` must be cleared for renders placed dead ahead. A genuinely
    centred source produces channel correlation of exactly 1.0, which is
    indistinguishable by this measure from a binaural render that collapsed — so
    the caller, which knows the placement, has to say which it is.
    """
    target = target or MasterTarget(rate=rate)
    report = QcReport()

    if stereo.ndim != 2 or stereo.shape[1] != 2:
        report.fail("render is not stereo")
        return report

    meter = pyln.Meter(rate)
    lufs = meter.integrated_loudness(stereo)
    tp = true_peak_dbtp(stereo, rate)
    lra = _loudness_range(stereo, rate)
    silence = _longest_silence_s(stereo, rate)
    corr = _stereo_correlation(stereo)
    hf = _hf_energy_ratio(stereo, rate)
    bandwidth = _bandwidth_hz(stereo, rate)
    clipped = int(np.sum(np.abs(stereo) >= 0.999))
    dc = float(np.mean(stereo))
    mono_fold = mono_compatibility_db(stereo)

    report.measurements = {
        "duration_s": stereo.shape[0] / rate,
        "integrated_lufs": float(lufs),
        "true_peak_dbtp": float(tp),
        "loudness_range_lu": float(lra),
        "longest_silence_s": float(silence),
        "stereo_correlation": float(corr),
        "mono_fold_db": float(mono_fold),
        "hf_energy_ratio_above_8k": float(hf),
        "bandwidth_hz": float(bandwidth),
        "clipped_samples": clipped,
        "dc_offset": dc,
    }

    if not np.isfinite(lufs):
        report.fail("loudness unmeasurable (silent render?)")
    elif abs(lufs - target.integrated_lufs) > 1.0:
        report.fail(
            f"integrated loudness {lufs:.1f} LUFS is off target "
            f"{target.integrated_lufs:.1f} by more than 1 LU"
        )

    if tp > target.true_peak_dbtp + 0.1:
        report.fail(f"true peak {tp:.2f} dBTP exceeds ceiling {target.true_peak_dbtp}")
    if clipped > 0:
        report.fail(f"{clipped} clipped samples")
    if abs(dc) > 1e-3:
        report.warn(f"DC offset {dc:.5f}")

    if lra < target.min_loudness_range:
        report.fail(
            f"loudness range {lra:.1f} LU is below {target.min_loudness_range} LU — "
            "either the performance is monotone or the chain over-compressed it"
        )

    silence_fail_at = max(3.0, max_expected_silence_s * 2.0)
    if silence > silence_fail_at:
        report.fail(
            f"{silence:.1f}s of continuous near-silence exceeds twice the longest "
            f"expected pause ({max_expected_silence_s:.1f}s) — a line may be missing"
        )
    elif silence > max_expected_silence_s:
        report.warn(f"{silence:.1f}s of near-silence")

    if expect_binaural and expect_lateral and corr > 0.98:
        report.fail(
            f"channel correlation {corr:.3f} — the binaural image has collapsed to mono"
        )
    elif expect_binaural and not expect_lateral and corr > 0.98:
        report.warn(
            f"channel correlation {corr:.3f}, consistent with the declared centred "
            "placement; spatial collapse cannot be detected for centred renders"
        )

    if not expect_binaural and mono_fold < -3.0:
        # A master intended for speakers must survive being summed.
        report.fail(
            f"summing to mono loses {abs(mono_fold):.1f} dB — this master will sound "
            "hollow on a phone speaker"
        )

    # Bandwidth, not brightness. A quiet high band is a legitimate aesthetic
    # choice; a missing one means the source or the encode threw it away.
    if rate >= 44100 and bandwidth < 12000.0:
        report.fail(
            f"spectral content stops at {bandwidth / 1000:.1f} kHz — the source is "
            "probably 24 kHz or the encode is too lossy; no later processing "
            "recovers a band that was never captured"
        )
    elif rate >= 44100 and bandwidth < 15000.0:
        report.warn(f"spectral content stops at {bandwidth / 1000:.1f} kHz")

    return report


_CONTRACTIONS = {
    "i'm": "i am", "im": "i am",
    "you're": "you are", "youre": "you are",
    "we're": "we are", "they're": "they are",
    "it's": "it is", "its": "it is",
    "that's": "that is", "thats": "that is",
    "there's": "there is", "theres": "there is",
    "here's": "here is", "what's": "what is",
    "let's": "let us", "lets": "let us",
    "don't": "do not", "dont": "do not",
    "doesn't": "does not", "didn't": "did not",
    "won't": "will not", "wouldn't": "would not",
    "can't": "can not", "cant": "can not", "cannot": "can not",
    "couldn't": "could not", "shouldn't": "should not",
    "isn't": "is not", "aren't": "are not",
    "wasn't": "was not", "weren't": "were not",
    "haven't": "have not", "hasn't": "has not", "hadn't": "had not",
    "i'll": "i will", "you'll": "you will", "we'll": "we will",
    "i've": "i have", "you've": "you have", "we've": "we have",
    "i'd": "i would", "you'd": "you would",
    "nothin": "nothing", "somethin": "something", "goin": "going",
    "gonna": "going to", "wanna": "want to", "kinda": "kind of",
    "gotta": "got to", "ya": "you", "yeah": "yes", "yep": "yes",
    "ok": "okay",
}

_NUMBERS = {
    "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four",
    "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
    "10": "ten",
}


def _normalise_for_alignment(text: str) -> list[str]:
    """Normalise so that trivial ASR spelling choices are not counted as errors.

    Without contraction expansion, an ASR system writing "there's" where the
    script says "there is" registers as an error. Measured on a real example, two
    such differences in a 28-word passage produced a 14.3% word error rate and
    failed a 5% gate — so the gate as originally written would have rejected good
    renders while a genuinely mangled one slipped past.
    """
    lowered = text.lower().replace("’", "'")
    kept = "".join(c if (c.isalnum() or c.isspace() or c == "'") else " " for c in lowered)

    words: list[str] = []
    for token in kept.split():
        token = token.strip("'")
        expanded = _CONTRACTIONS.get(token, _NUMBERS.get(token, token))
        words.extend(expanded.split())
    return words


def _levenshtein(ref: list[str], hyp: list[str]) -> int:
    prev = list(range(len(hyp) + 1))
    for i, r in enumerate(ref, start=1):
        cur = [i] + [0] * len(hyp)
        for j, h in enumerate(hyp, start=1):
            cur[j] = min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (0 if r == h else 1))
        prev = cur
    return prev[len(hyp)]


def _errors_per_reference_word(
    ref: list[str], hyp: list[str], band: int | None = None
) -> list[float]:
    """Align once, globally, and attribute each error to a reference position.

    Windowed error rates need to know *where* the errors are, and two simpler
    approaches both failed:

    - Comparing each reference window against a wide hypothesis span charges for
      every hypothesis word outside the window, scoring a perfect window at 100%.
    - Letting each window match the best substring anywhere nearby lets repeated
      phrasing match the wrong copy — and this genre repeats endearments and
      refrains constantly, so a mangled passage was found "clean" because an
      identical passage sat 50 words away.

    A single banded global alignment fixes both: errors are attributed to actual
    positions, and the band prevents matching a distant duplicate.
    """
    n, m = len(ref), len(hyp)
    if n == 0:
        return []
    if m == 0:
        return [1.0] * n

    if band is None:
        band = max(64, abs(n - m) + 64)

    inf = float("inf")
    # cost[j] over the banded window, plus backpointers for traceback.
    cost = [[inf] * (m + 1) for _ in range(n + 1)]
    back = [[0] * (m + 1) for _ in range(n + 1)]
    cost[0][0] = 0
    for j in range(1, min(m, band) + 1):
        cost[0][j] = j
        back[0][j] = 2  # insertion
    for i in range(1, n + 1):
        lo = max(1, i - band)
        hi = min(m, i + band)
        if lo == 1:
            cost[i][0] = i
            back[i][0] = 1  # deletion
        for j in range(lo, hi + 1):
            sub = cost[i - 1][j - 1] + (0 if ref[i - 1] == hyp[j - 1] else 1)
            dele = cost[i - 1][j] + 1
            ins = cost[i][j - 1] + 1
            best = min(sub, dele, ins)
            cost[i][j] = best
            back[i][j] = 0 if best == sub else (1 if best == dele else 2)

    errors = [0.0] * n
    i, j = n, m
    while i > 0 or j > 0:
        if i > 0 and j > 0 and cost[i][j] != inf and back[i][j] == 0:
            if ref[i - 1] != hyp[j - 1]:
                errors[i - 1] += 1.0
            i, j = i - 1, j - 1
        elif i > 0 and (j == 0 or back[i][j] == 1 or cost[i][j] == inf):
            errors[i - 1] += 1.0
            i -= 1
        else:
            # Insertion: charge it to the neighbouring reference word.
            if i > 0:
                errors[i - 1] += 1.0
            j -= 1
    return errors


def verify_transcript(
    reference_text: str,
    heard_text: str,
    max_word_error_rate: float = 0.05,
    window_words: int = 50,
    max_window_error_rate: float = 0.20,
) -> QcReport:
    """Compare an ASR transcript of the render against the source script.

    This is the highest-leverage check available, because a dropped or mangled word
    is synthetic narration's most frequent and most immersion-breaking defect and
    it is invisible to every acoustic measurement.

    Two rates are reported, and the windowed one is the important one. A whole-file
    average hides exactly what we are hunting: one catastrophically garbled
    sentence inside a 2,600-word episode is about 0.4% overall error and would sail
    through any global threshold, while being the single thing a listener would
    notice. So the file is also scanned in windows and judged on its **worst**
    window.
    """
    report = QcReport()

    ref = _normalise_for_alignment(reference_text)
    hyp = _normalise_for_alignment(heard_text)

    if not ref:
        report.fail("empty reference text")
        return report

    overall = _levenshtein(ref, hyp) / len(ref)

    per_word = _errors_per_reference_word(ref, hyp)
    worst_rate = 0.0
    worst_at = 0
    if len(ref) > window_words:
        step = max(1, window_words // 2)
        for start in range(0, len(ref) - window_words + 1, step):
            rate = min(1.0, sum(per_word[start : start + window_words]) / window_words)
            if rate > worst_rate:
                worst_rate, worst_at = rate, start
    else:
        worst_rate = overall

    report.measurements = {
        "word_error_rate": float(overall),
        "worst_window_error_rate": float(worst_rate),
        "worst_window_start_word": worst_at,
        "reference_words": len(ref),
        "heard_words": len(hyp),
    }

    if overall > max_word_error_rate:
        report.fail(f"word error rate {overall:.1%} exceeds {max_word_error_rate:.1%}")
    if worst_rate > max_window_error_rate:
        report.fail(
            f"worst {window_words}-word window at word {worst_at} has "
            f"{worst_rate:.1%} error, exceeding {max_window_error_rate:.1%} — "
            "a localised mangle a listener would notice"
        )
    return report

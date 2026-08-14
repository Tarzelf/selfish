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


def _hf_energy_ratio(stereo: np.ndarray, rate: int, split_hz: float = 8000.0) -> float:
    """Fraction of spectral energy above `split_hz` — a proxy for ASMR detail."""
    mono = stereo.mean(axis=1)
    n = min(mono.size, rate * 30)
    spectrum = np.abs(np.fft.rfft(mono[:n] * np.hanning(n))) ** 2
    freqs = np.fft.rfftfreq(n, 1.0 / rate)
    total = spectrum.sum()
    if total <= 0:
        return 0.0
    return float(spectrum[freqs >= split_hz].sum() / total)


def check_render(
    stereo: np.ndarray,
    rate: int,
    target: MasterTarget | None = None,
    expect_binaural: bool = True,
    max_expected_silence_s: float = 1.5,
) -> QcReport:
    """Inspect a finished render.

    `max_expected_silence_s` must be supplied by the assembler when a pacing arc
    creates deliberately long pauses. Without it this check flags every slow-burn
    episode as having a dropped line, and a gate that cries wolf gets ignored —
    which would cost us the genuinely missing lines it exists to catch.
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

    if expect_binaural and corr > 0.98:
        report.fail(
            f"channel correlation {corr:.3f} — the binaural image has collapsed to mono"
        )

    if not expect_binaural and mono_fold < -3.0:
        # A master intended for speakers must survive being summed.
        report.fail(
            f"summing to mono loses {abs(mono_fold):.1f} dB — this master will sound "
            "hollow on a phone speaker"
        )

    if hf < 0.002:
        report.warn(
            f"only {hf * 100:.2f}% of energy above 8 kHz — render may lack ASMR detail"
        )

    return report


def verify_transcript(
    reference_text: str,
    heard_text: str,
    max_word_error_rate: float = 0.05,
) -> QcReport:
    """Compare an ASR transcript of the render against the source script.

    Catches the failure mode that matters most in synthetic narration: a word
    silently dropped or mangled. Word error rate is computed with Levenshtein
    distance over normalised word sequences.
    """
    report = QcReport()

    def normalise(text: str) -> list[str]:
        cleaned = "".join(c.lower() if c.isalnum() or c.isspace() else " " for c in text)
        return cleaned.split()

    ref = normalise(reference_text)
    hyp = normalise(heard_text)

    if not ref:
        report.fail("empty reference text")
        return report

    # Levenshtein over word lists, two-row rolling implementation.
    prev = list(range(len(hyp) + 1))
    for i, r in enumerate(ref, start=1):
        cur = [i] + [0] * len(hyp)
        for j, h in enumerate(hyp, start=1):
            cur[j] = min(
                prev[j] + 1,
                cur[j - 1] + 1,
                prev[j - 1] + (0 if r == h else 1),
            )
        prev = cur

    wer = prev[len(hyp)] / len(ref)
    report.measurements = {
        "word_error_rate": float(wer),
        "reference_words": len(ref),
        "heard_words": len(hyp),
    }
    if wer > max_word_error_rate:
        report.fail(f"word error rate {wer:.1%} exceeds {max_word_error_rate:.1%}")
    return report

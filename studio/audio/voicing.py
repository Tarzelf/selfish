"""Unvoiced-ratio measurement — the acceptance test for whispered narration.

A whisper is not quiet speech. It is *aperiodic* speech: the vocal folds do not
vibrate, and the sound is turbulent noise shaped by the vocal tract. That
distinction is the whole physical basis of the product, and it is measurable.

Published measurement of the Global Unvoiced Ratio — the share of active speech
frames with no detectable fundamental frequency — separates real from synthetic
whispering decisively:

    real ASMR performers      91.8%
    best commercial TTS       35.4%
    weaker commercial TTS     25.5%

So when a text-to-speech engine is asked to whisper, what comes back is soft
*voiced* speech. It sounds subtly wrong not because the model needs a better
prompt but because the physics of the thing that produces tingles is absent.

Having this as a number rather than an opinion is worth a great deal:

- it is the acceptance gate for any voice source, human or synthetic, before a
  performer is booked or a vendor is paid;
- it lets a director give feedback on a take that is objective rather than
  "breathier, please";
- and it catches the failure that no other measurement in the QC suite can see,
  because a fully voiced fake whisper passes every level, spectral and spatial
  check we have.

The voicing decision here uses normalised autocorrelation rather than a full
pitch tracker. Detecting *whether* a frame is periodic is a much easier problem
than estimating what its pitch is, and this keeps the dependency footprint to
numpy and scipy.
"""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
from scipy.signal import butter, sosfilt

# Human phonation range, generously bounded. Below and above this, a periodicity
# peak is more likely to be rumble or a formant artefact than a fundamental.
MIN_F0_HZ = 65.0
MAX_F0_HZ = 400.0

# Reference points from the published measurements above.
REAL_ASMR_UNVOICED_RATIO = 0.918
COMMERCIAL_TTS_UNVOICED_RATIO = 0.354


@dataclass
class VoicingReport:
    unvoiced_ratio: float
    active_frames: int
    total_frames: int
    mean_periodicity: float

    @property
    def active_fraction(self) -> float:
        return self.active_frames / self.total_frames if self.total_frames else 0.0

    def verdict(self, threshold: float = 0.80) -> str:
        if self.active_frames < 20:
            return "inconclusive — too little active speech to judge"
        if self.unvoiced_ratio >= threshold:
            return "genuine whisper"
        if self.unvoiced_ratio >= 0.55:
            return "partly whispered — breathy voiced speech in places"
        return "voiced speech, not a whisper"

    def summary(self, threshold: float = 0.80) -> str:
        return "\n".join(
            [
                f"unvoiced ratio: {self.unvoiced_ratio:.3f}  ({self.verdict(threshold)})",
                f"  reference: real ASMR {REAL_ASMR_UNVOICED_RATIO:.3f}, "
                f"commercial TTS {COMMERCIAL_TTS_UNVOICED_RATIO:.3f}",
                f"  active frames: {self.active_frames} of {self.total_frames} "
                f"({self.active_fraction:.0%})",
                f"  mean periodicity of active frames: {self.mean_periodicity:.3f}",
            ]
        )


def _frame(x: np.ndarray, frame_len: int, hop: int) -> np.ndarray:
    if x.size < frame_len:
        return np.empty((0, frame_len))
    count = 1 + (x.size - frame_len) // hop
    indices = np.arange(frame_len)[None, :] + hop * np.arange(count)[:, None]
    return x[indices]


def _periodicity(frames: np.ndarray, rate: int) -> np.ndarray:
    """Peak normalised autocorrelation within the plausible F0 range, per frame."""
    if frames.size == 0:
        return np.empty(0)

    min_lag = max(1, int(rate / MAX_F0_HZ))
    max_lag = min(frames.shape[1] - 1, int(rate / MIN_F0_HZ))
    if max_lag <= min_lag:
        return np.zeros(frames.shape[0])

    centred = frames - frames.mean(axis=1, keepdims=True)
    # Autocorrelation via FFT, zero-padded to avoid circular wrap.
    size = 1
    while size < 2 * frames.shape[1]:
        size *= 2
    spectrum = np.fft.rfft(centred, n=size, axis=1)
    autocorr = np.fft.irfft(spectrum * np.conj(spectrum), n=size, axis=1)

    zero_lag = autocorr[:, 0:1]
    zero_lag = np.where(zero_lag <= 0, 1e-12, zero_lag)
    normalised = autocorr[:, min_lag : max_lag + 1] / zero_lag
    return np.max(normalised, axis=1)


def measure_unvoiced_ratio(
    audio: np.ndarray,
    rate: int,
    frame_ms: float = 40.0,
    hop_ms: float = 10.0,
    active_floor_db: float = -45.0,
    periodicity_threshold: float = 0.40,
) -> VoicingReport:
    """Measure the share of active speech frames that carry no periodicity.

    `active_floor_db` is relative to the loudest frame, so the measurement is
    level-independent. Silence must be excluded: silent frames are trivially
    aperiodic and would inflate the ratio toward 1.0 for any recording with pauses
    — which, given the pacing this product uses, would be all of them.
    """
    audio = np.asarray(audio, dtype=np.float64)
    if audio.ndim == 2:
        audio = audio.mean(axis=1)

    # Remove rumble, which otherwise supplies spurious low-frequency periodicity.
    sos = butter(2, 60.0 / (rate / 2.0), btype="highpass", output="sos")
    audio = sosfilt(sos, audio)

    frame_len = max(64, int(rate * frame_ms / 1000.0))
    hop = max(1, int(rate * hop_ms / 1000.0))
    frames = _frame(audio, frame_len, hop)
    if frames.shape[0] == 0:
        return VoicingReport(0.0, 0, 0, 0.0)

    rms = np.sqrt(np.mean(frames**2, axis=1) + 1e-18)
    rms_db = 20.0 * np.log10(rms)
    active = rms_db > (rms_db.max() + active_floor_db)

    if not np.any(active):
        return VoicingReport(0.0, 0, int(frames.shape[0]), 0.0)

    periodicity = _periodicity(frames[active], rate)
    unvoiced = periodicity < periodicity_threshold

    return VoicingReport(
        unvoiced_ratio=float(np.mean(unvoiced)),
        active_frames=int(active.sum()),
        total_frames=int(frames.shape[0]),
        mean_periodicity=float(np.mean(periodicity)),
    )


def check_whisper(
    audio: np.ndarray,
    rate: int,
    min_unvoiced_ratio: float = 0.80,
) -> tuple[bool, VoicingReport]:
    """Gate a take intended as a whisper.

    The default threshold sits between the published figures — comfortably above
    what any commercial synthesiser has been measured to produce, and below the
    real-performer figure so that a good take is not rejected for being slightly
    less breathy than a studio ASMR reference.
    """
    report = measure_unvoiced_ratio(audio, rate)
    passed = report.active_frames >= 20 and report.unvoiced_ratio >= min_unvoiced_ratio
    return passed, report

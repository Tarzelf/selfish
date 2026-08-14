"""Voice post-production for intimate, ASMR-grade narration.

TTS output is dry, flat, and mixed like a podcast: even, mid-forward, and
slightly brittle. Everything that makes intimate audio feel physical — breath,
warmth, the fine high-frequency detail that carries tingles — is either absent
or actively worked against by conventional speech processing.

Two rules drive the choices here, and both run against normal practice:

1. **Do not de-ess hard.** The 5-9 kHz band that a de-esser attacks is the same
   band that carries ASMR's tingle content. Standard broadcast de-essing
   flattens the very detail the product is selling. We reduce only the worst
   peaks, gently.

2. **Do not compress hard.** Intimate delivery *is* its dynamic range: the drop
   to a near-silent whisper only reads as intimate if it is genuinely quieter.
   Levelling a whisper up to conversational loudness destroys the effect.

Every stage is deterministic and parameterised so a render is reproducible from
a version-controlled preset.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field, replace

import numpy as np
from scipy.signal import bilinear, butter, sosfilt


@dataclass(frozen=True)
class PeakingEq:
    freq_hz: float
    gain_db: float
    q: float = 0.7


@dataclass(frozen=True)
class VoicePreset:
    """A full chain configuration.

    Defaults are the "intimate whisper" starting point: warm, close, detailed,
    and barely compressed.
    """

    highpass_hz: float = 75.0

    # TONAL SHAPING — and note that this reverses the usual advice.
    #
    # Mixing tutorials for ASMR almost universally say to brighten: boost presence
    # and add an air shelf, on the theory that tingles live in 4-16 kHz sibilance.
    # The published evidence points the other way. Barratt (2017) found listeners
    # preferred lower-pitched ASMR 56% to 12%; Kondo (2019) found ASMR-effective
    # material sits below a 1.5 kHz spectral centroid; and Terashima (2024) found
    # *lower* 5 kHz envelope amplitude predicted *stronger* tingling (r = 0.52).
    #
    # So the defaults are warm, with a small cut where close speech turns harsh,
    # rather than bright. Crucially this is not the same as throwing away high
    # frequencies: bandwidth is still preserved end to end (QC checks for that),
    # because losing the band and choosing not to emphasise it are different acts.
    #
    # This contradicts prevailing practice, so `bright()` keeps the conventional
    # curve available for a listening test rather than settling it by assertion.
    low_shelf_db: float = 2.5
    low_shelf_hz: float = 180.0
    air_shelf_db: float = 0.0
    air_shelf_hz: float = 9000.0
    peaking: tuple[PeakingEq, ...] = (
        PeakingEq(freq_hz=430.0, gain_db=-1.5, q=0.9),
        PeakingEq(freq_hz=3200.0, gain_db=-2.0, q=0.8),
    )

    deess_band_hz: tuple[float, float] = (5200.0, 9500.0)
    deess_threshold_db: float = -26.0
    deess_ratio: float = 2.0
    deess_max_reduction_db: float = 4.0

    comp_threshold_db: float = -28.0
    comp_ratio: float = 2.0
    comp_attack_ms: float = 15.0
    comp_release_ms: float = 140.0
    comp_knee_db: float = 6.0
    comp_makeup_db: float = 0.0

    saturation_drive: float = 0.12

    breath_gain_db: float = 1.5
    breath_detect_zcr: float = 0.18
    breath_detect_max_rms_db: float = -34.0

    def whisper(self) -> "VoicePreset":
        """Even lighter touch, for content that is whispered throughout."""
        return replace(
            self,
            low_shelf_db=1.5,
            air_shelf_db=0.0,
            comp_ratio=1.6,
            comp_threshold_db=-32.0,
            deess_max_reduction_db=3.0,
            breath_gain_db=2.5,
            saturation_drive=0.08,
        )

    def bright(self) -> "VoicePreset":
        """The conventional 'brighten it' curve, kept for comparison.

        This is what most ASMR mixing guidance prescribes and what the evidence
        cited above argues against. It exists so the question can be settled by a
        listening test with real voices rather than by whichever source we read
        last — the studies are on non-speech triggers and small samples, and the
        practitioners are numerous but uncontrolled.
        """
        return replace(
            self,
            low_shelf_db=2.0,
            air_shelf_db=2.5,
            peaking=(
                PeakingEq(freq_hz=430.0, gain_db=-1.5, q=0.9),
                PeakingEq(freq_hz=3400.0, gain_db=1.5, q=0.8),
            ),
        )


def _db_to_lin(db: float) -> float:
    return 10.0 ** (db / 20.0)


def _highpass(x: np.ndarray, cutoff_hz: float, rate: int) -> np.ndarray:
    sos = butter(2, cutoff_hz / (rate / 2.0), btype="highpass", output="sos")
    return sosfilt(sos, x)


def _shelf(
    x: np.ndarray, gain_db: float, cutoff_hz: float, rate: int, kind: str
) -> np.ndarray:
    if abs(gain_db) < 1e-9:
        return x
    a_lin = _db_to_lin(gain_db)
    w = 2.0 * math.pi * cutoff_hz
    if kind == "low":
        b, a = bilinear([1.0, a_lin * w], [1.0, w], fs=rate)
    elif kind == "high":
        b, a = bilinear([a_lin, w], [1.0, w], fs=rate)
    else:  # pragma: no cover - guarded by callers
        raise ValueError(kind)
    from scipy.signal import lfilter

    return lfilter(b, a, x)


def _peaking(x: np.ndarray, eq: PeakingEq, rate: int) -> np.ndarray:
    if abs(eq.gain_db) < 1e-9:
        return x
    # Standard RBJ peaking biquad.
    a_lin = _db_to_lin(eq.gain_db / 2.0)
    w0 = 2.0 * math.pi * eq.freq_hz / rate
    alpha = math.sin(w0) / (2.0 * eq.q)
    cos_w0 = math.cos(w0)
    b = np.array([1 + alpha * a_lin, -2 * cos_w0, 1 - alpha * a_lin])
    a = np.array([1 + alpha / a_lin, -2 * cos_w0, 1 - alpha / a_lin])
    from scipy.signal import lfilter

    return lfilter(b / a[0], a / a[0], x)


def _envelope_follower(
    x: np.ndarray, attack_ms: float, release_ms: float, rate: int
) -> np.ndarray:
    """Per-sample peak envelope with independent attack and release."""
    atk = math.exp(-1.0 / max(1e-6, attack_ms * 1e-3 * rate))
    rel = math.exp(-1.0 / max(1e-6, release_ms * 1e-3 * rate))
    mag = np.abs(x)
    env = np.empty_like(mag)
    prev = 0.0
    for i, m in enumerate(mag):
        coeff = atk if m > prev else rel
        prev = coeff * prev + (1.0 - coeff) * m
        env[i] = prev
    return env


def _soft_knee_gain_db(level_db: np.ndarray, threshold_db: float, ratio: float, knee_db: float) -> np.ndarray:
    """Gain reduction curve with a quadratic soft knee."""
    over = level_db - threshold_db
    gain = np.zeros_like(over)
    half_knee = knee_db / 2.0

    in_knee = (over > -half_knee) & (over <= half_knee)
    above = over > half_knee

    if knee_db > 0:
        gain[in_knee] = (
            (1.0 / ratio - 1.0) * (over[in_knee] + half_knee) ** 2 / (2.0 * knee_db)
        )
    gain[above] = (1.0 / ratio - 1.0) * over[above]
    return gain


def _compress(
    x: np.ndarray,
    rate: int,
    threshold_db: float,
    ratio: float,
    attack_ms: float,
    release_ms: float,
    knee_db: float,
) -> np.ndarray:
    if ratio <= 1.0:
        return x
    env = _envelope_follower(x, attack_ms, release_ms, rate)
    level_db = 20.0 * np.log10(np.maximum(env, 1e-9))
    gain_db = _soft_knee_gain_db(level_db, threshold_db, ratio, knee_db)
    return x * (10.0 ** (gain_db / 20.0))


def _deess(
    x: np.ndarray,
    rate: int,
    band_hz: tuple[float, float],
    threshold_db: float,
    ratio: float,
    max_reduction_db: float,
) -> np.ndarray:
    """Split-band de-esser that only ever *reduces* the sibilance band.

    Deliberately capped: sibilance is signal here, not noise.
    """
    low, high = band_hz
    nyq = rate / 2.0
    high = min(high, nyq * 0.98)
    if low >= high:
        return x
    sos = butter(2, [low / nyq, high / nyq], btype="bandpass", output="sos")
    band = sosfilt(sos, x)
    rest = x - band

    env = _envelope_follower(band, attack_ms=1.5, release_ms=45.0, rate=rate)
    level_db = 20.0 * np.log10(np.maximum(env, 1e-9))
    gain_db = _soft_knee_gain_db(level_db, threshold_db, ratio, knee_db=4.0)
    gain_db = np.maximum(gain_db, -abs(max_reduction_db))
    return rest + band * (10.0 ** (gain_db / 20.0))


def _saturate(x: np.ndarray, drive: float) -> np.ndarray:
    """Light asymmetric-free tanh saturation for harmonic density."""
    if drive <= 1e-6:
        return x
    k = 1.0 + drive * 8.0
    out = np.tanh(k * x) / math.tanh(k) if k > 0 else x
    # Blend so the transfer curve stays close to linear at low level.
    return (1.0 - drive) * x + drive * out


def _frame_features(
    x: np.ndarray, rate: int, frame_ms: float = 20.0
) -> tuple[np.ndarray, np.ndarray, int]:
    hop = max(1, int(rate * frame_ms * 1e-3))
    n_frames = int(np.ceil(x.size / hop))
    padded = np.pad(x, (0, n_frames * hop - x.size))
    frames = padded.reshape(n_frames, hop)
    rms = np.sqrt(np.mean(frames**2, axis=1) + 1e-18)
    signs = np.signbit(frames)
    zcr = np.mean(np.diff(signs, axis=1), axis=1)
    return rms, np.abs(zcr), hop


def _emphasise_breath(
    x: np.ndarray,
    rate: int,
    gain_db: float,
    zcr_threshold: float,
    max_rms_db: float,
) -> np.ndarray:
    """Lift quiet, noisy frames — breaths and mouth detail.

    Conventional speech cleanup removes these. For intimate audio they are a
    large part of what makes a voice feel embodied and present, so we do the
    opposite and bring them slightly forward.
    """
    if abs(gain_db) < 1e-9:
        return x
    rms, zcr, hop = _frame_features(x, rate)
    rms_db = 20.0 * np.log10(np.maximum(rms, 1e-9))
    is_breath = (zcr > zcr_threshold) & (rms_db < max_rms_db) & (rms_db > -75.0)

    gain = np.ones(rms.size)
    gain[is_breath] = _db_to_lin(gain_db)
    if gain.size >= 3:
        kernel = np.array([0.25, 0.5, 0.25])
        gain = np.convolve(gain, kernel, mode="same")
        gain[0] = gain[1] if gain.size > 1 else gain[0]
        gain[-1] = gain[-2] if gain.size > 1 else gain[-1]

    # Interpolate between frame centres rather than repeating a value across each
    # frame. np.repeat would undo the smoothing above and reintroduce steps of up
    # to `gain_db` every frame — an audible zipper at the frame rate, landing
    # directly on the mouth detail this stage exists to bring forward.
    frame_centres = np.arange(gain.size) * hop + hop / 2.0
    sample_index = np.arange(x.size)
    per_sample = np.interp(sample_index, frame_centres, gain)
    return x * per_sample


def process_voice(mono: np.ndarray, rate: int, preset: VoicePreset | None = None) -> np.ndarray:
    """Run the full intimate-voice chain on a mono signal."""
    if mono.ndim != 1:
        raise ValueError("process_voice expects a mono signal")
    preset = preset or VoicePreset()

    x = np.asarray(mono, dtype=np.float64)
    x = _highpass(x, preset.highpass_hz, rate)
    x = _shelf(x, preset.low_shelf_db, preset.low_shelf_hz, rate, "low")
    for eq in preset.peaking:
        x = _peaking(x, eq, rate)
    x = _shelf(x, preset.air_shelf_db, preset.air_shelf_hz, rate, "high")
    x = _deess(
        x,
        rate,
        preset.deess_band_hz,
        preset.deess_threshold_db,
        preset.deess_ratio,
        preset.deess_max_reduction_db,
    )
    x = _emphasise_breath(
        x, rate, preset.breath_gain_db, preset.breath_detect_zcr, preset.breath_detect_max_rms_db
    )
    x = _compress(
        x,
        rate,
        preset.comp_threshold_db,
        preset.comp_ratio,
        preset.comp_attack_ms,
        preset.comp_release_ms,
        preset.comp_knee_db,
    )
    x = _saturate(x, preset.saturation_drive)
    if abs(preset.comp_makeup_db) > 1e-9:
        x = x * _db_to_lin(preset.comp_makeup_db)
    return x

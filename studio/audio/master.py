"""Bed mixing, loudness targeting and delivery encoding.

The loudness decision here is deliberately unconventional. Podcast and streaming
practice targets about -16 LUFS integrated with a narrow loudness range, because
the listener is assumed to be in a car or a noisy room and everything must stay
intelligible. Both halves of that assumption are wrong for us: the listener is
in bed with headphones on, in the dark, with the volume already set where they
want it.

Mastering intimate audio to -16 LUFS makes a whisper as loud as a conversation,
which is precisely the thing we must not do. We target a much quieter integrated
level and *protect* loudness range instead of minimising it, so the listener
sets a comfortable volume once and the dynamics do the expressive work.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import numpy as np
import pyloudnorm as pyln
from scipy.signal import resample_poly


@dataclass(frozen=True)
class MasterTarget:
    """Delivery specification.

    integrated_lufs: quiet by design. Sleep/ASMR content sits far below
        broadcast levels; -22 keeps whispers whisper-quiet while leaving
        headroom for the louder moments in a story.
    true_peak_dbtp: -1.5 dBTP keeps lossy encoders from clipping on decode.
    min_loudness_range: a floor, not a ceiling — if the mix comes out flatter
        than this, the chain has over-compressed and QC should complain.
    """

    integrated_lufs: float = -22.0
    true_peak_dbtp: float = -1.5
    min_loudness_range: float = 5.0
    rate: int = 48000


def true_peak_dbtp(
    x: np.ndarray,
    rate: int,
    oversample: int = 4,
    chunk_samples: int = 1 << 20,
) -> float:
    """Inter-sample peak estimate, in dBTP.

    Processed in chunks because the obvious implementation — oversample the whole
    signal, then take the maximum — allocates an array `oversample` times the
    length of the episode. Measured at 2 GiB of resident memory for five minutes
    of stereo audio and scaling linearly, which made full-length episodes
    unworkable on a laptop and blocked any parallel rendering.

    Since the result is a maximum, chunking is exact. Each chunk carries a small
    overlap so the polyphase filter has context, and only the interior of each
    upsampled chunk contributes, so no boundary transient is ever measured.
    """
    if x.size == 0:
        return -np.inf

    x = np.asarray(x)
    n = x.shape[0]
    if n == 0:
        return -np.inf

    # resample_poly's default filter is 2*10*oversample+1 taps, so ~10*oversample
    # input samples of context is ample.
    pad = max(128, 16 * oversample)
    peak = 0.0

    for start in range(0, n, chunk_samples):
        stop = min(n, start + chunk_samples)
        lo = max(0, start - pad)
        hi = min(n, stop + pad)
        up = resample_poly(x[lo:hi], oversample, 1, axis=0)
        interior_start = (start - lo) * oversample
        interior_stop = interior_start + (stop - start) * oversample
        peak = max(peak, float(np.max(np.abs(up[interior_start:interior_stop]))))

    return 20.0 * np.log10(max(peak, 1e-12))


def _limit_true_peak(x: np.ndarray, rate: int, ceiling_dbtp: float) -> np.ndarray:
    """Transparent gain-down to a true-peak ceiling."""
    tp = true_peak_dbtp(x, rate)
    if tp <= ceiling_dbtp:
        return x
    return x * (10.0 ** ((ceiling_dbtp - tp) / 20.0))


def _soft_clip_peaks(
    x: np.ndarray,
    rate: int,
    ceiling_dbtp: float,
    attack_ms: float = 1.0,
    release_ms: float = 20.0,
    intersample_margin_db: float = 1.5,
) -> np.ndarray:
    """Look-ahead peak reduction that acts only where peaks actually exceed.

    A whole-file gain trim is the wrong instrument for this catalogue. Close-mic
    intimate recording routinely contains isolated 2 ms mouth clicks tens of dB
    above the surrounding whisper, and trimming the entire episode to accommodate
    one of them drags the whole thing far below its loudness target — which then
    surfaces as two misleading QC failures about loudness and over-compression,
    neither of which describes what happened.

    So instead of penalising the episode for its loudest 2 ms, reduce the
    offending peaks and leave everything else alone.
    """
    from scipy.ndimage import minimum_filter1d, uniform_filter1d

    # The gain is derived from the sample-domain envelope, but the ceiling is a
    # *true* peak that includes inter-sample overshoot. Aiming exactly at the
    # ceiling therefore leaves the true peak above it, and the caller's loop then
    # pays for the miss in loudness. A margin absorbs the overshoot instead.
    ceiling_lin = 10.0 ** ((ceiling_dbtp - intersample_margin_db) / 20.0)
    peak_env = np.max(np.abs(x), axis=1)

    over = peak_env > ceiling_lin
    if not np.any(over):
        return x

    required = np.ones_like(peak_env)
    required[over] = ceiling_lin / peak_env[over]

    # Hold the reduction across a window spanning attack and release, so the gain
    # is already down before the transient arrives and recovers gradually after.
    window = max(3, int((attack_ms + release_ms) * 1e-3 * rate))
    held = minimum_filter1d(required, size=window, mode="nearest")
    smoothed = uniform_filter1d(held, size=window, mode="nearest")

    # Smoothing can lift the curve back above what the ceiling requires, so clamp
    # once more. The corner this reintroduces is tiny compared with the transient.
    gain = np.minimum(smoothed, required)
    return x * gain[:, None]


def mix_bed(
    voice: np.ndarray,
    bed: np.ndarray,
    bed_gain_db: float = -24.0,
    rate: int = 48000,
) -> np.ndarray:
    """Mix a stereo ambience bed under a stereo voice.

    The bed is looped or truncated to the voice length. It sits low: its job is
    to remove the vacuum around the voice, not to be noticed.
    """
    if voice.ndim != 2 or voice.shape[1] != 2:
        raise ValueError("voice must be stereo (n, 2)")
    if bed.ndim == 1:
        bed = np.stack([bed, bed], axis=1)

    n = voice.shape[0]
    if bed.shape[0] < n:
        reps = int(np.ceil(n / bed.shape[0]))
        bed = np.tile(bed, (reps, 1))
    bed = bed[:n]

    return voice + bed * (10.0 ** (bed_gain_db / 20.0))


def normalise(
    stereo: np.ndarray,
    target: MasterTarget,
    rate: int | None = None,
    limit_peaks: bool = True,
) -> tuple[np.ndarray, dict]:
    """Loudness-normalise and protect the true-peak ceiling.

    `rate` may be passed explicitly and is checked against `target.rate`; passing
    a 44.1 kHz array with a 48 kHz target otherwise mis-measures loudness silently,
    and the pipeline legitimately works at both rates.

    When `limit_peaks` is set, isolated peaks are reduced locally and the loudness
    target is then re-achieved. Without it, a single close-mic click would pull the
    whole episode down — which is a routine input for this catalogue, not an edge
    case.
    """
    if stereo.ndim != 2 or stereo.shape[1] != 2:
        raise ValueError("normalise expects stereo (n, 2)")
    if rate is not None and rate != target.rate:
        raise ValueError(
            f"audio is {rate} Hz but target expects {target.rate} Hz; resample first"
        )

    # Final DC safety. Filters and convolution each leave a tiny offset behind,
    # and by the master stage they have accumulated. DC costs headroom and can
    # make quiet passages audibly unclean on small transducers.
    stereo = stereo - stereo.mean(axis=0, keepdims=True)

    meter = pyln.Meter(target.rate)
    measured = meter.integrated_loudness(stereo)
    if not np.isfinite(measured):
        raise ValueError("could not measure loudness; signal may be silent")

    out = stereo * (10.0 ** ((target.integrated_lufs - measured) / 20.0))

    # Raising level and squashing peaks fight each other: reduce the peaks, and the
    # subsequent re-level pushes them back over the ceiling. One pass therefore
    # lands short of target. Alternating converges in two or three rounds, because
    # locally reducing an isolated transient barely moves integrated loudness.
    peak_reduction_db = 0.0
    if limit_peaks:
        for _ in range(8):
            current_peak = true_peak_dbtp(out, target.rate)
            if current_peak <= target.true_peak_dbtp:
                break
            out = _soft_clip_peaks(out, target.rate, target.true_peak_dbtp)
            peak_reduction_db += current_peak - true_peak_dbtp(out, target.rate)
            relevelled = meter.integrated_loudness(out)
            if not np.isfinite(relevelled):
                break
            if abs(target.integrated_lufs - relevelled) < 0.05:
                break
            out = out * (10.0 ** ((target.integrated_lufs - relevelled) / 20.0))

    # Anything still over the ceiling is reduced locally once more rather than by a
    # whole-file trim, so the last step cannot undo the level we just achieved.
    if limit_peaks and true_peak_dbtp(out, target.rate) > target.true_peak_dbtp:
        out = _soft_clip_peaks(out, target.rate, target.true_peak_dbtp)
    out = _limit_true_peak(out, target.rate, target.true_peak_dbtp)

    final_lufs = meter.integrated_loudness(out)
    shortfall = target.integrated_lufs - float(final_lufs)
    return out, {
        "input_lufs": float(measured),
        "output_lufs": float(final_lufs),
        "true_peak_dbtp": true_peak_dbtp(out, target.rate),
        "peak_reduction_db": float(peak_reduction_db),
        "loudness_shortfall_db": float(max(0.0, shortfall)),
        "peak_limited": bool(shortfall > 0.5),
    }


def mono_compatibility_db(stereo: np.ndarray) -> float:
    """Level change when the two channels are summed, in dB.

    A near-field binaural render deliberately creates large interaural
    differences, and summing to mono makes those differences interfere. Around
    0 dB means the mix survives a mono speaker; a large negative number means
    parts of the voice cancel and the file will sound thin or hollow on a phone.
    """
    if stereo.ndim != 2 or stereo.shape[1] != 2:
        raise ValueError("expected stereo (n, 2)")
    left, right = stereo[:, 0], stereo[:, 1]
    stereo_rms = np.sqrt(np.mean(left**2 + right**2) / 2.0) + 1e-12
    mono_rms = np.sqrt(np.mean((0.5 * (left + right)) ** 2)) + 1e-12
    return float(20.0 * np.log10(mono_rms / stereo_rms))


def to_speaker_safe(
    stereo: np.ndarray,
    rate: int,
    width: float = 0.25,
    highpass_hz: float = 130.0,
) -> np.ndarray:
    """Fold a binaural master into a mix that holds up on a phone speaker.

    The anchor listening context for this catalogue is bed at night, and a
    meaningful share of that is the phone's own speaker rather than headphones.
    Binaural rendering is built on interaural difference, so on a single small
    speaker — or on two speakers a few centimetres apart — it partially cancels
    and the intimacy it was created for turns into hollowness.

    Rather than ship one compromised mix, the studio produces two masters. This
    one keeps most of the mid signal, retains only a trace of width, and removes
    low frequencies a phone speaker cannot reproduce anyway and would otherwise
    waste headroom on.
    """
    if stereo.ndim != 2 or stereo.shape[1] != 2:
        raise ValueError("expected stereo (n, 2)")

    left, right = stereo[:, 0], stereo[:, 1]
    mid = 0.5 * (left + right)
    side = 0.5 * (left - right)

    out = np.stack([mid + width * side, mid - width * side], axis=1)

    from scipy.signal import butter, sosfilt

    sos = butter(2, highpass_hz / (rate / 2.0), btype="highpass", output="sos")
    return sosfilt(sos, out, axis=0)


# Speaker playback needs more level than headphone playback: small transducers
# lose the low end, and the listener has no volume headroom left on a phone.
SPEAKER_TARGET = MasterTarget(integrated_lufs=-18.0, min_loudness_range=4.0)


def resample_to(x: np.ndarray, src_rate: int, dst_rate: int) -> np.ndarray:
    if src_rate == dst_rate:
        return x
    from math import gcd

    g = gcd(src_rate, dst_rate)
    return resample_poly(x, dst_rate // g, src_rate // g, axis=0)


def write_wav(path: Path, stereo: np.ndarray, rate: int) -> Path:
    import soundfile as sf

    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    sf.write(str(path), stereo, rate, subtype="PCM_24")
    return path


def encode_delivery(
    wav_path: Path,
    out_path: Path,
    codec: str = "aac",
    bitrate_kbps: int = 256,
) -> Path:
    """Encode a delivery file with ffmpeg.

    Bitrate is high for speech on purpose. Whisper and sibilance live above
    8 kHz, and that is the first thing a low-bitrate encoder discards. Any
    parametric-stereo mode (HE-AAC v2) must be avoided outright: it reconstructs
    the stereo image from a mono downmix plus side data, which destroys the
    interaural detail the binaural render exists to create.
    """
    import subprocess

    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    if codec == "aac":
        args = ["-c:a", "aac", "-b:a", f"{bitrate_kbps}k", "-profile:a", "aac_low"]
    elif codec == "opus":
        args = ["-c:a", "libopus", "-b:a", f"{bitrate_kbps}k", "-application", "audio"]
    elif codec == "flac":
        args = ["-c:a", "flac"]
    else:
        raise ValueError(f"unsupported codec {codec}")

    cmd = ["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav_path), *args, str(out_path)]
    subprocess.run(cmd, check=True)
    return out_path

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


def true_peak_dbtp(x: np.ndarray, rate: int, oversample: int = 4) -> float:
    """Inter-sample peak estimate, in dBTP."""
    if x.size == 0:
        return -np.inf
    up = resample_poly(x, oversample, 1, axis=0)
    peak = float(np.max(np.abs(up)))
    return 20.0 * np.log10(max(peak, 1e-12))


def _limit_true_peak(x: np.ndarray, rate: int, ceiling_dbtp: float) -> np.ndarray:
    """Transparent gain-down to a true-peak ceiling.

    A static trim rather than a limiter: at these levels there is almost never
    anything to limit, and a limiter would eat exactly the transients we want.
    """
    tp = true_peak_dbtp(x, rate)
    if tp <= ceiling_dbtp:
        return x
    return x * (10.0 ** ((ceiling_dbtp - tp) / 20.0))


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


def normalise(stereo: np.ndarray, target: MasterTarget) -> tuple[np.ndarray, dict]:
    """Loudness-normalise then true-peak protect. Returns (audio, measurements)."""
    if stereo.ndim != 2 or stereo.shape[1] != 2:
        raise ValueError("normalise expects stereo (n, 2)")

    meter = pyln.Meter(target.rate)
    measured = meter.integrated_loudness(stereo)
    if not np.isfinite(measured):
        raise ValueError("could not measure loudness; signal may be silent")

    gained = stereo * (10.0 ** ((target.integrated_lufs - measured) / 20.0))
    limited = _limit_true_peak(gained, target.rate, target.true_peak_dbtp)

    final_lufs = meter.integrated_loudness(limited)
    return limited, {
        "input_lufs": float(measured),
        "output_lufs": float(final_lufs),
        "true_peak_dbtp": true_peak_dbtp(limited, target.rate),
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

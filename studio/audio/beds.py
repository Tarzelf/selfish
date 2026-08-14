"""Procedural ambience beds and focus soundscapes.

Two uses. Under narration, a bed removes the unnatural vacuum around dry TTS —
synthetic speech in true digital silence reads as artificial, and a barely
audible room tone fixes that for almost nothing.

For the focus room, procedural generation matters more: any fixed loop becomes
noticeable and then irritating on the tenth listen, and noticing your focus
audio is the one thing it must never make you do. Generating long-form noise
with slowly drifting filters gives audio that never repeats and never draws
attention.

Colour choice is evidence-led. Broadband noise (pink/brown) has a reasonable
literature behind it for sustained attention, whereas speech-like or musical
material competes for the same cognitive resources as the work itself.
"""

from __future__ import annotations

import numpy as np
from scipy.signal import butter, lfilter, sosfilt


def _white(n: int, rng: np.random.Generator) -> np.ndarray:
    return rng.standard_normal(n)


def pink_noise(n: int, rng: np.random.Generator) -> np.ndarray:
    """Approximate 1/f noise via the Voss-McCartney style IIR filter."""
    white = _white(n, rng)
    # Paul Kellet's economical pinking filter.
    b = [0.049922035, -0.095993537, 0.050612699, -0.004408786]
    a = [1.0, -2.494956002, 2.017265875, -0.522189400]
    out = lfilter(b, a, white)
    return out / (np.max(np.abs(out)) + 1e-12)


def brown_noise(n: int, rng: np.random.Generator) -> np.ndarray:
    """1/f^2 noise — the deep, rain-like colour most listeners find calming."""
    white = _white(n, rng)
    out = np.cumsum(white)
    out -= np.linspace(out[0], out[-1], n)  # remove the random walk's drift
    out -= out.mean()  # integration leaves a DC term that QC will flag downstream
    return out / (np.max(np.abs(out)) + 1e-12)


def room_tone(
    duration_s: float,
    rate: int,
    level_db: float = -48.0,
    seed: int = 0,
) -> np.ndarray:
    """A very quiet, warm stereo room tone to sit under narration.

    `level_db` is an **RMS** target. Normalising by peak instead — the obvious
    thing to do — made the delivered level about 8 dB quieter than the number
    suggested, and by an amount that varied with the noise's crest factor, so bed
    gain staging was neither what an operator would expect nor reproducible
    between seeds.
    """
    rng = np.random.default_rng(seed)
    n = int(duration_s * rate)
    left = brown_noise(n, rng)
    right = brown_noise(n, rng)

    sos = butter(2, min(0.99, 900.0 / (rate / 2.0)), btype="lowpass", output="sos")
    left, right = sosfilt(sos, left), sosfilt(sos, right)

    bed = np.stack([left, right], axis=1)
    # Lowpassing near-DC noise leaves an offset behind; remove it here so it does
    # not accumulate into the mix and trip the QC gate downstream.
    bed -= bed.mean(axis=0, keepdims=True)

    rms = float(np.sqrt(np.mean(bed**2)))
    if rms < 1e-12:
        return bed
    bed *= (10.0 ** (level_db / 20.0)) / rms

    # Guard against an implausible peak after RMS scaling.
    peak = float(np.max(np.abs(bed)))
    if peak > 0.5:
        bed *= 0.5 / peak
    return bed


def drifting_soundscape(
    duration_s: float,
    rate: int,
    colour: str = "brown",
    drift_period_s: float = 45.0,
    stereo_width: float = 0.7,
    seed: int = 0,
) -> np.ndarray:
    """Long-form focus noise whose spectrum drifts slowly and never loops.

    A low-frequency oscillator moves a lowpass corner over a few octaves on a
    period far longer than working memory, so the texture stays alive without
    ever presenting a recognisable pattern.
    """
    rng = np.random.default_rng(seed)
    n = int(duration_s * rate)
    generator = {"brown": brown_noise, "pink": pink_noise, "white": _white}[colour]
    base_l = generator(n, rng)
    base_r = generator(n, rng)

    # Decorrelate the channels only partially: fully independent noise in each
    # ear is fatiguing over long listens.
    mid = 0.5 * (base_l + base_r)
    base_l = stereo_width * base_l + (1.0 - stereo_width) * mid
    base_r = stereo_width * base_r + (1.0 - stereo_width) * mid

    block = max(1, int(rate * 0.25))
    n_blocks = int(np.ceil(n / block))
    lfo = 0.5 + 0.5 * np.sin(
        2.0 * np.pi * np.arange(n_blocks) * block / (rate * drift_period_s)
    )
    cutoffs = 350.0 * (2.0 ** (2.2 * lfo))

    out = np.zeros((n_blocks * block, 2))
    padded = np.stack(
        [
            np.pad(base_l, (0, n_blocks * block - n)),
            np.pad(base_r, (0, n_blocks * block - n)),
        ],
        axis=1,
    )
    for i, cutoff in enumerate(cutoffs):
        sl = slice(i * block, (i + 1) * block)
        sos = butter(
            2, min(0.99, float(cutoff) / (rate / 2.0)), btype="lowpass", output="sos"
        )
        out[sl] = sosfilt(sos, padded[sl], axis=0)

    out = out[:n]
    peak = np.max(np.abs(out)) + 1e-12
    return out / peak * 0.5


def fade(stereo: np.ndarray, rate: int, fade_in_s: float, fade_out_s: float) -> np.ndarray:
    """Equal-power fades. Focus and sleep audio must never start or stop abruptly."""
    out = stereo.copy()
    n_in = min(int(fade_in_s * rate), out.shape[0])
    n_out = min(int(fade_out_s * rate), out.shape[0])
    if n_in > 0:
        out[:n_in] *= np.sqrt(np.linspace(0.0, 1.0, n_in))[:, None]
    if n_out > 0:
        out[-n_out:] *= np.sqrt(np.linspace(1.0, 0.0, n_out))[:, None]
    return out

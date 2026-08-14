"""Binaural rendering with near-field compensation.

The intimacy signature of this product is a voice that sounds like it is a few
centimetres from the listener's ear. That is *not* the same problem as ordinary
game-style 3D audio, and the difference is the whole reason this module exists.

Publicly available HRTF sets (KEMAR included) are measured in the far field —
KEMAR at 1.4 m. Convolving with a far-field HRIR places the voice correctly on
the horizontal plane but leaves it sounding like it is across the room, because
the dominant *distance* cue at close range is missing.

At close range the two ears no longer receive near-equal sound pressure. Path
length to the far ear becomes proportionally much longer than to the near ear,
so interaural level difference grows dramatically and — crucially — it grows at
low frequencies, where far-field ILD is almost zero (Brungart & Rabinowitz,
JASA 1999). That low-frequency ILD is the cue the auditory system reads as
"this is happening next to my head".

So: use KEMAR for pinna/spectral/ITD cues, then add only the *incremental*
near-field terms on top, so nothing is double-applied.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

import numpy as np
from scipy.signal import bilinear, fftconvolve, lfilter

HRIR_RATE = 44100
HRIR_TAPS = 128

# KEMAR compact set was measured at 1.4 m.
KEMAR_REFERENCE_DISTANCE_M = 1.4

# Rigid-sphere head radius used by the classic Woodworth/Brungart models.
HEAD_RADIUS_M = 0.0875


class HrtfError(RuntimeError):
    pass


@dataclass(frozen=True)
class Placement:
    """Where a voice sits relative to the listener's head.

    azimuth_deg: 0 = directly ahead, +90 = right ear, -90 = left ear.
    elevation_deg: 0 = ear level. Slightly negative reads as leaning in.
    distance_m: 0.10-0.30 is the intimate range this product lives in.
    """

    azimuth_deg: float = 0.0
    elevation_deg: float = 0.0
    distance_m: float = 0.20

    def __post_init__(self) -> None:
        if self.distance_m <= HEAD_RADIUS_M:
            raise HrtfError(
                f"distance_m must exceed the head radius ({HEAD_RADIUS_M} m); "
                f"got {self.distance_m}"
            )


class KemarHrtf:
    """Loader for the MIT KEMAR 'compact' HRTF set.

    The compact set stores one file per (elevation, azimuth) for azimuths
    0-180 degrees only, exploiting head symmetry: each file holds the ipsilateral
    and contralateral responses, so the left hemisphere is obtained by swapping
    channels. Files are raw big-endian int16, stereo-interleaved, 128 taps.
    """

    def __init__(self, root: Path) -> None:
        self.root = Path(root)
        if not self.root.is_dir():
            raise HrtfError(f"KEMAR compact directory not found: {self.root}")
        self._available_elevations = sorted(
            int(p.name.replace("elev", ""))
            for p in self.root.glob("elev*")
            if p.is_dir()
        )
        if not self._available_elevations:
            raise HrtfError(f"no elev* directories under {self.root}")

    @lru_cache(maxsize=512)
    def _read_file(self, elevation: int, azimuth: int) -> tuple[np.ndarray, np.ndarray]:
        path = self.root / f"elev{elevation}" / f"H{elevation}e{azimuth:03d}a.dat"
        if not path.exists():
            raise HrtfError(f"missing HRIR file {path}")
        raw = np.frombuffer(path.read_bytes(), dtype=">i2").astype(np.float64) / 32768.0
        if raw.size != HRIR_TAPS * 2:
            raise HrtfError(f"unexpected HRIR length {raw.size} in {path}")
        # Channel order verified empirically against the data rather than trusted
        # from documentation: for a source at 90 degrees the second channel is
        # ~14 dB louder and its onset arrives 27 samples earlier, so channel 0 is
        # the contralateral (shadowed) ear and channel 1 the ipsilateral one.
        return raw[0::2].copy(), raw[1::2].copy()

    def _nearest_elevation(self, elevation_deg: float) -> int:
        return min(self._available_elevations, key=lambda e: abs(e - elevation_deg))

    def _available_azimuths(self, elevation: int) -> list[int]:
        files = (self.root / f"elev{elevation}").glob("*.dat")
        azimuths = []
        for f in files:
            stem = f.stem  # e.g. H0e090a
            azimuths.append(int(stem.split("e")[1].rstrip("a")))
        return sorted(azimuths)

    def far_field_hrir(
        self, azimuth_deg: float, elevation_deg: float
    ) -> tuple[np.ndarray, np.ndarray]:
        """Return (left, right) far-field HRIRs for a signed azimuth."""
        elevation = self._nearest_elevation(elevation_deg)
        # Fold the signed azimuth into the measured 0-180 right hemisphere.
        az = float(azimuth_deg) % 360.0
        on_left = az > 180.0
        folded = 360.0 - az if on_left else az

        candidates = self._available_azimuths(elevation)
        nearest = min(candidates, key=lambda a: abs(a - folded))
        contra, ipsi = self._read_file(elevation, nearest)

        # The ipsilateral response belongs to whichever ear the source is on.
        if on_left:
            return ipsi, contra
        return contra, ipsi


def _ear_path_lengths(azimuth_deg: float, distance_m: float) -> tuple[float, float]:
    """Straight-line distance from a point source to each ear on a sphere model."""
    theta = math.radians(azimuth_deg)
    # Ear direction unit vectors: left at -90 deg, right at +90 deg.
    # Source position in the horizontal plane, x = right, y = forward.
    sx, sy = distance_m * math.sin(theta), distance_m * math.cos(theta)
    left = math.hypot(sx + HEAD_RADIUS_M, sy)
    right = math.hypot(sx - HEAD_RADIUS_M, sy)
    return left, right


def near_field_ild_db(azimuth_deg: float, distance_m: float) -> float:
    """Incremental low-frequency ILD (dB, positive = right ear louder).

    This is the difference between the spherical-spreading level difference at
    the target distance and the same quantity at the HRTF measurement distance,
    so it adds only what the far-field measurement is missing.
    """
    near_l, near_r = _ear_path_lengths(azimuth_deg, distance_m)
    ref_l, ref_r = _ear_path_lengths(azimuth_deg, KEMAR_REFERENCE_DISTANCE_M)
    near_ild = 20.0 * math.log10(near_l / near_r)
    ref_ild = 20.0 * math.log10(ref_l / ref_r)
    return near_ild - ref_ild


def _low_shelf(gain_db: float, cutoff_hz: float, rate: int) -> tuple[np.ndarray, np.ndarray]:
    """First-order low shelf via bilinear transform of an analogue prototype."""
    if abs(gain_db) < 1e-9:
        return np.array([1.0]), np.array([1.0])
    a_lin = 10.0 ** (gain_db / 20.0)
    w = 2.0 * math.pi * cutoff_hz
    # H(s) = (s + a*w) / (s + w)  -> +20log10(a) dB at DC, 0 dB at high frequency.
    return bilinear([1.0, a_lin * w], [1.0, w], fs=rate)


def _split_low_high(
    x: np.ndarray, crossover_hz: float, rate: int
) -> tuple[np.ndarray, np.ndarray]:
    """Complementary first-order split so low + high reconstructs the input."""
    b, a = bilinear([1.0], [1.0 / (2.0 * math.pi * crossover_hz), 1.0], fs=rate)
    low = lfilter(b, a, x)
    return low, x - low


def render_binaural(
    mono: np.ndarray,
    hrtf: KemarHrtf,
    placement: Placement,
    rate: int = HRIR_RATE,
    proximity_shelf_db: float | None = None,
    ild_crossover_hz: float = 1200.0,
    trim_to_input: bool = True,
) -> np.ndarray:
    """Place a mono signal at `placement`. Returns float64 (n, 2).

    The near-field ILD is applied only below `ild_crossover_hz`, because above
    it the far-field HRIR's head-shadow already supplies a realistic level
    difference and doubling up produces an unnaturally lateralised, "in the
    skull" image.
    """
    if mono.ndim != 1:
        raise HrtfError("render_binaural expects a mono signal")
    if rate != HRIR_RATE:
        raise HrtfError(
            f"HRIRs are {HRIR_RATE} Hz; resample the input first (got {rate})"
        )

    left_ir, right_ir = hrtf.far_field_hrir(
        placement.azimuth_deg, placement.elevation_deg
    )
    keep = mono.size if trim_to_input else None
    left = fftconvolve(mono, left_ir, mode="full")[:keep]
    right = fftconvolve(mono, right_ir, mode="full")[:keep]

    ild_db = near_field_ild_db(placement.azimuth_deg, placement.distance_m)
    if abs(ild_db) > 1e-6:
        # Positive ild_db means the right ear should gain and the left should lose.
        gain_r = 10.0 ** (0.5 * ild_db / 20.0)
        gain_l = 1.0 / gain_r
        low_l, high_l = _split_low_high(left, ild_crossover_hz, rate)
        low_r, high_r = _split_low_high(right, ild_crossover_hz, rate)
        left = low_l * gain_l + high_l
        right = low_r * gain_r + high_r

    # Proximity warmth. Real intimate recordings are made close on directional
    # mics, so listeners have learned low-frequency lift as a closeness cue.
    if proximity_shelf_db is None:
        # Scale from 0 dB at 60 cm up to ~+3.5 dB at 12 cm.
        span = max(0.0, min(1.0, (0.60 - placement.distance_m) / 0.48))
        proximity_shelf_db = 3.5 * span
    if proximity_shelf_db > 1e-6:
        b, a = _low_shelf(proximity_shelf_db, 220.0, rate)
        left = lfilter(b, a, left)
        right = lfilter(b, a, right)

    return np.stack([left, right], axis=1)


def render_binaural_path(
    mono: np.ndarray,
    hrtf: KemarHrtf,
    waypoints: list[tuple[float, Placement]],
    rate: int = HRIR_RATE,
    block_size: int = 2048,
) -> np.ndarray:
    """Render a voice that moves, e.g. the ear-to-ear drift ASMR listeners love.

    `waypoints` is [(time_seconds, Placement), ...]. Placements are linearly
    interpolated between waypoints and rendered blockwise with a Hann
    cross-fade, which avoids the clicks that naive per-block HRIR switching
    produces.
    """
    if mono.ndim != 1:
        raise HrtfError("render_binaural_path expects a mono signal")
    if not waypoints:
        raise HrtfError("at least one waypoint is required")

    ordered = sorted(waypoints, key=lambda w: w[0])
    times = np.array([t for t, _ in ordered], dtype=np.float64)

    def placement_at(t: float) -> Placement:
        if t <= times[0]:
            return ordered[0][1]
        if t >= times[-1]:
            return ordered[-1][1]
        i = int(np.searchsorted(times, t)) - 1
        t0, p0 = ordered[i]
        t1, p1 = ordered[i + 1]
        frac = 0.0 if t1 == t0 else (t - t0) / (t1 - t0)
        return Placement(
            azimuth_deg=p0.azimuth_deg + frac * (p1.azimuth_deg - p0.azimuth_deg),
            elevation_deg=p0.elevation_deg
            + frac * (p1.elevation_deg - p0.elevation_deg),
            distance_m=p0.distance_m + frac * (p1.distance_m - p0.distance_m),
        )

    hop = block_size // 2
    window = np.hanning(block_size)
    pad = HRIR_TAPS * 2
    out = np.zeros((mono.size + block_size + pad, 2), dtype=np.float64)
    norm = np.zeros(mono.size + block_size + pad, dtype=np.float64)

    for start in range(0, mono.size, hop):
        block = mono[start : start + block_size]
        if block.size == 0:
            break
        w = window[: block.size]
        centre_t = (start + block.size / 2.0) / rate
        rendered = render_binaural(
            block * w, hrtf, placement_at(centre_t), rate=rate, trim_to_input=False
        )
        out[start : start + rendered.shape[0]] += rendered
        norm[start : start + block.size] += w

    # The window sum is the correct divisor over the body of the signal. Each
    # block keeps its full convolution tail so no high-frequency detail is
    # truncated at block boundaries.
    norm = np.maximum(norm, 1e-6)
    return out[: mono.size] / norm[: mono.size, None]

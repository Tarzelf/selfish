"""Assembly of separately recorded beats into a finished episode.

This module is the reason human performers and combinatorial variety can coexist.

Recording whole episodes to a fixed mix — what every competitor does — means every
variant needs another session, so variants do not exist. Recording **beat by
beat** moves assembly into software, and a single session then yields many
deliveries: different ASMR profiles, different spatial treatments, headphone and
speaker masters, short and long cuts, and different *arcs*.

The arc is the interesting one. Because pauses, level and spatial distance are
decided here rather than in the booth, the shape of a story's build becomes a
parameter the listener can set. The most repeated craft complaint about this
category is pacing — escalation arriving too early, scenes ending abruptly — and
it is the one axis where software genuinely beats performance.

**The seam problem, and why it is tractable.** Splicing separately recorded takes
normally betrays itself three ways: a click at the join, a jump in background
noise, and a jump in performance level. All three are addressable:

- A continuous room tone runs *underneath* the whole episode, so the background
  never changes even though the voice is discontinuous. This is the single most
  effective trick, and it is why the bed is not optional.
- Short equal-power crossfades at joins remove clicks.
- Per-beat loudness matching to an arc-shaped target curve removes level jumps —
  and does something better than hiding variation: it makes level variation
  *intentional*, so residual inconsistency reads as performance rather than as
  editing.
"""

from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np
import pyloudnorm as pyln

from .hrtf import HRIR_RATE, KemarHrtf, Placement, render_binaural
from .master import mix_bed


@dataclass
class Beat:
    """One recorded unit of performance.

    `audio` is mono at HRIR_RATE, already through the voice chain.
    `text` is the source line, kept for the ASR round-trip check.
    `pause_after_s` is the performer's or editor's *intended* pause, which the arc
    then scales rather than replaces.
    """

    audio: np.ndarray
    text: str = ""
    pause_after_s: float = 0.6
    role: str = "narration"
    # Beats can override placement; otherwise the arc decides.
    placement: Placement | None = None


@dataclass(frozen=True)
class Arc:
    """The shape of a story's build. A user-facing control.

    Values are interpolated across normalised story position 0..1.

    pause_scale: multiplier on each beat's intended pause, start -> end. A slow
        burn holds silence early and tightens later, so >1 at the start.
    distance_m: how close the voice sits, start -> end. Moving from ~30 cm to
        ~12 cm over an episode is a physical sensation of someone leaning in, and
        it is only available because placement is decided per beat.
    level_db: loudness target offset, start -> end. Small: a couple of dB reads as
        intensification without breaking the quiet mastering target.
    """

    name: str = "slow_burn"
    pause_scale: tuple[float, float] = (1.6, 0.7)
    distance_m: tuple[float, float] = (0.30, 0.13)
    level_db: tuple[float, float] = (-1.5, 1.5)
    azimuth_deg: tuple[float, float] = (-35.0, -8.0)
    elevation_deg: float = -6.0

    def at(self, position: float) -> tuple[float, Placement, float]:
        """Return (pause_scale, placement, level_offset_db) at a story position."""
        p = min(1.0, max(0.0, position))

        def lerp(pair: tuple[float, float]) -> float:
            return pair[0] + p * (pair[1] - pair[0])

        return (
            lerp(self.pause_scale),
            Placement(
                azimuth_deg=lerp(self.azimuth_deg),
                elevation_deg=self.elevation_deg,
                distance_m=lerp(self.distance_m),
            ),
            lerp(self.level_db),
        )


# Presets. These are the user-visible pacing options.
ARCS: dict[str, Arc] = {
    "slow_burn": Arc(name="slow_burn"),
    "direct": Arc(
        name="direct",
        pause_scale=(0.8, 0.6),
        distance_m=(0.18, 0.12),
        level_db=(0.0, 1.5),
        azimuth_deg=(-15.0, -8.0),
    ),
    "unhurried": Arc(
        name="unhurried",
        pause_scale=(2.2, 1.4),
        distance_m=(0.35, 0.20),
        level_db=(-2.0, 0.0),
        azimuth_deg=(-45.0, -20.0),
    ),
}


def _equal_power_crossfade(
    a: np.ndarray, b: np.ndarray, overlap: int
) -> np.ndarray:
    """Join two stereo signals with an equal-power crossfade over `overlap` samples."""
    if overlap <= 0 or a.shape[0] < overlap or b.shape[0] < overlap:
        return np.concatenate([a, b], axis=0)
    fade = np.sqrt(np.linspace(0.0, 1.0, overlap))[:, None]
    head = a[:-overlap]
    blend = a[-overlap:] * (1.0 - fade) + b[:overlap] * fade
    tail = b[overlap:]
    return np.concatenate([head, blend, tail], axis=0)


def _match_loudness(mono: np.ndarray, rate: int, target_lufs: float) -> np.ndarray:
    """Bring one beat to a target loudness, tolerating very short beats."""
    meter = pyln.Meter(rate)
    # pyloudnorm needs at least a 400 ms block.
    if mono.size < int(rate * 0.45):
        return mono
    measured = meter.integrated_loudness(np.stack([mono, mono], axis=1))
    if not np.isfinite(measured) or measured < -70.0:
        return mono
    return mono * (10.0 ** ((target_lufs - measured) / 20.0))


@dataclass
class AssemblyReport:
    """Objective evidence that the seams are inaudible and the arc was applied."""

    duration_s: float = 0.0
    beat_count: int = 0
    join_discontinuities: list[float] = field(default_factory=list)
    beat_loudness_lufs: list[float] = field(default_factory=list)
    # Deviation of each beat from the loudness the arc asked for. This, not raw
    # spread, is the measure of assembly quality: the arc *wants* level to change
    # across a story, so spread includes intended variation.
    beat_loudness_error_lu: list[float] = field(default_factory=list)
    first_distance_m: float = 0.0
    last_distance_m: float = 0.0
    first_pause_s: float = 0.0
    last_pause_s: float = 0.0

    @property
    def worst_join_step(self) -> float:
        return max(self.join_discontinuities) if self.join_discontinuities else 0.0

    @property
    def loudness_spread_lu(self) -> float:
        """Total level range across beats, including the arc's intended change."""
        vals = [v for v in self.beat_loudness_lufs if np.isfinite(v)]
        return float(max(vals) - min(vals)) if len(vals) > 1 else 0.0

    @property
    def worst_loudness_error_lu(self) -> float:
        """Largest deviation from the arc's requested level. Should be near zero."""
        vals = [abs(v) for v in self.beat_loudness_error_lu if np.isfinite(v)]
        return float(max(vals)) if vals else 0.0

    def summary(self) -> str:
        return "\n".join(
            [
                f"beats: {self.beat_count}   duration: {self.duration_s:.2f}s",
                f"worst sample step at a join: {self.worst_join_step:.5f} "
                "(a click would show as a large step)",
                f"beat loudness: {self.loudness_spread_lu:.2f} LU spread "
                f"(arc-intended), worst error vs target {self.worst_loudness_error_lu:.3f} LU",
                f"arc distance: {self.first_distance_m:.2f}m -> {self.last_distance_m:.2f}m",
                f"arc pause:    {self.first_pause_s:.2f}s -> {self.last_pause_s:.2f}s",
            ]
        )


def assemble_episode(
    beats: list[Beat],
    hrtf: KemarHrtf,
    arc: Arc | None = None,
    rate: int = HRIR_RATE,
    bed: np.ndarray | None = None,
    bed_gain_db: float = -8.0,
    base_lufs: float = -24.0,
    crossfade_ms: float = 18.0,
    target_runtime_s: float | None = None,
) -> tuple[np.ndarray, AssemblyReport]:
    """Assemble recorded beats into a finished stereo episode.

    If `target_runtime_s` is given, pause lengths are scaled uniformly to hit it —
    which is how one recording yields both a short and a long cut.
    """
    if not beats:
        raise ValueError("no beats to assemble")
    arc = arc or ARCS["slow_burn"]
    report = AssemblyReport(beat_count=len(beats))

    # First pass: decide placement, level and pause for every beat.
    planned: list[tuple[np.ndarray, float]] = []
    pauses: list[float] = []
    for i, beat in enumerate(beats):
        position = i / max(1, len(beats) - 1)
        pause_scale, placement, level_offset = arc.at(position)
        if beat.placement is not None:
            placement = beat.placement

        matched = _match_loudness(beat.audio, rate, base_lufs + level_offset)
        rendered = render_binaural(matched, hrtf, placement)
        planned.append((rendered, placement.distance_m))
        pauses.append(max(0.0, beat.pause_after_s * pause_scale))

        meter = pyln.Meter(rate)
        if matched.size >= int(rate * 0.45):
            achieved = float(
                meter.integrated_loudness(np.stack([matched, matched], axis=1))
            )
            report.beat_loudness_lufs.append(achieved)
            report.beat_loudness_error_lu.append(achieved - (base_lufs + level_offset))

    # Optionally rescale silence to hit a runtime. Speech length is fixed; only
    # the spaces between beats are negotiable.
    if target_runtime_s is not None:
        speech_s = sum(r.shape[0] for r, _ in planned) / rate
        pause_total = sum(pauses[:-1]) if len(pauses) > 1 else 0.0
        wanted_pause = target_runtime_s - speech_s
        if pause_total > 1e-6 and wanted_pause > 0:
            factor = wanted_pause / pause_total
            pauses = [p * factor for p in pauses]

    report.first_distance_m = planned[0][1]
    report.last_distance_m = planned[-1][1]
    report.first_pause_s = pauses[0]
    report.last_pause_s = pauses[-2] if len(pauses) > 1 else pauses[-1]

    # Second pass: lay beats and silences down with crossfaded joins.
    overlap = int(rate * crossfade_ms / 1000.0)
    out = planned[0][0]
    for i in range(1, len(planned)):
        gap = int(pauses[i - 1] * rate)
        if gap > 0:
            out = np.concatenate([out, np.zeros((gap, 2))], axis=0)
            join_index = out.shape[0]
            out = _equal_power_crossfade(out, planned[i][0], overlap)
        else:
            join_index = out.shape[0]
            out = _equal_power_crossfade(out, planned[i][0], overlap)
        # Record the largest single-sample step near the join.
        lo = max(1, join_index - overlap - 4)
        hi = min(out.shape[0], join_index + overlap + 4)
        if hi > lo + 1:
            report.join_discontinuities.append(
                float(np.max(np.abs(np.diff(out[lo:hi], axis=0))))
            )

    # The continuous bed goes on last, spanning the whole episode. This is what
    # makes the joins disappear: the voice is discontinuous, the room is not.
    if bed is not None:
        out = mix_bed(out, bed, bed_gain_db=bed_gain_db, rate=rate)

    report.duration_s = out.shape[0] / rate
    return out, report

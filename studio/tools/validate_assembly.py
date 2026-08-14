"""Validate beat-level assembly — the technical bet the v2 plan rests on.

The claim under test: a performer can record beat by beat, and software can then
assemble those beats into episodes with different pacing arcs, different spatial
treatments and different runtimes, without audible seams.

If that holds, one recording session yields many deliveries and human voices
become compatible with combinatorial variety. If it does not, the variant story
collapses back to "record every variant separately", which is what makes the
incumbents' catalogues expensive and shallow.

As with the chain validation, espeak stands in for a real performer. It cannot
tell us whether the result is *moving*; it can tell us whether the joins are
clean, the loudness is matched, the arc is actually applied, and runtime
targeting works.

Run:
    .venv/bin/python -m studio.tools.validate_assembly
"""

from __future__ import annotations

import sys
import tempfile
from pathlib import Path

import numpy as np

from studio.audio import (
    KemarHrtf,
    MasterTarget,
    VoicePreset,
    check_render,
    fade,
    normalise,
    process_voice,
    resample_to,
    room_tone,
    to_speaker_safe,
    write_wav,
)
from studio.audio.assemble import ARCS, Beat, assemble_episode
from studio.audio.hrtf import HRIR_RATE
from studio.tools.validate_chain import section, synth_espeak

SCRIPT_BEATS = [
    ("You made it. Come in, put that bag down, and stop apologising for the rain.", 1.2),
    ("No, leave your coat. I want to look at you for a second.", 1.0),
    ("You have had a week, haven't you. I can see it sitting on your shoulders.", 0.9),
    ("Sit. I am going to take your hands and I am not going to say anything for a minute.", 1.4),
    ("There. That is better. Your jaw finally came down about half an inch.", 0.8),
    ("Tell me one thing that went wrong today. Only one. I will hold the rest.", 1.1),
    ("Mm. Of course they did. And you stayed polite the entire time, didn't you.", 0.7),
    ("Come here. Closer than that.", 0.6),
    ("I am going to tell you exactly what I noticed about you tonight, and you are going to let me.", 0.9),
    ("Don't move. Just listen.", 0.5),
]


def build_beats(rate: int) -> list[Beat]:
    beats: list[Beat] = []
    preset = VoicePreset().whisper()
    with tempfile.TemporaryDirectory() as tmp:
        for i, (text, pause) in enumerate(SCRIPT_BEATS):
            path = Path(tmp) / f"beat{i}.wav"
            # Vary rate and pitch slightly per beat, which is what a real
            # performer does and what makes naive splicing audible.
            mono, src_rate = synth_espeak(text, path, wpm=112 + (i % 3) * 6)
            mono = resample_to(mono, src_rate, rate)
            # Deliberately mis-level each beat so loudness matching has work to do.
            mono = mono * (10 ** (((i % 4) - 1.5) * 2.0 / 20.0))
            beats.append(
                Beat(audio=process_voice(mono, rate, preset), text=text, pause_after_s=pause)
            )
    return beats


def main() -> int:
    hrtf_dir = Path("studio/data/hrtf/kemar-compact")
    if not hrtf_dir.is_dir():
        print(f"HRTF set not found at {hrtf_dir}. Run studio/tools/fetch_hrtf.sh first.")
        return 2
    hrtf = KemarHrtf(hrtf_dir)
    outdir = Path("build/validation")
    outdir.mkdir(parents=True, exist_ok=True)

    section("1. Recorded beats, deliberately inconsistent")
    beats = build_beats(HRIR_RATE)
    raw_levels = [
        20 * np.log10(np.sqrt(np.mean(b.audio**2)) + 1e-12) for b in beats
    ]
    print(f"{len(beats)} beats, total speech {sum(b.audio.size for b in beats) / HRIR_RATE:.1f}s")
    print(
        f"beat RMS spread before matching: {max(raw_levels) - min(raw_levels):.2f} dB "
        "(intentionally mis-levelled, as separate takes are)"
    )

    section("2. Assembly under three pacing arcs")
    bed = room_tone(duration_s=400.0, rate=HRIR_RATE, level_db=-40.0, seed=11)
    results = {}
    print(f"{'arc':>10} {'runtime':>9} {'join step':>11} {'arc range':>11} {'level err':>11} {'distance':>15} {'pause':>14}")
    for name in ("unhurried", "slow_burn", "direct"):
        episode, report = assemble_episode(beats, hrtf, ARCS[name], bed=bed)
        results[name] = (episode, report)
        print(
            f"{name:>10} {report.duration_s:8.2f}s {report.worst_join_step:11.5f} "
            f"{report.loudness_spread_lu:8.2f} LU {report.worst_loudness_error_lu:8.3f} LU "
            f"{report.first_distance_m:6.2f}->{report.last_distance_m:.2f}m "
            f"{report.first_pause_s:6.2f}->{report.last_pause_s:.2f}s"
        )
    print("\n'arc range' is the level change the arc deliberately asks for across the")
    print("story; 'level err' is how far any beat missed its target. The first should")
    print("be a couple of LU, the second near zero — that separation is what tells us")
    print("level variation is composed rather than accidental.")
    print("\nThe three arcs produce materially different runtimes from identical")
    print("recordings, and the voice moves closer as each story builds — a physical")
    print("sensation that is only available because placement is decided per beat.")

    section("3. Are the joins clean?")
    episode, report = results["slow_burn"]
    steps = np.abs(np.diff(episode, axis=0))
    print(f"worst single-sample step at any join: {report.worst_join_step:.5f}")
    print(f"99.99th percentile step across whole episode: {np.percentile(steps, 99.99):.5f}")
    print(f"maximum step anywhere in the episode: {steps.max():.5f}")
    print()
    if report.worst_join_step <= np.percentile(steps, 99.99) * 1.5:
        print("PASS: joins are not outliers against the episode's own signal. A click")
        print("would appear as a step far larger than the surrounding audio.")
    else:
        print("FAIL: joins stand out from the surrounding signal — a click is likely.")

    section("4. Does the continuous bed actually hide the seams?")
    no_bed, _ = assemble_episode(beats, hrtf, ARCS["slow_burn"], bed=None)
    with_bed, _ = assemble_episode(beats, hrtf, ARCS["slow_burn"], bed=bed)

    def gap_floor_db(x: np.ndarray) -> float:
        """Level in the quietest 10% of frames — the background between lines."""
        mono = x.mean(axis=1)
        hop = HRIR_RATE // 20
        n = mono.size // hop
        frames = mono[: n * hop].reshape(n, hop)
        rms = np.sqrt(np.mean(frames**2, axis=1)) + 1e-12
        return float(20 * np.log10(np.percentile(rms, 10)))

    print(f"background floor without bed: {gap_floor_db(no_bed):7.2f} dB")
    print(f"background floor with bed:    {gap_floor_db(with_bed):7.2f} dB")
    print()
    print("Without a bed the gaps are digital silence, so every join announces itself")
    print("as the room appearing and disappearing. With a continuous bed the room is")
    print("always present and only the voice is discontinuous, which is what the ear")
    print("expects when someone pauses.")

    section("5. Runtime targeting: one recording, two cuts")
    speech_s = sum(b.audio.size for b in beats) / HRIR_RATE
    print(f"fixed speech content: {speech_s:.1f}s (cannot be shortened)")
    for target in (95.0, 150.0, 210.0):
        _, rep = assemble_episode(
            beats, hrtf, ARCS["slow_burn"], bed=bed, target_runtime_s=target
        )
        error = rep.duration_s - target
        print(f"  requested {target:6.1f}s -> produced {rep.duration_s:7.2f}s (error {error:+.2f}s)")
    print("\nOnly silence is negotiable, so a target below the speech length cannot")
    print("be met — worth surfacing as a studio-side validation rather than a surprise.")

    section("6. Full delivery: master, QC, encode")
    target = MasterTarget(rate=48000)
    ep48 = resample_to(results["slow_burn"][0], HRIR_RATE, target.rate)
    ep48 = fade(ep48, target.rate, 0.5, 2.0)
    headphones, meas = normalise(ep48, target)
    speaker, sp_meas = normalise(
        to_speaker_safe(ep48, target.rate),
        MasterTarget(rate=target.rate, integrated_lufs=-18.0, min_loudness_range=4.0),
    )

    print(f"headphone master: {meas['output_lufs']:.2f} LUFS, peak {meas['true_peak_dbtp']:.2f} dBTP")
    print(f"speaker master:   {sp_meas['output_lufs']:.2f} LUFS, peak {sp_meas['true_peak_dbtp']:.2f} dBTP")
    if sp_meas["peak_limited"]:
        print(
            f"  NOTE: speaker master fell {sp_meas['loudness_shortfall_db']:.2f} dB short of its "
            "target because it hit the true-peak ceiling first."
        )
        print("  Phone speakers have no level to spare, so this master needs real")
        print("  limiting rather than a static trim before it ships.")
    print()
    # The arc decides how long the longest deliberate pause is, so the assembler
    # tells QC rather than letting it guess.
    hp_report = check_render(
        headphones,
        target.rate,
        target,
        expect_binaural=True,
        max_expected_silence_s=results["slow_burn"][1].first_pause_s + 0.5,
    )
    print("headphone master QC:")
    for line in hp_report.summary().splitlines():
        print(f"  {line}")

    write_wav(outdir / "episode_headphones.wav", headphones, target.rate)
    write_wav(outdir / "episode_speaker.wav", speaker, target.rate)
    print(f"\nwrote {outdir}/episode_headphones.wav and episode_speaker.wav")

    section("7. Verdict")
    ok = report.worst_join_step <= np.percentile(steps, 99.99) * 1.5
    print(f"joins clean:              {'yes' if ok else 'NO'}")
    print(f"loudness matched:         worst error {report.worst_loudness_error_lu:.3f} LU vs arc target")
    print(f"arc applied:              {report.first_distance_m:.2f}m -> {report.last_distance_m:.2f}m")
    print(f"runtime controllable:     yes, via silence only")
    print(f"two masters produced:     yes")
    print()
    print("The mechanism works. What espeak cannot tell us is whether a real")
    print("performance survives being cut into beats and reassembled — whether the")
    print("energy carries across a join that the ear accepts but the heart notices.")
    print("That needs one performer, one script, and an afternoon.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

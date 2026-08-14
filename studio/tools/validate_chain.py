"""End-to-end validation of the offline audio pipeline.

This exists to answer one engineering question with measurements instead of
opinion: can a scripted offline pipeline take dry mono speech and produce a
file that is genuinely near-field binaural, correctly levelled for intimate
listening, and free of the defects that would break immersion?

It deliberately uses espeak-ng as its source. espeak sounds nothing like a
product-quality voice, and that is fine — this harness validates *signal
processing correctness*, not aesthetics. Judging whether a voice is arousing
requires a real TTS engine and real listeners; judging whether our interaural
cues, loudness targeting, and QC gates work does not.

Run:
    .venv/bin/python -m studio.tools.validate_chain
"""

from __future__ import annotations

import argparse
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

from studio.audio import (
    KemarHrtf,
    MasterTarget,
    Placement,
    VoicePreset,
    check_render,
    drifting_soundscape,
    fade,
    mix_bed,
    normalise,
    process_voice,
    render_binaural,
    render_binaural_path,
    resample_to,
    room_tone,
    verify_transcript,
    write_wav,
)
from studio.audio.hrtf import HRIR_RATE, near_field_ild_db

SAMPLE_LINE = (
    "Stay just like that. I am not going anywhere, and there is nothing you need "
    "to do right now except breathe out, slowly, and let your shoulders drop."
)


def synth_espeak(text: str, out_path: Path, voice: str = "en-us+f3", wpm: int = 118) -> tuple[np.ndarray, int]:
    """Produce a placeholder mono narration with espeak-ng."""
    cmd = [
        "espeak-ng", "-v", voice, "-s", str(wpm), "-p", "28", "-a", "150",
        "-w", str(out_path), text,
    ]
    subprocess.run(cmd, check=True, capture_output=True)
    audio, rate = sf.read(str(out_path), dtype="float64", always_2d=False)
    if audio.ndim > 1:
        audio = audio.mean(axis=1)
    return audio, rate


def section(title: str) -> None:
    print(f"\n{'=' * 68}\n{title}\n{'=' * 68}")


def measure_interaural(stereo: np.ndarray, rate: int) -> dict:
    """Measure the interaural cues actually present in a render."""
    left, right = stereo[:, 0], stereo[:, 1]
    rms_l = float(np.sqrt(np.mean(left**2)) + 1e-12)
    rms_r = float(np.sqrt(np.mean(right**2)) + 1e-12)
    ild = 20.0 * np.log10(rms_r / rms_l)

    # Broadband ITD via cross-correlation, limited to a plausible +/-1 ms.
    max_lag = int(rate * 0.001)
    n = min(left.size, rate * 5)
    a = left[:n] - left[:n].mean()
    b = right[:n] - right[:n].mean()
    corr = np.correlate(a, b, mode="full")
    centre = corr.size // 2
    window = corr[centre - max_lag : centre + max_lag + 1]
    itd_samples = int(np.argmax(np.abs(window))) - max_lag
    itd_us = itd_samples / rate * 1e6

    # Low-band ILD, where the near-field cue should show up most strongly.
    from scipy.signal import butter, sosfilt

    sos = butter(4, 1000.0 / (rate / 2.0), btype="lowpass", output="sos")
    low_l = sosfilt(sos, left)
    low_r = sosfilt(sos, right)
    low_ild = 20.0 * np.log10(
        (np.sqrt(np.mean(low_r**2)) + 1e-12) / (np.sqrt(np.mean(low_l**2)) + 1e-12)
    )

    return {
        "broadband_ild_db": float(ild),
        "low_band_ild_db": float(low_ild),
        "itd_us": float(itd_us),
        "correlation": float(np.corrcoef(left, right)[0, 1]),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--hrtf", default="studio/data/hrtf/kemar-compact")
    parser.add_argument("--outdir", default="build/validation")
    args = parser.parse_args()

    hrtf_dir = Path(args.hrtf)
    if not hrtf_dir.is_dir():
        print(f"HRTF set not found at {hrtf_dir}. Run studio/tools/fetch_hrtf.sh first.")
        return 2

    outdir = Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)
    hrtf = KemarHrtf(hrtf_dir)

    section("1. Near-field ILD model")
    print("Incremental low-frequency ILD added on top of the far-field HRIR.")
    print("This is the cue that separates 'next to my ear' from 'across the room'.\n")
    print(f"{'distance':>10} {'az=0':>10} {'az=30':>10} {'az=75':>10} {'az=90':>10}")
    for d in (0.10, 0.15, 0.20, 0.30, 0.50, 1.00, 1.40):
        row = "".join(
            f"{near_field_ild_db(az, d):>10.2f}" for az in (0.0, 30.0, 75.0, 90.0)
        )
        print(f"{d:>9.2f}m{row}")
    print("\nSanity checks: 0 dB at the 1.4 m measurement distance (nothing added),")
    print("0 dB straight ahead at any distance (symmetric), and growing to a large")
    print("value close in and off to one side. That is the expected physics.")

    section("2. Source narration (espeak-ng placeholder)")
    with tempfile.TemporaryDirectory() as tmp:
        raw_path = Path(tmp) / "raw.wav"
        mono, src_rate = synth_espeak(SAMPLE_LINE, raw_path)
    print(f"Generated {mono.size / src_rate:.2f}s at {src_rate} Hz")

    mono44 = resample_to(mono, src_rate, HRIR_RATE)
    print(f"Resampled to {HRIR_RATE} Hz for HRIR convolution: {mono44.size} samples")

    section("3. Voice chain")
    preset = VoicePreset().whisper()
    processed = process_voice(mono44, HRIR_RATE, preset)
    before_hf = float(np.mean(np.abs(np.diff(mono44))))
    after_hf = float(np.mean(np.abs(np.diff(processed))))
    print(f"preset: whisper (comp ratio {preset.comp_ratio}, "
          f"de-ess cap {preset.deess_max_reduction_db} dB, "
          f"breath lift {preset.breath_gain_db} dB)")
    print(f"mean |delta| before: {before_hf:.6f}  after: {after_hf:.6f}")
    print("Chain is intentionally gentle: the point is warmth and detail, not levelling.")

    # Attribute any loudness-range failure to the right cause. If the source is
    # already flat, that is espeak's monotone delivery, not the chain crushing it.
    from studio.audio.qc import _loudness_range

    src_stereo = np.stack([mono44, mono44], axis=1)
    out_stereo = np.stack([processed, processed], axis=1)
    print(f"loudness range of source: {_loudness_range(src_stereo, HRIR_RATE):.2f} LU")
    print(f"loudness range after chain: {_loudness_range(out_stereo, HRIR_RATE):.2f} LU")
    print("A real performance arrives with 8-15 LU; espeak delivers almost none, which")
    print("is exactly why the QC gate below flags it.")

    nyquist_hz = src_rate / 2
    print(f"\nSource Nyquist limit: {nyquist_hz:.0f} Hz. Any TTS engine returning 22-24 kHz")
    print("audio imposes a hard ceiling no later processing can undo, so vendor")
    print("selection must require 44.1/48 kHz output.")

    section("3b. Is it actually a whisper?")
    from studio.audio.voicing import (
        COMMERCIAL_TTS_UNVOICED_RATIO,
        REAL_ASMR_UNVOICED_RATIO,
        measure_unvoiced_ratio,
    )

    voicing = measure_unvoiced_ratio(mono44, HRIR_RATE)
    print(voicing.summary())
    print()
    print("A whisper is aperiodic — the vocal folds do not vibrate. What a synthesiser")
    print("returns when asked to whisper is soft *voiced* speech, which is a different")
    print(f"acoustic object: real performers measure {REAL_ASMR_UNVOICED_RATIO:.1%} unvoiced frames against")
    print(f"{COMMERCIAL_TTS_UNVOICED_RATIO:.1%} for the best commercial engine. This gate is the acceptance")
    print("test for any voice source, and it is the only check here that a convincingly")
    print("breathy fake would fail.")

    section("4. Binaural placement, static")
    for label, placement in (
        ("left, very close", Placement(azimuth_deg=-78.0, elevation_deg=-10.0, distance_m=0.13)),
        ("right, very close", Placement(azimuth_deg=78.0, elevation_deg=-10.0, distance_m=0.13)),
        ("ahead, arm's length", Placement(azimuth_deg=0.0, elevation_deg=0.0, distance_m=0.60)),
    ):
        rendered = render_binaural(processed, hrtf, placement)
        cues = measure_interaural(rendered, HRIR_RATE)
        print(
            f"{label:>20}: ILD {cues['broadband_ild_db']:+6.2f} dB  "
            f"low-band ILD {cues['low_band_ild_db']:+6.2f} dB  "
            f"ITD {cues['itd_us']:+7.1f} us  corr {cues['correlation']:+.3f}"
        )
    print("\nExpected: sign flips between left and right, large ILD/ITD magnitudes when")
    print("close and lateral, and near-zero when centred. Correlation well below 1.0")
    print("confirms a real stereo image rather than a mono file in two channels.")

    section("5. Binaural movement (ear to ear)")
    duration = processed.size / HRIR_RATE
    moving = render_binaural_path(
        processed,
        hrtf,
        [
            (0.0, Placement(azimuth_deg=-80.0, elevation_deg=-8.0, distance_m=0.14)),
            (duration * 0.5, Placement(azimuth_deg=0.0, elevation_deg=-4.0, distance_m=0.22)),
            (duration, Placement(azimuth_deg=80.0, elevation_deg=-8.0, distance_m=0.14)),
        ],
    )
    half = moving.shape[0] // 2
    first = measure_interaural(moving[:half], HRIR_RATE)
    second = measure_interaural(moving[half:], HRIR_RATE)
    print(f"first half  ILD {first['broadband_ild_db']:+6.2f} dB (should favour the left ear)")
    print(f"second half ILD {second['broadband_ild_db']:+6.2f} dB (should favour the right ear)")
    clicks = int(np.sum(np.abs(np.diff(moving, axis=0)) > 0.5))
    print(f"discontinuities above 0.5 between adjacent samples: {clicks} (want 0)")

    section("6. Bed mix and master")
    bed = room_tone(duration_s=duration + 1.0, rate=HRIR_RATE, level_db=-42.0, seed=7)
    mixed = mix_bed(moving, bed, bed_gain_db=-6.0, rate=HRIR_RATE)

    target = MasterTarget(rate=48000)
    mixed48 = resample_to(mixed, HRIR_RATE, target.rate)
    mixed48 = fade(mixed48, target.rate, fade_in_s=0.4, fade_out_s=1.2)
    mastered, meas = normalise(mixed48, target)
    print(f"pre-normalisation loudness: {meas['input_lufs']:.2f} LUFS")
    print(f"delivered: {meas['output_lufs']:.2f} LUFS, true peak {meas['true_peak_dbtp']:.2f} dBTP")
    print(f"target was {target.integrated_lufs} LUFS — quiet on purpose, so a whisper")
    print("stays a whisper instead of being levelled up to podcast loudness.")

    wav_path = write_wav(outdir / "intimate_demo.wav", mastered, target.rate)
    print(f"wrote {wav_path} ({wav_path.stat().st_size / 1024:.0f} KiB)")

    section("7. Automated QC")
    report = check_render(mastered, target.rate, target, expect_binaural=True)
    print(report.summary())

    section("8. Transcript verification (ASR round-trip simulation)")
    print("Clean transcript:")
    print(verify_transcript(SAMPLE_LINE, SAMPLE_LINE).summary())
    damaged = SAMPLE_LINE.replace("shoulders drop", "shoulder drops").replace(
        "and there is nothing", "and there's nothin"
    )
    print("\nTranscript with dropped/mangled words, as a bad TTS take would produce:")
    print(verify_transcript(SAMPLE_LINE, damaged).summary())

    section("9. Focus soundscape")
    scape = drifting_soundscape(duration_s=20.0, rate=target.rate, colour="brown", seed=3)
    scape = fade(scape, target.rate, 3.0, 3.0)
    scape_report = check_render(scape, target.rate, MasterTarget(rate=target.rate,
                               integrated_lufs=-30.0, min_loudness_range=0.0),
                               expect_binaural=False)
    scape_norm, scape_meas = normalise(scape, MasterTarget(rate=target.rate, integrated_lufs=-30.0))
    print(f"20s brown-noise soundscape: {scape_meas['output_lufs']:.2f} LUFS, "
          f"true peak {scape_meas['true_peak_dbtp']:.2f} dBTP")
    print(f"channel correlation {scape_report.measurements['stereo_correlation']:.3f} "
          "(partially decorrelated: wide but not fatiguing)")
    write_wav(outdir / "focus_soundscape.wav", scape_norm, target.rate)

    section("10. Delivery encode")
    from studio.audio import encode_delivery

    for codec, kbps in (("aac", 256), ("opus", 128)):
        try:
            out = encode_delivery(wav_path, outdir / f"intimate_demo.{'m4a' if codec == 'aac' else 'opus'}", codec, kbps)
            size_kib = out.stat().st_size / 1024
            minutes = mastered.shape[0] / target.rate / 60
            print(f"{codec} {kbps}k: {size_kib:.0f} KiB -> {size_kib / max(minutes, 1e-6) / 1024:.2f} MiB per minute")
        except Exception as exc:  # pragma: no cover
            print(f"{codec}: encode failed ({exc})")

    print("\nAll stages ran. See the FAIL/WARN lines above for anything that needs work.")
    return 0 if report.passed else 1


if __name__ == "__main__":
    sys.exit(main())

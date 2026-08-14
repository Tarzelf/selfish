#!/usr/bin/env python3
"""Acoustic screen of TTS audition clips against the Jasper voice spec
(docs/PLAN.md 4.3: low-but-not-bass pitch, breathy, warm, unhurried).

For each clip: median F0 via autocorrelation on voiced frames, pitch spread,
speech rate proxy (voiced ratio), pause fraction, and a spectral-tilt proxy
for warmth (energy below 2 kHz vs above). This is a *screen* to rank
candidates for human listening, not a substitute for it.
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np

SR = 16000
FRAME = 512          # 32 ms
HOP = 256
F0_MIN, F0_MAX = 55, 320


def decode(path: Path) -> np.ndarray:
    raw = subprocess.run(
        ["ffmpeg", "-v", "quiet", "-i", str(path), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
        capture_output=True, check=True,
    ).stdout
    return np.frombuffer(raw, dtype=np.float32)


def frame_f0(frame: np.ndarray) -> float:
    frame = frame - frame.mean()
    if np.max(np.abs(frame)) < 1e-4:
        return 0.0
    corr = np.correlate(frame, frame, mode="full")[len(frame) - 1:]
    corr /= corr[0] + 1e-9
    lo, hi = int(SR / F0_MAX), int(SR / F0_MIN)
    if hi >= len(corr):
        return 0.0
    seg = corr[lo:hi]
    peak = np.argmax(seg)
    if seg[peak] < 0.5:  # voicing threshold
        return 0.0
    return SR / (lo + peak)


def analyze(path: Path) -> dict:
    x = decode(path)
    n_frames = (len(x) - FRAME) // HOP
    f0s, energies = [], []
    for i in range(n_frames):
        fr = x[i * HOP: i * HOP + FRAME]
        energies.append(float(np.sqrt(np.mean(fr ** 2))))
        f0s.append(frame_f0(fr))
    f0s = np.array(f0s)
    energies = np.array(energies)
    voiced = f0s > 0
    sil_thresh = np.percentile(energies, 90) * 0.06
    silent = energies < sil_thresh

    # Warmth proxy: spectral energy ratio below 2 kHz.
    spec = np.abs(np.fft.rfft(x[: SR * 20] if len(x) > SR * 20 else x))
    freqs = np.fft.rfftfreq(len(x[: SR * 20]) if len(x) > SR * 20 else len(x), 1 / SR)
    low = spec[(freqs > 60) & (freqs < 2000)].sum()
    high = spec[(freqs >= 2000) & (freqs < 8000)].sum()

    return {
        "file": str(path),
        "dur_sec": round(len(x) / SR, 1),
        "f0_median": round(float(np.median(f0s[voiced])), 1) if voiced.any() else None,
        "f0_p10": round(float(np.percentile(f0s[voiced], 10)), 1) if voiced.any() else None,
        "f0_p90": round(float(np.percentile(f0s[voiced], 90)), 1) if voiced.any() else None,
        "voiced_ratio": round(float(voiced.mean()), 3),
        "pause_ratio": round(float(silent.mean()), 3),
        "warmth_low_high_ratio": round(float(low / (high + 1e-9)), 2),
    }


def main():
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "out/tts-audition")
    genders = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}
    rows = []
    for mp3 in sorted(root.glob("*/whisper-close.mp3")):
        voice = mp3.parent.name
        try:
            row = {"voice": voice, "gender": genders.get(voice, "?"), **analyze(mp3)}
            rows.append(row)
        except Exception as e:  # noqa: BLE001
            rows.append({"voice": voice, "error": str(e)})
    print(json.dumps(rows, indent=1))


if __name__ == "__main__":
    main()

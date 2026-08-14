import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Preview-build playback engine.
 *
 * The production app streams pre-rendered, watermarked audio from the CDN via
 * expo-audio. This preview has no audio assets in the repo, so the player
 * simulates a session clock (at an accelerated rate) to make the full player
 * UX — variant switching, progress, the Continue rail — testable end to end.
 */

/** Simulated seconds of "audio" that elapse per real second. */
const PREVIEW_SPEED = 30;

export interface MockPlayback {
  playing: boolean;
  /** 0..1 */
  progress: number;
  elapsedSec: number;
  toggle: () => void;
  seekBy: (deltaSec: number) => void;
  /** Jump to a fraction (0..1), preserving play state. Used by variant switching. */
  seekTo: (fraction: number) => void;
}

export function useMockPlayback(durationMin: number, onProgress?: (p: number) => void): MockPlayback {
  const durationSec = durationMin * 60;
  const [playing, setPlaying] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setElapsedSec((prev) => Math.min(prev + PREVIEW_SPEED / 4, durationSec));
    }, 250);
    return () => clearInterval(interval);
  }, [playing, durationSec]);

  // Progress side effects live outside the state updater (updaters must stay
  // pure) — this is also what notifies the Continue rail.
  useEffect(() => {
    if (durationSec === 0) return;
    if (elapsedSec >= durationSec) setPlaying(false);
    if (elapsedSec > 0) onProgressRef.current?.(elapsedSec / durationSec);
  }, [elapsedSec, durationSec]);

  const toggle = useCallback(() => setPlaying((p) => !p), []);

  const seekBy = useCallback(
    (deltaSec: number) =>
      setElapsedSec((prev) => Math.max(0, Math.min(prev + deltaSec, durationSec))),
    [durationSec],
  );

  const seekTo = useCallback(
    (fraction: number) => setElapsedSec(Math.max(0, Math.min(fraction, 1)) * durationSec),
    [durationSec],
  );

  return { playing, progress: durationSec === 0 ? 0 : elapsedSec / durationSec, elapsedSec, toggle, seekBy, seekTo };
}

export function formatClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

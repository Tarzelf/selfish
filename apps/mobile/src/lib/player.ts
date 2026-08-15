import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Unified session playback.
 *
 * When a bundled engine-preview clip exists for the variant (see
 * data/audio-map.ts) we play real audio via expo-audio. Otherwise we simulate
 * a session clock at an accelerated rate so the full player UX stays testable
 * without shipping hours of audio in the repo.
 */

/** Simulated seconds of "audio" that elapse per real second (mock mode only). */
const PREVIEW_SPEED = 30;

export interface Playback {
  playing: boolean;
  /** 0..1 */
  progress: number;
  elapsedSec: number;
  durationSec: number;
  /** True when playing a real bundled clip rather than the simulated clock. */
  isReal: boolean;
  toggle: () => void;
  seekBy: (deltaSec: number) => void;
  /** Jump to a fraction (0..1), preserving play state. Used by variant switching. */
  seekTo: (fraction: number) => void;
  /** The Again button: start over and play. */
  restart: () => void;
}

export function usePlayback(
  listedDurationMin: number,
  source: number | null,
  onProgress?: (p: number) => void,
): Playback {
  const isReal = source != null;
  const player = useAudioPlayer(source);
  const status = useAudioPlayerStatus(player);

  const mockDurationSec = listedDurationMin * 60;
  const [mockPlaying, setMockPlaying] = useState(false);
  const [mockElapsed, setMockElapsed] = useState(0);
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  // ——— Mock clock ———
  useEffect(() => {
    if (isReal || !mockPlaying) return;
    const interval = setInterval(() => {
      setMockElapsed((prev) => Math.min(prev + PREVIEW_SPEED / 4, mockDurationSec));
    }, 250);
    return () => clearInterval(interval);
  }, [isReal, mockPlaying, mockDurationSec]);

  useEffect(() => {
    if (isReal || mockDurationSec === 0) return;
    if (mockElapsed >= mockDurationSec) setMockPlaying(false);
    if (mockElapsed > 0) onProgressRef.current?.(mockElapsed / mockDurationSec);
  }, [isReal, mockElapsed, mockDurationSec]);

  // ——— Real playback progress ———
  const realDuration = status.duration > 0 ? status.duration : 0;
  useEffect(() => {
    if (!isReal || realDuration === 0 || status.currentTime === 0) return;
    onProgressRef.current?.(Math.min(status.currentTime / realDuration, 1));
  }, [isReal, status.currentTime, realDuration]);

  const toggle = useCallback(() => {
    if (!isReal) {
      setMockPlaying((p) => !p);
      return;
    }
    if (status.playing) {
      player.pause();
    } else {
      // Restart finished clips from the top.
      if (realDuration > 0 && status.currentTime >= realDuration - 0.05) player.seekTo(0);
      player.play();
    }
  }, [isReal, status.playing, status.currentTime, realDuration, player]);

  const seekBy = useCallback(
    (deltaSec: number) => {
      if (!isReal) {
        setMockElapsed((prev) => Math.max(0, Math.min(prev + deltaSec, mockDurationSec)));
        return;
      }
      player.seekTo(Math.max(0, Math.min(status.currentTime + deltaSec, realDuration)));
    },
    [isReal, mockDurationSec, player, status.currentTime, realDuration],
  );

  const seekTo = useCallback(
    (fraction: number) => {
      const f = Math.max(0, Math.min(fraction, 1));
      if (!isReal) {
        setMockElapsed(f * mockDurationSec);
        return;
      }
      if (realDuration > 0) player.seekTo(f * realDuration);
    },
    [isReal, mockDurationSec, player, realDuration],
  );

  const restart = useCallback(() => {
    if (!isReal) {
      setMockElapsed(0);
      setMockPlaying(true);
      return;
    }
    player.seekTo(0);
    player.play();
  }, [isReal, player]);

  if (isReal) {
    const durationSec = realDuration || 1;
    return {
      playing: status.playing,
      progress: Math.min(status.currentTime / durationSec, 1),
      elapsedSec: status.currentTime,
      durationSec: realDuration,
      isReal: true,
      toggle,
      seekBy,
      seekTo,
      restart,
    };
  }

  return {
    playing: mockPlaying,
    progress: mockDurationSec === 0 ? 0 : mockElapsed / mockDurationSec,
    elapsedSec: mockElapsed,
    durationSec: mockDurationSec,
    isReal: false,
    toggle,
    seekBy,
    seekTo,
    restart,
  };
}

export function formatClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = Math.floor(totalSec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

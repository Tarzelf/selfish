import type { Line } from '../types';

export function line(text: string, pauseAfterMs = 1000, rate?: number): Line {
  return rate === undefined ? { text, pauseAfterMs } : { text, pauseAfterMs, rate };
}

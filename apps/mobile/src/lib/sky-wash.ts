import type { AtmospherePart } from '@/lib/types';

/** The photo may be a bright sunrise. Ink is #f5f5f7. Never let the wash go clear. */
export function skyWash(part: AtmospherePart): {
  photoOpacity: number;
  colors: readonly [string, string, string, string];
  locations: readonly [number, number, number, number];
} {
  if (part === 'morning') {
    return {
      photoOpacity: 0.18,
      colors: ['rgba(6,6,8,0.88)', 'rgba(6,6,8,0.80)', 'rgba(6,6,8,0.90)', '#060608'],
      locations: [0, 0.32, 0.68, 1],
    };
  }
  return {
    photoOpacity: 0.42,
    colors: ['rgba(6,6,8,0.72)', 'rgba(6,6,8,0.48)', 'rgba(6,6,8,0.78)', '#060608'],
    locations: [0, 0.28, 0.68, 1],
  };
}

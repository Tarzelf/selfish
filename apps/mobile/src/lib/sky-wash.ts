import type { AtmospherePart } from '@/lib/types';

/** The photo may be a bright sunrise. Ink is #f5f5f7. Never let the wash go clear. */
export function skyWash(part: AtmospherePart): {
  photoOpacity: number;
  colors: readonly [string, string, string, string];
  locations: readonly [number, number, number, number];
} {
  if (part === 'morning') {
    return {
      photoOpacity: 0.34,
      colors: ['rgba(6,6,8,0.68)', 'rgba(6,6,8,0.52)', 'rgba(6,6,8,0.76)', '#060608'],
      locations: [0, 0.3, 0.66, 1],
    };
  }
  return {
    photoOpacity: 0.58,
    colors: ['rgba(6,6,8,0.52)', 'rgba(6,6,8,0.3)', 'rgba(6,6,8,0.64)', '#060608'],
    locations: [0, 0.28, 0.68, 1],
  };
}

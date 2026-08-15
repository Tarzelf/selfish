import { Platform } from 'react-native';

import type { AtmospherePart } from '@/lib/types';

/**
 * Talkify-grade materials: photographic world, near-black ink, dark glass.
 * Type is New York + SF. Accent is amber→ember, not purple-gold.
 */

export interface Palette {
  bg: string;
  surface: string;
  surfaceRaised: string;
  surfacePressed: string;
  border: string;
  borderSoft: string;
  text: string;
  textDim: string;
  textFaint: string;
  onAccent: string;
  gold: string;
  goldSoft: string;
  ember: string;
  rose: string;
  roseSoft: string;
  heatComfort: string;
  heatSlowBurn: string;
  heatSpicy: string;
  success: string;
  danger: string;
  glassTint: string;
  glassBorder: string;
  lamp: string;
  status: 'light' | 'dark';
}

const INK = {
  text: '#F5F5F7',
  textDim: 'rgba(245,245,247,0.64)',
  textFaint: 'rgba(245,245,247,0.40)',
  onAccent: '#1A1006',
  gold: '#FFB457',
  goldSoft: 'rgba(255, 150, 80, 0.14)',
  ember: '#FF7847',
  rose: '#E8A0B0',
  roseSoft: 'rgba(232, 160, 176, 0.14)',
  heatComfort: '#93B8A6',
  heatSlowBurn: '#FFB457',
  heatSpicy: '#FF7847',
  success: '#8FBF9F',
  danger: '#E07A86',
  glassTint: 'rgba(12, 12, 16, 0.88)',
  glassBorder: 'rgba(245,245,247,0.12)',
  lamp: 'rgba(255, 180, 87, 0.28)',
  status: 'light' as const,
};

export const EVENING: Palette = {
  bg: '#060608',
  surface: 'rgba(16, 16, 20, 0.72)',
  surfaceRaised: 'rgba(22, 22, 28, 0.82)',
  surfacePressed: 'rgba(28, 28, 34, 0.9)',
  border: 'rgba(245,245,247,0.14)',
  borderSoft: 'rgba(245,245,247,0.10)',
  ...INK,
};

export const MORNING: Palette = {
  bg: '#060608',
  surface: 'rgba(16, 16, 20, 0.88)',
  surfaceRaised: 'rgba(22, 22, 28, 0.92)',
  surfacePressed: 'rgba(28, 28, 34, 0.96)',
  border: 'rgba(245,245,247,0.16)',
  borderSoft: 'rgba(245,245,247,0.10)',
  ...INK,
};

export const PALETTES: Record<AtmospherePart, Palette> = {
  evening: EVENING,
  morning: MORNING,
};

/** @deprecated Prefer useTheme().palette */
export const palette = EVENING;

export function heatColorFor(p: Palette): Record<string, string> {
  return {
    comfort: p.heatComfort,
    'slow-burn': p.heatSlowBurn,
    spicy: p.heatSpicy,
  };
}

export const heatColor: Record<string, string> = heatColorFor(EVENING);

export const fonts = {
  display: Platform.select({
    ios: 'New York',
    android: 'serif',
    default: 'ui-serif, "New York", Newsreader, "Iowan Old Style", Palatino, Georgia, serif',
  })!,
  body: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", system-ui, sans-serif',
  })!,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

/** Space reserved for the floating glass dock. */
export const TAB_ISLAND_SPACE = 88;

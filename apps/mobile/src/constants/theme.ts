import { Platform } from 'react-native';

import type { AtmospherePart } from '@/lib/types';

/**
 * Selfish design system.
 * Two atmospheres: morning (linen, open window) and evening (dreamy summer night, in bed).
 * Type is SF-adjacent and optically tight — Apple-crisp, not purple-mud.
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

export const EVENING: Palette = {
  bg: '#0A0E1A',
  surface: 'rgba(16, 18, 32, 0.38)',
  surfaceRaised: 'rgba(28, 26, 44, 0.52)',
  surfacePressed: 'rgba(40, 34, 56, 0.66)',
  border: 'rgba(255,255,255,0.14)',
  borderSoft: 'rgba(255,255,255,0.08)',
  text: '#F7F1E8',
  textDim: '#C9BBA8',
  textFaint: '#8F8274',
  onAccent: '#1A140C',
  gold: '#E8C48A',
  goldSoft: 'rgba(232, 196, 138, 0.16)',
  rose: '#E0A0B0',
  roseSoft: 'rgba(224, 160, 176, 0.14)',
  heatComfort: '#93B8A6',
  heatSlowBurn: '#E8C48A',
  heatSpicy: '#E08A7A',
  success: '#8FBF9F',
  danger: '#E07A86',
  glassTint: 'rgba(18, 16, 28, 0.14)',
  glassBorder: 'rgba(255,255,255,0.38)',
  lamp: 'rgba(232, 140, 70, 0.28)',
  status: 'light',
};

export const MORNING: Palette = {
  bg: '#F3E8D8',
  surface: 'rgba(255, 252, 247, 0.46)',
  surfaceRaised: 'rgba(255, 255, 255, 0.7)',
  surfacePressed: 'rgba(255, 246, 236, 0.86)',
  border: 'rgba(70, 50, 36, 0.14)',
  borderSoft: 'rgba(70, 50, 36, 0.08)',
  text: '#1C1612',
  textDim: '#6A5A4C',
  textFaint: '#9A8A7A',
  onAccent: '#1C1612',
  gold: '#A8742A',
  goldSoft: 'rgba(168, 116, 42, 0.14)',
  rose: '#C46A7A',
  roseSoft: 'rgba(196, 106, 122, 0.12)',
  heatComfort: '#4F8A72',
  heatSlowBurn: '#A8742A',
  heatSpicy: '#C45A4A',
  success: '#3F7A58',
  danger: '#C44A56',
  glassTint: 'rgba(255, 252, 247, 0.28)',
  glassBorder: 'rgba(255,255,255,0.78)',
  lamp: 'rgba(255, 210, 150, 0.45)',
  status: 'dark',
};

export const PALETTES: Record<AtmospherePart, Palette> = {
  evening: EVENING,
  morning: MORNING,
};

/** @deprecated Prefer useTheme().palette — kept so untouched screens still render evening. */
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
    ios: 'Iowan Old Style',
    android: 'serif',
    default: 'Newsreader, "Iowan Old Style", Palatino, "Palatino Linotype", Georgia, serif',
  })!,
  body: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif',
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

/** Space reserved for the floating glass tab island. */
export const TAB_ISLAND_SPACE = 100;

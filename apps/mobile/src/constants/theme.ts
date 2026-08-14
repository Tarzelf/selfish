import { Platform } from 'react-native';

/**
 * Selfish design system.
 * Dark, warm, wine-and-candlelight. Meditation-app calm with a wicked streak.
 * One theme only: this app is a nighttime object.
 */
export const palette = {
  // Surfaces
  bg: '#141019',
  surface: '#1D1626',
  surfaceRaised: '#261D31',
  surfacePressed: '#2E2340',
  border: '#37294A',
  borderSoft: '#2A2038',

  // Text
  text: '#F3EDF7',
  textDim: '#A796BC',
  textFaint: '#6E5E85',
  onAccent: '#1E1526',

  // Brand accents
  gold: '#DFAE72',
  goldSoft: '#4A3A28',
  rose: '#D98A9E',
  roseSoft: '#422733',

  // Heat levels
  heatComfort: '#93B8A6',
  heatSlowBurn: '#DFAE72',
  heatSpicy: '#D97A6E',

  // Semantic
  success: '#8FBF9F',
  danger: '#D96E7C',
} as const;

export const heatColor: Record<string, string> = {
  comfort: palette.heatComfort,
  'slow-burn': palette.heatSlowBurn,
  spicy: palette.heatSpicy,
};

export const fonts = {
  display: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' })!,
  body: Platform.select({ ios: 'System', android: 'sans-serif', default: 'system-ui, sans-serif' })!,
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

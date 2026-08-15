import { Platform } from 'react-native';

/**
 * Selfish design system — rebuilt for the woman who actually opens this at 11pm.
 *
 * Rule: tokens → primitives → screens. Screens almost never invent a color,
 * font, radius, or space. If a screen needs a new one, it belongs here first.
 *
 * Less is more. One room (ink). One paper (bone). One metal (ember), used rarely.
 * The name is the mark: sentence-case italic, never tracked gold SELFISH.
 * Serif italic is only for the greeting, the session title, and the wordmark.
 */
export const palette = {
  ink: '#0F0D10',
  inkLift: '#17141A',
  inkHigh: '#1E1A21',
  restInk: '#0E1012',
  line: 'rgba(240,232,223,0.08)',

  bone: '#F0E8DF',
  boneDim: '#A89B90',
  boneMute: '#6E655E',
  onBone: '#0F0D10',

  ember: '#B8956A',
  blush: '#C48B8F',
  rest: '#8A9A96',

  heatComfort: '#8FA89A',
  heatSlowBurn: '#B8956A',
  heatSpicy: '#C47B72',

  danger: '#C47B7B',
  success: '#8FA89A',

  // Back-compat aliases so leftover screens do not invent a second palette.
  bg: '#0F0D10',
  surface: '#17141A',
  surfaceRaised: '#1E1A21',
  surfacePressed: '#241F28',
  border: 'rgba(240,232,223,0.10)',
  borderSoft: 'rgba(240,232,223,0.06)',
  text: '#F0E8DF',
  textDim: '#A89B90',
  textFaint: '#6E655E',
  gold: '#B8956A',
  goldSoft: '#2A231C',
  rose: '#C48B8F',
  roseSoft: '#2A1C20',
  onAccent: '#0F0D10',
} as const;

export const heatColor: Record<string, string> = {
  comfort: palette.heatComfort,
  'slow-burn': palette.heatSlowBurn,
  spicy: palette.heatSpicy,
};

/** Newsreader is loaded in the root layout; system serif is the fallback. */
export const fonts = {
  display: 'NewsreaderItalic',
  displayRoman: 'Newsreader',
  body: Platform.select({ ios: 'System', android: 'sans-serif', default: 'system-ui, sans-serif' })!,
} as const;

export const type = {
  wordmark: { fontFamily: fonts.display, fontSize: 22, lineHeight: 26, color: palette.bone },
  display: { fontFamily: fonts.display, fontSize: 36, lineHeight: 42, color: palette.bone },
  numeral: { fontFamily: fonts.display, fontSize: 52, lineHeight: 60, color: palette.bone },
  title: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34, color: palette.bone },
  cardTitle: { fontFamily: fonts.display, fontSize: 20, lineHeight: 24, color: palette.bone },
  heading: { fontFamily: fonts.body, fontSize: 13, lineHeight: 18, fontWeight: '400' as const, color: palette.boneDim },
  body: { fontFamily: fonts.body, fontSize: 16, lineHeight: 24, color: palette.bone },
  caption: { fontFamily: fonts.body, fontSize: 13, lineHeight: 19, color: palette.boneMute },
  label: { fontFamily: fonts.body, fontSize: 15, lineHeight: 20, fontWeight: '400' as const, color: palette.bone },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 36,
  xxl: 56,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

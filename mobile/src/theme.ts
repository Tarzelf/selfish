export const colors = {
  bg: '#14110F',
  bgElevated: '#1E1916',
  bgSoft: '#261F1B',
  line: '#3A322C',
  cream: '#F3E6D4',
  creamMuted: '#C9B8A4',
  gold: '#C4A27A',
  blush: '#B07A72',
  ink: '#0C0A09',
  dim: 'rgba(243, 230, 212, 0.08)',
} as const;

export const space = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 36,
  xxl: 56,
} as const;

export const type = {
  title: {
    fontFamily: 'Georgia',
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.4,
    color: colors.cream,
  },
  display: {
    fontFamily: 'Georgia',
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.3,
    color: colors.cream,
  },
  serif: {
    fontFamily: 'Georgia',
    fontSize: 20,
    lineHeight: 30,
    color: colors.cream,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.creamMuted,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    color: colors.gold,
  },
  small: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.creamMuted,
  },
} as const;

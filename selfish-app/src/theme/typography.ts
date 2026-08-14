import { TextStyle } from 'react-native';

export const typography = {
  hero: {
    fontSize: 36,
    fontWeight: '500',
    letterSpacing: -0.8,
    lineHeight: 42,
  } satisfies TextStyle,
  title: {
    fontSize: 26,
    fontWeight: '500',
    letterSpacing: -0.4,
    lineHeight: 32,
  } satisfies TextStyle,
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
  } satisfies TextStyle,
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  } satisfies TextStyle,
  caption: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  } satisfies TextStyle,
  label: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  } satisfies TextStyle,
  link: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.2,
    textDecorationLine: 'underline',
  } satisfies TextStyle,
} as const;

import { TextStyle } from 'react-native';

export const typography = {
  hero: {
    fontSize: 34,
    fontWeight: '300',
    letterSpacing: -0.5,
    lineHeight: 40,
  } satisfies TextStyle,
  title: {
    fontSize: 24,
    fontWeight: '400',
    letterSpacing: -0.3,
    lineHeight: 30,
  } satisfies TextStyle,
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 24,
  } satisfies TextStyle,
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
  } satisfies TextStyle,
  caption: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: 0.2,
  } satisfies TextStyle,
  label: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  } satisfies TextStyle,
} as const;

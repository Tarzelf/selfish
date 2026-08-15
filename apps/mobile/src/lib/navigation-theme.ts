/**
 * Expo Router 57 ships React Navigation's DefaultTheme (light grey canvas).
 * White ink on rgb(242, 242, 242) is the washed-out web screenshot.
 * Theme the navigator from `expo-router/react-navigation` — not `@react-navigation/native`.
 */

export const SELFISH_NAV_COLORS = {
  primary: '#FFB457',
  background: '#060608',
  card: '#060608',
  text: '#F5F5F7',
  border: 'rgba(245,245,247,0.12)',
  notification: '#FF7847',
} as const;

export interface NavigationThemeLike {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
}

export function selfishNavigationTheme<T extends NavigationThemeLike>(base: T): T {
  return {
    ...base,
    dark: true,
    colors: {
      ...base.colors,
      ...SELFISH_NAV_COLORS,
    },
  };
}

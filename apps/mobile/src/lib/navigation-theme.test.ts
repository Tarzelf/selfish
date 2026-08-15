import assert from 'node:assert/strict';
import { test } from 'node:test';

import { SELFISH_NAV_COLORS, selfishNavigationTheme } from './navigation-theme';

test('navigation theme replaces the light DefaultTheme canvas', () => {
  const theme = selfishNavigationTheme({
    dark: false,
    colors: {
      primary: '#000',
      background: 'rgb(242, 242, 242)',
      card: 'rgb(255, 255, 255)',
      text: '#000',
      border: '#ccc',
      notification: 'red',
    },
  });

  assert.equal(theme.dark, true);
  assert.equal(theme.colors.background, '#060608');
  assert.equal(theme.colors.card, '#060608');
  assert.notEqual(theme.colors.background, 'rgb(242, 242, 242)');
  assert.notEqual(theme.colors.background, 'transparent');
  assert.equal(theme.colors.text, SELFISH_NAV_COLORS.text);
  assert.equal(theme.colors.primary, '#FFB457');
});

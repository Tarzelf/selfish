import assert from 'node:assert/strict';
import { test } from 'node:test';

import { skyWash } from './sky-wash';

test('morning wash never goes fully clear — white ink has to sit on it', () => {
  const morning = skyWash('morning');
  assert.ok(morning.photoOpacity <= 0.22);
  for (const color of morning.colors.slice(0, 3)) {
    assert.equal(/,\s*0\)/.test(color), false);
    const alpha = Number(color.match(/,\s*([0-9.]+)\)/)?.[1] ?? 0);
    assert.ok(alpha >= 0.75);
  }
});

test('evening still keeps a floor of dark so stars do not bleach the type', () => {
  const evening = skyWash('evening');
  assert.ok(evening.photoOpacity < 0.7);
  assert.equal(evening.colors[3], '#060608');
});

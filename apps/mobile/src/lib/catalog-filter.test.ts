import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CATALOG } from '@/data/catalog';
import { catalogForPrefs } from '@/lib/catalog-filter';
import { DEFAULT_PREFERENCES, HEAT_ORDER, type HeatLevel } from '@/lib/types';

function allow(cap: HeatLevel) {
  return (heat: HeatLevel) => HEAT_ORDER.indexOf(heat) <= HEAT_ORDER.indexOf(cap);
}

test('Close loops stay hidden until heatCap is spicy', () => {
  const soft = catalogForPrefs(CATALOG, { ...DEFAULT_PREFERENCES, heatCap: 'comfort' }, allow('comfort'));
  const warm = catalogForPrefs(CATALOG, { ...DEFAULT_PREFERENCES, heatCap: 'slow-burn' }, allow('slow-burn'));
  const close = catalogForPrefs(CATALOG, { ...DEFAULT_PREFERENCES, heatCap: 'spicy' }, allow('spicy'));

  assert.equal(soft.some((f) => f.format === 'close'), false);
  assert.equal(warm.some((f) => f.format === 'close'), false);
  assert.ok(close.some((f) => f.id === 'f-stay'));
  assert.ok(close.filter((f) => f.format === 'close').length >= 6);
});

test('hard limits still strip Close families', () => {
  const close = catalogForPrefs(
    CATALOG,
    { ...DEFAULT_PREFERENCES, heatCap: 'spicy', hardLimits: ['praise'] },
    allow('spicy'),
  );
  assert.equal(close.some((f) => f.tags.includes('praise')), false);
  assert.ok(close.some((f) => f.format === 'close'));
});

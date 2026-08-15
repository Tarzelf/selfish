import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  allowedVariants,
  browseDynamics,
  browseTags,
  canPlay,
  heatAllowed,
  isBlockedByLimits,
  isFamilyVisible,
  isFreeFamily,
  isPreviewActive,
  lockedVariants,
  previewDaysLeft,
  visibleCatalog,
} from './catalog-access';
import { DEFAULT_PREFERENCES, type SessionFamily } from './types';

function family(partial: Partial<SessionFamily> & Pick<SessionFamily, 'id' | 'tags' | 'variants'>): SessionFamily {
  return {
    shelf: 'desire',
    title: partial.id,
    blurb: '',
    dynamic: 'Boyfriend experience',
    voiceId: 'v-jasper',
    moods: ['wanted'],
    contentNotes: [],
    heatRange: ['comfort', 'spicy'],
    rating: 4.5,
    lovedFor: [],
    ...partial,
  };
}

const houseRules = family({
  id: 'f-house-rules',
  dynamic: 'Soft dom',
  tags: ['soft dom', 'strangers', 'hotel'],
  variants: [
    { id: 'a', label: 'Original', heat: 'slow-burn', pace: 'slow', extendedBuildup: true, durationMin: 17 },
    { id: 'b', label: 'Further', heat: 'spicy', pace: 'slow', extendedBuildup: true, durationMin: 20 },
  ],
});

const backToYours = family({
  id: 'f-back-to-yours',
  tags: ['boyfriend', 'slow burn'],
  variants: [
    { id: '1', label: 'Original', heat: 'slow-burn', pace: 'measured', extendedBuildup: false, durationMin: 14 },
    { id: '2', label: 'Softer', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 13 },
    { id: '4', label: 'Further', heat: 'spicy', pace: 'measured', extendedBuildup: false, durationMin: 16 },
  ],
});

const sunday = family({
  id: 'f-sunday-morning',
  tags: ['boyfriend', 'domestic'],
  heatRange: ['comfort', 'slow-burn'],
  variants: [
    { id: 's1', label: 'Original', heat: 'comfort', pace: 'slow', extendedBuildup: false, durationMin: 12 },
    { id: 's2', label: 'Warmer', heat: 'slow-burn', pace: 'slow', extendedBuildup: true, durationMin: 16 },
  ],
});

test('heat cap hides spicy Further variants and keeps them in the caption set', () => {
  assert.equal(heatAllowed('spicy', 'slow-burn'), false);
  assert.deepEqual(
    allowedVariants(backToYours, 'slow-burn').map((v) => v.label),
    ['Original', 'Softer'],
  );
  assert.deepEqual(
    lockedVariants(backToYours, 'slow-burn').map((v) => v.label),
    ['Further'],
  );
});

test('spicy cap unlocks Further', () => {
  assert.equal(heatAllowed('spicy', 'spicy'), true);
  assert.equal(allowedVariants(backToYours, 'spicy').length, 3);
  assert.equal(lockedVariants(backToYours, 'spicy').length, 0);
});

test('strangers hard limit hides House Rules everywhere, including deep links', () => {
  const prefs = { ...DEFAULT_PREFERENCES, hardLimits: ['strangers'], heatCap: 'spicy' as const };
  assert.equal(isBlockedByLimits(houseRules, prefs.hardLimits), true);
  assert.equal(isFamilyVisible(houseRules, prefs), false);
  assert.equal(canPlay(houseRules, prefs), false);
  assert.equal(visibleCatalog([houseRules, backToYours], prefs).map((f) => f.id).join(), 'f-back-to-yours');
});

test('Browse filters only list tags and dynamics still in the visible catalog', () => {
  const prefs = { ...DEFAULT_PREFERENCES, hardLimits: ['strangers'], heatCap: 'spicy' as const };
  const visible = visibleCatalog([houseRules, backToYours], prefs);
  assert.equal(browseTags(visible).includes('strangers'), false);
  assert.equal(browseDynamics(visible).includes('Soft dom'), false);
  assert.ok(browseTags(visible).includes('boyfriend'));
});

test('comfort heat cap drops families that only have slow-burn+ variants', () => {
  const prefs = { ...DEFAULT_PREFERENCES, heatCap: 'comfort' as const };
  assert.equal(isFamilyVisible(houseRules, prefs), false);
  assert.equal(isFamilyVisible(sunday, prefs), true);
});

test('free tier is exactly the three Desire + three Rest ids', () => {
  assert.equal(isFreeFamily(backToYours), true);
  assert.equal(isFreeFamily(sunday), true);
  assert.equal(isFreeFamily(houseRules), false);
});

test('paid session is locked until the 14-day preview starts', () => {
  const prefs = { ...DEFAULT_PREFERENCES, heatCap: 'spicy' as const, membershipStartedAt: null };
  assert.equal(canPlay(houseRules, prefs), false);
  assert.equal(canPlay(backToYours, prefs), true);
});

test('preview entitlement unlocks the paid catalog for 14 days', () => {
  const now = Date.UTC(2026, 7, 15);
  const active = { ...DEFAULT_PREFERENCES, heatCap: 'spicy' as const, membershipStartedAt: now };
  assert.equal(isPreviewActive(active, now), true);
  assert.equal(canPlay(houseRules, active, now), true);
  assert.equal(previewDaysLeft(active, now), 14);

  const expired = { ...active, membershipStartedAt: now - 15 * 24 * 60 * 60 * 1000 };
  assert.equal(isPreviewActive(expired, now), false);
  assert.equal(canPlay(houseRules, expired, now), false);
  assert.equal(canPlay(backToYours, expired, now), true);
});

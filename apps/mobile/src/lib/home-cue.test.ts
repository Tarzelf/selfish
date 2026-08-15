import assert from 'node:assert/strict';
import { test } from 'node:test';

import { CLOSE_CATALOG } from '@/data/close-catalog';
import { cueCloseLoop, feelingsOnHome } from '@/lib/home-cue';

test('home feelings are only moods the Close catalog can actually play', () => {
  const feelings = feelingsOnHome(CLOSE_CATALOG);
  assert.ok(feelings.includes('wanted'));
  assert.ok(feelings.includes('adored'));
  assert.ok(feelings.includes('missed'));
  assert.ok(feelings.includes('in-charge'));
});

test('a tapped feeling cues the highest-rated loop that holds it', () => {
  const cued = cueCloseLoop({
    loops: CLOSE_CATALOG,
    mood: 'adored',
    voiceId: null,
    lastFamilyId: 'f-still',
  });
  assert.ok(cued);
  assert.ok(cued!.moods.includes('adored'));
  assert.equal(cued!.id, 'f-stay');
});

test('a named voice beats the house pick', () => {
  const cued = cueCloseLoop({
    loops: CLOSE_CATALOG,
    mood: null,
    voiceId: 'v-noor',
    lastFamilyId: 'f-stay',
  });
  assert.equal(cued?.voiceId, 'v-noor');
  assert.equal(cued?.id, 'f-quiet');
});

test('with no tap, she gets the loop she finished last', () => {
  const cued = cueCloseLoop({
    loops: CLOSE_CATALOG,
    mood: null,
    voiceId: null,
    lastFamilyId: 'f-the-list',
  });
  assert.equal(cued?.id, 'f-the-list');
});

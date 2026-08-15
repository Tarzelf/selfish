import assert from 'node:assert/strict';
import { test } from 'node:test';

import { tabFocused } from './tab-routes';

test('Today is selected on the tabs index and the site root', () => {
  assert.equal(tabFocused('/(tabs)', 'index'), true);
  assert.equal(tabFocused('/', 'index'), true);
  assert.equal(tabFocused('/browse', 'index'), false);
});

test('named tabs match with or without the group', () => {
  assert.equal(tabFocused('/browse', 'browse'), true);
  assert.equal(tabFocused('/(tabs)/rest', 'rest'), true);
  assert.equal(tabFocused('/you/', 'you'), true);
  assert.equal(tabFocused('/rest', 'browse'), false);
});

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { hourToPart, resolvePart } from '@/lib/atmosphere-time';

test('hourToPart is morning from 5am until 5pm', () => {
  assert.equal(hourToPart(5), 'morning');
  assert.equal(hourToPart(11), 'morning');
  assert.equal(hourToPart(16), 'morning');
  assert.equal(hourToPart(17), 'evening');
  assert.equal(hourToPart(21), 'evening');
  assert.equal(hourToPart(4), 'evening');
});

test('resolvePart honors a locked setting over the clock', () => {
  assert.equal(resolvePart('auto', 10), 'morning');
  assert.equal(resolvePart('auto', 22), 'evening');
  assert.equal(resolvePart('evening', 10), 'evening');
  assert.equal(resolvePart('morning', 22), 'morning');
});

import assert from 'node:assert/strict';
import { test } from 'node:test';

import { prepareForTts } from './prepare.js';

test('strips the compliance header line', () => {
  const script = '[all characters are established adults; ages stated in scene one]\nHey. Come here.';
  assert.equal(prepareForTts(script), 'Hey. Come here.');
});

test('strips whole-line stage directions but keeps performance tag lines', () => {
  const script = '[setting: a quiet apartment]\n[breath]\nOnly if you want to.';
  assert.equal(prepareForTts(script), '[breath]\nOnly if you want to.');
});

test('keeps inline performance tags and whisper wraps untouched', () => {
  const script = 'It is late. [pause] <whisper>Stay.</whisper> [breath] Alright?';
  assert.equal(prepareForTts(script), script);
});

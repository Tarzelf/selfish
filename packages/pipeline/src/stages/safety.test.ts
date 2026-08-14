import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { DraftScript } from '../types.js';
import { RuleBasedSafetyScreen, runSafety } from './safety.js';

function script(text: string): DraftScript {
  return {
    variantLabel: 'Original',
    heat: 'slow-burn',
    text,
    provenance: { provider: 'test', model: 'test', promptHash: 'x' },
  };
}

const GOOD_SCRIPT = `
[setting: a quiet apartment]
[all characters are established adults; ages stated in scene one]
He smiles. [breath] "Only if you want to."
`;

test('passes a compliant script', async () => {
  const verdict = await runSafety(script(GOOD_SCRIPT), [new RuleBasedSafetyScreen()]);
  assert.equal(verdict.ok, true);
});

test('quarantines minor references', async () => {
  const verdict = await runSafety(
    script(GOOD_SCRIPT + '\nShe was a high school senior.'),
    [new RuleBasedSafetyScreen()],
  );
  assert.equal(verdict.ok, false);
  assert.ok(!verdict.ok && verdict.violations.some((v) => v.includes('minor')));
});

test('quarantines non-consent depictions', async () => {
  const verdict = await runSafety(
    script(GOOD_SCRIPT + '\nHe continues while she sleeps.'),
    [new RuleBasedSafetyScreen()],
  );
  assert.equal(verdict.ok, false);
  assert.ok(!verdict.ok && verdict.violations.some((v) => v.includes('non-consent')));
});

test('quarantines incest tropes', async () => {
  const verdict = await runSafety(
    script(GOOD_SCRIPT + '\nHer stepbrother arrives.'),
    [new RuleBasedSafetyScreen()],
  );
  assert.equal(verdict.ok, false);
});

test('requires an adult-age establishment marker', async () => {
  const verdict = await runSafety(
    script('[setting: a bar]\nTwo people talk quietly.'),
    [new RuleBasedSafetyScreen()],
  );
  assert.equal(verdict.ok, false);
  assert.ok(!verdict.ok && verdict.violations.some((v) => v.includes('age establishment')));
});

test('real-person references are blocked', async () => {
  const verdict = await runSafety(
    script(GOOD_SCRIPT + '\nHe looks like that famous actor everyone loves.'),
    [new RuleBasedSafetyScreen()],
  );
  assert.equal(verdict.ok, false);
});

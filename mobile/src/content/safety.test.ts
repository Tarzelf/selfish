import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { assembleSession, tonightSessionId } from './assemble';
import { assertAdultCatalog, isAdultBirthYear, scanLine } from './safety';
import { catalogTexts, sessions } from './sessions';

describe('age gate', () => {
  it('accepts 18 and older using a conservative year', () => {
    const now = new Date('2026-08-14T00:00:00Z');
    assert.equal(isAdultBirthYear(2008, now), true);
    assert.equal(isAdultBirthYear(2009, now), false);
    assert.equal(isAdultBirthYear(1994, now), true);
    assert.equal(isAdultBirthYear(1899, now), false);
  });
});

describe('catalog safety', () => {
  it('refuses language that implies minors', () => {
    assert.ok(scanLine('a teenage crush').length > 0);
    assert.ok(scanLine('high school reunion of adults')[0].includes('high'));
  });

  it('keeps the authored catalog clean', () => {
    assertAdultCatalog(catalogTexts());
  });

  it('gives every session an aftercare chapter', () => {
    for (const session of sessions) {
      assert.ok(
        session.chapters.some((chapter) => chapter.kind === 'aftercare'),
        `${session.id} is missing aftercare`,
      );
    }
  });
});

describe('assembly', () => {
  it('hides wide sessions when the door is only ajar', () => {
    const closed = assembleSession('closer', { gift: 'wanted', heat: 1 });
    assert.equal(closed, undefined);
    const open = assembleSession('closer', { gift: 'wanted', heat: 3 });
    assert.ok(open);
    assert.equal(open.lines[0].text.includes('wanted') || open.lines[0].text.includes('Want'), true);
  });

  it('recommends still when she asked for quiet', () => {
    assert.equal(tonightSessionId({ gift: 'quiet', heat: 3 }), 'the-hour');
  });
});

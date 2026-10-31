// The source matrix and the Gate B check.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SOURCES, SourceNotPermittedError, assertAutomatedAccessPermitted, linkOutAllowed } from './sources.ts';

test('H-04/Gate B: no real source is permitted for automated access today', () => {
  for (const name of Object.keys(SOURCES)) {
    assert.throws(() => assertAutomatedAccessPermitted(name), SourceNotPermittedError, name);
  }
});

test('an unknown source is refused too, rather than allowed by default', () => {
  assert.throws(
    () => assertAutomatedAccessPermitted('Some Other Platform'),
    (e: unknown) => e instanceof SourceNotPermittedError && e.access === 'unknown-source',
  );
  // Inherited object keys aren't sources.
  assert.throws(() => assertAutomatedAccessPermitted('toString'), SourceNotPermittedError);
});

test('IBJJF is prohibited, Smoothcomp not permitted, and the error says which', () => {
  assert.throws(() => assertAutomatedAccessPermitted('IBJJF'), (e: unknown) => e instanceof SourceNotPermittedError && e.access === 'prohibited');
  assert.throws(() => assertAutomatedAccessPermitted('Smoothcomp'), (e: unknown) => e instanceof SourceNotPermittedError && e.access === 'not-permitted');
});

test('link-out is allowed for Smoothcomp only', () => {
  assert.equal(linkOutAllowed('Smoothcomp'), true);
  assert.equal(linkOutAllowed('IBJJF'), false);
  assert.equal(linkOutAllowed('Some Other Platform'), false);
});

test('every matrix entry is dated and every verified or documented fact cites a URL, except verified absences', () => {
  for (const s of Object.values(SOURCES)) {
    assert.match(s.checkedOn, /^\d{4}-\d{2}-\d{2}$/);
    for (const [key, fact] of Object.entries(s)) {
      if (typeof fact !== 'object' || fact === null || !('evidence' in fact)) continue;
      const absence = fact.value === false && fact.evidence === 'verified';
      if ((fact.evidence === 'verified' || fact.evidence === 'documented') && !absence) {
        assert.ok(fact.url, `${s.source}.${key} is ${fact.evidence} but cites no URL`);
      }
    }
  }
});

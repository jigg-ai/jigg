// Source-adapter contract and lookup strategy, against the fictional fixtures.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MAX_EVENTS_SCANNED_PER_LOOKUP, fixtureAdapter, upcomingFor } from './adapters.ts';
import { upsertDiscovered } from './model.ts';
import { demoData } from './fixtures.ts';

const A = 'Example Platform A';
const B = 'Example Platform B';
const TODAY = '2026-10-30';
const now = () => '2026-10-30T12:00:00Z';

test('a search returns this platform\'s identities as candidates only', async () => {
  const a = fixtureAdapter(A, demoData, { today: TODAY, now });
  const r = await a.findAthletes('demo athlete 01');
  assert.ok(r.ok);
  assert.deepEqual(r.value.map((i) => `${i.source}:${i.sourceAthleteId}:${i.match}`), [`${A}:a-1001:candidate`]);
});

test('a repeated search contributes nothing new to the index', async () => {
  const a = fixtureAdapter(A, demoData, { today: TODAY, now });
  const r = await a.findAthletes('demo athlete');
  assert.ok(r.ok);
  // Every identity Platform A returns is already in the demo index.
  assert.equal(upsertDiscovered(demoData.athletes, r.value).length, demoData.athletes.length);
});

test('athlete-first: one request finds an identity\'s upcoming registrations', async () => {
  const b = fixtureAdapter(B, demoData, { today: TODAY, now });
  const r = await upcomingFor(b, { source: B, sourceAthleteId: 'b-2001' });
  assert.ok(r.ok);
  assert.equal(r.value.route, 'athlete');
  assert.deepEqual(r.value.registrations.map((x) => x.eventId), ['b:sample-winter-open']);
  assert.equal(b.requests.count, 1);
});

test('past events are not "upcoming"', async () => {
  const b = fixtureAdapter(B, demoData, { today: '2026-12-06', now });
  const r = await b.athleteUpcoming({ source: B, sourceAthleteId: 'b-2001' });
  assert.ok(r.ok);
  assert.deepEqual(r.value.registrations, []);
});

test('event-centric fallback scans only the given events, and at most a bounded number', async () => {
  const b = fixtureAdapter(B, demoData, { today: TODAY, now, capabilities: ['event-entrants'] });
  const r = await upcomingFor(b, { source: B, sourceAthleteId: 'b-2004' }, ['b:sample-winter-open']);
  assert.ok(r.ok);
  assert.equal(r.value.route, 'event-entrants');
  assert.deepEqual(r.value.registrations.map((x) => x.identity.sourceAthleteId), ['b-2004']);
  assert.equal(b.requests.count, 1);

  const many = Array.from({ length: MAX_EVENTS_SCANNED_PER_LOOKUP + 3 }, () => 'b:sample-winter-open');
  const capped = fixtureAdapter(B, demoData, { today: TODAY, now, capabilities: ['event-entrants'] });
  const r2 = await upcomingFor(capped, { source: B, sourceAthleteId: 'b-2004' }, many);
  assert.ok(r2.ok);
  assert.equal(capped.requests.count, MAX_EVENTS_SCANNED_PER_LOOKUP);
  assert.equal(r2.value.eventsSkipped, 3);
});

test('a platform with neither route says so instead of guessing', async () => {
  const x = fixtureAdapter(A, demoData, { today: TODAY, now, capabilities: ['event-matches'] });
  const r = await upcomingFor(x, { source: A, sourceAthleteId: 'a-1001' });
  assert.equal(r.ok, false);
  assert.equal(!r.ok && r.error.kind, 'unsupported');
  assert.equal(x.requests.count, 0);
});

test('an identity from another platform is not looked up here', async () => {
  const a = fixtureAdapter(A, demoData, { today: TODAY, now });
  const r = await a.athleteUpcoming({ source: B, sourceAthleteId: 'b-2001' });
  assert.equal(!r.ok && r.error.kind, 'not-found');
});

test('match data comes back only for the platform\'s own events', async () => {
  const a = fixtureAdapter(A, demoData, { today: TODAY, now });
  const r = await a.eventMatches('a:sample-autumn-open');
  assert.ok(r.ok);
  assert.equal(r.value.length, 3);
  const other = await a.eventMatches('b:sample-winter-open');
  assert.equal(!other.ok && other.error.kind, 'not-found');
});

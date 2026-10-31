// Cache, dedup, refresh policy and request budget, on a fake clock.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LookupCache, RequestBudget, daysUntil, refreshIntervalMs } from './cache.ts';
import type { AdapterResult } from './adapters.ts';

const HOUR = 3_600_000;
const okResult = (value: number): AdapterResult<number> => ({ ok: true, value, fetchedAt: '' });

test('a fresh entry is served without calling the source again', async () => {
  let t = 0;
  let calls = 0;
  const cache = new LookupCache(() => t);
  const load = async () => okResult(++calls);
  assert.equal((await cache.get('k', HOUR, load)).ok && calls, 1);
  t = HOUR - 1;
  await cache.get('k', HOUR, load);
  assert.equal(calls, 1);
  t = HOUR;
  await cache.get('k', HOUR, load);
  assert.equal(calls, 2);
});

test('concurrent requests for one key share a single source call', async () => {
  let calls = 0;
  let release!: () => void;
  const gate = new Promise<void>((r) => (release = r));
  const cache = new LookupCache(() => 0);
  const load = async () => {
    calls += 1;
    await gate;
    return okResult(calls);
  };
  const all = Promise.all([cache.get('k', HOUR, load), cache.get('k', HOUR, load), cache.get('k', HOUR, load)]);
  release();
  const results = await all;
  assert.equal(calls, 1);
  assert.ok(results.every((r) => r.ok && r.value === 1));
});

test('failures are not cached, so a rate limit is retried later', async () => {
  let calls = 0;
  const cache = new LookupCache(() => 0);
  const load = async (): Promise<AdapterResult<number>> => {
    calls += 1;
    return calls === 1 ? { ok: false, error: { kind: 'rate-limited', message: 'slow down' } } : okResult(calls);
  };
  assert.equal((await cache.get('k', HOUR, load)).ok, false);
  assert.equal((await cache.get('k', HOUR, load)).ok, true);
  assert.equal(calls, 2);
});

test('null max age keeps an entry until someone asks explicitly', async () => {
  let t = 0;
  let calls = 0;
  const cache = new LookupCache(() => t);
  await cache.get('k', null, async () => okResult(++calls));
  t = 365 * 24 * HOUR;
  await cache.get('k', null, async () => okResult(++calls));
  assert.equal(calls, 1);
});

test('refresh follows interest and event proximity', () => {
  const now = Date.parse('2026-11-01T15:00:00Z');
  assert.equal(daysUntil('2026-11-14', now), 13);
  // Athletes: tracked ones more often.
  assert.equal(refreshIntervalMs('athlete-upcoming', { now, tracked: true }), 6 * HOUR);
  assert.equal(refreshIntervalMs('athlete-upcoming', { now, tracked: false }), 24 * HOUR);
  // Entrant lists: daily far out, 6-hourly within two weeks, never after the start.
  assert.equal(refreshIntervalMs('event-entrants', { now, eventDate: '2026-12-05', tracked: false }), 24 * HOUR);
  assert.equal(refreshIntervalMs('event-entrants', { now, eventDate: '2026-11-14', tracked: false }), 6 * HOUR);
  assert.equal(refreshIntervalMs('event-entrants', { now, eventDate: '2026-11-01', tracked: true }), null);
  // Matches: only for tracked athletes, and only close to the day.
  assert.equal(refreshIntervalMs('event-matches', { now, eventDate: '2026-11-01', tracked: true }), 120_000);
  assert.equal(refreshIntervalMs('event-matches', { now, eventDate: '2026-11-02', tracked: true }), HOUR);
  assert.equal(refreshIntervalMs('event-matches', { now, eventDate: '2026-11-14', tracked: true }), null);
  assert.equal(refreshIntervalMs('event-matches', { now, eventDate: '2026-11-01', tracked: false }), null);
});

test('the request budget caps calls per source per minute and refills', () => {
  let t = 0;
  const budget = new RequestBudget(3, () => t);
  assert.deepEqual([1, 2, 3, 4].map(() => budget.tryTake('A')), [true, true, true, false]);
  // Another platform has its own budget.
  assert.equal(budget.tryTake('B'), true);
  t = 20_000; // a third of a minute refills one token
  assert.equal(budget.tryTake('A'), true);
  assert.equal(budget.tryTake('A'), false);
});

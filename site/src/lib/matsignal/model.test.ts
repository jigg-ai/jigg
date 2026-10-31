// Unit tests for the MatSignal demo model. Node's built-in runner, no dependency:
// `npm test` from site/ (Node 22.18+ runs TypeScript directly). Test IDs refer to
// builds/matsignal-competition/test.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_AFFILIATIONS,
  buildQueue,
  compareQueueEntries,
  formatEventDate,
  restoreSelection,
  searchAthletes,
  timeKindLabel,
  timeLabel,
  type DemoData,
  type QueueEntry,
} from './model.ts';
import { demoData } from './fixtures.ts';

const names = (list: { displayName: string }[]) => list.map((a) => a.displayName);
const rows = (q: QueueEntry[]) => q.map((e) => `${e.athlete.displayName}@${e.event.id} ${timeLabel(e.match)}`);

test('MS-T01: a known fictional name or team finds its records', () => {
  assert.deepEqual(names(searchAthletes(demoData.athletes, 'demo athlete 03', ALL_AFFILIATIONS)), ['Demo Athlete 03']);
  assert.deepEqual(names(searchAthletes(demoData.athletes, '  EXAMPLE alliance ', ALL_AFFILIATIONS)), ['Demo Athlete 01', 'Demo Athlete 02']);
  assert.deepEqual(names(searchAthletes(demoData.athletes, 'uptown', ALL_AFFILIATIONS)), ['Demo Athlete 04']);
  assert.equal(searchAthletes(demoData.athletes, '', ALL_AFFILIATIONS).length, 4);
});

test('the affiliation filter narrows the search', () => {
  assert.deepEqual(names(searchAthletes(demoData.athletes, 'demo', 'Sample Jiu-Jitsu')), ['Demo Athlete 03', 'Demo Athlete 04']);
  assert.deepEqual(searchAthletes(demoData.athletes, 'northside', 'Sample Jiu-Jitsu'), []);
});

test('MS-T02: an unknown name finds nothing', () => {
  assert.deepEqual(searchAthletes(demoData.athletes, 'Real Person', ALL_AFFILIATIONS), []);
});

test('MS-T03/T04: a stored selection restores known IDs once each', () => {
  assert.deepEqual(restoreSelection('["demo-02","demo-02","demo-01"]', demoData.athletes), ['demo-02', 'demo-01']);
  assert.deepEqual(restoreSelection('["demo-01", 7, null, "someone-real"]', demoData.athletes), ['demo-01']);
  assert.deepEqual(restoreSelection('{"demo-01":true}', demoData.athletes), []);
  assert.deepEqual(restoreSelection('not json', demoData.athletes), []);
  assert.deepEqual(restoreSelection(null, demoData.athletes), []);
});

test('MS-T05: no selection, no queue', () => {
  assert.deepEqual(buildQueue(demoData, []), []);
});

test('MS-T06: the queue runs by date, then published time, with unknown times last', () => {
  const all = demoData.athletes.map((a) => a.id);
  assert.deepEqual(rows(buildQueue(demoData, all)), [
    'Demo Athlete 02@sample-autumn-open 10:55',
    'Demo Athlete 01@sample-autumn-open 11:40',
    'Demo Athlete 03@sample-autumn-open 13:20',
    'Demo Athlete 01@sample-winter-open Unknown',
    'Demo Athlete 04@sample-winter-open Unknown',
  ]);
  // Selection order doesn't change the queue.
  assert.deepEqual(rows(buildQueue(demoData, [...all].reverse())), rows(buildQueue(demoData, all)));
});

test('unknown times stay unknown and are labelled so', () => {
  const winter = buildQueue(demoData, ['demo-04']);
  assert.equal(winter.length, 1);
  assert.equal(winter[0].match, undefined);
  assert.equal(timeLabel(winter[0].match), 'Unknown');
  assert.equal(timeKindLabel(winter[0].match), 'Not published');
  const [first] = buildQueue(demoData, ['demo-03']);
  assert.equal(timeKindLabel(first.match), 'Scheduled');
  // A source that marks a time unknown wins over a stray timestamp.
  assert.equal(timeLabel({ ...first.match!, timeKind: 'unknown' }), 'Unknown');
});

test('same-day events in different time zones sort by actual instant', () => {
  const data: DemoData = {
    athletes: demoData.athletes.slice(0, 2),
    events: [
      { id: 'east', name: 'East Open', source: 'X', date: '2026-11-14' },
      { id: 'west', name: 'West Open', source: 'Y', date: '2026-11-14' },
    ],
    registrations: [
      { athleteId: 'demo-01', eventId: 'east', status: 'registered', source: 'X', observedAt: '' },
      { athleteId: 'demo-02', eventId: 'west', status: 'registered', source: 'Y', observedAt: '' },
    ],
    matches: [
      // 10:00 Pacific is 13:00 Eastern: later, despite the smaller clock time.
      { athleteId: 'demo-02', eventId: 'west', startsAt: '2026-11-14T10:00:00-08:00', timeKind: 'estimated', source: 'Y', observedAt: '' },
      { athleteId: 'demo-01', eventId: 'east', startsAt: '2026-11-14T12:00:00-05:00', timeKind: 'estimated', source: 'X', observedAt: '' },
    ],
  };
  assert.deepEqual(rows(buildQueue(data, ['demo-01', 'demo-02'])), ['Demo Athlete 01@east 12:00', 'Demo Athlete 02@west 10:00']);
});

test('withdrawn registrations are left out of the queue', () => {
  const data: DemoData = {
    ...demoData,
    registrations: demoData.registrations.map((r) => (r.athleteId === 'demo-04' ? { ...r, status: 'withdrawn' as const } : r)),
  };
  assert.deepEqual(buildQueue(data, ['demo-04']), []);
});

test('the comparator is a total order (antisymmetric, ties only on identical rows)', () => {
  const q = buildQueue(demoData, demoData.athletes.map((a) => a.id));
  for (const a of q) {
    assert.equal(compareQueueEntries(a, a), 0);
    for (const b of q) {
      if (a === b) continue;
      const ab = compareQueueEntries(a, b);
      assert.notEqual(ab, 0);
      assert.equal(Math.sign(ab), -Math.sign(compareQueueEntries(b, a)));
    }
  }
});

test('event dates format as calendar dates', () => {
  assert.equal(formatEventDate('2026-11-14'), 'Nov 14');
  assert.equal(formatEventDate('2026-12-05'), 'Dec 05');
});

test('H-07: fixtures are fictional and internally consistent', () => {
  const athleteIds = new Set(demoData.athletes.map((a) => a.id));
  const eventIds = new Set(demoData.events.map((e) => e.id));
  for (const a of demoData.athletes) {
    assert.match(a.displayName, /^Demo Athlete \d{2}$/);
    for (const i of a.identities) assert.match(i.observedName, /^Demo Athlete \d{2}$/);
  }
  for (const r of demoData.registrations) {
    assert.ok(athleteIds.has(r.athleteId) && eventIds.has(r.eventId), `dangling registration ${r.athleteId}@${r.eventId}`);
  }
  for (const m of demoData.matches) {
    assert.ok(athleteIds.has(m.athleteId) && eventIds.has(m.eventId), `dangling match ${m.athleteId}@${m.eventId}`);
    assert.ok(
      demoData.registrations.some((r) => r.athleteId === m.athleteId && r.eventId === m.eventId),
      `match without a registration: ${m.athleteId}@${m.eventId}`,
    );
    if (m.opponentLabel) assert.match(m.opponentLabel, /^Demo Athlete \d{2}$/);
    // A published time must carry an offset, and sit on the event's date.
    if (m.startsAt) {
      assert.match(m.startsAt, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
      assert.equal(m.startsAt.slice(0, 10), demoData.events.find((e) => e.id === m.eventId)!.date);
    }
  }
});

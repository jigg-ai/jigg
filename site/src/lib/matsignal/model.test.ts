// Unit tests for the MatSignal demo model. Node's built-in runner, no dependency:
// `npm test` from site/ (Node 22.18+ runs TypeScript directly). Test IDs refer to
// builds/matsignal-competition/test.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ALL_AFFILIATIONS,
  buildQueue,
  classifyDivision,
  compareQueueEntries,
  coverageGaps,
  gapLabel,
  formatEventDate,
  hiddenByAge,
  identityKey,
  restoreSelection,
  searchAthletes,
  timeKindLabel,
  timeLabel,
  trackedIdentities,
  upsertDiscovered,
  type DemoData,
  type QueueEntry,
  type SourceCheck,
  type SourceIdentity,
} from './model.ts';
import { demoData } from './fixtures.ts';

const names = (list: { displayName: string }[]) => list.map((a) => a.displayName);
const rows = (q: QueueEntry[]) => q.map((e) => `${e.athlete.displayName}@${e.event.id} ${timeLabel(e.match)}`);
const queueFor = (data: DemoData, athleteIds: string[]) => buildQueue(data, trackedIdentities(data.athletes, athleteIds));
const allIds = demoData.athletes.map((a) => a.id);

test('MS-T01: a known fictional name or team finds its records', () => {
  assert.deepEqual(names(searchAthletes(demoData.athletes, 'demo athlete 03', ALL_AFFILIATIONS)), ['Demo Athlete 03']);
  assert.deepEqual(names(searchAthletes(demoData.athletes, '  EXAMPLE alliance ', ALL_AFFILIATIONS)), ['Demo Athlete 01', 'Demo Athlete 02']);
  assert.deepEqual(names(searchAthletes(demoData.athletes, 'uptown', ALL_AFFILIATIONS)), ['Demo Athlete 04']);
  assert.equal(searchAthletes(demoData.athletes, '', ALL_AFFILIATIONS).length, 4);
});

test('search also matches aliases', () => {
  const athletes = [{ ...demoData.athletes[0], aliases: ['D. Athlete One'] }, ...demoData.athletes.slice(1)];
  assert.deepEqual(names(searchAthletes(athletes, 'athlete one', ALL_AFFILIATIONS)), ['Demo Athlete 01']);
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
  assert.deepEqual(queueFor(demoData, []), []);
});

test('MS-T06: the queue runs by date, then published time, with unknown times last', () => {
  assert.deepEqual(rows(queueFor(demoData, allIds)), [
    'Demo Athlete 02@a:sample-autumn-open 10:55',
    'Demo Athlete 01@a:sample-autumn-open 11:40',
    'Demo Athlete 03@a:sample-autumn-open 13:20',
    'Demo Athlete 01@b:sample-winter-open Unknown',
    'Demo Athlete 04@b:sample-winter-open Unknown',
  ]);
  // Selection order doesn't change the queue.
  assert.deepEqual(rows(queueFor(demoData, [...allIds].reverse())), rows(queueFor(demoData, allIds)));
});

test('an athlete with identities on two platforms gets both platforms in the queue', () => {
  assert.deepEqual(rows(queueFor(demoData, ['demo-01'])), [
    'Demo Athlete 01@a:sample-autumn-open 11:40',
    'Demo Athlete 01@b:sample-winter-open Unknown',
  ]);
});

test('an unconfirmed same-name candidate stays out of the queue until confirmed', () => {
  // Demo Athlete 03's Platform B record is a candidate with a Winter Open registration.
  assert.deepEqual(rows(queueFor(demoData, ['demo-03'])), ['Demo Athlete 03@a:sample-autumn-open 13:20']);
  const confirmed: DemoData = {
    ...demoData,
    athletes: demoData.athletes.map((a) =>
      a.id === 'demo-03' ? { ...a, identities: a.identities.map((i) => ({ ...i, match: 'confirmed' as const })) } : a,
    ),
  };
  assert.deepEqual(rows(queueFor(confirmed, ['demo-03'])), [
    'Demo Athlete 03@a:sample-autumn-open 13:20',
    'Demo Athlete 03@b:sample-winter-open Unknown',
  ]);
});

test('unknown times stay unknown and are labelled so', () => {
  const winter = queueFor(demoData, ['demo-04']);
  assert.equal(winter.length, 1);
  assert.equal(winter[0].match, undefined);
  assert.equal(timeLabel(winter[0].match), 'Unknown');
  assert.equal(timeKindLabel(winter[0].match), 'Not published');
  const [first] = queueFor(demoData, ['demo-03']);
  assert.equal(timeKindLabel(first.match), 'Scheduled');
  // A source that marks a time unknown wins over a stray timestamp.
  assert.equal(timeLabel({ ...first.match!, timeKind: 'unknown' }), 'Unknown');
});

test('same-day events in different time zones sort by actual instant', () => {
  const east = { source: 'X', sourceAthleteId: 'x-1' };
  const west = { source: 'Y', sourceAthleteId: 'y-1' };
  const data: DemoData = {
    athletes: [
      { id: 'demo-01', displayName: 'Demo Athlete 01', identities: [{ ...east, observedName: 'Demo Athlete 01', match: 'confirmed', checkedAt: '' }] },
      { id: 'demo-02', displayName: 'Demo Athlete 02', identities: [{ ...west, observedName: 'Demo Athlete 02', match: 'confirmed', checkedAt: '' }] },
    ],
    events: [
      { id: 'east', name: 'East Open', source: 'X', date: '2026-11-14' },
      { id: 'west', name: 'West Open', source: 'Y', date: '2026-11-14' },
    ],
    registrations: [
      { identity: east, eventId: 'east', division: 'Adult', status: 'registered', observedAt: '' },
      { identity: west, eventId: 'west', division: 'Adult', status: 'registered', observedAt: '' },
    ],
    matches: [
      // 10:00 Pacific is 13:00 Eastern: later, despite the smaller clock time.
      { identity: west, eventId: 'west', startsAt: '2026-11-14T10:00:00-08:00', timeKind: 'estimated', observedAt: '' },
      { identity: east, eventId: 'east', startsAt: '2026-11-14T12:00:00-05:00', timeKind: 'estimated', observedAt: '' },
    ],
  };
  assert.deepEqual(rows(queueFor(data, ['demo-01', 'demo-02'])), ['Demo Athlete 01@east 12:00', 'Demo Athlete 02@west 10:00']);
});

test('withdrawn registrations are left out of the queue', () => {
  const data: DemoData = {
    ...demoData,
    registrations: demoData.registrations.map((r) =>
      r.identity.sourceAthleteId === 'b-2004' ? { ...r, status: 'withdrawn' as const } : r,
    ),
  };
  assert.deepEqual(queueFor(data, ['demo-04']), []);
});

test('the comparator is a total order (antisymmetric, ties only on identical rows)', () => {
  const q = queueFor(demoData, allIds);
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

test('discovered identities are reused, never duplicated, never merged by name', () => {
  const found = (source: string, sourceAthleteId: string, checkedAt: string): SourceIdentity => ({
    source, sourceAthleteId, observedName: 'Demo Athlete 01', match: 'confirmed', checkedAt,
  });
  // A known identity is refreshed in place: same athletes, newer checkedAt.
  const refreshed = upsertDiscovered(demoData.athletes, [found('Example Platform A', 'a-1001', '2026-11-01T00:00:00Z')]);
  assert.equal(refreshed.length, demoData.athletes.length);
  assert.equal(refreshed[0].identities.find((i) => i.sourceAthleteId === 'a-1001')!.checkedAt, '2026-11-01T00:00:00Z');
  // The same name on a third platform becomes its own athlete, not Demo Athlete 01.
  const grown = upsertDiscovered(refreshed, [found('Example Platform C', 'c-9', '2026-11-01T00:00:00Z')]);
  assert.equal(grown.length, demoData.athletes.length + 1);
  assert.equal(grown.at(-1)!.id, 'ath:Example Platform C:c-9');
  assert.equal(grown[0].identities.length, 2);
  // Discovering it again adds nothing.
  assert.equal(upsertDiscovered(grown, [found('Example Platform C', 'c-9', '2026-11-02T00:00:00Z')]).length, grown.length);
  // The input index is not mutated.
  assert.equal(demoData.athletes[0].identities[0].checkedAt, '2026-10-30T12:00:00Z');
});

test('event dates format as calendar dates', () => {
  assert.equal(formatEventDate('2026-11-14'), 'Nov 14');
  assert.equal(formatEventDate('2026-12-05'), 'Dec 05');
});

test('H-07: fixtures are fictional and internally consistent', () => {
  const identities = new Map(demoData.athletes.flatMap((a) => a.identities.map((i) => [identityKey(i), i] as const)));
  const events = new Map(demoData.events.map((e) => [e.id, e]));
  for (const a of demoData.athletes) {
    assert.match(a.displayName, /^Demo Athlete \d{2}$/);
    for (const i of a.identities) assert.match(i.observedName, /^Demo Athlete \d{2}$/);
  }
  for (const r of demoData.registrations) {
    const key = identityKey(r.identity);
    assert.ok(identities.has(key), `registration for unknown identity ${key}`);
    assert.equal(events.get(r.eventId)?.source, r.identity.source, `${key} registered for another platform's event`);
  }
  for (const m of demoData.matches) {
    const key = identityKey(m.identity);
    assert.ok(
      demoData.registrations.some((r) => identityKey(r.identity) === key && r.eventId === m.eventId),
      `match without a registration: ${key}@${m.eventId}`,
    );
    if (m.opponentLabel) assert.match(m.opponentLabel, /^Demo Athlete \d{2}$/);
    // A published time must carry an offset, and sit on the event's date.
    if (m.startsAt) {
      assert.match(m.startsAt, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
      assert.equal(m.startsAt.slice(0, 10), events.get(m.eventId)!.date);
    }
  }
});

test('age rule: only labels that say adult are adult; youth wins; everything else is unknown', () => {
  for (const label of ['Adult / Male / Blue / Light', 'Master 2 / Female / Black', 'Masters', 'MASTER 7', '18+ Absolute', 'Adult (18-29) / Purple', '18 and over'])
    assert.equal(classifyDivision(label), 'adult', label);
  for (const label of ['Juvenile 1 / Male / Blue', 'Kids 4-5 / Grey', 'Teen 14-15', 'Youth Girls', 'U18 Open', 'Under 18', 'Under 16', 'Junior', 'Boys Grey/White',
    'Ages 16–17', 'Adult & Teen combined', '13+ No-Gi', '10 to 11 / Yellow'])
    assert.equal(classifyDivision(label), 'youth', label);
  for (const label of [undefined, '', '   ', 'Open Division / Purple / Middle', 'White Belt Light', 'Senior 1', 'No-Gi Expert', 'Feather 58-64', 'Light 64-70kg', 'Mastery Open'])
    assert.equal(classifyDivision(label), 'unknown', String(label));
});

test('entries whose division is not confirmed adult stay out of the queue, and are counted', () => {
  const tracked = trackedIdentities(demoData.athletes, ['demo-02']);
  // Demo Athlete 02's Spring Open division says "Open Division": not confirmed adult.
  assert.deepEqual(rows(buildQueue(demoData, tracked)), ['Demo Athlete 02@a:sample-autumn-open 10:55']);
  assert.equal(hiddenByAge(demoData, tracked), 1);
  assert.equal(hiddenByAge(demoData, trackedIdentities(demoData.athletes, ['demo-01'])), 0);
  // A youth division is hidden the same way.
  const youth: DemoData = {
    ...demoData,
    registrations: demoData.registrations.map((r) =>
      r.identity.sourceAthleteId === 'a-1003' ? { ...r, division: 'Juvenile 2 / Female / Blue' } : r,
    ),
  };
  const t3 = trackedIdentities(youth.athletes, ['demo-03']);
  assert.deepEqual(buildQueue(youth, t3), []);
  assert.equal(hiddenByAge(youth, t3), 1);
});

test('a source that could not be checked is reported as unknown, never as "no entries"', () => {
  const tracked = trackedIdentities(demoData.athletes, ['demo-01']); // one identity on each platform
  const a = { source: 'Example Platform A', sourceAthleteId: 'a-1001' };
  const b = { source: 'Example Platform B', sourceAthleteId: 'b-2001' };
  const checks: SourceCheck[] = [
    { identity: a, status: 'ok', checkedAt: '2026-10-30T12:00:00Z' },
    { identity: b, status: 'ok', checkedAt: '2026-10-29T12:00:00Z' },
    // The latest check wins: Platform B has since become unreachable.
    { identity: b, status: 'unavailable', checkedAt: '2026-10-30T12:00:00Z' },
  ];
  const gaps = coverageGaps(demoData.athletes, tracked, checks);
  assert.deepEqual(gaps.map((g) => `${g.source}:${g.status}`), ['Example Platform B:unavailable']);
  assert.equal(gapLabel(gaps[0]), "Example Platform B couldn't be checked for Demo Athlete 01 (last tried 2026-10-30), so entries there are unknown.");
  // Everything ok: no gaps.
  assert.deepEqual(coverageGaps(demoData.athletes, tracked, checks.slice(0, 2)), []);
});

test('private, missing and never-checked identities each say why their entries are unknown', () => {
  const tracked = trackedIdentities(demoData.athletes, ['demo-02', 'demo-04']);
  const checks: SourceCheck[] = [
    { identity: { source: 'Example Platform A', sourceAthleteId: 'a-1002' }, status: 'private', checkedAt: '2026-10-30T12:00:00Z' },
  ];
  const labels = coverageGaps(demoData.athletes, tracked, checks).map(gapLabel);
  assert.deepEqual(labels, [
    "Demo Athlete 02's Example Platform A profile is private, so entries there are unknown.",
    "Demo Athlete 04 hasn't been checked on Example Platform B yet, so entries there are unknown.",
  ]);
  const missing = coverageGaps(demoData.athletes, trackedIdentities(demoData.athletes, ['demo-04']), [
    { identity: { source: 'Example Platform B', sourceAthleteId: 'b-2004' }, status: 'not-found', checkedAt: '2026-10-30T12:00:00Z' },
  ]);
  assert.match(gapLabel(missing[0]), /wasn't found on Example Platform B \(last tried 2026-10-30\), so entries there are unknown\.$/);
  for (const label of [...labels, gapLabel(missing[0])]) assert.match(label, /unknown\.$/);
});

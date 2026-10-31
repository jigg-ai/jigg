// Fictional MatSignal demo fixtures. Every athlete, team, academy, event, platform
// and identifier below is invented. model.test.ts fails if an athlete is named
// anything but "Demo Athlete NN", so real people can't be swapped in without the
// tests noticing. Do NOT replace these with real records before the
// source-permission, safeguarding and account decisions in HANDOFF §4–5.
//
// What the shapes demonstrate:
// - Registrations and matches are keyed by a platform's own identity, never by a
//   local guess. Demo Athlete 01 competes on both platforms, so it has two
//   confirmed identities.
// - Demo Athlete 03 also has an unconfirmed same-name candidate on Platform B,
//   with a registration. It shows in search but stays out of the queue until
//   someone confirms it.
// - Each event has exactly one platform. Dates and UTC offsets are illustrative.
// - Every division label is adult except Demo Athlete 02's Spring Open entry,
//   whose label doesn't say ("Open Division"). The age rule hides it, and the
//   page says an entry was hidden instead of implying there is none.
import type { DemoData, IdentityRef } from './model.ts';

const OBSERVED = '2026-10-30T12:00:00Z';
const A = 'Example Platform A';
const B = 'Example Platform B';
const id = (source: string, sourceAthleteId: string): IdentityRef => ({ source, sourceAthleteId });

export const demoData: DemoData = {
  athletes: [
    {
      id: 'demo-01',
      displayName: 'Demo Athlete 01',
      affiliationHint: 'Example Alliance',
      academyHint: 'Northside Academy',
      identities: [
        { ...id(A, 'a-1001'), observedName: 'Demo Athlete 01', match: 'confirmed', checkedAt: OBSERVED },
        { ...id(B, 'b-2001'), observedName: 'Demo Athlete 01', match: 'confirmed', checkedAt: OBSERVED },
      ],
    },
    {
      id: 'demo-02',
      displayName: 'Demo Athlete 02',
      affiliationHint: 'Example Alliance',
      academyHint: 'Lakeside Jiu-Jitsu',
      identities: [{ ...id(A, 'a-1002'), observedName: 'Demo Athlete 02', match: 'confirmed', checkedAt: OBSERVED }],
    },
    {
      id: 'demo-03',
      displayName: 'Demo Athlete 03',
      affiliationHint: 'Sample Jiu-Jitsu',
      academyHint: 'Sample City Academy',
      identities: [
        { ...id(A, 'a-1003'), observedName: 'Demo Athlete 03', match: 'confirmed', checkedAt: OBSERVED },
        { ...id(B, 'b-2003'), observedName: 'Demo Athlete 03', match: 'candidate', checkedAt: OBSERVED },
      ],
    },
    {
      id: 'demo-04',
      displayName: 'Demo Athlete 04',
      affiliationHint: 'Sample Jiu-Jitsu',
      academyHint: 'Uptown Grappling',
      identities: [{ ...id(B, 'b-2004'), observedName: 'Demo Athlete 04', match: 'confirmed', checkedAt: OBSERVED }],
    },
  ],
  events: [
    { id: 'a:sample-autumn-open', name: 'Sample Autumn Open', source: A, date: '2026-11-14' },
    { id: 'b:sample-winter-open', name: 'Sample Winter Open', source: B, date: '2026-12-05' },
    { id: 'a:sample-spring-open', name: 'Sample Spring Open', source: A, date: '2027-03-06' },
  ],
  registrations: [
    { identity: id(A, 'a-1001'), eventId: 'a:sample-autumn-open', division: 'Adult / Male / Blue / Light', status: 'registered', observedAt: OBSERVED },
    { identity: id(B, 'b-2001'), eventId: 'b:sample-winter-open', division: 'Adult / Male / Blue / Light', status: 'registered', observedAt: OBSERVED },
    { identity: id(A, 'a-1002'), eventId: 'a:sample-autumn-open', division: 'Master 1 / Male / Purple / Middle', status: 'registered', observedAt: OBSERVED },
    { identity: id(A, 'a-1003'), eventId: 'a:sample-autumn-open', division: 'Adult / Female / Brown / Feather', status: 'registered', observedAt: OBSERVED },
    { identity: id(B, 'b-2003'), eventId: 'b:sample-winter-open', division: 'Adult / Female / Brown / Feather', status: 'registered', observedAt: OBSERVED },
    { identity: id(B, 'b-2004'), eventId: 'b:sample-winter-open', division: 'Master 2 / Female / Black / Light', status: 'registered', observedAt: OBSERVED },
    { identity: id(A, 'a-1002'), eventId: 'a:sample-spring-open', division: 'Open Division / Purple / Middle', status: 'registered', observedAt: OBSERVED },
  ],
  // Winter Open registrations have no match yet: the platform hasn't published one.
  matches: [
    {
      identity: id(A, 'a-1001'), eventId: 'a:sample-autumn-open', mat: 'Mat 3', opponentLabel: 'Demo Athlete 07',
      startsAt: '2026-11-14T11:40:00-05:00', timeKind: 'estimated', observedAt: OBSERVED,
    },
    {
      identity: id(A, 'a-1002'), eventId: 'a:sample-autumn-open', mat: 'Mat 5', opponentLabel: 'Demo Athlete 08',
      startsAt: '2026-11-14T10:55:00-05:00', timeKind: 'estimated', observedAt: OBSERVED,
    },
    {
      identity: id(A, 'a-1003'), eventId: 'a:sample-autumn-open', mat: 'Mat 1', opponentLabel: 'Demo Athlete 09',
      startsAt: '2026-11-14T13:20:00-05:00', timeKind: 'scheduled', observedAt: OBSERVED,
    },
  ],
};

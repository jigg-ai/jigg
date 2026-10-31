// Fictional MatSignal demo fixtures. Every athlete, team, academy, event, organizer
// and source below is invented. model.test.ts fails if an athlete is named anything
// but "Demo Athlete NN", so real people can't be swapped in without the tests
// noticing. Do NOT replace these with real records before the source-permission,
// safeguarding and account decisions in HANDOFF §4–5.
//
// The dates and UTC offsets are illustrative too. Each event has one organizer:
// the original inline fixtures listed the Autumn Open under two platforms, which a
// real event never is.
import type { DemoData } from './model.ts';

const OBSERVED = '2026-10-30T12:00:00Z';

export const demoData: DemoData = {
  athletes: [
    {
      id: 'demo-01',
      displayName: 'Demo Athlete 01',
      affiliationHint: 'Example Alliance',
      academyHint: 'Northside Academy',
      identities: [{ source: 'Illustrative Source A', sourceAthleteId: 'a-1001', observedName: 'Demo Athlete 01', checkedAt: OBSERVED }],
    },
    {
      id: 'demo-02',
      displayName: 'Demo Athlete 02',
      affiliationHint: 'Example Alliance',
      academyHint: 'Lakeside Jiu-Jitsu',
      identities: [{ source: 'Illustrative Source B', sourceAthleteId: 'b-2002', observedName: 'Demo Athlete 02', checkedAt: OBSERVED }],
    },
    {
      id: 'demo-03',
      displayName: 'Demo Athlete 03',
      affiliationHint: 'Sample Jiu-Jitsu',
      academyHint: 'Sample City Academy',
      identities: [{ source: 'Illustrative Source A', sourceAthleteId: 'a-1003', observedName: 'Demo Athlete 03', checkedAt: OBSERVED }],
    },
    {
      id: 'demo-04',
      displayName: 'Demo Athlete 04',
      affiliationHint: 'Sample Jiu-Jitsu',
      academyHint: 'Uptown Grappling',
      identities: [{ source: 'Illustrative Source B', sourceAthleteId: 'b-2004', observedName: 'Demo Athlete 04', checkedAt: OBSERVED }],
    },
  ],
  events: [
    { id: 'sample-autumn-open', name: 'Sample Autumn Open', source: 'Example Organizer A', date: '2026-11-14' },
    { id: 'sample-winter-open', name: 'Sample Winter Open', source: 'Example Organizer B', date: '2026-12-05' },
  ],
  registrations: [
    { athleteId: 'demo-01', eventId: 'sample-autumn-open', status: 'registered', source: 'Example Organizer A', observedAt: OBSERVED },
    { athleteId: 'demo-01', eventId: 'sample-winter-open', status: 'registered', source: 'Example Organizer B', observedAt: OBSERVED },
    { athleteId: 'demo-02', eventId: 'sample-autumn-open', status: 'registered', source: 'Example Organizer A', observedAt: OBSERVED },
    { athleteId: 'demo-03', eventId: 'sample-autumn-open', status: 'registered', source: 'Example Organizer A', observedAt: OBSERVED },
    { athleteId: 'demo-04', eventId: 'sample-winter-open', status: 'registered', source: 'Example Organizer B', observedAt: OBSERVED },
  ],
  // Winter Open registrations have no match yet: the organizer hasn't published one.
  matches: [
    {
      athleteId: 'demo-01', eventId: 'sample-autumn-open', mat: 'Mat 3', opponentLabel: 'Demo Athlete 07',
      startsAt: '2026-11-14T11:40:00-05:00', timeKind: 'estimated', source: 'Example Organizer A', observedAt: OBSERVED,
    },
    {
      athleteId: 'demo-02', eventId: 'sample-autumn-open', mat: 'Mat 5', opponentLabel: 'Demo Athlete 08',
      startsAt: '2026-11-14T10:55:00-05:00', timeKind: 'estimated', source: 'Example Organizer A', observedAt: OBSERVED,
    },
    {
      athleteId: 'demo-03', eventId: 'sample-autumn-open', mat: 'Mat 1', opponentLabel: 'Demo Athlete 09',
      startsAt: '2026-11-14T13:20:00-05:00', timeKind: 'scheduled', source: 'Example Organizer A', observedAt: OBSERVED,
    },
  ],
};

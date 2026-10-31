// MatSignal (PRD-003) demo domain model: source-independent shapes plus the pure
// functions the demo page renders from. The shapes follow
// builds/matsignal-competition/HANDOFF.md §3. Nothing here fetches anything; the
// only data is the fictional fixtures in ./fixtures.ts.
//
// Pure on purpose: search, selection and queue ordering are unit-tested in
// model.test.ts (`npm test`), so the page script only wires them to the DOM.

/** How far a match time can be trusted. Only a source can make it anything but unknown. */
export type TimeKind = 'scheduled' | 'estimated' | 'unknown';

/**
 * One athlete record as a single source publishes it. `sourceAthleteId` is that
 * source's own identifier: not a universal personal ID, and not comparable across
 * sources.
 */
export interface SourceIdentity {
  source: string;
  sourceAthleteId: string;
  observedName: string;
  /** ISO 8601. When this identity was last checked against its source. */
  checkedAt: string;
}

/**
 * An athlete in MatSignal's local index. Not proof of identity: identities from
 * different sources stay separate unless something reliable links them.
 */
export interface Athlete {
  id: string;
  displayName: string;
  /** The team name given at registration. A hint, never an official roster claim. */
  affiliationHint?: string;
  academyHint?: string;
  identities: SourceIdentity[];
}

export interface CompetitionEvent {
  id: string;
  name: string;
  /** The organizer platform that publishes this event. */
  source: string;
  /** The event's local calendar date, YYYY-MM-DD. */
  date: string;
}

export type RegistrationStatus = 'registered' | 'withdrawn' | 'unknown';

export interface Registration {
  athleteId: string;
  eventId: string;
  status: RegistrationStatus;
  source: string;
  /** ISO 8601. When the source was observed to show this registration. */
  observedAt: string;
}

/** A match. Mat, opponent and time are present only when the source published them. */
export interface Match {
  athleteId: string;
  eventId: string;
  mat?: string;
  opponentLabel?: string;
  /** ISO 8601 with the event's UTC offset, e.g. 2026-11-14T11:40:00-05:00. */
  startsAt?: string;
  timeKind: TimeKind;
  source: string;
  observedAt: string;
}

export interface DemoData {
  athletes: Athlete[];
  events: CompetitionEvent[];
  registrations: Registration[];
  matches: Match[];
}

/** One row of the competition-day queue: a registration, and its match once published. */
export interface QueueEntry {
  athlete: Athlete;
  event: CompetitionEvent;
  match?: Match;
}

export const ALL_AFFILIATIONS = 'all';

/** Case-insensitive match on name, affiliation or academy, in fixture order. */
export function searchAthletes(athletes: Athlete[], query: string, affiliation: string): Athlete[] {
  const q = query.trim().toLowerCase();
  return athletes.filter((a) => {
    if (affiliation !== ALL_AFFILIATIONS && a.affiliationHint !== affiliation) return false;
    return [a.displayName, a.affiliationHint, a.academyHint].join(' ').toLowerCase().includes(q);
  });
}

/**
 * Reads a stored selection back. Anything unparseable, any non-string and any ID
 * that isn't a known athlete is dropped, and duplicates collapse to one.
 */
export function restoreSelection(raw: string | null, athletes: Athlete[]): string[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw ?? '[]');
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];
  const known = new Set(athletes.map((a) => a.id));
  return [...new Set(parsed.filter((v): v is string => typeof v === 'string' && known.has(v)))];
}

/** A time is known only if the source published one and didn't mark it unknown. */
export const hasKnownTime = (match?: Match): match is Match & { startsAt: string } =>
  !!match?.startsAt && match.timeKind !== 'unknown';

/**
 * Total order for the queue: event date, then published times by actual instant
 * (offsets included, so events in different time zones interleave correctly),
 * then unknown times, then event name, athlete name and ID so that ties are
 * deterministic. Every step is antisymmetric; the old inline comparator returned
 * 1 both ways for two unknown times, leaving their order to the browser.
 */
export function compareQueueEntries(a: QueueEntry, b: QueueEntry): number {
  if (a.event.date !== b.event.date) return a.event.date < b.event.date ? -1 : 1;
  const aKnown = hasKnownTime(a.match);
  const bKnown = hasKnownTime(b.match);
  if (aKnown !== bKnown) return aKnown ? -1 : 1;
  if (aKnown && bKnown) {
    const diff = Date.parse(a.match!.startsAt!) - Date.parse(b.match!.startsAt!);
    if (diff !== 0) return diff < 0 ? -1 : 1;
  }
  for (const [x, y] of [
    [a.event.name, b.event.name],
    [a.athlete.displayName, b.athlete.displayName],
    [a.athlete.id, b.athlete.id],
  ]) {
    if (x !== y) return x < y ? -1 : 1;
  }
  return 0;
}

/** Selected athletes' registrations, with any published match, in queue order. Withdrawals are left out. */
export function buildQueue(data: DemoData, selectedIds: Iterable<string>): QueueEntry[] {
  const selected = new Set(selectedIds);
  const athletes = new Map(data.athletes.map((a) => [a.id, a]));
  const events = new Map(data.events.map((e) => [e.id, e]));
  const entries: QueueEntry[] = [];
  for (const r of data.registrations) {
    if (!selected.has(r.athleteId) || r.status === 'withdrawn') continue;
    const athlete = athletes.get(r.athleteId);
    const event = events.get(r.eventId);
    if (!athlete || !event) continue;
    const match = data.matches.find((m) => m.athleteId === r.athleteId && m.eventId === r.eventId);
    entries.push({ athlete, event, match });
  }
  return entries.sort(compareQueueEntries);
}

/** The event-local clock time as published (the offset is the event's), or "Unknown". */
export const timeLabel = (match?: Match): string => (hasKnownTime(match) ? match.startsAt.slice(11, 16) : 'Unknown');

export const timeKindLabel = (match?: Match): string =>
  !hasKnownTime(match) ? 'Not published' : match.timeKind === 'scheduled' ? 'Scheduled' : 'Estimated';

/** "Nov 14" from "2026-11-14", read as a calendar date so no time zone can shift it. */
export const formatEventDate = (date: string): string =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: '2-digit', timeZone: 'UTC' });

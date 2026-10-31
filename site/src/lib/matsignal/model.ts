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
 * Points at one athlete record on one platform. `sourceAthleteId` is that
 * platform's own identifier: not a universal personal ID, and never compared
 * across platforms.
 */
export interface IdentityRef {
  source: string;
  sourceAthleteId: string;
}

export const identityKey = (ref: IdentityRef): string => `${ref.source}:${ref.sourceAthleteId}`;

/**
 * Whether a source identity is known to be this athlete. `candidate` covers a
 * same-name record nobody has confirmed: it is shown, but its registrations and
 * matches stay out of the athlete's queue until a user (or a reliable source
 * link) confirms it.
 */
export type IdentityMatch = 'confirmed' | 'candidate';

/** One athlete record as a single platform publishes it. */
export interface SourceIdentity extends IdentityRef {
  observedName: string;
  profileUrl?: string;
  match: IdentityMatch;
  /** ISO 8601. When this identity was last checked against its source. */
  checkedAt: string;
}

/**
 * An athlete in MatSignal's local index. Not proof of identity: identities from
 * different platforms stay separate records unless something reliable links them.
 */
export interface Athlete {
  id: string;
  displayName: string;
  aliases?: string[];
  /** The team name given at registration. A hint, never proof of membership in a physical gym. */
  affiliationHint?: string;
  academyHint?: string;
  identities: SourceIdentity[];
}

export interface CompetitionEvent {
  /** Unique in the index; real adapters prefix the platform's own event ID. */
  id: string;
  name: string;
  /** The platform that publishes this event. */
  source: string;
  /** The event's local calendar date, YYYY-MM-DD. */
  date: string;
  url?: string;
}

export type RegistrationStatus = 'registered' | 'withdrawn' | 'unknown';

/** A registration as the platform shows it: keyed by that platform's identity, never by a local guess. */
export interface Registration {
  identity: IdentityRef;
  eventId: string;
  division?: string;
  status: RegistrationStatus;
  /** ISO 8601. When the source was observed to show this registration. */
  observedAt: string;
}

/** A match. Mat, opponent and time are present only when the source published them. */
export interface Match {
  identity: IdentityRef;
  eventId: string;
  mat?: string;
  opponentLabel?: string;
  /** ISO 8601 with the event's UTC offset, e.g. 2026-11-14T11:40:00-05:00. */
  startsAt?: string;
  timeKind: TimeKind;
  observedAt: string;
}

/**
 * A user-curated set of source identities. Membership is the user's choice; it
 * says nothing about an official roster or academy. Production groups need a free
 * account (HANDOFF §5); the demo keeps its selection in localStorage instead.
 */
export interface TrackingGroup {
  id: string;
  name: string;
  members: IdentityRef[];
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
  registration: Registration;
  match?: Match;
}

export const ALL_AFFILIATIONS = 'all';

/** Case-insensitive match on name, aliases, affiliation or academy, in index order. */
export function searchAthletes(athletes: Athlete[], query: string, affiliation: string): Athlete[] {
  const q = query.trim().toLowerCase();
  return athletes.filter((a) => {
    if (affiliation !== ALL_AFFILIATIONS && a.affiliationHint !== affiliation) return false;
    return [a.displayName, ...(a.aliases ?? []), a.affiliationHint, a.academyHint].join(' ').toLowerCase().includes(q);
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

/** The identities a selection of athletes tracks: confirmed ones only. */
export function trackedIdentities(athletes: Athlete[], selectedIds: Iterable<string>): IdentityRef[] {
  const selected = new Set(selectedIds);
  return athletes
    .filter((a) => selected.has(a.id))
    .flatMap((a) => a.identities.filter((i) => i.match === 'confirmed'))
    .map(({ source, sourceAthleteId }) => ({ source, sourceAthleteId }));
}

/**
 * Adds identities a source returned for a search to the local index, so the next
 * search reuses them instead of rediscovering them. A known identity is refreshed
 * in place; a new one becomes its own athlete. Nothing is merged by name: two
 * platforms' records for the same name stay two athletes until something reliable
 * links them.
 */
export function upsertDiscovered(athletes: Athlete[], found: SourceIdentity[]): Athlete[] {
  const next = athletes.map((a) => ({ ...a, identities: [...a.identities] }));
  for (const identity of found) {
    const key = identityKey(identity);
    const owner = next.find((a) => a.identities.some((i) => identityKey(i) === key));
    if (owner) {
      owner.identities = owner.identities.map((i) =>
        identityKey(i) === key ? { ...i, observedName: identity.observedName, profileUrl: identity.profileUrl ?? i.profileUrl, checkedAt: identity.checkedAt } : i,
      );
    } else {
      next.push({ id: `ath:${key}`, displayName: identity.observedName, identities: [{ ...identity, match: 'confirmed' }] });
    }
  }
  return next;
}

/**
 * Adults only, fail closed (HANDOFF §4: no youth profiles, no minors' schedules).
 * A division counts as adult only when its label says so outright ("Adult",
 * "Master 2", "18+"). Youth wording, or an age range or "N+" that starts under
 * 18, makes it youth, and youth wins when a label mixes both. Everything else
 * is unknown and treated like youth: hidden. Numbers alone never make a
 * division adult, because weight classes ("58-64") look like age ranges.
 */
export type AgeGroup = 'adult' | 'youth' | 'unknown';

const YOUTH_WORDS = /\b(?:kids?|youth|juvenile|teens?|juniors?|pee ?wee|mighty ?mites?|tots?|boys|girls|u-?1[0-8]|under[ -]?1[0-8])\b/i;
const ADULT_WORDS = /\b(?:adults?|masters?(?: ?\d)?|18 ?\+|18 (?:and|&) (?:over|up))(?!\w)/i;

export function classifyDivision(label?: string): AgeGroup {
  if (!label?.trim()) return 'unknown';
  if (YOUTH_WORDS.test(label)) return 'youth';
  // "4-5", "14 to 15", "16–17": an age range ending under 18. Weights with a unit are skipped.
  for (const [, , hi] of label.matchAll(/(?<![\d.])(\d{1,2})\s*(?:-|–|to)\s*(\d{1,2})(?![\d.])(?!\s*(?:kg|lbs?)\b)/gi)) {
    if (Number(hi) < 18) return 'youth';
  }
  for (const [, n] of label.matchAll(/\b(\d{1,2})\s*\+/g)) {
    if (Number(n) < 18) return 'youth';
  }
  return ADULT_WORDS.test(label) ? 'adult' : 'unknown';
}

/** The tracked identities' registrations the age rule keeps out of the queue. */
export function hiddenByAge(data: DemoData, tracked: IdentityRef[]): number {
  const keys = new Set(tracked.map(identityKey));
  return data.registrations.filter(
    (r) => keys.has(identityKey(r.identity)) && r.status !== 'withdrawn' && classifyDivision(r.division) !== 'adult',
  ).length;
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

/**
 * The tracked identities' registrations, with any published match, in queue
 * order. Left out: withdrawals; any identity that isn't tracked, which by
 * trackedIdentities includes every unconfirmed candidate; and any division not
 * confirmed adult (classifyDivision). hiddenByAge counts the last group so the
 * page can say entries were hidden rather than imply there were none.
 */
export function buildQueue(data: DemoData, tracked: IdentityRef[]): QueueEntry[] {
  const keys = new Set(tracked.map(identityKey));
  const owners = new Map(data.athletes.flatMap((a) => a.identities.map((i) => [identityKey(i), a] as const)));
  const events = new Map(data.events.map((e) => [e.id, e]));
  const entries: QueueEntry[] = [];
  for (const registration of data.registrations) {
    const key = identityKey(registration.identity);
    if (!keys.has(key) || registration.status === 'withdrawn') continue;
    if (classifyDivision(registration.division) !== 'adult') continue;
    const athlete = owners.get(key);
    const event = events.get(registration.eventId);
    if (!athlete || !event) continue;
    const match = data.matches.find((m) => identityKey(m.identity) === key && m.eventId === registration.eventId);
    entries.push({ athlete, event, registration, match });
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

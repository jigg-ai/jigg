// Source-adapter contract (HANDOFF §3–4). One adapter per platform, and each one
// declares what it can actually do: MatSignal never assumes every organizer offers
// the same lookups. The only implementation here is backed by the fictional
// fixtures. A real adapter needs a documented source path and the founder's
// approval first (HANDOFF §4, Gate B); nothing in this file makes a request.
import {
  identityKey,
  type CompetitionEvent,
  type DemoData,
  type IdentityRef,
  type Match,
  type Registration,
  type SourceIdentity,
} from './model.ts';

export type Capability =
  /** Name → candidate identities on this platform. */
  | 'find-athletes'
  /** One identity → its upcoming registrations. The athlete-first route. */
  | 'athlete-upcoming'
  /** One event → everyone registered. The event-centric fallback. */
  | 'event-entrants'
  /** One event → published bracket, mat, order and time data. */
  | 'event-matches';

export type AdapterErrorKind = 'unsupported' | 'not-found' | 'rate-limited' | 'blocked' | 'unavailable';
export interface AdapterError {
  kind: AdapterErrorKind;
  message: string;
  retryAfterMs?: number;
}
export type AdapterResult<T> = { ok: true; value: T; fetchedAt: string } | { ok: false; error: AdapterError };

export interface UpcomingRegistrations {
  events: CompetitionEvent[];
  registrations: Registration[];
}

export interface SourceAdapter {
  readonly source: string;
  readonly capabilities: ReadonlySet<Capability>;
  findAthletes(name: string): Promise<AdapterResult<SourceIdentity[]>>;
  athleteUpcoming(identity: IdentityRef): Promise<AdapterResult<UpcomingRegistrations>>;
  eventEntrants(eventId: string): Promise<AdapterResult<Registration[]>>;
  eventMatches(eventId: string): Promise<AdapterResult<Match[]>>;
}

const fail = (kind: AdapterErrorKind, message: string): AdapterResult<never> => ({ ok: false, error: { kind, message } });

interface FixtureOptions {
  /** Which capabilities to expose; defaults to all four. */
  capabilities?: Capability[];
  /** "Today" for deciding what is upcoming, YYYY-MM-DD. */
  today?: string;
  now?: () => string;
}

/**
 * An adapter answering from fixture data for one platform. Restricting its
 * capabilities simulates platforms that, for example, publish entrant lists but
 * no athlete pages, so the lookup strategy can be tested against both shapes.
 * `requests` counts calls, standing in for page requests in cost estimates.
 */
export function fixtureAdapter(source: string, data: DemoData, opts: FixtureOptions = {}) {
  const capabilities = new Set<Capability>(opts.capabilities ?? ['find-athletes', 'athlete-upcoming', 'event-entrants', 'event-matches']);
  const now = opts.now ?? (() => new Date().toISOString());
  const today = opts.today ?? now().slice(0, 10);
  const events = data.events.filter((e) => e.source === source);
  const eventById = new Map(events.map((e) => [e.id, e]));
  const ok = <T>(value: T): AdapterResult<T> => ({ ok: true, value, fetchedAt: now() });
  const requests = { count: 0 };
  const gate = (capability: Capability) => {
    if (!capabilities.has(capability)) return fail('unsupported', `${source} does not offer ${capability}`);
    requests.count += 1;
    return undefined;
  };

  const adapter: SourceAdapter & { requests: typeof requests } = {
    source,
    capabilities,
    requests,
    async findAthletes(name) {
      const blocked = gate('find-athletes');
      if (blocked) return blocked;
      const q = name.trim().toLowerCase();
      // A platform's search result is a candidate: matching a local athlete is the index's job.
      const found = data.athletes
        .flatMap((a) => a.identities)
        .filter((i) => i.source === source && i.observedName.toLowerCase().includes(q))
        .map((i): SourceIdentity => ({ ...i, match: 'candidate' }));
      return ok(found);
    },
    async athleteUpcoming(identity) {
      const blocked = gate('athlete-upcoming');
      if (blocked) return blocked;
      if (identity.source !== source) return fail('not-found', `${identityKey(identity)} is not a ${source} identity`);
      const registrations = data.registrations.filter(
        (r) => identityKey(r.identity) === identityKey(identity) && (eventById.get(r.eventId)?.date ?? '') >= today,
      );
      return ok({ registrations, events: [...new Set(registrations.map((r) => eventById.get(r.eventId)!))] });
    },
    async eventEntrants(eventId) {
      const blocked = gate('event-entrants');
      if (blocked) return blocked;
      if (!eventById.has(eventId)) return fail('not-found', `${source} has no event ${eventId}`);
      return ok(data.registrations.filter((r) => r.eventId === eventId));
    },
    async eventMatches(eventId) {
      const blocked = gate('event-matches');
      if (blocked) return blocked;
      if (!eventById.has(eventId)) return fail('not-found', `${source} has no event ${eventId}`);
      return ok(data.matches.filter((m) => m.eventId === eventId));
    },
  };
  return adapter;
}

/** The most entrant lists one lookup may read when a platform has no athlete-level route. */
export const MAX_EVENTS_SCANNED_PER_LOOKUP = 5;

/**
 * An identity's upcoming registrations, athlete-first: one request where the
 * platform can answer for an athlete directly. Otherwise it falls back to the
 * entrant lists of a short, caller-supplied list of upcoming events on that
 * platform (bounded, never "every tournament"), and says how many it skipped.
 */
export async function upcomingFor(
  adapter: SourceAdapter,
  identity: IdentityRef,
  candidateEventIds: string[] = [],
): Promise<AdapterResult<{ registrations: Registration[]; route: 'athlete' | 'event-entrants'; eventsSkipped: number }>> {
  if (adapter.capabilities.has('athlete-upcoming')) {
    const r = await adapter.athleteUpcoming(identity);
    return r.ok ? { ...r, value: { registrations: r.value.registrations, route: 'athlete', eventsSkipped: 0 } } : r;
  }
  if (!adapter.capabilities.has('event-entrants')) return fail('unsupported', `${adapter.source} offers no route to registrations`);
  const scan = candidateEventIds.slice(0, MAX_EVENTS_SCANNED_PER_LOOKUP);
  const key = identityKey(identity);
  const registrations: Registration[] = [];
  let fetchedAt = '';
  for (const eventId of scan) {
    const r = await adapter.eventEntrants(eventId);
    if (!r.ok) return r;
    fetchedAt = r.fetchedAt;
    registrations.push(...r.value.filter((x) => identityKey(x.identity) === key));
  }
  return { ok: true, fetchedAt, value: { registrations, route: 'event-entrants', eventsSkipped: candidateEventIds.length - scan.length } };
}

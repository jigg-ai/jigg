// Lookup cache, request dedup and refresh policy for source adapters (HANDOFF §3:
// "dedupe requests, cap rate and show source/time"). Nothing here fetches; it
// decides when an adapter call is worth making at all.
//
// The intervals in refreshIntervalMs are a starting proposal, not measurements.
// They get tuned once a real source's update pattern has been observed (the
// feasibility report's smallest real-data test).
import type { AdapterResult } from './adapters.ts';

/**
 * One entry per key (e.g. "Example Platform A:athlete-upcoming:a-1001"). A fresh
 * entry is served without calling the source; concurrent requests for the same
 * key share one in-flight call; only successful results are stored, so a
 * rate-limit or outage is retried rather than cached.
 */
export class LookupCache {
  private readonly entries = new Map<string, { result: AdapterResult<unknown>; storedAt: number }>();
  private readonly inflight = new Map<string, Promise<AdapterResult<unknown>>>();
  // Plain fields, not constructor parameter properties: Node runs these files with
  // type stripping only, which doesn't support that syntax.
  private readonly now: () => number;

  constructor(now: () => number = Date.now) {
    this.now = now;
  }

  /** `maxAgeMs` null means: once cached, never refresh on a schedule. */
  async get<T>(key: string, maxAgeMs: number | null, load: () => Promise<AdapterResult<T>>): Promise<AdapterResult<T>> {
    const hit = this.entries.get(key);
    if (hit && (maxAgeMs === null || this.now() - hit.storedAt < maxAgeMs)) return hit.result as AdapterResult<T>;
    const pending = this.inflight.get(key);
    if (pending) return pending as Promise<AdapterResult<T>>;
    const call = load()
      .then((result) => {
        if (result.ok) this.entries.set(key, { result, storedAt: this.now() });
        return result;
      })
      .finally(() => this.inflight.delete(key));
    this.inflight.set(key, call);
    return call;
  }
}

export type RefreshKind = 'athlete-upcoming' | 'event-entrants' | 'event-matches';

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

/** Whole days from `now` to an event's YYYY-MM-DD date, in UTC (±1 day of slack for time zones). */
export const daysUntil = (eventDate: string, now: number): number =>
  Math.round((Date.parse(`${eventDate}T00:00:00Z`) - Date.parse(new Date(now).toISOString().slice(0, 10) + 'T00:00:00Z')) / DAY);

/**
 * How often a cached answer may be refreshed, driven by user interest and event
 * proximity. null = don't refresh on a schedule; refetch only when a user asks.
 *
 * - athlete-upcoming: 6 h while someone tracks the athlete, else 24 h.
 * - event-entrants:   daily until two weeks out, then every 6 h; nothing once
 *                     the event has started (registration is closed).
 * - event-matches:    only for an event a tracked athlete is in: hourly the day
 *                     before (brackets tend to appear then), every 2 minutes on
 *                     the day, and never otherwise. Untracked events are not polled.
 */
export function refreshIntervalMs(kind: RefreshKind, ctx: { now: number; eventDate?: string; tracked: boolean }): number | null {
  if (kind === 'athlete-upcoming') return ctx.tracked ? 6 * HOUR : DAY;
  if (!ctx.eventDate) return null;
  const days = daysUntil(ctx.eventDate, ctx.now);
  if (kind === 'event-entrants') {
    if (days < 1) return null;
    return days > 14 ? DAY : 6 * HOUR;
  }
  if (!ctx.tracked) return null;
  if (days === 1) return HOUR;
  if (days === 0) return 2 * 60_000;
  return null;
}

/**
 * A per-source request budget (token bucket): at most `perMinute` calls to any
 * one platform, however many users ask at once. A caller that can't take a token
 * answers from cache or reports "rate-limited"; it never queues unbounded work.
 */
export class RequestBudget {
  private readonly buckets = new Map<string, { tokens: number; at: number }>();
  private readonly perMinute: number;
  private readonly now: () => number;

  constructor(perMinute: number, now: () => number = Date.now) {
    this.perMinute = perMinute;
    this.now = now;
  }

  tryTake(source: string): boolean {
    const t = this.now();
    const b = this.buckets.get(source) ?? { tokens: this.perMinute, at: t };
    b.tokens = Math.min(this.perMinute, b.tokens + ((t - b.at) / 60_000) * this.perMinute);
    b.at = t;
    const took = b.tokens >= 1;
    if (took) b.tokens -= 1;
    this.buckets.set(source, b);
    return took;
  }
}

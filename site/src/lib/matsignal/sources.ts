// What MatSignal knows about each real platform, and the gate that keeps real data
// adapters switched off until a source is permitted (HANDOFF §4, Gate B; acceptance
// item H-04, "per-source capability matrix"). The facts mirror
// builds/matsignal-competition/FEASIBILITY.md: change the two together.
//
// Another product scraping a platform is not permission for MatSignal to do it.
// Only written permission or an official API on record turns `automatedAccess`
// into 'permitted', and that change needs the founder's approval.

export type Evidence = 'verified' | 'documented' | 'assumed' | 'unknown';

export interface Fact<T> {
  value: T;
  evidence: Evidence;
  /** Where it was seen. */
  url?: string;
}

/**
 * - permitted: written permission or an official API is on record.
 * - not-permitted: nothing on record, and the terms don't license automated reuse.
 * - prohibited: the terms forbid automated access outright.
 */
export type AutomatedAccess = 'permitted' | 'not-permitted' | 'prohibited';

export interface SourceProfile {
  source: string;
  /** One athlete identity → their upcoming registrations. */
  athleteRoute: Fact<boolean | null>;
  /** One event → everyone registered. */
  eventEntrants: Fact<boolean>;
  /** Published mat, order and time on match day. */
  matchData: Fact<boolean>;
  publicApi: Fact<boolean | null>;
  automatedAccess: Fact<AutomatedAccess>;
  /** Whether plain links to the platform's pages are allowed by its visitor terms. */
  linking: Fact<'allowed' | 'restricted'>;
  checkedOn: string;
}

export const SOURCES = {
  Smoothcomp: {
    source: 'Smoothcomp',
    // The profile lists "upcoming events you're registered for"; whether visitors see it is open.
    athleteRoute: { value: true, evidence: 'documented', url: 'https://support.smoothcomp.com/article/398-athlete-profile' },
    eventEntrants: { value: true, evidence: 'assumed' },
    matchData: { value: true, evidence: 'documented', url: 'https://support.smoothcomp.com/article/73-how-to-schedule-your-tournament' },
    publicApi: { value: false, evidence: 'verified', url: 'https://support.smoothcomp.com/search?query=api' },
    // Profile and event pages refuse automated clients; ToS §12.1 licenses content
    // "only in the manner in which such information is presented to you".
    automatedAccess: { value: 'not-permitted', evidence: 'verified', url: 'https://smoothcomp.com/en/agreements?t=tos' },
    linking: { value: 'allowed', evidence: 'verified', url: 'https://smoothcomp.com/en/agreements?t=tos' },
    checkedOn: '2026-10-30',
  },
  IBJJF: {
    source: 'IBJJF',
    athleteRoute: { value: false, evidence: 'verified', url: 'https://ibjjf.com/2026-athletes-ranking' },
    eventEntrants: { value: true, evidence: 'verified', url: 'https://ibjjf.com/events/3409/athletes-list-by-divisions' },
    matchData: { value: true, evidence: 'verified', url: 'https://www.bjjcompsystem.com/' },
    publicApi: { value: false, evidence: 'verified' },
    // "you will not access the Services through automated or non-human means".
    automatedAccess: { value: 'prohibited', evidence: 'verified', url: 'https://ibjjf.com/terms-of-use' },
    // §4: "Engage in unauthorized framing of or linking to the Services."
    linking: { value: 'restricted', evidence: 'verified', url: 'https://ibjjf.com/terms-of-use' },
    checkedOn: '2026-10-30',
  },
} satisfies Record<string, SourceProfile>;

export type KnownSource = keyof typeof SOURCES;

export class SourceNotPermittedError extends Error {
  readonly source: string;
  readonly access: AutomatedAccess | 'unknown-source';
  constructor(source: string, access: AutomatedAccess | 'unknown-source') {
    super(`Automated access to ${source} is ${access}; no real adapter may run (HANDOFF §4, Gate B).`);
    this.name = 'SourceNotPermittedError';
    this.source = source;
    this.access = access;
  }
}

/** Anything not in the matrix is treated as not permitted. */
const profileOf = (source: string): SourceProfile | undefined =>
  Object.hasOwn(SOURCES, source) ? SOURCES[source as KnownSource] : undefined;

/**
 * Every real adapter calls this before its first request. It throws for any
 * source whose automated access isn't 'permitted', which today is all of them.
 */
export function assertAutomatedAccessPermitted(source: string): void {
  const access = profileOf(source)?.automatedAccess.value ?? 'unknown-source';
  if (access !== 'permitted') throw new SourceNotPermittedError(source, access);
}

/** Whether MatSignal may show plain links to this platform's pages (the link-out MVP). */
export const linkOutAllowed = (source: string): boolean => profileOf(source)?.linking.value === 'allowed';

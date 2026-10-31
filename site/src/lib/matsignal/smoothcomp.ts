// Smoothcomp links → platform references. Parsing only: nothing here fetches, and
// a parsed URL is only ever rendered back as a link. It is never a server-side
// fetch target (HANDOFF §3 warns against accepting arbitrary URLs for that).
//
// Shared by both next steps in FEASIBILITY.md: the link-out MVP (Test B) stores
// these references, and a permitted adapter (Test A) would look them up.
//
// Patterns (public calendar and search-index evidence, 2026-10-30):
//   https://smoothcomp.com/<lang>/profile/<id>
//   https://<org>.smoothcomp.com/<lang>/profile/<id>
//   https://[<org>.]smoothcomp.com/<lang>/event/<id>[/anything]
// Event IDs come from one sequence across subdomains (verified). Profile IDs are
// assumed to be account-wide, but that is unconfirmed (FEASIBILITY Q7), so the
// original host is kept in the canonical URL rather than rewritten.
import type { IdentityRef } from './model.ts';

export const SMOOTHCOMP = 'Smoothcomp';

export type SmoothcompRef =
  | { kind: 'profile'; identity: IdentityRef; url: string }
  | { kind: 'event'; eventId: string; url: string };

const PATH = /^\/([a-z]{2}(?:-[a-z]{2})?)\/(profile|event)\/(\d{1,10})(?:\/.*)?$/i;

/** smoothcomp.com itself or one label under it; never a lookalike such as smoothcomp.com.example. */
const isSmoothcompHost = (host: string): boolean =>
  host === 'smoothcomp.com' || /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.smoothcomp\.com$/.test(host);

/**
 * A Smoothcomp profile or event reference from a pasted link, or null for anything
 * else: other hosts, other schemes (javascript:, data:), embedded credentials,
 * non-default ports, or paths that aren't a profile or event. Query strings and
 * fragments are dropped, so tracking parameters never get stored.
 */
export function parseSmoothcompUrl(input: string): SmoothcompRef | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
  if (url.username || url.password || url.port) return null;
  const host = url.hostname.toLowerCase();
  if (!isSmoothcompHost(host)) return null;
  const m = PATH.exec(url.pathname);
  if (!m) return null;
  const [, lang, kind, id] = m;
  const canonical = `https://${host}/${lang.toLowerCase()}/${kind.toLowerCase()}/${id}`;
  if (kind.toLowerCase() === 'event') return { kind: 'event', eventId: `smoothcomp:${id}`, url: canonical };
  return { kind: 'profile', identity: { source: SMOOTHCOMP, sourceAthleteId: id }, url: canonical };
}

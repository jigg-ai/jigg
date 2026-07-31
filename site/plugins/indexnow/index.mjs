import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * IndexNow submission — Bing, Yandex, Seznam and Naver share one endpoint.
 *
 * Why this exists at all, given Google ignores IndexNow: Bing's index is what
 * feeds ChatGPT search and Copilot, and CONTEXT.md §8 is about being citable by
 * answer engines, not about Bing's search share. It is also the only *automatable*
 * indexing channel that exists — Google's Indexing API takes JobPosting and
 * BroadcastEvent only, and its sitemap ping endpoint was deprecated in 2023.
 *
 * WHY A BUILD PLUGIN, and not a postbuild script or a GitHub Action:
 *
 *  - It must never fire on a Deploy Preview. Previews rebuild on every commit and
 *    would submit untested URLs for the production domain. The CONTEXT check below
 *    is the explicit gate, but the plugin form adds a structural one: this file
 *    only executes inside Netlify's build system, so no local `npm run build` can
 *    submit by accident. A postbuild script runs everywhere and relies on the
 *    if-statement alone.
 *  - A GitHub Action on merge cannot see whether the deploy actually happened.
 *    netlify.toml's `ignore` rule cancels builds for docs-only pushes, and an
 *    Action would happily announce URLs for a deploy that never ran. Riding the
 *    build means "no deploy, no submission" for free.
 *  - onSuccess runs after the build succeeds, so a broken build never announces
 *    anything. IndexNow is a hint, not a fetch — crawlers arrive minutes to hours
 *    later, well after Netlify publishes.
 *
 * The whole URL set is submitted each time rather than a diff: it is ~12 URLs at
 * a maximum of ~20 production deploys a month, far inside the protocol's 10,000
 * per request, and computing "what changed" from a git diff would be a fragile
 * second source of truth about routes.
 *
 * The key is deliberately not a secret — it is served publicly at
 * /<key>.txt, which is how the protocol proves domain ownership. It is read back
 * out of the built output rather than duplicated here, so the key and its file
 * cannot drift apart: the filename IS the key, and the contents must match it.
 */

const ENDPOINT = 'https://api.indexnow.org/IndexNow';
const KEY_FILE = /^([0-9a-fA-F]{8,120})\.txt$/;

/** Finds the IndexNow key file in the publish dir and validates it against itself. */
function readKey(publishDir) {
  const names = readdirSync(publishDir).filter((n) => KEY_FILE.test(n));
  if (names.length !== 1) {
    throw new Error(
      `expected exactly one <key>.txt in ${publishDir}, found ${names.length}` +
        (names.length ? ` (${names.join(', ')})` : ''),
    );
  }
  const key = names[0].match(KEY_FILE)[1];
  const body = readFileSync(join(publishDir, names[0]), 'utf8').trim();
  if (body !== key) {
    throw new Error(`${names[0]} must contain exactly its own key; it contains "${body}"`);
  }
  return key;
}

/** Every <loc> in the generated sitemap — the canonical URL set, /subscribed already filtered. */
function readSitemapUrls(publishDir) {
  const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const index = readFileSync(join(publishDir, 'sitemap-index.xml'), 'utf8');
  return locs(index).flatMap((sub) =>
    locs(readFileSync(join(publishDir, new URL(sub).pathname.replace(/^\//, '')), 'utf8')),
  );
}

export const onSuccess = async ({ constants, utils }) => {
  const context = process.env.CONTEXT;
  if (context !== 'production') {
    console.log(`[indexnow] skipped — CONTEXT="${context ?? '<unset>'}", submits only from production`);
    return;
  }

  try {
    const publishDir = constants.PUBLISH_DIR;
    const key = readKey(publishDir);
    const urlList = readSitemapUrls(publishDir);
    if (urlList.length === 0) throw new Error('sitemap contained no URLs');

    // Every URL must share one host, and it must be the host this deploy serves —
    // otherwise we would be announcing someone else's domain.
    const hosts = new Set(urlList.map((u) => new URL(u).hostname));
    if (hosts.size !== 1) throw new Error(`sitemap spans multiple hosts: ${[...hosts].join(', ')}`);
    const host = [...hosts][0];
    const deployHost = process.env.URL && new URL(process.env.URL).hostname;
    if (deployHost && deployHost !== host) {
      throw new Error(`sitemap host ${host} does not match the deploy host ${deployHost}`);
    }

    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `https://${host}/${key}.txt`,
        urlList,
      }),
    });

    const summary = `${res.status} ${res.statusText} for ${urlList.length} URLs on ${host}`;
    if (!res.ok) throw new Error(`endpoint returned ${summary}`);
    console.log(`[indexnow] submitted — ${summary}`);
    utils.status.show({ title: 'IndexNow', summary: `Submitted ${urlList.length} URLs — ${summary}` });
  } catch (err) {
    // Never fail a production deploy over an indexing hint — that would cost 15
    // credits and lose the actual content change for the sake of a Bing ping.
    console.warn(`[indexnow] submission failed, deploy unaffected: ${err.message}`);
    utils.status.show({ title: 'IndexNow', summary: `Skipped — ${err.message}` });
  }
};

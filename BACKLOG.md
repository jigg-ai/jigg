# Backlog

Known-open items, parked deliberately rather than forgotten. Nothing here is a bug in
the live site; each is either verification debt, an unconfirmed fact, or a decision
taken and deferred on purpose.

**Review trigger: once builds #2 and #3 exist.** Several items are blocked on having
more than one build to test against, so they're cheapest to clear together at that
point. See `builds/website/test.md` for the per-check detail on build #1.

---

## Verification debt (build #1)

- **Lighthouse performance pass** — `test.md` check #7, **not run**. Unblocked since the
  deploy; needs a run against `https://jigg.ai` and the score recorded honestly.
- **Formal accessibility audit** — check #8, **partial**. The site is *built* for it
  (semantic landmarks, skip link, heading order, `aria-current`/`aria-pressed`,
  decorative SVGs `aria-hidden`, visible focus rings), but there's been no axe or
  Lighthouse a11y run and contrast ratios are unmeasured. Deliberately not claimed as a
  pass.
- **`archived` freshness state never exercised** — check #6 is a partial pass:
  `verified` (green) and `recheck-due` (amber) are both confirmed, but no archived build
  exists yet, so that rendering path is untested. Naturally testable as builds age.

## Unconfirmed facts

- **Claude Code `tool_version`** — currently omitted from the build stamp. The CLI isn't
  on PATH (Claude Desktop install), and an earlier guess turned out to be a feature-flag
  `min_version`, not the real version (logged in `build-notes.md`). Get it from `/status`
  in Claude Code and add it back. **Never guess a version** — it's a published claim.

## Deliberate deferrals

- **"Framework version" tile — keep or drop?** Astro 7.1 currently renders twice on the
  build page: once in the metadata stamp's `Stack` segment, once as the **"Framework
  version"** fact tile. Reviewed and deliberately kept for now; revisit the keep/drop
  call. To be precise about which tile: it's the *framework-version* one. The `$0`
  hosting tile is **not** duplicated — it carries cost, which the stamp doesn't.
- **Email signup redirects rather than submitting on-site** — the Buttondown form is a
  plain POST to their public embed endpoint, so subscribing opens Buttondown's
  confirmation page in a new tab. That's deliberate (no API key in the browser, works
  without JS), but an on-site submission with an inline success state is the known
  improvement.
- **Grab `jig.ai` and redirect to Jigg.AI** — CONTEXT §14 calls for it as brand-name
  hygiene: the namespace is crowded, so the short domain should point here rather than
  sit available for someone else to take. Cheap, one-time, and **blocked on nothing** —
  it's open purely because it hasn't been done, not because it's waiting on anything.
  (Do it before the brand accumulates any reach worth squatting.)
- **Info-page routes are near-duplicates** — `/about`, `/privacy`, and
  `/affiliate-disclosure` each have their own route file with near-identical bodies. A
  single dynamic `[slug].astro` over the `pages` collection would make a new info page a
  one-file add, matching the invariant the `builds` collection already satisfies.
  Deferred to avoid refactoring working, deployed pages.

## Tooling issues (build #2, Botpress)

- **Botpress's Website sync silently refuses valid pages — "0 pages found," no reason
  given. Cause never determined.** `https://jigg.ai/about/` returns `200`, 6.4 kB of real
  HTML, carries no `noindex`, and is declared in `/sitemap-0.xml` — and the sync returns
  nothing for it, with or without a trailing slash, as a whole-domain crawl or as a
  single explicit URL. This left the bot's knowledge base covering only **2 of the site's
  8 public pages** (`jigg.ai`, `jigg.ai/builds/website`) through test Run 1, with nothing
  in the UI warning that coverage was partial. Known/recurring upstream: the Botpress
  community thread "Knowledge Base doesn't find all pages of my website."
  - **Theories tested and killed** (don't re-run these): *partial link discovery* — no,
    an explicit single-page sync failed too; *doesn't follow 301 redirects* — no,
    `/builds/website` also 301s and indexed fine at 20 kB.
  - **Surviving hypothesis, unconfirmed:** the dialog offers to sync "technical docs and
    support articles," and the only pages accepted were the home page and a 20 kB
    long-form article — it may silently filter for article-like content and drop short
    utility pages. Unverifiable from outside the tool.
  - **Workaround in use:** hand-built import files in `builds/botpress/kb/`, imported as
    KB Documents. **This carries a standing re-sync obligation** — they're a frozen copy,
    and stale content answering confidently is the one failure this project can least
    afford. Re-export any file whose page changes; `kb/tools.md` and `kb/builds.md` go
    stale every time a build is added. If Botpress ever accepts the URLs, delete
    `kb/` and go back to a synced source.
  - **Standing check:** after any KB change, confirm the source list shows all 8 pages,
    not a subset. The tool will not tell you.
  - Note: Botpress **Desk** (`desk.botpress.cloud`) is a different surface from Botpress
    **Studio**; the Studio docs' "Specific Web Pages" option was not present in Desk.
    Check which surface you're on before following Botpress documentation.

- **The site had no `robots.txt`** — `https://jigg.ai/robots.txt` returned a 404 (a
  Netlify HTML 404 page, not a plain one), so no crawler had a `Sitemap:` pointer. Found
  while debugging the Botpress crawl. Added `site/public/robots.txt` allowing all and
  declaring the sitemap. Worth noting this is a build-#1 gap that matters beyond Botpress:
  CONTEXT §8 wants the site citation-friendly to answer engines, and they look here first.

## Not built yet

- **The repro pack itself** — the build page *describes* the pack's contents, but no
  downloadable file is assembled or delivered. "Get the pack" currently just subscribes
  via Buttondown. Assemble the pack, or soften the copy, before it's promoted hard.
- **Human verify/edit pass on build #1's post copy** — PROCESS step 5, and the item most
  at risk of permanent deferral. The prose is a first honest draft written by the same
  agent that did the build, with no independent editorial pass. Build #1 is currently the
  *only* build, so it is the thing most visitors read — and the moment build #2 ships,
  attention moves on and this quietly becomes never. **Do it before build #2 publishes**,
  not "someday."

## Blocked on more builds

These are cheap to clear once builds #2/#3 land, and near-impossible before:

- **Affiliate link/no-link distinction is unverified live** — the stamp links only the
  primary tool. Build #1 has no `affiliate_url`, so nothing is currently linked and the
  visual distinction has never actually rendered. Confirm on the first build with an
  affiliate.
- **Tools-index aggregation ("most-recent wins")** — when several builds share a `tool`,
  `src/lib/builds.ts` sums the build count and uses the most-recent build's `tool_*`
  fields. Documented, but never exercised with two builds on one tool.
- **Repro-pack copy consistency** — the post says the model-critique back-and-forth is
  "in the repro pack," but the listed pack contents don't name it. Reconcile when the
  pack is actually assembled.
- **No view of what's due for re-verification** — CONTEXT §9 defines a cadence
  (pricing-sensitive claims ~60–90 days, active production artifacts ~monthly, workflow
  conclusions after major releases), and every build stores `last_verified`, but nothing
  computes or surfaces *which* builds are now due against it. Storing a date isn't the
  same as knowing what's stale. With one build it's trivially tracked by hand; it stops
  being tractable as builds accumulate, and a silently-stale build log is the one
  failure this project can least afford. Needs recheck-due derived from
  `last_verified` + cadence — surfaced somewhere the archive or a maintenance view can
  show it.

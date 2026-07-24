# Backlog

Known-open items, parked deliberately rather than forgotten. Nothing here is a bug in
the live site; each is either verification debt, an unconfirmed fact, or a decision
taken and deferred on purpose.

**Review trigger: once builds #2 and #3 exist.** Several items are blocked on having
more than one build to test against, so they're cheapest to clear together at that
point. See `builds/website/test.md` for the per-check detail on build #1.

---

## Verification debt (build #1)

- **Lighthouse performance pass** — `test.md` check #7. **Now wired, not yet measured:**
  `@netlify/plugin-lighthouse` is configured in `netlify.toml` to run on every deploy
  against `/`, `/builds/`, `/tools/` and `/builds/website/`. Deliberately **no failing
  thresholds** until a baseline exists — a threshold guessed before the first measurement
  either breaks deploys for nothing or passes vacuously. **Next:** read the first real
  scores off a deploy, record them in `test.md`, then set thresholds just under baseline
  so genuine regressions break the build.
- **Formal accessibility audit** — check #8, **partial**. The site is *built* for it
  (semantic landmarks, skip link, heading order, `aria-current`/`aria-pressed`,
  decorative SVGs `aria-hidden`, visible focus rings), but there's been no axe run and
  contrast ratios are unmeasured. The Lighthouse plugin will now produce an a11y *number*
  — **do not let that number upgrade this to a pass.** Lighthouse a11y is an automated
  subset; a real audit still means axe + manual keyboard/contrast checks.
- **"In one sitting" is an undocumented claim** — build #1's `tool_verdict` (shown on
  `/tools`) says "empty folder to a live, four-view content engine in one sitting."
  `git log` supports it: scaffold commits all land at `2026-07-17 11:53`, deploy at
  `13:22`–`13:34`, so roughly **1h45m from scaffold to live**. But no time was ever
  recorded, and STYLE asks for "times, costs, test scores" as concrete proof. Replace the
  adjective with the measured number, or record a real timing next build.
- **`$0` hosting tile is unverified in-repo** — build #1 claims "$0 Hosting (static, free
  tier)" with `pricing_as_of: 2026-07-17`. Plausible and fresh, but no receipt or evidence
  lives in the repo. Re-verify on the CONTEXT §9 pricing cadence (60–90 days → due around
  **mid-to-late Sep 2026**), and note that Netlify free-tier build minutes are finite —
  adding the Lighthouse plugin consumes more of them per deploy.
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

## Build #2 follow-ups (deferred from the test)

- **Four bucket-B partials — the bot won't say *where*.** Run 2 scored 26/30; all four
  non-passes are navigation questions with one shape: it explains *what* a thing is but
  stays vague about its location (describes the archive without naming `/builds`,
  explains the affiliate policy without naming the page), and it called the **Subscribe**
  nav item **"Newsletter."** Cause is ours: `builds/botpress/kb/*.md` bury routes and
  exact labels in prose. Fix: lead each KB file with its route and nav label, re-import,
  re-test just those four. Deferred to get the build drafted — but the mislabelled nav
  item should be fixed before this is promoted hard.
- **D2 residual: the persona answer is in the KB but never retrieved.** Asked "who is the
  person behind Jigg.AI?", the bot answers "I don't have information" even though
  `kb/about.md` states outright that Jigg.AI deliberately does not name an individual. It
  passes the adversarial gate (it invents nothing), but the better, true answer is sitting
  there unused. Worth one retrieval-phrasing attempt.
- **Botpress pricing never captured → `pricing_as_of` unset.** The build ships without a
  cost claim rather than a guessed one, and `tool_summary` deliberately says no "free
  tier available." Capture the actual tier and date it before the tools index implies
  anything about price (CONTEXT §9).
- **Build #2's repro pack not assembled.** `botpress.mdx` deliberately uses a plain
  markdown "Reproduce this" list instead of the `ReproPack` component, because that
  component hard-requires `packDescription`/`packContents` and would promise a download
  that doesn't exist — the exact overclaim already logged against build #1. Swap in
  `ReproPack` once a real pack exists.

## Schema / content drift (found while wiring build #2)

- **`repro_pack` is a schema field nothing reads.** It's defined in
  `site/src/content.config.ts`, set to `true` in `website.mdx`, and consumed nowhere in
  `site/src/`. Either wire it (gate the pack UI on it) or drop it from both the schema and
  `builds/_template/meta.yaml` — a flag that silently does nothing is worse than no flag.
- **`builds/website/meta.yaml` declares `live_url`, which isn't in the schema.** Both
  files carry a comment saying meta.yaml and `content.config.ts` must not drift, and they
  have: `live_url: "https://jigg.ai"` exists in build #1's meta.yaml but in neither the
  zod schema nor `website.mdx`'s frontmatter. Add it to the schema or remove it.
- **`post.md` is mandated by the template but unused in practice.** `builds/_template/`
  ships a `post.md`, and PROCESS §4 says to draft into it — but build #1 never had one
  (the `.mdx` under `site/src/content/builds/` *is* the post) and build #2 followed that
  precedent to avoid two drifting copies of the same prose. Either drop `post.md` from the
  template and reword PROCESS §4, or define what it's for. Flag for the PROCESS retro.

## Not built yet

- ~~**The repro pack itself**~~ — **BUILT 2026-07-22.** Build #1's pack now exists and is
  **public in the repo** at `builds/website/repro/`: `architecture.md`, `schema.md`,
  `reproduce.md`, `deploy.md`. The email gate is gone — a pack you pay for with your
  address contradicts the site's own "no database, no lock-in" claim, and the old form was
  collecting addresses for a pack that did not exist. `repro_pack: false` now, since the
  flag meant "gated download available." **Two promised artifacts were dropped rather than
  faked:** the "curated prompt sequence" and the model-critique transcript — build #1's
  session was never recorded, and reconstructing them would be manufacturing evidence.
  The pack and the build page both say so plainly. Kept here as the record; delete on the
  next sweep.
- **Human verify/edit pass on build #1's post copy** — PROCESS step 5, and the item most
  at risk of permanent deferral. The prose is a first honest draft written by the same
  agent that did the build, with no independent editorial pass. Build #1 is currently the
  *only* build, so it is the thing most visitors read — and the moment build #2 ships,
  attention moves on and this quietly becomes never. **Do it before build #2 publishes**,
  not "someday."

## Blocked on more builds

These are cheap to clear once builds #2/#3 land, and near-impossible before:

- ~~**Affiliate link/no-link distinction is unverified live**~~ — **CLEARED 2026-07-22**
  by build #2, the first build with an `affiliate_url`. Verified in the rendered stamp:
  `Primary tool:` renders Botpress as the only anchor, with
  `rel="sponsored nofollow noopener"`, while `Built with:` renders "Claude Opus 4.8,
  Claude Code" as plain text. The empty `stack` segment is omitted rather than padded, as
  CONTEXT §3 specifies. Kept here as the record; delete on the next backlog sweep.
- **Tools-index aggregation ("most-recent wins")** — when several builds share a `tool`,
  `src/lib/builds.ts` sums the build count and uses the most-recent build's `tool_*`
  fields. Documented, but never exercised with two builds on one tool.
- ~~**Repro-pack copy consistency**~~ — **RESOLVED 2026-07-22.** The post claimed the
  model-critique back-and-forth was "in the repro pack"; it was in neither the delivered
  pack (which didn't exist) nor the planned contents. Root cause: the session was never
  recorded. The claim is retracted on the build page with the reason stated, and PROCESS
  §2 now requires capturing prompts and decisions *during* the build.
- **No view of what's due for re-verification** — CONTEXT §9 defines a cadence
  (pricing-sensitive claims ~60–90 days, active production artifacts ~monthly, workflow
  conclusions after major releases), and every build stores `last_verified`, but nothing
  computes or surfaces *which* builds are now due against it. Storing a date isn't the
  same as knowing what's stale. With one build it's trivially tracked by hand; it stops
  being tractable as builds accumulate, and a silently-stale build log is the one
  failure this project can least afford. Needs recheck-due derived from
  `last_verified` + cadence — surfaced somewhere the archive or a maintenance view can
  show it.

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

- **Astro 7.1 renders twice** on the build page — once in the stamp's `Stack` segment,
  once as the "Framework version" fact tile. Reviewed and kept on purpose for now;
  revisit whether the tile still earns its place.
- **Info-page routes are near-duplicates** — `/about`, `/privacy`, and
  `/affiliate-disclosure` each have their own route file with near-identical bodies. A
  single dynamic `[slug].astro` over the `pages` collection would make a new info page a
  one-file add, matching the invariant the `builds` collection already satisfies.
  Deferred to avoid refactoring working, deployed pages.

## Not built yet

- **The repro pack itself** — the build page *describes* the pack's contents, but no
  downloadable file is assembled or delivered. "Get the pack" currently just subscribes
  via Buttondown. Assemble the pack, or soften the copy, before it's promoted hard.
- **Human verify/edit pass on build #1's post copy** — PROCESS step 5. The prose is a
  first honest draft written by the same agent that did the build; it has not had an
  independent editorial pass.

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

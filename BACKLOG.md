# Backlog

Known-open items, parked deliberately rather than forgotten. Nothing here is a bug in
the live site; each is either verification debt, an unconfirmed fact, or a decision
taken and deferred on purpose.

**Review trigger: once builds #2 and #3 exist.** Several items are blocked on having
more than one build to test against, so they're cheapest to clear together at that
point. See `builds/website/test.md` for the per-check detail on build #1.

---

## Verification debt (build #1)

- **Lighthouse performance pass** — `test.md` check #7. **BASELINE CAPTURED 2026-07-29:**
  Performance 97, Accessibility 97, Best Practices 92, SEO 100 across 4 paths, read off PR
  #1's Deploy Preview at zero credits — which is what unblocked it. Recorded in `test.md`;
  check #7 is now a pass. **Two things still open:** (1) the figures are Netlify's
  *aggregate* for the run, and the plugin thresholds each path separately, so per-path
  numbers are needed before setting any threshold — one path below the aggregate would break
  deploys; (2) Best Practices 92 is the outlier, uninvestigated. Thresholds are otherwise
  safe to set aggressively, since failed deploys consume no credits. Original entry below.
  (Superseded the long-standing "wired but never measured" entry, open since 2026-07-23 —
  it was blocked purely on a deploy being expensive enough to ration. Deleted on this sweep.)
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
  **mid-to-late Sep 2026**). ~~Netlify free-tier build minutes are finite — adding the
  Lighthouse plugin consumes more of them per deploy.~~ **Corrected 2026-07-29:** that was
  a legacy-plan concern. Netlify now bills credits, and there is no separate build-minutes
  meter — production deploys are 15 credits each, Deploy Previews and branch deploys are 0.
  So the plugin is free on every preview; it only ever rides along with a deploy already
  being paid for. The `$0` claim is still unsubstantiated in-repo, but the pressure on it is
  deploy *count*, not build time — and July's cycle did exhaust the 300-credit allowance,
  which is what the new build `ignore` rule and the branch-per-build flow (PROCESS,
  "Shipping") exist to fix. Capture a real receipt at the Sep re-verification.
- **`archived` freshness state never exercised** — check #6 is a partial pass:
  `verified` (green) and `recheck-due` (amber) are both confirmed, but no archived build
  exists yet, so that rendering path is untested. Naturally testable as builds age.

## Deploy model (adopted 2026-07-29) — open items

The model itself is in `PROCESS.md` → **Shipping**. Adopted and exercised end-to-end on the
same day: PR #1 → free preview → merge → one production deploy → a free docs-only push. What
remains below is what's still *unobserved*, not untried.

- **NEW — Netlify reports nothing to GitHub for production deploys.** Deploy Previews post
  commit statuses (that's how PR #1's checks appeared), but the production deploy of
  `98e0db4` produced zero statuses and no GitHub deployment record. So confirming a
  production deploy actually ran requires opening the Netlify dashboard by hand — it can't
  be checked with `gh api .../commits/main/status`. That matters more than it sounds:
  the `ignore` rule's ongoing correctness depends on noticing when a deploy *should* have
  happened and didn't, and a docs-heavy repo means most pushes legitimately skip, so a
  wrongly-skipped content change would blend in. Fix: add a GitHub commit-status deploy
  notification (Netlify → Project configuration → Notifications) so it becomes scriptable.
- ~~**The build `ignore` rule is unverified.**~~ — **VERIFIED BOTH DIRECTIONS 2026-07-29.**
  Not just "it skips" — the rule has to skip *and* build correctly, and both were observed
  on real pushes:
  - **Builds when it should:** merging PR #1 → `Production: main@98e0db4` **Published** in
    30s, 15 credits (confirmed on the meter). Correct — `netlify.toml` was in the diff.
  - **Skips when it should:** the docs-only push `83e995b` (`test.md` + `BACKLOG.md`) →
    `Production: main@83e995b` **Canceled**. Correct — nothing under `:/site/` or
    `:/netlify.toml` changed.
  - **The signal is `Canceled`, not an absent entry.** A skipped build still appears in the
    deploy list, labelled Canceled. Predicted "no new entry" and that was wrong. This is a
    trap: "Canceled" reads as a failure, so an ignored build looks broken at a glance, and
    conversely a *wrongly*-skipped content change looks identical to a correctly-skipped
    docs commit. See the commit-status item above — that's what makes the difference
    checkable instead of eyeballed.
  - **Diagnose from the deploy list, not the credit meter.** The meter showed nothing
    deducted for several minutes after the `98e0db4` deploy, which briefly looked like a
    wrongly-skipped build. It was lag. The 15 credits landed later.
- **"Deploy Previews are 0 credits" — consistent with observation, not yet rigorously
  measured.** 2026-07-29: PR #1's preview built (`d0d6928`, 32s, Lighthouse across 4 paths)
  and the meter moved only when the *production* deploy landed, by exactly 15. So the preview
  demonstrably didn't bill. But that's a single preview build, not the several rebuilds
  needed to rule out rounding or lag. Netlify's docs and a support reply both say 0. Treat as
  strongly supported; close it properly by watching the meter across a build branch with a
  dozen preview rebuilds — which the next real build will produce for free anyway.
- ~~**HUMAN ACTION — disable squash-merge and rebase-merge on the GitHub repo.**~~ **DONE
  2026-07-29**, before the first build PR as required. `allow_squash_merge: false`,
  `allow_rebase_merge: false`, `allow_merge_commit: true`. Verified working on PR #1's merge:
  `98e0db4` has **two parents** and all four branch commits survive individually. Also set
  `merge_commit_title: PR_TITLE` (so `git log --first-parent main` reads as real milestones
  rather than "Merge pull request #1 from…") and `merge_commit_message: BLANK` — the latter
  deliberately, since PR bodies can carry an AI-attribution footer and CLAUDE.md forbids
  those in commits; BLANK makes leaking one into history structurally impossible.
  `delete_branch_on_merge` left `false` on purpose: branch refs are the recovery path.
  Kept as the record; delete on the next sweep.
- **Preview Servers are NOT the free surface — don't reach for that dialog.** Netlify's UI
  offers "Preview Servers" per branch, which looks like the obvious fit and is the one
  preview surface that *is* metered: **10 credits per GB-hour** of compute. One left running
  at 1 GB for ten hours is ~100 credits, a third of the monthly allowance, with no commit to
  show for it. They also run the site in *dev* mode via the Netlify CLI, so they never
  execute `npm run build` — the actual validator here, since it type-checks `.astro` and
  enforces the zod schema. A branch that cannot build would preview green. Deploy Previews
  (PR-triggered, real production build, 0 credits) are the correct surface. Some Netlify
  material advertises Preview Servers as "free to try through April" — expired, and it was
  never the compute line anyway.

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
- **Promote the newsletter-signup saga to its own build — on an email-provider change.**
  The signup debugging story currently lives as a dated **Postscript on build #1's page**
  (`site/src/content/builds/website.mdx`), where it belongs while Buttondown is the provider.
  If/when the email provider changes (or the signup is redesigned), lift that self-contained
  section into its own standalone build-log `.mdx` — it's a natural, SEO-worthy landing page
  for the exact errors people hit (e.g. "subscriber blocked by your firewall", "Buttondown
  Netlify 400"). Keep it **out of `/tools`** (Buttondown isn't an AI tool). Full raw material
  is in `builds/website/build-notes.md`. Trigger: provider swap / signup rebuild, not a date.
- ~~**Revisit Buttondown's spam firewall once there's real subscriber traction**~~ — **TRIGGER
  FIRED 2026-07-27/29; settings re-enabled. Superseded by the hardening work below.** This item
  used to say the firewall was "all off" and should stay off; that is no longer true and the
  advice no longer holds. Bot signups arrived (~12 over four days, then ~25 over three, scraped
  B2B addresses), so the firewall is now: **Auditing Enabled, Attack mode Enabled, Handling
  blocked subscribers Enabled, IP-address auditing Disabled, Embed fingerprinting Disabled,
  Blocked domains: `immenseignite.info`.** Kept here as the record of what changed and why:
  - **Attack mode acts, it does not merely warn.** It auto-enables aggressive + IP-address
    auditing on "a surge of unactivated subscribers" — which is indistinguishable from a
    successful launch. With the server-side proxy in place that means signups can break at the
    worst possible moment. Buttondown emails on trigger, so make sure that address is watched.
  - **"IP auditing is safe now that `ip_address` is forwarded" is UNVERIFIED.** When auditing was
    last on, signups still 400'd with the IP already being forwarded — but Attack mode had
    escalated auditing to Aggressive, so the two are confounded. If it's enabled, re-test real
    signups *after* the change, not before.
  - **Double opt-in is not the spam gate.** It stops list poisoning, not list bombing — the
    confirmation email is the payload, and strangers received them. Controls belong in front of
    the Buttondown call.
  - **The preview test convention needs re-checking now that auditing is back on.** PROCESS
    ("Testing the newsletter proxy on a preview") standardises disposable
    `jigg.ai.biz+test-YYYYMMDD@gmail.com` addresses. That convention was written while the
    firewall was off; plus-addressed gmail is a textbook spam signal, so a test signup may now be
    blocked and stop being representative. Re-verify, don't assume it survived. (Correction to an
    earlier note: the address that is permanently unsubscribable is `sasha.gmi.hodl@gmail.com`,
    via an opt-out suppression — *"previously unsubscribed… you cannot resubscribe them"* — not
    the bare `jigg.ai.biz@gmail.com`, and not the firewall. Different mechanism, different fix.)
- **Confirmation links from a Deploy Preview land on production, not the preview.** Double opt-in
  is only half-testable on a branch deploy: the subscribe POST exercises the preview's function,
  but Buttondown's confirmation email redirects to `https://jigg.ai/subscribed` (the "After
  confirming" URL is a single account-level setting, not per-deploy). Low impact today because
  `/subscribed` is static and rarely changes — but if that page or the redirect target is ever
  what's under test, a preview cannot validate it. Options if it matters: temporarily repoint the
  Buttondown redirect, or verify that leg in production after merge. Trigger: changing
  `/subscribed` or the redirect setting.

- ~~**Botpress's Website sync silently refuses valid pages — cause never determined**~~ —
  **SOLVED 2026-07-23: we had no `robots.txt`.** That's where Botpress looks for the
  sitemap, and it ignores the HTML `<link rel="sitemap">` this site always carried. Adding
  `site/public/robots.txt` with a `Sitemap:` line took the crawl from **2 pages to 11**
  (the sitemap XMLs showing up as indexed entries is the proof it finally fetched them).
  Dominant cause = `[my setup]`. What remains `[tool limit]` is narrower but real: a 2-of-8
  index is a *successful* sync with no warning or page count, and an explicitly-supplied
  valid `200` URL returns only "0 pages found." The build post was corrected — it had
  blamed the tool outright, which STYLE forbids and which is the exact failure this project
  claims to be better at. Kept as the record; delete on the next sweep.

<details><summary>Original entry (kept — the wrong turns are the story)</summary>

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

</details>

- ~~**The site had no `robots.txt`**~~ — **FIXED 2026-07-23**, and it turned out to be the
  root cause of the whole Botpress coverage saga above, not the footnote it looked like
  when first logged. `https://jigg.ai/robots.txt` returned a 404, so no crawler had a
  `Sitemap:` pointer. Added `site/public/robots.txt`. A build-#1 gap that matters well
  beyond Botpress: CONTEXT §8 wants this site citable by answer engines, and robots.txt is
  the first place they look — so every AI crawler was in the same position the bot was.

## ~~⚠️ ACTION NEEDED — the live bot is repeating a retracted claim~~ — RESOLVED 2026-07-23

Re-crawled with full coverage and the duplicate imports removed; re-verified live in a
**fresh conversation** and the bot now answers correctly ("the pack is fully public…
there is no email or download gate").

**Testing lesson worth keeping:** the first re-test returned the stale answer word for
word, and was one step from being reported as "the fix didn't work." It had worked — the
widget had restored the previous conversation (5 messages), so the bot was echoing its own
earlier answer from context. **After changing a bot's knowledge base you must reset the
conversation, or you are testing its memory, not its knowledge.** Clear
`bp-webchat-message-history-default` in localStorage. This is the second time that trap
cost us a wrong reading in one build.

<details><summary>Original entry (kept for the record)</summary>

- **Re-crawl the bot's knowledge base. It is currently misinforming visitors.**
  Verified live on 2026-07-23, minutes after the deploy: asked "what's in the repro pack
  for the website build?", the bot answered with the **retracted eight-item list** —
  "Complete schema and sample dataset", "Full-resolution editable diagrams", "Complete
  curated prompt sequence", "Runnable Astro scaffold", "Setup guide", "Deployment
  checklist", "Reusable templates" — and told the visitor they could get it free. Every
  one of those was deleted from the page in this same deploy; two of them are documented
  as artifacts that never existed.
  - **Cause:** the KB's two *crawled* sources (`jigg.ai`, `jigg.ai/builds/website`) were
    indexed ~18h before the corrections. The 6 hand-imported documents are current; the
    crawled pair is not. `/builds/website` is the stale one that matters.
  - **Fix:** re-crawl both Website sources in Botpress (or re-import `/builds/website`
    as a document if the crawler refuses again, per the coverage issue above). Then
    spot-check by re-asking the same question.
  - **The general lesson, now in PROCESS §5:** publishing corrected copy does not correct
    a bot that cached the old copy. A cache of a retracted claim is a retracted claim,
    still being made — and it's being made conversationally, which reads as more
    authoritative than the page it contradicts.

</details>

## Decisions taken at build #2's publish (2026-07-23) — recorded so they don't get "rediscovered" as bugs

- **The stamp's affiliate link stays above the proof.** STYLE says affiliate links go
  "always after the proof, never before it," and the metadata stamp links the primary tool
  at the top of the page, with no visible disclosure at that position (the
  `rel="sponsored nofollow noopener"` is machine-honest but invisible to a reader). Raised
  at publish and **deliberately accepted** — the stamp's job is identifying which tool is
  under review, and the link/no-link split is what communicates that. The explicit,
  disclosed CTA still sits after the proof in the verdict card. Revisit if the stamp ever
  starts reading as a promotion rather than a citation.
- **Build #2 ships with no cost claim.** Botpress pricing was never captured, so
  `pricing_as_of` is unset and `tool_summary` deliberately avoids "free tier available."
  Chosen over estimating a price — an invented price is this project's founding example of
  a bad AI answer. Capture it on the next Botpress touch.
- ~~**Build #1 keeps the home hero.**~~ **Superseded 2026-07-24:** build #3 (the explainer
  video) published with `featured: true` and is now the home hero; build #1 auto-demoted via
  ordering (CONTEXT §6, `pickFeatured` takes the most-recent featured build). Build #1 keeps
  `featured: true` in its data, so it resumes the hero if #3 is ever unpublished — no manual
  edit of #1 was needed. Kept as the record; delete on the next sweep.

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

## Build #3 (explainer video, HeyGen) — open at scaffold (2026-07-24)

**PUBLISHED 2026-07-24** (`status: verified`, in the repo; live on the next deploy/push).
Human verify pass signed off. Featured as the home hero — build #1 auto-demoted (CONTEXT §6).
`builds/explainer-video/` + `site/src/content/builds/explainer-video.mdx`. Price + YouTube
captured; embed built + verified at desktop/mobile. Still-open items are follow-ups, not gates:

- **STANDING — HeyGen affiliate link (deliberately NOT a publish blocker).** Applied to the
  Rewardful program; approval time unknown, so publish did not wait. When it lands: add the
  real link (+ terms/cookie window from the official dashboard — third-party sources disagree
  badly: 20%/12mo vs 25% vs 35%/3mo, so never state numbers from memory) as `affiliate_url` in
  the `.mdx` frontmatter, and the ToolVerdict CTA turns on automatically. Also confirms the
  stamp then links HeyGen only. (Same shape as build #2's deferred-pricing item.)
- ~~**POST-DEPLOY — Botpress KB re-sync**~~ **DONE 2026-07-24 (PROCESS §5).** Pushed +
  deployed; a *first* re-crawl missed `/builds/explainer-video/`. Our side was verified live
  and correct (page `200`, in `sitemap-0.xml`, sitemap served fresh — `max-age=0,
  must-revalidate`, Netlify, no Cloudflare proxy — `robots.txt` → `sitemap-index.xml`), so
  the miss was the same class of Botpress under-indexing seen in build #2, most likely a
  crawl-before-propagation timing miss. A **second re-crawl picked it up**: the live bot now
  correctly answers "explain how the explainer video was built," which it could only do from
  the newly-crawled page — coverage confirmed by a real answer, not just a source count.
  **Lesson (worth keeping): re-crawl *after* the deploy has propagated, and confirm coverage
  with a content question, not the source list alone.** Kept as the record; delete on the
  next sweep.
- **Repro pack is human-owned in part.** The video clips, both raw renders, the brand kit, the
  **prompts** and the **Claude↔ChatGPT exchange** live in HeyGen and the chats — HeyGen has no
  prompt export. Marked TO ADD / awaiting export in `repro/`, not reconstructed (PROCESS §2).
  `repro_pack` stays false until assembled. The published page does not overpromise them.
- **Operational test figures never logged:** time to render, takes, credits, run date
  (`test.md` Part 2). Left blank, not estimated; capture on the next HeyGen touch.
- **Show-don't-tell enhancement (post-publish):** the two 15s bake-off clips side by side in
  the "How I picked the tool" section (a `{/* … */}` placeholder marks the spot). Prose carries
  the claim for now; the clips are a nice-to-have, not a substantiation gap.
- **Schema touch:** added optional `video_id` to `content.config.ts` + `builds/_template/
  meta.yaml` (kept in sync). `post.md` was dropped for the `.mdx`-is-the-post precedent
  (build #1/#2) — one more data point for the unresolved "post.md mandated but unused" item.
- **Deferred to a future build:** a full **HeyGen vs Synthesia comparison** (same 90s script
  into both, reader judges) — parked until this solo baseline exists.
- **Series-wide v2 fix:** choosing a **frame-filling/landscape avatar** kills the pillarboxing
  across *every* future video build, not just this one — decide it once. Also per-build v2:
  deliberate proof-zooms and a soft caption track (`.srt`). A "what I'd change" retro on the
  page, not a re-render now.

## Recoverable, not lost

- **Build #1's cross-model exchange may be recoverable from the original chats.** The
  audit established only that no prompt/critique artifact exists *in the repo*; the
  ChatGPT and Claude histories likely still exist outside it. If exported, this closes the
  one promise build #1 couldn't keep — properly, with real material.
  - **Export the real chats. Do not reconstruct them.** Exporting is evidence;
    rewriting from memory is fabrication, and the difference is invisible to a reader,
    which is precisely why the line has to hold.
  - Use `builds/_template/repro/exchange-log.md`: label every block `verbatim` /
    `excerpt` / `redacted` / `summary`, and work the redaction checklist first — planning
    chats routinely contain revenue/exit figures and identity details the site
    deliberately never publishes.
  - If it's redacted heavily, **don't call it "the full back-and-forth."** Describe what
    it actually is. The original overclaim was the word "full" as much as the missing file.

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

- ~~**The repro pack itself**~~ — **BUILT 2026-07-23.** Build #1's pack now exists and is
  **public in the repo** at `builds/website/repro/`: `architecture.md`, `schema.md`,
  `reproduce.md`, `deploy.md`. The email gate is gone — a pack you pay for with your
  address contradicts the site's own "no database, no lock-in" claim, and the old form was
  collecting addresses for a pack that did not exist. `repro_pack: false` now, since the
  flag meant "gated download available." **Two promised artifacts were dropped rather than
  faked:** the "curated prompt sequence" and the model-critique transcript — build #1's
  session was never recorded, and reconstructing them would be manufacturing evidence.
  The pack and the build page both say so plainly. Kept here as the record; delete on the
  next sweep.
- ~~**Human verify/edit pass on build #1's post copy**~~ — **DONE 2026-07-23.** Cleared
  before build #2 published, as the item required. Sequence: a claim-by-claim audit of the
  live copy against `test.md`, `meta.yaml`, `repro/` and `git log` surfaced three
  contradictions (an undercounted "one check still pending" when test.md recorded three; a
  repro pack advertised with an email form but never built; a promised critique transcript
  absent from both the delivered and planned pack). All corrected, the pack built for real,
  then **the human reviewed and confirmed `verified` holds.** Build #2's edit pass was
  signed off in the same pass. Kept as the record; delete on the next sweep.

## Blocked on more builds

These are cheap to clear once builds #2/#3 land, and near-impossible before:

- ~~**Affiliate link/no-link distinction is unverified live**~~ — **CLEARED 2026-07-23**
  by build #2, the first build with an `affiliate_url`. Verified in the rendered stamp:
  `Primary tool:` renders Botpress as the only anchor, with
  `rel="sponsored nofollow noopener"`, while `Built with:` renders "Claude Opus 4.8,
  Claude Code" as plain text. The empty `stack` segment is omitted rather than padded, as
  CONTEXT §3 specifies. Kept here as the record; delete on the next backlog sweep.
- **Tools-index aggregation ("most-recent wins")** — when several builds share a `tool`,
  `src/lib/builds.ts` sums the build count and uses the most-recent build's `tool_*`
  fields. Documented, but never exercised with two builds on one tool.
- ~~**Repro-pack copy consistency**~~ — **RESOLVED 2026-07-23.** The post claimed the
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

# BRIEF — build #2: the Botpress support chatbot

Read CONTEXT.md, PROCESS.md, and STYLE.md first. This brief covers build #2: a support
chatbot for Jigg.AI, built with Botpress. It reuses the site foundation from build #1 —
this build adds content plus the site's first real live embed.

## Goal
Build a working support chatbot for Jigg.AI with Botpress, grounded in the site's own
content, and run it live so it genuinely earns the "Runs on this site" badge. This is
the first build with a real affiliate link and the first to use the 30-question test
format, so the honest process and the scored test ARE the deliverable — not a polished
bot. Ship it as one build entry (meta.yaml + post.md + repro pack) that lights up all
four views, with a single deliberate exception: build #1 deferred live third-party
demos — its artifact preview is an inline repo-tree code block, and a `DemoStub` island
seam was scaffolded but never wired into any page — so this build lands the site's first
live third-party embed.

## Primary tool & roles — fill meta.yaml accordingly (CONTEXT §5)
- PRIMARY TOOL: Botpress. The one thing this build reviews — it gets the verdict, the
  beginner-accessibility read, the affiliate link, and the tools-index entry. Botpress
  is a hosted service: omit a pinned version (note the underlying answering model only
  if Botpress surfaces it and it's meaningful).
- PRODUCTION AIs (built_with, display-only): Claude (planning, knowledge-base copy, the
  test set, the draft) and Claude Code (the embed island + commits). Botpress's own LLM
  is part of the primary tool, not a separate built_with.
- STACK (only what THIS build actually required; omit if none): keep it thin. Do not
  inherit the site's permanent infrastructure onto this build.
- category: chatbots. runs_on_site: true. affiliate_url: Botpress's partner/affiliate
  link once obtained (disclose it; if terms differ from expected, log that and keep the
  perishable detail in meta.yaml, not the evergreen narrative).

## What the bot does
- A support assistant for Jigg.AI visitors: what the project is, how the builds and tool
  verdicts work, how affiliate disclosure and the freshness states work, and how to
  subscribe.
- Knowledge base sourced only from the site's own public content — nothing it can't
  ground. When it doesn't know, or a question is out of scope, it says so plainly rather
  than inventing an answer. Consistent with the site's transparency line: it doesn't
  pretend to be human.

## The test — decide it NOW, before building (PROCESS §1)
- 30 representative questions a real visitor would actually ask, written up front. The
  full set is authored in `build-notes.md` / `test.md` BEFORE any bot is built (PROCESS
  §1) — not shaped afterward around what the bot happens to answer.
- Fixed bucket split (sums to 30, so the adversarial gate has a real denominator):
  **10** core site facts · **7** navigation / how-to · **5** freshness & verification
  ("does build X still work?") · **8** adversarial / out-of-scope the bot should decline
  rather than fabricate.
- Scoring rubric fixed now — every question gets exactly one of: correct / partial /
  wrong-or-hallucinated / correctly-declined. A correct decline on an adversarial or
  out-of-scope item is a PASS, not a miss.
- Published `test_score` = (correct + correctly-declined) out of 30. Partials are listed
  in `test.md` but NOT counted as passes; any wrong-or-hallucinated is a fail. This
  keeps the single "X/30" on the build page honest against the four-way rubric.
- Tag each failure [tool limit] vs [my setup]: a knowledge-base gap is [my setup]; a
  thing Botpress structurally can't do is [tool limit].
- Publish bar: **≥ 24/30** correct-or-correctly-declined AND **zero** wrong-or-hallucinated
  across the 8 adversarial items (80% + a hard hallucination gate; move the 24 only
  deliberately). Miss it and you either fix the bot or ship honestly with the caveat
  stated in the summary up top — never quietly grade on a curve.

## The one deliberate site touch
This is the site's first live third-party embed — build #1's `DemoStub` seam was
scaffolded but never wired into a page, and nothing on the site currently loads a vendor
widget. Botpress's `inject.js` self-initializes into its own iframe (it is NOT an Astro
`client:*` hydrated island — the isolation is the vendor iframe, not Astro). Do it as a
reusable, config-driven component, not bespoke per-build code, so the architecture
principle still holds (a future embeddable build adds a config value, not page code):
- Build one small `BotpressWebchat.astro` component: two `is:inline` script tags (the
  vendor `inject.js` + the bot config script) with the two URLs as props, so the embed
  is swappable config, not hardcoded. Keep it thin — just the mount point and the seam.
- Mount it live as the site's support widget (**site-wide** in `BaseLayout`, before
  `</body>` — the real dogfood behind `runs_on_site: true`) and render it inline on this
  build's detail page as the artifact preview.
- Keep the embed styling inside the restrained palette; the bot color must match the
  brand accent `#c4693c` exactly (currently `#C2673F` in the dashboard — close, not
  exact). Don't let a vendor widget clash with the site.

## Artifact preview
Live embedded demo — the top upkeep tier in CONTEXT §3, which this build qualifies for.
The build page lets readers talk to the actual bot. Fallback if the live embed is ever
flaky: a short screen recording, per the same tiers.

## Success criteria (testable)
- The bot answers grounded in the site's own public content and declines cleanly when it
  can't ground an answer — no invented facts.
- Publish bar met: ≥ 24/30 correct-or-correctly-declined AND zero wrong-or-hallucinated
  on the 8 adversarial items (or shipped with the miss stated up top).
- The bot is actually live and reachable on jigg.ai (site-wide widget + inline on the
  build page) before `runs_on_site: true` is set — the badge means "in production, now."
- `/privacy` and `/affiliate-disclosure` updated in the SAME change the widget goes live.
- Build stamp renders the affiliate link on Botpress only; `built_with`/`stack` unlinked.
- The build lights up all four views by adding one `.mdx` entry — the invariant holds.

## In scope for build #2
- A working Botpress support bot grounded in Jigg.AI content.
- The 30-question set + honestly scored results in test.md.
- The reusable webchat island; bot live on the site → runs_on_site: true.
- **Privacy + disclosure updates for the site-wide embed.** The current `/privacy` says
  "the only personal information collected is your email" and "no third-party ad
  tracking" — both need revising once a visitor can type into a Botpress-hosted widget
  (chat is processed by Botpress; the widget may set cookies). These edits ship in the
  SAME change as the widget going live, never ahead of it — don't let `/privacy`
  describe a widget that isn't live yet.
- **Verify the affiliate link/no-link split live.** This is the site's first
  `affiliate_url`, which is exactly the BACKLOG item "affiliate link/no-link distinction
  is unverified live." Confirm on the real page that the stamp links Botpress only (not
  `built_with`/`stack`) and the `/tools` CTA links out; fold this into the check set.
- The build entry: meta.yaml, post.md drafted in house voice (STYLE), and the repro
  pack — public substantiation (representative prompts, sample test questions, the KB
  outline, the basic bot architecture) plus the gated full pack (full KB, the complete
  30-question set with scores, exported bot config).
- Botpress affiliate link obtained and disclosed; CTA placed AFTER the proof ("Build a
  bot like this with Botpress").
- Confirm the bot is live on the site before calling it done.

## Deferred — do NOT build now
- Human / live-agent handoff, ticketing or CRM integrations.
- Multi-language, voice, custom-trained models, or autonomous tool-calling beyond Q&A.
- Conversation analytics beyond a basic sanity check.
- Generalizing the embed island into an "any third-party widget" system — build exactly
  the one island this needs; generalize only when a second embeddable build actually
  demands it.
- Any backend beyond Botpress Cloud.

## Dependencies & gates (don't lose these)
- **HARD GATE / human step.** The Botpress bot itself is built in Botpress by the human
  (PROCESS §2: "the tool itself otherwise"); Claude Code cannot create the Botpress
  account or obtain the affiliate link. The island can't be wired or tested until the
  bot's embed/client ID exists. Sequence: account + bot + affiliate link (human) →
  island + privacy/disclosure edits + post + live test run (Claude Code) once the embed
  ID is in hand.
- **Build #1's human verify/edit pass must land BEFORE build #2 publishes** (BACKLOG,
  "Not built yet"). Publishing #2 moves attention off #1's first-draft copy, so clear
  that pass first — it's the item most at risk of permanent deferral.
- **Reconcile `site/BRIEF.md`.** Its deferred list still says live third-party island
  demos are deferred → "use a screenshot stub." This build un-defers that; update that
  list when the island lands so the two briefs don't contradict (build-#1 retro: don't
  let docs assert stale state).
- **Set `pricing_as_of` in meta.yaml.** The `/tools` verdict will make a free-tier /
  pricing claim, so capture Botpress's current tier and date it (CONTEXT §9 pricing
  cadence). Perishable → meta.yaml, not the evergreen post.

## While building (PROCESS §2)
- Log to builds/botpress/build-notes.md as you go: what you tried, exact errors, dead
  ends, retries. The messy parts are the content — keep them.
- Settle the bot's scope and KB in a planning chat first; then implement once in
  Botpress (and Claude Code for the island) against a clear target (build #1 retro).
- Capture screenshots and a short recording of the working bot.
- Commit often with clear messages; keep everything under builds/botpress/.

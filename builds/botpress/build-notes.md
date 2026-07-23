# Build notes — build #2: the Botpress support chatbot

The running journal. Write as you go. Messy is correct.

## Define

- **Building:** A support chatbot for Jigg.AI, built with Botpress, embedded site-wide
  as the real support widget (so it genuinely earns `runs_on_site: true`) and rendered
  inline on this build's detail page as a live artifact preview. It answers common
  questions about Jigg.AI and the tools it covers, grounded ONLY in the site's own
  public content, and declines cleanly when it can't ground an answer.
- **Why:** Build #2. First build with a real affiliate link (Botpress) and the first to
  use the 30-question test format. The honest process + the scored test are the
  deliverable — not a polished bot. Also the site's first live embedded artifact and
  first hydrated island (see BRIEF "one deliberate site touch").
- **Success criteria:** see BRIEF "Success criteria (testable)". Headline: grounded
  answers + clean declines; publish bar ≥ 24/30 correct-or-correctly-declined AND zero
  hallucinations on the 8 adversarial items; bot actually live before the badge is set;
  `/privacy` + `/affiliate-disclosure` updated in the same change the widget ships.
- **Test/checks (decided before building):** the full 30-question set with fixed bucket
  split and rubric is authored up front in `test.md` (PROCESS §1) — not shaped later
  around what the bot answers.

## Knowledge base outline (grounds the bot — public site content only)

Sourced strictly from what's already public on jigg.ai. Nothing the bot can't ground.

- **About** (`/about`) — what Jigg.AI is; the Jigg.AI-the-builder persona (no named
  individual, human directs / AI does the lifting + narration, always disclosed); why
  transparency; "built with the tools it reviews"; the note on difficulty.
- **Affiliate disclosure** (`/affiliate-disclosure`) — some tool links are affiliate
  links, at no extra cost; tools chosen on merit; verdicts unaffected; links always
  disclosed and placed AFTER the proof; contact hello@jigg.ai.
- **Privacy** (`/privacy`) — only your email, only if you subscribe, only to send build
  logs, never sold; Buttondown; Netlify/Cloudflare technical basics. NOTE: this answer
  changes the moment the widget ships (see staged copy below) — the KB must disclose the
  widget too, or the bot will give a now-false "only your email" answer.
- **Build logs** — build #1 (the site itself): primary tool Claude Code, built with
  Astro; one content collection → four views; the real time sink was Git/GitHub auth,
  not the code; status verified, live at jigg.ai, last verified 2026-07-17.
- **Tools index** (`/tools`) — Claude Code entry: verdict + "Some setup" accessibility;
  no star ratings; leads with what was built.
- **How the site works** — nav is Builds · Tools · About · Subscribe; categories are
  filters, not nav; freshness states (verified / recheck-due / archived) and the dated
  metadata stamp; "Runs on this site" = the build runs live now; subscribe = one email
  per build via Buttondown.
- **Explicitly NOT in the KB** (so the bot declines rather than invents): unreviewed
  tool pricing (incl. Botpress's own tiers until the build publishes), Jigg.AI's revenue
  numbers, any sale-price / exit aspiration, personalized buy/should-I advice, a named
  human, unbuilt future builds, and anything not on the public site.

## Staged copy — apply in the SAME change the widget goes live (NOT before)

Holding these here so `/privacy` never describes a widget that isn't live yet
(integrity model). Drafts, for the human edit pass at publish.

### /privacy — additions
- Amend the "Short version" and "What's collected": after "your email address," add
  "…and anything you choose to type into the support chat widget, which is processed by
  Botpress to answer you."
- New section:
  > ## The support chat widget
  > Jigg.AI runs a support chatbot (built with Botpress — itself the subject of a build
  > log) on the site. If you type a message into it, that message is sent to and
  > processed by Botpress to generate a reply. The bot answers only from Jigg.AI's own
  > public content and says so when it can't. Botpress may set cookies needed to run the
  > widget. Your messages aren't sold and aren't used for advertising — they're used to
  > answer your question and, in aggregate, to see whether the bot is working. You never
  > have to use the widget to read the site.
- Reconcile the existing "the only personal information collected is your email" line so
  it's no longer absolute (the widget is now a second, opt-in data path).

### /affiliate-disclosure — addition
  > ## The bot you can chat with
  > The support chatbot on this site is built with Botpress — the same tool its build log
  > reviews and links to. The widget is both the honest proof and, indirectly, what the
  > affiliate link points to: as always, the proof comes first and the "build your own"
  > link comes after.

## Log
<!-- rough timestamped entries: what I tried, what broke, exact errors, decisions -->
- 2026-07-22 — Placed BRIEF.md, reviewed against repo, resolved review flags with the
  human. Corrected the brief's build-#1 claim (its preview is a repo-tree, not a
  screenshot stub; the `DemoStub` island seam was scaffolded but never wired — no
  `client:*` directive exists anywhere in site/src yet). Filled meta.yaml structural
  facts; authored this Define + the 30-question set in test.md up front.
- 2026-07-22 — Human created the Botpress account + bot and pasted the Deploy Settings
  embed. First pasted the *admin* console URL (desk.botpress.cloud/.../bots/<id>) — the
  wrong link (private, behind login); asked for the Webchat embed instead. Verified the
  bot config script is live and self-inits via `window.botpress.init(...)`.
  Correction to my own earlier framing: Botpress webchat is NOT an Astro `client:*`
  hydrated island — `inject.js` self-initializes into its own iframe. Built it as a thin
  config-driven component (`BotpressWebchat.astro`, two `is:inline` script tags, URLs as
  props) and mounted it site-wide in `BaseLayout` before `</body>`. Applied the staged
  `/privacy` + `/affiliate-disclosure` edits in the SAME change. Verified in local dev
  (localhost:4321): both scripts load, `window.botpress.initialized === true`, launcher
  renders in the corner in the brand terracotta, opens the "Jigg.AI Assistant" panel
  with a working input, zero console errors.

## Embed facts (verified — perishable, live in build-notes not the post)
- Deploy Settings embed:
  - `https://cdn.botpress.cloud/desk/webchat/v4.1/inject.js`
  - `https://files.bpcontent.cloud/2026/07/23/02/20260723024954-CBA90JJW.js`
- botId `a1474286-79fc-4ae6-b4f7-3fcf44071141` · clientId `6307e7bf-c2fd-44c3-89d8-c1e7e2587b91`
- botName "Jigg.AI Assistant" · color `#C2673F` (site brand accent is `#c4693c` — near
  match, not exact; nudge the dashboard color to `#c4693c` for an exact palette match).
- Admin console (private, do NOT embed): desk.botpress.cloud/dk_oe41b1dl/bots/<botId>.

- 2026-07-22 — Ran the full 30-question test (Run 1) against the live widget.
  **test_score 15/30**, but **zero hallucinations** and the **adversarial gate passed
  8/8** (incl. a prompt-injection refusal). The low score is almost entirely ONE
  `[my setup]` cause: the KB crawl indexed only home + About + the build-log page, and
  missed `/privacy`, `/affiliate-disclosure`, `/subscribe`, `/tools`, and the `/builds`
  archive — so every answer living on those pages missed, each as an honest "couldn't
  find that" decline, never a fabrication. No `[tool limit]` surfaced. Full table +
  tags in `test.md`. Setup gotcha along the way: after a page reload the widget opens an
  empty conversation, and clicks fired during the open-animation are lost; also Enter
  doesn't submit — must click the send button.

## Done
- Botpress account + bot created; KB crawl + system instructions loaded; affiliate link
  obtained (in meta.yaml); embed obtained; `BotpressWebchat.astro` built + mounted
  site-wide + verified in local dev; `/privacy` + `/affiliate-disclosure` updated in the
  same change; **Run 1 of the 30-question test complete (15/30, 0 hallucinations).**

## Still open (next steps)
- **Fix the crawl coverage + re-run (Run 2)** — the main one. Ensure the `jigg.ai`
  Website KB source indexes ALL public pages, re-crawl, re-run all 30. Most misses
  should flip to correct. This is a human step in Botpress + a test re-run I can drive.
- **Two real content gaps (C2, C4):** the freshness-state meanings + re-verification
  cadence aren't written on the public site. Add a short note there (fix on the site,
  per `bot-config.md`), not in a bot-only KB entry.
- **Capture Botpress's current pricing tier** → `pricing_as_of` in meta.yaml.
- Optional dashboard nudge: set the bot color to `#c4693c` (exact brand accent).
- After Run 2 clears the bar: verdict fields (tool_verdict/accessibility/tool_summary)
  → draft post.md → human verify pass (+ build #1's, per BACKLOG) → the `.mdx` build
  entry → push (widget + post live together).

## Artifacts
<!-- links to screenshots / recordings -->
-

## Dead ends
<!-- things that didn't work — keep these, they're the honest bit -->
-

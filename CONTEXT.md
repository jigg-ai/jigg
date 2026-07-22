# Jigg.AI — Context

The canonical "what and why." Companion files: PROCESS.md (how), STYLE.md (voice),
and a per-build BRIEF.md in each build's folder (the site build's is site/BRIEF.md).
This file is the source of truth and is mirrored into Claude Project knowledge.

## 1. What it is
Jigg.AI is a build-in-public project that shows what's actually achievable with
today's AI tools by building real things with them — a chatbot, a website, a piece
of marketing — rather than listing features secondhand. Each entry pairs an AI tool
worth your time with a unique thing genuinely built using it, tested and documented.
The site earns affiliate revenue from the tools it features. The site itself is
built with the tools it reviews.

One-liner: Anyone can build real things with AI — one tool, one honest case study at
a time — and the site earns its keep from the tools it uses to prove it.

## 2. Mission, and why transparency is the strategy
- Most people underestimate how capable and accessible AI tools already are. The goal
  is to show that anyone can learn them, and that it's easier than they think.
- Transparency is the differentiator AND the moat. First-hand, documented, tested
  proof is exactly the content that survives the AI-search era — an engine can't
  fabricate "it invented pricing on attempt one, here's the fix." Openness and
  defensibility are the same property here.
- Show the real, sometimes messy process — mistakes, dead ends, retries. That's what
  makes "anyone can do this" credible.
- The "you can make money too" message is deferred: saturated and low-trust to lead
  with. Prove it later with real numbers (Phase 2).

## 3. The core unit: the build log
Every build log pairs a tool with a real artifact built with it. Page anatomy:
- Summary / citation hook up top — self-contained: what it is, worth it or not, the
  one caveat. (Written so an AI answer engine can cite it.)
- Metadata stamp — a single compact line in fixed order: primary tool (the only
  linked item, to its affiliate URL, carrying its version) · production AIs
  (built_with) · stack · "pricing as of <date>" · "last verified <date>". Segments
  with no value are omitted, not padded. Perishable facts live here, separate from the
  evergreen narrative; an archived/superseded state applies when no longer current.
- Artifact preview — tiered by upkeep: live embedded demo (Astro island) for a few
  flagships > short screen recording > annotated before/after screenshots.
- The honest process — what broke, each failure tagged [tool limit] vs [my setup].
- The test — a standardized check, scored honestly (e.g. 30 representative questions
  for a bot; adapt the check per build type).
- Show, don't tell — where a build makes a structural claim, render the artifact
  (repo tree, diagram) inline rather than asserting it in prose.
- Reproduce this — public substantiation on the page (representative prompts, sample
  test questions, basic architecture) + a gated downloadable pack (full files,
  diagram, prompts, full test set).
- The tool — plain verdict + disclosed affiliate CTA, placed AFTER the proof
  ("Build a bot like this with <tool>").

## 4. Voice & production model
- Voice: first person as Jigg.AI-the-builder — a consistent brand persona, not a
  named individual. The About page is transparent that a human directs the tools and
  the AI does the heavy lifting and narration.
- No human face or voice: video/narration use AI voice/avatar, always disclosed
  (platforms require it; disclosed AI content monetizes comparably). Being AI-made is
  literally the product's message.
- This also removes key-person risk, which matters for a future sale.

## 5. Content model & taxonomy
- Primary organizing dimension: functional category (chatbots, video, websites,
  automation, writing, research, design, agents, ...). Categories live as FILTERS and
  hub pages, not as a growing list in the top nav.
- "Runs on this site" trust badge: the dogfooding signal — this build is actually in
  production on Jigg.AI right now. Stronger than a neutral "Build" label.
- Three tool roles per build, treated differently:
  - PRIMARY TOOL — the one thing the build reviews. Gets the verdict, accessibility
    read, affiliate link, and the tools-index entry. Exactly one per build (two only
    for a deliberate comparison post). Test for identifying it: which tool is this
    build reviewing and linking?
  - PRODUCTION AIs (built_with) — the AIs used to make the build (e.g. Claude,
    ChatGPT, Claude Code). Display-only: shown on the build page, never a tools-index
    entry, never an affiliate link. They recur across builds, which is exactly why
    they never enter the index.
  - STACK — supporting tools used to ship this build but not reviewed. Display-only,
    same rules. List only what THIS build required; do not inherit the site's
    permanent infrastructure onto every build. If a build needed none, omit it.
- Only the primary tool feeds the tools index. This keeps the index a list of things
  genuinely tested, not a directory of everything touched.
- Versioning: version where it's pinnable and meaningful (models, frameworks —
  "Claude Opus 4.8", "Astro 7.1"); omit versions for un-versioned hosted services
  (GitHub, Netlify, Cloudflare). Versions are perishable — they live in the dated
  build log, never in evergreen copy, and a major release is what trips a build into
  recheck-due.
- Tool selection gate: revenue potential (commission structure + real buyer intent),
  accessibility (can a beginner get a real result quickly?), and being worth your time
  — never chosen merely for being "popular." Occasionally cover overlooked / early
  tools as a low-cost hedge on being early.

## 6. The site: four views
- Home — a featured build leading with a visible artifact preview, then recent builds
  (auto-populated: caps at 4, excludes whichever build is featured, so promoting a new
  build to featured auto-demotes the prior one with no manual editing), email capture
  with a concrete benefit.
- Build log detail — the full report (section 3), opening with the metadata stamp.
- Archive — timeline of all builds; categories as filter chips; dates, tool versions,
  and freshness state visible.
- Tools index — no star ratings; leads with what was actually built with each tool,
  a plain verdict, an accessibility read, and "Runs on this site" where true.

Design direction: editorial, not a directory grid. Clean, fast, semantic HTML
(citation-friendly). Serif display headline, restrained palette (one warm brand
accent; green for status; nothing else). Playful/approachable, not generic SaaS.

## 7. Navigation
Top nav is simple: Builds · Tools · About · Subscribe. Categories are filters/hubs
underneath, not header items.

## 8. Distribution & owned audience
- Brand-first, owned-audience, citation-friendly (not pure SEO-rank-and-collect).
- Email list from day one. Benefit-led: "one honest build in your inbox — prompts,
  costs, and files included," one email per new build.
- Repurpose each build into multiple outputs (site log, video, social, newsletter).
- Structure content for citation (summaries near the top, clean headers). Reddit/forum
  presence matters, since answer engines lean on it.

## 9. Content-integrity systems
- Separate perishable facts (version, pricing) from the evergreen narrative and method
  so they update in one place (meta.yaml fields).
- Re-verification cadence (formalize over time): pricing-sensitive claims ~60–90 days;
  active production artifacts ~monthly; workflow conclusions after major releases;
  fundamentally changed/discontinued builds → archived as history.
- Freshness states: verified · recheck-due · archived. Never imply an old build still
  works just because the page exists.
- Reproducibility pack does triple duty: lead magnet, compounding transferable asset,
  and seed of a future paid/recurring layer. Keep enough evidence public to
  substantiate and feed citations; gate the complete files.

## 10. Tech foundation
- Astro. Content collections = the data model (a build = one markdown entry; all four
  views read from the same collection). Islands = sandboxed interactive demos that
  can't break the core.
- Deploy on Netlify (free tier; commercial use allowed). DNS on Cloudflare, set
  DNS-only (grey cloud) for the Netlify records. Git-based, so everything is
  versioned, documented, and transferable.
- Later, not now: a git-based CMS (Keystatic/TinaCMS) for friendlier publishing.
  Email backend is Buttondown (redirect-to-form for now; on-site API submission is a
  known revisit). Markdown files are fine to start.

## 11. Repo & process
- ONE repo for the site and all builds (github.com/jigg-ai/jigg). Each build is an
  isolated folder under builds/<slug>/. The repo is the source of truth; chats are
  transient.
- PROCESS.md is the repeatable pipeline; it improves itself via a retro step after
  each build.

## 12. Sequencing & first builds
- Phase 1 (now): capability — build logs, case studies. Affiliate links live from day
  one, but revenue isn't the story.
- Phase 2 (later): transparent revenue reporting once there are real, defensible
  numbers.
- Build #1 (shipped): the site itself, built with Claude Code + Astro — logged as it
  was built, published as the first build log, live at jigg.ai.
- Build #2 (next, not started): a support chatbot with Botpress (embeddable; runs on
  the site) — the first build with a real affiliate link and the 30-question test
  format.

## 13. Business & exit context
- Long-term: build, make profitable, potentially sell as a well-documented asset.
  Aspirational target ~$20M (far-off).
- Reaching real scale needs an owned/recurring layer beyond pure affiliate commission;
  affiliate income proves the audience exists. Avoid single-affiliate concentration
  and key-person risk; keep everything documented and transferable — this repo IS that
  documentation.

## 14. Brand name note
Keep Jigg.AI; do not rename. The surrounding namespace is crowded (a "Jigg" fishing
app; several "Jiggy/Jiggle" AI tools), so: always present as "Jigg.AI," never bare
"Jigg"; grab jig.ai and redirect if available; invest early in a distinctive wordmark
so the brand out-signals the noise.

## 15. Still open
- Whether/how to niche the audience vs. staying general "AI builder".
- Lead publishing channel emphasis over time (site/SEO vs video vs newsletter).
- Final category set and which get hub pages first (start with only categories that
  have real posts — avoid thin pages).

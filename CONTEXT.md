# Jigg.AI — Context

The canonical "what and why." Companion files: PROCESS.md (how), STYLE.md (voice),
and a per-build BRIEF.md in each build's folder (the site build's is site/BRIEF.md).
This file is the source of truth and is mirrored into Claude Project knowledge.

> **Revised October 2026 for the studio direction.** Jigg.AI began as an affiliate-funded
> build-in-public publication; the July version of this file is in git history. It is
> now an engineering studio with a public build journal. What changed commercially, and
> the tradeoff that was accepted, is in §13. Section numbers are unchanged so existing
> references still land on the right topic; Services is new, as §16.

## 1. What it is
Jigg.AI is an AI-accelerated software engineering studio with a public build journal.
- **The studio is the business.** It builds, modernizes and improves software for
  organizations, under contract.
- **The build journal is the evidence.** Real things built with AI tools, tested and
  documented in public, failures included. It is Jigg.AI's own work.
- **Client work is private by default.** Anything shared from it — a detail, an
  anonymized write-up, a named case study — is the client's choice, made in writing
  (PROCESS.md → Client work). The site says so wherever it talks about building in
  public.
- **AI does much of the execution** — coding, prototyping, testing, documentation. An
  experienced engineer provides the direction, architecture, review and accountability.

Category: AI-Accelerated Software Engineering.
Homepage headline: "Experienced engineering judgment. AI-accelerated execution."

One-liner: Jigg.AI combines experienced software engineering judgment with AI-accelerated
execution to build, modernize and improve real software. Its public build journal shows
how that work is done.

## 2. Why transparency is still the strategy
- The journal is what makes the studio credible: a buyer can see the method, the tests
  and the mistakes before making contact. First-hand, documented, tested proof is also
  the content that survives the AI-search era — an engine can't fabricate "it invented
  pricing on attempt one, here's the fix."
- Show the real, sometimes messy process — mistakes, dead ends, retries. Unchanged.
- "Anyone can build real things with AI" stays the journal's message. It does not lead
  the homepage: placed next to "work with us," it argues against itself. The homepage
  leads with the studio; the journal keeps its approachable voice.
- Human-directed is not the same as no human involvement. Choosing goals, reviewing
  results, making decisions and authorizing deployment are human work, even when AI
  writes every line. Say that AI did the implementation; never claim the process is
  autonomous.

## 3. The journal's core unit: the build log
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
- The studio link — one standard, unobtrusive line at the end of every build page,
  rendered by a single shared component. Never inside the narrative: a build log is
  not a sales page.

## 4. Voice, identity & production model
- **The journal's narrator is Jigg.AI-the-builder**, first person ("I"), a brand persona.
  Unchanged from July.
- **Studio pages** (home, Services, About, Contact) use "Jigg.AI" as the subject. Never a
  "we" that implies a team that doesn't exist. Clients work directly with the founder, and
  the pages say so.
- **The founder is named lightly**, where accountability matters: Sasha Matison,
  Founder & Principal Engineer.

  | Where | Founder shown? |
  |---|---|
  | Homepage hero | No — lead with Jigg.AI |
  | Homepage credibility line | Yes — one line, linked to About |
  | Services | Yes — who is accountable for an engagement |
  | About | Yes — the human–AI operating model |
  | Contact | Yes — a real person behind business inquiries |
  | Builds | No — the journal keeps its persona |

- **Credential line — draft; every fact must match LinkedIn before it is published:**
  "Jigg.AI is founded and led by Sasha Matison, a software engineer with 25+ years of
  experience, including engineering management at Amazon." Homepage short form:
  "Founder-led engineering. 25+ years of software development experience." One number
  format everywhere ("25+"). LinkedIn holds the full history: no résumé, no biography,
  no photo required.
- **Journal disclosure:** "Builds and write-ups are produced using AI tools, under human
  direction. Results, limitations and verification status are documented for each
  project."
- **AI presenters and voices** may still appear in the journal, always disclosed. Buyers
  should meet engineering evidence before promotional video, so the studio homepage
  doesn't lead with one (whether build #3's video stays featured anywhere is open, §15).
- The July version said "not a named individual" and "no human face or voice," partly
  to remove key-person risk for a sale. A services business is founder-led by nature;
  that rationale is retired (§13).

## 5. Journal content model & taxonomy
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
- **Time and cost are recorded per build from build #5 on**, so speed and cost claims rest
  on numbers:
  - `human_time` and `agent_time` — minutes, each with a basis: measured, estimated or
    unavailable. Time spent directing and reviewing is a different measure from how long
    the AI ran, and the AI-acceleration claim lives in the gap between them. Build #4's
    "2h21m" is a session length, which is neither.
  - Paid plans used — tool, plan, price, billing period — listed, not summed into one
    figure, because a subscription isn't a per-build cost.
  - Verification dates reuse `last_verified`.
  - The four existing builds are not backfilled. What wasn't recorded stays unrecorded.
- Tool selection gate: accessibility (can a beginner get a real result quickly?), being
  worth your time, and revenue potential (commission structure + real buyer intent) —
  never chosen merely for being "popular." Occasionally cover overlooked / early tools as
  a low-cost hedge on being early.

## 6. The site
- **Home** — the studio homepage. Two clear paths: "Discuss a project" and "Explore the
  builds." One founder credibility line, linked to About. Selected builds as evidence.
- **Services** — the three pillars with their evidence (§16), how client code and data are
  handled (PROCESS.md → Client work), and who the client works with.
- **Builds** — the journal archive: timeline, category filter chips, dates, tool versions
  and freshness state visible. URLs unchanged.
- **Build detail** — the full report (§3), unchanged apart from the studio link at the end.
- **Tools index** — secondary: linked from Builds, still indexed. No star ratings; leads
  with what was actually built with each tool, a plain verdict, an accessibility read, and
  "Runs on this site" where true.
- **About** — the human-directed, AI-executed model, and the founder.
- **Contact** — the primary commercial conversion, so it is a launch requirement, not a
  nice-to-have: reliable delivery, the same bot defenses as the signup form (Turnstile,
  honeypot, origin check), clear error handling, and source attribution. **The studio
  homepage does not go live until Contact has been tested end to end on a Deploy Preview.**
- **Work** — client case studies. Not shown until there is a publishable project with
  written client permission. Then it becomes a collection (one file per case study) and
  joins the navigation.
- **Subscribe, Privacy, Affiliate disclosure** — secondary pages.

Architecture: the `builds` collection still drives every journal view, and adding a build
is still one markdown file — never a page-code change. Studio content (services, later
case studies) lives in its own collections. Existing URLs stay as they are.

Design direction: editorial, not a directory grid, and not a generic agency template.
Clean, fast, semantic HTML (citation-friendly). Serif display headline, restrained
palette (one warm brand accent; green for status; nothing else). Approachable, not
generic SaaS.

## 7. Navigation
Top nav: Services · Builds · About · Contact. Contact is the primary call to action.
Subscribe stays reachable from Builds and the footer; Tools from Builds. Categories are
filters/hubs under Builds, not header items. Work joins the nav once it has content.

## 8. Audience, distribution & measurement
- Two audiences: organizations and technical decision-makers (the studio); builders and
  the AI-curious (the journal).
- Commercially, the studio's channels come first: LinkedIn, the professional network,
  referrals, targeted outreach and qualified inbound. The journal's channels (X, YouTube,
  vendor communities, selective forums, the newsletter) keep feeding discovery.
- Structure content for citation (summaries near the top, clean headers). Repurpose each
  build into multiple outputs (site log, video, social, newsletter).
- **Principal metric: qualified project inquiries, and how many become engagements.**
  Newsletter subscribers and affiliate clicks are secondary. A few hundred relevant
  visitors who produce two credible inquiries beat tens of thousands who produce none.
- Contact telemetry: self-reported "how did you find Jigg.AI", plus referrer/UTM where
  present. Count successful submissions and server-side rejections and failures. Never
  count rejected spam as leads; never send inquiry contents to analytics.

## 9. Content-integrity systems
- Separate perishable facts (version, pricing) from the evergreen narrative and method
  so they update in one place (meta.yaml fields).
- Re-verification cadence (formalize over time): pricing-sensitive claims ~60–90 days;
  active production artifacts ~monthly; workflow conclusions after major releases;
  fundamentally changed/discontinued builds → archived as history.
- Freshness states: verified · recheck-due · archived. Never imply an old build still
  works just because the page exists.
- Claims about the founder and the services follow the same rule as build claims:
  verified before they are published, and rechecked when they change.
- Reproducibility pack does triple duty: lead magnet, compounding transferable asset,
  and seed of a future paid/recurring layer. Keep enough evidence public to
  substantiate and feed citations; gate the complete files.

## 10. Tech foundation
- Astro. Content collections = the data model (a build = one markdown entry; all journal
  views read from the same collection). Islands = sandboxed interactive demos that
  can't break the core.
- Deploy on Netlify (free tier; commercial use allowed). DNS on Cloudflare, set
  DNS-only (grey cloud) for the Netlify records. Git-based, so everything is
  versioned, documented, and transferable.
- Newsletter signups go through a Netlify Function proxy to Buttondown's API, hardened in
  build #4 (honeypot, validation, origin check, server-verified Turnstile). The Contact
  form follows the same pattern; how inquiries are delivered is open (§15).
- Later, not now: a git-based CMS (Keystatic/TinaCMS) for friendlier publishing.
  Markdown files are fine to start.

## 11. Repo & process
- ONE repo for the site and all builds (github.com/jigg-ai/jigg). Each build is an
  isolated folder under builds/<slug>/. The repo is the source of truth; chats are
  transient.
- PROCESS.md is the repeatable pipeline; it improves itself via a retro step after
  each build.
- Client work follows PROCESS.md → Client work. Client code, data and deliverables never
  enter this public repo or a build log without written authorization.

## 12. Sequencing
- Shipped: build #1 (the site itself, Claude Code + Astro), #2 (a Botpress support bot),
  #3 (a HeyGen explainer video), #4 (hardening the email signup endpoint).
- Now: the studio site — these docs, then home, Services, About and Contact, on one
  branch with one merge. It is a site revision, recorded in `builds/website/build-notes.md`
  rather than as a build log of its own: not every site change earns one.
- Next build (#5): AI-assisted modernization of an aging, permissively licensed
  open-source application with an identifiable maintenance problem. Characterization tests
  before any change, a bounded migration, compatibility verification, documented failures,
  measured human and agent time, real costs. An upstream pull request only after checking
  the project's contribution policy and asking its maintainers. It demonstrates process
  and capability, not enterprise-scale outcomes — and says so.

## 13. Business model, and the tradeoff taken
- **Revenue: client engineering contracts.** Affiliate links remain in the journal only,
  always disclosed, placed after the proof.
- **Procurement policy:** client engagements never generate referral compensation from
  vendors. Tools and vendors are recommended to clients on merit, and no commission is
  earned on those recommendations, disclosed or not.
- **The tradeoff, accepted on purpose.** The July thesis was a scalable, largely faceless
  media/affiliate asset with low key-person risk, potentially sellable (a far-off ~$20M
  aspiration). A founder-led studio can earn much sooner and uses existing professional
  experience directly, but it is founder-dependent and harder to scale or sell. Reaching
  that kind of scale would now take something beyond founder-delivered services: a
  broader engineering operation, recurring products, or proprietary software.
- Keep everything documented and transferable anyway — this repo is that documentation.

## 14. Brand name note
Keep Jigg.AI; do not rename. The surrounding namespace is crowded (a "Jigg" fishing
app; several "Jiggy/Jiggle" AI tools), so: always present as "Jigg.AI," never bare
"Jigg"; grab jig.ai and redirect if available; invest early in a distinctive wordmark
so the brand out-signals the noise.

## 15. Still open
- How Contact inquiries are delivered (Netlify Forms, or a function that sends email).
- Whether build #3's AI-presenter video stays featured anywhere on the studio site.
- The exact credential line, pending LinkedIn verification.
- Which open-source project build #5 modernizes.
- Final category set and which get hub pages first (start with only categories that
  have real posts — avoid thin pages).
## 16. Services
Three pillars. Each one names its evidence, and the evidence is attributed honestly: an
internal build demonstrates a method; it is not a completed client engagement.

| Service | Scope | Evidence today |
|---|---|---|
| Rapid Prototyping & Product Delivery | Prototypes, MVPs, proofs of concept, custom applications, websites | Builds #1–#4 (internal); founder experience |
| Legacy Modernization & Systems Engineering | Upgrades, refactoring, integrations, architecture improvements | Founder experience only (pending verification); build #5 is planned to add public evidence |
| AI Integration & Automation | AI assistants, workflow automation, operational improvements | Builds #2 and #4 (internal) |

- The builds show how Jigg.AI works. They don't set the limits of what it can deliver.
- Until real modernization examples exist, that pillar's copy says only what the
  founder's verified experience supports: no client logos, no outcome claims.
- Website design sits under product delivery, not as a pillar of its own.


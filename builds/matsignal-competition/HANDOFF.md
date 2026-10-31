# MatSignal — PRD-003 Builder Execution Handoff

**Version:** 1.0 · 2026-10-30  
**Product:** MatSignal — free BJJ athlete search and competition tracking  
**Founder authorization:** Build-out approved; this document authorizes **development on the draft review branch**, not production rollout, unreviewed collection of third-party athlete data, paid services, marketing, or launch  
**Public repository:** [jigg-ai/jigg](https://github.com/jigg-ai/jigg)  
**Existing working branch:** `build/matsignal-competition`  
**Existing draft PR:** [#9](https://github.com/jigg-ai/jigg/pull/9)  
**Builder assignment/acknowledgment:** [issue #8](https://github.com/jigg-ai/jigg/issues/8)  
**Route:** `site/src/pages/matsignal/index.astro` (currently isolated, noindex, with fictional demo records)  
**Historical naming conflict:** separate PRD-002 Gym Trial Conversion Experiment is **not** MatSignal; its former `builds/matsignal/` folder and [issue #7](https://github.com/jigg-ai/jigg/issues/7) remain on hold  
**Naming rights:** “MatSignal” is a working product name, **not trademark-cleared**; an independent martial-arts publication has used “The Mat Signal.” No trademark/domain purchase or public name claim approved.

## 0. Read and acknowledge before work

Read [CLAUDE.md](../../CLAUDE.md), [CONTEXT.md](../../CONTEXT.md), [PROCESS.md](../../PROCESS.md), [STYLE.md](../../STYLE.md), [BACKLOG.md](../../BACKLOG.md), this document, [BRIEF.md](BRIEF.md), [test.md](test.md), [build-notes.md](build-notes.md), and the actual current Astro/Netlify code. These public files are the **entire builder execution contract**; do not fetch Jigg.AI's private research repository, internal bot threads, business deliberations, or unrelated client materials.

**Identity and security gate — HARD STOP:** The previous Claude Code builder reported that its Mac's SSH key and GitHub CLI credentials had account-wide access, not `jigg-ai/jigg`-only access. This is still an **unresolved, independently enforceable boundary**, not just a box to tick. Before any new builder code write or remote Git operation, document that the builder runtime **can access only the intended public repo**, or state BLOCKED and seek a founder decision. Merely preferring a fine-grained token while a broad token/key remains active in the same runtime is not an enforceable boundary. Do not use, print or request broad tokens. Do not access private repos to “test” the boundary. If a safe isolated runtime is not ready, **STOP BEFORE CODING** and leave a clear issue #8 blocker/return packet.

The user has already reviewed and liked the interactive demo. Preserve its straightforward, dark/green, search-first visual direction unless a concrete accessibility, mobile or experience problem warrants a proposal. Do not restart with a static landing page or an unrelated gym CRM.

## 1. User's actual problem and mandatory experience

The founder trains/coaches BJJ and wants one place to answer:
- **Discovery:** Who is registered to compete, and where? Search individual athlete names; optional affiliation and event filters.
- **Group:** Which specific athletes do I care about? Pick arbitrary people and maintain my own group. A broad competition affiliation is NOT a reliable identifier of an individual physical gym; user groups are not official rosters.
- **Before event:** Which selected athletes are appearing at upcoming competitions, across supported, independently operated registration systems?
- **Competition day:** In what chronological order are my tracked athletes fighting, on which mat, and with what latest *source-supported* estimated time and status?
- **After event:** What official results exist for them?

**Initial utility is FREE.** Anonymous athlete search must work without signup or payment. Creating or saving a tracking group requires at most a **free account**. No paid tiers, locked search, artificial group quotas, trials or lead capture. Optional paid additions are out of scope.

**Design principle:** Show immediate cached search matches, indicate gaps and uncertainty. Where permitted, a targeted follow-up discovery job may update a known source identity. A missing indexed athlete does NOT mean that person never competed, and an empty schedule does NOT prove no upcoming entry.

## 2. Existing demo: treat as the starting implementation, not product proof

On the draft PR branch there is an interactive prototype:
- Four clearly fictional athlete fixtures; name and affiliation filtering.
- Add/remove tracked athletes; browser-local sample group persistence.
- Chronological illustrative match queue with unknown time states.
- Isolated styling/route, explicit “demo, not live” disclosure and noindex.

The Netlify deploy preview initially returned SUCCESS for app commit `0475e1e62bf766b6b0ace408fd82915d563058a4`, with preview route `https://deploy-preview-9--candid-gingersnap-6c4b87.netlify.app/matsignal/`; however **no independent browser interaction, mobile or accessibility test has been recorded**. Later doc-only pushes may cancel/replace previews. Recheck the current PR head, deploy and route before claiming PASS.

**Immediate workstream A — complete and harden the existing interactive preview:**
1. Fetch latest `build/matsignal-competition` and draft PR #9; verify scope and branch; do not create a duplicate PR or overwrite main.
2. Test search/affiliation filters, track/untrack, clear, local persistence and duplicate handling; keyboard, narrow mobile, screen reader/semantics, noindex, zero actual source calls.
3. Fix bugs and record measured results/screenshots in public `build-notes.md` and `test.md`. Keep the design the founder liked.
4. Make code separable into UI, source-independent domain model and sample fixtures. No API responses invented and no demo-only records presented as real.

## 3. Architecture foundation — athlete-first, demand-driven index

The founder prefers **athlete discovery over bulk crawling**. Initial coverage may focus on a selected affiliation, known athletes or an organizer-specific athlete page. Do **not** pre-index every athlete who has ever competed.

Implement a small, testable foundation that can grow without replacing the app:

| Concept | Minimal shape / invariant |
| --- | --- |
| `Athlete` | Local index identifier, display name/aliases and optional affiliation hints; **not** proof of verified identity |
| `SourceIdentity` | `source`, source-specific athlete identifier/profile URL, observed display name, confidence and last-checked timestamp; multiple identities may remain unmerged |
| `Event` | Source, event key/URL, date, venue where published, current coverage/freshness |
| `Registration` | Source identity + event/division + observed status/date/source; withdrawal and unknown states supported |
| `Match` | Event and competitor reference; mat/order/opponent/ETA/status **only when source-published**, with observed timestamp and provenance |
| `TrackingGroup` | User-selected set of source identities; the membership is user-generated, **not** a source-certified affiliation/academy |
| `SourceAdapter` | Provider-specific discovery capability and error states; never fabricate generic APIs for all organizers |

Source-specific IDs may make a **targeted profile lookup** efficient on some platforms. They do not imply a public global lookup or identical IDs on competing platforms. Support profile-centric *and* event-centric discovery adapters as needed.

Use a simple seed directory and bounded caching strategy: search the local index first; when a user requests an unknown athlete, **only** attempt supported/permitted targeted discovery, queue work rather than blocking the UX, deduplicate requests, cap rate and show source/time. A saved group may receive priority refreshes at relevant events. Avoid user-triggered unlimited third-party fetches, unbounded background polling, or accepting arbitrary URLs for server fetches (SSRF risk).

## 4. Public-information-first — no unapproved automated collection

Founder intent: initial external source information should come **only from records competition organizers already make publicly visible**, without paid feeds or mandatory platform partnerships. Partnerships are a possible later optimization, not the product's first milestone.

**Public visibility is not blanket authorization for automated retrieval/storage/redistribution.** For each potential platform, make a compact evidence-backed adapter feasibility sheet:
1. Which athlete/event/bracket/result pages are public to an anonymous ordinary visitor? Which identifiers and fields exist, and which are only inferred?
2. Is profile-centric or event-centric discovery supported? Is there an authoritative public API, public document/export, or another technically and legally supportable route? Absence of an API is not proof that all public-web approaches fail.
3. What do current platform terms/access controls actually say about automated retrieval, caching, reuse, rate limits and attribution? Cite exact official URLs and observations. Mark ambiguity `UNKNOWN`, not `PERMITTED`.
4. What freshness/identity/privacy risks exist? How will the UI distinguish estimated vs scheduled vs live vs unknown information?
5. What is the expected operating burden: requests per new identity, per group per day, per event-day refresh, error behavior and throttling?

**Gate A (builder may do now):** Research those terms/docs and build mocked adapter interfaces and tests; no actual competitor data ingestion.  
**Gate B (allowed only after explicit founder approval of a documented, specific lawful/low-risk source path):** Implement **one** real targeted source adapter, starting from a tiny sample; no large crawls. If a source's terms prohibit automated use without permission, mark BLOCKED and propose a source-link-only fallback or a different source; don't attempt to bypass or obfuscate automation.  
**Gate C (later):** Improve refresh cadence, source coverage and partner relationships after functional evidence and founder approval.

Do **not** bypass login, captcha, bot controls or platform rate restrictions; do not acquire/use privileged accounts, ingest bulk youth profiles or expose minors' live location/schedule data. Public user pages can contain personal information; minimize retention and avoid contact details, DOB or anything unrelated to events.

For a legitimate source where public lookup is feasible, prefer exact source IDs/profile links and event-specific records over string matching alone. Keep candidate identities distinct unless a reliable independent link exists or the user confirms a source association; support correction.

## 5. Accounts and saved group persistence

**Product requirement:** Free account only at “Save my group,” never a precondition of athlete search. The interface may allow temporary guest selections prior to login and must preserve them through authentication once implemented.

**Authorized now:** Define the minimal data model, permissions/threat model and a concrete cost-conscious backend/auth design for review, with a realistic deployment and migration path. Implement local preview interactions and tests.

**Before collecting real user account data or standing up an authentication database:** present a founder review gate covering hosting and recurring cost, provider/credential scope, email verification, rate limiting, ownership isolation, passwordless flow preference, deletion/export and a minimal privacy notice. No fabricated successful signup, no unapproved paid service, and no personal emails in Git/fixtures. If using a new managed auth or DB service requires an account, contract, secrets or billing, request founder authorization.

Default saved groups private to their creator. Read-only group sharing is a possible later feature, not a reason to create a public roster indexed by search engines now. No minors' group exposure.

## 6. UX / visual expectations

Preserve the demo's appealing visual direction and simple hierarchy:
1. Search box is the first meaningful control. Optional affiliation/event filters.
2. Search result explicitly distinguishes source identity and candidate ambiguity; one-tap track.
3. Group selection visible immediately; eventually a clear free save/sign-in moment.
4. Upcoming list and competition-day queue are the return-use screens.
5. Source links, estimated-time labels and refresh freshness are visible and accessible. Unknown remains unknown.

Mobile-first: high-contrast readable schedule in mat-side conditions; touch targets, keyboard, screen readers and sensible reduced-motion behavior. No fake source badges, real-world competitor screenshots, fabricated live statuses or misleading “now fighting” labels.

Only one modest “A Jigg.AI experiment” attribution, not a studio navigation takeover. No external signup/waitlist marketing surface is required.

## 7. Engineering process, scope and handoff receipts

Work only in public `jigg-ai/jigg` with enforced repo-only credentials. Keep existing `build/matsignal-competition` branch and [draft PR #9](https://github.com/jigg-ai/jigg/pull/9) unless a verified reason to propose a follow-up branch; use no private materials. The public docs are the full context.

- Start with **one acknowledgment comment** on [issue #8](https://github.com/jigg-ai/jigg/issues/8): builder identity and runtime, exact handoff file/commit reviewed, scoped Git identity/credential facts, branch/PR, accepted scope, and any BLOCKED gate. ACK is required; the existence of this file/comment from coordinator is **not** a builder acknowledgment.
- Maintain `build-notes.md` with real commands, timings, prompt/design changes, failures and limits. Do not invent previous runs.
- Run `npm --prefix site run build`, UI functionality tests and code quality checks appropriate to actual work. Check Netlify Deploy Preview separately; noindex and no production surface exposure.
- Review actual URL routes, Astro's static build vs Netlify Functions, CSP/security headers and use stable dependency versions. No unreviewed hosting/domain/secret change.
- Keep the source-assessment findings in public builder-appropriate documents only; do not surface private coordinator assessments or bot history.
- Document component boundaries and a narrowly scoped future integration proposal with concrete permissions and operating cost.
- Return a PR packet: exact head SHA, changes, test outcomes (PASS/FAIL/BLOCKED), screenshots/mobile evidence, verified preview URL, source-access feasibility sheet (including unknowns), account-persistence proposal, measured time/cost (or unavailable), residual risks and **specific next founder approvals**.
- **Do not merge to main or publish to a custom production hostname without explicit founder authorization.** No arbitrary crawler, full-site indexing, paid tooling, soliciting athlete data, contact outreach or marketing campaign.

## 8. Acceptance contract

| ID | Required proof | Pass criterion |
| --- | --- | --- |
| H-01 | Builder ACK/security | Real builder identified and **repo-only access actually enforced**, otherwise BLOCKED before new coding |
| H-02 | Existing demo QA | Actual interactions tested; dark search-first UX retained and honest demo status |
| H-03 | Domain model | Local and source IDs distinct; ambiguity and provenance explicit; no unsafe automatic merges |
| H-04 | Adapter foundation | Mocked provider contracts, per-source capability matrix and unit tests; no real automated collection absent Gate B |
| H-05 | Free journey | Anonymous discovery, temporary selection, non-paywalled saved-group proposal; no fake working signup |
| H-06 | Competition-day correctness | Time types, mats and unknown states modeled; sorting and stale data tests pass |
| H-07 | Safety | No actual minor data, no unapproved third-party requests, bounded retry/cache strategy, no secrets |
| H-08 | Build and preview | Verified build + actual responsive browser demo and noindex, correct target PR |
| H-09 | Return packet | Evidence, SHA, errors, source rights uncertainties, costs, and explicit founder approval gates |

**Outcome requested:** a tested, visually coherent product foundation and a credible path to the first supported live data source. Not a rebranded landing page, not a promise that the full public search index is already live, and not a speculative autonomous scraper.

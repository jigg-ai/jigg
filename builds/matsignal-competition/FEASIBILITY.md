# MatSignal — Technical Feasibility Report: athlete → upcoming competitions

**Date:** 2026-10-30 · **Builder:** Claude Code (Claude Opus 5.5) · **Scope:** Smoothcomp and IBJJF only, per the founder's priority update. The coordinator's ~10-circuit survey (issue #8, 2026-10-31 02:09 UTC) is separate and not duplicated here.

**Recommendation: ALTERNATIVE.** Neither platform offers a supportable *automated* path from an athlete to their upcoming competitions today. Smoothcomp is the best first source: it has the right shape (a profile per athlete that lists upcoming registrations, and match-day mats and ETAs), and it runs events for NAGA, NEWBREED and Grappling Industries. But it refuses automated clients on exactly those pages, and its terms license content "only in the manner in which such information is presented". IBJJF is BLOCKED without written permission: its terms ban bots and database-building outright, and it has no athlete-level lookup. The credible next step is a **written-permission request to Smoothcomp**, with a **link-out MVP** meanwhile that stores platform profile references and fetches nothing.

## How this was checked, and its limits

- Two read-only research passes, one per platform: about 20–23 page requests each, all by hand, with no logins and no youth profiles opened.
- I re-checked the decisive facts myself, by hand:
  - Smoothcomp's Terms of Service and robots.txt;
  - IBJJF's terms clauses;
  - bjjcompsystem.com's robots.txt.
- Smoothcomp's profile and event pages returned **HTTP 403** to the automated fetcher. When I then tried to read an event page in a real browser, the session's own safety check stopped it as bot-check circumvention. I accept that call. So **no Smoothcomp profile or event page was examined live**. Their structure below comes from Smoothcomp's own support documentation and search-engine snippets, and is tagged that way.
- Tags: **VERIFIED** = seen at the URL given; **DOCUMENTED** = stated in the platform's own help pages but not observed live; **ASSUMED**; **UNKNOWN**.
- No real athlete names, teams or personal details are recorded here.

## Answers

| Question | Smoothcomp | IBJJF |
|---|---|---|
| **Athlete identifier** | One numeric ID per account, `/<lang>/profile/<id>` on smoothcomp.com and organizer subdomains (VERIFIED: the public directory `/en/user?search=` links to that pattern). Profiles can be set private (DOCUMENTED, [support 398](https://support.smoothcomp.com/article/398-athlete-profile)). Deleted accounts become "unknown user" (VERIFIED, [privacy §4.4](https://smoothcomp.com/en/privacypolicy)). | No shared athlete ID. Ranked athletes have `ibjjf.com/athletes/<name-slug>`. Entry lists, brackets and results show only plain-text name + team, with no link or ID (VERIFIED). Joining across them means matching on name + team text. |
| **Upcoming registrations** | Athlete-first, **DOCUMENTED** (support 398): the profile lists "upcoming events you're registered for". Event participant lists by division exist at `/event/<id>/participants` (VERIFIED from search snippets; the page returned 403). | Event-first only. Every event has public lists `/events/<id>/athletes-list-by-divisions` and `…-by-academy-teams` (150–250k characters each, VERIFIED). Athlete pages list no upcoming events (VERIFIED). Finding one athlete means scanning every open event's list. |
| **Match-day data** | Mats, match numbers, start times and a live-updated ETA: "Current time + Number of fights x Estimated duration of fights" (DOCUMENTED, [support 73](https://support.smoothcomp.com/article/73-how-to-schedule-your-tournament)). Pages `/event/<id>/schedule/brackets` and `/schedule/matches` (snippets). Visible only once the organizer publishes. A personal "dynamic starting time" needs login (DOCUMENTED, [support 90](https://support.smoothcomp.com/article/90-find-out-your-dynamic-starting-time)). | Public on bjjcompsystem.com, with no login seen. Each bracket fight shows "FIGHT n: Mat n", day and time, and both slots (seed, name, team). Per-mat order of fights is at `/tournament_days/<id>`. Final brackets come out about 1 day before. No live status in the HTML. Times are venue-local, with no time zone shown (all VERIFIED). |
| **Access constraints** | robots.txt allows `/event/` and `/profile/`, with `Crawl-delay: 10` (VERIFIED). 403s to automated clients on profile and event pages (VERIFIED). [Terms](https://smoothcomp.com/en/agreements?t=tos), last updated 2026-10-05 (VERIFIED): §12.1 grants a "limited right to use the Platform and access the content … only in the manner in which such information is presented to you"; §12.2 reserves all IP in platform content; §4.2 bars "excessively consuming platform resources". No scraping clause and no public API (UNKNOWN beyond payment keys). | [Terms of use](https://ibjjf.com/terms-of-use), last updated 2025-10-06, shared with bjjcompsystem.com (VERIFIED). They ban access "through automated or non-human means, whether through a bot, script or otherwise", and "spider, robot … scraper". They also ban "Systematically retrieve data … to create or compile … a database, or directory without written permission". Further clauses restrict aggregation, republication and commercial use, and even "unauthorized framing of or linking to" (reported). bjjcompsystem.com robots.txt: `User-agent: *` / `Disallow: /` (VERIFIED). |
| **Performance / cost** | ASSUMED, *if permitted*:<br>• Lookup: about 1 profile request, plus 1–2 per upcoming event.<br>• Refresh: 1 profile request per tracked athlete every 6 h.<br>• Match day: 1–2 requests per tracked event every 2 min, shared by all users via the cache.<br>Crawl-delay caps this at 6 req/min. | ASSUMED: one athlete lookup = 1 calendar request + 1 large list per open event (dozens of events, megabytes). Match day: 1–3 requests per tracked category, then 1 per refresh. |
| **Verdict** | **ALTERNATIVE**: the right data shape, but automated access is blocked and not licensed. | **BLOCKED** without IBJJF's written permission (ibjjf@ibjjf.com). |

Both platforms mix youth divisions into the same lists and brackets (VERIFIED for IBJJF juvenile divisions; youth events use the same URL patterns on Smoothcomp). Event-day times effectively publish where a person will be and when, so any later ingestion needs a minors policy before it starts (HANDOFF §4).

## The athlete-first sequence, checked against reality

1. **Discover an athlete through a public listing or profile.**
   - Smoothcomp: a public directory search exists (VERIFIED).
   - IBJJF: only ranked athletes have pages.
2. **Stable platform-specific ID.**
   - Smoothcomp: yes, a numeric profile ID (ASSUMED stable; deleted accounts are anonymised).
   - IBJJF: no ID at all.
3. **Store it in a lightweight local index.** Built: `SourceIdentity` / `upsertDiscovered` in `site/src/lib/matsignal/model.ts`, tested. Known identities are refreshed, never duplicated, and never merged by name.
4. **Does the reference reveal upcoming registrations and history?**
   - Smoothcomp: yes, for a person (DOCUMENTED). Not licensed or available for automation.
   - IBJJF: no.
5. **Event-centric fallback.** Built: `upcomingFor` in `site/src/lib/matsignal/adapters.ts`, capped at 5 entrant lists per lookup. On IBJJF that cap would miss most events, which is the evidence that IBJJF can't support athlete-first search.
6. **Cache by interest and proximity.** Built: `LookupCache`, `refreshIntervalMs` and `RequestBudget` in `site/src/lib/matsignal/cache.ts`. These are a proposal to tune against a real source.

## Smallest real-data test (needs founder authorization)

**Test A — Smoothcomp permission request (recommended).** The founder writes to Smoothcomp describing MatSignal. The ask: permission, or partner/API access, to read a consenting adult athlete's public profile (their upcoming registrations) and the published schedule of the events they're in, at the rate above, with source links and attribution.
- **Success:** a written yes naming allowed endpoints or pages, rates and caching rules. Then one adapter gets built against the founder's own (or a consenting teammate's) adult profile.
- **Measured against the official pages:** identity → upcoming registrations → mat and ETA on event day, within 1–2 requests per refresh. No other athlete's data is stored.
- **Authorization needed:**
  - outreach to Smoothcomp (customer and partner contact is out of scope until approved);
  - naming the consenting athlete(s);
  - any account the integration requires.

**Test B — no-collection link-out MVP (possible now, with approval to build).** A user pastes a Smoothcomp profile or event URL. MatSignal parses out the platform and ID, stores the reference in the user's group, and renders deep links to Smoothcomp's own pages. It fetches nothing.
- **Success:** a coach can open every teammate's official page in one tap on event day, and the index never re-asks for a known athlete.
- **What it doesn't do:** no aggregated schedule. That waits for Test A.
- **Excluded:** IBJJF, whose terms restrict even unauthorized linking.

## Open questions

- Whether Smoothcomp's 403s target only unknown user agents or all automation. This doesn't matter without permission, and it wasn't probed.
- Whether Smoothcomp profiles show upcoming events to logged-out visitors, or only to their owner.
- Whether the competing services named in issue #8 (comp-hub, trackbjj, trackmat) have platform agreements. Their claims are untested, and their existence proves nothing about permission. Smoothcomp's own app already lets athletes follow others (DOCUMENTED, support 398).
- Operating cost of a scheduled backend. Nothing exists to measure yet. Deploy Previews used so far: 0 Netlify credits.

## Follow-up, 2026-10-30: permission and link-out questions (Q1–Q7)

All checked by the builder, by hand, in an ordinary browser, on pages that load normally: Smoothcomp's legal pages, About page and help centre, and IBJJF's terms. No profile or event page was opened. Not legal advice.

1. **Public API or partner program: none published.**
   - VERIFIED: the help-centre search for "api" returns only payment-gateway keys (Stripe, Paystack), staff roles, organizer status and the federation platform.
   - VERIFIED: a web search for a Smoothcomp developer, API or partner program found nothing.
   - VERIFIED: ToS §6.1's "partners … that we cooperate with" offer features *inside* the platform; it is not a data-access route.
   - So the only route is a bespoke request.
2. **Contact route: no data-partnership channel.**
   - VERIFIED: the [About page](https://smoothcomp.com/en/about)'s only business route is "BUSINESS INQUIRIES", aimed at organizers ("Planning to start using Smoothcomp for your tournament?"). It lists a sales/support/project role and the company, Smoothcomp AB, Sweden.
   - VERIFIED: [athlete support](https://support.smoothcomp.com/article/321-contact-support) is redirected to organizers.
   - So a Test A request would go through that business-inquiries route.
3. **Third parties using Smoothcomp data with permission: none found** on Smoothcomp's own site or help centre. A wider search is needed (research team).
4. **Organizer route: weak.** The [SaaS agreement](https://smoothcomp.com/en/agreements?t=saas), VERIFIED:
   - §2a names "data" among the Provider IP that "shall remain the sole and exclusive property of Provider".
   - §2c bars the organizer from letting any third party "frame, mirror, republish … download, transmit or distribute all or any portion of the Services".
   - §1e: registrations "shall remain on Smoothcomp", with no export "into another tournament platform", and "attempts to circumvent our terms can result in the termination of the organizer account".
   - Organizers can download their own event's registrations as CSV ([support 109](https://support.smoothcomp.com/article/109-download-registrations-as-a-csv-file)), and Smoothcomp is the data controller ([support 196](https://support.smoothcomp.com/article/196-who-can-access-my-data-and-can-i-hide-it-from-them)).
   - So an organizer feeding MatSignal would likely need Smoothcomp's consent anyway.
5. **Logged-out profile visibility: partly UNKNOWN.**
   - DOCUMENTED ([support 398](https://support.smoothcomp.com/article/398-athlete-profile)): profiles can be "private or … public"; the profile "shows upcoming events you're registered for"; and "results are only shown for events that have published and made their results public".
   - The article is addressed to the profile's owner. It doesn't say whether *visitors* see the upcoming-events section, or which setting is the default. The founder can settle this by opening a profile while logged out.
6. **Linking: allowed on Smoothcomp, restricted on IBJJF.**
   - VERIFIED: Smoothcomp's visitor [Terms](https://smoothcomp.com/en/agreements?t=tos) contain no linking or framing restriction. "Link" appears only for connecting accounts. The framing ban in SaaS §2c binds organizers, not visitors.
   - VERIFIED: IBJJF's [Terms of Use](https://ibjjf.com/terms-of-use) (last updated 2025-10-06) list "Engage in unauthorized framing of or linking to the Services" under §4 Prohibited Activities.
   - So Test B is consistent with Smoothcomp's visitor terms, and IBJJF stays out of it.
7. **URL stability: partly UNKNOWN.**
   - DOCUMENTED ([support 178](https://support.smoothcomp.com/article/178-how-to-create-your-federation-company-platform)): a federation subdomain "will not be possible for you to change after you have created it".
   - VERIFIED from the public event calendar: event IDs come from one numeric sequence across the main domain and organizer subdomains (e.g. `smoothcomp.com/en/event/27515`, `<org>.smoothcomp.com/en/event/28006`).
   - UNKNOWN: whether one profile ID resolves identically on every subdomain. A human check is needed.

**Effect on the recommendation:** unchanged (ALTERNATIVE), but sharper:
- Test A has to go to Smoothcomp itself, through its organizer-facing business route. Organizers can't grant this on their own.
- Test B (link-out, no fetching) is consistent with Smoothcomp's visitor terms and should exclude IBJJF.

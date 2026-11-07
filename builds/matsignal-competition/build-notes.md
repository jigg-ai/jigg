# MatSignal: build notes

Build #5. MatSignal is a free tool for jiu-jitsu teams: keep a squad, see who from it is entered
at upcoming competitions, share one competition's link in the team chat. Live at
[matsignal.jigg.ai](https://matsignal.jigg.ai) since the evening of 2026-11-06 (Pacific).

The product's code is in its own private repository. These notes are the public record: what was
built, in what order, what broke, and how it was checked. Times are Pacific (PDT until Nov 1, PST
after), taken from commit timestamps. Commit hashes are not linked, because the repository is
private.

> `builds/matsignal/` in this repository is a different, held project (PRD-002). This build lives
> here, in `builds/matsignal-competition/`.

## Before: the demo inside this site (2026-10-30)

MatSignal started as a demo page inside this site, with four made-up athletes and no real data,
on a branch that was never merged. The demo page and its early code were superseded when the
product moved out of this site, and they stay off `main` on purpose.

## Day 1: out of the site (2026-10-30, 21:12–23:34)

- Started the product as its own codebase, outside this site, once the work needed real data, a
  database and scheduled jobs.
- First pieces: name matching, the adults-only rule, and a polite automated reader for published
  entry lists (honest identity, robots.txt, stops when a site refuses). That reader exists but is
  not switched on for any competition MatSignal covers.
- A search-first page, first on made-up data.
- Importing a competition's participant list from a copy made by hand, and a bookmark that sends
  the page a person has open to the admin page.

## Day 2: a backend and the safety rules (2026-10-31)

- **08:59–09:11.** The backend became a Cloudflare Worker with a D1 database for
  `matsignal.jigg.ai`, with no per-request logs on Cloudflare. Search, privacy and admin pages.
- **22:07–23:48.** The rules that make it safe to put real names in:
  - A host that refuses a request stops being contacted until a person resumes it.
  - Removal requests are kept outside the database (a Durable Object) and replayed before serving
    or reading, so a database restore can't bring a removed person back. A restore drill checks it.
  - A search guard for anonymous public search: per-visitor and global budgets, sweep detection, a
    kill switch, alerts. A synthetic sweep test with the first results.
  - Every result says where it came from and how fresh it is, with a removal link.
  - Adult and Master divisions only, by an explicit label rule. Open-ended weight classes ("220.1 +
    Lbs") are not ages; registration extras ("1 Adult Spectator Ticket") are not teams.
  - The runbook: kill switches, objections, refusals, sweeps, removals, restores, data inventory.
  - The squad: kept in the browser, with a cookie backup the server sets (Safari's automatic
    clean-up otherwise loses it), up to 50 athletes, by competition or by athlete. One "It's them /
    Not them" answer per athlete per competition.
- **[my setup]** 23:44: "squad checks are charged only for names not yet checked today". This change
  also stopped counting squad checks against the global budget, which broke the guard. See Day 4.

## Day 3: adding competitions by link (2026-11-01, 06:29)

- A Smoothcomp event is added by its link; each new copy reports who's new and who's gone.
- The admin list shows which competitions are due for a new copy, with Open and Paste on each row.
- The runbook gained the routine for copying a list by hand.

## Day 4: the product, and going live (2026-11-06, 10:15–18:55)

- **Layout.** Search across the top and foldable; the squad below as an agenda, the next
  competition open; Watch moved onto the competition's own line; "new since your last visit" marks.
- **Imports, after two independent review passes** (separate agents that hadn't seen the
  builder's reasoning)**:**
  - **[my setup]** A saved web page imported as zero athletes, and nothing stopped an empty copy
    replacing a good list. Saved pages are now refused (copied text only), a copy with no athletes
    is refused, and a copy with no adults has to be confirmed before it replaces a list that had
    some. An import replays removals first and re-reads them after saving.
  - **[my setup]** A missing blank line in a pasted list could attach a minor's name to the next
    adult's entry. Now a name must sit within two lines of its birth year, and each division heading
    resets the reader. Caught before launch; no real list had been imported on the live site.
- **[my setup] The guard, fixed.** The sweep test, run again, confirmed every name in a 2,000-person
  made-up roster: the Day 2 change had taken squad checks out of the global budget. The fix put them
  back, and a second flaw (one visitor could use up the global budget for everyone) was fixed by
  checking the visitor's budget first and not counting refused requests globally.
- **Shared squads.** First a whole-squad link, then redesigned the same day around how teams
  actually talk: one short link per competition (`/c/<code>`), showing only the squad's athletes
  entered there, read-only and refreshing itself, with a WhatsApp preview that names who's entered.
  Turn off a single link; Stop sharing; Copy squad to another browser. A shared copy is deleted
  after 90 days without the owner using it.
- **[tool limit]** In the Claude desktop app's built-in browser, `confirm()` returns false without
  showing anything and clipboard writes are refused, so "Turn off link" silently did nothing when
  the founder tried it there. Replaced with questions asked inside the page (on the public page and
  in admin), and a fallback for copying.
- **Lighter notices.** The shared page dropped its banners; the Beta notice can be closed.
- **Tests.** An end-to-end smoke test against the local Worker on made-up data; the restore drill
  extended to stopped shares and turned-off links.
  - **[my setup]** The smoke test's "no birth years in results" check matched timestamps. And a
    removal test removed its own made-up person for good (removals are permanent by design), so the
    next run was missing a name. Fresh made-up names each run.
- **Infrastructure (the founder did the account work; the agent wrote the steps and the config):**
  - A separate Jigg.AI Cloudflare account. jigg.ai's DNS moved into it; the jigg.ai site stays on
    Netlify, its records DNS-only.
  - Workers Paid (US$5 a month), a production D1 database, and Cloudflare Access on `/admin` with a
    one-time code by email. The Worker verifies the Access login itself as well.
  - A deploy key limited to this account and zone, kept in the Mac's keychain, never printed.
  - **[my setup]** Writing the production database id into the config pointed local runs at an
    empty database ("no such table: kv"), and the Access values locked local admin (403). Fixed with
    a separate local database id and local-only overrides.
  - **[tool limit]** The first deploy failed: "You need a workers.dev subdomain" (code 10063), even
    with workers.dev switched off for this Worker. Opening Workers & Pages in the dashboard once
    created one; the next deploy succeeded.
  - After the deploy: the live database binding confirmed through the API, every `/admin` path
    redirecting to the login, security headers, no request logs, and the minute job running.
- **Live.** The founder imported the first competition by hand on the live site: Grappling X
  Washington State Jiu Jitsu Championships (Auburn, WA, Nov 14), 64 adult entries.
- **After launch, the same evening:**
  - An icon (browser tab, home screen, and the shared link's preview picture).
  - **[my setup]** An outside review of the interface: "Live, checked 6:14 PM" promised more than the
    page knows, since entries change only when a list is copied again. Now "Page updated 6:14 PM",
    next to the copy's age. Shared pages explain MatSignal in one line to people who've never seen
    it; turning off a link says it stops working for everyone; the Share button stays "Shared", with
    a chevron.
  - "It's them" is now asked only when just the name matches; name-and-team matches count without
    asking. The privacy page says so.
  - **[my setup]** While taking this build log's screenshots: on a phone, the shared page's header
    didn't wrap, so the whole page scrolled sideways. Fixed with two lines of CSS and deployed the
    same evening, after the unit tests, type check and smoke test passed again.

## Time

Agent time is measured from the timestamps in the Claude Code session's own log: for each stretch
of work, the time between consecutive entries in which the agent was working (a reply or a tool
result), leaving out any gap over five minutes as idle.

| Day | Agent time |
|---|---|
| 2026-10-30 (includes the in-site demo and research) | 87 min |
| 2026-10-31 | 89 min |
| 2026-11-01 | 6 min |
| 2026-11-06 | 110 min |
| **Total** | **292 min (4 h 52 min)** |

Two things this number is not:

- Not the founder's time. Directing, reviewing and the Cloudflare account work weren't tracked, so
  there is no human-time figure (`basis: unavailable`).
- Not everything the agents ran. A long test or a separate review agent shows up in the main log as
  one long wait, and waits over five minutes are left out.

## Numbers

- 102 commits in the product repository, Oct 30 – Nov 6, the phone fix included.
- About 6,700 lines of TypeScript, JavaScript, HTML, CSS and SQL, tests included.
- Paid: Cloudflare Workers Paid, US$5 a month. MatSignal's deploys cost nothing on Netlify.

## Retro

- The time gap is the claim this journal exists to make, and this build can only state half of it.
  A timer from the first message, for the human side too, starting with the next build.
- The adversarial checks earned their keep: the sweep test caught the worst bug of the build.
  Running the full suite back to back also showed a gap: the restore drill crashes instead of
  failing cleanly when the server refuses a request. Noted in test.md.
- Screenshots for the log found a live bug. Taking them at phone width should be a step of its
  own, before launch rather than after.

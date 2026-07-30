# Build notes — hardening the subscribe endpoint

Messy on purpose. The dead ends and the wrong turns are the point (PROCESS step 2);
they are not cleaned up in retrospect.

## Define

**What:** the site's newsletter signup posts to a Netlify Function that calls Buttondown's
API. The endpoint was publicly POST-able with no abuse protection, and bots found it.

**Why now:** **33 scraped third-party addresses in 64.9 hours** — 2026-07-27T12:15:56Z to
2026-07-30T05:07:38Z, at 6 / 13 / 13 / 1 per UTC day, so still at full rate when the fix
landed. The cost was not noise. Unactivated entries mean **confirmation emails were sent to
real strangers**, and the undeliverable ones are **hard bounces accruing against a newsletter
with, at the time, no confirmed subscribers at all**. Left alone, the plausible endpoint is
Buttondown suspending the account — losing the asset before it exists.

All figures here are derived from `repro/spam-wave-masked.csv` and recomputable from it.
**Corrected 2026-07-30:** this section previously said "~12 over four days, then ~25 over
three." Those numbers came from recollection, not from the export, and two of them do not
survive contact with it — see *Figures that did not survive the export* below.

**Success criteria:** bot submissions rejected in our own function, before Buttondown is
called, with no added friction for real visitors.

**Check set:** 13 acceptance tests, written in the brief *before* implementation. See
`test.md`.

## Log

### The starting point was itself a broken fix
This build begins where build #1's postscript ends. The inline-subscribe shipped the day
before *looked* verified and was silently failing in production: visitors saw "Almost
there — check your inbox," no subscriber was created, and no email arrived. The local test
had repointed the form action at a dummy page, so the only thing that mattered — a real
cross-origin POST to Buttondown — was never exercised. **[my setup]**

Three separate walls, each fatal alone: a cross-origin `fetch` is CORS-blocked; a
cross-site hidden-iframe submit is stripped by browser tracking protection (reproduced
failing in Safari); the anonymous embed endpoint rate-limits under test traffic. A
`no-cors` fetch reaches the server and creates nothing. No purely client-side integration
is reliable. **[tool limit]**

### Two false "fixed" calls
Moving to a server-side proxy was correct, and it returned `400` on every call.

First wrong diagnosis: forward the visitor's IP. A couple of tests went green and I called
it solved. Those greens came from `curl` running on the user's own machine — a residential
IP — not the datacenter path real users hit. A clean isolation test killed the theory:
injecting a known-good residential IP into the body still `400`d. **[my setup]**

The actual error, once read instead of inferred: `"This subscriber was blocked by your
firewall."` Our own burst of test signups had tripped Buttondown's **Attack mode**, which
auto-enables aggressive + IP-address auditing on "a surge of unactivated subscribers." It
then audited the *connection* IP — always Netlify's datacenter for a proxy — so every
signup was a permanent false positive, including the owner's own address. Self-inflicted.
**[my setup]**, with a **[tool limit]** assist: the block surfaces as a bare `400` with no
hint that a user-configurable setting is responsible.

### The third false claim, which cost real data
Testing the Turnstile rejection path meant flipping the preview's secret to Cloudflare's
always-fail key. I said no redeploy was needed because functions read env per invocation.
Wrong — Netlify injects env vars at **deploy time**. The test therefore ran against the
old secret, returned `{"ok":true,"status":"subscribed"}`, and I nearly recorded a pass for
a control that had not run. It also created a stray real subscriber. **[my setup]**

Third time the same shape: an unverified claim stated confidently, producing a green
result that meant nothing. After a redeploy the same test returned `403 turnstile_failed`
with no subscriber created — the actual proof.

### What shipped
Controls in a deliberate order; every local check runs before any network call, so a bot
costs nothing: method → Origin/Referer → honeypot → email validation → Turnstile
siteverify → Buttondown.

- **Honeypot** hardened against autofill (off-screen, out of the tab order and the a11y
  tree, `autocomplete="off"`, a name matching no autofill category). A password manager
  filling it would silently drop a real subscriber — the same optimistic-success failure
  this build exists to remove. A trip returns the normal success shape and creates
  nothing, so the bot learns nothing.
- **Role-address rejection** — built against the observed traffic, which included
  `accountspayable@`, `support@` (twice) and `thbusinessoffice@`. **Correction, found at
  draft time by checking the list against the export: it catches three of those four, not
  four.** `ROLE_PREFIXES` matches the local part *exactly*, and `thbusinessoffice` is not
  in it. So the shipped control would have stopped 3 of 33 signups on its own — it is a
  cheap pre-filter that saves a network call, not a load-bearing defence. Turnstile is what
  actually does the work. Writing "validated against the observed traffic" without running
  the list over the traffic was the same unchecked-claim habit logged three times below.
  **[my setup]**
- **Turnstile**, verified server-side and **failing closed**. The widget alone protects
  nothing: any string can be POSTed to a public endpoint.
- **`x-forwarded-for` dropped** as untrusted — client-supplied, so honouring it would let
  a bot hand a clean-looking IP to both Turnstile and Buttondown.
- **Structured JSON events** to the function log. Locally rejected traffic never reaches
  Buttondown, so without this the entire point of the build would be invisible.

### Deliberately not built
- **Signed timestamp / dwell check.** The form is statically rendered, so an embedded
  timestamp is identical for every visitor and valid for the life of the deploy — scrape
  once, replay forever. Turnstile covers the same ground. Cutting it also removed a
  proposed rendering-mode change and one env var.
- **Rate limiting.** Needs durable state; belongs at the edge after the Cloudflare Pages
  migration.

### Breaking change, taken knowingly
Subscribing now requires JavaScript. A token-less submission is rejected, because
accepting one *is* the bypass. The `<noscript>` note says so before someone types an
address rather than after.

### What the export actually says (added 2026-07-30, at draft time)

The subscriber export was pulled to replace the recollected figures above. Three things
in it were not visible from the Buttondown dashboard, and all three are more interesting
than the numbers they corrected.

**The traffic came from a distributed pool, not a host.** 33 signups from **16 distinct
IPs across 7 distinct /24s**, the three busiest carrying 11, 8 and 6. Median gap between
signups: **65 minutes** (min 23, max 607 — an overnight lull). That cadence is
machine-regular, and the spread is why the two IP-shaped ideas in this build were always
going to disappoint: rate-limiting per IP has almost nothing to bite on at ~1 signup/hour
across 7 subnets, and forwarding `ip_address` to Buttondown hands it a different, clean
address nearly every time. Both are still in the notes below as dead ends; this is the
evidence for *why* they were dead ends, which we did not have at the time.

**79% never received an email.** 26 of 33 were `blocked` by Buttondown's firewall — the
settings re-enabled on 07-27 were doing real work. Only **7 were actually emailed**
(4 `unactivated` + 3 `undeliverable`), so the hard-bounce denominator is 7, not 33.

**One of them confirmed.** `a23` (in the masked CSV) signed up 2026-07-29T12:16:32Z and
transitioned to `regular` at **2026-07-30T15:22:34Z** — 27 hours later, and ~8 hours after
the hardening merged. The signup predates the merge by 19 hours, so the fix neither caused
nor prevented it. `risk_score` 0.0, no firewall reasons, and it arrived from a /24 that
sent exactly one signup, where the pool subnets sent 6–11. That is *suggestive* of a real
visitor and it is not proof: a scraping victim who clicked out of confusion, or a
corporate link-scanner following the confirmation URL, produce the same record. **Left
unclassified deliberately.** It does mean the newsletter now has one confirmed subscriber,
so "zero confirmed subscribers" is no longer true as of 2026-07-30T15:22Z.

### Figures that did not survive the export

Kept visible rather than quietly overwritten, because the failure mode is the point.

| Claimed from recollection | What the export shows |
|---|---|
| ~25 signups over three days | **33 over 64.9 hours** — undercounted |
| 33% hard-bounce rate | **3 of 7 emailed = 43%**; 3 of 33 overall = 9%. The original had no stated denominator, so it was not wrong so much as unfalsifiable |
| ~12 signups over four days, in an earlier wave | **No trace in the export.** Oldest record is 2026-07-27. Retracted — see `repro/README.md` |
| `immenseignite.info` in the observed traffic | **Not in the export.** It is in `BLOCKED_DOMAINS` and in Buttondown's own settings, but nothing here evidences it |

Two of the four were quotable-looking numbers that turned out to have no source. This is
the same failure as the three green-result failures below, in a different costume: a
figure repeated confidently until it reads as measured. The rule that fixes it is the same
one — derive it where the data actually lives, or do not publish it.

## Artifacts
- PR: https://github.com/jigg-ai/jigg/pull/2 — merged as `8b03914`
- Commits: `c3f4abf` (corrections) → `9d7e581` (honeypot/validation/origin) →
  `295326e` (Turnstile) → `876e871` (client diagnostics)
- Deploy Preview: `deploy-preview-2--candid-gingersnap-6c4b87.netlify.app`
- Subscriber export of the spam wave — dates, domains, statuses, IPs. Masked and committed
  as `repro/spam-wave-masked.csv`; the raw export is held offline and deliberately kept out
  of version control. These are scraping victims, not attackers, and publishing their
  addresses would cause the harm the build is about. `repro/README.md` documents the
  masking rule and what it does and does not substantiate.

## Costs (real numbers, not adjectives)
- Netlify metering changed mid-build: production deploys 15 credits, 300/month. July hit
  315/317 and ran out — the `diag → fix → diag → fix` cycle on this endpoint was roughly
  six production deploys of that. Prompted a $9 top-up (985/1000 remaining at merge) and
  a switch to branch-per-build, where Deploy Previews cost **0** and production is paid
  once at merge.
- This build after the switch: **1** production deploy (15 credits). Every iteration ran
  free on the preview.

## Dead ends
- Hidden-iframe form post to Buttondown's embed endpoint — killed by browser tracking
  protection; "worked" once in an automation browser with protection off, which sent me
  chasing a false positive.
- `no-cors` fetch — completes, creates nothing.
- Forwarding `ip_address` as the fix for the firewall — plausible, disproven by injection
  test. Kept in the code anyway (correct on its own terms), but it is not what unblocked
  anything.
- `X-Buttondown-Bypass-Firewall` as a general fix — rate-limited to five requests/hour,
  fine for a Stripe webhook, useless for a public signup form.
- Testing the function with `npm run dev` — it does not serve functions at all. Every
  attempt returns Astro's 404 page, which the client reports as a generic error.

## Retro
- The recurring failure was not technical, it was epistemic: **three times** a green result
  was accepted without checking that the test matched production. Mocked endpoint,
  residential IP, stale env. Each time the fix was the same — make the test run where the
  real thing runs.
- The Deploy Preview workflow adopted mid-build is what finally made that possible: it
  reaches Buttondown from a datacenter IP exactly as production does, for free.
- Open question worth carrying: production's fail-closed Turnstile has **no alerting**. A
  rotated or expired secret would stop all signups silently. Logs record it; nothing tells
  anyone.

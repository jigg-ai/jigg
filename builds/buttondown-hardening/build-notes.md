# Build notes — hardening the subscribe endpoint

Messy on purpose. The dead ends and the wrong turns are the point (PROCESS step 2);
they are not cleaned up in retrospect.

## Define

**What:** the site's newsletter signup posts to a Netlify Function that calls Buttondown's
API. The endpoint was publicly POST-able with no abuse protection, and bots found it.

**Why now:** ~12 scraped third-party addresses over four days, then ~25 over three and
still climbing. The cost was not noise. Unactivated entries mean **confirmation emails
were sent to real strangers**, and the undeliverable ones are **hard bounces accruing
against a newsletter with zero confirmed subscribers**. Left alone, the plausible endpoint
is Buttondown suspending the account — losing the asset before it exists.

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
- **Role-address rejection** — validated directly against the observed traffic, which
  included `accountspayable@`, `support@`, `thbusinessoffice@`.
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

## Artifacts
- PR: https://github.com/jigg-ai/jigg/pull/2 — merged as `8b03914`
- Commits: `c3f4abf` (corrections) → `9d7e581` (honeypot/validation/origin) →
  `295326e` (Turnstile) → `876e871` (client diagnostics)
- Deploy Preview: `deploy-preview-2--candid-gingersnap-6c4b87.netlify.app`
- Subscriber export (CSV + screenshots) of the spam wave — dates, domains, statuses.
  **Addresses must be masked before publication**: these are scraping victims, not
  attackers, and publishing them would cause the harm the build is about.

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

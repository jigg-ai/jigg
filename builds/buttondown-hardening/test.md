# Test — hardening the subscribe endpoint

## Method
- **Check set (13 checks):** defined in the hardening brief **before** implementation,
  not retrofitted — PROCESS step 1 genuinely satisfied. Each check names a control and
  the response it must produce.
- **Run date:** 2026-07-30
- **Surfaces:** Deploy Preview `deploy-preview-2--candid-gingersnap-6c4b87.netlify.app`
  (test Turnstile key pair) and production `jigg.ai` (real key pair). Production was
  re-run separately because the real sitekey/secret pair is a configuration the preview
  cannot exercise.
- **Note:** local testing was NOT a valid surface. `npm run build`/`npm run dev` do not
  serve `site/netlify/functions/`, so every server-side control was unverifiable until
  a preview existed. This is the same trap that made the earlier inline-subscribe fix
  ship broken.

## Results

| #  | Check | Expected | Outcome | Notes |
|----|-------|----------|---------|-------|
| 1  | `GET` the endpoint | `405 method_not_allowed` | ✅ pass | preview + prod |
| 2  | POST, no Turnstile token | `403 turnstile_missing` | ✅ pass | preview + prod |
| 3  | Honeypot filled (JSON) | `200 ok:true`, no subscriber | ✅ pass | silent success — bot learns nothing |
| 4  | Honeypot filled (urlencoded) | `303 → /subscribed`, no subscriber | ✅ pass | |
| 5  | Role address `support@` | `422 role_address` | ✅ pass | runs *before* Turnstile — 0 network calls |
| 6  | Disposable domain `@mailinator.com` | `422 blocked_domain` | ✅ pass | |
| 7  | Forged `Origin` | `403 bad_origin` | ✅ pass | |
| 8  | urlencoded, no token (no-JS bypass) | rejected | ✅ pass | `303 → /subscribe?error=turnstile` — the bypass that would have voided the whole control |
| 9  | Happy path, real browser | subscriber created | ✅ pass | preview + prod (2 addresses) |
| 10 | Existing subscriber resubmits | `200 status:already` | ✅ pass | soft success, not an error |
| 11 | Turnstile **rejection** path | `403 turnstile_failed` | ✅ pass | forced with test secret `2x…AA`; **no subscriber created** |
| 12 | Production uses the REAL secret | dummy token rejected | ✅ pass | `403 turnstile_failed` — a test secret in prod would have left the endpoint open while appearing to work |
| 13 | Turnstile **replay** (`timeout-or-duplicate`) | `403 turnstile_expired` | ⏭️ skipped | deliberate: exercises Cloudflare's behaviour more than ours, and differs from #11 by one error string. Each flip also costs a redeploy cycle. |

**Not directly observable:** the forged `x-forwarded-for` check. The header is ignored in
code, but the only external evidence is the `ip_address` recorded on a created subscriber.

## Summary
- **Passed:** 12
- **Skipped (deliberate):** 1 — #13, recorded rather than silently dropped
- **Failed:** 0

### Failures during the work, tagged
- **[my setup]** "Verified locally" meant nothing: the earlier inline-subscribe test had
  the form action repointed at a dummy page, so the cross-origin POST — the thing that
  actually broke — was never exercised.
- **[my setup]** Called the fix confirmed twice on contaminated evidence. `curl` ran from
  the user's own machine (residential IP), not the datacenter path real users hit, so a
  green result was an artefact of *where the test ran from*.
- **[my setup]** Asserted "env changes take effect without a redeploy." False — Netlify
  injects env vars at deploy time. The rejection test therefore ran against the **old**
  secret, reported a pass that was really a failure, and created a stray real subscriber.
- **[my setup]** A self-inflicted firewall outage: a burst of test signups tripped
  Buttondown's Attack mode, which auto-escalated to IP-address auditing and blocked every
  proxied signup — including the owner's own address.
- **[tool limit]** Buttondown surfaces a firewall block as a bare `400` with no indication
  that a user-configurable setting is the cause. Diagnosis required reading its API-request
  log and correlating by IP.
- **[tool limit]** The anonymous embed endpoint is CORS-blocked for `fetch`, and a
  cross-site hidden-iframe submit is stripped by browser tracking protection — so no
  purely client-side integration is reliable.

## Standing checks for re-verification
- Re-run #12 after any Turnstile key rotation. Fail-closed means a misconfigured secret
  stops **all** signups rather than leaking spam — silent, and invisible without alerting.
- The `+test-YYYYMMDD@gmail.com` convention was re-verified working with Buttondown
  Auditing enabled (subscriber landed `Unactivated`, not `Blocked`). Re-check if the
  firewall settings change again.

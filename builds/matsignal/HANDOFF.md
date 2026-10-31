> **CURRENT FOUNDER HOLD — 2026-10-30:** The working name **MatSignal** is now unassigned while the founder considers it for a different BJJ utility. **Do not execute, brand, name routes/functions/analytics, create a preview, or deploy this gym trial-conversion POC using MatSignal until a revised founder-approved contract is issued.** The builder is separately blocked by public-repository credential isolation. These files are retained under their original historical paths for provenance. See [issue #7's current hold](https://github.com/jigg-ai/jigg/issues/7#issuecomment-6537015015). Earlier “ready to build” language below is superseded.

# MatSignal — Builder Kickoff & Delivery Contract (BUILD-001)

**Version:** 1.0 — 2026-10-30  
**Audience:** Implementation builder (Claude Code or another founder-appointed coding agent)  
**Product / working brand:** MatSignal  
**Target:** `matsignal.jigg.ai` (requested; **not yet configured / verified**)  
**Codebase:** [jigg-ai/jigg](https://github.com/jigg-ai/jigg) — Astro 7, Node 22, Netlify  
**Authorization:** Founder has approved beginning the **landing-page preview implementation**. Production merge, hostname activation, paid services, outbound acquisition, CRM access and full SaaS implementation are **NOT** approved.  
**Status on issuance:** READY FOR BUILDER ACK; no implementation branch, PR or preview is claimed to exist.

> **Builder: begin the preview implementation after verifying you have access only to the public jigg-ai/jigg repository.** Work independently within the scope below; do not wait for founder design selections when a reversible design decision can be demonstrated in a PR. Stop for external spend, credentials, data/permissions or public release.

## A. Mission

Create an excellent, credible and memorable landing-page experiment for **MatSignal**, an *early-stage idea* exploring whether independent BJJ/martial-arts gym owners can better understand and improve the journey from a prospective member's initial inquiry through trial class and follow-up to paid membership.

The page exists to test **whether qualified gym owners want to discuss a real workflow problem and potentially evaluate a focused supplement to their existing software**. It is **not** a product launch, not a feature-complete application, and not proof that incumbent CRMs are inadequate. The studio's public build journal separately explains the publishable **why** and records the actual implementation.

**Product funnel represented in UI:**
`Inquiry → Trial booked → Trial attended or missed → Follow-up → Paid membership`.

An additional tool is commercially interesting **only if** the gym's current platform and actual processes leave an important, repeated and costly gap. Do not assume it does.

## B. Read first (PUBLIC sources only)

Follow the repository's governing documentation in this order:
1. [CLAUDE.md](../../CLAUDE.md), [CONTEXT.md](../../CONTEXT.md), [PROCESS.md](../../PROCESS.md), [STYLE.md](../../STYLE.md), and [BACKLOG.md](../../BACKLOG.md).
2. [MatSignal BRIEF.md](BRIEF.md) (project scope); [THESIS.md](THESIS.md) (**public** Build Thesis, currently draft); [test.md](test.md) (precommitted acceptance tests); [build-notes.md](build-notes.md) (public execution log).
3. Inspect actual Astro components, routes, `netlify.toml`, shared layouts, contact, privacy and analytics code. Favor existing conventions over new infrastructure.

This HANDOFF is the builder's **single execution contract**. When another public project document differs materially, surface the inconsistency in the PR rather than silently choosing the more convenient interpretation. The stated documents define the project scope. **Do not pull unrelated materials into this implementation.**

## C. Visual / creative mandate

**You own the creative execution.** Propose and implement an original MatSignal logo/mark, responsive visual identity, typography, palette, illustrations, motion (if any), and page hierarchy. Brand should be confidently gym-oriented without cliché cage-fighting clichés, stock people, clip-art dumbbells, generic dark SaaS grids or fabricated dashboard screenshots. Aim for a product somebody remembers after ten minutes, not a template.

- Provide **2–3 distinct headline/hero directions** in the build log or PR description, with a short reason for your selected direction.
- Implement one coherent design in the PR. Give founder reviewable screenshots of desktop and mobile, and an easy way to request an iteration.
- Prefer typography, deliberate illustration of the funnel and strong responsive design over ornamental animation. Provide reduced-motion handling if motion is used.
- Ensure the brand can coexist under Jigg.AI without implying MatSignal is a mature company or has live customers.
- Include a modest, truthful **“A Jigg.AI experiment”** attribution and a working link to `jigg.ai`. Logo/name clearance remains pending; don't register or claim trademark rights.

## D. Landing-page information architecture

Suggested sequence; you may change structure to improve clarity without changing claims:

1. **Hero:** MatSignal identity, concrete audience/outcome-oriented question, concise hypothesis (not a promise of results), one dominant CTA.
2. **Trial-to-member journey:** clear, visually engaging progression showing inquiry, booked trial, attended/missed, follow-up and membership. Visualize the operational handoffs; do not fabricate analytics or imply a running product.
3. **Questions owners will recognize:** Where are prospects dropping out? What happens after missed classes? Which follow-ups occur? What can your current platform already do? Avoid falsely presenting these as universally unsolved.
4. **Concept statement:** We're exploring additional *visibility/actionable insight* alongside a gym's existing management tools. No current integration or product capability is represented as released. Existing systems may already solve much of this.
5. **Owner conversation invitation:** clear, non-sales-pressure CTA to share how the gym handles trial-to-membership conversion. Short privacy and consent explanation, genuine error/success states.
6. **Footer:** Jigg.AI attribution, privacy/contact links, clear experimental stage.

**Suggested headline territories (not fixed copy):**
- “What happens after someone books a trial class?”
- “From first interest to first membership.”
- “Find the gaps between the trial and the membership.” (A concept to explore, not an available feature.)

**Primary CTA:** “Talk about your gym’s trial-to-member process” or a concise equivalent that clearly requests a *research conversation*. Avoid “Get started”, “Activate AI”, “Connect PushPress”, “Start free trial” or a paid signup when no software exists.

This is distinct from the Jigg.AI Build Thesis, which is for the studio's **public journal**. The MatSignal customer page should **not** contain a story about internal product ideation or research methods.

## E. Required technical work

### E1. Astro / route / domain architecture
- Work in the **existing** `jigg-ai/jigg` codebase. Examine whether best option is an isolated Astro route with hostname-sensitive serving, a Netlify redirect/rewrite, a separate deployment, or another minimal route. Compare security, maintenance, domain routing, cost and deploy impact in the PR; do not invent an already-live subdomain.
- Prototype the customer-facing page on a **Deploy Preview**, with a deterministic preview URL.
- **`matsignal.jigg.ai` requires explicit DNS, TLS and site/route mapping.** An Astro page by itself does not make the subdomain resolve. Produce a specific configuration proposal, roll-back approach and identified founder-operated DNS steps; **do not apply DNS or domain changes yet**.
- Respect `netlify.toml`'s existing production-build cost controls and the repository's branch → PR → preview → founder review → merge workflow. Do not merge `main` yourself.
- Consider canonical URLs, sitemap behavior, preview indexing, relative paths/assets, error pages, legal pages and link navigation when hosted under a distinct hostname.

### E2. Secure lead intake
- The public site already has `ContactForm.astro` and `site/netlify/functions/contact.mjs` (Turnstile anti-abuse, Resend email delivery, validation, origin/hostname checks, preview context labels). Inspect them before selecting an implementation.
- Prefer a **distinct MatSignal inquiry pathway** or a carefully scoped extension to existing infrastructure, so product-research inquiries do **not** get mixed with paid studio contact leads or Buttondown newsletter consent.
- Allowed fields: contact name, work email, gym/business name (optional), current gym platform (optional), explicit opt-in consent to be contacted about this experiment. Only request a short free-text explanation if necessary, clearly warn against including member/child/payment details. Do not accept customer/member datasets or CRM exports.
- The current `contact.mjs` hardcodes allowed origin hostnames and checks Turnstile's solved hostname. Account for `matsignal.jigg.ai` in the **proposed** deployment; do not weaken protections or broadly allow arbitrary origins. Preview testing must not rely on dummy success in production.
- Keep separate analytics/events for `matsignal_landing_view`, `matsignal_cta_click`, `matsignal_inquiry_success`, and `matsignal_inquiry_error` (or consistently named equivalents). Document what is *actually* captured vs proposed; counts are not a substitute for verified buyer conversations. No names/emails in event logs, page URL/query or Git.
- A visible success message must mean the backend **accepted** the submission. Do not claim delivered email without delivery evidence (provider acceptance differs from successful inbox delivery).
- If existing provider keys, approval, domain verification or secret configuration are required, make a real failure state, document BLOCKED and request the specific approval rather than faking a working backend.
- Review the published privacy notice for this new **product-research contact purpose**. Propose required copy and data handling/retention; do not silently collect for a new purpose under the studio services privacy statement.

### E3. Quality / content
- Mobile-first layout across narrow mobile to desktop, semantic structure, keyboard controls, labeled form fields, clear errors and status announcement, contrast, focus states, reasonable performance and tested reduced-motion as applicable.
- Correct title, description, OpenGraph image, favicon and social preview; no fabricated product illustrations masquerading as screenshots.
- Keep dependencies and services minimal, avoid unexplained paid integrations, and never commit credentials or personal test submissions.
- Label the project **experiment/concept**, avoid claimed conversion lift, existing integrations, customer quotes or payment features.

## F. Explicit exclusions

**No** SaaS backend, accounts, gym dashboards, live pipeline analytics, AI model integrations, PushPress/other CRM connectivity, texting automation, scraping gym owner lists, customer contact/outreach, trial-member data, payment collection, subscriptions, advertising, hosting spend or new external accounts. No customer interviews without separate founder authorization. No full public launch until founder approval.

**Repository boundary:** Use a **repo-scoped identity/integration with access to `jigg-ai/jigg` only**; access scope is **not yet independently verified**. Do not use or request account-wide credentials. Public Git history cannot be reliably erased after accidental disclosure.

## G. Execution workflow and checkpoints

1. **Acknowledge the assignment in its GitHub issue**: your builder identity, date, accepted HANDOFF version and path, actual GitHub permission scope (public repo only), intended branch and any hard blockers. If the GitHub permission boundary is unverified, stop **before accessing repositories beyond the public one** and request a scoped credential.
2. Create/check out `build/matsignal` from latest `main`. Use the current live repository, not an old exported snapshot. Log the first action and start time in `build-notes.md`.
3. Choose visual concept, implement in Astro, commit in meaningful increments. Record the **actual design iterations, prompts, errors, rationale and costs** as you go, never recreate missing prompts or results.
4. Implement the form and relevant server validation/preview, but stop at any account, DNS, cost or secrets decision outside the approved preview scope.
5. Run the repo's build (`npm --prefix site run build`) and the [pre-registered tests](test.md); record PASS, FAIL, BLOCKED and evidence. Use `netlify dev` for functions; `npm run preview` does **not** exercise Netlify functions. Real preview checks must cover both successful and failed contact delivery as authorized.
6. Push feature branch, create **draft or reviewable PR** targeting `main`, request a Netlify Deploy Preview and provide screenshots/short recording. Do not merge or expose the site through live DNS.
7. Give founder a short **return packet** in the PR: branch+commit SHA, PR URL, verified preview URL, architecture/hostname proposal, desktop/mobile previews, implemented features vs unimplemented hypotheses, test report, consent/privacy posture, analytics events, actual time/deploy credits and unresolved approvals.
8. Stop for founder review. Following a separate release decision, record production URL/DNS/TLS evidence, true site analytics and observed business feedback in the appropriate approved pipeline. Do not equate technical completion with market validation.

## H. Definition of done for **this preview build**

- [ ] Builder identity + public-only credential scope explicitly confirmed.
- [ ] Original identity/logo, polished responsive page and 2–3 headline options recorded.
- [ ] Truthful concept language, visible experiment status, clear funnel and one conversation CTA.
- [ ] Working real consented intake path demonstrated on preview **or** clearly labeled BLOCKED with precise remediation, no fake submission.
- [ ] Form origin/Turnstile/Netlify implications for requested hostname tested or explicitly identified as pre-release requirements.
- [ ] Privacy, security, accessibility, mobile, performance, navigation, metadata, and no-unsupported-claims checks logged with evidence.
- [ ] Domain architecture, costs, DNS/TLS and deployment rollback plan documented.
- [ ] Actual commits, PR, Deploy Preview URL, screenshots/assets and implementation record provided.
- [ ] Founder receives review request; **no `main` merge, production deployment, DNS change or external acquisition** performed.

**Builder should not declare COMPLETED when a blocking form dependency or hostname issue remains unresolved.** Report the technical artifact as PREVIEW_READY_WITH_BLOCKERS if accurate. Commercial success is evaluated later, separately.

## I. Required return format

```text
MatSignal BUILD-001 — Builder return
Builder / GitHub identity:
Accepted specification: builds/matsignal/HANDOFF.md v1.0
Repo and work branch:
PR and commit SHA:
Deploy Preview URL / tested date:
Design direction / logo files / screenshots:
Build command and result:
Form path and test outcome (accepted vs verified delivered):
Analytics events actually present:
Privacy, accessibility and security QA:
Subdomain routing recommendation / DNS/TLS and rollback:
Measured human/agent time and build/deploy credits:
Blockers and unapproved dependencies:
Request to founder: APPROVE PREVIEW / REVISE / STOP / PERMISSION NEEDED
```

This package is sufficient to begin *engineering*. Use it only for the specified engineering work.

> ## CURRENT NAME AND SCOPE — 2026-10-30
>
> **PRD-002 is now the unnamed “Gym Trial Conversion Experiment.”** The founder has selected **MatSignal** as the working name for a **different** BJJ athlete-search/tracking utility (PRD-003). Active PRD-003 work is in [`builds/matsignal-competition/`](../matsignal-competition/BRIEF.md), [issue #8](https://github.com/jigg-ai/jigg/issues/8), and [draft PR #9](https://github.com/jigg-ai/jigg/pull/9).
>
> This older `builds/matsignal/` directory, page copy, links and proposed hostname are **historical PRD-002 artifacts only**, never current rights to MatSignal branding or routing. **PRD-002 build is still ON HOLD** pending a new name, amended handoff and enforceably scoped builder credentials; [issue #7](https://github.com/jigg-ai/jigg/issues/7). The older brief below is preserved for traceability, not a live assignment.

---

# MatSignal — public builder brief

**Status:** not started. **Working brand:** MatSignal. **Proposed hostname:** matsignal.jigg.ai (not yet deployed). **Sponsor:** Jigg.AI.

**Implementation kickoff:** [HANDOFF.md v1.0](HANDOFF.md) is the authoritative builder execution contract. [GitHub issue #7](https://github.com/jigg-ai/jigg/issues/7) tracks assignment, acknowledgement and the subsequent PR. Builder may begin **preview-only** implementation once public-repository-scoped access is verified; no production release, DNS changes or customer acquisition are approved.

## Assignment
Design and implement a distinctive, mobile-first **landing-page experiment**, not a working SaaS product. Audience: independent BJJ and martial-arts gym owners. Concept: help owners explore gaps from an inquiry, to a booked trial, to attendance/no-show, to follow-up and finally a paying member. This is a proposed *additional layer alongside existing gym CRM software*, not a replacement. Existing platforms have conversion and follow-up features; do not claim the concept is already better, working, integrated or proven.

The page's job is to explain the hypothesis and invite qualified owners to a conversation about their actual workflow. Primary CTA: **Talk about your gym's trial-to-member process**.

## Public rationale

Read [THESIS.md](THESIS.md), the **draft public Build Thesis**, as the rationale for undertaking this experiment. It explains the buyer journey and why the question may be commercially useful **without claiming unverified market evidence**. The builder may refine presentation and draft a Jigg.AI build-journal explanation from this *public* material, but must obtain founder approval before publishing the thesis or article. Keep customer-facing landing-page copy concise and relevant to gym owners; do not turn it into an internal research narrative. No private sourcing reports or agent conversations are needed.

## Creative ownership
The builder owns original logo/icon design, brand visuals, typography, color system, responsive UI, illustrations and implementation choices, subject to founder preview review. Produce 2–3 headline options. Keep the copy clear and credible; "A Jigg.AI experiment" attribution and a link to jigg.ai should be present. No invented case studies, screenshots of fictional functionality, fabricated success numbers or endorsements. Name and mark remain subject to founder/clearance review.

Suggested sections: hero + CTA; simple funnel visual; owner-oriented questions about follow-up and missed trials; honest "built to complement existing tools" concept; invitation to participate; privacy/contact details.

## Deliverables
- Code, original design and logo in this public `jigg-ai/jigg` repository, respecting `CONTEXT.md`, `PROCESS.md`, `STYLE.md` and `netlify.toml`.
- Work on `build/matsignal` branch and PR with a working Netlify Deploy Preview; **no merge or production release** before founder approval.
- Verified minimal and privacy-conscious opt-in lead form (or clearly BLOCKED if a provider/credential decision remains). Ask only name, business email, gym name and current software optionally, plus explicit contact consent; do not connect to newsletter consent.
- Define page view, CTA and successful form events with privacy safeguards, and verify real success/error states without storing personal data in Git/analytics.
- Investigate actual DNS/TLS/Netlify hostname routing for `matsignal.jigg.ai`. An Astro route does not configure a subdomain. Present minimal, cost-aware routing plan; do not modify DNS or create paid services without permission.
- Accessible mobile/desktop design, correct metadata and preview noindex, recorded tests, screenshots, actual time/cost when measurable, PR SHA and founder-review request.
- Dated public engineering notes recording implementation decisions, failed attempts and actual tests. Do not fabricate past work.

## Boundaries
No CRM API access, member records, student/minor/payment data, autonomous customer outreach, paid advertisements, new paid accounts, backend, login or SaaS functionality. No claims of current product availability, proven conversion lift, AI-driven automated follow-up or certified integrations.

The public build journal covers **design and execution only**. Do not publish or request private strategic evaluation, internal research discussions, bot exchanges, unreleased commercial assumptions, private repository links, or customer information. This brief supplies the complete public implementation scope.

## Technical gate
Before work, the named builder acknowledges this exact brief and supplies expected branch, risks and dependencies. The return packet must contain PR, preview, image/logo assets, test results, confirmed or blocked contact delivery, routing/DNS proposal, measured costs and needed approvals. Founder must separately authorize production release and traffic acquisition. A finished landing page does not validate a business.

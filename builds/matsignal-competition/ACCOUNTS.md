# MatSignal — free accounts and saved groups (design proposal)

**Status:** PROPOSAL for founder review, per HANDOFF §5 ("define the minimal data model, permissions/threat model and a concrete cost-conscious backend/auth design"). Nothing is built:
- no auth service, database, Netlify feature, secret or account has been created;
- no user data is collected.

Implementation waits until data access is validated, per the founder's priority update. **Date:** 2026-10-30.

## Requirements (HANDOFF §1, §5)
- Search stays anonymous. An account is asked for only at "Save my group".
- A guest's selection survives sign-in.
- Free: no paid tiers, locked search, artificial quotas or lead capture.
- Groups are private to their creator, with no public rosters.
- Passwordless sign-in is preferred.
- Ownership isolation, rate limiting, email verification, deletion and export, and a minimal privacy notice.
- No fabricated signups. No personal emails in Git or fixtures.

## Data stored, and nothing more

| Record | Fields | Notes |
|---|---|---|
| `User` | random `id`, normalized `email`, `createdAt`, `lastSignInAt` | No name, phone, date of birth or gym. |
| `TrackingGroup` | random `id`, `ownerId`, `name`, `members: IdentityRef[]`, timestamps | Members are platform references only (`source` + platform ID + profile URL), the shape from `model.ts`. |
| `SignInToken` | SHA-256 of the token, `email`, `expiresAt` (15 min), `used` | Single-use; the raw token exists only in the email. |
| `Session` | SHA-256 of the session ID, `userId`, `expiresAt` (30 days) | Sent as an `HttpOnly; Secure; SameSite=Lax` cookie. |

**Open choice:** whether a user may type their own label for a group member (e.g. a teammate's name). That label would be personal data about a third party, held by MatSignal. The minimal default is platform references only, displayed with the platform's own name for the athlete when a permitted source supplies it.

## Flow
1. **Guest:** select athletes, stored in `localStorage` exactly as in the demo today.
2. **Save:** "Save my group, free" → enter email → Turnstile check → a function emails a sign-in link. The response is always "Check your email", so it never reveals whether an account exists.
3. **Sign-in link:** the function checks the token hash, expiry and single use, starts a session, and merges the guest selection into a group. The merge is idempotent, and members are deduplicated by identity key.
4. **Signed in:**
   - groups sync across devices;
   - sign out (deletes the session);
   - export (JSON);
   - delete account (removes the user, groups, sessions and tokens immediately).

## Backend options

| Option | What | Cost and dependencies | Trade-offs |
|---|---|---|---|
| **A (recommended for the first slice)** | Netlify Functions + **Netlify Blobs** (key-value) + **Resend** for sign-in emails | No new vendor. Resend is already set up for `jigg.ai` with a sending-only key. **Blobs and function usage are metered under Netlify's credit plans; the exact allowance is UNKNOWN** (secondary sources only). Check the billing page before approving. | Key-value only: email uniqueness is enforced with an `email → userId` key, and there are no queries. Fine at small scale. A storage interface keeps a later move to Postgres to one file. |
| **B** | Supabase Auth + Postgres (free tier) | New vendor account | Mature magic-link auth; row-level security for ownership. Free-tier inactivity pausing and limits to be verified. |
| **C** | Auth0 (Netlify's recommended Identity replacement) + Blobs | New vendor account | Heaviest; more than this needs. |
| **Not** | Netlify Identity | | Deprecated by Netlify in February 2025 ([changelog](https://netlify.com/changelog/deprecation-netlify-identity)). A forum post claims a reversal; unverified. |

Separately from storage cost: every MatSignal production deploy is a jigg.ai production deploy at 15 credits, from the same 300-credit monthly allowance (PROCESS → Shipping).

## Threat model

| Threat | Control |
|---|---|
| Account enumeration through sign-in | Same response for known and unknown emails; per-email and per-IP rate limits. |
| Sign-up or email spam | Turnstile and honeypot (the `contact.mjs` pattern); per-IP limits; a Resend send cap. |
| Sign-in link interception or replay | 15-minute expiry, single use, only the hash stored; prior links invalidated on sign-in. |
| Session theft | `HttpOnly`, `Secure`, `SameSite=Lax`; rotated at sign-in; 30-day expiry; sign-out deletes server-side. |
| Reading or editing another user's group | Every read and write checks `ownerId === session.userId`. Random IDs. No public or shareable group URLs in this slice. |
| CSRF | `SameSite=Lax` plus the origin allowlist check already used in `contact.mjs`, on every state-changing POST. |
| Stored XSS through group names | Text-only rendering (`textContent`, as the demo does); length limits. |
| Server-side request forgery | Pasted links are parsed (`smoothcomp.ts`) and rendered as links; the server never fetches them. |
| Minors | Groups are private and never listed or shared. A group of youth athletes' platform IDs is treated as data about minors: private, deletable on request, no notifications in this slice. |
| Email "sent" ≠ delivered | Resend acceptance is logged as accepted only (an existing BACKLOG item). |

## Privacy and retention (founder decides the numbers)
- **Purpose:** let a user save and retrieve their own groups. Not the newsletter, and not studio inquiries.
- **Retention:** account deletion is self-serve and immediate. Inactive accounts are deleted after **N months** (proposal: 24). Tokens and sessions expire as above.
- **Notice:** the live privacy page covers subscribe, contact and Botpress only. MatSignal needs its own section before any account exists.

## Decisions needed
1. Option A, B or C.
2. Whether the abuse limits needed (e.g. groups per user, members per group) count as "artificial quotas". Proposal: generous technical limits with no paid tier above them.
3. Platform references only, or user-entered member labels too.
4. Retention period and privacy-notice wording.
5. Before any build: confirm Blobs and Functions metering on Netlify's billing page (Option A) or create the vendor account (B or C).

**Not in this slice:** group sharing, notifications, social login, anything paid.

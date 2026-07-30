// Server-side subscribe proxy (Netlify Function).
//
// Why this exists: the browser cannot reliably subscribe to Buttondown directly.
// A cross-origin `fetch` is CORS-blocked; a cross-site hidden-iframe form submit
// gets eaten by browser tracking protection (Safari/Brave/Firefox); and the
// anonymous embed endpoint rate-limits. So the form posts here, same-origin, and
// we call Buttondown's authenticated API server-side — real success/error states.
//
// This endpoint is publicly POST-able, so it carries its own abuse controls. They
// run in a deliberate order: every local check happens BEFORE any network call, and
// Buttondown is never called if a check fails. Turnstile verification slots in at
// step 6 (see BRIEF) — the one remaining network hop ahead of Buttondown.
//
// One gotcha lives in Buttondown, not here: its Firewall (Settings → Firewall).
// We forward the visitor's real IP as `ip_address` so the firewall can judge the
// subscriber rather than us. Whether that satisfies "IP address auditing" is
// UNVERIFIED: when auditing was last on, signups still returned 400 "blocked by
// your firewall" with `ip_address` already being forwarded — but Attack mode had
// escalated auditing to Aggressive at the time, so the two are confounded. Treat
// "forwarding the IP makes IP auditing safe" as untested, and re-test after
// enabling rather than before.
//
// Current Buttondown settings are deliberate and NOT to be changed from here:
// Auditing Enabled, Attack mode Enabled, Handling-blocked Enabled, IP auditing
// Disabled. Attack mode does not merely warn — it auto-enables IP auditing on a
// surge of unactivated subscribers, which a real launch resembles.
//
// Note double opt-in is NOT sufficient as the spam gate. It prevents list
// poisoning (nobody joins unconfirmed) but not list bombing: the confirmation
// email is itself the payload, and strangers have received them from this
// endpoint. Abuse controls belong in front of this call, not after it.
//
// Key lives only in the BUTTONDOWN_API_KEY env var, never in the repo.

const API_URL = 'https://api.buttondown.com/v1/subscribers';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 254; // RFC 5321 practical ceiling

// Hosts allowed to submit. Preview/branch deploys run on *.netlify.app and must
// keep working, or the whole preview-verification workflow breaks.
const ALLOWED_HOSTS = new Set(['jigg.ai', 'www.jigg.ai', 'localhost', '127.0.0.1']);
const isAllowedHost = (host) =>
  ALLOWED_HOSTS.has(host) || host.endsWith('.netlify.app');

// Shared/role mailboxes. Nobody subscribes to a newsletter from one, and observed
// bot traffic used exactly these. Deliberately NOT including `hello@` — it's a
// common personal-ish alias (and our own address).
const ROLE_PREFIXES = new Set([
  'support', 'info', 'admin', 'sales', 'contact', 'noreply', 'no-reply',
  'postmaster', 'webmaster', 'abuse', 'billing', 'accounts', 'accountspayable',
  'accounting', 'office',
]);

// Throwaway providers. Maintenance debt by nature — this list goes stale, it is a
// speed bump rather than a wall. `immenseignite.info` mirrors Buttondown's own
// blocked-domains entry so we reject it before spending a network call.
const BLOCKED_DOMAINS = new Set([
  'immenseignite.info',
  'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com',
  'temp-mail.org', 'yopmail.com', 'throwawaymail.com', 'sharklasers.com',
  'trashmail.com', 'getnada.com', 'dispostable.com', 'maildrop.cc',
  'fakeinbox.com', 'mailnesia.com', 'spam4.me',
]);

// Structured, single-line events. Netlify function logs are the sink for now —
// see BRIEF telemetry: locally-rejected traffic never reaches Buttondown, so
// without this it would be invisible. Emails are reduced to their domain: enough
// to spot a spam pattern, without writing addresses into logs.
const log = (evt, data = {}) => console.log(JSON.stringify({ evt, ...data }));
const domainOf = (email) => String(email).split('@')[1] || '';

export default async (req) => {
  // 1. Method
  if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);

  const key = process.env.BUTTONDOWN_API_KEY;
  if (!key) {
    console.error('BUTTONDOWN_API_KEY is not set');
    return json({ ok: false, error: 'server_not_configured' }, 500);
  }

  // No-JS clients get redirects; our fetch (Accept: application/json) gets JSON.
  const wantsJson = (req.headers.get('accept') || '').includes('application/json');
  const reply = (data, status, redirectTo) =>
    wantsJson ? json(data, status) : redirect(redirectTo);

  // 2. Origin / Referer. Trivially spoofable, so this only catches lazy bots — but
  // it costs nothing. Absent headers are allowed through: privacy tools strip
  // Referer, and rejecting on absence would block real people while a bot would
  // simply omit the header anyway.
  const origin = req.headers.get('origin') || req.headers.get('referer') || '';
  if (origin) {
    let host = '';
    try {
      host = new URL(origin).hostname;
    } catch {
      host = '';
    }
    if (!host || !isAllowedHost(host)) {
      log('origin_reject', { host: host || null });
      return reply({ ok: false, error: 'bad_origin' }, 403, '/subscribe?error=failed');
    }
  }

  // Accept our fetch (JSON) and the no-JS form navigation (urlencoded) alike.
  const ctype = req.headers.get('content-type') || '';
  let email = '';
  let honeypot = '';
  try {
    if (ctype.includes('application/json')) {
      const body = await req.json();
      email = body.email || '';
      honeypot = body.contact_reason || '';
    } else {
      const form = await req.formData();
      email = form.get('email') || '';
      honeypot = form.get('contact_reason') || '';
    }
  } catch {
    email = '';
  }
  email = String(email).trim().toLowerCase();

  // 3. Honeypot. A decoy field no human sees; if it carries a value, this is a bot.
  // Respond with the ordinary success shape and create nothing: an error teaches a
  // bot to adapt, a success does not. The field is named/marked so browser autofill
  // and password managers leave it alone — see EmailCapture.astro.
  if (String(honeypot).trim() !== '') {
    log('honeypot_trip', { domain: domainOf(email) });
    return reply({ ok: true, status: 'subscribed' }, 200, '/subscribed');
  }

  // 4. (Signed timestamp / dwell check — deliberately not implemented. The form is
  // statically rendered at build time, so an embedded timestamp is identical for
  // every visitor and stays valid for the life of the deploy. Turnstile covers the
  // same ground; see BRIEF.)

  // 5. Email validation. Server-side; client validation is not a control.
  const localPart = email.split('@')[0] || '';
  const domain = domainOf(email);
  let rejection = '';
  if (!EMAIL_RE.test(email) || email.length > MAX_EMAIL_LEN) rejection = 'format';
  else if (BLOCKED_DOMAINS.has(domain)) rejection = 'blocked_domain';
  else if (ROLE_PREFIXES.has(localPart)) rejection = 'role_address';

  if (rejection) {
    log('validation_reject', { reason: rejection, domain: domain || null });
    const error = rejection === 'format' ? 'invalid_email' : rejection;
    return reply({ ok: false, error }, 422, `/subscribe?error=${rejection}`);
  }

  // 6. Turnstile siteverify slots in here — first network call, ahead of Buttondown.

  // Forward the real visitor IP so Buttondown records/audits the subscriber, not us.
  // Only the Netlify-set header is trusted: `x-forwarded-for` is client-supplied and
  // spoofable, so honouring it would let a bot hand Buttondown a clean-looking IP.
  const clientIp = req.headers.get('x-nf-client-connection-ip') || undefined;

  // 7. Buttondown.
  let bdRes, bdBody;
  try {
    bdRes = await fetch(API_URL, {
      method: 'POST',
      headers: { Authorization: `Token ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email_address: email, ...(clientIp && { ip_address: clientIp }) }),
    });
    bdBody = await bdRes.json().catch(() => ({}));
  } catch (err) {
    console.error('Buttondown API unreachable', err);
    log('email_subscribe_failed', { reason: 'upstream_unreachable' });
    return reply({ ok: false, error: 'upstream_unreachable' }, 502, '/subscribe?error=network');
  }

  // 200/201 → created; Buttondown sends the double opt-in confirmation email.
  if (bdRes.ok) {
    log('email_subscribed', { domain });
    return reply({ ok: true, status: 'subscribed' }, 200, '/subscribed');
  }

  const detail = JSON.stringify(bdBody || '').toLowerCase();

  // Already on the list — Buttondown returns 400 on a collision. Soft success.
  if (bdRes.status === 400 && /already|exist|conflict/.test(detail)) {
    log('email_subscribed', { domain, status: 'already' });
    return reply({ ok: true, status: 'already' }, 200, '/subscribed');
  }

  // Opted out before — Buttondown (and anti-spam compliance) won't let a signup
  // form re-add an address that unsubscribed. Surface it clearly, not as a 502.
  if (bdRes.status === 400 && /unsubscrib|resubscribe|rejected your newsletter/.test(detail)) {
    log('email_subscribe_failed', { reason: 'unsubscribed', domain });
    return reply({ ok: false, error: 'unsubscribed' }, 200, '/subscribe?error=unsubscribed');
  }

  // Full detail is logged server-side; the client only gets a generic error so we
  // don't leak Buttondown's internals.
  console.error('Buttondown subscribe failed', bdRes.status, bdBody);
  log('email_subscribe_failed', { reason: 'upstream_error', upstreamStatus: bdRes.status, domain });
  return reply({ ok: false, error: 'subscribe_failed' }, 502, '/subscribe?error=failed');
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

const redirect = (location) => new Response(null, { status: 303, headers: { location } });

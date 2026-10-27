// Project-inquiry endpoint (Netlify Function) behind /contact.
//
// Contact is the studio's primary conversion (CONTEXT §6), so it carries the same
// abuse controls as the newsletter proxy (subscribe.mjs, which is the reference for
// why each one exists), in the same deliberate order: every local check runs BEFORE
// any network call, and the inquiry is never sent if a check fails.
//
// Delivery: the inquiry is emailed to CONTACT_TO through Resend's API, with the
// visitor's address as Reply-To, so answering it is just replying to the email.
// Nothing is stored here; the inbox is the record.
//
// Telemetry (CONTEXT §8): structured one-line events in the function log. They
// carry the self-reported "how did you find Jigg.AI" answer and the referrer/UTM
// tags the page recorded, plus rejection and failure reasons. They never carry
// the message, the name, or the address — only its domain.
//
// Env: RESEND_API_KEY, TURNSTILE_SECRET_KEY (shared with subscribe), and optionally
// CONTACT_TO (default hello@jigg.ai) and CONTACT_FROM (must be on the domain
// verified in Resend).

const RESEND_URL = 'https://api.resend.com/emails';
const TURNSTILE_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = { name: 120, email: 254, organization: 160, messageMin: 20, messageMax: 5000 };
const MAX_LINKS = 3; // link-stuffed messages are the commonest form-spam shape

const ALLOWED_HOSTS = new Set(['jigg.ai', 'www.jigg.ai', 'localhost', '127.0.0.1']);
// This site's own Netlify hosts only: the site itself and its deploy previews and
// branch deploys (deploy-preview-5--<site>, feat-studio--<site>). Any other
// *.netlify.app is somebody else's site, so it no longer passes.
const NETLIFY_SITE = 'candid-gingersnap-6c4b87.netlify.app';
const isAllowedHost = (host) =>
  ALLOWED_HOSTS.has(host) || host === NETLIFY_SITE || host.endsWith(`--${NETLIFY_SITE}`);
// Cloudflare's published test secrets (1x/2x/3x…AA), used on previews and locally.
// What hostname they report is undocumented, so the token-hostname check below
// applies to real keys only.
const isTestSecret = (s) => /^[123]x0+AA$/.test(s);
// The deploy context comes from Netlify's handler context (context.deploy.context:
// production, deploy-preview, branch-deploy, dev). NOT process.env.CONTEXT: that is
// a build-time variable, and Netlify doesn't provide it to functions at runtime.
// The env var is only a fallback for local runs and the test harness.
const deployContextOf = (context) => context?.deploy?.context || process.env.CONTEXT || 'local';


// Throwaway providers — the same speed bump as subscribe.mjs. Role addresses
// (info@, contact@) are NOT rejected here, unlike the newsletter: a business
// inquiry from a shared inbox is perfectly legitimate.
const BLOCKED_DOMAINS = new Set([
  'immenseignite.info',
  'mailinator.com', 'guerrillamail.com', '10minutemail.com', 'tempmail.com',
  'temp-mail.org', 'yopmail.com', 'throwawaymail.com', 'sharklasers.com',
  'trashmail.com', 'getnada.com', 'dispostable.com', 'maildrop.cc',
  'fakeinbox.com', 'mailnesia.com', 'spam4.me',
]);

// The self-reported answer. Anything else is recorded as "other" rather than
// trusted, so the field can't be used to write arbitrary text into the log.
const SOURCES = {
  linkedin: 'LinkedIn',
  referral: 'A referral or someone I know',
  search: 'Search',
  'build-log': 'A Jigg.AI build log',
  social: 'Social media (X, YouTube)',
  other: 'Other',
};

const log = (evt, data = {}) => console.log(JSON.stringify({ evt, ...data }));
const domainOf = (email) => String(email).split('@')[1] || '';
// Single-line, trimmed, length-capped. Subjects and log fields must never carry a
// newline from user input.
const oneLine = (v, max) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);
// Attribution tags from the page: short tokens only.
const tag = (v) => (/^[\w.\-]{1,80}$/.test(String(v ?? '')) ? String(v) : '');

export default async (req, context) => {
  // 1. Method
  if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);

  const wantsJson = (req.headers.get('accept') || '').includes('application/json');
  const reply = (data, status, redirectTo) => (wantsJson ? json(data, status) : redirect(redirectTo));

  const resendKey = process.env.RESEND_API_KEY;
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (!resendKey || !turnstileSecret) {
    console.error('contact: RESEND_API_KEY or TURNSTILE_SECRET_KEY is not set');
    return reply({ ok: false, error: 'server_not_configured' }, 500, '/contact?error=failed');
  }
  const deployContext = deployContextOf(context);
  // Cloudflare's test secrets pass dummy tokens predictably, so they must never run
  // in production. Fail closed rather than quietly skipping the hostname check.
  if (deployContext === 'production' && isTestSecret(turnstileSecret)) {
    console.error('contact: a Turnstile TEST secret is configured in production');
    log('config_error', { form: 'contact', reason: 'test_turnstile_secret_in_production' });
    return reply({ ok: false, error: 'server_not_configured' }, 500, '/contact?error=failed');
  }

  // 2. Origin / Referer — catches lazy bots; absent headers pass (see subscribe.mjs).
  const origin = req.headers.get('origin') || req.headers.get('referer') || '';
  if (origin) {
    let host = '';
    try {
      host = new URL(origin).hostname;
    } catch {
      host = '';
    }
    if (!host || !isAllowedHost(host)) {
      log('contact_rejected', { reason: 'bad_origin', host: host || null });
      return reply({ ok: false, error: 'bad_origin' }, 403, '/contact?error=failed');
    }
  }

  let body = {};
  try {
    const ctype = req.headers.get('content-type') || '';
    body = ctype.includes('application/json')
      ? await req.json()
      : Object.fromEntries((await req.formData()).entries());
  } catch {
    body = {};
  }

  const name = oneLine(body.name, LIMITS.name + 1);
  const email = String(body.email ?? '').trim().toLowerCase();
  const organization = oneLine(body.organization, LIMITS.organization + 1);
  const message = String(body.message ?? '').replace(/\r\n/g, '\n').trim();
  const source = Object.hasOwn(SOURCES, body.source) ? body.source : body.source ? 'other' : '';
  const attribution = {
    ref_host: tag(body.ref_host),
    utm_source: tag(body.utm_source),
    utm_medium: tag(body.utm_medium),
    utm_campaign: tag(body.utm_campaign),
  };
  const domain = domainOf(email);

  // 3. Honeypot: answer with the ordinary success shape and send nothing.
  if (String(body.contact_reason ?? '').trim() !== '') {
    log('honeypot_trip', { form: 'contact', domain });
    return reply({ ok: true }, 200, '/contact/sent');
  }

  // 4. Validation — server-side; the form's own checks are a courtesy, not a control.
  let rejection = '';
  if (!name || name.length > LIMITS.name) rejection = 'invalid_name';
  else if (!EMAIL_RE.test(email) || email.length > LIMITS.email) rejection = 'invalid_email';
  else if (BLOCKED_DOMAINS.has(domain)) rejection = 'blocked_domain';
  else if (organization.length > LIMITS.organization) rejection = 'invalid_organization';
  else if (message.length < LIMITS.messageMin) rejection = 'message_too_short';
  else if (message.length > LIMITS.messageMax) rejection = 'message_too_long';
  else if ((message.match(/https?:\/\//gi) || []).length > MAX_LINKS) rejection = 'too_many_links';
  if (rejection) {
    log('contact_rejected', { reason: rejection, domain: domain || null });
    return reply({ ok: false, error: rejection }, 422, `/contact?error=${rejection}`);
  }

  // Only the Netlify-set header is trusted; x-forwarded-for is client-supplied.
  const clientIp = req.headers.get('x-nf-client-connection-ip') || undefined;

  // 5. Turnstile — the first network call. Token-less posts are rejected outright.
  const token = String(body['cf-turnstile-response'] ?? '');
  if (!token) {
    log('turnstile_fail', { form: 'contact', reason: 'missing_token', domain });
    return reply({ ok: false, error: 'turnstile_missing' }, 403, '/contact?error=turnstile');
  }
  try {
    const verifyBody = new URLSearchParams({ secret: turnstileSecret, response: token });
    if (clientIp) verifyBody.set('remoteip', clientIp);
    const verifyRes = await fetch(TURNSTILE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: verifyBody.toString(),
    });
    const verify = await verifyRes.json().catch(() => ({}));
    if (!verify.success) {
      const codes = verify['error-codes'] || [];
      const expired = codes.includes('timeout-or-duplicate');
      log('turnstile_fail', { form: 'contact', reason: expired ? 'expired_or_replayed' : 'rejected', codes, domain });
      return reply(
        { ok: false, error: expired ? 'turnstile_expired' : 'turnstile_failed' },
        403,
        '/contact?error=turnstile'
      );
    }
    // A valid token must also have been solved on one of our own hosts.
    if (!isTestSecret(turnstileSecret) && !isAllowedHost(String(verify.hostname || ''))) {
      log('turnstile_fail', { form: 'contact', reason: 'hostname_mismatch', hostname: verify.hostname || null, domain });
      return reply({ ok: false, error: 'turnstile_failed' }, 403, '/contact?error=turnstile');
    }
  } catch (err) {
    // Fail closed, as subscribe.mjs does.
    console.error('contact: Turnstile siteverify unreachable', err);
    log('turnstile_fail', { form: 'contact', reason: 'siteverify_unreachable', domain });
    return reply({ ok: false, error: 'turnstile_unavailable' }, 503, '/contact?error=turnstile');
  }

  // 6. Deliver. Preview and branch deploys mark the subject, so a test inquiry can
  // never be mistaken for a real one in the inbox.
  const prefix = deployContext === 'production' ? '' : `[${deployContext}] `;
  const subject = `${prefix}Project inquiry from ${name}${organization ? ` (${organization})` : ''}`;
  const lines = [
    'New project inquiry from jigg.ai/contact',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Organization: ${organization || '(not given)'}`,
    `How they found Jigg.AI: ${source ? SOURCES[source] : '(not answered)'}`,
    `Referrer: ${attribution.ref_host || '(none recorded)'}`,
    ...(attribution.utm_source
      ? [`Campaign: ${[attribution.utm_source, attribution.utm_medium, attribution.utm_campaign].filter(Boolean).join(' / ')}`]
      : []),
    '',
    'Message:',
    message,
    '',
    '— Reply to this email to answer them directly.',
  ];

  let res, resBody;
  try {
    res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || 'Jigg.AI inquiries <inquiries@jigg.ai>',
        to: [process.env.CONTACT_TO || 'hello@jigg.ai'],
        reply_to: email,
        subject,
        text: lines.join('\n'),
      }),
    });
    resBody = await res.json().catch(() => ({}));
  } catch (err) {
    console.error('contact: Resend unreachable', err);
    log('contact_failed', { reason: 'upstream_unreachable', source: source || null });
    return reply({ ok: false, error: 'upstream_unreachable' }, 502, '/contact?error=failed');
  }

  if (!res.ok) {
    // Detail goes to the server log only; the visitor gets a generic error plus
    // the direct address to write to instead.
    console.error('contact: Resend send failed', res.status, resBody);
    log('contact_failed', { reason: 'upstream_error', upstreamStatus: res.status, source: source || null });
    return reply({ ok: false, error: 'send_failed' }, 502, '/contact?error=failed');
  }

  // Resend ACCEPTED the message; that is not proof it was delivered. Delivery and
  // bounces are separate Resend events, not wired up yet (BACKLOG).
  log('contact_sent', { source: source || null, ...attribution, domain, context: deployContext });
  return reply({ ok: true }, 200, '/contact/sent');
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

const redirect = (location) => new Response(null, { status: 303, headers: { location } });

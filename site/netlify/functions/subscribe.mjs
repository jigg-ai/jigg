// Server-side subscribe proxy (Netlify Function).
//
// Why this exists: the browser cannot reliably subscribe to Buttondown directly.
// A cross-origin `fetch` is CORS-blocked; a cross-site hidden-iframe form submit
// gets eaten by browser tracking protection (Safari/Brave/Firefox); and the
// anonymous embed endpoint rate-limits. So the form posts here, same-origin, and
// we call Buttondown's authenticated API server-side — real success/error states.
//
// One gotcha lives in Buttondown, not here: its Firewall (Settings → Firewall)
// audits the *connection* IP, which for this proxy is always Netlify's datacenter
// and so gets false-flagged. That's fixed by disabling "IP address auditing" +
// "Attack mode" there; double opt-in is the real spam gate. We still forward the
// visitor's real IP as `ip_address` so any future auditing judges them, not us.
//
// Key lives only in the BUTTONDOWN_API_KEY env var, never in the repo.

const API_URL = 'https://api.buttondown.com/v1/subscribers';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async (req) => {
  if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);

  const key = process.env.BUTTONDOWN_API_KEY;
  if (!key) {
    console.error('BUTTONDOWN_API_KEY is not set');
    return json({ ok: false, error: 'server_not_configured' }, 500);
  }

  // Accept our fetch (JSON) and the no-JS form navigation (urlencoded) alike.
  const ctype = req.headers.get('content-type') || '';
  let email = '';
  try {
    if (ctype.includes('application/json')) email = (await req.json()).email || '';
    else email = (await req.formData()).get('email') || '';
  } catch {
    email = '';
  }
  email = String(email).trim().toLowerCase();

  // No-JS clients get redirects; our fetch (Accept: application/json) gets JSON.
  const wantsJson = (req.headers.get('accept') || '').includes('application/json');
  const reply = (data, status, redirectTo) =>
    wantsJson ? json(data, status) : redirect(redirectTo);

  if (!EMAIL_RE.test(email)) {
    return reply({ ok: false, error: 'invalid_email' }, 422, '/subscribe?error=invalid');
  }

  // Forward the real visitor IP so Buttondown records/audits the subscriber, not us.
  const clientIp =
    req.headers.get('x-nf-client-connection-ip') ||
    (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
    undefined;

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
    return reply({ ok: false, error: 'upstream_unreachable' }, 502, '/subscribe?error=network');
  }

  // 200/201 → created; Buttondown sends the double opt-in confirmation email.
  if (bdRes.ok) return reply({ ok: true, status: 'subscribed' }, 200, '/subscribed');

  // Duplicate: Buttondown returns 400 with a collision code (wording varies by
  // API version, so match loosely). Treat as a soft success — they're on the list.
  if (bdRes.status === 400 && /exist|already|conflict/i.test(JSON.stringify(bdBody || ''))) {
    return reply({ ok: true, status: 'already' }, 200, '/subscribed');
  }

  // Full detail is logged server-side (Netlify function logs); the client only
  // gets a generic error so we don't leak Buttondown's internals.
  console.error('Buttondown subscribe failed', bdRes.status, bdBody);
  return reply({ ok: false, error: 'subscribe_failed' }, 502, '/subscribe?error=failed');
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

const redirect = (location) => new Response(null, { status: 303, headers: { location } });

// Server-side subscribe proxy (Netlify Function).
//
// Why this exists: the browser cannot reliably subscribe to Buttondown directly.
// A cross-origin `fetch` is CORS-blocked; a cross-site hidden-iframe form submit
// gets eaten by browser tracking protection (Safari/Brave/Firefox); and the
// anonymous embed endpoint rate-limits. So the form posts here, same-origin, and
// we call Buttondown's *authenticated* API server-side.
//
// NOTE: currently in DIAGNOSTIC mode to pin Buttondown's spam-firewall behaviour
// (it 400s requests from Netlify's datacenter egress IP). Responses carry a
// temporary `_debug` block, and an `ip_address` in the POST body overrides the
// header-derived IP so we can test whether the firewall honours a provided IP.
// Both are removed once the real fix is confirmed.
//
// Key lives only in the BUTTONDOWN_API_KEY env var.

const API_URL = 'https://api.buttondown.com/v1/subscribers';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async (req) => {
  if (req.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405);

  const key = process.env.BUTTONDOWN_API_KEY;
  if (!key) {
    console.error('BUTTONDOWN_API_KEY is not set');
    return json({ ok: false, error: 'server_not_configured' }, 500);
  }

  const ctype = req.headers.get('content-type') || '';
  let email = '';
  let bodyIp = ''; // TEMP: test override
  try {
    if (ctype.includes('application/json')) {
      const b = await req.json();
      email = b.email || '';
      bodyIp = b.ip_address || '';
    } else {
      email = (await req.formData()).get('email') || '';
    }
  } catch {
    email = '';
  }
  email = String(email).trim().toLowerCase();

  const wantsJson = (req.headers.get('accept') || '').includes('application/json');
  const reply = (data, status, redirectTo) =>
    wantsJson ? json(data, status) : redirect(redirectTo);

  if (!EMAIL_RE.test(email)) {
    return reply({ ok: false, error: 'invalid_email' }, 422, '/subscribe?error=invalid');
  }

  const nfIp = req.headers.get('x-nf-client-connection-ip') || '';
  const xff = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim();
  const clientIp = bodyIp || nfIp || xff || undefined; // bodyIp is the TEMP override

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

  // TEMP diagnostic echoed on every response.
  const _debug = {
    sentIp: clientIp || null,
    nfIp: nfIp || null,
    xff: xff || null,
    upstreamStatus: bdRes.status,
    upstreamDetail: String((bdBody && (bdBody.detail || bdBody.code)) || JSON.stringify(bdBody || {})).slice(0, 300),
  };

  if (bdRes.ok) return reply({ ok: true, status: 'subscribed', _debug }, 200, '/subscribed');

  if (bdRes.status === 400 && /exist|already|conflict/i.test(JSON.stringify(bdBody || ''))) {
    return reply({ ok: true, status: 'already', _debug }, 200, '/subscribed');
  }

  console.error('Buttondown subscribe failed', bdRes.status, bdBody);
  return reply({ ok: false, error: 'subscribe_failed', _debug }, 502, '/subscribe?error=failed');
};

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

const redirect = (location) => new Response(null, { status: 303, headers: { location } });

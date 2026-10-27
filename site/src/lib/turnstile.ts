// Cloudflare Turnstile sitekey, resolved once at build time for every form that
// posts to one of our functions (EmailCapture, ContactForm).
//
// Public by design — this is rendered into the HTML. It must be the sitekey that
// PAIRS with the context's TURNSTILE_SECRET_KEY: real keys reject Cloudflare's
// dummy token and test keys reject real ones, so previews use the test pair.
// Fail the build on Netlify if it's missing rather than silently shipping a
// broken widget; locally, fall back to the test key so `npm run build` still runs.
const TEST_SITEKEY = '1x00000000000000000000AA';
const configuredSitekey =
  import.meta.env.PUBLIC_TURNSTILE_SITEKEY || process.env.PUBLIC_TURNSTILE_SITEKEY || '';
if (!configuredSitekey && process.env.NETLIFY) {
  throw new Error(
    'PUBLIC_TURNSTILE_SITEKEY is not set. Set it in Netlify with the Builds scope ' +
      '(production: the real sitekey; preview/branch/local: 1x00000000000000000000AA).'
  );
}
export const SITEKEY = configuredSitekey || TEST_SITEKEY;

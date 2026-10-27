// Browser-side Turnstile helpers shared by the forms that post to our functions
// (EmailCapture, ContactForm). Imported from their <script> tags, so this runs in
// the browser, never at build time.

/** Load the Turnstile script once per page, however many forms render. */
export function loadTurnstile(): void {
  if (document.querySelector('script[data-turnstile]')) return;
  const s = document.createElement('script');
  s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
  s.async = true;
  s.defer = true;
  s.dataset.turnstile = '';
  document.head.appendChild(s);
}

/**
 * Is a challenge on screen, waiting for the visitor to complete it?
 *
 * Read from the container's height, not its children. In interaction-only mode
 * Turnstile inserts its wrapper as soon as the script loads, so the container has
 * a child even while the invisible check is still running and nothing is visible;
 * it only gains height when a challenge appears (0px → ~72px, measured with the
 * forced-challenge test sitekey).
 */
export const challengeVisible = (widget: HTMLElement | null): boolean =>
  !!widget && widget.offsetHeight > 0;

/**
 * Turnstile tokens are single-use: once a submission consumes one, a retry needs a
 * fresh token or it fails as `timeout-or-duplicate`, so most error paths reset the
 * widget.
 *
 * `turnstile_missing` is the exception, and getting it wrong is user-visible. No
 * token was issued, so there is nothing to invalidate — and a visible widget means
 * Cloudflare escalated to a challenge the visitor still has to complete. Resetting
 * it there destroys the challenge they were about to click and sends them round the
 * same loop. Observed in production from a VPN: the challenge appeared, submitting
 * without it showed "wait a moment", and the reset made the challenge vanish.
 *
 * So on a missing token this leaves the widget alone and, when a challenge is
 * showing, scrolls it into view (it can sit below the fold on a long page).
 * Returns whether a challenge is waiting, so the caller can pick its message.
 */
export function handleTurnstileError(widget: HTMLElement | null, code: string): boolean {
  const awaitingInteraction = challengeVisible(widget);
  if (code === 'turnstile_missing') {
    if (awaitingInteraction) widget!.scrollIntoView({ block: 'center', behavior: 'smooth' });
    return awaitingInteraction;
  }
  const ts = (window as any).turnstile;
  if (ts && widget) ts.reset(widget);
  return awaitingInteraction;
}

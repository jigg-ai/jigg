# Deploy notes — Netlify, custom domain, and the auth chain

## Netlify config

The site lives in `site/`, not the repo root, which is the only non-obvious part:
`publish` is resolved **relative to `base`**, so it's `dist`, not `site/dist`.

```toml
[build]
  base = "site"
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "22"
```

Astro static output — no adapter needed. Verified live: custom domain on Netlify with
HTTPS via Let's Encrypt covering apex + www (`../test.md`, check 2).

## Lighthouse on every deploy

Added after the build-#1 audit found check #7 had never been run:

```toml
[[plugins]]
  package = "@netlify/plugin-lighthouse"
  [plugins.inputs]
    output_path = "reports/lighthouse.html"
  [[plugins.inputs.audits]]
    path = "/"
```

Deliberately **no failing thresholds** until a baseline exists — a threshold guessed
before the first measurement either breaks deploys for no reason or passes vacuously.
Set them just under the real baseline afterwards so genuine regressions break the build.

Caveat worth keeping: a Lighthouse accessibility score is an automated subset, **not a
formal audit**. Don't let a green number upgrade an accessibility claim to a full pass.

## robots.txt

The site shipped without one — `/robots.txt` returned a 404, so no crawler had a
`Sitemap:` pointer. Found while debugging build #2's chatbot knowledge base. Now at
`site/public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://jigg.ai/sitemap-index.xml
```

Matters beyond SEO, and more than it first appeared: this turned out to be the root cause
of build #2's chatbot only knowing a quarter of the site. **Botpress finds your sitemap
via `robots.txt` and ignores the `<link rel="sitemap">` in your HTML** — which this site
had carried since day one. With the file absent its crawl reached 2 pages; with it, 11.
Any AI crawler looking to cite this site was in exactly the same position.

## The Git/GitHub auth chain — four mistakes, all mine

This is where the build actually lost time. None of it was Astro, Netlify, GitHub or
Claude Code failing; all four were local configuration.

1. **Pushed over HTTPS with an account password.** GitHub retired that path for Git
   operations years ago — it needs a token or an SSH key. Dead on arrival.
2. **Registered the SSH key as a repo deploy key.** Deploy keys default to *read-only*, so
   the handshake succeeded and the push was still denied. Recreating the repo didn't help;
   the problem was never the repo, it was the key's scope.
3. **Wrong Git identity.** The first commit landed under a leftover global `user.email`
   from an unrelated project.
4. **Two keys loaded in the agent.** `ssh-add -l` showed the old and new keys both
   present, so which one GitHub accepted was ambiguous — it kept authenticating through
   the stale read-only entry.

### The fix

```bash
# repo-local identity, so a global leftover can't leak into commits
git config --local user.name "Your Name"
git config --local user.email "you@example.com"

# one account-level SSH key (NOT a repo deploy key — no read/write toggle to fight)
ssh-add -D                      # clear the agent
ssh-add ~/.ssh/your_key         # load exactly one
ssh-add -l                      # confirm: one key, the right one
ssh -T git@github.com           # confirm which account you authenticate as
```

**The generalisable lesson:** when auth misbehaves, reset the *config*, not the repo.
Deleting and recreating the repository was wasted effort three times over — the state
that was wrong lived on the local machine, not on GitHub.

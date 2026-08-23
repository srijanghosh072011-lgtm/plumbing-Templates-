# Moving the demo off the github.io URL

The current URL contains the word "Templates", which reads badly beside a
pitch that says you built the client a homepage. Fixing that is a DNS and
settings change, not a code change — the build already handles both cases.

## What is and is not possible

**`demo.ghoshdesigns.ca` — works with GitHub Pages.** One CNAME record, one
committed file. Ten minutes, no other infrastructure.

**`ghoshdesigns.ca/demo` — does NOT work with GitHub Pages alone.** A Pages
site owns a whole hostname, not a path beneath one. For a path to work,
whatever serves `ghoshdesigns.ca` has to route `/demo` to this build, which
means one of:

| If `ghoshdesigns.ca` is on… | How to get `/demo` |
|---|---|
| Vercel / Netlify | Add a rewrite or proxy rule for `/demo/*` → this site |
| Cloudflare (any origin) | A Worker or Redirect Rule proxying `/demo/*` |
| GitHub Pages itself | Put this build in a `demo/` folder of that repo instead |
| Anything else | A reverse proxy rule on that server |

A subdomain avoids all of it. `demo.ghoshdesigns.ca` also reads perfectly
well in a pitch, and it keeps the demo's traffic, analytics and any future
mistakes off the main marketing domain.

## Setting up a subdomain

1. **DNS** at your registrar, on `ghoshdesigns.ca`:

   ```
   Type: CNAME
   Name: demo
   Value: srijanghosh072011-lgtm.github.io
   ```

2. **Commit the domain** so the build knows to drop its basePath:

   ```bash
   echo "demo.ghoshdesigns.ca" > templates/regina-plumbing/public/CNAME
   ```

   The deploy workflow checks for this file. Present → `basePath` empty,
   correct for a domain root. Absent → `basePath` is the repo name, correct
   for `github.io/<repo>/`. Nothing else to change.

3. **Point `siteUrl` at it** in `lib/client.config.ts`. Canonicals, the
   sitemap and Open Graph tags all derive from that one value, so a stale
   entry means every canonical on the site points at the old URL.

4. **GitHub → Settings → Pages**, set Custom domain to
   `demo.ghoshdesigns.ca` and wait for the DNS check, then tick **Enforce
   HTTPS**. The certificate can take up to an hour.

## After it is live

- Re-run `npm run qa` — canonicals and the sitemap should show the new host.
- Submit the new domain in Search Console; the old URL was never indexed
  under a real name, so nothing needs redirecting.
- If you later move the demo again, only steps 2 and 3 change.

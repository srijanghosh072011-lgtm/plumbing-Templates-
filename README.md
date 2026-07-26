# Plumbing / Home-Service Site Template

A config-driven, security-hardened, SEO/AEO-optimised static site for plumbing and
home-service trades. Swap one JSON file and one CSS variable set to produce a new
client site.

**25 pages · 0 runtime dependencies · 13.2 KB CSS + 2.9 KB JS gzip · 170/170 browser
checks · 33/33 contrast pairs · 0 npm vulnerabilities**

---

## Quick start

```bash
npm install
npm run build     # render HTML, compile CSS, generate deploy configs
npm run dev       # build + preview at localhost:4321 WITH production headers
npm run qa        # drive real Chromium: CSP, a11y, responsive, conversion paths
```

> The preview server applies the **real** production security headers. A CSP that is
> only ever configured at the host is a CSP nobody tests until launch day.

---

## Making a new client site

Everything on the site derives from `site.config.json`. There is no second place to edit.

1. **Replace `site.config.json`** — brand, NAP, hours, credentials, services (with
   prices and FAQs), service areas, testimonials, posts, socials, SEO. Set
   `__demo` to `false`.
2. **Replace the images.** 23 generated placeholder panels live in
   `src/assets/img/`; `art.manifest.json` lists each one's intended subject and
   recommended resolution.
3. **Point the contact form at a real handler** (`src/pages/contact.js` → `action`).
4. **Pick a theme** — `"theme"` in the config: `forest-lime`, `midnight-copper`,
   or `blueprint-steel`.
5. **Run the gate:** `npm run preflight`. It must exit 0 before cutover.

Follow [`CHECKLIST.md`](./CHECKLIST.md) for the full pre-launch process.

---

## The launch gate

`npm run preflight` = build → launch verification → contrast audit.

It **hard-fails** on: `__demo` still true · lorem ipsum · the `.example` demo domain ·
555-01XX phone numbers · `example@` addresses · "123 Main St" · staging hostnames ·
the placeholder licence number · `href="#"` · an unrouted form action · leftover
placeholder images · accidental `noindex` · `Disallow: /` · broken internal links ·
missing alt text · duplicate titles or descriptions · missing canonicals · multiple
H1s · insecure `http://` assets · invalid JSON-LD · contrast regressions.

This is deliberate. "Remember to replace the placeholder content" is the most
reliably forgotten step in web delivery, and leftover staging `noindex` is the most
expensive. A checklist item you can tick without doing is not a control.

**It currently fails, by design** — the demo data is still in place. That is the
control working, not a bug.

---

## Safety of the demo data

The demo brand is fictional and deliberately inert:

- The domain uses **`.example`**, an IANA-reserved TLD (RFC 2606) that can never be
  registered by anyone.
- Phone numbers use the **555-01XX** reserved fictional range, which never routes to
  a real line.

So the template can be run, screenshotted and demoed without ever pointing at a real
person's phone or a domain someone owns — and the gate refuses to let either reach
production.

---

## Architecture

```
site.config.json         Single source of truth. Everything derives from here.
src/
  lib/
    layout.js            Page shell — head, SEO meta, OG, schema, nav, footer
    components.js        Reusable UI (cards, buttons, FAQ, answer blocks)
    schema.js            JSON-LD builders
    icons.js             Hand-drawn 1.25-stroke icon set
  pages/*.js             One module per page type
  styles/app.css         Tailwind v4 + design tokens + component layer
  themes/*.css           Three themes. Colour only — no structural difference.
  fonts/                 10 self-hosted woff2 files
  assets/                JS, images, favicon
scripts/
  build.mjs              Renders every page + sitemap, robots, llms.txt, manifest
  verify.mjs             The launch gate
  hash.mjs               Generates all five host configs from one policy
  contrast.mjs           WCAG audit across every theme
  fonts.mjs              Vendors Google Fonts locally
  art.mjs                Generates placeholder art
  rasterize.mjs          Favicon PNG/ICO (dev-only; output committed)
  serve.mjs              Preview server with production headers
tests/
  qa.mjs                 Browser QA suite
  screenshot.mjs         Reference captures
deploy/
  headers.config.js      SINGLE SOURCE for security headers
  nginx.conf             Generated
```

### Why no framework

The templating engine is **JavaScript template literals** — a native language
feature that already does interpolation, loops and conditionals. Handlebars,
Nunjucks or Eleventy would add a dependency tree and a worse expression language to
solve a problem the language already solves.

Result: **two dev dependencies** (Tailwind CLI and its core), **zero runtime
dependencies**, and nothing to patch at 3am.

### Why static HTML

Pre-rendered HTML is the ideal case for AI retrieval — nothing is gated behind
JavaScript, so ChatGPT, Perplexity, Claude and Google AI Overviews read the complete
page. It is also why the CSP can be this strict: there is no framework runtime
needing `unsafe-eval`.

---

## Security posture

Generated into `vercel.json`, `netlify.toml`, `dist/_headers`, `dist/.htaccess` and
`deploy/nginx.conf` — all five from one source, so they cannot drift apart.

```
Content-Security-Policy: default-src 'self'; base-uri 'none'; object-src 'none';
  frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self';
  img-src 'self' data:; font-src 'self'; connect-src 'self'; manifest-src 'self';
  media-src 'self'; worker-src 'self'; upgrade-insecure-requests
Strict-Transport-Security: max-age=63072000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: <20 features disabled>
Cross-Origin-Opener-Policy / Cross-Origin-Resource-Policy: same-origin
```

**`script-src 'self'` with no `unsafe-inline` and no hashes.** Every inline `style`
attribute and event handler was removed from the templates specifically to make that
possible — `.orb-glow` in `app.css` exists for this reason.

Verified empirically against Chromium: `script-src` is **not** applied to
`<script type="application/ld+json">` — those are data blocks, not script blocks — so
all 62 JSON-LD blocks work without a single hash in the header. `hash.mjs` still
audits for genuinely executable inline scripts and would hash any it found.

`Strict-Transport-Security` deliberately omits `preload`. Submitting to the preload
list is effectively irreversible for months and must not happen until every subdomain
is confirmed HTTPS.

---

## SEO / AEO / GEO

- **Schema:** `Plumber`, `Service`, `FAQPage`, `BreadcrumbList`, `BlogPosting`,
  `WebSite`, `AggregateRating` — 62 JSON-LD blocks. `AggregateRating` is emitted
  **only** on the page that visibly renders reviews, because marking up invisible
  reviews is what triggers a Google manual action.
- **Service-area shape:** `streetAddress` omitted, `areaServed` + `GeoCircle` used —
  correct for a trades business with no walk-in storefront.
- **Answer-first:** every key page opens with a direct, extractable answer in a plain
  paragraph. Generative retrieval weights the opening heavily, and plain paragraphs
  extract more reliably than blockquotes.
- **`robots.txt`:** allow-all, with **retrieval** crawlers (OAI-SearchBot,
  PerplexityBot, Claude-SearchBot) and **training** crawlers (GPTBot, CCBot,
  Google-Extended) in separately labelled groups — so a client can opt out of
  training without losing AI citations.
- **`llms.txt`:** shipped because it is nearly free and useful to agent tooling.
  Evidence for SEO benefit is weak; do not sell it as a citation driver.
- **Location pages** carry genuinely distinct content — housing stock, common
  failure, local climate factor. Cloning a city page and swapping the town name is a
  duplicate-content risk and reads as spam to both Google and AI engines.

---

## Themes

Set `"theme"` in `site.config.json`. All three ship in the same 13 KB stylesheet, so
switching is one attribute.

| Theme | Palette | Display face | Suits |
|---|---|---|---|
| `forest-lime` | Deep pine, acid lime, warm cream | Bricolage Grotesque | Default; reference-matched |
| `midnight-copper` | Near-OLED charcoal, copper | Instrument Serif | Premium / emergency-led |
| `blueprint-steel` | Cool paper, navy, safety orange | Bricolage Grotesque | Commercial / new-build |

Themes change **colour and display face only** — never structure. Run
`npm run contrast` after any colour change; it exits non-zero on a regression.

**Fonts** are self-hosted (10 woff2, latin + latin-ext, variable). All OFL-licensed
and safe to redistribute in client work — deliberately not Inter, Roboto, Arial,
Open Sans or Helvetica.

---

## Commands

| Command | Does |
|---|---|
| `npm run build` | Render HTML, compile CSS, generate deploy configs |
| `npm run dev` | Build + preview with production headers |
| `npm test` | Build + structural verification + contrast |
| `npm run preflight` | **The launch gate.** Build + launch verification + contrast |
| `npm run qa` | Browser QA in real Chromium |
| `npm run contrast` | WCAG audit across all themes |
| `npm run shots` | Reference screenshots |
| `npm run fonts` | Re-vendor fonts (only if changing families) |

`qa`, `shots` and `rasterize` need Playwright: `npm i --no-save playwright`. On a CI
image with a pinned Chromium, set `QA_CHROMIUM=/path/to/chrome`.

---

## Known limitations

- **Images are generated placeholders, not photographs.** Deliberate — shipping fake
  stock photos of plumbers would be worse. Replace all 23 before launch; the gate
  enforces it.
- **The contact form has no backend.** It posts natively and needs pointing at
  Formspree, Netlify Forms, or a serverless function.
- **Legal pages are a strong first pass, not legal advice.** Have a lawyer review
  them.
- **Location page content is a researched skeleton.** It needs the owner's real local
  knowledge to be genuinely first-hand.
- **Browser QA covers Chromium only.** Firefox, Safari and a real mid-range Android
  still need a manual pass.

# Pre-Launch Checklist

Every item from the 2026 Pre-Launch Playbook, mapped to this repository.

**Legend**

| Mark | Meaning |
|---|---|
| **[x] AUTO** | Built in and enforced by code. `npm run preflight` fails if it regresses. |
| **[x] DONE** | Done in the template. Survives a client swap; no per-client action needed. |
| **[ ] CLIENT** | **You must do this per client.** The template cannot do it for you. |
| **[ ] INFRA** | Done at the host / registrar / Google, not in this repo. |
| **n/a** | Does not apply to a static service-area trades site. |

**The gate:** `npm run preflight` = build → launch verification → contrast audit.
It exits non-zero while any blocking item is unresolved. It is currently **failing
by design**, because the demo data is still in place. That is the control working.

---

## 1. Security

| Status | Item | Where |
|---|---|---|
| [ ] INFRA | Valid SSL/TLS certificate + auto-renewal confirmed | Host (Vercel/Netlify/Cloudflare auto-issue) |
| [x] AUTO | Force HTTPS (301 HTTP→HTTPS) | `deploy/` configs + CSP `upgrade-insecure-requests` |
| [x] AUTO | No mixed content | `verify.mjs` errors on any `http://` asset |
| [x] DONE | HSTS, `max-age=63072000; includeSubDomains` | `deploy/headers.config.js` |
| [ ] CLIENT | Add `; preload` to HSTS — **only after every subdomain is confirmed HTTPS** | Deliberately omitted; near-irreversible |
| [x] DONE | CSP with **no `unsafe-inline`, no `unsafe-eval`** | `script-src 'self'` — 0 inline scripts, 0 inline styles |
| [x] DONE | `X-Content-Type-Options: nosniff` | `headers.config.js` |
| [x] DONE | `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` | `headers.config.js` |
| [x] DONE | `Referrer-Policy: strict-origin-when-cross-origin` | `headers.config.js` |
| [x] DONE | `Permissions-Policy` — 20 features disabled | `headers.config.js` |
| [x] DONE | COOP / CORP / `X-Permitted-Cross-Domain-Policies` | Beyond baseline |
| n/a | Strong admin passwords / 2FA / login rate-limit | No CMS, no login, no admin surface |
| n/a | WordPress hardening (XML-RPC, wp-config, file editing) | Not WordPress |
| [x] AUTO | Dependency vulnerability scan | `npm audit` — **0 vulnerabilities**, 2 dev deps, 0 runtime deps |
| [ ] INFRA | WAF / DDoS protection | Cloudflare or host equivalent |
| [x] DONE | Form spam protection | Off-screen honeypot + sub-3s timing check |
| [ ] CLIENT | Add CAPTCHA if honeypot proves insufficient | Turnstile recommended (privacy-friendly, free) |
| [x] DONE | Directory listing disabled, dotfiles denied | `.htaccess` + `nginx.conf` |
| [x] DONE | No secrets in repo | No secrets exist; analytics IDs are public by nature |
| n/a | Database / Supabase RLS | No database |
| [ ] INFRA | Automated backups + a **tested** restore | Git is the backup; verify host rollback works |
| [ ] INFRA | DNSSEC enabled at registrar | One click on Cloudflare |
| [ ] INFRA | **SPF, DKIM, DMARC** (start `p=none` → quarantine → reject) | Effectively mandatory in 2026; form mail lands in spam without it |
| n/a | PCI basics | No payments taken |
| [x] DONE | Not blocking legitimate AI/search crawlers | `robots.txt` allow-all; **verify Cloudflare "Block AI bots" is OFF** |

---

## 2. SEO (traditional)

| Status | Item | Where |
|---|---|---|
| [x] AUTO | XML sitemap, canonical 200-status URLs only | `build.mjs` → `dist/sitemap.xml` (25 URLs) |
| [ ] INFRA | Submit sitemap to Google Search Console + Bing | Day one |
| [x] AUTO | `robots.txt` correct, references sitemap, blocks nothing important | `verify.mjs` errors on `Disallow: /` |
| [x] AUTO | Self-referencing absolute canonical on every page | `verify.mjs` checks presence + absoluteness |
| [x] AUTO | Unique meta title + description per page | `verify.mjs` errors on duplicates, warns on length |
| [x] AUTO | Exactly one H1 per page, logical H2–H6 | `verify.mjs` + `qa.mjs` both enforce |
| [x] AUTO | Descriptive alt text on every image | `verify.mjs` errors on missing `alt` |
| [x] DONE | Internal linking: service ↔ location ↔ home | Service pages link areas; area pages link services |
| [x] DONE | Clean lowercase hyphenated slugs | Driven from config slugs |
| [ ] CLIENT | **301 redirect map** if replacing an existing site | **Highest-risk migration item.** 1:1 mapping, no chains |
| [x] AUTO | No broken internal links | `verify.mjs` resolves every internal href to a built file |
| [x] DONE | Schema: Plumber, Service, FAQPage, BreadcrumbList, BlogPosting, WebSite | `src/lib/schema.js` — 62 JSON-LD blocks |
| [x] DONE | `AggregateRating` **only** where reviews are visible | Structurally enforced — invisible markup risks a manual action |
| [x] DONE | `areaServed` + `GeoCircle`, `streetAddress` omitted | Correct shape for a service-area business |
| [ ] CLIENT | Validate with Rich Results Test after deploying | AI-generated schema must always be tool-verified |
| [x] DONE | Core Web Vitals headroom | 13.2 KB CSS, 2.9 KB JS gzip; no layout-triggering animation |
| [x] AUTO | Mobile-friendly, no horizontal scroll | `qa.mjs` at 375 / 768 / 1440 |
| [x] DONE | No duplicate content across location pages | Each area has unique housing stock, common issue, local factor |
| [x] DONE | Custom 404 that returns a real 404 status | `dist/404.html` + status wired per host |
| n/a | Pagination | Under the threshold where it matters |

---

## 3. GEO / AEO (AI search)

| Status | Item | Where |
|---|---|---|
| [x] DONE | Direct-answer paragraph in the first 150–200 words | `answerBlock()` on home, services, every service, every area, contact, posts |
| [x] DONE | Real Q&A blocks matching how customers actually ask | 6 general + 3 per service + 4 per area + per-post |
| [x] DONE | Pricing and coverage answered high on the page | Every service publishes a real range |
| [x] DONE | Fully server-rendered, nothing gated behind JS | Static HTML; page is complete with JS disabled |
| [x] DONE | `robots.txt` allows AI crawlers | Retrieval bots (OAI-SearchBot, PerplexityBot, Claude-SearchBot) **and** training bots, split into labelled groups |
| [ ] CLIENT | **Verify Cloudflare is not silently blocking AI bots** | Highest-impact GEO error in 2026. Check Security → Bots |
| [x] DONE | FAQPage / Review / LocalBusiness schema for AI parsing | `schema.js` |
| [x] DONE | E-E-A-T signals: named licence, insurance, WCB, real credentials | About page + schema |
| [x] DONE | Freshness signals | `datePublished` / `dateModified` on posts, "Last updated" on legal |
| [x] DONE | `llms.txt` shipped | `build.mjs`. **Do not sell this as a citation driver** — see note below |
| [ ] CLIENT | Baseline AI-citation check across ChatGPT / Perplexity / Gemini | Track 15–25 prompts before launch to have a baseline |

> **On `llms.txt`:** shipped because it is nearly free and useful to IDE/agent tooling.
> The evidence for SEO benefit is weak — major LLM crawlers largely skip it and crawl
> HTML directly, and Google has stated it is not used for AI Overviews. The real GEO
> work here is answer-first structure, schema, crawlability and reviews.

---

## 4. Placeholder / Dummy Content QA

| Status | Item | Enforcement |
|---|---|---|
| [x] AUTO | No lorem ipsum | `verify.mjs --launch` |
| [x] AUTO | No placeholder images | Manifest-driven; all 23 generated panels flagged |
| [x] AUTO | No fake phone numbers | Blocks the 555-01XX reserved range |
| [x] AUTO | No placeholder email / domain | Blocks `.example` and `example@` |
| [x] AUTO | No placeholder address | Blocks "123 Main St" |
| [x] AUTO | No staging hostnames | Blocks `staging.` / `dev.` / `preview.` |
| [x] AUTO | No placeholder licence number | Blocks `SK-PL-000000` |
| [x] AUTO | No `href="#"` dead links | `verify.mjs` + `qa.mjs` |
| [x] AUTO | Form action is not a placeholder | Blocks `#`, empty, and the unrouted default |
| [x] AUTO | No TODO / FIXME left in output | `verify.mjs` warns |
| [x] AUTO | No accidental `noindex` | `verify.mjs` errors |
| [ ] CLIENT | Purge test submissions from the CRM before launch | Keeps lead attribution clean |
| [ ] CLIENT | Replace all 23 placeholder images with **real job and team photos** | Also a GBP and AI trust signal |

---

## 5. Google & Third-Party Setup

| Status | Item |
|---|---|
| [ ] INFRA | Search Console: verify by DNS TXT, submit sitemap, request indexing on key pages |
| [ ] CLIENT | GA4 or GTM ID into `site.config.json` → tag auto-injects, CSP auto-widens |
| [x] DONE | `phone_call_click`, `email_click`, `form_submit` events wired | GA4 does **not** auto-track `tel:` clicks — these are explicit |
| [ ] INFRA | Mark those as **key events** in GA4, add an internal-IP filter |
| [ ] CLIENT | **Google Business Profile** — the single biggest local ranking lever |
| | · Exact real-world name, **no keyword stuffing** (Google suspends for this) |
| | · One most-specific primary category ("Plumber") — ~32% of local ranking weight |
| | · Service-area setup with address hidden, up to 20 areas |
| | · Real job/team photos, hours + holiday hours, services with written descriptions |
| | · Seed Q&A, post weekly ("What's New" expires after 7 days) |
| | · Link the site with matching NAP + UTM tags |
| [ ] CLIENT | Local Services Ads / **Google Verified** — badges consolidated Oct 20 2025; the up-to-$2,000 money-back guarantee **ended Nov 7 2025**, so the badge no longer carries financial backing |
| [x] DONE | Fonts self-hosted, not CDN-loaded | 10 woff2 files, zero third-party requests |
| [ ] INFRA | Bing Webmaster Tools (also feeds Copilot/ChatGPT results — real GEO value) |
| [ ] INFRA | Uptime monitoring (UptimeRobot) |
| n/a | Merchant Center, Sentry | No commerce; no runtime server to error |

---

## 6. Performance

| Status | Item | Measured |
|---|---|---|
| [x] DONE | CSS / JS minified, unused code stripped | 13.2 KB + 2.9 KB gzip |
| [x] DONE | LCP image preloaded, `fetchpriority=high` | `layout.js` |
| [x] DONE | Below-fold images lazy + async decode | `components.js` |
| [x] AUTO | Explicit width/height on every image (CLS) | `verify.mjs` warns |
| [x] DONE | Fonts: self-hosted, `font-display: swap`, preloaded, latin subset only | Variable fonts — one file replaces ~5 static weights |
| [x] DONE | Immutable caching on assets, revalidate on HTML | `CACHE_RULES` |
| [x] DONE | Animations use only `transform` / `opacity` | Never `top/left/width/height` |
| [x] DONE | `backdrop-blur` only on fixed/sticky elements | Never on scrolling content |
| [x] DONE | `IntersectionObserver`, never a scroll listener | The main INP protection |
| [x] DONE | Zero third-party scripts by default | Top INP killer, simply absent |
| [ ] CLIENT | Re-run PageSpeed Insights against the **real** domain with real images |

---

## 7. Accessibility (WCAG 2.2 AA)

| Status | Item | Enforcement |
|---|---|---|
| [x] AUTO | Contrast ≥ 4.5:1 text / 3:1 UI | `npm run contrast` — **33/33 pairs pass across 3 themes** |
| [x] AUTO | Alt text on every image | `verify.mjs` + `qa.mjs` |
| [x] AUTO | Full keyboard nav, no traps | `qa.mjs` drives the menu, tests Escape + focus return |
| [x] DONE | Visible focus indicators (2.4.7) | 3px accent outline, never removed |
| [x] DONE | Focus not obscured (2.4.11 — new in 2.2) | `scroll-padding-top` clears the sticky nav |
| [x] DONE | Target size ≥ 24×24 (2.5.8) | Minimum 44px on primary actions |
| [x] DONE | No drag-only interactions (2.5.7) | Rails have buttons + keyboard scroll |
| [x] AUTO | Every form field programmatically labelled | `qa.mjs` |
| [x] AUTO | Skip link is the first focusable element | `qa.mjs` |
| [x] DONE | `prefers-reduced-motion` honoured | Content still arrives — instantly |
| [x] DONE | `prefers-reduced-transparency` + `forced-colors` | Beyond AA |
| [x] DONE | Status messages announced | `role="status" aria-live="polite"` |
| [x] DONE | Published accessibility statement | `/accessibility/` |
| [ ] CLIENT | **Manual screen-reader pass** (NVDA+Firefox / VoiceOver+Safari) | Automation catches ~30–57%; this is the rest |

---

## 8. Legal & Compliance (Canada / Saskatchewan)

| Status | Item |
|---|---|
| [x] DONE | PIPEDA-aware privacy policy — purposes, consent, named accountable person, access rights, retention, safeguards, breach reporting |
| [x] DONE | Terms of service |
| [x] DONE | CASL section — express vs implied consent, sender ID, unsubscribe honoured within 10 business days |
| [x] DONE | WCAG 2.2 AA as build standard |
| [ ] CLIENT | **Have a lawyer review all policies.** The drafts are a strong first pass, not legal advice |
| [ ] CLIENT | Cookie consent banner — **only needed once you add analytics.** Non-essential defaults off |
| [ ] CLIENT | Confirm legal entity name in footer and policies |

> **Jurisdiction:** Saskatchewan has no general private-sector privacy law deemed
> substantially similar to PIPEDA, so **federal PIPEDA applies by default**. The
> *Accessible Saskatchewan Act* does **not** yet impose WCAG duties on private
> business — AA is best practice here, not a mandate. Bill C-27/CPPA died on the
> Order Paper in Jan 2025; successor Bill C-36 is only at first reading. **PIPEDA +
> CASL remain the in-force regimes.**

---

## 9. Domain, DNS & Hosting

| Status | Item |
|---|---|
| [ ] INFRA | Domain auto-renew ON, WHOIS privacy enabled |
| [ ] INFRA | DNS records correct (A/AAAA/ALIAS, CNAME, MX, TXT for SPF/DKIM/DMARC + verification) |
| [x] DONE | www vs non-www canonical chosen and 301-enforced | Generated from `seo.siteUrl` into every host config |
| [x] AUTO | **No staging `noindex` / password / disallow survives** | The single most common cause of catastrophic post-launch traffic loss |
| [ ] INFRA | Lower DNS TTL 24–48h before cutover |
| [x] DONE | Custom 404 |
| [x] DONE | Full favicon set — `.ico`, SVG, 180/192/512 PNG, webmanifest |

---

## 10. Cross-Browser / Cross-Device

| Status | Item |
|---|---|
| [x] AUTO | Chromium at 375 / 768 / 1440, no horizontal scroll | `qa.mjs` |
| [x] DONE | iOS Safari guards — `100dvh` not `100vh`, `-webkit-backdrop-filter`, `text-size-adjust` |
| [ ] CLIENT | Spot-check on a **real** device — mid-range Android especially |
| [ ] CLIENT | Firefox + Safari desktop pass |

---

## 11. Functional / Content QA

| Status | Item |
|---|---|
| [x] AUTO | `tel:` links valid E.164 | `qa.mjs` regex-validates every one |
| [x] AUTO | All internal links resolve | `verify.mjs` |
| [x] AUTO | Zero console errors / failed requests | `qa.mjs` |
| [x] DONE | Open Graph + Twitter Card on every page, with dimensions and alt |
| [x] DONE | NAP identical site-wide | Single source in `site.config.json` — cannot drift |
| [ ] CLIENT | **Point the form at a real handler and confirm the email arrives** (check spam) |
| [ ] CLIENT | Verify OG previews in a debugger |
| [ ] CLIENT | Proofread all copy against the client's actual services and prices |
| [ ] CLIENT | NAP must match GBP and citations **exactly** |

---

## 12. Launch Day & Post-Launch

| Status | Item |
|---|---|
| [ ] | `npm run preflight` passes — **blocking** |
| [ ] | DNS cutover in a low-traffic window, rollback documented |
| [ ] | Deploy 301 redirects simultaneously with cutover |
| [ ] | Confirm SSL live sitewide; `curl -I -L` top pages for a single 301 hop → 200 |
| [ ] | Confirm no `noindex`, robots.txt not blocking |
| [ ] | Verify headers at securityheaders.com (target A/A+) |
| [ ] | Request indexing in GSC; submit sitemap |
| [ ] | Confirm GA4 fires in the real-time report |
| [ ] | Confirm Cloudflare is not blocking AI/search crawlers |
| [ ] | Client handoff doc + credentials via password manager, **not email** |
| [ ] | Monitoring cadence: daily week 1 → weekly for 90 days |

**Post-launch thresholds that change your actions**

- Traffic drop **>30% past week 4** → investigate redirects / noindex / canonicals immediately.
  (Expect a temporary 10–25% dip that recovers in 4–12 weeks on any migration.)
- **INP >160ms, LCP >2.0s, or CLS >0.08** at p75 → performance sprint before it becomes a ranking problem.
- Any CWV "poor" in GSC → fix the failing metric specifically: LCP = server/images, INP = JavaScript, CLS = dimensions.

---

## Per-client launch sequence

```bash
# 1. Replace every value, set __demo to false
$EDITOR site.config.json

# 2. Replace all 23 placeholder images with real client photos
#    (see dist/assets/img/art.manifest.json for subject + recommended size)

# 3. Point the contact form at a real handler
$EDITOR src/pages/contact.js     # form action="…"

# 4. Pick a theme
#    forest-lime | midnight-copper | blueprint-steel

# 5. The gate — must exit 0 before cutover
npm run preflight

# 6. Browser QA
npm run dev &   # serves dist/ WITH production security headers
npm run qa
```

# Launch Checklist — regina-plumbing

Clone this file per client. Every item is either **[template]** (already handled
by this codebase), **[you]** (a human must do it), or **[host]** (impossible on
GitHub Pages — see the note at the bottom).

**Stage 1 is a gate: any failure blocks launch.**

---

## 1. Security

| ✓ | Item | Who |
|---|------|-----|
| ☑ | HTTPS enforced | **[template]** GitHub Pages serves HTTPS and redirects; tick "Enforce HTTPS" in Settings → Pages |
| ☑ | No mixed content | **[template]** every asset is same-origin |
| ☐ | HSTS `max-age` ≥ 1yr | **[host]** header-only. GitHub Pages sends its own HSTS on `*.github.io`; a custom domain needs a host that sets headers |
| ◐ | Content-Security-Policy | **[template]** meta CSP in `layout.tsx`; full header set in `next.config.mjs` + `public/_headers`, inactive on Pages |
| ☐ | X-Content-Type-Options / X-Frame-Options / Referrer-Policy / Permissions-Policy | **[host]** written and ready, cannot be sent by Pages |
| ☑ | Form spam protection | **[template]** honeypot + minimum fill time; Turnstile hook marked in `QuoteForm.tsx` |
| ☑ | No secrets committed | **[template]** the only key is the Web3Forms public access key, which is public by design |
| ☑ | Dependency audit | **[you]** run `npm audit`; enable Dependabot on the repo |
| ☐ | DNSSEC | **[you]** enable at the registrar |
| ☐ | SPF, DKIM, DMARC | **[you]** required — form notification emails land in spam without them. Start DMARC at `p=none` |
| ☐ | Verify CDN is not blocking AI/search crawlers | **[you]** if you put Cloudflare in front, check Security → Bots → **Control AI Crawlers is OFF**. This is the single highest-impact GEO error |
| n/a | WordPress hardening, WAF, malware scan, DB, backups | Not applicable — static site, no server, no database. Git history is the backup |

## 2. SEO

| ✓ | Item | Who |
|---|------|-----|
| ☑ | XML sitemap | **[template]** `app/sitemap.ts`, auto-derived from content |
| ☐ | Sitemap submitted to GSC + Bing | **[you]** |
| ☑ | robots.txt, allows CSS/JS, references sitemap | **[template]** `app/robots.ts` |
| ☑ | Self-referencing absolute canonicals | **[template]** every page sets `alternates.canonical` |
| ☑ | Unique title + description per page | **[template]** |
| ☑ | One H1, logical hierarchy | **[template]** |
| ☑ | Descriptive image alt text | **[template]** structure; **[you]** must rewrite alt when you swap the real photos in |
| ☑ | Internal linking service ↔ area ↔ home | **[template]** |
| ☑ | Clean lowercase hyphenated slugs | **[template]** |
| ☑ | Structured data: Plumber, Service, FAQPage, BreadcrumbList | **[template]** `lib/schema.ts` |
| ☐ | Review / AggregateRating schema | **[you]** deliberately emits nothing until real reviews are in `lib/content.ts`. Never mark up invisible or invented reviews |
| ☐ | Validate with Rich Results Test | **[you]** after deploy, per template |
| ☑ | Custom 404, real 404 status | **[template]** `app/not-found.tsx` → `404.html` |
| ☑ | Unique content per location page | **[template]** each area page is genuinely different — keep it that way when adding areas |
| ☐ | 301 redirect map | **[you]** only if replacing an existing site. **Highest-risk migration item.** Pages cannot do server redirects — use Cloudflare or a host that can |
| ☐ | Broken link check | **[you]** crawl with Screaming Frog post-deploy |

## 3. GEO / AEO

| ✓ | Item | Who |
|---|------|-----|
| ☑ | Direct answer in first 150–200 words | **[template]** `answerSentence` on home; `answer` on every service and area page |
| ☑ | Real Q&A FAQ blocks + FAQPage schema | **[template]** |
| ☑ | Pricing ranges near top of service pages | **[template]** — **[you]** must put real numbers in |
| ☑ | Server-side rendered, not JS-gated | **[template]** fully static HTML; verified — copy is present in `view-source` |
| ☑ | robots.txt allows AI crawlers | **[template]** allow-all, retrieval bots named explicitly |
| ☑ | `llms.txt` | **[template]** `public/llms.txt`. Cheap and harmless; do not sell it as a citation driver — the evidence for SEO benefit is weak |
| ☑ | E-E-A-T: licence, insurance, WCB shown | **[template]** — **[you]** fill in real numbers |
| ☑ | "Last reviewed" freshness dates | **[template]** — note it tracks build date, so genuinely re-read pages |
| ☐ | Named author / owner bio | **[you]** `TODO_OWNER_STORY` on `/about` is the highest-value paragraph on the site |
| ☐ | Baseline AI-citation check | **[you]** test 15–25 prompts across ChatGPT / Perplexity / Gemini at launch |

## 4. Placeholder QA

| ✓ | Item | Who |
|---|------|-----|
| ☑ | Automated sweep for lorem ipsum, 555 numbers, `example@`, `href="#"`, TODO_, staging URLs | **[template]** `npm run check`, and the deploy workflow fails on it |
| ☐ | Replace the three hero images + OG image | **[you]** current files literally say "REPLACE" |
| ☐ | Replace favicon set | **[you]** |
| ☐ | Real reviews pasted in unedited | **[you]** |
| ☐ | Correct hours and NAP everywhere | **[template]** structurally guaranteed — everything reads `lib/client.config.ts`. **[you]** fill it in once |
| ☐ | Social links real | **[template]** icons render only once placeholders are replaced |

## 5. Google & third-party

| ✓ | Item | Who |
|---|------|-----|
| ☐ | Search Console verified + sitemap submitted | **[you]** |
| ☑ | GA4 wiring incl. `tel:` click tracking | **[template]** `components/Analytics.tsx` — GA4 does **not** track tel: clicks on its own, and phone calls are most of a plumber's conversions |
| ☐ | Set `gaMeasurementId`, mark key events | **[you]** mark `phone_call_click`, `generate_lead`, `email_click` as key events in GA4 |
| ☐ | Verify events in DebugView | **[you]** before launch |
| ☐ | Google Business Profile claimed + optimised | **[you]** **the single biggest local ranking lever.** Exact real name (no keyword stuffing — Google suspends for this), one specific primary category ("Plumber"), service-area setup with address hidden, real photos, weekly posts |
| ☐ | NAP identical across site + GBP + citations | **[you]** |
| ☐ | Bing Webmaster Tools | **[you]** also feeds Copilot/ChatGPT search |
| ☐ | Web3Forms key set + test submission received | **[you]** check spam folder |
| ☐ | Uptime monitoring | **[you]** UptimeRobot, free |

## 6. Performance

| ✓ | Item | Who |
|---|------|-----|
| ☑ | Fonts self-hosted, subset, `swap`, preloaded | **[template]** 159 kB total, latin only, no third-party font CDN |
| ☑ | Explicit width/height on all images | **[template]** protects CLS |
| ☑ | LCP image `fetchpriority="high"`, rest lazy | **[template]** |
| ☑ | Minimal JS | **[template]** ~110 kB first load; no animation library, no state library |
| ☑ | Animation is transform/opacity only | **[template]** nothing touches layout |
| ☑ | `backdrop-blur` only on fixed elements | **[template]** |
| ☐ | Images converted to real WebP/AVIF at correct size | **[you]** when you swap in real photos. **Static export has no image optimizer** — resize before committing |
| ☐ | PageSpeed Insights ≥ 90 mobile | **[you]** verify post-deploy |

## 7. Accessibility (WCAG 2.2 AA)

| ✓ | Item | Who |
|---|------|-----|
| ☑ | Skip link | **[template]** |
| ☑ | Visible focus, never removed | **[template]** |
| ☑ | Focus not obscured by sticky header (2.4.11) | **[template]** `scroll-padding-top` |
| ☑ | Touch targets ≥ 24×24 (2.5.8) | **[template]** all ≥ 44px |
| ☑ | No drag-only interactions (2.5.7) | **[template]** none exist |
| ☑ | All form fields labelled | **[template]** |
| ☑ | `prefers-reduced-motion` honoured | **[template]** motion fully disabled, not just shortened |
| ☑ | Native HTML over ARIA | **[template]** FAQ uses `<details>`, nav uses real landmarks |
| ☑ | Accessibility statement page | **[template]** — **[you]** fill in `TODO_KNOWN_LIMITATIONS` honestly |
| ☐ | Contrast verified on final palette | **[you]** re-check if you change colours |
| ☐ | Screen reader pass (NVDA / VoiceOver) | **[you]** automated tools catch only ~30–57% |

## 8. Legal (Canada / Saskatchewan)

| ✓ | Item | Who |
|---|------|-----|
| ☑ | PIPEDA-aware privacy policy | **[template]** draft — Saskatchewan has no substantially-similar provincial law, so federal PIPEDA governs |
| ☑ | Named accountable person field | **[template]** required by PIPEDA — `TODO_PRIVACY_OFFICER_NAME` |
| ☑ | Terms of service | **[template]** draft |
| ☑ | Cookie consent, non-essential default OFF | **[template]** Consent Mode v2 starts denied; banner only appears if GA4 is configured |
| ☑ | CASL section | **[template]** in privacy policy. Penalties reach $10M per violation for organisations — if you add a newsletter, express opt-in and a working unsubscribe honoured in 10 business days are mandatory |
| ☑ | WCAG 2.2 AA as build standard | **[template]** best practice; the Accessible Saskatchewan Act does not yet bind private business |
| ☐ | **Lawyer review** | **[you]** these are drafts, not legal advice |
| ☐ | Legal entity name correct in footer + policies | **[you]** |

## 9. Domain, DNS & hosting

| ✓ | Item | Who |
|---|------|-----|
| ☑ | No staging `noindex` / disallow | **[template]** nothing is ever noindexed. **The most common launch killer, designed out** |
| ☑ | Canonicals point at production | **[template]** derived from `siteUrl` |
| ☑ | Full favicon set + webmanifest | **[template]** — **[you]** replace the placeholder art |
| ☐ | Domain auto-renew ON, WHOIS privacy | **[you]** |
| ☐ | Set `siteUrl` to the real domain | **[you]** canonicals, OG tags and sitemap all derive from it |
| ☐ | `BASE_PATH` correct | **[you]** repo name for a project site; empty for a custom domain |
| ☐ | www vs non-www chosen and enforced | **[you]** |
| ☐ | Lower DNS TTL 24–48h before cutover | **[you]** |

## 10. Cross-browser / device

| ☐ | Chrome, Safari, Firefox, Edge desktop | **[you]** |
| ☐ | iOS Safari + Android Chrome, real devices | **[you]** iOS is where layout bugs surface |
| ☐ | 375 / 768 / 1440 breakpoints | **[you]** |
| ☑ | `min-h-dvh` not `100vh` | **[template]** avoids iOS viewport jump |

## 11. Functional QA

| ☐ | Proofread everything | **[you]** |
| ☐ | Submit the form, confirm email arrives | **[you]** **check spam.** Broken notifications = lost leads |
| ☐ | Every `tel:` dials the right number | **[you]** one wrong digit sends every lead nowhere |
| ☐ | All links work | **[you]** |
| ☑ | OG + Twitter Card tags | **[template]** — **[you]** verify previews in a debugger |

## 12. Launch day

| ☐ | Confirm SSL live, no noindex, robots allows crawling | **[you]** |
| ☐ | Request indexing in GSC for home + top pages | **[you]** |
| ☐ | Confirm GA4 firing in real-time report | **[you]** |
| ☐ | Verify Cloudflare is not blocking AI/search crawlers | **[you]** |
| ☐ | Client handoff doc + credentials via password manager, not email | **[you]** |
| ☐ | Monitoring cadence: daily week 1, weekly for 90 days | **[you]** |

---

## What GitHub Pages cannot do

Four playbook items are impossible on Pages, and no amount of code fixes them:

1. **Security response headers** — CSP (with `frame-ancestors`), HSTS, `X-Frame-Options`,
   `Referrer-Policy`, `Permissions-Policy`. A meta-tag CSP ships as partial cover.
2. **Server-side 301 redirects** — matters only for a redesign migration, where it
   matters enormously.
3. **Server-side form handling** — hence Web3Forms.
4. **On-demand image optimization** — resize and encode before committing.

Moving to **Vercel, Netlify or Cloudflare Pages** fixes 1, 2 and 4 with no code
changes: `next.config.mjs` and `public/_headers` already carry the full header set.
That is the recommendation once the site is earning.

# regina-plumbing

A production-ready website template for a Saskatchewan plumbing/home-service
business. Next.js 15, static export, deployable to GitHub Pages from a branch.

Built to the standards in *The Complete 2026 Pre-Launch Website Playbook* —
SEO, GEO/AEO, WCAG 2.2 AA, PIPEDA/CASL, and the security items a static host
can actually honour.

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

## Making it a real client site

**Edit one file: `lib/client.config.ts`.** Name, phone, email, licence
numbers, service radius, domain and Web3Forms key all live there, and every
page and every JSON-LD block reads from it. NAP consistency is structural,
not something you remember to check.

Then:

1. `lib/content.ts` — services, service areas, FAQs, reviews. The prose is
   written for Regina; rewrite it for the real business. **Never clone an
   area page and swap the town name** — duplicate location content is a
   ranking problem, and each area page here is genuinely distinct.
2. `public/images/` — replace the placeholder plates, which currently say
   "REPLACE" across the middle. Resize and encode to WebP **before**
   committing; a static export has no image optimizer.
   - `hero-bg.webp` — the full-bleed hero photograph, 2400×1600 or wider.
     Wants a wide, real, people-at-work shot. The overlay stack is layered
     so even a pure-white image keeps the headline at 12.2:1 contrast, so
     you do not need to pre-darken it or re-test contrast after swapping.
   - `hero-technician.webp`, `hero-waterheater.webp`, `hero-drain.webp` —
     the three collage plates in the intro section below the hero.
3. `public/og.png`, `favicon.ico`, `icon-*.png`, `apple-touch-icon.png`.
4. `public/llms.txt` and `public/site.webmanifest` — both carry `TODO_`s.
5. `app/about/page.tsx` — `TODO_OWNER_STORY`. The highest-value paragraph on
   the site, and the only one that cannot be written by anyone but the owner.

Then run the gate:

```bash
npm run check
```

It fails on lorem ipsum, 555 numbers, `example@` addresses, `href="#"`,
staging URLs and any surviving `TODO_`. The deploy workflow runs it too, so a
site full of placeholders cannot reach production.

### Rendered-page QA

`npm run check` scans source. To assert the same invariants against the
*built* HTML — one H1 per page, title/description within SERP limits,
canonical present, alt text and dimensions on every image, labelled form
fields, no skipped heading levels:

```bash
npm i -D playwright      # not a template dependency; installed on demand
npm run build
npm run serve            # separate terminal
npm run qa
```

Playwright is deliberately kept out of `package.json` so CI installs stay
fast — the deploy workflow does not need a browser.

## Deploying to GitHub Pages

1. Push to `main`. `.github/workflows/deploy-regina-plumbing.yml` builds and
   pushes the export to the `gh-pages` branch.
2. **Settings → Pages** → Source: *Deploy from a branch* → `gh-pages` → `/ (root)`.
3. Tick **Enforce HTTPS**.

`BASE_PATH` is set automatically to the repo name for a project site. For a
custom domain or a `<user>.github.io` repo, set it to an empty string in the
workflow and commit a `CNAME` file.

> **Read [`LAUNCH-CHECKLIST.md`](./LAUNCH-CHECKLIST.md) before going live.** It
> maps all 12 playbook categories to what the template handles, what you must
> do, and the four things GitHub Pages genuinely cannot do.

## Stack

| | |
|---|---|
| Framework | Next.js 15 App Router, `output: 'export'` |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| Fonts | Bricolage Grotesque + Plus Jakarta Sans, self-hosted, latin subset, OFL |
| Forms | Web3Forms (no server), honeypot + timing spam guard |
| Analytics | GA4 with Consent Mode v2, denied by default |
| Dependencies | `next`, `react`, `react-dom`. That is the whole list |

Roughly 110 kB first-load JS. No animation library — the one animation that
needs JS is a 20-line `IntersectionObserver`.

## Design notes

Navy/blue identity carried over from the reference template, rebuilt as a
proper ramp with copper as the accent. Cards use a nested "double bezel"
(outer tray + concentric inner core). CTAs nest their trailing icon in its
own circular well. All motion uses `cubic-bezier(0.32, 0.72, 0, 1)` and only
touches `transform`/`opacity`.

Everything collapses to single-column below 768px, and rotations and
overlaps are removed there — overlapping cards create touch-target conflicts
on a phone.

## Things deliberately not built

- **No CMS.** Content is TypeScript. A CMS for a six-service brochure site is
  a login, a hosting bill and a security surface for something the developer
  edits twice a year. Add one when the client genuinely writes their own posts.
- **No blog.** Ship it when there is something to publish. An empty blog with
  three AI-written posts is worse than none.
- **No `AggregateRating` until real reviews exist.** Marking up invisible or
  invented reviews earns a Google manual action.
- **No cookie banner unless GA4 is configured.** No tracking, no banner.

# Copper & Prairie

A complete, dependency-free static website concept for a Regina plumbing company. Twenty-seven pages include the home page, six service details, eight community pages, three complete journal articles, pricing with a quote-request builder, contact, about, reviews, and privacy.

## Preview and build

Requires Node 20 or newer. No package installation is required.

```sh
npm run build
npm run check
npm run dev
```

The complete website is generated into `dist`. Only that directory belongs on a public web server. The preview server binds to loopback only.

## GitHub Pages

For a repository hosted at `https://ACCOUNT.github.io/REPOSITORY/`, build with `SITE_ORIGIN=https://ACCOUNT.github.io` and `SITE_BASE=/REPOSITORY/`. A subfolder deployment uses a corresponding base such as `/REPOSITORY/copper-prairie/`. Keep trailing slashes. Do not replace another site's deployment workflow without checking what it publishes.

## Business launch

The current site is explicitly a demo. No customer reviews, licenses, founding year, insurance, contact details, response times, or completed jobs are claimed as verified. No requests are submitted or appointments booked. The quote form creates a plain text download using client-side text rendering and does not persist personal data. Pricing is illustrative CAD, not a quote.

Set verified identity and contact details in `site.config.mjs`, replace all demo copy with approved business information, supply real credentials and permitted testimonials, and connect a genuine booking/contact system before a business launch. Remove demo mode only after that work. Business launch also requires updated privacy text and truthful availability/pricing. A completed launch may then switch robots and sitemap indexing on and add verified Plumber data.

Google does not allow a business's self-serving review markup to generate local-business review stars. This project deliberately omits fabricated AggregateRating and Review schema. Source: https://developers.google.com/search/docs/appearance/structured-data/review-snippet

Local pages have individual copy and links. Semantic HTML, descriptions, canonical URLs, sitemap, breadcrumbs, and page schema are generated. Visibility in Google or AI answers is never guaranteed. Demo indexing is intentionally disabled until the real business is supplied.

## Security

No third-party scripts, no dependencies, no network requests from the quote form, no browser storage, no unsanitized HTML from user input, and no secrets in source. A restrictive meta CSP and hosting header rules are included. GitHub Pages does not apply `_headers`; frame protection requires an HTTP-header-capable host. Navigation links use validated configuration. No uploaded security ZIP was available in this task, so its unspecified requirements have not been audited or represented as implemented.

## Images

Two original images were generated using the built-in ImageGen tool. The WebP assets are optimized copies. They represent concept scenes, not real workers or completed projects. Prompts are retained in `IMAGE-PROMPTS.md`.

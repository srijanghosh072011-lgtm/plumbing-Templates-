#!/usr/bin/env node
/**
 * Static build. Reads site.config.json, renders every page, emits SEO/AEO files.
 *
 * ponytail: the "template engine" is JS template literals — a native language
 * feature that already does interpolation, loops and conditionals. Adding
 * Handlebars/Nunjucks/Eleventy here would buy a worse expression language and a
 * dependency tree. The page registry below is the whole routing table.
 */
import { readFile, writeFile, mkdir, rm, cp, readdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { page } from '../src/lib/layout.js';
import * as S from '../src/lib/schema.js';

import home from '../src/pages/home.js';
import { servicesIndex, servicePage } from '../src/pages/services.js';
import { areasIndex, areaPage } from '../src/pages/areas.js';
import about from '../src/pages/about.js';
import contact from '../src/pages/contact.js';
import { blogIndex, blogPost } from '../src/pages/blog.js';
import { privacy, terms, accessibility } from '../src/pages/legal.js';
import notFound from '../src/pages/404.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'src');
const DIST = join(ROOT, 'dist');

const cfg = JSON.parse(await readFile(join(ROOT, 'site.config.json'), 'utf8'));

/**
 * BASE_PATH — preview-only escape hatch for hosts that serve the site from a
 * subpath instead of a domain root (GitHub Pages project sites: /repo-name/).
 *
 * Every internal link in this codebase is deliberately root-relative
 * ("/services/", "/assets/css/site.css") because the real production target
 * is a custom domain at the root, per CHECKLIST.md. Rewriting every call site
 * to be subpath-aware would be the wrong default to carry forward. Instead,
 * when BASE_PATH is set, a single post-process pass prefixes root-relative
 * href/src/action attributes in the emitted HTML. Unset in normal builds —
 * dist/ is byte-identical to before.
 */
const BASE_PATH = (process.env.BASE_PATH ?? '').replace(/\/$/, '');

function applyBasePath(html) {
  if (!BASE_PATH) return html;
  // (?!\/) excludes protocol-relative "//..." URLs; absolute "https://..." URLs
  // never match because they don't start with "/" right after the quote.
  return html.replace(/((?:href|src|action)=")\/(?!\/)/g, `$1${BASE_PATH}/`);
}

/* ------------------------------------------------------------------ registry */

function routes() {
  const base = S.localBusiness(cfg);
  const site = S.website(cfg);
  const crumb = (trail) => S.breadcrumbs(cfg, trail);

  const list = [];

  list.push({
    path: '/',
    ...home.meta?.(cfg),
    title: 'Home',
    description: cfg.seo.defaultDescription,
    body: home(cfg),
    preloadImage: '/assets/img/hero-primary.svg',
    // Ratings are attached HERE and only here: the homepage is the page that
    // actually renders the testimonial section on screen.
    schemas: [S.localBusiness(cfg, { withRatings: true }), site, S.faqPage(cfg, cfg.generalFaqs, '/')],
    changefreq: 'weekly',
    priority: '1.0',
  });

  list.push({
    path: '/services/',
    title: 'Plumbing Services',
    description: `Every plumbing service we offer in ${cfg.contact.addressLocality}, ${cfg.contact.addressRegion} — emergency repair, drains, water heaters, leak detection and sewer work, with pricing up front.`,
    body: servicesIndex(cfg),
    schemas: [base, crumb([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services/' }])],
    changefreq: 'monthly',
    priority: '0.9',
  });

  for (const s of cfg.services) {
    list.push({
      path: `/services/${s.slug}/`,
      title: `${s.seoTitle ?? s.name} in ${cfg.contact.addressLocality}`,
      description: s.answerFirst.slice(0, 158),
      body: servicePage(cfg, s),
      schemas: [
        S.service(cfg, s),
        base,
        S.faqPage(cfg, s.faqs, `/services/${s.slug}/`),
        crumb([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services/' },
          { name: s.name, path: `/services/${s.slug}/` },
        ]),
      ],
      changefreq: 'monthly',
      priority: '0.8',
    });
  }

  list.push({
    path: '/service-areas/',
    title: 'Service Areas',
    description: `${cfg.brand.name} serves ${cfg.areaServed.map((a) => a.name).join(', ')} and communities within ${cfg.contact.serviceRadiusKm} km of ${cfg.contact.addressLocality}.`,
    body: areasIndex(cfg),
    schemas: [base, crumb([{ name: 'Home', path: '/' }, { name: 'Service Areas', path: '/service-areas/' }])],
    changefreq: 'monthly',
    priority: '0.7',
  });

  for (const a of cfg.areaServed) {
    list.push({
      path: `/service-areas/${a.slug}/`,
      title: `Plumber in ${a.name}, ${cfg.contact.addressRegion}`,
      description: `Licensed 24/7 plumbers serving ${a.name}, ${cfg.contact.addressRegion}. ${a.note}`.slice(0, 158),
      body: areaPage(cfg, a),
      schemas: [
        base,
        crumb([
          { name: 'Home', path: '/' },
          { name: 'Service Areas', path: '/service-areas/' },
          { name: a.name, path: `/service-areas/${a.slug}/` },
        ]),
      ],
      changefreq: 'monthly',
      priority: '0.7',
    });
  }

  list.push({
    path: '/about/',
    title: 'About Us',
    description: `${cfg.brand.name} has served ${cfg.contact.addressLocality} since ${cfg.brand.foundingYear}. Licensed journeyperson plumbers, ${cfg.credentials.insuranceLabel} insured, with a two-year workmanship guarantee.`,
    body: about(cfg),
    schemas: [base, crumb([{ name: 'Home', path: '/' }, { name: 'About', path: '/about/' }])],
    changefreq: 'yearly',
    priority: '0.6',
  });

  list.push({
    path: '/contact/',
    title: 'Contact & Booking',
    description: `Book a plumber in ${cfg.contact.addressLocality} or call ${cfg.contact.phoneDisplay} for 24/7 emergency service. Fixed quotes, no overtime surcharge.`,
    body: contact(cfg),
    schemas: [base, S.faqPage(cfg, cfg.generalFaqs.slice(0, 4), '/contact/'), crumb([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact/' }])],
    changefreq: 'yearly',
    priority: '0.9',
  });

  list.push({
    path: '/blog/',
    title: 'Plumbing Guides & Advice',
    description: `Maintenance guides and plumbing advice for ${cfg.contact.addressLocality} homeowners from the ${cfg.brand.name} team.`,
    body: blogIndex(cfg),
    schemas: [base, crumb([{ name: 'Home', path: '/' }, { name: 'Blog', path: '/blog/' }])],
    changefreq: 'weekly',
    priority: '0.6',
  });

  for (const p of cfg.posts) {
    list.push({
      path: `/blog/${p.slug}/`,
      title: p.seoTitle ?? p.title,
      description: p.excerpt.slice(0, 158),
      body: blogPost(cfg, p),
      schemas: [
        S.articlePosting(cfg, p),
        base,
        crumb([
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog/' },
          { name: p.title, path: `/blog/${p.slug}/` },
        ]),
      ],
      changefreq: 'yearly',
      priority: '0.5',
    });
  }

  const legal = [
    { path: '/privacy/', title: 'Privacy Policy', body: privacy(cfg), description: `How ${cfg.brand.name} collects, uses and protects personal information under PIPEDA.` },
    { path: '/terms/', title: 'Terms of Service', body: terms(cfg), description: `The terms governing plumbing services provided by ${cfg.brand.name}.` },
    { path: '/accessibility/', title: 'Accessibility Statement', body: accessibility(cfg), description: `${cfg.brand.name}'s commitment to WCAG 2.2 Level AA accessibility.` },
  ];
  for (const l of legal) {
    list.push({ ...l, schemas: [base], changefreq: 'yearly', priority: '0.3' });
  }

  return list;
}

/* --------------------------------------------------------------------- write */

async function writePage(route) {
  const html = applyBasePath(page(cfg, route));
  const outDir = route.path === '/' ? DIST : join(DIST, route.path);
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'index.html'), html);
}

/* ------------------------------------------------------------ SEO/AEO files */

/** Only canonical, indexable, 200-status URLs belong in a sitemap. */
function sitemap(list) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = list
    .map(
      (r) => `  <url>
    <loc>${new URL(r.path, cfg.seo.siteUrl).href}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/**
 * robots.txt — allow-all posture.
 *
 * Deliberate: for a local marketing site there is no proprietary content to
 * protect, and blocking retrieval crawlers removes the business from AI answers
 * entirely. Note the distinction the playbook draws — GPTBot/CCBot/Google-Extended
 * are TRAINING crawlers, while OAI-SearchBot/ChatGPT-User/PerplexityBot/
 * Claude-SearchBot are RETRIEVAL crawlers that drive citations and referral
 * traffic. Both are allowed here; a client who objects to training use can
 * disallow only the training group without losing citations.
 */
function robots() {
  const retrieval = ['OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot', 'Perplexity-User', 'Claude-SearchBot', 'Claude-User', 'ClaudeBot'];
  const training = ['GPTBot', 'CCBot', 'Google-Extended', 'Applebot-Extended', 'meta-externalagent'];

  return `# ${cfg.brand.name} — robots.txt
# Posture: allow all. Search + AI retrieval crawlers drive discovery and citations.

User-agent: *
Allow: /
Disallow: /thank-you/

# --- AI retrieval crawlers (these produce citations + referral traffic) -------
${retrieval.map((b) => `User-agent: ${b}\nAllow: /\n`).join('')}
# --- AI training crawlers -----------------------------------------------------
# Allowed by default. To opt out of training while KEEPING AI citations,
# change "Allow: /" to "Disallow: /" for this group only.
${training.map((b) => `User-agent: ${b}\nAllow: /\n`).join('')}
Sitemap: ${new URL('/sitemap.xml', cfg.seo.siteUrl).href}
`;
}

/**
 * llms.txt — shipped with clear expectations.
 *
 * The playbook's honest verdict applies: major LLM crawlers largely ignore this
 * file and crawl HTML directly, and Google has stated it is not used for AI
 * Overviews. It costs almost nothing and has genuine value for IDE/agent tooling,
 * so it ships — but it is NOT a citation driver and should not be sold as one.
 */
function llmsTxt(list) {
  const services = cfg.services
    .map((s) => `- [${s.name}](${new URL(`/services/${s.slug}/`, cfg.seo.siteUrl).href}): ${s.short}`)
    .join('\n');
  const areas = cfg.areaServed
    .map((a) => `- [${a.name}](${new URL(`/service-areas/${a.slug}/`, cfg.seo.siteUrl).href}): ${a.note}`)
    .join('\n');

  return `# ${cfg.brand.name}

> ${cfg.brand.description}

- **Location:** ${cfg.contact.addressLocality}, ${cfg.contact.addressRegion}, Canada (service-area business, no walk-in storefront)
- **Phone:** ${cfg.contact.phoneDisplay}
- **Emergency:** ${cfg.hours.emergency24_7 ? '24/7, live dispatcher, no overtime surcharge' : 'Business hours only'}
- **Licensed:** ${cfg.credentials.licenceLabel} · ${cfg.credentials.insuranceLabel}
- **Service radius:** ${cfg.contact.serviceRadiusKm} km from ${cfg.contact.addressLocality}
- **Rating:** ${cfg.reviews.ratingValue}/5 from ${cfg.reviews.reviewCount} reviews

## Services

${services}

## Service Areas

${areas}

## Key Pages

- [Home](${new URL('/', cfg.seo.siteUrl).href})
- [All services](${new URL('/services/', cfg.seo.siteUrl).href})
- [Service areas](${new URL('/service-areas/', cfg.seo.siteUrl).href})
- [About](${new URL('/about/', cfg.seo.siteUrl).href})
- [Contact & booking](${new URL('/contact/', cfg.seo.siteUrl).href})
- [Guides](${new URL('/blog/', cfg.seo.siteUrl).href})

## Notes

Total indexable pages: ${list.length}. Content is fully server-rendered static HTML
with no JavaScript gating. Structured data (${cfg.seo.organizationType}, Service,
FAQPage, BreadcrumbList) is embedded as JSON-LD on every page.
`;
}

function webmanifest() {
  return JSON.stringify(
    {
      name: cfg.brand.name,
      short_name: cfg.brand.shortName,
      description: cfg.brand.description,
      start_url: '/',
      display: 'standalone',
      background_color: '#f6f4ec',
      theme_color: '#123a2e',
      icons: [
        { src: '/assets/img/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        { src: '/assets/img/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/assets/img/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/assets/img/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
    null,
    2
  );
}

/* ---------------------------------------------------------------------- main */

async function copyDir(from, to) {
  await mkdir(to, { recursive: true });
  await cp(from, to, { recursive: true });
}

async function main() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  const list = routes();
  for (const r of list) await writePage(r);

  // 404 is written flat — hosts serve it directly, it is not a routable URL
  await writeFile(
    join(DIST, '404.html'),
    applyBasePath(
      page(cfg, {
        path: '/404.html',
        title: 'Page Not Found',
        description: `That page could not be found. Browse our plumbing services, service areas, or call ${cfg.contact.phoneDisplay} for 24/7 emergency help.`,
        body: notFound(cfg),
        schemas: [],
      }).replace('<meta name="robots" content="index, follow', '<meta name="robots" content="noindex, follow')
    )
  );

  await copyDir(join(SRC, 'assets', 'js'), join(DIST, 'assets', 'js'));
  await copyDir(join(SRC, 'assets', 'img'), join(DIST, 'assets', 'img'));
  await copyDir(join(SRC, 'fonts'), join(DIST, 'assets', 'fonts'));
  // favicon.ico must sit at the document root — browsers request /favicon.ico
  // directly regardless of what <link rel="icon"> says.
  await cp(join(SRC, 'assets', 'favicon.ico'), join(DIST, 'favicon.ico'));

  await writeFile(join(DIST, 'sitemap.xml'), sitemap(list));
  await writeFile(join(DIST, 'robots.txt'), robots());
  await writeFile(join(DIST, 'llms.txt'), llmsTxt(list));
  await writeFile(join(DIST, 'site.webmanifest'), webmanifest());

  console.log(
    `Built ${list.length} pages + 404 -> dist/` +
    (BASE_PATH ? ` (BASE_PATH="${BASE_PATH}" applied for subpath hosting)` : '')
  );
}

main().catch((e) => {
  console.error(`\nBuild failed: ${e.stack}`);
  process.exit(1);
});

import { icon } from './icons.js';
import { jsonLd } from './schema.js';

/** Escape untrusted-ish config values before they enter markup. */
export const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const abs = (cfg, path = '/') => new URL(path, cfg.seo.siteUrl).href;

const NAV = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about/' },
  { label: 'Services', path: '/services/' },
  { label: 'Service Areas', path: '/service-areas/' },
  { label: 'Contact', path: '/contact/' },
];

/* ---------------------------------------------------------------- torn seam */

/**
 * The reference site's signature ripped-paper seam.
 * Deterministic per `variant` so the top and bottom of one band never mirror
 * each other, but a rebuild always produces byte-identical output.
 */
export function tornEdge(fill, { position = 'bottom', variant = 0 } = {}) {
  const seams = [
    'M0,26 C60,8 96,40 168,22 C232,6 268,36 340,20 C402,6 448,34 520,20 C588,7 632,36 704,22 C772,9 818,38 890,24 C954,12 1000,38 1072,24 C1128,13 1170,32 1200,26 L1200,60 L0,60 Z',
    'M0,20 C72,36 108,6 180,24 C244,40 286,10 358,26 C420,40 464,8 536,24 C602,39 650,10 722,26 C788,41 834,12 906,26 C968,38 1014,10 1086,24 C1140,35 1176,16 1200,22 L1200,60 L0,60 Z',
    'M0,30 C56,14 104,34 176,18 C240,4 280,32 352,18 C416,5 460,30 532,16 C598,3 648,32 720,18 C786,5 830,30 902,18 C966,7 1016,32 1088,20 C1142,11 1178,28 1200,24 L1200,60 L0,60 Z',
  ];
  const d = seams[variant % seams.length];
  const flip = position === 'top' ? ' transform="scale(1,-1) translate(0,-60)"' : '';
  return `<div class="torn torn-${position}" aria-hidden="true"><svg viewBox="0 0 1200 60" preserveAspectRatio="none"><path d="${d}" fill="${fill}"${flip}/></svg></div>`;
}

/* -------------------------------------------------------------------- header */

function utilityBar(cfg) {
  const hoursLabel = cfg.hours.emergency24_7
    ? '24/7 Emergency Service'
    : 'Mon–Fri 07:00–18:00';
  return `
  <div class="on-deep bg-deep text-on-deep-muted text-[0.8125rem]">
    <div class="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2.5">
      <div class="flex flex-wrap items-center gap-x-6 gap-y-1">
        <span class="inline-flex items-center gap-2">${icon('mapPin', { size: 15 })}<span>${esc(cfg.contact.addressLocality)}, ${esc(cfg.contact.addressRegion)} &amp; surrounding areas</span></span>
        <span class="hidden items-center gap-2 sm:inline-flex">${icon('clock', { size: 15 })}<span>${esc(hoursLabel)}</span></span>
      </div>
      <div class="flex items-center gap-4">
        <a class="inline-flex items-center gap-2 font-semibold text-on-deep transition-colors duration-300 hover:text-accent" href="tel:${esc(cfg.contact.phoneE164)}" data-track="phone_call_click" data-location="utility_bar">
          ${icon('phone', { size: 15 })}<span>${esc(cfg.contact.phoneDisplay)}</span>
        </a>
      </div>
    </div>
  </div>`;
}

function floatingNav(cfg, currentPath) {
  const links = NAV.map(
    (n) =>
      `<a class="nav-link" href="${esc(n.path)}"${n.path === currentPath ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`
  ).join('');

  // Stagger delays come from :nth-child in app.css, not inline style attributes
  const sheetLinks = NAV.map(
    (n) => `<a href="${esc(n.path)}"${n.path === currentPath ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`
  ).join('');

  return `
  <nav class="nav-float on-deep" aria-label="Primary">
    <div class="flex items-center justify-between gap-3 py-2 pl-4 pr-2 md:pl-5">
      <a class="flex shrink-0 items-center gap-2.5 text-on-deep" href="/" aria-label="${esc(cfg.brand.name)} — home">
        <span class="grid h-9 w-9 place-items-center rounded-full bg-accent font-display text-lg font-bold text-on-accent" aria-hidden="true">${esc(cfg.brand.logoMark)}</span>
        <span class="font-display text-lg font-bold tracking-tight">${esc(cfg.brand.shortName)}</span>
      </a>

      <div class="hidden items-center gap-0.5 lg:flex">${links}</div>

      <div class="flex items-center gap-2">
        <a class="btn btn-accent hidden sm:inline-flex" href="tel:${esc(cfg.contact.phoneE164)}" data-track="phone_call_click" data-location="nav">
          <span>${esc(cfg.contact.phoneDisplay)}</span>
          <span class="btn-orb" aria-hidden="true">${icon('phone', { size: 14 })}</span>
        </a>
        <button class="grid h-11 w-11 shrink-0 place-items-center gap-[3px] rounded-full text-on-deep transition-colors duration-300 hover:bg-white/10 lg:hidden"
                type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="Open navigation menu">
          <span class="burger-line"></span><span class="burger-line"></span><span class="burger-line"></span>
        </button>
      </div>
    </div>
  </nav>

  <div class="menu-sheet on-deep lg:hidden" id="mobile-menu" data-menu-sheet data-open="false" aria-hidden="true">
    <div class="shell">
      <p class="eyebrow mb-8">Menu</p>
      <div class="flex flex-col">${sheetLinks}</div>
      <div class="mt-10 flex flex-col gap-3 sm:flex-row">
        <a class="btn btn-accent" href="tel:${esc(cfg.contact.phoneE164)}" data-track="phone_call_click" data-location="mobile_menu">
          <span>Call ${esc(cfg.contact.phoneDisplay)}</span><span class="btn-orb" aria-hidden="true">${icon('phone', { size: 14 })}</span>
        </a>
        <a class="btn btn-on-deep" href="/contact/">
          <span>Book Online</span><span class="btn-orb" aria-hidden="true">${icon('arrowUpRight', { size: 14 })}</span>
        </a>
      </div>
    </div>
  </div>`;
}

/* -------------------------------------------------------------------- footer */

function footer(cfg) {
  const year = new Date().getFullYear();

  const socialLinks = Object.entries(cfg.social)
    .filter(([, url]) => Boolean(url))
    .map(([k, url]) => {
      const iconName = { facebook: 'facebook', instagram: 'instagram', linkedin: 'linkedin', googleBusiness: 'google' }[k] ?? 'arrowUpRight';
      const label = { facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn', googleBusiness: 'Google Business Profile' }[k] ?? k;
      return `<a class="grid h-11 w-11 place-items-center rounded-full bg-white/8 text-on-deep shadow-[inset_0_0_0_1px_var(--color-deep-line)] transition-all duration-500 hover:bg-accent hover:text-on-accent" href="${esc(url)}" rel="noopener noreferrer me" target="_blank" aria-label="${esc(cfg.brand.name)} on ${esc(label)}">${icon(iconName, { size: 18 })}</a>`;
    })
    .join('');

  const serviceLinks = cfg.services
    .map((s) => `<li><a class="inline-block py-1 text-on-deep-muted transition-colors duration-300 hover:text-accent" href="/services/${esc(s.slug)}/">${esc(s.name)}</a></li>`)
    .join('');

  const areaLinks = cfg.areaServed
    .map((a) => `<li><a class="inline-block py-1 text-on-deep-muted transition-colors duration-300 hover:text-accent" href="/service-areas/${esc(a.slug)}/">${esc(a.name)}</a></li>`)
    .join('');

  const hoursRows = cfg.hours.regular
    .map((r) => {
      const days = r.days.length > 1 ? `${r.days[0].slice(0, 3)}–${r.days[r.days.length - 1].slice(0, 3)}` : r.days[0].slice(0, 3);
      const time = r.closed ? 'Closed' : `${r.opens} – ${r.closes}`;
      return `<div class="flex items-baseline justify-between gap-4 border-b border-white/8 py-2.5 last:border-0"><dt class="text-on-deep-muted">${esc(days)}</dt><dd class="font-semibold text-on-deep">${esc(time)}</dd></div>`;
    })
    .join('');

  return `
  <footer class="on-deep relative bg-deep text-on-deep" role="contentinfo">
    ${tornEdge('var(--color-canvas)', { position: 'top', variant: 2 })}

    <div class="shell pt-28 pb-10 md:pt-36">
      <div class="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:gap-10">

        <div>
          <a class="mb-5 flex items-center gap-3" href="/" aria-label="${esc(cfg.brand.name)} — home">
            <span class="grid h-11 w-11 place-items-center rounded-full bg-accent font-display text-xl font-bold text-on-accent" aria-hidden="true">${esc(cfg.brand.logoMark)}</span>
            <span class="font-display text-2xl font-bold tracking-tight">${esc(cfg.brand.name)}</span>
          </a>
          <p class="measure-tight mb-6 text-on-deep-muted">${esc(cfg.brand.description)}</p>
          <div class="flex flex-wrap gap-2">${socialLinks}</div>
        </div>

        <nav aria-labelledby="footer-services">
          <h2 class="mb-4 font-display text-lg font-bold" id="footer-services">Services</h2>
          <ul class="space-y-0.5">${serviceLinks}</ul>
        </nav>

        <nav aria-labelledby="footer-areas">
          <h2 class="mb-4 font-display text-lg font-bold" id="footer-areas">Service Areas</h2>
          <ul class="space-y-0.5">${areaLinks}</ul>
        </nav>

        <div>
          <h2 class="mb-4 font-display text-lg font-bold">Get In Touch</h2>
          <ul class="mb-6 space-y-3">
            <li><a class="inline-flex items-start gap-3 text-on-deep transition-colors duration-300 hover:text-accent" href="tel:${esc(cfg.contact.phoneE164)}" data-track="phone_call_click" data-location="footer"><span class="mt-0.5 shrink-0">${icon('phone', { size: 17 })}</span><span class="font-semibold">${esc(cfg.contact.phoneDisplay)}</span></a></li>
            <li><a class="inline-flex items-start gap-3 break-all text-on-deep-muted transition-colors duration-300 hover:text-accent" href="mailto:${esc(cfg.contact.email)}" data-track="email_click"><span class="mt-0.5 shrink-0">${icon('mail', { size: 17 })}</span><span>${esc(cfg.contact.email)}</span></a></li>
            <li class="flex items-start gap-3 text-on-deep-muted"><span class="mt-0.5 shrink-0">${icon('mapPin', { size: 17 })}</span><span>Serving ${esc(cfg.contact.addressLocality)}, ${esc(cfg.contact.addressRegion)} within ${esc(cfg.contact.serviceRadiusKm)} km</span></li>
          </ul>
          <h3 class="mb-2 font-display text-base font-bold">Working Hours</h3>
          <dl class="text-sm">${hoursRows}</dl>
          ${cfg.hours.emergency24_7 ? `<p class="mt-3 inline-flex items-center gap-2 rounded-full bg-accent/15 px-3 py-1.5 text-sm font-semibold text-accent shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-accent)_38%,transparent)]">${icon('siren', { size: 15 })} Emergencies answered 24/7</p>` : ''}
        </div>
      </div>

      <hr class="rule my-10 opacity-30">

      <div class="flex flex-col-reverse items-start justify-between gap-5 text-sm text-on-deep-muted md:flex-row md:items-center">
        <p>&copy; ${year} ${esc(cfg.brand.legalName)}. All rights reserved.</p>
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
          <a class="transition-colors duration-300 hover:text-accent" href="/privacy/">Privacy Policy</a>
          <a class="transition-colors duration-300 hover:text-accent" href="/terms/">Terms of Service</a>
          <a class="transition-colors duration-300 hover:text-accent" href="/accessibility/">Accessibility</a>
          <a class="transition-colors duration-300 hover:text-accent" href="/sitemap.xml">Sitemap</a>
        </div>
      </div>
    </div>
  </footer>`;
}

/* --------------------------------------------------------------- head + page */

function analytics(cfg) {
  // Nothing is injected unless the client actually has an ID. An empty tag
  // manager container is a third-party request that buys nothing.
  const { gtmContainerId, ga4MeasurementId } = cfg.analytics;
  if (!gtmContainerId && !ga4MeasurementId) return { head: '', body: '' };
  if (gtmContainerId) {
    return {
      head: `<script src="https://www.googletagmanager.com/gtm.js?id=${esc(gtmContainerId)}" defer></script>`,
      body: `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${esc(gtmContainerId)}" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>`,
    };
  }
  return {
    head: `<script src="https://www.googletagmanager.com/gtag/js?id=${esc(ga4MeasurementId)}" defer></script>`,
    body: '',
  };
}

/**
 * @param {object} o
 * @param {string} o.title       Page title (run through the config title template)
 * @param {string} o.description Meta description, 150-160 chars
 * @param {string} o.path        Canonical path, always trailing-slashed
 * @param {string} o.body        Page markup
 * @param {object[]} o.schemas   JSON-LD nodes to embed
 * @param {string} [o.preloadImage] LCP image to preload with fetchpriority=high
 */
export function page(cfg, o) {
  const canonical = abs(cfg, o.path);
  const title = o.path === '/' ? cfg.seo.defaultTitle : cfg.seo.titleTemplate.replace('%s', o.title);
  const ogImage = abs(cfg, o.ogImage ?? cfg.seo.ogImage);
  const tags = analytics(cfg);

  const ld = (o.schemas ?? [])
    .map((s) => `<script type="application/ld+json">${jsonLd(s)}</script>`)
    .join('\n  ');

  return `<!doctype html>
<html lang="${esc(cfg.seo.lang)}" data-theme="${esc(cfg.theme)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

  <title>${esc(title)}</title>
  <meta name="description" content="${esc(o.description)}">
  <link rel="canonical" href="${esc(canonical)}">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">

  <meta name="theme-color" content="#123a2e" media="(prefers-color-scheme: light)">
  <meta name="theme-color" content="#12100e" media="(prefers-color-scheme: dark)">
  <meta name="format-detection" content="telephone=no">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(cfg.brand.name)}">
  <meta property="og:locale" content="${esc(cfg.seo.locale)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(o.description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${esc(ogImage)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(cfg.brand.name)} — ${esc(cfg.brand.tagline)}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(o.description)}">
  <meta name="twitter:image" content="${esc(ogImage)}">
  ${cfg.seo.twitterHandle ? `<meta name="twitter:site" content="${esc(cfg.seo.twitterHandle)}">` : ''}

  <meta name="geo.region" content="CA-${esc(cfg.contact.addressRegion)}">
  <meta name="geo.placename" content="${esc(cfg.contact.addressLocality)}">

  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="icon" href="/assets/img/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">

  <link rel="preload" href="/assets/fonts/bricolage-grotesque-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/plus-jakarta-sans-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
  ${o.preloadImage ? `<link rel="preload" href="${esc(o.preloadImage)}" as="image" fetchpriority="high">` : ''}

  <link rel="stylesheet" href="/assets/css/site.css">
  ${tags.head}

  ${ld}
</head>
<body class="bg-canvas text-ink antialiased">
  ${tags.body}
  <a class="skip-link" href="#main">Skip to main content</a>
  <div class="grain" aria-hidden="true"></div>

  <header role="banner">
    ${utilityBar(cfg)}
  </header>

  <!-- The nav is a sibling of <header>, not a child. A sticky element can only
       travel within its containing block, so nesting it inside a short header
       would pin it for a few pixels and then let it scroll away. -->
  ${floatingNav(cfg, o.path)}

  <main id="main" role="main">
${o.body}
  </main>

  ${footer(cfg)}

  <script src="/assets/js/site.js" defer></script>
</body>
</html>
`;
}

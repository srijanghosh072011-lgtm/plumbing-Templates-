import { imgSrc } from './assets.js';
import { icon } from './icons.js';
import { esc } from './layout.js';

/* --------------------------------------------------------------------- media */

/**
 * Image with explicit intrinsic dimensions (reserves space → no CLS) and
 * correct loading semantics. `priority` marks the LCP candidate: eager +
 * fetchpriority=high, everything else lazy + async decode.
 */
export function img(src, alt, { w, h, className = '', priority = false, sizes } = {}) {
  return `<img src="${esc(src)}" alt="${esc(alt)}" width="${w}" height="${h}"${className ? ` class="${className}"` : ''}${sizes ? ` sizes="${esc(sizes)}"` : ''} ${
    priority ? 'loading="eager" fetchpriority="high" decoding="sync"' : 'loading="lazy" decoding="async"'
  }>`;
}

/* ------------------------------------------------------------------- buttons */

export function btn(label, href, { variant = 'accent', glyph = 'arrowUpRight', track, location, className = '' } = {}) {
  const attrs = [
    `class="btn btn-${variant}${className ? ' ' + className : ''}"`,
    `href="${esc(href)}"`,
    track ? `data-track="${esc(track)}"` : '',
    location ? `data-location="${esc(location)}"` : '',
    href.startsWith('http') ? 'rel="noopener noreferrer" target="_blank"' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return `<a ${attrs}><span>${esc(label)}</span><span class="btn-orb" aria-hidden="true">${icon(glyph, { size: 14 })}</span></a>`;
}

/* ------------------------------------------------------------------ headings */

export function sectionHead({ eyebrow, title, lead, align = 'left', onDeep = false, action }) {
  const alignCls = align === 'center' ? 'text-center items-center mx-auto' : 'items-start';
  return `
    <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between" data-reveal>
      <div class="flex max-w-3xl flex-col gap-5 ${alignCls}">
        ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
        <h2 class="text-[length:var(--text-h2)]">${title}</h2>
        ${lead ? `<p class="measure text-[length:var(--text-lead)] ${onDeep ? 'text-on-deep-muted' : 'text-ink-muted'}">${esc(lead)}</p>` : ''}
      </div>
      ${action ? `<div class="shrink-0">${action}</div>` : ''}
    </div>`;
}

/* -------------------------------------------------------------- AEO answer */

/**
 * The answer-first block. GEO research is unambiguous that the opening 150-200
 * words carry disproportionate weight in generative retrieval, so every key page
 * leads with a direct, extractable answer in a plain paragraph — not a
 * blockquote, which engines parse inconsistently.
 */
export function answerBlock(text, { label = 'The short answer' } = {}) {
  return `
    <div class="bezel mb-12" data-reveal>
      <div class="bezel-core p-7 md:p-9">
        <p class="eyebrow mb-4">${esc(label)}</p>
        <p class="measure text-[length:var(--text-lead)] text-ink">${esc(text)}</p>
      </div>
    </div>`;
}

/* --------------------------------------------------------------------- cards */

export function serviceCard(cfg, s, index, { priority = false } = {}) {
  const price = s.priceTo
    ? `$${s.priceFrom}–$${s.priceTo}`
    : `From $${s.priceFrom}`;
  return `
    <a class="bezel bezel-interactive group block h-full cursor-pointer" href="/services/${esc(s.slug)}/" data-reveal data-reveal-delay="${index * 70}">
      <article class="bezel-core flex h-full flex-col">
        <div class="relative overflow-hidden">
          ${img(imgSrc(`service-${(index % 6) + 1}`), `${s.name} — ${esc(s.short)}`, { w: 720, h: 560, className: 'h-56 w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]', priority })}
          <span class="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-accent text-on-accent shadow-[var(--shadow-lift)]" aria-hidden="true">${icon(s.icon, { size: 20 })}</span>
        </div>
        <div class="flex flex-1 flex-col p-6 md:p-7">
          <div class="mb-3 flex items-center gap-3">
            <span class="rounded-full bg-canvas-sunk px-3 py-1 text-[0.75rem] font-semibold text-ink-muted">${esc(price)}</span>
            <span class="inline-flex items-center gap-1.5 text-[0.75rem] text-ink-faint">${icon('clock', { size: 13 })}${esc(s.duration)}</span>
          </div>
          <h3 class="mb-2.5 text-[length:var(--text-h3)]">${esc(s.name)}</h3>
          <p class="mb-6 flex-1 text-ink-muted">${esc(s.short)}</p>
          <span class="inline-flex items-center gap-2 font-semibold text-ink transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:gap-3.5">
            <span>Explore this service</span>
            <span class="grid h-8 w-8 place-items-center rounded-full bg-accent text-on-accent" aria-hidden="true">${icon('arrowUpRight', { size: 14 })}</span>
          </span>
        </div>
      </article>
    </a>`;
}

/* ----------------------------------------------------------------------- FAQ */

export function faqList(faqs, { onDeep = false } = {}) {
  return `<div class="divide-y ${onDeep ? 'divide-white/10' : 'divide-[color:var(--color-hairline)]'}">
    ${faqs
      .map(
        (f, i) => `
      <details class="faq-item" data-reveal data-reveal-delay="${i * 50}"${i === 0 ? ' open' : ''}>
        <summary>
          <span class="measure-tight">${esc(f.q)}</span>
          <span class="faq-sign" aria-hidden="true">${icon('plus', { size: 16 })}</span>
        </summary>
        <div class="faq-body"><p class="measure">${esc(f.a)}</p></div>
      </details>`
      )
      .join('')}
  </div>`;
}

/* --------------------------------------------------------------------- trust */

export function trustRow(cfg, { onDeep = false } = {}) {
  const items = [
    { icon: 'shield', label: cfg.credentials.licenceLabel },
    { icon: 'badge', label: cfg.credentials.insuranceLabel },
    { icon: 'clock', label: cfg.hours.emergency24_7 ? '24/7 Emergency Call-Out' : 'Same-Day Appointments' },
    { icon: 'check', label: '2-Year Workmanship Guarantee' },
  ];
  return `<ul class="flex flex-wrap gap-x-7 gap-y-3 ${onDeep ? 'text-on-deep-muted' : 'text-ink-muted'}">
    ${items
      .map(
        (i) =>
          `<li class="inline-flex items-center gap-2.5 text-sm font-medium"><span class="grid h-7 w-7 shrink-0 place-items-center rounded-full ${onDeep ? 'bg-white/10 text-accent' : 'bg-accent/20 text-ink'}" aria-hidden="true">${icon(i.icon, { size: 14 })}</span>${esc(i.label)}</li>`
      )
      .join('')}
  </ul>`;
}

export function stars(n, { size = 14 } = {}) {
  return `<span class="inline-flex gap-0.5 text-accent" role="img" aria-label="${n} out of 5 stars">${Array.from(
    { length: 5 },
    (_, i) => `<span class="${i < n ? 'star-on' : 'star-off'}" aria-hidden="true">${icon('star', { size })}</span>`
  ).join('')}</span>`;
}

/* -------------------------------------------------------------- breadcrumbs */

export function breadcrumbNav(trail) {
  return `<nav class="mb-8" aria-label="Breadcrumb" data-reveal>
    <ol class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-faint">
      ${trail
        .map((t, i) =>
          i === trail.length - 1
            ? `<li aria-current="page" class="font-medium text-ink-muted">${esc(t.name)}</li>`
            : `<li class="inline-flex items-center gap-2"><a class="transition-colors duration-300 hover:text-ink" href="${esc(t.path)}">${esc(t.name)}</a><span aria-hidden="true" class="opacity-50">/</span></li>`
        )
        .join('')}
    </ol>
  </nav>`;
}

/* ------------------------------------------------------------------ CTA band */

export function ctaBand(cfg) {
  return `
  <section class="band-tight relative overflow-hidden bg-accent" aria-labelledby="cta-heading">
    <div class="shell">
      <div class="grid items-center gap-10 md:grid-cols-[1.5fr_auto]">
        <div data-reveal>
          <p class="mb-5 inline-flex items-center gap-2 rounded-full bg-on-accent/12 px-3.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-on-accent">
            ${icon('siren', { size: 14 })} Emergency Service
          </p>
          <h2 class="mb-4 max-w-2xl text-[length:var(--text-h2)] text-on-accent" id="cta-heading">Burst pipe right now? We answer in person, 24/7.</h2>
          <p class="measure mb-8 text-[length:var(--text-lead)] text-on-accent/80">
            A live dispatcher picks up every call — no answering service, no callback queue. Average on-site arrival across ${esc(cfg.contact.addressLocality)} is ${esc(cfg.stats[2].value)} minutes, and there is no overtime surcharge at night or on weekends.
          </p>
          <div class="flex flex-wrap gap-3">
            <a class="btn btn-deep" href="tel:${esc(cfg.contact.emergencyPhoneE164)}" data-track="phone_call_click" data-location="cta_band">
              <span>Call ${esc(cfg.contact.emergencyPhoneDisplay)}</span>
              <span class="btn-orb" aria-hidden="true">${icon('phone', { size: 14 })}</span>
            </a>
            <a class="btn btn-ghost text-on-accent" href="/contact/">
              <span>Book a non-urgent visit</span>
              <span class="btn-orb" aria-hidden="true">${icon('arrowUpRight', { size: 14 })}</span>
            </a>
          </div>
        </div>
        <div class="hidden md:block" data-reveal data-reveal-delay="120">
          <div class="bezel bezel-deep w-[19rem]">
            <div class="bezel-core overflow-hidden">
              ${img(imgSrc('cta-figure'), 'Northline emergency plumber ready for dispatch', { w: 520, h: 620, className: 'h-[22rem] w-full object-cover' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

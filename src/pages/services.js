import { imgSrc } from '../lib/assets.js';
import { icon } from '../lib/icons.js';
import { esc } from '../lib/layout.js';
import {
  img, btn, sectionHead, serviceCard, faqList, answerBlock, breadcrumbNav, trustRow, ctaBand,
} from '../lib/components.js';

/** Shared page-top banner. Deep panel, torn seam handled by the section below. */
function pageHero(cfg, { eyebrow, title, lead, trail }) {
  return `
  <section class="relative bg-canvas pt-6" aria-labelledby="page-heading">
    <div class="shell">
      <div class="on-deep relative overflow-hidden rounded-[2.25rem] bg-deep px-6 pt-14 pb-16 md:px-12 md:pt-18 md:pb-20">
        <div class="orb-glow orb-tr" aria-hidden="true"></div>
        <div class="relative max-w-3xl">
          ${breadcrumbNav(trail).replace('text-ink-faint', 'text-on-deep-muted').replace(/hover:text-ink"/g, 'hover:text-accent"').replace('text-ink-muted">', 'text-on-deep">')}
          <p class="eyebrow mb-6" data-reveal>${esc(eyebrow)}</p>
          <h1 class="mb-6 text-[length:var(--text-h1)] text-on-deep" id="page-heading" data-reveal data-reveal-delay="60">${title}</h1>
          <p class="measure text-[length:var(--text-lead)] text-on-deep-muted" data-reveal data-reveal-delay="120">${esc(lead)}</p>
        </div>
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------ services index */

export function servicesIndex(cfg) {
  return `
  ${pageHero(cfg, {
    eyebrow: 'What we do',
    title: `Plumbing services in ${esc(cfg.contact.addressLocality)}`,
    lead: `Every service we offer, with real price ranges published up front. ${cfg.brand.name} covers ${cfg.areaServed.length} communities within ${cfg.contact.serviceRadiusKm} km, and every job is quoted at a fixed price before work begins.`,
    trail: [{ name: 'Home', path: '/' }, { name: 'Services', path: '/services/' }],
  })}

  <section class="band">
    <div class="shell">
      ${answerBlock(
        `${cfg.brand.name} offers six core plumbing services in ${cfg.contact.addressLocality}: 24/7 emergency repair from $${cfg.services[0].priceFrom}, drain cleaning from $${cfg.services[1].priceFrom}, water heater repair and replacement from $${cfg.services[2].priceFrom}, leak detection from $${cfg.services[3].priceFrom}, fixture installation from $${cfg.services[4].priceFrom}, and sewer line repair from $${cfg.services[5].priceFrom}. Every visit begins with a $149 diagnostic that is credited toward the repair once you approve the work.`,
        { label: 'Services and pricing at a glance' }
      )}

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        ${cfg.services.map((s, i) => serviceCard(cfg, s, i, { priority: i === 0 })).join('')}
      </div>

      <div class="mt-16 bezel" data-reveal>
        <div class="bezel-core p-8 md:p-10">
          <h2 class="mb-4 text-[length:var(--text-h3)]">Not sure which service you need?</h2>
          <p class="measure mb-7 text-ink-muted">Describe what is happening and we will tell you which of these it is — or tell you it is not a plumbing problem at all, which happens more often than you would think. There is no charge for that conversation.</p>
          <div class="flex flex-wrap gap-3">
            <a class="btn btn-accent" href="tel:${esc(cfg.contact.phoneE164)}" data-track="phone_call_click" data-location="services_index">
              <span>Call ${esc(cfg.contact.phoneDisplay)}</span><span class="btn-orb" aria-hidden="true">${icon('phone', { size: 14 })}</span>
            </a>
            ${btn('Send a message', '/contact/', { variant: 'ghost' })}
          </div>
        </div>
      </div>
    </div>
  </section>

  ${ctaBand(cfg)}`;
}

/* -------------------------------------------------------------- service page */

export function servicePage(cfg, s) {
  const idx = cfg.services.findIndex((x) => x.slug === s.slug);
  const related = cfg.services.filter((x) => x.slug !== s.slug).slice(0, 3);
  const price = s.priceTo ? `$${s.priceFrom} – $${s.priceTo}` : `From $${s.priceFrom}`;

  const facts = [
    { icon: 'gauge', label: 'Typical price', value: price },
    { icon: 'clock', label: 'Typical duration', value: s.duration },
    { icon: 'mapPin', label: 'Available in', value: `${cfg.areaServed.length} communities` },
    { icon: 'shield', label: 'Guarantee', value: '2-year workmanship' },
  ];

  return `
  ${pageHero(cfg, {
    eyebrow: 'Service',
    title: `${esc(s.name)} in ${esc(cfg.contact.addressLocality)}`,
    lead: s.short,
    trail: [
      { name: 'Home', path: '/' },
      { name: 'Services', path: '/services/' },
      { name: s.name, path: `/services/${s.slug}/` },
    ],
  })}

  <section class="band">
    <div class="shell">
      <div class="grid gap-14 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">

        <div>
          ${answerBlock(s.answerFirst)}

          <div class="mb-12 grid gap-4 sm:grid-cols-2" data-reveal>
            ${facts
              .map(
                (f) => `
              <div class="bezel">
                <div class="bezel-core flex items-center gap-4 p-5">
                  <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent/18 text-ink" aria-hidden="true">${icon(f.icon, { size: 19 })}</span>
                  <div>
                    <p class="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">${esc(f.label)}</p>
                    <p class="font-display text-lg font-bold">${esc(f.value)}</p>
                  </div>
                </div>
              </div>`
              )
              .join('')}
          </div>

          <div class="mb-12" data-reveal>
            <h2 class="mb-6 text-[length:var(--text-h2)]">What is included</h2>
            <ul class="flex flex-col gap-4">
              ${s.bullets
                .map(
                  (b, i) => `
                <li class="flex gap-4" data-reveal data-reveal-delay="${i * 60}">
                  <span class="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-on-accent" aria-hidden="true">${icon('check', { size: 14 })}</span>
                  <span class="measure text-ink-muted">${esc(b)}</span>
                </li>`
                )
                .join('')}
            </ul>
          </div>

          <div class="mb-12">
            <div class="bezel" data-reveal>
              <div class="bezel-core overflow-hidden">
                ${img(imgSrc(`service-${(idx % 6) + 1}`), `${s.name} being carried out by a ${cfg.brand.name} technician`, { w: 720, h: 560, className: 'aspect-[9/7] w-full object-cover' })}
              </div>
            </div>
          </div>

          <div data-reveal>
            <h2 class="mb-2 text-[length:var(--text-h2)]">${esc(s.name)} questions</h2>
            <p class="measure mb-6 text-ink-muted">The things customers ask us most about this specific service.</p>
            ${faqList(s.faqs)}
          </div>
        </div>

        <aside class="lg:sticky lg:top-28 lg:self-start">
          <div class="bezel bezel-deep on-deep mb-6" data-reveal>
            <div class="bezel-core p-7">
              <p class="eyebrow mb-4">Book this service</p>
              <p class="mb-6 text-on-deep-muted">Call for same-day availability, or send details and we will come back with a written quote.</p>
              <div class="flex flex-col gap-3">
                <a class="btn btn-accent justify-between" href="tel:${esc(cfg.contact.phoneE164)}" data-track="phone_call_click" data-location="service_sidebar">
                  <span>${esc(cfg.contact.phoneDisplay)}</span><span class="btn-orb" aria-hidden="true">${icon('phone', { size: 14 })}</span>
                </a>
                ${btn('Request a quote', '/contact/', { variant: 'on-deep', className: 'justify-between' })}
              </div>
              <hr class="rule my-6 opacity-40">
              ${trustRow(cfg, { onDeep: true })}
            </div>
          </div>

          <div class="bezel" data-reveal data-reveal-delay="80">
            <div class="bezel-core p-7">
              <h2 class="mb-4 font-display text-lg font-bold">Where we do this</h2>
              <ul class="flex flex-wrap gap-2">
                ${cfg.areaServed
                  .map(
                    (a) =>
                      `<li><a class="inline-block rounded-full bg-canvas-sunk px-3.5 py-1.5 text-sm text-ink-muted transition-colors duration-300 hover:bg-accent hover:text-on-accent" href="/service-areas/${esc(a.slug)}/">${esc(a.name)}</a></li>`
                  )
                  .join('')}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <section class="band bg-canvas-sunk/60">
    <div class="shell">
      ${sectionHead({ eyebrow: 'Related', title: 'Other services you might need', action: btn('All services', '/services/', { variant: 'deep' }) })}
      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${related.map((r) => serviceCard(cfg, r, cfg.services.findIndex((x) => x.slug === r.slug))).join('')}
      </div>
    </div>
  </section>

  ${ctaBand(cfg)}`;
}

export { pageHero };

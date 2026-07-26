import { icon } from '../lib/icons.js';
import { esc } from '../lib/layout.js';
import { btn, sectionHead, answerBlock, faqList, trustRow, ctaBand, img } from '../lib/components.js';
import { pageHero } from './services.js';

/* --------------------------------------------------------------- areas index */

export function areasIndex(cfg) {
  return `
  ${pageHero(cfg, {
    eyebrow: 'Coverage',
    title: `Where ${esc(cfg.brand.shortName)} works`,
    lead: `We cover ${cfg.areaServed.length} communities within ${cfg.contact.serviceRadiusKm} km of ${cfg.contact.addressLocality}. Each one has its own housing stock and its own recurring failures — the pages below cover what we actually see in each.`,
    trail: [{ name: 'Home', path: '/' }, { name: 'Service Areas', path: '/service-areas/' }],
  })}

  <section class="band">
    <div class="shell">
      ${answerBlock(
        `${cfg.brand.name} serves ${cfg.areaServed.map((a) => a.name).join(', ')} — every community within a ${cfg.contact.serviceRadiusKm} km radius of ${cfg.contact.addressLocality}, ${cfg.contact.addressRegion}. Emergency response targets range from ${Math.min(...cfg.areaServed.map((a) => a.responseMinutes))} to ${Math.max(...cfg.areaServed.map((a) => a.responseMinutes))} minutes depending on distance. If you are outside this radius, call anyway and we will tell you honestly whether we can reach you in a useful timeframe.`,
        { label: 'Coverage at a glance' }
      )}

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        ${cfg.areaServed
          .map(
            (a, i) => `
          <a class="bezel bezel-interactive group block h-full cursor-pointer" href="/service-areas/${esc(a.slug)}/" data-reveal data-reveal-delay="${i * 70}">
            <article class="bezel-core flex h-full flex-col p-7">
              <div class="mb-4 flex items-start justify-between gap-4">
                <span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-accent/18 text-ink" aria-hidden="true">${icon('mapPin', { size: 21 })}</span>
                <span class="rounded-full bg-canvas-sunk px-3 py-1 text-[0.7rem] font-semibold text-ink-muted">
                  ${a.distanceKm === 0 ? 'Home base' : `${esc(a.distanceKm)} km`}
                </span>
              </div>
              <h2 class="mb-2 font-display text-2xl font-bold">${esc(a.name)}</h2>
              <p class="mb-5 flex-1 text-ink-muted">${esc(a.note)}</p>
              <div class="mb-5 flex items-center gap-2 text-sm text-ink-faint">
                ${icon('clock', { size: 14 })}<span>~${esc(a.responseMinutes)} min emergency response</span>
              </div>
              <span class="inline-flex items-center gap-2 font-semibold text-ink transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:gap-3.5">
                <span>${esc(a.name)} details</span>
                <span class="grid h-8 w-8 place-items-center rounded-full bg-accent text-on-accent" aria-hidden="true">${icon('arrowUpRight', { size: 14 })}</span>
              </span>
            </article>
          </a>`
          )
          .join('')}
      </div>
    </div>
  </section>

  ${ctaBand(cfg)}`;
}

/* ----------------------------------------------------------------- area page */

export function areaPage(cfg, a) {
  const faqs = [
    {
      q: `Do you charge extra to come out to ${a.name}?`,
      a:
        a.distanceKm === 0
          ? `No. ${a.name} is our home base, so the standard $149 diagnostic call-out applies with no travel surcharge anywhere in the city.`
          : `No. ${a.name} sits ${a.distanceKm} km from our ${cfg.contact.addressLocality} base and falls inside our standard service radius, so the same $149 diagnostic applies with no travel premium. Communities beyond ${cfg.contact.serviceRadiusKm} km are quoted case by case.`,
    },
    {
      q: `How fast can you reach ${a.name} in an emergency?`,
      a: `Our target is roughly ${a.responseMinutes} minutes from the call to on-site in ${a.name}. That holds around the clock — we do not run a slower overnight roster. During a severe cold snap, when frozen-line calls spike across the whole region at once, expect that to stretch; the dispatcher will give you a realistic window rather than an optimistic one.`,
    },
    {
      q: `What plumbing problems are most common in ${a.name}?`,
      a: `${a.commonIssue} ${a.localFactor}`,
    },
    {
      q: `Are you licensed to work in ${a.name}?`,
      a: `Yes. ${cfg.brand.legalName} holds a ${cfg.credentials.licenceLabel} valid province-wide, carries ${cfg.credentials.insuranceLabel} coverage, and pulls permits with the relevant municipal authority where the work requires one. Documentation is available on request before work starts.`,
    },
  ];

  return `
  ${pageHero(cfg, {
    eyebrow: `${esc(a.name)}, ${esc(cfg.contact.addressRegion)}`,
    title: `Plumber in ${esc(a.name)}`,
    lead: `${a.note} Emergency response in roughly ${a.responseMinutes} minutes, licensed and insured, with fixed quotes before any work begins.`,
    trail: [
      { name: 'Home', path: '/' },
      { name: 'Service Areas', path: '/service-areas/' },
      { name: a.name, path: `/service-areas/${a.slug}/` },
    ],
  })}

  <section class="band">
    <div class="shell">
      <div class="grid gap-14 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
        <div>
          ${answerBlock(
            `${cfg.brand.name} provides licensed plumbing services throughout ${a.name}, ${cfg.contact.addressRegion}, with an emergency response target of about ${a.responseMinutes} minutes and no travel surcharge inside our ${cfg.contact.serviceRadiusKm} km radius. The most common call we take in ${a.name} is ${a.commonIssue.charAt(0).toLowerCase() + a.commonIssue.slice(1)}`
          )}

          <div class="mb-12" data-reveal>
            <h2 class="mb-5 text-[length:var(--text-h2)]">Plumbing in ${esc(a.name)}, specifically</h2>
            <p class="measure mb-5 text-[length:var(--text-lead)] text-ink-muted">${esc(a.housingStock)}</p>
            <p class="measure mb-5 text-ink-muted">${esc(a.localFactor)}</p>
            <p class="measure text-ink-muted">Knowing that in advance changes how we diagnose. A technician who has worked ${esc(a.name)} properties checks the likely cause first instead of working through a generic checklist at your expense.</p>
          </div>

          ${
            a.neighbourhoods?.length
              ? `<div class="mb-12" data-reveal>
                  <h2 class="mb-5 text-[length:var(--text-h3)]">Areas we cover in ${esc(a.name)}</h2>
                  <ul class="flex flex-wrap gap-2">
                    ${a.neighbourhoods.map((n) => `<li class="rounded-full bg-canvas-sunk px-4 py-2 text-sm text-ink-muted">${esc(n)}</li>`).join('')}
                  </ul>
                </div>`
              : ''
          }

          <div class="mb-12" data-reveal>
            <h2 class="mb-6 text-[length:var(--text-h2)]">Services available in ${esc(a.name)}</h2>
            <div class="grid gap-3 sm:grid-cols-2">
              ${cfg.services
                .map(
                  (s) => `
                <a class="bezel bezel-interactive group block cursor-pointer" href="/services/${esc(s.slug)}/">
                  <div class="bezel-core flex items-center gap-4 p-5">
                    <span class="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent/18 text-ink" aria-hidden="true">${icon(s.icon, { size: 19 })}</span>
                    <div class="min-w-0">
                      <p class="font-display text-base font-bold">${esc(s.name)}</p>
                      <p class="truncate text-sm text-ink-faint">${s.priceTo ? `$${esc(s.priceFrom)}–$${esc(s.priceTo)}` : `From $${esc(s.priceFrom)}`}</p>
                    </div>
                  </div>
                </a>`
                )
                .join('')}
            </div>
          </div>

          <div data-reveal>
            <h2 class="mb-6 text-[length:var(--text-h2)]">${esc(a.name)} questions</h2>
            ${faqList(faqs)}
          </div>
        </div>

        <aside class="lg:sticky lg:top-28 lg:self-start">
          <div class="bezel bezel-deep on-deep mb-6" data-reveal>
            <div class="bezel-core p-7">
              <p class="eyebrow mb-4">${esc(a.name)} dispatch</p>
              <p class="stat-value mb-1 text-accent">~${esc(a.responseMinutes)}<span class="text-2xl">min</span></p>
              <p class="mb-6 text-sm text-on-deep-muted">Average emergency arrival, 24 hours a day.</p>
              <div class="flex flex-col gap-3">
                <a class="btn btn-accent justify-between" href="tel:${esc(cfg.contact.emergencyPhoneE164)}" data-track="phone_call_click" data-location="area_sidebar">
                  <span>${esc(cfg.contact.emergencyPhoneDisplay)}</span><span class="btn-orb" aria-hidden="true">${icon('phone', { size: 14 })}</span>
                </a>
                ${btn('Book a visit', '/contact/', { variant: 'on-deep', className: 'justify-between' })}
              </div>
              <hr class="rule my-6 opacity-40">
              ${trustRow(cfg, { onDeep: true })}
            </div>
          </div>

          <div class="bezel" data-reveal data-reveal-delay="80">
            <div class="bezel-core p-7">
              <h2 class="mb-4 font-display text-lg font-bold">Other areas we serve</h2>
              <ul class="flex flex-wrap gap-2">
                ${cfg.areaServed
                  .filter((x) => x.slug !== a.slug)
                  .map(
                    (x) =>
                      `<li><a class="inline-block rounded-full bg-canvas-sunk px-3.5 py-1.5 text-sm text-ink-muted transition-colors duration-300 hover:bg-accent hover:text-on-accent" href="/service-areas/${esc(x.slug)}/">${esc(x.name)}</a></li>`
                  )
                  .join('')}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>

  ${ctaBand(cfg)}`;
}

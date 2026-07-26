import { imgSrc } from '../lib/assets.js';
import { icon } from '../lib/icons.js';
import { esc, tornEdge } from '../lib/layout.js';
import {
  img, btn, sectionHead, serviceCard, faqList, trustRow, stars, ctaBand,
} from '../lib/components.js';

/* ---------------------------------------------------------------------- hero */

function hero(cfg) {
  return `
  <section class="relative overflow-hidden bg-canvas pt-6 md:pt-8" aria-labelledby="hero-heading">
    <div class="shell">
      <div class="on-deep relative overflow-hidden rounded-[2.25rem] bg-deep px-6 pt-16 pb-40 md:px-12 md:pt-20 md:pb-44 lg:px-16">

        <!-- ambient orb, purely decorative, GPU-cheap -->
        <div class="orb-glow orb-tr" aria-hidden="true"></div>

        <div class="relative grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">

          <div>
            <p class="eyebrow mb-7" data-reveal>${icon('shield', { size: 13 })} ${esc(cfg.brand.tagline)}</p>

            <h1 class="mb-7 text-[length:var(--text-mega)] text-on-deep" id="hero-heading" data-reveal data-reveal-delay="80">
              Plumbing<br>
              <span class="text-accent">Solutions</span><br>
              <span class="font-editorial font-normal italic tracking-[-0.02em] opacity-90">done right</span>
            </h1>

            <p class="measure mb-9 text-[length:var(--text-lead)] text-on-deep-muted" data-reveal data-reveal-delay="160">
              ${esc(cfg.brand.name)} is a licensed, insured plumbing contractor serving ${esc(cfg.contact.addressLocality)} and southern ${esc(cfg.contact.addressRegion === 'SK' ? 'Saskatchewan' : cfg.contact.addressRegion)}. We answer emergencies 24/7 with a ${esc(cfg.stats[2].value)}-minute average arrival, quote a fixed price before we start, and never add an overtime surcharge.
            </p>

            <div class="mb-10 flex flex-wrap gap-3" data-reveal data-reveal-delay="220">
              <a class="btn btn-accent" href="tel:${esc(cfg.contact.phoneE164)}" data-track="phone_call_click" data-location="hero">
                <span>Call ${esc(cfg.contact.phoneDisplay)}</span>
                <span class="btn-orb" aria-hidden="true">${icon('phone', { size: 14 })}</span>
              </a>
              ${btn('Book a visit', '/contact/', { variant: 'on-deep' })}
            </div>

            <div data-reveal data-reveal-delay="280">${trustRow(cfg, { onDeep: true })}</div>
          </div>

          <!-- Z-axis cascade: layered plates, rotations dropped below md -->
          <div class="relative mx-auto w-full max-w-md lg:max-w-none" data-reveal data-reveal-delay="140">
            <div class="bezel bezel-deep md:rotate-[2.5deg]">
              <div class="bezel-core overflow-hidden">
                ${img(imgSrc('hero-primary'), `A licensed ${cfg.brand.name} plumber on a service call in ${cfg.contact.addressLocality}`, {
                  w: 900, h: 1100, priority: true,
                  className: 'aspect-[9/11] w-full object-cover',
                })}
              </div>
            </div>

            <div class="absolute -bottom-8 -left-4 hidden w-40 md:block md:-rotate-[4deg]">
              <div class="bezel bezel-deep rounded-full p-1.5">
                <div class="bezel-core overflow-hidden rounded-full">
                  ${img(imgSrc('hero-inset'), 'Close-up of a compression fitting being tightened', { w: 520, h: 520, className: 'aspect-square w-full object-cover' })}
                </div>
              </div>
            </div>

            <!-- rotating seal -->
            <a class="group absolute -right-3 -top-8 grid h-28 w-28 place-items-center rounded-full bg-accent text-on-accent shadow-[var(--shadow-float)] transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-105 md:h-32 md:w-32"
               href="/contact/" aria-label="Book an appointment now">
              <svg class="seal-spin absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
                <defs><path id="seal" d="M50,50 m-36,0 a36,36 0 1,1 72,0 a36,36 0 1,1 -72,0"/></defs>
                <text font-size="10.5" font-weight="700" letter-spacing="2.4" fill="currentColor">
                  <textPath href="#seal">BOOK NOW · 24/7 CALL-OUT · </textPath>
                </text>
              </svg>
              <span class="grid h-11 w-11 place-items-center rounded-full bg-on-accent text-accent transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">
                ${icon('arrowUpRight', { size: 18 })}
              </span>
            </a>
          </div>
        </div>

        ${tornEdge('var(--color-canvas)', { position: 'bottom', variant: 0 })}
      </div>
    </div>
  </section>`;
}

/* --------------------------------------------------------------------- stats */

function statsRow(cfg) {
  return `
  <section class="band-tight" aria-label="Company track record">
    <div class="shell">
      <div class="bezel" data-reveal>
        <div class="bezel-core grid gap-px bg-[color:var(--color-hairline)] sm:grid-cols-2 lg:grid-cols-4">
          ${cfg.stats
            .map(
              (s) => `
            <div class="bg-canvas px-7 py-9 text-center">
              <p class="stat-value mb-2 text-ink">
                <span data-count-to="${esc(s.value)}">0</span><span class="text-accent">${esc(s.suffix)}</span>
              </p>
              <p class="text-sm font-medium uppercase tracking-[0.14em] text-ink-faint">${esc(s.label)}</p>
            </div>`
            )
            .join('')}
        </div>
      </div>
    </div>
  </section>`;
}

/* --------------------------------------------------------------------- about */

function about(cfg) {
  const points = [
    { icon: 'wrench', title: 'Journeyperson-led crews', body: 'Every job is run by a licensed journeyperson, not an apprentice working unsupervised off a checklist.' },
    { icon: 'gauge', title: 'Diagnose before we quote', body: 'We camera and test first. You see the actual cause on screen before a single dollar is discussed.' },
    { icon: 'shield', title: 'Fixed price, held', body: 'The written quote does not move once you approve it. No hourly creep, no surprise line items.' },
  ];

  return `
  <section class="band" aria-labelledby="about-heading">
    <div class="shell">
      <div class="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">

        <div class="relative" data-reveal>
          <div class="bezel">
            <div class="bezel-core overflow-hidden">
              ${img(imgSrc('about-team'), `The ${cfg.brand.name} team outside their service vehicles`, { w: 900, h: 700, className: 'aspect-[9/7] w-full object-cover' })}
            </div>
          </div>
          <div class="absolute -bottom-10 right-4 hidden w-44 sm:block md:-right-8">
            <div class="bezel">
              <div class="bezel-core overflow-hidden">
                ${img(imgSrc('about-detail'), 'Workshop bench with plumbing tools laid out', { w: 560, h: 700, className: 'aspect-[4/5] w-full object-cover' })}
              </div>
            </div>
          </div>
          <div class="absolute -left-3 top-6 hidden rounded-[1.5rem] bg-accent px-5 py-4 text-on-accent shadow-[var(--shadow-float)] md:block md:-rotate-3">
            <p class="font-display text-3xl font-bold leading-none">${new Date().getFullYear() - cfg.brand.foundingYear}+</p>
            <p class="text-[0.7rem] font-semibold uppercase tracking-[0.14em]">Years serving<br>${esc(cfg.contact.addressLocality)}</p>
          </div>
        </div>

        <div>
          <p class="eyebrow mb-6" data-reveal>Who we are</p>
          <h2 class="mb-6 text-[length:var(--text-h2)]" id="about-heading" data-reveal data-reveal-delay="60">
            The team behind ${esc(cfg.contact.addressLocality)}'s<br class="hidden sm:block"> most-recommended plumbing
          </h2>
          <p class="measure mb-6 text-[length:var(--text-lead)] text-ink-muted" data-reveal data-reveal-delay="100">
            ${esc(cfg.brand.name)} has worked on ${esc(cfg.contact.addressLocality)} homes since ${esc(cfg.brand.foundingYear)} — character houses with galvanised risers, new builds in the suburbs, and acreages on well systems. That range matters, because prairie plumbing fails in specific ways that a generic playbook misses.
          </p>
          <div class="mb-9 flex flex-col gap-5">
            ${points
              .map(
                (p, i) => `
              <div class="flex gap-4" data-reveal data-reveal-delay="${140 + i * 70}">
                <span class="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-full bg-canvas-sunk text-ink shadow-[inset_0_0_0_1px_var(--color-hairline)]" aria-hidden="true">${icon(p.icon, { size: 19 })}</span>
                <div>
                  <h3 class="mb-1 font-display text-lg font-bold">${esc(p.title)}</h3>
                  <p class="measure text-ink-muted">${esc(p.body)}</p>
                </div>
              </div>`
              )
              .join('')}
          </div>
          <div data-reveal data-reveal-delay="360">${btn('More about us', '/about/', { variant: 'deep' })}</div>
        </div>
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------ services */

function services(cfg) {
  return `
  <section class="band bg-canvas-sunk/60" aria-labelledby="services-heading">
    <div class="shell">
      ${sectionHead({
        eyebrow: 'What we do',
        title: `<span id="services-heading">Our plumbing services</span>`,
        lead: `Repairs, replacements and installs across ${cfg.areaServed.length} communities — each with transparent pricing published up front, because guessing what a plumber will charge is the worst part of hiring one.`,
        action: btn('View all services', '/services/', { variant: 'deep' }),
      })}
      <div class="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        ${cfg.services.map((s, i) => serviceCard(cfg, s, i)).join('')}
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------- process */

function process(cfg) {
  const steps = cfg.process;
  return `
  <section class="band" aria-labelledby="process-heading">
    <div class="shell">
      ${sectionHead({
        eyebrow: 'Getting started',
        title: `<span id="process-heading">Our plumbing process</span>`,
        lead: 'Four steps, no ambiguity. You always know what happens next and what it will cost before it happens.',
        align: 'center',
      })}

      <div class="relative mt-16">
        <div class="grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-10">

          <div class="flex flex-col gap-6">
            ${steps.slice(0, 2).map((s, i) => processCard(s, i)).join('')}
          </div>

          <div class="mx-auto hidden w-64 lg:block" data-reveal data-reveal-delay="120">
            <div class="bezel rounded-full p-2">
              <div class="bezel-core overflow-hidden rounded-full">
                ${img(imgSrc('process-portrait'), 'Plumber diagnosing a fixture during a service call', { w: 640, h: 640, className: 'aspect-square w-full object-cover' })}
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-6">
            ${steps.slice(2).map((s, i) => processCard(s, i + 2)).join('')}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

function processCard(s, i) {
  return `
    <div class="bezel bezel-interactive" data-reveal data-reveal-delay="${i * 80}">
      <div class="bezel-core p-6 md:p-7">
        <div class="mb-4 flex items-center gap-3">
          <span class="grid h-11 w-11 place-items-center rounded-full bg-accent font-display text-base font-bold text-on-accent">${esc(s.step)}</span>
          <h3 class="font-display text-lg font-bold">${esc(s.title)}</h3>
        </div>
        <p class="text-ink-muted">${esc(s.body)}</p>
      </div>
    </div>`;
}

/* ------------------------------------------------------------------ projects */

function projects(cfg) {
  return `
  <section class="on-deep relative bg-deep text-on-deep" aria-labelledby="projects-heading" data-rail-group>
    ${tornEdge('var(--color-canvas)', { position: 'top', variant: 1 })}
    <div class="band pt-32 md:pt-40">
      <div class="shell">
        ${sectionHead({
          eyebrow: 'Recent work',
          title: `<span id="projects-heading" class="text-on-deep">Explore plumbing projects</span>`,
          lead: 'Real jobs from the last eighteen months, with what was actually wrong and what it took to fix.',
          onDeep: true,
          action: `<div class="flex gap-2">
            <button class="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-on-deep shadow-[inset_0_0_0_1px_var(--color-deep-line)] transition-colors duration-400 hover:bg-accent hover:text-on-accent" type="button" data-rail-prev aria-label="Previous projects">${icon('arrowLeft', { size: 18 })}</button>
            <button class="grid h-12 w-12 place-items-center rounded-full bg-white/10 text-on-deep shadow-[inset_0_0_0_1px_var(--color-deep-line)] transition-colors duration-400 hover:bg-accent hover:text-on-accent" type="button" data-rail-next aria-label="Next projects">${icon('arrowRight', { size: 18 })}</button>
          </div>`,
        })}
      </div>

      <div class="shell mt-12">
        <ul class="rail" data-rail role="list">
          ${cfg.projects
            .map(
              (p, i) => `
            <li class="bezel bezel-deep bezel-interactive">
              <article class="bezel-core flex h-full flex-col overflow-hidden">
                ${img(imgSrc(`project-${i + 1}`), `${p.title} — ${p.category} project in ${p.location}`, { w: 760, h: 600, className: 'h-52 w-full object-cover' })}
                <div class="flex flex-1 flex-col p-6">
                  <div class="mb-3 flex flex-wrap items-center gap-2">
                    <span class="rounded-full bg-accent px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-on-accent">${esc(p.category)}</span>
                    <span class="inline-flex items-center gap-1.5 text-[0.75rem] text-on-deep-muted">${icon('mapPin', { size: 13 })}${esc(p.location)}</span>
                  </div>
                  <h3 class="mb-2 font-display text-xl font-bold text-on-deep">${esc(p.title)}</h3>
                  <p class="text-sm text-on-deep-muted">${esc(p.summary)}</p>
                </div>
              </article>
            </li>`
            )
            .join('')}
        </ul>
      </div>
    </div>
    ${tornEdge('var(--color-canvas)', { position: 'bottom', variant: 2 })}
  </section>`;
}

/* -------------------------------------------------------------- testimonials */

function testimonials(cfg) {
  const t = cfg.testimonials[0];
  return `
  <section class="band" aria-labelledby="testimonials-heading">
    <div class="shell">
      ${sectionHead({
        eyebrow: 'Real reviews, real customers',
        title: `<span id="testimonials-heading">Our clients say it best</span>`,
        lead: `Rated ${cfg.reviews.ratingValue} out of 5 across ${cfg.reviews.reviewCount} verified reviews.`,
      })}

      <div class="mt-14 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div data-reveal>
          <div class="bezel">
            <div class="bezel-core overflow-hidden">
              ${img(imgSrc('testimonial'), 'A completed bathroom plumbing installation by Northline', { w: 820, h: 640, className: 'aspect-[41/32] w-full object-cover' })}
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <div class="bezel" data-reveal data-reveal-delay="90">
            <blockquote class="bezel-core relative p-8 md:p-10">
              <span class="absolute right-8 top-7 text-accent opacity-45" aria-hidden="true">${icon('quote', { size: 44 })}</span>
              <div class="mb-5">${stars(t.rating, { size: 17 })}</div>
              <p class="measure mb-7 text-[length:var(--text-lead)] text-ink">${esc(t.quote)}</p>
              <footer class="flex items-center gap-3.5">
                <span class="grid h-12 w-12 place-items-center rounded-full bg-accent font-display text-lg font-bold text-on-accent" aria-hidden="true">${esc(t.author.charAt(0))}</span>
                <div>
                  <cite class="block font-display text-base font-bold not-italic">${esc(t.author)}</cite>
                  <span class="text-sm text-ink-faint">${esc(t.role)}</span>
                </div>
              </footer>
            </blockquote>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            ${cfg.testimonials
              .slice(1, 3)
              .map(
                (o, i) => `
              <div class="bezel" data-reveal data-reveal-delay="${150 + i * 80}">
                <blockquote class="bezel-core h-full p-6">
                  <div class="mb-3">${stars(o.rating, { size: 13 })}</div>
                  <p class="mb-4 text-sm text-ink-muted">${esc(o.quote.slice(0, 150))}…</p>
                  <footer class="text-sm"><cite class="font-semibold not-italic text-ink">${esc(o.author)}</cite><span class="block text-ink-faint">${esc(o.role)}</span></footer>
                </blockquote>
              </div>`
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

/* ----------------------------------------------------------------------- FAQ */

function faq(cfg) {
  return `
  <section class="band bg-canvas-sunk/60" aria-labelledby="faq-heading">
    <div class="shell">
      <div class="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          ${sectionHead({
            eyebrow: 'Common questions',
            title: `<span id="faq-heading">Answers before you call</span>`,
            lead: 'The questions we get asked most, answered plainly.',
          })}
          <div class="mt-8" data-reveal data-reveal-delay="120">
            ${btn('Ask us something else', '/contact/', { variant: 'deep' })}
          </div>
        </div>
        <div>${faqList(cfg.generalFaqs)}</div>
      </div>
    </div>
  </section>`;
}

/* ---------------------------------------------------------------------- blog */

function blog(cfg) {
  return `
  <section class="band" aria-labelledby="blog-heading">
    <div class="shell">
      ${sectionHead({
        eyebrow: 'From the workshop',
        title: `<span id="blog-heading">Explore our latest guides</span>`,
        lead: 'Practical maintenance writing for prairie homes — the things that actually prevent an emergency call.',
        action: btn('All articles', '/blog/', { variant: 'deep' }),
      })}
      <div class="mt-14 grid gap-6 md:grid-cols-3">
        ${cfg.posts
          .map(
            (p, i) => `
          <a class="bezel bezel-interactive group block cursor-pointer" href="/blog/${esc(p.slug)}/" data-reveal data-reveal-delay="${i * 80}">
            <article class="bezel-core flex h-full flex-col">
              <div class="overflow-hidden">
                ${img(imgSrc(`post-${i + 1}`), `Header image for the article: ${p.title}`, { w: 760, h: 520, className: 'h-48 w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]' })}
              </div>
              <div class="flex flex-1 flex-col p-6">
                <div class="mb-3 flex items-center gap-2 text-[0.75rem] text-ink-faint">
                  <span class="rounded-full bg-canvas-sunk px-2.5 py-1 font-semibold text-ink-muted">${esc(p.category)}</span>
                  <time datetime="${esc(p.date)}">${new Date(p.date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })}</time>
                  <span aria-hidden="true">·</span><span>${esc(p.readingMinutes)} min read</span>
                </div>
                <h3 class="mb-2.5 font-display text-xl font-bold leading-tight">${esc(p.title)}</h3>
                <p class="mb-5 flex-1 text-sm text-ink-muted">${esc(p.excerpt)}</p>
                <span class="inline-flex items-center gap-2 text-sm font-semibold text-ink transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:gap-3">
                  Read article <span class="grid h-7 w-7 place-items-center rounded-full bg-accent text-on-accent" aria-hidden="true">${icon('arrowUpRight', { size: 12 })}</span>
                </span>
              </div>
            </article>
          </a>`
          )
          .join('')}
      </div>
    </div>
  </section>`;
}

/* -------------------------------------------------------------------- export */

export default function home(cfg) {
  return [
    hero(cfg),
    statsRow(cfg),
    about(cfg),
    services(cfg),
    process(cfg),
    projects(cfg),
    testimonials(cfg),
    faq(cfg),
    blog(cfg),
    ctaBand(cfg),
  ].join('\n');
}

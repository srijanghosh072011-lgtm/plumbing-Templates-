import { icon } from '../lib/icons.js';
import { esc } from '../lib/layout.js';
import { img, btn, sectionHead, answerBlock, trustRow, stars, ctaBand } from '../lib/components.js';
import { pageHero } from './services.js';

export default function about(cfg) {
  const years = new Date().getFullYear() - cfg.brand.foundingYear;

  const values = [
    { icon: 'gauge', title: 'Diagnose before quoting', body: 'We camera, test and measure before a price is discussed. A quote written without a diagnosis is a guess, and you are the one who pays for a wrong guess.' },
    { icon: 'shield', title: 'The quote does not move', body: 'Once you approve a written figure, that is the figure. If we underestimated the job, that is our problem to absorb, not a change order to hand you.' },
    { icon: 'clock', title: 'No overtime surcharge', body: 'A 2am Sunday call costs the same as a Tuesday afternoon. Emergencies do not schedule themselves, and charging a premium for bad timing has always struck us as backwards.' },
    { icon: 'wrench', title: 'Repair before replace', body: 'If a $220 repair genuinely buys you three more years, we will tell you, even though replacement is the bigger invoice. That is the whole basis of getting called back.' },
  ];

  const credentials = [
    { label: cfg.credentials.licenceLabel, value: cfg.credentials.licenceNumber },
    { label: 'General liability insurance', value: cfg.credentials.insuranceLabel },
    { label: 'Bonded', value: cfg.credentials.bonded ? 'Yes' : 'No' },
    { label: 'WCB coverage', value: cfg.credentials.wcbCovered ? 'All technicians covered' : 'Not covered' },
  ];

  return `
  ${pageHero(cfg, {
    eyebrow: 'Who we are',
    title: `${years} years under ${esc(cfg.contact.addressLocality)} sinks`,
    lead: `${cfg.brand.name} has worked on this city's plumbing since ${cfg.brand.foundingYear} — character homes, new builds, restaurants and acreages. Here is how we work and why customers keep our number.`,
    trail: [{ name: 'Home', path: '/' }, { name: 'About', path: '/about/' }],
  })}

  <section class="band">
    <div class="shell">
      ${answerBlock(
        `${cfg.brand.legalName} is a licensed, insured, ${cfg.credentials.bonded ? 'bonded ' : ''}plumbing contractor founded in ${cfg.brand.foundingYear} and based in ${cfg.contact.addressLocality}, ${cfg.contact.addressRegion}. We operate as a service-area business covering ${cfg.areaServed.length} communities within ${cfg.contact.serviceRadiusKm} km, hold ${cfg.credentials.insuranceLabel} in general liability coverage, and guarantee workmanship for two years. We have completed over ${cfg.stats[1].value.toLocaleString('en-CA')} jobs and hold a ${cfg.reviews.ratingValue} out of 5 rating across ${cfg.reviews.reviewCount} reviews.`,
        { label: 'About this business' }
      )}

      <div class="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <div data-reveal>
          <div class="bezel">
            <div class="bezel-core overflow-hidden">
              ${img('/assets/img/about-team.svg', `The ${cfg.brand.name} team outside their service vehicles`, { w: 900, h: 700, className: 'aspect-[9/7] w-full object-cover', priority: true })}
            </div>
          </div>
        </div>
        <div>
          <h2 class="mb-6 text-[length:var(--text-h2)]" data-reveal>Started because the trade deserved better</h2>
          <p class="measure mb-5 text-[length:var(--text-lead)] text-ink-muted" data-reveal data-reveal-delay="60">
            ${esc(cfg.brand.shortName)} began in ${esc(cfg.brand.foundingYear)} with one van and a straightforward frustration: too many people were being quoted for a full replacement when a repair would do, and too many were being billed by the hour with no ceiling in sight.
          </p>
          <p class="measure mb-5 text-ink-muted" data-reveal data-reveal-delay="100">
            So we built the business around two commitments that cost us money in the short run and earned it back in referrals — diagnose properly before quoting, and hold the quote once it is written. Both of those are still the first thing we tell a new technician.
          </p>
          <p class="measure mb-8 text-ink-muted" data-reveal data-reveal-delay="140">
            ${esc(cfg.stats[1].value.toLocaleString('en-CA'))} jobs later, most of our work comes from people who were referred by someone we helped. That is the only marketing metric we have ever really cared about.
          </p>
          <div data-reveal data-reveal-delay="180">${trustRow(cfg)}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="band bg-canvas-sunk/60">
    <div class="shell">
      ${sectionHead({ eyebrow: 'How we work', title: 'Four commitments we do not bend on', lead: 'These are the rules the whole business runs on. They are also the reason our quotes are sometimes smaller than the competition.', align: 'center' })}
      <div class="mt-14 grid gap-6 md:grid-cols-2">
        ${values
          .map(
            (v, i) => `
          <div class="bezel bezel-interactive" data-reveal data-reveal-delay="${i * 70}">
            <div class="bezel-core h-full p-7 md:p-8">
              <span class="mb-5 grid h-12 w-12 place-items-center rounded-full bg-accent text-on-accent" aria-hidden="true">${icon(v.icon, { size: 21 })}</span>
              <h3 class="mb-3 font-display text-xl font-bold">${esc(v.title)}</h3>
              <p class="measure text-ink-muted">${esc(v.body)}</p>
            </div>
          </div>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="band">
    <div class="shell">
      <div class="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          ${sectionHead({ eyebrow: 'Credentials', title: 'Licensed, insured, documented' })}
          <p class="measure mt-6 mb-8 text-ink-muted" data-reveal>
            You are entitled to see all of this before anyone starts work in your home. Ask, and we will send it — and if a contractor ever hesitates when you ask, that hesitation is your answer.
          </p>
          <dl class="flex flex-col" data-reveal data-reveal-delay="80">
            ${credentials
              .map(
                (c) => `
              <div class="flex flex-wrap items-baseline justify-between gap-4 border-b border-[color:var(--color-hairline)] py-4 last:border-0">
                <dt class="text-ink-muted">${esc(c.label)}</dt>
                <dd class="font-display text-base font-bold">${esc(c.value)}</dd>
              </div>`
              )
              .join('')}
          </dl>
        </div>

        <div class="flex flex-col gap-6">
          <div class="bezel" data-reveal>
            <div class="bezel-core p-8">
              <div class="mb-4 flex items-center gap-3">
                <span class="stat-value text-ink">${esc(cfg.reviews.ratingValue)}</span>
                <div>
                  ${stars(5, { size: 16 })}
                  <p class="text-sm text-ink-faint">${esc(cfg.reviews.reviewCount)} verified reviews</p>
                </div>
              </div>
              <p class="measure text-ink-muted">Aggregated across Google, Facebook and direct feedback. Every review shown on this site is one we can trace to a real completed job.</p>
            </div>
          </div>
          <div class="bezel" data-reveal data-reveal-delay="80">
            <div class="bezel-core overflow-hidden">
              ${img('/assets/img/about-detail.svg', 'Workshop bench with plumbing tools laid out', { w: 560, h: 700, className: 'aspect-[4/3] w-full object-cover' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  ${ctaBand(cfg)}`;
}

import { icon } from '../lib/icons.js';
import { esc } from '../lib/layout.js';
import { btn, faqList, trustRow, answerBlock } from '../lib/components.js';
import { pageHero } from './services.js';

function field({ id, label, type = 'text', required = false, autocomplete, placeholder, hint, options, rows }) {
  const describedBy = hint ? ` aria-describedby="${id}-hint"` : '';
  const req = required ? ' required aria-required="true"' : '';
  const base =
    'w-full rounded-[1.125rem] bg-canvas px-4 py-3.5 text-ink shadow-[inset_0_0_0_1px_var(--color-hairline-strong)] transition-shadow duration-300 placeholder:text-ink-faint focus:shadow-[inset_0_0_0_2px_var(--color-accent)] focus:outline-none';

  let control;
  if (options) {
    control = `<select class="${base} cursor-pointer" id="${id}" name="${id}"${req}${describedBy}>
      <option value="">Choose one…</option>
      ${options.map((o) => `<option value="${esc(o.value)}">${esc(o.label)}</option>`).join('')}
    </select>`;
  } else if (rows) {
    control = `<textarea class="${base} resize-y" id="${id}" name="${id}" rows="${rows}"${req}${describedBy}${placeholder ? ` placeholder="${esc(placeholder)}"` : ''}></textarea>`;
  } else {
    control = `<input class="${base}" id="${id}" name="${id}" type="${type}"${req}${describedBy}${autocomplete ? ` autocomplete="${autocomplete}"` : ''}${placeholder ? ` placeholder="${esc(placeholder)}"` : ''}>`;
  }

  return `
    <div class="flex flex-col gap-2">
      <label class="text-sm font-semibold text-ink" for="${id}">
        ${esc(label)}${required ? '<span class="text-danger" aria-hidden="true"> *</span>' : '<span class="font-normal text-ink-faint"> (optional)</span>'}
      </label>
      ${control}
      ${hint ? `<p class="text-sm text-ink-faint" id="${id}-hint">${esc(hint)}</p>` : ''}
    </div>`;
}

export default function contact(cfg) {
  const hoursRows = cfg.hours.regular
    .map((r) => {
      const days = r.days.length > 1 ? `${r.days[0]}–${r.days[r.days.length - 1]}` : r.days[0];
      return `<div class="flex items-baseline justify-between gap-4 border-b border-[color:var(--color-hairline)] py-3 last:border-0">
        <dt class="text-ink-muted">${esc(days)}</dt>
        <dd class="font-semibold">${r.closed ? 'Closed' : `${esc(r.opens)} – ${esc(r.closes)}`}</dd>
      </div>`;
    })
    .join('');

  return `
  ${pageHero(cfg, {
    eyebrow: 'Get in touch',
    title: 'Book a plumber',
    lead: `Call for anything urgent — a live dispatcher answers 24/7. For non-urgent work, send the form and we will come back with a written quote, usually the same business day.`,
    trail: [{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact/' }],
  })}

  <section class="band">
    <div class="shell">
      ${answerBlock(
        `To book ${cfg.brand.name}, call ${cfg.contact.phoneDisplay} at any hour — emergencies are answered 24/7 by a live dispatcher with an average ${cfg.stats[2].value}-minute arrival in ${cfg.contact.addressLocality}. For non-urgent work, use the form on this page or email ${cfg.contact.email}. Every visit starts with a $149 diagnostic that is credited toward the repair once you approve the quote.`,
        { label: 'How to book' }
      )}

      <div class="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">

        <div class="bezel" data-reveal>
          <div class="bezel-core p-7 md:p-9">
            <h2 class="mb-2 text-[length:var(--text-h3)]">Request a quote</h2>
            <p class="mb-8 text-ink-muted">Non-urgent requests only. If water is actively spreading, call instead — a form is too slow for an emergency.</p>

            <!--
              Form posts natively so it still works with JS disabled. The action
              must be pointed at the client's real handler (Formspree, Netlify
              Forms, or a serverless function) before launch.
            -->
            <form class="flex flex-col gap-5" data-form action="/thank-you/" method="post" novalidate>

              <!-- Honeypot. Positioned off-screen rather than display:none so
                   naive bots that skip hidden fields still fill it. Never
                   focusable, never announced. -->
              <div class="absolute left-[-9999px]" aria-hidden="true">
                <label for="company_website">Do not fill this in</label>
                <input id="company_website" name="company_website" type="text" tabindex="-1" autocomplete="off">
              </div>

              <div class="grid gap-5 sm:grid-cols-2">
                ${field({ id: 'name', label: 'Your name', required: true, autocomplete: 'name', placeholder: 'Jordan Fisher' })}
                ${field({ id: 'phone', label: 'Phone', type: 'tel', required: true, autocomplete: 'tel', placeholder: '(306) 555-0142' })}
              </div>

              ${field({ id: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', placeholder: 'you@example.com' })}

              <div class="grid gap-5 sm:grid-cols-2">
                ${field({
                  id: 'area',
                  label: 'Where are you',
                  required: true,
                  options: cfg.areaServed.map((a) => ({ value: a.slug, label: a.name })).concat([{ value: 'other', label: 'Somewhere else' }]),
                })}
                ${field({
                  id: 'service',
                  label: 'What do you need',
                  required: true,
                  options: cfg.services.map((s) => ({ value: s.slug, label: s.name })).concat([{ value: 'unsure', label: 'Not sure yet' }]),
                })}
              </div>

              ${field({
                id: 'message',
                label: 'What is happening',
                rows: 5,
                required: true,
                placeholder: 'Describe the problem — when it started, where it is, anything you have already tried.',
                hint: 'The more detail you give, the closer our first quote will be to the final number.',
              })}

              <div class="flex items-start gap-3 rounded-[1.125rem] bg-canvas-sunk p-4">
                <input class="mt-1 h-5 w-5 shrink-0 cursor-pointer accent-[color:var(--color-accent)]" id="consent" name="consent" type="checkbox" required aria-required="true">
                <label class="text-sm text-ink-muted" for="consent">
                  I agree to be contacted about this request, and I have read the
                  <a class="font-semibold text-ink underline decoration-accent decoration-2 underline-offset-2" href="/privacy/">privacy policy</a>.
                  <span class="text-danger" aria-hidden="true">*</span>
                </label>
              </div>

              <p class="text-sm text-ink-faint">
                We will only use your details to respond to this request. We do not sell data and we will not add you to a mailing list without a separate opt-in — that is a CASL requirement and we take it seriously.
              </p>

              <button class="btn btn-accent justify-center" type="submit">
                <span data-label>Send request</span>
                <span class="btn-orb" aria-hidden="true">${icon('arrowUpRight', { size: 14 })}</span>
              </button>

              <!-- aria-live so the status change is announced to screen readers -->
              <p class="text-sm font-medium text-ink-muted" data-form-status role="status" aria-live="polite"></p>
            </form>
          </div>
        </div>

        <div class="flex flex-col gap-6">
          <div class="bezel bezel-deep on-deep" data-reveal data-reveal-delay="80">
            <div class="bezel-core p-7">
              <p class="eyebrow mb-5">${icon('siren', { size: 13 })} Emergency line</p>
              <p class="mb-6 text-on-deep-muted">Burst pipe, no water, or sewage backing up? Call now — do not wait on a form.</p>
              <a class="btn btn-accent w-full justify-between" href="tel:${esc(cfg.contact.emergencyPhoneE164)}" data-track="phone_call_click" data-location="contact_emergency">
                <span>${esc(cfg.contact.emergencyPhoneDisplay)}</span><span class="btn-orb" aria-hidden="true">${icon('phone', { size: 14 })}</span>
              </a>
            </div>
          </div>

          <div class="bezel" data-reveal data-reveal-delay="120">
            <div class="bezel-core p-7">
              <h2 class="mb-5 font-display text-lg font-bold">Direct contact</h2>
              <ul class="flex flex-col gap-4">
                <li><a class="flex items-start gap-3.5 transition-colors duration-300 hover:text-accent" href="tel:${esc(cfg.contact.phoneE164)}" data-track="phone_call_click" data-location="contact_page">
                  <span class="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/18" aria-hidden="true">${icon('phone', { size: 16 })}</span>
                  <span><span class="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">Office</span><span class="font-semibold">${esc(cfg.contact.phoneDisplay)}</span></span>
                </a></li>
                <li><a class="flex items-start gap-3.5 transition-colors duration-300 hover:text-accent" href="mailto:${esc(cfg.contact.email)}" data-track="email_click">
                  <span class="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/18" aria-hidden="true">${icon('mail', { size: 16 })}</span>
                  <span class="min-w-0"><span class="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">Email</span><span class="break-all font-semibold">${esc(cfg.contact.email)}</span></span>
                </a></li>
                <li class="flex items-start gap-3.5">
                  <span class="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/18" aria-hidden="true">${icon('mapPin', { size: 16 })}</span>
                  <span><span class="block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-ink-faint">Service area</span><span class="font-semibold">${esc(cfg.contact.addressLocality)}, ${esc(cfg.contact.addressRegion)} + ${esc(cfg.contact.serviceRadiusKm)} km</span></span>
                </li>
              </ul>
              <p class="mt-5 text-sm text-ink-faint">We are a service-area business and work from vans rather than a storefront, so there is no counter to visit — but we will come to you anywhere in the radius.</p>
            </div>
          </div>

          <div class="bezel" data-reveal data-reveal-delay="160">
            <div class="bezel-core p-7">
              <h2 class="mb-4 font-display text-lg font-bold">Office hours</h2>
              <dl>${hoursRows}</dl>
              ${cfg.hours.emergency24_7 ? `<p class="mt-4 flex items-center gap-2 rounded-[1rem] bg-accent/15 px-4 py-3 text-sm font-semibold">${icon('siren', { size: 15 })} Emergency call-out runs 24/7, including holidays</p>` : ''}
            </div>
          </div>

          <div class="bezel" data-reveal data-reveal-delay="200">
            <div class="bezel-core p-7">${trustRow(cfg)}</div>
          </div>
        </div>
      </div>

      <div class="mt-20 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p class="eyebrow mb-5" data-reveal>Before you call</p>
          <h2 class="text-[length:var(--text-h2)]" data-reveal data-reveal-delay="60">Quick answers</h2>
        </div>
        <div>${faqList(cfg.generalFaqs.slice(0, 4))}</div>
      </div>
    </div>
  </section>`;
}

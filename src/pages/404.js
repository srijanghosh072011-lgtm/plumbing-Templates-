import { icon } from '../lib/icons.js';
import { esc } from '../lib/layout.js';
import { btn } from '../lib/components.js';

/**
 * Custom 404. Helpful rather than decorative: it routes people onward instead of
 * dead-ending them. Must be served with a real 404 status — a 200 here creates a
 * soft 404 and Google will treat every missing URL as thin content.
 * The deploy configs in deploy/ wire the status correctly per host.
 */
export default function notFound(cfg) {
  return `
  <section class="relative bg-canvas pt-6" aria-labelledby="nf-heading">
    <div class="shell">
      <div class="on-deep relative overflow-hidden rounded-[2.25rem] bg-deep px-6 py-24 text-center md:px-12 md:py-32">
        <div class="orb-glow orb-tc" aria-hidden="true"></div>

        <div class="relative mx-auto max-w-2xl">
          <p class="eyebrow mx-auto mb-8">Error 404</p>
          <p class="mb-6 font-display text-[clamp(5rem,18vw,11rem)] font-bold leading-[0.85] tracking-[-0.05em] text-accent">404</p>
          <h1 class="mb-5 text-[length:var(--text-h2)] text-on-deep" id="nf-heading">This page has gone down the drain</h1>
          <p class="measure mx-auto mb-10 text-[length:var(--text-lead)] text-on-deep-muted">
            The page you were after does not exist — it may have moved, or the link may have a typo. Here is where most people were heading.
          </p>

          <div class="mb-12 flex flex-wrap justify-center gap-3">
            ${btn('Back to home', '/', { variant: 'accent' })}
            <a class="btn btn-on-deep" href="tel:${esc(cfg.contact.phoneE164)}" data-track="phone_call_click" data-location="404">
              <span>Call ${esc(cfg.contact.phoneDisplay)}</span><span class="btn-orb" aria-hidden="true">${icon('phone', { size: 14 })}</span>
            </a>
          </div>

          <div class="grid gap-3 text-left sm:grid-cols-2">
            ${[
              { href: '/services/', title: 'All services', body: 'Every service with pricing up front' },
              { href: '/service-areas/', title: 'Service areas', body: `${cfg.areaServed.length} communities covered` },
              { href: '/contact/', title: 'Book a plumber', body: 'Request a written quote' },
              { href: '/blog/', title: 'Guides', body: 'Maintenance advice for prairie homes' },
            ]
              .map(
                (l) => `
              <a class="bezel bezel-deep bezel-interactive group block" href="${esc(l.href)}">
                <div class="bezel-core flex items-center justify-between gap-4 p-5">
                  <span>
                    <span class="block font-display text-base font-bold text-on-deep">${esc(l.title)}</span>
                    <span class="block text-sm text-on-deep-muted">${esc(l.body)}</span>
                  </span>
                  <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent text-on-accent transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">${icon('arrowUpRight', { size: 15 })}</span>
                </div>
              </a>`
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

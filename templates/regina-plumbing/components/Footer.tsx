import Link from 'next/link';
import { client } from '@/lib/client.config';
import { asset } from '@/lib/asset';
import { services, areas } from '@/lib/content';
import { ArrowIcon } from './ui';

const dayLabel = (days: readonly string[]) =>
  days.length === 1 ? days[0] : `${days[0].slice(0, 3)}–${days[days.length - 1].slice(0, 3)}`;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="no-print relative overflow-hidden bg-ink-950 text-bone-100">
      <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <p className="font-display text-2xl font-extrabold tracking-tight text-white">
              {client.name}
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-bone-200/70">
              {client.tagline}
            </p>

            <dl className="mt-6 space-y-1 text-sm text-bone-200/70">
              <div className="flex gap-2">
                <dt className="text-bone-200/45">Licence</dt>
                <dd>{client.licenceNumber}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-bone-200/45">WCB</dt>
                <dd>{client.wcbNumber}</dd>
              </div>
            </dl>

            {/* Rendered only once the placeholders are replaced, so a live
                site never ships an icon linking to the string "TODO_". */}
            <div className="mt-6 flex gap-2">
              {Object.entries(client.social)
                .filter(([, url]) => url && !url.startsWith('TODO_'))
                .map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="grid h-11 w-11 place-items-center rounded-full bg-white/[0.11] text-bone-100 ring-1 ring-white/18 transition-colors hover:bg-white/12"
                  >
                    <span className="text-xs font-semibold uppercase">{key.slice(0, 2)}</span>
                    <span className="sr-only">{client.name} on {key}</span>
                  </a>
                ))}
            </div>
          </div>

          <FooterCol title="Services">
            {services.map((s) => (
              <FooterLink key={s.slug} href={`/services/${s.slug}/`}>
                {s.name}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Service areas">
            {areas.map((a) => (
              <FooterLink key={a.slug} href={`/service-areas/${a.slug}/`}>
                {a.name}
              </FooterLink>
            ))}
          </FooterCol>

          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-bone-200/45">
              Get in touch
            </h2>
            <div className="mt-5 space-y-4">
              <Link href="/quote/" className="flex items-start gap-3 text-white">
                <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-tide-500/15 text-tide-300 ring-1 ring-tide-500/25">
                  <ArrowIcon />
                </span>
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.16em] text-bone-200/45">
                    Start here
                  </span>
                  <span className="font-display text-lg font-bold tracking-tight">
                    Request a quote
                  </span>
                </span>
              </Link>

              <a
                href={`mailto:${client.email}`}
                data-analytics="email_click"
                className="inline-flex min-h-6 items-center text-sm text-bone-200/70 underline-offset-4 hover:text-white hover:underline"
              >
                {client.email}
              </a>

              <div className="pt-2 text-sm text-bone-200/70">
                <p className="text-[11px] uppercase tracking-[0.16em] text-bone-200/45">Hours</p>
                {client.hours.map((h) => (
                  <p key={h.days.join()}>
                    {dayLabel(h.days)} · {h.open}–{h.close}
                  </p>
                ))}
                <p className="mt-2 text-tide-300">{client.emergencyNote}</p>
              </div>

              <p className="pt-2 text-sm text-bone-200/70">
                Serving {client.address.locality}, {client.address.region} and area
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/[0.08] pt-8 text-xs text-bone-200/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {client.legalName}. All rights reserved.
            {client.builtByCredit && (
              <>
                {' · '}
                <span className="whitespace-nowrap">
                  Site by{' '}
                  <a
                    href={client.builtByUrl}
                    rel="noopener"
                    className="underline-offset-4 transition-colors hover:text-white hover:underline"
                  >
                    {client.builtByCredit}
                  </a>
                </span>
              </>
            )}
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            <FooterLink href="/privacy/" small>Privacy Policy</FooterLink>
            <FooterLink href="/terms/" small>Terms of Service</FooterLink>
            <FooterLink href="/accessibility/" small>Accessibility</FooterLink>
            {/* Plain anchor, not next/link: sitemap.xml is a static file, and
                Link would try to prefetch it as an RSC payload and 404. */}
            <a
              href={asset('/sitemap.xml')}
              className="inline-flex min-h-6 items-center text-xs text-bone-200/70 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Sitemap
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-bone-200/45">
        {title}
      </h2>
      <ul className="mt-5 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
  small,
}: {
  href: string;
  children: React.ReactNode;
  small?: boolean;
}) {
  // inline-flex + min-h-6 puts every footer link over the 24x24 floor of
  // WCAG 2.2 SC 2.5.8. Left at their natural line-height they measured 18px
  // tall on a phone, which fails — and a footer is exactly where a cold,
  // gloved thumb is least accurate.
  const cls = `inline-flex min-h-6 items-center text-bone-200/70 underline-offset-4 transition-colors hover:text-white hover:underline ${
    small ? 'text-xs' : 'text-sm'
  }`;
  if (small) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <li>
      <Link href={href} className={cls}>
        {children}
      </Link>
    </li>
  );
}

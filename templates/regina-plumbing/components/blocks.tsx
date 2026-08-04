import Link from 'next/link';
import { Shell } from './ui';

/** Small shared page furniture used by more than one route. */

export function Breadcrumbs({
  trail,
  tone = 'light',
}: {
  trail: { name: string; path: string }[];
  tone?: 'light' | 'dark';
}) {
  const muted = tone === 'dark' ? 'text-bone-200/50' : 'text-ink-500';
  const active = tone === 'dark' ? 'text-bone-200/80' : 'text-ink-700';

  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-1.5 text-xs ${muted}`}>
        {trail.map((crumb, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className={active}>
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link
                    href={crumb.path}
                    className="underline-offset-4 transition-colors hover:underline"
                  >
                    {crumb.name}
                  </Link>
                  <span aria-hidden="true">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Freshness signal. AI engines weight recency (playbook 3), and this is
 * honest only if the content genuinely gets reviewed — the date is the
 * build date, so it moves when you redeploy. If a page sits untouched for a
 * year, the date still moving is a lie you are telling; re-read the page.
 */
export function LastUpdated() {
  const date = new Date().toISOString().slice(0, 10);
  return (
    <p className="mt-14 border-t border-ink-900/[0.08] pt-6 text-sm text-ink-500">
      Last reviewed{' '}
      <time dateTime={date}>
        {new Date(date).toLocaleDateString('en-CA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </time>
    </p>
  );
}

/** Native disclosure list. No JS, keyboard and SR correct by default. */
export function FaqList({
  faqs,
  className = '',
}: {
  faqs: { q: string; a: string }[];
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {faqs.map((f) => (
        <Shell key={f.q}>
          <details className="group p-6">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-lg font-bold tracking-tight text-ink-900 [&::-webkit-details-marker]:hidden">
              {f.q}
              <span
                aria-hidden="true"
                className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink-900/[0.06] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-open:rotate-45"
              >
                <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
                  <path
                    d="M6 1v10M1 6h10"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </summary>
            <p className="mt-4 text-sm leading-relaxed text-ink-700">{f.a}</p>
          </details>
        </Shell>
      ))}
    </div>
  );
}

/** Standard dark page header used by the secondary routes. */
export function PageHero({
  eyebrow,
  title,
  lede,
  trail,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  trail: { name: string; path: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-950 pb-20 pt-32 sm:pt-40">
      <div className="dark-surface absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-tide-500/15 blur-3xl"
      />
      <div className="relative mx-auto max-w-4xl px-6 lg:px-8">
        <Breadcrumbs tone="dark" trail={trail} />
        <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-tide-300 ring-1 ring-white/10">
          {eyebrow}
        </p>
        <h1 className="mt-5 font-display text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-white">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone-200/80">{lede}</p>
        {children}
      </div>
    </section>
  );
}

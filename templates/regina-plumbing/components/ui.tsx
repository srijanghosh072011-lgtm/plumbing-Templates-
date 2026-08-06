import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Shared primitives. Three of them, because three is what the site actually
 * uses — there is no variant system here, and there should not be one until
 * a second site needs a different variant.
 */

/* ─────────────────────────────────────────────────────────────────────────
   Shell — the "double bezel". An outer tray with a hairline ring and a
   distinct inner core whose radius is calculated to stay concentric. This
   is what stops a card reading as a flat div on a background.
   ───────────────────────────────────────────────────────────────────────── */
export function Shell({
  children,
  className = '',
  tone = 'light',
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'light' | 'dark';
  as?: 'div' | 'article' | 'li' | 'section';
}) {
  const outer =
    tone === 'dark'
      ? 'bg-white/[0.09] ring-1 ring-white/18'
      : 'bg-ink-900/[0.035] ring-1 ring-ink-900/[0.07]';
  const inner =
    tone === 'dark'
      ? 'bg-ink-900 shadow-[inset_0_1px_1px_rgb(255_255_255/0.09)]'
      : 'bg-white shadow-[inset_0_1px_1px_rgb(255_255_255/0.9),0_18px_40px_-24px_rgb(13_20_40/0.28)]';

  return (
    <Tag className={`rounded-[2rem] p-1.5 ${outer} ${className}`}>
      <div className={`h-full rounded-[1.625rem] ${inner}`}>{children}</div>
    </Tag>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   CTA — pill button whose trailing icon lives in its own circular well,
   flush with the inner padding. On hover the well drifts diagonally and
   scales; the whole button presses down on active. Transform and opacity
   only, so none of it touches layout.
   ───────────────────────────────────────────────────────────────────────── */
type CtaProps = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'onDark';
  icon?: 'arrow' | 'phone';
  className?: string;
  /** Set for tel: / external links so they are not routed by next/link. */
  external?: boolean;
  'data-analytics'?: string;
  'aria-label'?: string;
};

export function Cta({
  href,
  children,
  variant = 'primary',
  icon = 'arrow',
  className = '',
  external,
  ...rest
}: CtaProps) {
  const skin = {
    primary:
      'bg-ink-900 text-white hover:bg-ink-800 ring-1 ring-ink-950/20 shadow-[0_16px_36px_-18px_rgb(13_20_40/0.65)]',
    ghost:
      'bg-white text-ink-900 ring-1 ring-ink-900/12 hover:ring-ink-900/25 shadow-[0_10px_28px_-20px_rgb(13_20_40/0.5)]',
    onDark:
      'bg-copper-500 text-ink-950 hover:bg-copper-400 ring-1 ring-copper-600/40 shadow-[0_16px_36px_-18px_rgb(180_86_31/0.7)]',
  }[variant];

  const well =
    variant === 'primary'
      ? 'bg-white/12'
      : variant === 'onDark'
        ? 'bg-ink-950/15'
        : 'bg-ink-900/[0.07]';

  const inner = (
    <>
      <span>{children}</span>
      <span
        aria-hidden="true"
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${well} transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-px group-hover:scale-105`}
      >
        {icon === 'arrow' ? <ArrowIcon /> : <PhoneIcon />}
      </span>
    </>
  );

  // min-h-12 keeps the target above the 24x24 floor of WCAG 2.2 SC 2.5.8
  // with a comfortable margin for gloved winter hands on a phone.
  const shared = `group inline-flex min-h-12 items-center gap-3 rounded-full py-2 pl-6 pr-2 font-semibold tracking-tight transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] ${skin} ${className}`;

  if (external) {
    return (
      <a href={href} className={shared} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={shared} {...rest}>
      {inner}
    </Link>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
   Eyebrow — the small pill that precedes a major heading.
   ───────────────────────────────────────────────────────────────────────── */
export function Eyebrow({
  children,
  tone = 'light',
}: {
  children: ReactNode;
  tone?: 'light' | 'dark';
}) {
  const skin =
    tone === 'dark'
      ? 'bg-white/[0.11] text-tide-300 ring-white/18'
      : 'bg-ink-900/[0.04] text-ink-600 ring-ink-900/[0.08]';
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ring-1 ${skin}`}
    >
      {children}
    </span>
  );
}

/* ── Icons: ultra-light strokes, never a heavy icon-font glyph. ────────── */
export function ArrowIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M3.5 12.5 12.5 3.5M6 3.5h6.5V10"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M5.6 2.5 7 5.1 5.7 6.5a8.4 8.4 0 0 0 3.8 3.8L11 9l2.6 1.4v2.3c0 .6-.5 1-1.1.9C6.9 13 3 9.1 2.4 3.6a1 1 0 0 1 1-1.1h2.2Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ClockIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M8 4.75V8l2.25 1.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="m3.5 8.4 3 3 6-6.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${i < rating ? 'fill-copper-500' : 'fill-ink-900/15'}`}
          aria-hidden="true"
        >
          <path d="M10 1.6l2.5 5.3 5.5.8-4 4 .9 5.7L10 14.7 5.1 17.4l.9-5.7-4-4 5.5-.8z" />
        </svg>
      ))}
    </div>
  );
}

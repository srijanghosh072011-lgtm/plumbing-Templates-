'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { client } from '@/lib/client.config';
import { asset } from '@/lib/asset';
import { Cta } from './ui';

const nav = [
  { href: '/services/', label: 'Services' },
  { href: '/service-areas/', label: 'Service Areas' },
  { href: '/about/', label: 'About' },
  { href: '/reviews/', label: 'Reviews' },
  { href: '/faq/', label: 'FAQ' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Close on route change — otherwise the overlay survives navigation.
  useEffect(() => setOpen(false), [pathname]);

  /**
   * Every page opens on a dark hero and then runs into light content. A
   * single fixed treatment cannot serve both: dark glass looks right on the
   * hero and turns into a muddy grey slab over white.
   *
   * So the pill swaps once the hero has scrolled past, watched via an
   * IntersectionObserver on a sentinel rather than a scroll listener.
   */
  useEffect(() => {
    const sentinel = document.getElementById('top-sentinel');
    if (!sentinel) return;
    const io = new IntersectionObserver(
      ([e]) => setScrolled(!e.isIntersecting),
      { threshold: 0 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [pathname]);

  // Lock scroll behind the overlay and restore the exact prior value, so we
  // do not clobber an `overflow` the page itself set.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header className="no-print pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:pt-6">
      {/*
        Demo banner. This build carries a fictional business name, a phone
        number from the reserved 555-01xx fiction block, and invented licence
        numbers. Saying so plainly and permanently is the only honest way to
        publish it — someone arriving from a search result must not come away
        believing this is a real plumber they can call in an emergency.

        It lives inside the fixed header rather than above it in <body>, so
        the floating pill cannot cover it.
      */}
      {client.isDemo && (
        <div
          role="note"
          className="pointer-events-auto -mx-4 -mt-4 mb-3 bg-ink-800 px-4 py-2 text-center text-[12px] font-semibold leading-snug text-white sm:-mt-6 sm:text-[13px]"
        >
          Demo site — &ldquo;{client.name}&rdquo; is fictional. Contact details, licence
          numbers and reviews are all invented.
        </div>
      )}
      {/* Solid white bar with the mark centred and the links split either
          side of it — the reference's defining header structure, and the
          thing that stops it reading as a generic logo-left SaaS nav.

          A three-column grid ([1fr auto 1fr]) rather than flex + margins:
          it centres the mark against the BAR, not against whatever the two
          link groups happen to measure. With flex the mark drifts whenever
          a label changes length, which is exactly the sort of thing nobody
          notices until the client renames a page.

          White at all times, not dark-glass-over-hero: the hero tint is now
          a mid slate blue rather than a near-navy, so a white bar separates
          cleanly from it, and the reference's bar is solid white too. The
          scrolled state now only deepens the shadow. */}
      <div
        className={`pointer-events-auto mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-2xl border border-ink-900/[0.06] bg-white/95 p-1.5 backdrop-blur-2xl transition-shadow duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          scrolled
            ? 'shadow-[0_18px_44px_-26px_rgb(13_20_40/0.45)]'
            : 'shadow-[0_22px_54px_-30px_rgb(13_20_40/0.55)]'
        }`}
      >
        {/* Left group — first three links. Hidden below lg, where the bar
            becomes mark + hamburger. */}
        <nav aria-label="Primary" className="hidden items-center gap-1 pl-2 lg:flex">
          {nav.slice(0, 3).map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>
        <span className="lg:hidden" aria-hidden="true" />

        {/* The mark, centred and overhanging the bar's top and bottom edges
            as the reference's emblem does. No dark plate behind it: this
            mark is two-tone blue drawn for a light ground and carries its
            own silhouette (the ribbon), so it reads on the white bar
            directly. A plate would only box in a shape that already has
            one. */}
        <Link
          href="/"
          className="-my-4 flex items-center justify-center px-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5"
        >
          <img
            src={asset('/images/logo.png')}
            alt={`${client.name} home`}
            width={215}
            height={237}
            className="h-14 w-auto sm:h-16"
          />
        </Link>

        {/* Right group — remaining links, then the quote CTA. The reference
            has no CTA in its bar; keeping one costs nothing here and means
            the primary action survives scrolling past the hero. */}
        <div className="hidden items-center justify-end gap-1 pr-1 lg:flex">
          <nav aria-label="Secondary" className="flex items-center gap-1">
            {nav.slice(3).map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>
          <Cta href="/quote/" variant="primary" className="ml-2 text-sm">
            Get a quote
          </Cta>
        </div>

        {/* Right cell below lg. justify-self-end keeps it pinned right so
            the centred mark stays centred. */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="grid h-12 w-12 shrink-0 place-items-center justify-self-end rounded-xl bg-ink-900/[0.06] text-ink-900 transition-colors duration-500 hover:bg-ink-900/12 lg:hidden"
        >
          {/* Two bars that rotate into an X rather than swapping glyphs. */}
          <span className="relative block h-3 w-5" aria-hidden="true">
            <span
              className={`absolute left-0 block h-[1.5px] w-5 rounded bg-current transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                open ? 'top-1.5 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 block h-[1.5px] w-5 rounded bg-current transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                open ? 'top-1.5 -rotate-45' : 'top-3'
              }`}
            />
          </span>
        </button>
      </div>

      {/* Full-screen overlay. Kept mounted so the exit transition can play;
          made inert when closed so it never takes focus or gets read out. */}
      <div
        id="mobile-menu"
        inert={!open}
        className={`pointer-events-auto fixed inset-0 -z-10 bg-ink-950/90 backdrop-blur-3xl transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <nav
          aria-label="Mobile"
          className="flex h-full flex-col justify-center gap-1 px-8 pb-24 pt-28"
        >
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ transitionDelay: open ? `${80 + i * 55}ms` : '0ms' }}
              className={`border-b border-white/[0.07] py-4 font-display text-3xl font-extrabold tracking-tight text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
            >
              {item.label}
            </Link>
          ))}

          <div
            style={{ transitionDelay: open ? `${80 + nav.length * 55}ms` : '0ms' }}
            className={`mt-8 flex flex-col gap-3 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              open ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
          >
            <Cta href="/quote/" variant="onDark">
              Get a fast quote
            </Cta>
            <Cta href="/services/emergency-plumbing/" variant="ghost">
              24/7 emergency service
            </Cta>
          </div>
        </nav>
      </div>
    </header>
  );
}

/** One nav link. Extracted because the bar now renders two groups of them
 *  either side of the mark, and duplicating this much class string twice is
 *  how the two halves drift apart. */
function NavLink({
  item,
  pathname,
}: {
  item: { href: string; label: string };
  pathname: string;
}) {
  const active = pathname.startsWith(item.href);
  return (
    <Link
      href={item.href}
      aria-current={active ? 'page' : undefined}
      className={`rounded-lg px-3 py-2 text-[13px] font-semibold uppercase tracking-[0.1em] transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        active
          ? 'bg-ink-900/[0.07] text-ink-900'
          : 'text-ink-700 hover:bg-ink-900/[0.05] hover:text-ink-900'
      }`}
    >
      {item.label}
    </Link>
  );
}


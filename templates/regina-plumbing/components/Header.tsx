'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { client } from '@/lib/client.config';
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
          className="pointer-events-auto -mx-4 -mt-4 mb-3 bg-copper-600 px-4 py-2 text-center text-[12px] font-semibold leading-snug text-white sm:-mt-6 sm:text-[13px]"
        >
          Demo site — &ldquo;{client.name}&rdquo; is fictional. Contact details, licence
          numbers and reviews are all invented.
        </div>
      )}
      {/* Floating glass pill, detached from the top edge.
          Dark-tinted rather than white: every page on this site opens with a
          dark hero, so a light slab would sit on top of the photograph like
          a sticker. This reads as part of the image instead. */}
      <div
        className={`pointer-events-auto mx-auto flex w-full max-w-6xl items-center gap-3 rounded-full p-1.5 pl-5 backdrop-blur-2xl transition-[background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          scrolled
            ? 'border border-ink-900/[0.06] bg-white/85 shadow-[0_18px_44px_-26px_rgb(13_20_40/0.45)]'
            : 'border border-white/12 bg-ink-950/55 shadow-[0_20px_50px_-28px_rgb(7_11_24/0.7)]'
        }`}
      >
        <Link
          href="/"
          className={`mr-auto flex items-center gap-2.5 font-display text-[15px] font-extrabold tracking-tight transition-colors duration-500 ${
            scrolled ? 'text-ink-900' : 'text-white'
          }`}
        >
          <Logo scrolled={scrolled} />
          <span className="hidden sm:inline">{client.shortName}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  scrolled
                    ? active
                      ? 'bg-ink-900/[0.07] text-ink-900'
                      : 'text-ink-700 hover:bg-ink-900/[0.05] hover:text-ink-900'
                    : active
                      ? 'bg-white/12 text-white'
                      : 'text-bone-100/75 hover:bg-white/[0.07] hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Cta
          href={`tel:${client.phoneRaw}`}
          external
          icon="phone"
          // White, not copper: the hero's primary CTA owns the one accent
          // colour on screen. Two competing oranges means neither reads as
          // the primary action.
          variant={scrolled ? 'primary' : 'ghost'}
          className="hidden text-sm sm:inline-flex"
          data-analytics="phone_call_click"
          aria-label={`Call ${client.name} on ${client.phone}`}
        >
          <span className="hidden md:inline">{client.phone}</span>
          <span className="md:hidden">Call</span>
        </Cta>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-full transition-colors duration-500 lg:hidden ${
            scrolled
              ? 'bg-ink-900/[0.06] text-ink-900 hover:bg-ink-900/12'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
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
            <Cta
              href={`tel:${client.phoneRaw}`}
              external
              icon="phone"
              variant="ghost"
              data-analytics="phone_call_click"
            >
              {client.phone}
            </Cta>
          </div>
        </nav>
      </div>
    </header>
  );
}

function Logo({ scrolled }: { scrolled?: boolean }) {
  return (
    <span
      className={`grid h-8 w-8 place-items-center rounded-xl transition-colors duration-500 ${
        scrolled ? 'bg-ink-900 text-white' : 'bg-white/12 text-white ring-1 ring-white/15'
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        {/* A droplet over a pipe elbow — reads at 16px, which a detailed
            mark would not. */}
        <path
          d="M12 3.5c2.7 3.2 4.2 5.6 4.2 7.6a4.2 4.2 0 1 1-8.4 0c0-2 1.5-4.4 4.2-7.6Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M4 20.5h6.5a3 3 0 0 0 3-3V16"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

'use client';

import { useId, useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { Eyebrow, Cta } from './ui';

/**
 * "Results we can guarantee" — the reference site's dark tabbed band.
 *
 * Tabs follow the WAI-ARIA tabs pattern properly: roving tabindex, arrow-key
 * navigation with Home/End, and one panel visible at a time. A row of
 * buttons that merely look like tabs is worse than none, because a screen
 * reader user is told nothing about what changed.
 *
 * Panels are all rendered and toggled with hidden rather than unmounted, so
 * switching tabs never re-requests an image.
 */

type Tab = {
  id: string;
  label: string;
  image: string;
  alt: string;
  heading: string;
  body: string;
  stat: string;
  statLabel: string;
};

const tabs: Tab[] = [
  {
    id: 'water-heaters',
    label: 'Water heaters',
    image: '/images/result-waterheater.webp',
    alt: 'Technician servicing the internals of a wall-mounted combi boiler',
    heading: 'Hot water back the same day',
    body: 'Most tank failures are diagnosed and replaced in a single visit. We size the unit to the household rather than the label, and haul the old tank away.',
    stat: '1 visit',
    statLabel: 'typical replacement',
  },
  {
    id: 'drains',
    label: 'Drains',
    image: '/images/result-drains.webp',
    alt: 'Clean grey waste pipework running along a basement wall after clearing',
    heading: 'Cleared, then shown on camera',
    body: 'Every main-line clear ends with a camera pass, so you see whether it was grease, roots, or a broken section — and you get the footage.',
    stat: '< 1 hr',
    statLabel: 'most single-fixture clogs',
  },
  {
    id: 'bathrooms',
    label: 'Bathrooms',
    image: '/images/result-bathroom.webp',
    alt: 'Finished bathroom with wall-hung basin, heated towel rail and walk-in shower',
    heading: 'Renovation plumbing that passes',
    body: 'Rough-in coordinated around your framing schedule, inspected before anything is closed up, and every shut-off labelled when we leave.',
    stat: 'Permit',
    statLabel: 'pulled and closed by us',
  },
  {
    id: 'basements',
    label: 'Basements',
    image: '/images/result-basement.webp',
    alt: 'Dry finished basement with carpet and painted walls',
    heading: 'Dry through the spring melt',
    body: 'Sump pump sized to the lot, battery backup load-tested rather than just installed, and a backwater valve with an access cover you can actually reach.',
    stat: 'Feb',
    statLabel: 'when we test, before melt',
  },
];

export function Results() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = tabs.length - 1;
    const next =
      e.key === 'ArrowRight' ? (active === last ? 0 : active + 1)
      : e.key === 'ArrowLeft' ? (active === 0 ? last : active - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
      <div className="blueprint-field absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute -right-32 top-1/4 h-[30rem] w-[30rem] rounded-full bg-tide-500/12 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <Eyebrow tone="dark">Our work</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-white">
            Results we can guarantee.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-bone-200/70">
            Four things we do most, and what finishing them properly actually looks like.
          </p>
        </div>

        {/* Tab strip. Scrolls horizontally on a phone rather than wrapping to
            two cramped rows. */}
        <div
          role="tablist"
          aria-label="Types of work"
          onKeyDown={onKeyDown}
          className="mt-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((t, i) => {
            const selected = i === active;
            return (
              <button
                key={t.id}
                ref={(el) => { refs.current[i] = el; }}
                role="tab"
                id={`${baseId}-tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${t.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(i)}
                className={`min-h-11 shrink-0 rounded-full px-5 text-sm font-semibold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  selected
                    ? 'bg-white text-ink-900 shadow-[0_10px_30px_-14px_rgb(255_255_255/0.5)]'
                    : 'bg-white/[0.06] text-bone-200/75 ring-1 ring-white/10 hover:bg-white/12 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {tabs.map((t, i) => (
          <div
            key={t.id}
            role="tabpanel"
            id={`${baseId}-panel-${t.id}`}
            aria-labelledby={`${baseId}-tab-${t.id}`}
            hidden={i !== active}
            className="mt-6"
          >
            <div className="grid gap-6 overflow-hidden rounded-[2rem] bg-white/[0.04] p-1.5 ring-1 ring-white/10 lg:grid-cols-[1.25fr_0.75fr]">
              <div className="overflow-hidden rounded-[1.625rem]">
                <img
                  src={asset(t.image)}
                  alt={t.alt}
                  width={1400}
                  height={900}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[14/9] w-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-center p-6 lg:p-8">
                <p className="font-display text-5xl font-extrabold tracking-tight text-tide-300">
                  {t.stat}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-bone-200/45">
                  {t.statLabel}
                </p>
                <h3 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-white">
                  {t.heading}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-bone-200/70">{t.body}</p>
                <Cta href="/quote/" variant="onDark" className="mt-7 self-start">
                  Get a quote
                </Cta>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

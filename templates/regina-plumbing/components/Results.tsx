'use client';

import { useId, useRef, useState } from 'react';
import { asset } from '@/lib/asset';
import { Cta } from './ui';

/**
 * "Results we can guarantee" — the reference site's dark tabbed band.
 *
 * Structure follows the reference: a darkened photograph behind the whole
 * band, a centred heading, underlined text tabs, and a ROW of work photos
 * under them rather than one large image.
 *
 * Tabs follow the WAI-ARIA tabs pattern properly: roving tabindex, arrow
 * keys with Home/End, and one panel visible at a time. A row of buttons that
 * merely looks like tabs tells a screen reader nothing about what changed.
 *
 * Panels stay mounted and toggle with `hidden`, so switching tabs never
 * re-requests an image that has already been fetched.
 */

type Shot = { src: string; alt: string };
type Tab = {
  id: string;
  label: string;
  line: string;
  shots: [Shot, Shot, Shot];
};

const tabs: Tab[] = [
  {
    id: 'water-heaters',
    label: 'Water heaters',
    line: 'Most tank failures are diagnosed and replaced in a single visit — sized to the household, old unit hauled away.',
    shots: [
      { src: '/images/result-waterheater.webp', alt: 'Technician servicing the internals of a wall-mounted combi boiler' },
      { src: '/images/svc-waterheater.webp', alt: 'Installed tankless water heater with its valve manifold below' },
      { src: '/images/plate-valves.webp', alt: 'Labelled isolation valve fitted on a clean white wall' },
    ],
  },
  {
    id: 'drains',
    label: 'Drains',
    line: 'Every main-line clear ends with a camera pass, so you see whether it was grease, roots or a broken section.',
    shots: [
      { src: '/images/result-drains.webp', alt: 'Waste pipework running along a basement wall after clearing' },
      { src: '/images/svc-drain.webp', alt: 'Grey PVC drainage stack and elbows on a wall' },
      { src: '/images/plate-pipe.webp', alt: 'Failed pipe joint dripping before repair' },
    ],
  },
  {
    id: 'bathrooms',
    label: 'Bathrooms',
    line: 'Rough-in coordinated around your framing schedule, inspected before anything is closed up, every shut-off labelled.',
    shots: [
      { src: '/images/result-bathroom.webp', alt: 'Finished bathroom with walk-in shower and wall-hung basin' },
      { src: '/images/svc-bathroom.webp', alt: 'Kitchen mixer tap running over a stainless sink' },
      { src: '/images/plate-technician.webp', alt: 'Plumber tightening a compression fitting beneath a sink' },
    ],
  },
  {
    id: 'basements',
    label: 'Basements',
    line: 'Sump pump sized to the lot, battery backup load-tested rather than just installed, backwater valve left accessible.',
    shots: [
      { src: '/images/result-basement.webp', alt: 'Dry finished basement with carpet and painted walls' },
      { src: '/images/svc-sump.webp', alt: 'Finished basement room kept dry through spring melt' },
      { src: '/images/svc-emergency.webp', alt: 'Dripping tap showing the kind of leak caught before it floods' },
    ],
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
    <section className="relative isolate overflow-hidden py-24 lg:py-32">
      {/* Darkened photograph behind the whole band, as in the reference. */}
      <img
        src={asset('/images/svc-furnace.webp')}
        alt=""
        aria-hidden="true"
        width={1000}
        height={750}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-ink-950/88" aria-hidden="true" />
      <div className="dark-surface absolute inset-0 -z-10" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center rounded-full bg-white/[0.07] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-tide-300 ring-1 ring-white/10">
            Our work
          </p>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-white">
            Results we can guarantee.
          </h2>
        </div>

        {/* Centred underlined tabs. Horizontally scrollable on a phone rather
            than wrapping into two cramped rows. */}
        <div
          role="tablist"
          aria-label="Types of work"
          onKeyDown={onKeyDown}
          className="mt-10 flex justify-start gap-6 overflow-x-auto border-b border-white/10 pb-1 sm:justify-center sm:gap-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                className={`relative min-h-11 shrink-0 px-1 pb-3 text-sm font-semibold transition-colors duration-300 after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-white after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.32,0.72,0,1)] sm:px-2 sm:text-base ${
                  selected
                    ? 'text-white after:scale-x-100'
                    : 'text-bone-200/60 after:scale-x-0 hover:text-white'
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
            className="mt-10"
          >
            {/* Row of work photos. First card spans two columns on a phone so
                the row never collapses into three unreadable slivers. */}
            <ul className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
              {t.shots.map((s, j) => (
                <li
                  key={s.src}
                  className={`overflow-hidden rounded-[1.5rem] bg-white/[0.06] p-1.5 ring-1 ring-white/12 ${
                    j === 0 ? 'col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <img
                    src={asset(s.src)}
                    alt={s.alt}
                    width={1000}
                    height={750}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full rounded-[1.125rem] object-cover"
                  />
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col items-center gap-5 text-center">
              <p className="max-w-2xl text-base leading-relaxed text-bone-200/75">{t.line}</p>
              <Cta href="/quote/" variant="onDark">
                Get a quote
              </Cta>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

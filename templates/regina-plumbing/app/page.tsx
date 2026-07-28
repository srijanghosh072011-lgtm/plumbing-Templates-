import type { Metadata } from 'next';
import Link from 'next/link';
import { client } from '@/lib/client.config';
import { services, areas, process, generalFaqs } from '@/lib/content';
import { graph, faqSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { Reveal } from '@/components/Reveal';
import { Shell, Cta, Eyebrow, CheckIcon, ArrowIcon } from '@/components/ui';

export const metadata: Metadata = {
  title: `Licensed Plumber in ${client.address.locality}, SK | 24/7 Emergency`,
  description:
    'Licensed, insured plumbing and heating in Regina. 24/7 emergency call-out, flat-rate pricing quoted before we start. Drain cleaning, water heaters, furnaces, sump pumps.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      {/* FAQPage schema is safe here because these exact Q&As render below. */}
      <JsonLd data={graph(faqSchema(generalFaqs.slice(0, 4)))} />

      <Hero />
      <TrustBar />
      <ServicesGrid />
      <Process />
      <Coverage />
      <Faq />
      <FinalCta />
    </>
  );
}

/* ── Hero ─────────────────────────────────────────────────────────────────
   Editorial split: type on the left, an asymmetric photo cascade on the
   right. The answer sentence sits in the first paragraph so AI engines
   extracting the opening 150-200 tokens get the full entity description.
   ───────────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink-950 pb-24 pt-36 sm:pt-44 lg:pb-32">
      <div className="blueprint-field absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-32 h-[34rem] w-[34rem] rounded-full bg-tide-500/18 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-40 left-1/4 h-96 w-96 rounded-full bg-copper-500/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-6xl gap-16 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:px-8">
        <div>
          <Reveal>
            <Eyebrow tone="dark">
              <span className="h-1.5 w-1.5 rounded-full bg-copper-400" />
              {client.address.locality}, Saskatchewan · Est. {client.foundedYear}
            </Eyebrow>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-6 font-display text-[clamp(2.75rem,7vw,4.75rem)] font-extrabold leading-[0.94] tracking-[-0.04em] text-white">
              Water where it
              <br />
              shouldn&apos;t be?
              <br />
              <span className="text-tide-400">We&apos;re on it.</span>
            </h1>
          </Reveal>

          <Reveal delay={150}>
            {/* The answer paragraph — first 150-200 words, plain prose. */}
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-bone-200/75">
              {client.answerSentence}
            </p>
          </Reveal>

          <Reveal delay={210}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Cta
                href={`tel:${client.phoneRaw}`}
                external
                icon="phone"
                variant="onDark"
                data-analytics="phone_call_click"
                aria-label={`Call ${client.name} now on ${client.phone}`}
              >
                Call {client.phone}
              </Cta>
              <Cta href="/quote/" variant="ghost">
                Get a fast quote
              </Cta>
            </div>
          </Reveal>

          <Reveal delay={280}>
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-bone-200/60">
              {[
                'Licensed & insured',
                'Flat-rate, quoted upfront',
                '24/7 emergency call-out',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckIcon className="h-4 w-4 text-copper-400" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Z-axis photo cascade. Rotations and overlaps are md+ only — on a
            phone they collapse to a clean stack, because overlapping cards
            create touch-target conflicts. */}
        <Reveal delay={120} className="relative">
          <div className="relative mx-auto grid max-w-md grid-cols-2 gap-4 md:max-w-none">
            <HeroPlate
              src="/images/hero-technician.webp"
              alt="Licensed plumber fitting a copper supply line under a kitchen sink"
              className="md:translate-y-8 md:-rotate-2"
              priority
            />
            <HeroPlate
              src="/images/hero-waterheater.webp"
              alt="Newly installed gas water heater with labelled shut-off valves"
              className="md:rotate-1"
            />
            <HeroPlate
              src="/images/hero-drain.webp"
              alt="Drain camera inspection footage showing a cleared sewer line"
              className="col-span-2 md:-rotate-1"
              wide
            />
          </div>

          {/* Floating proof chip, overlapping the cascade. */}
          <div className="mt-6 md:absolute md:-bottom-8 md:-left-6 md:mt-0">
            <div className="rounded-[2rem] bg-white/[0.06] p-1.5 ring-1 ring-white/12 backdrop-blur-xl">
              <div className="rounded-[1.625rem] bg-ink-900/90 px-5 py-4">
                <p className="font-display text-2xl font-extrabold tracking-tight text-white">
                  60–90 min
                </p>
                <p className="mt-0.5 text-xs text-bone-200/60">
                  typical emergency arrival in Regina
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function HeroPlate({
  src,
  alt,
  className = '',
  wide,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  wide?: boolean;
  priority?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[1.75rem] bg-white/[0.05] p-1.5 ring-1 ring-white/12 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] ${className}`}
    >
      {/* Plain <img>: static export cannot run the optimizer, and these are
          pre-encoded WebP. Explicit dimensions hold the box so nothing
          shifts when they decode (CLS). */}
      <img
        src={src}
        alt={alt}
        width={wide ? 640 : 320}
        height={wide ? 360 : 400}
        loading={priority ? 'eager' : 'lazy'}
        // The hero image is the LCP candidate on mobile — tell the browser.
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className="h-full w-full rounded-[1.375rem] object-cover"
      />
    </div>
  );
}

/* ── Trust bar ───────────────────────────────────────────────────────── */
function TrustBar() {
  const stats = [
    { v: `${new Date().getFullYear() - client.foundedYear}+`, l: 'years serving Regina' },
    { v: '24/7', l: 'emergency availability' },
    { v: 'Flat', l: 'rate, quoted before work' },
    { v: `${client.serviceRadiusKm} km`, l: 'service radius' },
  ];
  return (
    <section className="border-b border-ink-900/[0.07] bg-bone-100">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-6 lg:grid-cols-4 lg:px-8">
        {stats.map((s, i) => (
          <Reveal key={s.l} delay={i * 70} className="py-8 text-center lg:py-10">
            <p className="font-display text-3xl font-extrabold tracking-tight text-ink-900 lg:text-4xl">
              {s.v}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-ink-500">{s.l}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Services ─────────────────────────────────────────────────────────────
   The source template's "How Can We Best Serve You?" section, rebuilt as an
   asymmetric bento rather than an even card row.
   ───────────────────────────────────────────────────────────────────────── */
function ServicesGrid() {
  return (
    <section className="bg-bone-50 py-24 lg:py-36" id="services">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <Eyebrow>What we do</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink-900">
            How can we best serve you?
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-700">
            Six things we do, every day, across Regina and area. Every job is quoted flat-rate
            in writing before we pick up a tool.
          </p>
        </Reveal>

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 90} as="li">
              <Shell as="div" className="h-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
                <Link
                  href={`/services/${s.slug}/`}
                  className="group flex h-full flex-col p-7"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-tide-50 text-tide-600 ring-1 ring-tide-100">
                    <ServiceIcon slug={s.slug} />
                  </span>

                  <h3 className="mt-6 font-display text-xl font-extrabold tracking-tight text-ink-900">
                    {s.name}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">{s.short}</p>

                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-900">
                    Learn more
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-ink-900/[0.06] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-px">
                      <ArrowIcon className="h-3 w-3" />
                    </span>
                  </span>
                </Link>
              </Shell>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Process ──────────────────────────────────────────────────────────────
   The "01 / 02 / 03" band from the source, with the numerals treated as
   oversized outlined type rather than filled headings.
   ───────────────────────────────────────────────────────────────────────── */
function Process() {
  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 lg:py-36">
      <div className="blueprint-field absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-tide-500/12 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <Eyebrow tone="dark">How it works</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-white">
            No waiting on a callback that never comes.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-bone-200/70">
            Three steps, no surprises, and a real person on the phone at every one of them.
          </p>
        </Reveal>

        <ol className="mt-14 grid gap-5 lg:grid-cols-3">
          {process.map((step, i) => (
            <Reveal key={step.n} delay={i * 110} as="li">
              <div className="h-full rounded-[2rem] bg-white/[0.04] p-1.5 ring-1 ring-white/10">
                <div className="h-full rounded-[1.625rem] bg-ink-900/60 p-8 shadow-[inset_0_1px_1px_rgb(255_255_255/0.07)]">
                  <span
                    className="block font-display text-6xl font-extrabold leading-none tracking-tight text-transparent lg:text-7xl"
                    style={{ WebkitTextStroke: '1.5px rgb(77 155 234 / 0.65)' }}
                    aria-hidden="true"
                  >
                    {step.n}
                  </span>
                  <h3 className="mt-6 font-display text-xl font-extrabold tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-bone-200/70">{step.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Coverage ─────────────────────────────────────────────────────────── */
function Coverage() {
  return (
    <section className="bg-bone-100 py-24 lg:py-36">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
        <Reveal>
          <Eyebrow>Where we work</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink-900">
            Regina and {client.serviceRadiusKm} km around it.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-700">
            We cover the city and the surrounding communities. Outside that radius, call
            anyway — we will tell you honestly whether we can reach you in a useful
            timeframe rather than book you and disappoint you.
          </p>
          <Cta href="/service-areas/" variant="ghost" className="mt-8">
            See all service areas
          </Cta>
        </Reveal>

        <Reveal delay={120}>
          <ul className="grid gap-4 sm:grid-cols-2">
            {areas.map((a) => (
              <li key={a.slug}>
                <Shell className="h-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
                  <Link href={`/service-areas/${a.slug}/`} className="group block p-6">
                    <h3 className="font-display text-lg font-extrabold tracking-tight text-ink-900">
                      {a.name}
                    </h3>
                    <p className="mt-1.5 text-sm text-ink-500">
                      ~{a.driveMinutes} min from base
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-tide-600">
                      Local details
                      <ArrowIcon className="h-3 w-3 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </Shell>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ── FAQ ──────────────────────────────────────────────────────────────────
   Native <details>. No JS, works before hydration, keyboard-operable and
   screen-reader-correct for free.
   ───────────────────────────────────────────────────────────────────────── */
function Faq() {
  return (
    <section className="bg-bone-50 py-24 lg:py-36">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <Reveal>
          <Eyebrow>Common questions</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink-900">
            Straight answers.
          </h2>
          <p className="mt-5 text-ink-700">
            The questions we get asked before anyone books.{' '}
            <Link href="/faq/" className="font-semibold text-ink-900 underline underline-offset-4">
              See all
            </Link>
            .
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="space-y-3">
            {generalFaqs.slice(0, 4).map((f) => (
              <Shell key={f.q}>
                <details className="group p-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-lg font-bold tracking-tight text-ink-900 [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink-900/[0.06] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-open:rotate-45"
                    >
                      <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
                        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-sm leading-relaxed text-ink-700">{f.a}</p>
                </details>
              </Shell>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Final CTA ────────────────────────────────────────────────────────── */
function FinalCta() {
  return (
    <section className="bg-bone-50 pb-24 lg:pb-36">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink-950 px-8 py-16 text-center sm:px-16 lg:py-24">
            <div className="blueprint-field absolute inset-0" aria-hidden="true" />
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-tide-500/20 blur-3xl"
            />
            <div className="relative">
              <Eyebrow tone="dark">{client.emergencyNote}</Eyebrow>
              <h2 className="mx-auto mt-6 max-w-2xl font-display text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-white">
                Get it fixed properly, the first time.
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-lg text-bone-200/70">
                Call for anything urgent. For planned work, send a request and we will get
                back to you with a flat price.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Cta
                  href={`tel:${client.phoneRaw}`}
                  external
                  icon="phone"
                  variant="onDark"
                  data-analytics="phone_call_click"
                >
                  Call {client.phone}
                </Cta>
                <Cta href="/quote/" variant="ghost">
                  Request a quote
                </Cta>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* Ultra-light line icons, one per service. */
function ServiceIcon({ slug }: { slug: string }) {
  const paths: Record<string, string> = {
    'emergency-plumbing': 'M12 2.5 3.5 12h5l-1.5 9.5L20.5 11h-5.5l2-8.5Z',
    'drain-cleaning': 'M4 5.5h16M6.5 5.5v9a5.5 5.5 0 0 0 11 0v-9M12 20v1.5',
    'water-heater-repair': 'M7 3.5h10v17H7zM10.5 7.5h3M9.5 20.5v1.5M14.5 20.5v1.5',
    'furnace-heating': 'M5 3.5h14v17H5zM9 8h6M9 12h6M10 20.5v1.5M14 20.5v1.5',
    'bathroom-kitchen-plumbing': 'M5 11h14v3a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6zM9 11V5a2.5 2.5 0 0 1 5 0',
    'sump-pumps-backwater-valves': 'M4 20.5h16M8 20.5V9l4-5.5L16 9v11.5M10.5 13.5h3',
  };
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d={paths[slug] ?? paths['emergency-plumbing']}
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

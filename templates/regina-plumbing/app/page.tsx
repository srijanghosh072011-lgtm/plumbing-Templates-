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
  // Keep under 160 characters or Google truncates it in the SERP.
  description:
    'Licensed, insured plumbing and heating in Regina. 24/7 emergency call-out, flat-rate pricing quoted before we start. Drains, water heaters, furnaces.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      {/* FAQPage schema is safe here because these exact Q&As render below. */}
      <JsonLd data={graph(faqSchema(generalFaqs.slice(0, 4)))} />

      <Hero />
      <Intro />
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
   Full-bleed photograph, darkened, with a centred content stack in front of
   it — the structure of the reference site. Everything is centred and
   stacked, which is also why it survives the drop to a phone: there is no
   two-column layout to collapse, the type just gets smaller.

   Deliberately ONE call to action. The reference had one, and a hero that
   offers four things gets none of them clicked.
   ───────────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Background photograph. Not a CSS background-image: an <img> can be
          preloaded and given fetchpriority, and this is the LCP element. */}
      <img
        src="/images/hero-bg.webp"
        alt=""
        aria-hidden="true"
        width={2400}
        height={1600}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />

      {/* Tint stack: a flat wash for colour, then a vertical gradient that
          darkens the top (behind the nav) and the bottom (handing off to the
          white section below) while letting the middle of the photograph
          stay legible. A hero photo nobody can see is just an expensive
          background colour.

          The three layers compose so that even a PURE WHITE photograph
          leaves the headline area at rgb(50,53,64) — white text at 12.2:1.
          That means swapping in any client photo is safe without re-testing
          contrast, which is the whole point of doing it in layers. */}
      <div className="absolute inset-0 -z-10 bg-ink-950/45" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/75 via-ink-950/30 to-ink-950/80"
        aria-hidden="true"
      />
      {/* Radial vignette concentrates contrast behind the headline itself. */}
      <div
        className="absolute inset-0 -z-10 [background:radial-gradient(ellipse_60%_50%_at_50%_45%,rgb(7_11_24/0.55),transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-4xl px-6 py-32 text-center sm:py-36">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-tide-300 ring-1 ring-white/15 backdrop-blur-sm sm:text-[11px]">
            <span className="h-1.5 w-1.5 rounded-full bg-copper-400" />
            Welcome to {client.name}
          </p>
        </Reveal>

        <Reveal delay={90}>
          {/* All-caps, tight, centred — the reference's defining move.
              clamp() means no breakpoint jumps between 360px and 1440px. */}
          <h1 className="mt-7 font-display text-[clamp(2.5rem,8.5vw,5.5rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-white">
            Top rated plumbing
            <br className="hidden sm:block" />{' '}
            <span className="text-tide-300">&amp; heating</span> in {client.address.locality}
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-bone-100/85 sm:text-lg">
            {/* Social proof, mirroring the reference's review line. The count
                is a placeholder because an invented review count is a lie
                that Google can check. */}
            TODO_REVIEW_COUNT+ reviews across Google and Facebook. Licensed, insured, and
            answering the phone 24/7.
          </p>
        </Reveal>

        <Reveal delay={230}>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Cta href="/quote/" variant="onDark" className="w-full justify-center sm:w-auto">
              Get a fast quote
            </Cta>
            <Cta
              href={`tel:${client.phoneRaw}`}
              external
              icon="phone"
              variant="ghost"
              className="w-full justify-center sm:w-auto"
              data-analytics="phone_call_click"
              aria-label={`Call ${client.name} on ${client.phone}`}
            >
              {client.phone}
            </Cta>
          </div>
        </Reveal>

        <Reveal delay={300}>
          <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2.5 text-sm text-bone-100/65">
            {['Licensed & insured', 'Flat-rate pricing', '24/7 emergency'].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-copper-400" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Intro ────────────────────────────────────────────────────────────────
   The reference's "Serving Professional Washing Services" band: photo
   collage left, headline and feature rows right. This is where the answer
   paragraph lives now — still inside the first screenful of prose, so the
   AEO opening is intact even though the hero above it is image-led.
   ───────────────────────────────────────────────────────────────────────── */
function Intro() {
  const points = [
    { t: 'Licensed journeyman plumbers', d: 'Every technician is ticketed, insured and WCB-covered. Ask us for the numbers — they are on the About page.' },
    { t: `${new Date().getFullYear() - client.foundedYear}+ years in Regina`, d: 'We know which neighbourhoods have clay laterals, which have high water tables, and what freezes first at −35.' },
  ];

  return (
    <section className="bg-bone-50 py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16 lg:px-8">
        {/* Collage. Rotations and overlaps are md+ only — on a phone they
            become a plain 2-up grid, because overlapping cards create
            touch-target conflicts and unpredictable tap zones. */}
        <Reveal className="relative">
          <div
            aria-hidden="true"
            className="absolute -left-4 -top-4 hidden h-40 w-40 rounded-3xl bg-tide-100/70 md:block"
          />
          <div className="relative grid grid-cols-2 gap-4">
            <IntroPlate
              src="/images/hero-technician.webp"
              alt="Licensed plumber fitting a copper supply line under a kitchen sink"
              className="md:-rotate-2"
            />
            <IntroPlate
              src="/images/hero-waterheater.webp"
              alt="Newly installed gas water heater with labelled shut-off valves"
              className="md:mt-10 md:rotate-1"
            />
            <IntroPlate
              src="/images/hero-drain.webp"
              alt="Drain camera footage showing a cleared sewer line"
              className="col-span-2 md:-mt-4 md:-rotate-1"
              wide
            />
          </div>
        </Reveal>

        <Reveal delay={110}>
          <Eyebrow>{client.name}</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink-900">
            Serving Regina homes,
            <br className="hidden sm:block" /> properly.
          </h2>

          {/* The answer paragraph — the entity description AI engines lift. */}
          <p className="mt-6 text-lg leading-relaxed text-ink-700">{client.answerSentence}</p>

          <ul className="mt-8 space-y-5">
            {points.map((p) => (
              <li key={p.t} className="flex gap-4">
                <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-tide-50 text-tide-600 ring-1 ring-tide-100">
                  <CheckIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-display text-lg font-extrabold tracking-tight text-ink-900">
                    {p.t}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-700">{p.d}</span>
                </span>
              </li>
            ))}
          </ul>

          <Cta href="/services/" className="mt-9">
            See what we do
          </Cta>
        </Reveal>
      </div>
    </section>
  );
}

function IntroPlate({
  src,
  alt,
  className = '',
  wide,
}: {
  src: string;
  alt: string;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[1.5rem] bg-white p-1.5 shadow-[0_20px_50px_-28px_rgb(13_20_40/0.45)] ring-1 ring-ink-900/[0.07] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.02] ${className}`}
    >
      {/* Plain <img>: static export has no image optimizer, and these are
          pre-encoded WebP. Explicit dimensions hold the box during decode. */}
      <img
        src={src}
        alt={alt}
        width={wide ? 640 : 320}
        height={wide ? 360 : 400}
        loading="lazy"
        decoding="async"
        className="h-full w-full rounded-[1.125rem] object-cover"
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

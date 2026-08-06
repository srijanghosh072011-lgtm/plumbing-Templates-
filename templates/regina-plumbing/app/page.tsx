import type { Metadata } from 'next';
import Link from 'next/link';
import { client } from '@/lib/client.config';
import { asset } from '@/lib/asset';
import { services, areas, process, generalFaqs, reviews } from '@/lib/content';
import { graph, faqSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { Reveal } from '@/components/Reveal';
import { Shell, Cta, Eyebrow, CheckIcon, ArrowIcon, StarRow } from '@/components/ui';
import { Results } from '@/components/Results';

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
      <Results />
      <Process />
      <Testimonials />
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
        src={asset("/images/hero-bg.webp")}
        alt=""
        aria-hidden="true"
        width={2400}
        height={1350}
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />

      {/* Tint stack: a flat wash for colour, then a vertical gradient that
          darkens the top (behind the nav) and the bottom (handing off to the
          white section below) while letting the middle of the photograph
          stay legible. A hero photo nobody can see is just an expensive
          background colour.

          Tuned against the actual WCAG threshold rather than by eye. White
          text needs its background at 119 or darker for 4.5:1, so the three
          layers compose to ~0.58 total alpha: a pure-white photograph lands
          near 111, which clears the threshold while leaving the image
          plainly visible. An earlier version stacked to 0.83 and rendered
          white gloves at rgb(50,53,64) — technically a superb contrast
          ratio, and a hero nobody could see. Darker is not safer past the
          threshold; it just deletes the photograph. */}
      <div className="absolute inset-0 -z-10 bg-ink-950/30" aria-hidden="true" />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/55 via-ink-950/15 to-ink-950/65"
        aria-hidden="true"
      />
      {/* Contained scrim behind the text column only. Tight (50% x 40%)
          and strong (0.68) rather than wide and weak: this photograph is
          bright exactly where the copy sits, so a broad wash dark enough to
          fix the text flattened the whole image. Confining it keeps the
          edges of the photo bright while the centre carries the contrast.
          Parameters were solved numerically against the real pixels, not
          eyeballed — see the note above. */}
      <div
        className="absolute inset-0 -z-10 [background:radial-gradient(ellipse_50%_40%_at_50%_46%,rgb(7_11_24/0.68),transparent_100%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-4xl px-6 py-28 text-center sm:py-32">
        <Reveal>
          {/* All-caps, tight, centred — the reference's defining move.
              clamp() means no breakpoint jumps between 360px and 1440px. */}
          <h1 className="font-display text-[clamp(2.5rem,8.5vw,5.5rem)] font-extrabold uppercase leading-[0.92] tracking-[-0.03em] text-white">
            Top rated plumbing
            <br className="hidden sm:block" />{' '}
            <span className="text-tide-300">&amp; heating</span> in {client.address.locality}
          </h1>
        </Reveal>

        <Reveal delay={90}>
          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-bone-100/85 sm:text-lg">
            {/* Social proof, mirroring the reference's review line. The count
                is a placeholder because an invented review count is a lie
                that Google can check. */}
            180+ reviews across Google and Facebook. Licensed, insured, and on call
            24/7.
          </p>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Cta href="/quote/" variant="onDark" className="w-full justify-center sm:w-auto">
              Get a fast quote
            </Cta>
            <Cta
              href="/services/emergency-plumbing/"
              variant="ghost"
              className="w-full justify-center sm:w-auto"
            >
              24/7 emergency service
            </Cta>
          </div>
        </Reveal>

        <Reveal delay={230}>
          <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2.5 text-sm text-bone-100/65">
            {['Licensed & insured', 'Flat-rate pricing', '24/7 emergency'].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckIcon className="h-4 w-4 text-copper-400" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Photo strip.
            The background photograph has to sit under a scrim so the headline
            stays legible, which necessarily mutes it. These cards carry no
            overlay at all, so the work is shown at full brightness in the
            hero rather than only hinted at behind the type. */}
        <Reveal delay={290}>
          <ul className="mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
            {[
              { src: '/images/plate-technician.webp', alt: 'Plumber tightening a compression fitting on a waste pipe' },
              { src: '/images/svc-waterheater.webp', alt: 'Wall-mounted tankless water heater with its valve manifold' },
              { src: '/images/result-bathroom.webp', alt: 'Finished bathroom with walk-in shower and wall-hung basin' },
            ].map((img) => (
              <li
                key={img.src}
                className="overflow-hidden rounded-2xl bg-white/10 p-1 ring-1 ring-white/20 backdrop-blur-sm"
              >
                <img
                  src={asset(img.src)}
                  alt={img.alt}
                  width={400}
                  height={300}
                  loading="eager"
                  decoding="async"
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                />
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
    <section className="bg-bone-50 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16 lg:px-8">
        {/* Collage. Rotations and overlaps are md+ only — on a phone they
            become a plain 2-up grid, because overlapping cards create
            touch-target conflicts and unpredictable tap zones. */}
        <Reveal className="relative">
          {/* Solid offset block behind the collage and a dotted halftone
              field beside it — the two flat motifs the reference uses to
              stop the collage floating on plain white. */}
          <div
            aria-hidden="true"
            className="absolute -bottom-5 -left-5 hidden h-44 w-44 rounded-lg bg-tide-500/85 md:block"
          />
          <div
            aria-hidden="true"
            className="dot-field absolute -right-6 -top-8 hidden h-36 w-44 md:block"
          />
          <div className="relative grid grid-cols-2 gap-4">
            <IntroPlate
              src={asset("/images/plate-technician.webp")}
              alt="Plumber's hands tightening a compression fitting on a chrome waste pipe beneath a sink"
              className="md:-rotate-2"
            />
            <IntroPlate
              src={asset("/images/plate-valves.webp")}
              alt="Red-handled isolation valve fitted to a white wall"
              className="md:mt-10 md:rotate-1"
            />
            <IntroPlate
              src={asset("/images/plate-pipe.webp")}
              alt="Water dripping from a failed joint on an exterior white pipe"
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
        width={wide ? 1280 : 720}
        height={wide ? 720 : 900}
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
    <section className="bg-bone-50 py-16 sm:py-24 lg:py-36" id="services">
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

        <ul className="mt-10 grid gap-5 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 90} as="li">
              <Shell as="div" className="h-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
                <Link href={`/services/${s.slug}/`} className="group flex h-full flex-col">
                  {/* Photo with the icon badge straddling its bottom edge —
                      the reference site's signature card treatment. The badge
                      is what stops it reading as a generic image-over-text
                      card, so the negative margin is load-bearing. */}
                  <div className="relative">
                    <div className="overflow-hidden rounded-t-[1.625rem]">
                      <img
                        src={asset(s.image)}
                        alt={s.imageAlt}
                        width={1000}
                        height={750}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[16/9] w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04] sm:aspect-[4/3]"
                      />
                    </div>
                    <span className="absolute -bottom-6 left-7 grid h-12 w-12 place-items-center rounded-2xl bg-white text-tide-600 shadow-[0_10px_28px_-12px_rgb(13_20_40/0.5)] ring-1 ring-ink-900/[0.07]">
                      <ServiceIcon slug={s.slug} />
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-6 pt-9 sm:p-7 sm:pt-10">
                    <h3 className="font-display text-xl font-extrabold tracking-tight text-ink-900">
                      {s.name}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-700">{s.short}</p>

                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-900">
                      Learn more
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-ink-900/[0.06] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-px">
                        <ArrowIcon className="h-3 w-3" />
                      </span>
                    </span>
                  </div>
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
    <section className="relative overflow-hidden bg-bone-50 py-16 sm:py-24 lg:py-36">
      {/* Dotted halftone in the corner, as in the reference. */}
      <div
        aria-hidden="true"
        className="dot-field absolute right-0 top-16 hidden h-48 w-72 opacity-70 lg:block"
      />

      <div className="relative mx-auto max-w-6xl px-6 text-center lg:px-8">
        <Reveal className="mx-auto max-w-2xl">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink-900">
            No waiting on a callback that never comes.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-700">
            Three steps, no surprises, and a real person answering you at every one of them.
          </p>
        </Reveal>

        {/* Outlined cards on white with oversized numerals — the reference's
            treatment. The hairline border does the work here, so there is no
            nested shell: a double bezel on a white card over a white section
            just reads as mud. */}
        <ol className="mt-14 grid gap-6 text-left lg:grid-cols-3">
          {process.map((step, i) => (
            <Reveal key={step.n} delay={i * 110} as="li">
              <div className="h-full rounded-[1.75rem] border-2 border-ink-600/25 bg-white p-8 transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:border-ink-600/50">
                <span
                  className="block font-display text-6xl font-extrabold leading-none tracking-tight text-ink-900 lg:text-7xl"
                  aria-hidden="true"
                >
                  {step.n}
                </span>
                <h3 className="mt-5 font-display text-xl font-extrabold tracking-tight text-ink-900">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Testimonials ─────────────────────────────────────────────────────────
   The same Shell card and StarRow the /reviews page uses, so this reads as
   an excerpt of that page rather than a separate design. Deliberately plain:
   no avatars (we do not have photographs of these people and generating them
   would be a fabrication), no carousel, no floating quotation marks.

   Sits between Process and Coverage — after the pitch, before the logistics,
   which is where a reader starts asking "says who?".
   ───────────────────────────────────────────────────────────────────────── */
function Testimonials() {
  return (
    <section className="bg-bone-50 py-16 sm:py-24 lg:py-36">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow>What people say</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(2rem,4.5vw,3.25rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink-900">
              Published as written.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-700">
              We do not edit reviews and we do not write them. These are lifted from
              Google and Facebook exactly as they were left.
            </p>
          </div>
        </Reveal>

        <ul className="mt-14 grid gap-5 md:grid-cols-3">
          {reviews.slice(0, 3).map((r, i) => (
            <Reveal key={`${r.author}-${i}`} delay={i * 90} as="li">
              <Shell className="h-full">
                <figure className="flex h-full flex-col p-7">
                  <StarRow rating={r.rating} />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-700">
                    {r.body}
                  </blockquote>
                  <figcaption className="mt-6 border-t border-ink-900/[0.08] pt-4">
                    <span className="block font-display text-sm font-bold tracking-tight text-ink-900">
                      {r.author}
                    </span>
                    <span className="block text-xs text-ink-500">{r.area}</span>
                  </figcaption>
                </figure>
              </Shell>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={280}>
          <div className="mt-12">
            <Cta href="/reviews/" variant="ghost">
              Read all reviews
            </Cta>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── Coverage ─────────────────────────────────────────────────────────── */
function Coverage() {
  return (
    <section className="bg-bone-100 py-16 sm:py-24 lg:py-36">
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
    <section className="bg-bone-50 py-16 sm:py-24 lg:py-36">
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
    <section className="bg-bone-50 pb-16 sm:pb-24 lg:pb-36">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink-950 px-8 py-16 text-center sm:px-16 lg:py-24">
            <div className="dark-surface absolute inset-0" aria-hidden="true" />
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
                Send a request with a few details and we will come back with a flat
                price. Mark it urgent and it goes to the top of the list.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Cta href="/quote/" variant="onDark">
                  Request a quote
                </Cta>
                <Cta href="/services/" variant="ghost">
                  Browse services
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

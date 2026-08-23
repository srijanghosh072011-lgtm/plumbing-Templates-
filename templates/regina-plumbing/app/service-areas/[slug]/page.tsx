import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { client } from '@/lib/client.config';
import { areas, services } from '@/lib/content';
import { graph, breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { Reveal } from '@/components/Reveal';
import { QuoteForm } from '@/components/QuoteForm';
import { Shell, Cta, Eyebrow } from '@/components/ui';
import { PageHero, LastUpdated } from '@/components/blocks';

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = areas.find((a) => a.slug === slug);
  if (!area) return {};

  return {
    title: `Plumber in ${area.name}, SK | 24/7 Emergency`,
    description: area.answer.slice(0, 158),
    alternates: { canonical: `/service-areas/${area.slug}/` },
  };
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const area = areas.find((a) => a.slug === slug);
  if (!area) notFound();

  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Service Areas', path: '/service-areas/' },
    { name: area.name, path: `/service-areas/${area.slug}/` },
  ];

  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(trail))} />

      <PageHero
        eyebrow={`${area.name}, Saskatchewan`}
        title={`Plumber in ${area.name}`}
        lede={area.answer}
        trail={trail}
      >
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Cta href="#quote" variant="onDark">
            Get a quote
          </Cta>
          <Cta href="/service-areas/" variant="ghost">
            All service areas
          </Cta>
        </div>
      </PageHero>

      <section className="bg-bone-50 py-14 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div>
            <Reveal>
              <h2 className="font-display text-3xl font-extrabold tracking-[-0.03em] text-ink-900">
                Plumbing in {area.name}
              </h2>
              <div className="mt-6 space-y-5">
                {area.body.map((p) => (
                  <p key={p.slice(0, 24)} className="text-lg leading-relaxed text-ink-700">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            {area.neighbourhoods && (
              <Reveal delay={90}>
                <h2 className="mt-14 font-display text-2xl font-extrabold tracking-[-0.03em] text-ink-900">
                  Neighbourhoods we cover
                </h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {area.neighbourhoods.map((n) => (
                    <li
                      key={n}
                      className="rounded-full bg-ink-900/[0.05] px-3.5 py-1.5 text-sm text-ink-700"
                    >
                      {n}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            <LastUpdated />
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={120}>
              <Shell>
                <div className="p-7">
                  <Eyebrow>Response time</Eyebrow>
                  <p className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink-900">
                    ~{area.driveMinutes} min
                  </p>
                  <p className="mt-1 text-sm text-ink-500">typical drive from base</p>
                  <p className="mt-4 text-sm leading-relaxed text-ink-700">
                    Winter road conditions change this. We give you a realistic arrival time
                    up front rather than an optimistic one.
                  </p>
                </div>
              </Shell>
            </Reveal>

            <Reveal delay={170}>
              <Shell className="mt-5">
                <div className="p-7">
                  <h2 className="font-display text-lg font-extrabold tracking-tight text-ink-900">
                    Services in {area.name}
                  </h2>
                  <ul className="mt-4 space-y-2">
                    {services.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/services/${s.slug}/`}
                          className="text-sm text-ink-700 underline-offset-4 hover:text-ink-900 hover:underline"
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </Shell>
            </Reveal>
          </aside>
        </div>
      </section>

      <section id="quote" className="scroll-mt-28 bg-bone-100 py-14 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Reveal className="text-center">
            <Eyebrow>Get a quote</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(1.85rem,4vw,2.75rem)] font-extrabold tracking-[-0.035em] text-ink-900">
              Book a {area.name} plumber
            </h2>
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <QuoteForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}

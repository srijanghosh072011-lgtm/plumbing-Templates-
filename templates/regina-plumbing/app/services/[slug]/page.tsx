import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { client } from '@/lib/client.config';
import { services, areas } from '@/lib/content';
import { graph, serviceSchema, faqSchema, breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { Reveal } from '@/components/Reveal';
import { QuoteForm } from '@/components/QuoteForm';
import { Shell, Cta, Eyebrow, CheckIcon } from '@/components/ui';
import { Breadcrumbs, LastUpdated, FaqList } from '@/components/blocks';

/** Static export needs every route enumerated at build time. */
export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};

  return {
    // ~55 chars: "<Service> Regina | <Business>" via the layout template.
    title: `${service.name} in ${client.address.locality}, SK`,
    description: service.answer.slice(0, 158),
    alternates: { canonical: `/services/${service.slug}/` },
    openGraph: {
      title: `${service.name} in ${client.address.locality}, SK`,
      description: service.answer.slice(0, 158),
      url: `/services/${service.slug}/`,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const others = services.filter((s) => s.slug !== slug);

  return (
    <>
      <JsonLd
        data={graph(
          serviceSchema(service),
          faqSchema(service.faqs),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Services', path: '/services/' },
            { name: service.name, path: `/services/${service.slug}/` },
          ]),
        )}
      />

      <section className="relative overflow-hidden bg-ink-950 pb-20 pt-32 sm:pt-40">
        <div className="dark-surface absolute inset-0" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-tide-500/15 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8">
          <Breadcrumbs
            tone="dark"
            trail={[
              { name: 'Home', path: '/' },
              { name: 'Services', path: '/services/' },
              { name: service.name, path: `/services/${service.slug}/` },
            ]}
          />
          <Reveal>
            <h1 className="mt-6 font-display text-[clamp(2.25rem,6vw,4rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-white">
              {service.name} in {client.address.locality}
            </h1>
          </Reveal>
          <Reveal delay={80}>
            {/* Direct answer, first thing after the H1. Playbook 3. */}
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone-200/80">
              {service.answer}
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Cta
                href={`tel:${client.phoneRaw}`}
                external
                icon="phone"
                variant="onDark"
                data-analytics="phone_call_click"
              >
                Call {client.phone}
              </Cta>
              <Cta href="#quote" variant="ghost">
                Get a quote
              </Cta>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-bone-50 py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div>
            <Reveal>
              <div className="prose-plumb space-y-5">
                {service.body.map((p) => (
                  <p key={p.slice(0, 24)} className="text-lg leading-relaxed text-ink-700">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={90}>
              <h2 className="mt-14 font-display text-3xl font-extrabold tracking-[-0.03em] text-ink-900">
                What&apos;s included
              </h2>
              <ul className="mt-6 space-y-3">
                {service.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-ink-700">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-tide-50 text-tide-600 ring-1 ring-tide-100">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={90}>
              <h2 className="mt-14 font-display text-3xl font-extrabold tracking-[-0.03em] text-ink-900">
                {service.name} questions
              </h2>
              <FaqList faqs={service.faqs} className="mt-6" />
            </Reveal>

            <LastUpdated />
          </div>

          {/* Sticky pricing + area rail. */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal delay={120}>
              <Shell>
                <div className="p-7">
                  <Eyebrow>Typical cost</Eyebrow>
                  <p className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink-900">
                    ${service.priceLow}–${service.priceHigh}
                  </p>
                  <p className="mt-1 text-sm text-ink-500">{service.priceUnit}</p>
                  <p className="mt-4 text-sm leading-relaxed text-ink-700">
                    Every job is quoted flat-rate in writing on site before work starts. The
                    range above is what most Regina jobs land in — it is not a quote.
                  </p>
                  <Cta href="#quote" variant="primary" className="mt-6 w-full justify-between">
                    Get an exact price
                  </Cta>
                </div>
              </Shell>
            </Reveal>

            <Reveal delay={170}>
              <Shell className="mt-5">
                <div className="p-7">
                  <h2 className="font-display text-lg font-extrabold tracking-tight text-ink-900">
                    Available in
                  </h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {areas.map((a) => (
                      <li key={a.slug}>
                        <Link
                          href={`/service-areas/${a.slug}/`}
                          className="inline-flex min-h-9 items-center rounded-full bg-ink-900/[0.05] px-3.5 text-sm text-ink-700 transition-colors hover:bg-ink-900/10 hover:text-ink-900"
                        >
                          {a.name}
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

      <section id="quote" className="scroll-mt-28 bg-bone-100 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Reveal className="text-center">
            <Eyebrow>Get a quote</Eyebrow>
            <h2 className="mt-5 font-display text-[clamp(1.85rem,4vw,2.75rem)] font-extrabold tracking-[-0.035em] text-ink-900">
              Request a price for {service.name.toLowerCase()}
            </h2>
            <p className="mt-4 text-ink-700">
              Emergency? Call {client.phone} instead — we answer 24/7.
            </p>
          </Reveal>
          <Reveal delay={100} className="mt-10">
            <QuoteForm defaultService={service.name} />
          </Reveal>
        </div>
      </section>

      <section className="bg-bone-50 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold tracking-[-0.03em] text-ink-900">
              Other services
            </h2>
          </Reveal>
          <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {others.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 80} as="li">
                <Shell className="h-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
                  <Link href={`/services/${s.slug}/`} className="block p-6">
                    <h3 className="font-display text-lg font-extrabold tracking-tight text-ink-900">
                      {s.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-700">{s.short}</p>
                  </Link>
                </Shell>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

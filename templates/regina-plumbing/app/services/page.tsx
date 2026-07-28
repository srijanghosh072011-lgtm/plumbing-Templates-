import type { Metadata } from 'next';
import Link from 'next/link';
import { client } from '@/lib/client.config';
import { services } from '@/lib/content';
import { graph, breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { Reveal } from '@/components/Reveal';
import { Shell, Cta, ArrowIcon } from '@/components/ui';
import { PageHero } from '@/components/blocks';

export const metadata: Metadata = {
  title: `Plumbing & Heating Services in ${client.address.locality}, SK`,
  description:
    'Emergency plumbing, drain cleaning, water heaters, furnaces, renovation plumbing and flood protection across Regina and area. Flat-rate pricing quoted before work starts.',
  alternates: { canonical: '/services/' },
};

const trail = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services/' },
];

export default function ServicesIndex() {
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(trail))} />

      <PageHero
        eyebrow="What we do"
        title="Plumbing & heating services"
        lede={`${client.name} covers emergency repair, drain cleaning, water heaters, furnaces, renovation plumbing and flood protection across ${client.address.locality} and roughly ${client.serviceRadiusKm} km around it. Every job is quoted flat-rate in writing before work begins.`}
        trail={trail}
      >
        <div className="mt-8">
          <Cta
            href={`tel:${client.phoneRaw}`}
            external
            icon="phone"
            variant="onDark"
            data-analytics="phone_call_click"
          >
            Call {client.phone}
          </Cta>
        </div>
      </PageHero>

      <section className="bg-bone-50 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <ul className="grid gap-5 md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 2) * 90} as="li">
                <Shell className="h-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
                  <Link href={`/services/${s.slug}/`} className="group flex h-full flex-col p-8">
                    <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">
                      {s.name}
                    </h2>
                    <p className="mt-3 flex-1 leading-relaxed text-ink-700">{s.short}</p>
                    <p className="mt-5 font-display text-lg font-bold text-ink-900">
                      ${s.priceLow}–${s.priceHigh}
                      <span className="ml-2 text-sm font-normal text-ink-500">
                        {s.priceUnit}
                      </span>
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink-900">
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
    </>
  );
}

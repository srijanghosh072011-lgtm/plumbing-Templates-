import type { Metadata } from 'next';
import Link from 'next/link';
import { client } from '@/lib/client.config';
import { areas } from '@/lib/content';
import { graph, breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { Reveal } from '@/components/Reveal';
import { Shell, ArrowIcon } from '@/components/ui';
import { PageHero } from '@/components/blocks';

export const metadata: Metadata = {
  title: 'Service Areas | Regina & Area',
  description: `Plumbing and heating across Regina, White City, Pilot Butte, Lumsden and Balgonie — roughly ${client.serviceRadiusKm} km around Regina, Saskatchewan.`,
  alternates: { canonical: '/service-areas/' },
};

const trail = [
  { name: 'Home', path: '/' },
  { name: 'Service Areas', path: '/service-areas/' },
];

export default function AreasIndex() {
  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(trail))} />

      <PageHero
        eyebrow="Where we work"
        title="Service areas"
        lede={`${client.name} serves ${client.address.locality} and the communities within roughly ${client.serviceRadiusKm} km — White City, Emerald Park, Pilot Butte, Lumsden and Balgonie. Each area has its own conditions, and the pages below cover what we actually see there.`}
        trail={trail}
      />

      <section className="bg-bone-50 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <ul className="grid gap-5 md:grid-cols-2">
            {areas.map((a, i) => (
              <Reveal key={a.slug} delay={(i % 2) * 90} as="li">
                <Shell className="h-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
                  <Link href={`/service-areas/${a.slug}/`} className="group flex h-full flex-col p-8">
                    <div className="flex items-baseline justify-between gap-4">
                      <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">
                        {a.name}
                      </h2>
                      <span className="shrink-0 rounded-full bg-tide-50 px-3 py-1 text-xs font-semibold text-tide-600 ring-1 ring-tide-100">
                        ~{a.driveMinutes} min
                      </span>
                    </div>
                    <p className="mt-4 flex-1 leading-relaxed text-ink-700">{a.answer}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink-900">
                      Local details
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

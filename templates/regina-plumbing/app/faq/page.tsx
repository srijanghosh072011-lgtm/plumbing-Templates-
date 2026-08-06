import type { Metadata } from 'next';
import { client } from '@/lib/client.config';
import { generalFaqs, services } from '@/lib/content';
import { graph, faqSchema, breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { Reveal } from '@/components/Reveal';
import { Cta } from '@/components/ui';
import { PageHero, FaqList, LastUpdated } from '@/components/blocks';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions',
  description: `Common questions about plumbing in Regina — pricing, emergency response times, licensing, warranties and service areas. Answered by ${client.name}.`,
  alternates: { canonical: '/faq/' },
};

const trail = [
  { name: 'Home', path: '/' },
  { name: 'FAQ', path: '/faq/' },
];

/** Every service FAQ also appears here, so the schema below matches what
 *  renders — a requirement, not a nicety. */
const allFaqs = [
  ...generalFaqs,
  ...services.flatMap((s) => s.faqs),
];

export default function FaqPage() {
  return (
    <>
      <JsonLd data={graph(faqSchema(allFaqs), breadcrumbSchema(trail))} />

      <PageHero
        eyebrow="Answers"
        title="Frequently asked questions"
        lede="Pricing, response times, licensing and warranty — the things people ask before they book. If your question is not here, call and ask."
        trail={trail}
      />

      <section className="bg-bone-50 py-14 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Reveal>
            <h2 className="font-display text-3xl font-extrabold tracking-[-0.03em] text-ink-900">
              About us and how we work
            </h2>
            <FaqList faqs={generalFaqs} className="mt-6" />
          </Reveal>

          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 40}>
              <h2 className="mt-14 font-display text-3xl font-extrabold tracking-[-0.03em] text-ink-900">
                {s.name}
              </h2>
              <FaqList faqs={s.faqs} className="mt-6" />
            </Reveal>
          ))}

          <LastUpdated />

          <Reveal>
            <div className="mt-12 rounded-[2rem] bg-ink-900/[0.035] p-1.5 ring-1 ring-ink-900/[0.07]">
              <div className="rounded-[1.625rem] bg-white p-8 text-center">
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">
                  Still have a question?
                </h2>
                <p className="mt-3 text-ink-700">
                  Send us a note and ask. We would rather spend five minutes answering than have you
                  guess.
                </p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <Cta href="/quote/">Send a message</Cta>
                  <Cta href="/services/" variant="ghost">
                    Browse services
                  </Cta>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

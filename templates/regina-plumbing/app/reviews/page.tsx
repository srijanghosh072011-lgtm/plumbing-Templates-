import type { Metadata } from 'next';
import { client } from '@/lib/client.config';
import { reviews, aggregateRating } from '@/lib/content';
import { graph, reviewsSchema, breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { Reveal } from '@/components/Reveal';
import { Shell, Cta, StarRow } from '@/components/ui';
import { PageHero } from '@/components/blocks';

export const metadata: Metadata = {
  title: 'Reviews',
  description: `What Regina homeowners say about ${client.name}. Real reviews from Google Business Profile.`,
  alternates: { canonical: '/reviews/' },
};

const trail = [
  { name: 'Home', path: '/' },
  { name: 'Reviews', path: '/reviews/' },
];

export default function ReviewsPage() {
  const schema = reviewsSchema();

  return (
    <>
      {/* Emitted only when real reviews are present — never for placeholders. */}
      <JsonLd data={graph(breadcrumbSchema(trail), ...(schema ? [schema] : []))} />

      <PageHero
        eyebrow="What people say"
        title="Reviews"
        lede="Every review below is a real one, published as written. We do not edit them, and we do not write them."
        trail={trail}
      >
        {aggregateRating && (
          <div className="mt-8 inline-flex items-center gap-4 rounded-full bg-white/[0.11] px-5 py-3 ring-1 ring-white/18">
            <StarRow rating={Math.round(aggregateRating.value)} />
            <span className="text-sm text-bone-200/80">
              {aggregateRating.value.toFixed(1)} from {aggregateRating.count} reviews
            </span>
          </div>
        )}
      </PageHero>

      <section className="bg-bone-50 py-14 sm:py-20 lg:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={`${r.author}-${i}`} delay={(i % 3) * 90} as="li">
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

          <Reveal>
            <div className="mt-14 rounded-[2rem] bg-ink-900/[0.035] p-1.5 ring-1 ring-ink-900/[0.07]">
              <div className="rounded-[1.625rem] bg-white p-8 text-center">
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">
                  Read more on Google
                </h2>
                <p className="mx-auto mt-3 max-w-md text-ink-700">
                  Our full review history lives on our Google Business Profile, where we cannot
                  edit or remove anything.
                </p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  {/* Rendered only when a real profile URL exists — an empty
                      or placeholder href is a dead link on a trust page. */}
                  {client.social.google && !client.social.google.startsWith('TODO_') && (
                    <Cta href={client.social.google} external>
                      See Google reviews
                    </Cta>
                  )}
                  <Cta href="/quote/" variant="ghost">
                    Get a quote
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

import { client } from '@/lib/client.config';
import { graph, breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from './JsonLd';
import { PageHero } from './blocks';

/**
 * Shared shell for the three legal routes. They differ only in body copy,
 * so the layout, breadcrumb and review-date furniture lives here once.
 */
export function LegalPage({
  title,
  lede,
  path,
  children,
}: {
  title: string;
  lede: string;
  path: string;
  children: React.ReactNode;
}) {
  const trail = [
    { name: 'Home', path: '/' },
    { name: title, path },
  ];
  const date = new Date().toISOString().slice(0, 10);

  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(trail))} />
      <PageHero eyebrow="Legal" title={title} lede={lede} trail={trail} />

      <section className="bg-bone-50 py-20 lg:py-28">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          {children}

          <div className="mt-14 rounded-2xl bg-ink-900/[0.04] p-6 text-sm leading-relaxed text-ink-700 ring-1 ring-ink-900/[0.07]">
            <p>
              <strong className="text-ink-900">Last updated</strong>{' '}
              <time dateTime={date}>
                {new Date(date).toLocaleDateString('en-CA', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </p>
            <p className="mt-3">
              Questions about this document? Contact{' '}
              <a
                href={`mailto:${client.email}`}
                className="font-semibold text-ink-900 underline underline-offset-4"
              >
                {client.email}
              </a>
              .
            </p>
            <p className="mt-3 text-ink-500">
              This document is a template draft and is general information, not legal advice.
              Have it reviewed by a lawyer before you rely on it, and make sure it accurately
              describes what this site and this business actually do.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

/** Typography for long-form legal text. Tailwind's typography plugin would
 *  be a dependency for three pages; this is the same result in ~10 lines. */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        text-ink-700
        [&_a]:font-medium [&_a]:text-ink-900 [&_a]:underline [&_a]:underline-offset-4
        [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-extrabold
        [&_h2]:tracking-[-0.03em] [&_h2]:text-ink-900 first:[&_h2]:mt-0
        [&_li]:mt-2 [&_li]:leading-relaxed
        [&_p]:mt-4 [&_p]:leading-relaxed
        [&_strong]:text-ink-900
        [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5
      "
    >
      {children}
    </div>
  );
}

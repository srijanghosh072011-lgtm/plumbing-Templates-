import type { Metadata } from 'next';
import { client } from '@/lib/client.config';
import { graph, breadcrumbSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { Reveal } from '@/components/Reveal';
import { Shell, Cta, Eyebrow } from '@/components/ui';
import { PageHero, LastUpdated } from '@/components/blocks';

export const metadata: Metadata = {
  title: 'About Us',
  description: `${client.name} has served Regina since ${client.foundedYear}. Licensed, insured, WCB-covered, and owner-operated. Meet the people who turn up at your door.`,
  alternates: { canonical: '/about/' },
};

const trail = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about/' },
];

export default function AboutPage() {
  const years = new Date().getFullYear() - client.foundedYear;

  return (
    <>
      <JsonLd data={graph(breadcrumbSchema(trail))} />

      <PageHero
        eyebrow={`Since ${client.foundedYear}`}
        title="The people who turn up"
        lede={`${client.name} has worked on Regina homes for ${years} years. We are licensed, insured and WCB-covered, and we price flat-rate because nobody should watch a clock while their basement fills.`}
        trail={trail}
      />

      <section className="bg-bone-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Reveal>
            <div className="space-y-5 text-lg leading-relaxed text-ink-700">
              <p>
                TODO_OWNER_STORY — replace this with the real story. Who started the
                business, why, what they did before, and what they want it to be. This is the
                single highest-value paragraph on the site for both trust and E-E-A-T, and it
                is the one paragraph that cannot be written by anyone but the owner.
              </p>
              <p>
                Two or three paragraphs is plenty. Be specific: the year, the first truck, the
                thing that made you go out on your own. Specifics are what people remember and
                what search engines treat as genuine first-hand experience.
              </p>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <h2 className="mt-14 font-display text-3xl font-extrabold tracking-[-0.03em] text-ink-900">
              Credentials
            </h2>
            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { t: 'Licence', v: client.licenceNumber, d: 'Saskatchewan journeyman plumber' },
                { t: 'Insurance', v: client.insurance, d: 'General liability' },
                { t: 'WCB', v: client.wcbNumber, d: 'Workers’ Compensation Board' },
              ].map((c) => (
                <Shell key={c.t}>
                  <div className="p-6">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-500">
                      {c.t}
                    </dt>
                    <dd className="mt-2 font-display text-base font-extrabold tracking-tight text-ink-900">
                      {c.v}
                    </dd>
                    <p className="mt-1 text-xs text-ink-500">{c.d}</p>
                  </div>
                </Shell>
              ))}
            </dl>
            <p className="mt-4 text-sm text-ink-500">
              Ask any contractor for all three before work starts. A contractor who will not
              show you their WCB number is a contractor whose injury on your property could
              become your problem.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <h2 className="mt-14 font-display text-3xl font-extrabold tracking-[-0.03em] text-ink-900">
              How we price
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink-700">
              <p>
                Flat rate, always, quoted in writing before we start. You approve a number
                rather than an hourly meter, so a job that runs long is our problem rather
                than yours.
              </p>
              <p>
                If we open something up and find a genuinely different job underneath — a
                rotted joist, a line that has already failed elsewhere — we stop and re-quote
                before continuing. You will never get an invoice with a number on it you have
                not already agreed to.
              </p>
            </div>
          </Reveal>

          <LastUpdated />

          <Reveal>
            <div className="mt-12 text-center">
              <Eyebrow>Work with us</Eyebrow>
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <Cta
                  href={`tel:${client.phoneRaw}`}
                  external
                  icon="phone"
                  data-analytics="phone_call_click"
                >
                  Call {client.phone}
                </Cta>
                <Cta href="/quote/" variant="ghost">
                  Request a quote
                </Cta>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import { client } from '@/lib/client.config';
import { Reveal } from '@/components/Reveal';
import { QuoteForm } from '@/components/QuoteForm';
import { Shell, Cta, ClockIcon } from '@/components/ui';
import { PageHero } from '@/components/blocks';

export const metadata: Metadata = {
  title: 'Get a Quote | Free Estimates',
  description: `Request a flat-rate quote from ${client.name}. Urgent jobs are answered 24/7.`,
  alternates: { canonical: '/quote/' },
};

const trail = [
  { name: 'Home', path: '/' },
  { name: 'Get a Quote', path: '/quote/' },
];

export default function QuotePage() {
  return (
    <>
      <PageHero
        eyebrow="Free estimates"
        title="Get a fast quote"
        lede="Tell us what is going on and we will get back to you with a flat price. For planned work the estimate is free. If water is running right now, tick the emergency box and we will treat it that way."
        trail={trail}
      >
        <div className="mt-8">
          <Cta href="#quote-form" variant="onDark">
            Start your request
          </Cta>
        </div>
      </PageHero>

      <section id="quote-form" className="scroll-mt-24 bg-bone-50 py-14 sm:py-20 lg:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <Reveal>
            <QuoteForm />
          </Reveal>

          <Reveal delay={110} className="space-y-5">
            <Shell>
              <div className="p-7">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-accent-600/10 text-accent-700 ring-1 ring-accent-600/20">
                  <ClockIcon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 font-display text-xl font-extrabold tracking-tight text-ink-900">
                  Something urgent?
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">
                  Tick the emergency box on the form. Those requests are monitored around
                  the clock and go straight to whoever is on call.
                </p>
                <a
                  href={`mailto:${client.email}`}
                  data-analytics="email_click"
                  className="mt-5 inline-flex min-h-12 items-center rounded-full bg-ink-900 px-6 font-semibold text-white transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
                >
                  Email us instead
                </a>
              </div>
            </Shell>

            <Shell>
              <div className="p-7">
                <h2 className="font-display text-xl font-extrabold tracking-tight text-ink-900">
                  What happens next
                </h2>
                <ol className="mt-4 space-y-3 text-sm leading-relaxed text-ink-700">
                  <li>
                    <strong className="text-ink-900">1.</strong> We read your request and
                    reply to understand the job.
                  </li>
                  <li>
                    <strong className="text-ink-900">2.</strong> For most work we can give a
                    price range up front, then confirm on site.
                  </li>
                  <li>
                    <strong className="text-ink-900">3.</strong> You get a written flat rate
                    before anyone starts.
                  </li>
                </ol>
              </div>
            </Shell>

            <Shell>
              <div className="p-7">
                <h2 className="font-display text-xl font-extrabold tracking-tight text-ink-900">
                  Before you send
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-700">
                  If water is actively running, shut off the main valve first — usually in
                  the basement on the wall facing the street. Then send the form and tick
                  the emergency box.
                </p>
              </div>
            </Shell>
          </Reveal>
        </div>
      </section>
    </>
  );
}

import Link from 'next/link';
import { client } from '@/lib/client.config';
import { services } from '@/lib/content';
import { Cta } from '@/components/ui';

/**
 * Custom 404. Helpful rather than decorative — links back into the pages
 * people actually wanted, plus the phone number, since somebody who hit a
 * dead link during an emergency should not have to navigate to find it.
 *
 * Note: on GitHub Pages this file is served as 404.html and returns a real
 * 404 status, so it will not be treated as a soft 404.
 */
export default function NotFound() {
  return (
    <section className="relative flex min-h-dvh items-center overflow-hidden bg-ink-950 px-6 py-32">
      <div className="blueprint-field absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/4 h-96 w-[32rem] -translate-x-1/2 rounded-full bg-tide-500/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <p className="font-display text-[clamp(4rem,14vw,8rem)] font-extrabold leading-none tracking-[-0.05em] text-white/10">
          404
        </p>
        <h1 className="-mt-4 font-display text-[clamp(1.85rem,5vw,3rem)] font-extrabold tracking-[-0.035em] text-white">
          This page sprung a leak.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-lg text-bone-200/70">
          The page you were after does not exist, or it moved. Here is where most people were
          heading.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Cta
            href={`tel:${client.phoneRaw}`}
            external
            icon="phone"
            variant="onDark"
            data-analytics="phone_call_click"
          >
            Call {client.phone}
          </Cta>
          <Cta href="/" variant="ghost">
            Back to home
          </Cta>
        </div>

        <ul className="mx-auto mt-12 flex max-w-lg flex-wrap justify-center gap-2">
          {services.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/services/${s.slug}/`}
                className="inline-flex min-h-10 items-center rounded-full bg-white/[0.06] px-4 text-sm text-bone-200/80 ring-1 ring-white/10 transition-colors hover:bg-white/12 hover:text-white"
              >
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

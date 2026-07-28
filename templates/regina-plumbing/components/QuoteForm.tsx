'use client';

import { useState } from 'react';
import { client } from '@/lib/client.config';
import { services } from '@/lib/content';
import { Shell, CheckIcon, ArrowIcon } from './ui';
import { trackLead } from './Analytics';

/**
 * Quote form. Posts to Web3Forms because GitHub Pages has no server.
 *
 * Spam handling is a honeypot plus a minimum fill time. Both are free, need
 * no third-party script, and stop the overwhelming majority of bot
 * submissions. If real spam gets through, add Cloudflare Turnstile — the
 * hook is marked below.
 *
 * Validation is native HTML (`required`, `type`, `pattern`) so it works
 * before hydration and gives screen readers the browser's own messaging.
 */

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function QuoteForm({ defaultService }: { defaultService?: string }) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [startedAt] = useState(() => Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: a field no human sees. Anything in it is a bot. Pretend it
    // worked rather than reporting failure, so the bot does not retry.
    if (data.get('company')) {
      setStatus('sent');
      return;
    }

    // Bots submit near-instantly. Four seconds is well under a real fill.
    if (Date.now() - startedAt < 4000) {
      setStatus('sent');
      return;
    }

    data.delete('company');
    data.append('access_key', client.web3formsKey);
    data.append('subject', `New quote request — ${data.get('service') || 'General'}`);
    data.append('from_name', `${client.name} website`);

    setStatus('sending');
    setError('');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Submission failed');
      }

      trackLead(String(data.get('service') ?? 'unspecified'));
      setStatus('sent');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError(
        err instanceof Error ? err.message : 'Something went wrong sending your request.',
      );
    }
  }

  if (status === 'sent') {
    return (
      <Shell>
        <div className="p-8 text-center sm:p-12">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-copper-500/12 text-copper-600 ring-1 ring-copper-500/25">
            <CheckIcon className="h-6 w-6" />
          </span>
          <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-ink-900">
            Request received
          </h2>
          <p className="mt-3 text-ink-700">
            We will call you back shortly. If this is an emergency — active leak, no heat,
            sewer backup — please call instead so we can dispatch immediately.
          </p>
          <a
            href={`tel:${client.phoneRaw}`}
            data-analytics="phone_call_click"
            className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink-900 px-6 font-semibold text-white"
          >
            {client.phone}
          </a>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <form onSubmit={onSubmit} className="p-6 sm:p-8" noValidate={false}>
        {/* Honeypot. Hidden from sight and from assistive tech, never from bots. */}
        <div className="absolute h-px w-px overflow-hidden opacity-0" aria-hidden="true">
          <label htmlFor="company">Company (leave blank)</label>
          <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name" name="name" autoComplete="name" required />
          <Field
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            hint="Best number to reach you"
          />
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            className="sm:col-span-2"
          />

          <div className="sm:col-span-2">
            <label htmlFor="service" className="block text-sm font-semibold text-ink-800">
              What do you need?
            </label>
            <select
              id="service"
              name="service"
              defaultValue={defaultService ?? ''}
              className="mt-2 min-h-12 w-full rounded-2xl border-0 bg-ink-900/[0.04] px-4 text-ink-900 ring-1 ring-ink-900/10 transition-shadow focus:ring-2 focus:ring-ink-900/30"
            >
              <option value="">Not sure / something else</option>
              {services.map((s) => (
                <option key={s.slug} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="message" className="block text-sm font-semibold text-ink-800">
              Tell us what is happening
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              placeholder="Where is the problem, how long has it been going on, and is water actively running?"
              className="mt-2 w-full rounded-2xl border-0 bg-ink-900/[0.04] px-4 py-3 text-ink-900 ring-1 ring-ink-900/10 transition-shadow placeholder:text-ink-500/60 focus:ring-2 focus:ring-ink-900/30"
            />
          </div>

          <Field
            label="Postal code"
            name="postal"
            autoComplete="postal-code"
            hint="So we can confirm we cover your area"
            className="sm:col-span-2"
          />
        </div>

        {/*
          Cloudflare Turnstile hook — drop the widget div here and add the
          script to layout.tsx if honeypot + timing stop being enough:
          <div className="cf-turnstile" data-sitekey={client.turnstileKey} />
        */}

        {status === 'error' && (
          <p role="alert" className="mt-5 rounded-2xl bg-copper-600/10 px-4 py-3 text-sm text-copper-600">
            {error} You can also call us directly on{' '}
            <a href={`tel:${client.phoneRaw}`} className="font-semibold underline">
              {client.phone}
            </a>
            .
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-ink-900 py-2 pl-6 pr-2 font-semibold text-white transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-ink-800 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
        >
          {status === 'sending' ? 'Sending…' : 'Request my quote'}
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center rounded-full bg-white/12 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-px group-hover:scale-105"
          >
            <ArrowIcon />
          </span>
        </button>

        <p className="mt-4 text-xs leading-relaxed text-ink-500">
          We use your details only to respond to this request. We never sell them, and we do
          not add you to a mailing list unless you ask. See our{' '}
          <a href="/privacy/" className="underline underline-offset-2">
            privacy policy
          </a>
          .
        </p>
      </form>
    </Shell>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  hint,
  autoComplete,
  className = '',
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  hint?: string;
  autoComplete?: string;
  className?: string;
}) {
  const hintId = hint ? `${name}-hint` : undefined;
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-semibold text-ink-800">
        {label}
        {required && (
          <span className="text-copper-600" aria-hidden="true">
            {' '}
            *
          </span>
        )}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-describedby={hintId}
        className="mt-2 min-h-12 w-full rounded-2xl border-0 bg-ink-900/[0.04] px-4 text-ink-900 ring-1 ring-ink-900/10 transition-shadow focus:ring-2 focus:ring-ink-900/30"
      />
      {hint && (
        <p id={hintId} className="mt-1.5 text-xs text-ink-500">
          {hint}
        </p>
      )}
    </div>
  );
}

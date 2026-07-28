'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { client } from '@/lib/client.config';

/**
 * GA4 + consent, in one component because they are one decision.
 *
 * Two things the playbook is explicit about:
 *
 *  1. GA4 enhanced measurement does NOT track `tel:` clicks. For a trades
 *     business, phone calls are the majority of conversions, so the click
 *     handler below is not optional garnish — without it the client's
 *     analytics show almost none of their actual leads. Mark
 *     `phone_call_click` and `generate_lead` as key events in the GA4 UI.
 *
 *  2. PIPEDA requires meaningful consent for non-essential tracking, so
 *     Consent Mode v2 starts denied and nothing is stored until the visitor
 *     accepts. Declining is a real choice, not a smaller button.
 */

const CONSENT_KEY = 'consent.analytics';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function Analytics() {
  const [choice, setChoice] = useState<'granted' | 'denied' | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    setChoice(stored === 'granted' || stored === 'denied' ? stored : null);
    setReady(true);
  }, []);

  const decide = (value: 'granted' | 'denied') => {
    localStorage.setItem(CONSENT_KEY, value);
    setChoice(value);
    window.gtag?.('consent', 'update', {
      analytics_storage: value,
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
  };

  /**
   * Delegated click tracking. One listener on the document rather than a
   * handler per link, so links rendered later are covered automatically.
   */
  useEffect(() => {
    if (!client.gaMeasurementId) return;

    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest?.('a');
      if (!link) return;

      const href = link.getAttribute('href') ?? '';
      const event = href.startsWith('tel:')
        ? 'phone_call_click'
        : href.startsWith('mailto:')
          ? 'email_click'
          : /maps\.google|google\.[a-z.]+\/maps/.test(href)
            ? 'direction_request'
            : null;

      if (event) {
        window.gtag?.('event', event, {
          link_url: href,
          link_text: link.textContent?.trim().slice(0, 80),
        });
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <>
      {client.gaMeasurementId && (
        <>
          {/*
            Consent defaults must run before gtag config, so this is a
            beforeInteractive-ordered inline block rather than part of the
            remote script's callback.
          */}
          <Script id="consent-default" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('consent','default',{
                analytics_storage:'denied',
                ad_storage:'denied',
                ad_user_data:'denied',
                ad_personalization:'denied',
                wait_for_update: 500
              });
              gtag('js', new Date());
              gtag('config', '${client.gaMeasurementId}', { send_page_view: true });
            `}
          </Script>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${client.gaMeasurementId}`}
            strategy="afterInteractive"
          />
        </>
      )}

      {/* Only shown when GA is configured AND no choice has been recorded. */}
      {ready && choice === null && client.gaMeasurementId && (
        <div
          role="dialog"
          aria-label="Cookie preferences"
          className="no-print fixed inset-x-4 bottom-4 z-50 mx-auto max-w-xl rounded-[2rem] bg-ink-900/[0.04] p-1.5 ring-1 ring-ink-900/[0.08] backdrop-blur-2xl sm:inset-x-6"
        >
          <div className="rounded-[1.625rem] bg-white/95 p-5 shadow-[0_24px_60px_-30px_rgb(13_20_40/0.5)]">
            <p className="text-sm leading-relaxed text-ink-700">
              We use analytics cookies to understand how people find and use this site.
              Nothing is stored until you choose. See our{' '}
              <a href="/privacy/" className="font-semibold text-ink-900 underline underline-offset-4">
                privacy policy
              </a>
              .
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => decide('granted')}
                className="min-h-11 rounded-full bg-ink-900 px-5 text-sm font-semibold text-white transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
              >
                Accept analytics
              </button>
              <button
                type="button"
                onClick={() => decide('denied')}
                className="min-h-11 rounded-full bg-ink-900/[0.06] px-5 text-sm font-semibold text-ink-900 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-ink-900/10 active:scale-[0.98]"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Fired by the quote form on a successful submit. */
export function trackLead(service: string) {
  window.gtag?.('event', 'generate_lead', {
    currency: 'CAD',
    service,
  });
}

import type { Metadata } from 'next';
import { client } from '@/lib/client.config';
import { Prose, LegalPage } from '@/components/legal';

export const metadata: Metadata = {
  title: 'Accessibility Statement',
  description: `${client.name}'s commitment to WCAG 2.2 Level AA, what we have done, and how to tell us about a barrier.`,
  alternates: { canonical: '/accessibility/' },
};

export default function AccessibilityPage() {
  return (
    <LegalPage
      title="Accessibility Statement"
      lede="We build this site to WCAG 2.2 Level AA. Here is what that means in practice, what we know is imperfect, and how to tell us when we get it wrong."
      path="/accessibility/"
    >
      <Prose>
        <h2>Our commitment</h2>
        <p>
          {client.name} aims to meet{' '}
          <a
            href="https://www.w3.org/TR/WCAG22/"
            rel="noopener noreferrer"
            target="_blank"
          >
            WCAG 2.2 Level AA
          </a>
          . The Accessible Saskatchewan Act does not currently impose website accessibility
          requirements on private businesses, so this is a standard we hold ourselves to
          rather than one imposed on us. Someone dealing with a flooding basement should not
          also have to fight the website.
        </p>

        <h2>What we have done</h2>
        <ul>
          <li>Every function of this site is operable by keyboard alone, with no focus traps.</li>
          <li>
            Focus indicators are always visible, and the sticky header is offset so it never
            covers the element you have moved focus to.
          </li>
          <li>
            Text meets a contrast ratio of at least 4.5:1, and interface components and large
            text at least 3:1.
          </li>
          <li>
            Interactive targets are at least 44&nbsp;×&nbsp;44&nbsp;px — comfortably above the
            24&nbsp;×&nbsp;24&nbsp;px minimum, because people use this site outdoors in winter.
          </li>
          <li>Every form field has a programmatically associated label.</li>
          <li>
            Meaningful images carry descriptive alternative text; purely decorative ones are
            hidden from assistive technology.
          </li>
          <li>
            Motion is disabled entirely for anyone whose system requests reduced motion.
          </li>
          <li>There is nothing on this site that requires a drag gesture to operate.</li>
        </ul>

        <h2>Known limitations</h2>
        <p>
          We know of no outstanding barriers at present. This site embeds no
          third-party maps, chat or booking widgets, which are the usual source of
          accessibility problems outside a site owner’s control. If that changes, the
          limitation will be listed here with a date for fixing it.
        </p>

        <h2>How this was tested</h2>
        <p>
          Automated testing with axe DevTools and Lighthouse, plus manual keyboard testing and
          screen-reader testing on the main journeys — finding a service, getting a phone
          number, and submitting a quote request. Automated tools catch roughly a third to a
          half of real issues, so the manual pass is the part that matters.
        </p>

        <h2>Tell us about a barrier</h2>
        <p>
          If something on this site stops you doing what you came to do, tell us and we will
          fix it. Email <a href={`mailto:${client.email}`}>{client.email}</a> or call{' '}
          <a href={`tel:${client.phoneRaw}`}>{client.phone}</a>. We aim to respond within two
          business days.
        </p>
        <p>
          You can always reach us by phone for anything you cannot do on the site, and we are
          glad to take the whole request over the phone.
        </p>
      </Prose>
    </LegalPage>
  );
}

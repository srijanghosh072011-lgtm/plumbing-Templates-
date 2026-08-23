import type { Metadata } from 'next';
import { client } from '@/lib/client.config';
import { Prose, LegalPage } from '@/components/legal';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${client.name} collects, uses and protects personal information under Canada's PIPEDA.`,
  alternates: { canonical: '/privacy/' },
};

/**
 * PIPEDA-oriented draft. Saskatchewan has no general private-sector privacy
 * law deemed substantially similar to PIPEDA, so federal PIPEDA governs.
 *
 * THIS IS A DRAFT, NOT LEGAL ADVICE. Have a lawyer review it before launch,
 * and make sure it describes what the site actually does — a policy that
 * claims you do not use analytics while GA4 is running is worse than none.
 */
export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lede={`How ${client.name} handles personal information, under Canada's Personal Information Protection and Electronic Documents Act (PIPEDA).`}
      path="/privacy/"
    >
      <Prose>
        <h2>Who we are</h2>
        <p>
          {client.legalName}, operating as {client.name}, is a plumbing and heating
          contractor based in {client.address.locality}, {client.address.region}, Canada. We
          are the organisation responsible for the personal information described in this
          policy.
        </p>

        <h2>Accountability</h2>
        <p>
          PIPEDA requires us to designate a person accountable for our compliance. That person
          is <strong>Ravi Chandra</strong>, reachable at{' '}
          <a href={`mailto:${client.email}`}>{client.email}</a>. Direct any
          privacy question, access request or complaint to them.
        </p>

        <h2>What we collect, and why</h2>
        <p>
          We collect only what we need to respond to you and do the work. Specifically:
        </p>
        <ul>
          <li>
            <strong>Contact and quote forms:</strong> your name, phone number, email address,
            postal code and whatever you write in the message. We use these to contact you
            about your request and to carry out work you ask us to do.
          </li>
          <li>
            <strong>Enquiries:</strong> the details you give us when you get in touch, recorded in
            our job system so the technician who attends knows what they are attending.
          </li>
          <li>
            <strong>Service records:</strong> the address we attended, what we did, and what
            we charged. We keep these because warranty claims and follow-up work depend on
            them.
          </li>
          <li>
            <strong>Analytics:</strong> if you consent, we use Google Analytics 4 to
            understand how people find and move through this site. This involves cookies and
            an IP address, which Google processes on our behalf. Nothing analytics-related is
            stored until you accept.
          </li>
        </ul>
        <p>
          We do not collect payment card details on this website. We do not sell, rent or
          trade personal information to anyone, ever.
        </p>

        <h2>Consent</h2>
        <p>
          Submitting a form is your consent for us to contact you about that request. Analytics
          cookies require your separate, explicit consent through the banner, and non-essential
          tracking stays off until you give it. You can withdraw consent at any time by
          contacting us, subject to legal and contractual limits — we cannot, for example,
          delete an invoice we are required to retain for tax purposes.
        </p>

        <h2>Email and CASL</h2>
        <p>
          Canada&apos;s Anti-Spam Legislation governs commercial electronic messages. We send
          marketing email only to people who have given express consent or with whom we have a
          current business relationship. Every such message identifies us, gives our contact
          details, and includes a working unsubscribe link that we honour within 10 business
          days. Replying to a quote request is not marketing, and does not require separate
          consent.
        </p>

        <h2>Who we share it with</h2>
        <p>We use a small number of service providers who process data on our behalf:</p>
        <ul>
          <li>
            <strong>Web3Forms</strong> — delivers website form submissions to our inbox.
          </li>
          <li>
            <strong>Google Analytics 4</strong> — website analytics, only with your consent.
          </li>
          <li>
            <strong>Google Workspace</strong> — our business email.
          </li>
          <li>
            <strong>Jobber</strong> — job scheduling and records.
          </li>
        </ul>
        <p>
          Some of these providers store data outside Canada, which means it may be accessible
          to foreign courts and law enforcement under the laws of those countries. We share
          information otherwise only where the law requires it.
        </p>

        <h2>How long we keep it</h2>
        <p>
          Quote requests that do not become jobs: 12 months. Completed job and
          invoice records: 7 years, which reflects warranty periods and Canadian
          tax record-keeping requirements. We delete or anonymise information once it no longer
          serves the purpose it was collected for.
        </p>

        <h2>How we protect it</h2>
        <p>
          This site is served over HTTPS. Access to our job records and email is limited to
          people who need it, and those accounts require multi-factor authentication. No system
          is perfectly secure, but if a breach creates a real risk of significant harm to you,
          PIPEDA requires us to notify you and the Privacy Commissioner as soon as feasible —
          and we will.
        </p>

        <h2>Your rights</h2>
        <p>
          You have the right to ask what personal information we hold about you, to see it, to
          have inaccuracies corrected, and to ask us to delete it where we are not required to
          keep it. Write to <a href={`mailto:${client.email}`}>{client.email}</a>. We respond
          within 30 days. If you are not satisfied with our response, you may complain to the
          Office of the Privacy Commissioner of Canada at{' '}
          <a href="https://www.priv.gc.ca" rel="noopener noreferrer" target="_blank">
            priv.gc.ca
          </a>
          .
        </p>

        <h2>Cookies</h2>
        <p>
          This site sets no cookies at all unless you accept analytics. If you do, Google
          Analytics sets cookies to distinguish visitors and sessions. You can change your mind
          by clearing this site&apos;s data in your browser, which resets the consent banner.
        </p>

        <h2>Changes</h2>
        <p>
          If we change this policy we will update the date below. Material changes affecting
          how we use information you have already given us will be communicated directly.
        </p>
      </Prose>
    </LegalPage>
  );
}

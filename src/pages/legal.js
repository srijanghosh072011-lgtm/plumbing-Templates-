import { esc } from '../lib/layout.js';
import { pageHero } from './services.js';

/**
 * Legal pages.
 *
 * These are drafted to be PIPEDA- and CASL-aware because the business is a
 * Saskatchewan private-sector company: Saskatchewan has no general private-sector
 * privacy statute deemed substantially similar to PIPEDA, so PIPEDA applies
 * federally by default.
 *
 * THIS IS GENERAL INFORMATION, NOT LEGAL ADVICE. Every client should have these
 * reviewed by a lawyer before launch — the CHECKLIST lists that as a blocking
 * item, not a nice-to-have.
 */

const prose = 'prose-plumb flex flex-col gap-5 text-ink-muted [&_h2]:mt-10 [&_h2]:text-[length:var(--text-h3)] [&_h2]:text-ink [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-ink [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:decoration-accent [&_a]:decoration-2 [&_a]:underline-offset-2 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2.5 [&_ul]:pl-5 [&_li]:list-disc';

function legalShell(cfg, { title, eyebrow, lead, updated, body, slug }) {
  return `
  ${pageHero(cfg, {
    eyebrow,
    title: esc(title),
    lead,
    trail: [{ name: 'Home', path: '/' }, { name: title, path: `/${slug}/` }],
  })}

  <section class="band">
    <div class="shell">
      <div class="mx-auto max-w-3xl">
        <p class="mb-10 inline-flex items-center gap-2 rounded-full bg-canvas-sunk px-4 py-2 text-sm text-ink-faint" data-reveal>
          Last updated: <time datetime="${esc(updated)}" class="font-semibold text-ink">${new Date(updated).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
        </p>
        <div class="${prose} measure" data-reveal data-reveal-delay="60">
          ${body}
        </div>
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------------- privacy */

export function privacy(cfg) {
  return legalShell(cfg, {
    slug: 'privacy',
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    lead: `How ${cfg.brand.legalName} collects, uses, discloses and protects personal information, under Canada's Personal Information Protection and Electronic Documents Act (PIPEDA).`,
    updated: '2026-07-01',
    body: `
      <h2>Who we are and who is accountable</h2>
      <p>${esc(cfg.brand.legalName)} ("we", "us") operates this website and provides plumbing services in ${esc(cfg.contact.addressLocality)}, ${esc(cfg.contact.addressRegion)}. Because Saskatchewan has no general private-sector privacy statute deemed substantially similar to PIPEDA, the federal <em>Personal Information Protection and Electronic Documents Act</em> governs our handling of personal information collected through commercial activity.</p>
      <p>PIPEDA requires us to name an individual accountable for our privacy compliance. That person is our ${esc(cfg.legal.privacyOfficer)}, reachable at <a href="mailto:${esc(cfg.legal.privacyContactEmail)}">${esc(cfg.legal.privacyContactEmail)}</a> or ${esc(cfg.contact.phoneDisplay)}.</p>

      <h2>What we collect and why</h2>
      <p>We collect only what we need to respond to you and carry out the work:</p>
      <ul>
        <li><strong>Contact details</strong> — name, phone, email and service address. Needed to reach you, dispatch a technician and invoice the work.</li>
        <li><strong>Job details</strong> — what you tell us about the problem, plus photographs and camera footage taken during diagnosis. Needed to diagnose accurately, quote fairly and document what was done.</li>
        <li><strong>Website analytics</strong> — pages viewed and general location, collected only if you consent to non-essential cookies. Used to understand which pages help people and which do not.</li>
      </ul>
      <p>We do not collect payment card numbers on this website. Any card payment is processed by a third-party processor and card data never reaches our servers.</p>

      <h2>Consent</h2>
      <p>We rely on your meaningful consent. Submitting a form is express consent for us to contact you about that request. Non-essential cookies are off by default and load only if you turn them on. You may withdraw consent at any time by contacting our ${esc(cfg.legal.privacyOfficer)}, subject to legal and contractual limits — for example, we must retain invoices for tax purposes even after you withdraw marketing consent.</p>

      <h2>Email and CASL</h2>
      <p>Canada's Anti-Spam Legislation governs commercial electronic messages. We only send marketing email to people who have given express consent or with whom we have a current business relationship as CASL defines it. Every commercial message identifies us, gives valid contact information, and includes a working unsubscribe link. We honour unsubscribe requests within 10 business days, and unsubscribe mechanisms stay functional for at least 60 days after sending.</p>

      <h2>Who we share it with</h2>
      <p>We do not sell personal information. We share it only with service providers who need it to deliver our service — a scheduling or invoicing platform, an email provider, a payment processor — and only to the extent required. Where a provider stores data outside Canada, that data may be accessible to foreign courts and law enforcement under the laws of that jurisdiction. We may also disclose information where the law requires it.</p>

      <h2>How long we keep it</h2>
      <p>Job records and invoices are retained for seven years to meet Canadian tax and limitation-period requirements. Quote requests that never became jobs are deleted after 24 months. Analytics data is retained for 14 months.</p>

      <h2>Safeguards</h2>
      <p>We protect personal information with security appropriate to its sensitivity: encrypted transmission (HTTPS across the whole site), access limited to staff who need it, multi-factor authentication on business accounts, and encrypted backups. No safeguard is perfect, but a real breach involving a risk of significant harm is reportable to the Privacy Commissioner of Canada and to you as soon as feasible, as PIPEDA requires.</p>

      <h2>Your rights</h2>
      <p>Under PIPEDA you may ask what personal information we hold about you, ask for a copy, ask us to correct anything inaccurate, and challenge our compliance. Write to our ${esc(cfg.legal.privacyOfficer)} and we will respond within 30 days. If you are not satisfied with our response, you can complain to the Office of the Privacy Commissioner of Canada at priv.gc.ca.</p>

      <h2>Cookies</h2>
      <p>Strictly necessary cookies keep the site functioning and do not require consent. Analytics and marketing cookies are non-essential, default to off, and load only after you opt in. You can change your choice at any time through your browser settings.</p>

      <h2>Changes</h2>
      <p>If we change this policy we will update the date at the top of this page. Material changes affecting how we use information already collected will be communicated directly where we have a way to reach you.</p>
    `,
  });
}

/* --------------------------------------------------------------------- terms */

export function terms(cfg) {
  return legalShell(cfg, {
    slug: 'terms',
    eyebrow: 'Legal',
    title: 'Terms of Service',
    lead: `The terms that apply to plumbing work carried out by ${cfg.brand.legalName} and to your use of this website.`,
    updated: '2026-07-01',
    body: `
      <h2>Agreement</h2>
      <p>These terms apply between you and ${esc(cfg.brand.legalName)} when you use this website or engage us for plumbing work. Booking a job means you accept them.</p>

      <h2>Quotes and pricing</h2>
      <p>Our diagnostic call-out is $149, credited toward the repair if you approve the work the same day. Following diagnosis we provide a written flat quote. <strong>That quote does not change once you approve it</strong>, even if the work proves harder than we estimated.</p>
      <p>The one exception is genuinely concealed conditions that could not reasonably have been found during diagnosis — asbestos, undocumented structural changes, or damage hidden behind finished surfaces. In that case we stop, explain what we found, and give you a revised written quote to accept or decline before continuing. We will never carry out extra chargeable work without your explicit approval first.</p>

      <h2>Scheduling and emergencies</h2>
      <p>Arrival windows are targets, not guarantees. Emergency response times shift during extreme weather when call volume spikes region-wide. We will always give you a realistic window rather than an optimistic one, and we will tell you if it changes.</p>

      <h2>Workmanship guarantee</h2>
      <p>We guarantee our workmanship for two years from completion. If something we installed or repaired fails because of how we did the work, we return and correct it at no charge. The guarantee does not cover: failure of parts or fixtures you supplied, damage from misuse, freezing where recommended precautions were not taken, or unrelated failures elsewhere in the system. Manufacturer warranties on parts are separate and run for their own terms.</p>

      <h2>Your responsibilities</h2>
      <ul>
        <li>Provide safe access to the work area and disclose known hazards.</li>
        <li>Tell us about prior repairs or modifications you are aware of — undisclosed history is the most common cause of a misdiagnosis.</li>
        <li>Secure pets and keep children clear of the work area.</li>
        <li>Obtain landlord or strata permission where you are not the owner.</li>
      </ul>

      <h2>Payment</h2>
      <p>Payment is due on completion unless we agree otherwise in writing. Overdue accounts may accrue interest at 1.5% per month (19.56% per annum) from the due date.</p>

      <h2>Cancellation</h2>
      <p>Cancel or reschedule a non-emergency appointment at no charge with at least 4 hours' notice. Later cancellations, or no access on arrival, may incur the $149 call-out fee since the slot cannot be refilled.</p>

      <h2>Liability</h2>
      <p>We carry ${esc(cfg.credentials.insuranceLabel)} in general liability insurance. We are responsible for damage we actually cause through our negligence. We are not liable for pre-existing defects, for consequential losses such as lost business income, or for damage arising from conditions we were not told about and could not reasonably discover. Nothing in these terms limits liability that cannot lawfully be limited, including for death or personal injury caused by negligence.</p>

      <h2>Website content</h2>
      <p>Prices shown on this website are indicative ranges to help you budget, not binding quotes. Your actual price comes from the written quote after diagnosis. Guides and articles are general information about typical situations, not advice about your specific system.</p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of ${esc(cfg.legal.jurisdiction)} and the federal laws of Canada that apply there. Disputes fall to the courts of ${esc(cfg.contact.addressRegion === 'SK' ? 'Saskatchewan' : cfg.contact.addressRegion)}.</p>

      <h2>Contact</h2>
      <p>Questions about these terms: <a href="mailto:${esc(cfg.contact.email)}">${esc(cfg.contact.email)}</a> or ${esc(cfg.contact.phoneDisplay)}.</p>
    `,
  });
}

/* ------------------------------------------------------------- accessibility */

export function accessibility(cfg) {
  return legalShell(cfg, {
    slug: 'accessibility',
    eyebrow: 'Commitment',
    title: 'Accessibility Statement',
    lead: `${cfg.brand.legalName} builds and maintains this website to WCAG 2.2 Level AA.`,
    updated: '2026-07-01',
    body: `
      <h2>Our standard</h2>
      <p>This website is built to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.2, Level AA</strong>. We chose that standard deliberately. The <em>Accessible Saskatchewan Act</em> currently requires accessibility plans from the Government of Saskatchewan and prescribed public-sector bodies, and does not yet impose website obligations on private businesses like ours. We build to WCAG 2.2 AA regardless, because people who need it need it whether or not a statute compels us.</p>

      <h2>What we have done</h2>
      <ul>
        <li>Text contrast of at least 4.5:1, and 3:1 for large text and interface components.</li>
        <li>Every function reachable by keyboard alone, with a visible focus indicator and no focus traps.</li>
        <li>Focus never hidden behind sticky elements (WCAG 2.2 criterion 2.4.11).</li>
        <li>Touch targets of at least 24 by 24 pixels, and in practice at least 44 pixels for primary actions (2.5.8).</li>
        <li>Descriptive alternative text on meaningful images; decorative graphics hidden from assistive technology.</li>
        <li>Every form field has a programmatically associated label, and status messages are announced.</li>
        <li>Semantic headings in a logical order, with one H1 per page and a skip link as the first focusable element.</li>
        <li>Animation and parallax respect the operating-system <code>prefers-reduced-motion</code> setting.</li>
        <li>No information conveyed by colour alone.</li>
      </ul>

      <h2>How we test</h2>
      <p>Automated scanners catch somewhere between a third and a half of real accessibility problems, so we do not rely on them alone. Every release gets automated checks (axe and Lighthouse) plus manual keyboard testing and screen-reader passes with NVDA on Firefox and VoiceOver on Safari across the key journeys: finding a service, reading pricing, and booking.</p>

      <h2>Known limitations</h2>
      <p>We are honest about gaps rather than claiming perfection. Where we embed third-party content such as a map or review widget, we do not control its markup and it may not fully meet AA. Where that happens we provide the same information in an accessible form on the same page.</p>

      <h2>Tell us if something does not work</h2>
      <p>If any part of this site blocks you, we want to know and we will fix it. Email <a href="mailto:${esc(cfg.contact.email)}">${esc(cfg.contact.email)}</a> or call ${esc(cfg.contact.phoneDisplay)}. Tell us the page and what happened, and we will respond within five business days. If you need information from this site in another format, ask and we will provide it — there is no charge.</p>
    `,
  });
}

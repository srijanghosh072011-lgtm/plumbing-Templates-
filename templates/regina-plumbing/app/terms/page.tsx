import type { Metadata } from 'next';
import { client } from '@/lib/client.config';
import { Prose, LegalPage } from '@/components/legal';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms governing use of the ${client.name} website and the services we provide.`,
  alternates: { canonical: '/terms/' },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lede={`The terms that apply to this website and to work carried out by ${client.name}.`}
      path="/terms/"
    >
      <Prose>
        <h2>Agreement</h2>
        <p>
          These terms apply to your use of this website, operated by {client.legalName}{' '}
          (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By using the site you accept them. If you do
          not, please do not use the site.
        </p>

        <h2>The information on this site</h2>
        <p>
          We keep this site accurate, but plumbing is site-specific work. Prices shown are
          typical ranges for guidance only — they are not quotes, and they do not form an
          offer. The only binding price is the written flat rate we give you for your specific
          job after seeing it.
        </p>
        <p>
          Any guidance on this site about what to do in an emergency is general information.
          It does not replace professional judgement on site, and following it is at your own
          risk. If you are unsure, call us before you act.
        </p>

        <h2>Quotes and work</h2>
        <ul>
          <li>Quotes are valid for 30 days from issue.</li>
          <li>
            Work begins only once you approve the written price. If we discover conditions
            that materially change the job, we stop and re-quote before continuing.
          </li>
          <li>
            Emergency call-out is charged at a flat rate quoted before dispatch, credited
            against the repair if you proceed.
          </li>
          <li>
            Payment terms are net 15 from invoice date. Overdue balances accrue 1.5% monthly.
          </li>
          <li>
            Cancellation: cancel or reschedule at no charge with 24 hours’ notice.
          </li>
        </ul>

        <h2>Warranty</h2>
        <p>
          Our labour is warrantied for two years from completion. Parts and
          equipment carry the manufacturer&apos;s warranty, which we register on your behalf
          where applicable. The warranty does not cover damage from misuse, freezing in an
          unheated property, alterations by others, or pre-existing conditions we identified
          and you declined to have repaired.
        </p>

        <h2>Access and site conditions</h2>
        <p>
          You agree to give us safe access to the work area, and to tell us about known hazards
          — asbestos, unstable structure, aggressive animals, prior unpermitted work. We may
          stop work where conditions are unsafe.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the extent permitted by Saskatchewan law, our liability arising from work we
          perform is limited to the amount you paid us for that work. We are not liable for
          indirect or consequential loss. Nothing here limits liability that cannot lawfully be
          limited, including liability for death or personal injury caused by negligence, or
          your rights under{' '}
          <em>The Consumer Protection and Business Practices Act</em> (Saskatchewan).
        </p>

        <h2>Intellectual property</h2>
        <p>
          The content, design and photography on this site belong to us or our licensors, and
          may not be reproduced without permission.
        </p>

        <h2>Links to other sites</h2>
        <p>
          Where we link to third-party sites, we do not control them and are not responsible
          for their content or privacy practices.
        </p>

        <h2>Governing law</h2>
        <p>
          These terms are governed by the laws of the Province of Saskatchewan and the federal
          laws of Canada that apply in it. Disputes are subject to the courts of Saskatchewan.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms. The version in force is the one published here on the date
          you use the site.
        </p>
      </Prose>
    </LegalPage>
  );
}

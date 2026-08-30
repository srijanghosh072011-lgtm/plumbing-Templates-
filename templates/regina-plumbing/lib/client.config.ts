/**
 * THE ONLY FILE YOU EDIT PER CLIENT.
 *
 * Every page, every schema block, every phone link and legal document reads
 * from here. Nothing below is duplicated anywhere else in the codebase, so
 * NAP consistency (playbook 11) is structural rather than a thing you
 * remember to check.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * BEFORE LAUNCH: every value prefixed TODO_ is fake and MUST be replaced.
 * `npm run check` fails the build if any TODO_ survives. Do not remove that
 * guard to make the build pass — a fake phone number on a live plumbing site
 * sends emergency calls into the void.
 * ─────────────────────────────────────────────────────────────────────────
 */

export const client = {
  // ── Identity ──────────────────────────────────────────────────────────
  legalName: 'Coldsnap Plumbing & Heating Ltd.',
  name: 'Coldsnap Plumbing & Heating',
  shortName: 'Coldsnap',
  tagline: 'Licensed plumbing and heating, across Regina and area.',
  foundedYear: 2011,

  /**
   * The one-sentence answer AI engines lift verbatim. Playbook 3 calls for
   * the "[Entity] is a [category] that [differentiator]" pattern inside the
   * first 150-200 tokens of the page. Keep it factual and specific — vague
   * superlatives ("the best!") do not get cited.
   */
  answerSentence:
    'Coldsnap Plumbing & Heating is a licensed, insured plumbing and heating contractor serving Regina, Saskatchewan, offering 24/7 emergency repair, drain cleaning, water heater replacement, and furnace service with upfront flat-rate pricing.',

  // ── NA(P) ─────────────────────────────────────────────────────────────
  // This is a service-area business: no public storefront, so streetAddress
  // is intentionally omitted from schema. See lib/schema.ts.
  //
  // No phone number, deliberately. Every enquiry runs through the quote form
  // so there is one intake channel with a written record, rather than a
  // half-remembered call. Nothing in the codebase reads a `phone` field — if
  // a client wants one back, it is a config key plus a Cta variant, not a
  // rewrite. See CONTACT.md.
  email: 'service@coldsnapplumbing.example',
  address: {
    locality: 'Regina',
    region: 'SK',
    postalCode: 'S4P 3A1',
    country: 'CA',
  },
  geo: { lat: 50.4452, lng: -104.6189 }, // Regina city centre
  serviceRadiusKm: 60,

  // ── Credentials (E-E-A-T signals, playbook 3) ─────────────────────────
  licenceNumber: 'SK-JP-118472',
  insurance: 'Prairie Mutual — $5,000,000 general liability',
  wcbNumber: 'WCB 0442891',

  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], open: '07:00', close: '17:00' },
    { days: ['Saturday'], open: '08:00', close: '16:00' },
  ],
  emergencyNote: '24/7 emergency call-out — burst pipes, no heat, sewer backups.',

  // ── Web ───────────────────────────────────────────────────────────────
  // No trailing slash. Used for absolute canonicals, OG tags and sitemap.
  siteUrl: 'https://demo.ghoshdesigns.ca',
  // Typed as string rather than inheriting `as const` literal types — an
  // empty literal '' narrows to never at any truthiness check downstream.
  social: {
    facebook: '',
    instagram: '',
    google: '',
  } as Record<'facebook' | 'instagram' | 'google', string>,

  /**
   * Web3Forms access key. Public by design — it only permits posting to the
   * inbox it is bound to, so it is safe in a static bundle. Get one free at
   * https://web3forms.com (no account required).
   */
  web3formsKey: '',

  // Leave empty until GA4 is live; the tag is not rendered without it.
  gaMeasurementId: 'G-LQPHPNP2QT',

  /**
   * Agency credit in the footer copyright line. Set to '' to remove it —
   * some clients would rather their site not advertise who built it, and
   * that is their call, so it is a config value rather than hard-coded.
   */
  /**
   * DEMO MODE. True means every value above is invented and the site is a
   * showcase, not a real business. It downgrades the pre-launch check from
   * blocking to warning, and renders a visible banner so nobody mistakes
   * this for a live company. Set to false the moment real data goes in.
   */
  isDemo: true,

  builtByCredit: 'Ghosh Designs',
  builtByUrl: 'https://ghoshdesigns.ca',
} as const;

export type Client = typeof client;

/** Formats a Saskatchewan service-area line used in copy and meta. */
export const serviceAreaLine = (cities: readonly string[]) =>
  cities.length > 1
    ? `${cities.slice(0, -1).join(', ')} and ${cities[cities.length - 1]}`
    : cities[0];

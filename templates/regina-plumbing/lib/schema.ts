import { client } from './client.config';
import { services, areas, generalFaqs, reviews, aggregateRating, type Service } from './content';

/**
 * JSON-LD builders. Playbook 2 and 3.
 *
 * Rules enforced here:
 *  - `Plumber` rather than the generic `LocalBusiness`: the most specific
 *    type carries more weight with Google and considerably more with AI
 *    engines trying to classify the business.
 *  - No `streetAddress`. This is a service-area business with no public
 *    storefront, so the address is omitted and `areaServed` carries the
 *    geography. Publishing a street address you do not receive customers at
 *    is a Google Business Profile violation.
 *  - Nothing is emitted that is not visible on the page. `AggregateRating`
 *    in particular is omitted entirely unless real review data is present,
 *    because marking up invisible or invented reviews earns a manual action.
 */

const abs = (path = '/') => `${client.siteUrl}${path}`;

const ORG_ID = abs('/#organization');
const SITE_ID = abs('/#website');

/** Two-letter day codes are not valid schema.org; full names are required. */
const openingHours = client.hours.map((h) => ({
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
  opens: h.open,
  closes: h.close,
}));

export function organizationSchema() {
  const sameAs = Object.values(client.social).filter(
    (url) => url && !url.startsWith('TODO_'),
  );

  return {
    '@type': 'Plumber',
    '@id': ORG_ID,
    name: client.name,
    legalName: client.legalName,
    description: client.answerSentence,
    url: abs('/'),
    telephone: client.phoneRaw,
    email: client.email,
    priceRange: '$$',
    currenciesAccepted: 'CAD',
    foundingDate: String(client.foundedYear),
    // Service-area business: locality and region only, no streetAddress.
    address: {
      '@type': 'PostalAddress',
      addressLocality: client.address.locality,
      addressRegion: client.address.region,
      postalCode: client.address.postalCode,
      addressCountry: client.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: client.geo.lat,
      longitude: client.geo.lng,
    },
    areaServed: [
      {
        '@type': 'GeoCircle',
        geoMidpoint: {
          '@type': 'GeoCoordinates',
          latitude: client.geo.lat,
          longitude: client.geo.lng,
        },
        geoRadius: client.serviceRadiusKm * 1000,
      },
      ...areas.map((a) => ({
        '@type': 'City',
        name: a.name,
        address: {
          '@type': 'PostalAddress',
          addressLocality: a.name,
          addressRegion: 'SK',
          addressCountry: 'CA',
        },
      })),
    ],
    openingHoursSpecification: openingHours,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Plumbing and heating services',
      itemListElement: services.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          description: s.short,
          url: abs(`/services/${s.slug}/`),
        },
      })),
    },
    ...(sameAs.length ? { sameAs } : {}),
    // Emitted only when real reviews exist and are rendered on /reviews.
    ...(aggregateRating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: aggregateRating.value,
            reviewCount: aggregateRating.count,
            bestRating: 5,
          },
        }
      : {}),
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    url: abs('/'),
    name: client.name,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-CA',
  };
}

export function serviceSchema(s: Service) {
  return {
    '@type': 'Service',
    '@id': abs(`/services/${s.slug}/#service`),
    name: s.name,
    description: s.answer,
    serviceType: s.name,
    provider: { '@id': ORG_ID },
    areaServed: areas.map((a) => ({ '@type': 'City', name: a.name })),
    url: abs(`/services/${s.slug}/`),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'CAD',
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: s.priceLow,
        maxPrice: s.priceHigh,
        priceCurrency: 'CAD',
        description: s.priceUnit,
      },
    },
  };
}

/** Only call this where the Q&A pairs are actually rendered on the page. */
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: abs(t.path),
    })),
  };
}

export function reviewsSchema() {
  const real = reviews.filter((r) => !r.author.startsWith('TODO_'));
  if (!real.length) return null;

  return real.map((r) => ({
    '@type': 'Review',
    itemReviewed: { '@id': ORG_ID },
    author: { '@type': 'Person', name: r.author },
    datePublished: r.date,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: r.rating,
      bestRating: 5,
    },
    reviewBody: r.body,
  }));
}

export const generalFaqSchema = () => faqSchema(generalFaqs);

/** Wraps any set of nodes into one @graph document. One script tag per page
 *  keeps the relationships (@id references) resolvable. */
export function graph(...nodes: unknown[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes.flat().filter(Boolean),
  };
}

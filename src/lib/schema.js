/**
 * JSON-LD builders.
 *
 * Two playbook rules are enforced structurally here rather than left to discipline:
 *
 * 1. AggregateRating/Review is emitted ONLY when the calling page actually renders
 *    the reviews. Marking up invisible reviews is what triggers a Google manual
 *    action, so `localBusiness()` requires an explicit `withRatings: true` and the
 *    only page that passes it is the one with the testimonial section on screen.
 *
 * 2. A service-area business omits `streetAddress` entirely and leans on
 *    `areaServed` + `GeoCircle`, which is the correct shape for a trades business
 *    with no walk-in storefront.
 */

const DAY = {
  Monday: 'Mo', Tuesday: 'Tu', Wednesday: 'We', Thursday: 'Th',
  Friday: 'Fr', Saturday: 'Sa', Sunday: 'Su',
};

/**
 * Serialise for embedding in <script type="application/ld+json">.
 * Escaping `<` is a hard requirement: an unescaped `</script>` inside any config
 * string would close the tag early and turn content into executable markup.
 */
export function jsonLd(data) {
  return JSON.stringify(data, null, 2)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');
}

const abs = (cfg, path = '/') => new URL(path, cfg.seo.siteUrl).href;

function postalAddress(cfg) {
  const c = cfg.contact;
  return {
    '@type': 'PostalAddress',
    ...(c.streetAddress ? { streetAddress: c.streetAddress } : {}),
    addressLocality: c.addressLocality,
    addressRegion: c.addressRegion,
    ...(c.postalCode ? { postalCode: c.postalCode } : {}),
    addressCountry: c.addressCountry,
  };
}

function openingHours(cfg) {
  const spec = cfg.hours.regular
    .filter((r) => !r.closed)
    .map((r) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: r.days.map((d) => `https://schema.org/${d}`),
      opens: r.opens,
      closes: r.closes,
    }));
  if (cfg.hours.emergency24_7) {
    spec.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: Object.keys(DAY).map((d) => `https://schema.org/${d}`),
      opens: '00:00',
      closes: '23:59',
      description: 'Emergency call-out available 24 hours',
    });
  }
  return spec;
}

/** The business entity. Referenced by @id from every other node on the site. */
export function localBusiness(cfg, { withRatings = false } = {}) {
  const c = cfg.contact;
  return {
    '@context': 'https://schema.org',
    '@type': cfg.seo.organizationType,
    '@id': abs(cfg, '/#business'),
    name: cfg.brand.name,
    legalName: cfg.brand.legalName,
    description: cfg.brand.description,
    url: abs(cfg, '/'),
    telephone: c.phoneE164,
    email: c.email,
    foundingDate: String(cfg.brand.foundingYear),
    priceRange: cfg.brand.priceRange,
    image: abs(cfg, cfg.seo.ogImage),
    logo: abs(cfg, '/assets/img/logo.svg'),
    address: postalAddress(cfg),
    geo: {
      '@type': 'GeoCoordinates',
      latitude: c.latitude,
      longitude: c.longitude,
    },
    areaServed: cfg.areaServed.map((a) => ({
      '@type': 'City',
      name: a.name,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Saskatchewan',
      },
    })),
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: c.latitude, longitude: c.longitude },
      geoRadius: String(c.serviceRadiusKm * 1000),
    },
    openingHoursSpecification: openingHours(cfg),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${cfg.brand.name} Services`,
      itemListElement: cfg.services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: s.name, url: abs(cfg, `/services/${s.slug}/`) },
        ...(s.priceFrom
          ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: s.priceFrom, ...(s.priceTo ? { maxPrice: s.priceTo } : {}), priceCurrency: 'CAD' } }
          : {}),
      })),
    },
    sameAs: Object.values(cfg.social).filter(Boolean),
    ...(withRatings && cfg.reviews
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: cfg.reviews.ratingValue,
            reviewCount: cfg.reviews.reviewCount,
            bestRating: cfg.reviews.bestRating,
          },
          review: cfg.testimonials.map((t) => ({
            '@type': 'Review',
            reviewRating: { '@type': 'Rating', ratingValue: t.rating, bestRating: 5 },
            author: { '@type': 'Person', name: t.author },
            reviewBody: t.quote,
          })),
        }
      : {}),
  };
}

export function website(cfg) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': abs(cfg, '/#website'),
    url: abs(cfg, '/'),
    name: cfg.brand.name,
    inLanguage: cfg.seo.lang,
    publisher: { '@id': abs(cfg, '/#business') },
  };
}

export function service(cfg, s) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': abs(cfg, `/services/${s.slug}/#service`),
    name: s.name,
    description: s.answerFirst,
    serviceType: s.name,
    url: abs(cfg, `/services/${s.slug}/`),
    provider: { '@id': abs(cfg, '/#business') },
    areaServed: cfg.areaServed.map((a) => ({ '@type': 'City', name: a.name })),
    ...(s.priceFrom
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'CAD',
            priceSpecification: {
              '@type': 'PriceSpecification',
              minPrice: s.priceFrom,
              ...(s.priceTo ? { maxPrice: s.priceTo } : {}),
              priceCurrency: 'CAD',
            },
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };
}

/** Only call with Q&As that are genuinely rendered on the page. */
export function faqPage(cfg, faqs, pagePath) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': abs(cfg, `${pagePath}#faq`),
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function breadcrumbs(cfg, trail) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: abs(cfg, t.path),
    })),
  };
}

export function articlePosting(cfg, post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': abs(cfg, `/blog/${post.slug}/#article`),
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@id': abs(cfg, '/#business') },
    publisher: { '@id': abs(cfg, '/#business') },
    mainEntityOfPage: abs(cfg, `/blog/${post.slug}/`),
    articleSection: post.category,
  };
}

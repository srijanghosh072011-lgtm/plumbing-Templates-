/**
 * SINGLE SOURCE OF TRUTH for HTTP security headers.
 *
 * scripts/hash.mjs generates every host-specific config file from this module
 * (vercel.json, netlify.toml, _headers, .htaccess, nginx.conf) and scripts/serve.mjs
 * applies the identical set locally — so what you test is what ships, and there is
 * no chance of five config files drifting apart.
 *
 * Baseline follows the OWASP Secure Headers Project / Mozilla Observatory 2026 set.
 */

/**
 * @param {object} opts
 * @param {string[]} [opts.scriptHashes] sha256-... entries for inline scripts, if any
 * @param {object}   [opts.analytics]    site.config.json analytics block
 */
export function buildCsp({ scriptHashes = [], analytics = {} } = {}) {
  const usesGoogleTags = Boolean(analytics.gtmContainerId || analytics.ga4MeasurementId);
  const usesClarity = Boolean(analytics.clarityProjectId);

  const scriptSrc = ["'self'", ...scriptHashes];
  const connectSrc = ["'self'"];
  const imgSrc = ["'self'", 'data:'];
  const frameSrc = [];

  // Only widen the policy for tags that are actually configured. An unused
  // allowance is a permanently open hole bought for nothing.
  if (usesGoogleTags) {
    scriptSrc.push('https://www.googletagmanager.com');
    connectSrc.push('https://www.google-analytics.com', 'https://analytics.google.com', 'https://region1.google-analytics.com');
    imgSrc.push('https://www.google-analytics.com', 'https://www.googletagmanager.com');
    frameSrc.push('https://www.googletagmanager.com');
  }
  if (usesClarity) {
    scriptSrc.push('https://www.clarity.ms');
    connectSrc.push('https://*.clarity.ms');
  }

  const directives = {
    "default-src": ["'self'"],
    "base-uri": ["'none'"],
    "object-src": ["'none'"],
    // Belt and braces with X-Frame-Options; frame-ancestors is the modern one
    // and is the directive that actually gets enforced by current browsers.
    "frame-ancestors": ["'none'"],
    "form-action": ["'self'"],
    "script-src": scriptSrc,
    // No 'unsafe-inline'. Every inline style attribute was removed from the
    // templates specifically so this could stay clean — see app.css .orb-glow.
    "style-src": ["'self'"],
    "img-src": imgSrc,
    "font-src": ["'self'"],
    "connect-src": connectSrc,
    "manifest-src": ["'self'"],
    "media-src": ["'self'"],
    "worker-src": ["'self'"],
    ...(frameSrc.length ? { "frame-src": frameSrc } : {}),
    "upgrade-insecure-requests": [],
  };

  return Object.entries(directives)
    .map(([k, v]) => (v.length ? `${k} ${v.join(' ')}` : k))
    .join('; ');
}

/**
 * Headers applied to every HTML response.
 *
 * HSTS note: `preload` is deliberately NOT included by default. Submitting to the
 * preload list is effectively irreversible for months, and it must not happen
 * until every subdomain is confirmed HTTPS. Two years max-age with
 * includeSubDomains is the correct pre-preload state; add `; preload` only after
 * that verification, as a conscious decision.
 */
export function securityHeaders({ scriptHashes = [], analytics = {} } = {}) {
  return {
    'Content-Security-Policy': buildCsp({ scriptHashes, analytics }),
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': [
      'accelerometer=()', 'ambient-light-sensor=()', 'autoplay=()', 'battery=()',
      'camera=()', 'display-capture=()', 'document-domain=()', 'encrypted-media=()',
      'fullscreen=(self)', 'geolocation=()', 'gyroscope=()', 'magnetometer=()',
      'microphone=()', 'midi=()', 'payment=()', 'picture-in-picture=()',
      'publickey-credentials-get=()', 'screen-wake-lock=()', 'usb=()', 'xr-spatial-tracking=()',
    ].join(', '),
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'X-Permitted-Cross-Domain-Policies': 'none',
  };
}

/** Long-lived immutable caching for fingerprint-safe static assets. */
export const CACHE_RULES = [
  { path: '/assets/fonts/*', value: 'public, max-age=31536000, immutable' },
  { path: '/assets/img/*', value: 'public, max-age=31536000, immutable' },
  { path: '/assets/css/*', value: 'public, max-age=31536000, immutable' },
  { path: '/assets/js/*', value: 'public, max-age=31536000, immutable' },
  // HTML must revalidate or a content fix can sit stale in caches for a year.
  { path: '/*.html', value: 'public, max-age=0, must-revalidate' },
];

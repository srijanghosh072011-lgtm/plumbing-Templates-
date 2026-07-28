/**
 * GitHub Pages requires a fully static export: no server, no API routes,
 * no on-demand image optimization, and no response headers.
 *
 * BASE_PATH is set by the deploy workflow to the repo name for a project
 * site (https://<user>.github.io/<repo>). Leave it empty for a custom
 * domain or a user/org site served from the root.
 */
const basePath = process.env.BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  // Static export cannot run the image optimizer. Source images are already
  // sized and encoded as WebP/AVIF at build time, with explicit width/height
  // on every <img> to hold layout and protect CLS.
  images: { unoptimized: true },
  // Emits /about/index.html rather than /about.html so Pages serves clean
  // URLs without a redirect hop.
  trailingSlash: true,
  reactStrictMode: true,

  /**
   * Not applied on GitHub Pages — a static host serves files, it cannot
   * attach headers. This block is live the moment the template is deployed
   * to Vercel, Netlify, or any Node host, and mirrors public/_headers so the
   * two never drift. See SECURITY.md for what this does and does not cover.
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "form-action 'self' https://api.web3forms.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "object-src 'none'",
              'upgrade-insecure-requests',
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

import type { Metadata, Viewport } from 'next';
import './globals.css';
import { client } from '@/lib/client.config';
import { asset } from '@/lib/asset';
import { graph, organizationSchema, websiteSchema } from '@/lib/schema';
import { JsonLd } from '@/components/JsonLd';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Analytics } from '@/components/Analytics';

export const metadata: Metadata = {
  metadataBase: new URL(client.siteUrl),
  title: {
    default: `${client.name} | Licensed Plumber in ${client.address.locality}, SK`,
    // Page titles supply their own suffix via this template.
    template: `%s | ${client.name}`,
  },
  description: client.answerSentence.slice(0, 158),
  applicationName: client.name,
  authors: [{ name: client.name, url: client.siteUrl }],
  creator: client.name,
  publisher: client.legalName,
  // Self-referencing absolute canonical. Per-page metadata overrides this.
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: client.siteUrl,
    siteName: client.name,
    title: `${client.name} | Licensed Plumber in ${client.address.locality}, SK`,
    description: client.answerSentence.slice(0, 158),
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: `${client.name} — licensed plumbing and heating` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${client.name} | Licensed Plumber in ${client.address.locality}, SK`,
    description: client.answerSentence.slice(0, 158),
    images: ['/og.jpg'],
  },
  // asset() on every entry: Next does not apply basePath to metadata icons
  // or the manifest link, so on a project site they resolve to the domain
  // root and 404.
  icons: {
    icon: [
      { url: asset('/favicon.ico'), sizes: 'any' },
      { url: asset('/icon-32.png'), type: 'image/png', sizes: '32x32' },
      { url: asset('/icon-192.png'), type: 'image/png', sizes: '192x192' },
    ],
    apple: [{ url: asset('/apple-touch-icon.png'), sizes: '180x180' }],
  },
  manifest: asset('/manifest.webmanifest'),
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: '#0d1428',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-CA">
      <head>
        {/* Self-hosted, so preload rather than preconnect to a font CDN.
            Both faces are used above the fold; without this they are
            discovered only after the CSS parses, which delays LCP text. */}
        <link
          rel="preload"
          href={asset('/fonts/BricolageGrotesque-Variable.woff2')}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href={asset('/fonts/PlusJakartaSans-Variable.woff2')}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        {/* The hero photograph is the LCP element on every viewport. Without
            this it is not discovered until the HTML parser reaches it. */}
        <link
          rel="preload"
          href={asset('/images/hero-bg.webp')}
          as="image"
          fetchPriority="high"
        />

        {/* @font-face lives here, not in globals.css, because a url() in a
            stylesheet cannot see the deployment basePath. See globals.css. */}
        <style
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
@font-face{font-family:'Bricolage Grotesque';src:url('${asset('/fonts/BricolageGrotesque-Variable.woff2')}') format('woff2');font-weight:400 800;font-stretch:75% 100%;font-display:swap;font-style:normal}
@font-face{font-family:'Plus Jakarta Sans';src:url('${asset('/fonts/PlusJakartaSans-Variable.woff2')}') format('woff2');font-weight:400 800;font-display:swap;font-style:normal}
            `.trim(),
          }}
        />
        {/*
          GitHub Pages cannot send response headers, so the policy that can
          live in a meta tag does. This is weaker than the real thing: a meta
          CSP cannot express frame-ancestors, and HSTS is header-only.
          next.config.mjs carries the full set for a host that supports it.
        */}
        <meta
          httpEquiv="Content-Security-Policy"
          content={[
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self'",
            "connect-src 'self' https://api.web3forms.com https://www.google-analytics.com",
            "form-action 'self' https://api.web3forms.com",
            "base-uri 'self'",
            "object-src 'none'",
            'upgrade-insecure-requests',
          ].join('; ')}
        />
      </head>
      <body className="min-h-dvh antialiased">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>


        {/* Organization and WebSite are site-wide; page templates add their
            own nodes referencing these by @id. */}
        <JsonLd data={graph(organizationSchema(), websiteSchema())} />

        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}

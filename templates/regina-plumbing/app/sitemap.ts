import type { MetadataRoute } from 'next';
import { client } from '@/lib/client.config';
import { services, areas } from '@/lib/content';

/**
 * Only canonical, indexable, 200-status URLs belong here. Every route is
 * derived from the same data the pages are, so a new service cannot ship
 * without appearing in the sitemap.
 */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${client.siteUrl}${path}`;

  const staticRoutes: [string, number, MetadataRoute.Sitemap[number]['changeFrequency']][] = [
    ['/', 1.0, 'weekly'],
    ['/services/', 0.9, 'monthly'],
    ['/service-areas/', 0.8, 'monthly'],
    ['/quote/', 0.9, 'monthly'],
    ['/about/', 0.6, 'yearly'],
    ['/reviews/', 0.7, 'monthly'],
    ['/faq/', 0.7, 'monthly'],
    ['/privacy/', 0.2, 'yearly'],
    ['/terms/', 0.2, 'yearly'],
    ['/accessibility/', 0.2, 'yearly'],
  ];

  return [
    ...staticRoutes.map(([path, priority, changeFrequency]) => ({
      url: url(path),
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...services.map((s) => ({
      url: url(`/services/${s.slug}/`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...areas.map((a) => ({
      url: url(`/service-areas/${a.slug}/`),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}

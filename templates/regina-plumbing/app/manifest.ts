import type { MetadataRoute } from 'next';
import { client } from '@/lib/client.config';
import { asset } from '@/lib/asset';

/**
 * Generated rather than a static public/site.webmanifest, for two reasons:
 * the icon `src` values and `start_url` need the deployment basePath applied
 * (a static JSON file cannot do that and would 404 on a project site), and
 * the name fields stay in sync with client.config.ts instead of being a
 * second place to remember to edit.
 */
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: client.name,
    short_name: client.shortName,
    description: client.tagline,
    start_url: asset('/'),
    display: 'standalone',
    background_color: '#fbfaf8',
    theme_color: '#0d1428',
    icons: [
      { src: asset('/icon-192.png'), sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: asset('/apple-touch-icon.png'), sizes: '180x180', type: 'image/png' },
    ],
  };
}

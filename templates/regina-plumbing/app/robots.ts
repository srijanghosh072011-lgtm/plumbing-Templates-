import type { MetadataRoute } from 'next';
import { client } from '@/lib/client.config';

/**
 * Allow-all, deliberately.
 *
 * This is a marketing site for a local business: there is no proprietary
 * content to protect, and blocking AI crawlers removes the business from AI
 * answers at real cost. That includes the retrieval bots that actually drive
 * citations and referrals — OAI-SearchBot, ChatGPT-User, PerplexityBot,
 * Claude-SearchBot — as distinct from training crawlers like GPTBot and
 * Google-Extended, which we also allow.
 *
 * The named groups below are redundant against the wildcard. They are here
 * as documentation: when someone later wonders whether a given bot is
 * permitted, the answer is written down rather than inferred.
 *
 * WARNING: robots.txt is only half of this. Cloudflare's "Block AI bots" /
 * "Control AI Crawlers" setting overrides it at the edge and will silently
 * 403 these same crawlers. Verify at the CDN too — see LAUNCH-CHECKLIST.md.
 */
export const dynamic = 'force-static';

const aiCrawlers = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'GPTBot',
  'PerplexityBot',
  'Perplexity-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'Google-Extended',
  'Applebot-Extended',
  'meta-externalagent',
  'Bingbot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...aiCrawlers.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: `${client.siteUrl}/sitemap.xml`,
    host: client.siteUrl,
  };
}

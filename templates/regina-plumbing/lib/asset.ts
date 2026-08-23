/**
 * Prefixes a public-directory path with the deployment basePath.
 *
 * Next rewrites hrefs for <Link> and srcs for next/image automatically, but
 * it does NOT touch raw <img src>, <link href>, or url() inside CSS. On a
 * GitHub Pages project site — served from /<repo>/ rather than / — every one
 * of those root-relative paths 404s.
 *
 * So anything pointing into public/ goes through here.
 *
 * NEXT_PUBLIC_ prefix is required: this value has to survive into the client
 * bundle, not just the server build.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const asset = (path: string) =>
  `${basePath}${path.startsWith('/') ? path : `/${path}`}`;

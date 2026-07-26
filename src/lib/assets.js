/**
 * Image asset resolver.
 *
 * Templates reference an image by BASE NAME ("hero-primary"), never by
 * filename. The build scans src/assets/img once and resolves each name to
 * whatever file is actually there — so dropping `hero-primary.jpg` next to
 * `hero-primary.svg` swaps a real photograph in with no code change anywhere.
 *
 * Photographs win over the generated illustration, always. That is the whole
 * point: the illustrations are a stand-in, and the moment a real photo of a
 * real job exists it should take over automatically rather than waiting on
 * someone to remember to edit a path.
 */

/** Raster formats beat vector, because a real photo beats a drawing of one. */
const PRIORITY = { avif: 5, webp: 4, jpg: 3, jpeg: 3, png: 2, svg: 1 };

let registry = new Map();

/** @param {string[]} files - readdir() of src/assets/img */
export function setAssetRegistry(files) {
  registry = new Map();
  for (const file of files) {
    const m = /^(.+)\.(avif|webp|jpe?g|png|svg)$/i.exec(file);
    if (!m) continue;
    const [, base, rawExt] = m;
    const ext = rawExt.toLowerCase();
    const current = registry.get(base);
    if (!current || PRIORITY[ext] > PRIORITY[current.ext]) {
      registry.set(base, { file, ext });
    }
  }
  return registry.size;
}

/**
 * Resolve a base name to its public path.
 * Throws rather than returning a guess — a missing image should fail the build
 * loudly, not ship as a broken <img> nobody notices until a client does.
 */
export function imgSrc(name) {
  const hit = registry.get(name);
  if (!hit) {
    throw new Error(
      `No image asset named "${name}" in src/assets/img. ` +
      `Known: ${[...registry.keys()].sort().join(', ') || '(registry empty — did the build call setAssetRegistry?)'}`
    );
  }
  return `/assets/img/${hit.file}`;
}

/** True when a real photograph has replaced the generated illustration. */
export function isPhoto(name) {
  const hit = registry.get(name);
  return Boolean(hit) && hit.ext !== 'svg';
}

/** Base names still backed by a generated illustration. Used by verify:launch. */
export function illustrationsRemaining() {
  return [...registry.entries()].filter(([, v]) => v.ext === 'svg').map(([k]) => k);
}

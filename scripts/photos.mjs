#!/usr/bin/env node
/**
 * Fetch real, commercially-licensed photographs to replace the generated
 * illustrations.
 *
 *   npm run photos                    # Openverse (no API key needed)
 *   PEXELS_API_KEY=xxx npm run photos # Pexels (better trade photography)
 *   npm run photos -- --slots hero-primary,service-1
 *   npm run photos -- --dry-run       # show what would be fetched
 *
 * Photos land in src/assets/img/<slot>.jpg. The asset registry in
 * src/lib/assets.js prefers raster over the .svg illustration automatically, so
 * the next `npm run build` picks them up with no code change.
 *
 * ATTRIBUTION IS NOT OPTIONAL. Every fetched image is recorded in
 * photo-credits.json with its licence, creator and source URL. Openverse
 * aggregates CC-licensed work and most licences require attribution — shipping
 * those without credit is a licence breach. Pexels does not require attribution
 * but the record is still written so you can prove provenance later.
 *
 * NOTE: this could not be executed end-to-end in the environment it was written
 * in — that sandbox blocks every image host at the proxy. The download, resize,
 * write and manifest path IS covered by `npm run photos:selftest`, which runs
 * the identical code against a reachable URL. What is unverified is the shape
 * of each provider's JSON response.
 */
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(ROOT, 'src', 'assets', 'img');

const args = process.argv.slice(2);
const DRY = args.includes('--dry-run');

// indexOf returns -1 when absent, and args[-1 + 1] is args[0] — which silently
// treated the first flag as a slot filter. Guard the lookup explicitly.
const slotsFlag = args.indexOf('--slots');
const onlySlots =
  slotsFlag === -1 ? [] : (args[slotsFlag + 1] ?? '').split(',').map((s) => s.trim()).filter(Boolean);

/* ------------------------------------------------------------------ queries */

/**
 * Search terms per slot. Deliberately concrete: "plumber fixing pipe under
 * sink" returns usable trade photography, "plumbing" returns stock-photo
 * abstractions of pipes on white backgrounds.
 */
const SLOTS = [
  { slot: 'hero-primary',     q: 'plumber working portrait',            orientation: 'portrait' },
  { slot: 'hero-inset',       q: 'pipe wrench hands close up',          orientation: 'squarish' },
  { slot: 'hero-secondary',   q: 'work van vehicle',                    orientation: 'landscape' },
  { slot: 'about-team',       q: 'tradespeople team portrait',          orientation: 'landscape' },
  { slot: 'about-detail',     q: 'plumbing tools workshop',             orientation: 'portrait'  },
  { slot: 'process-portrait', q: 'plumber inspecting pipes',            orientation: 'squarish' },
  { slot: 'testimonial',      q: 'modern bathroom sink interior',       orientation: 'landscape' },
  { slot: 'cta-figure',       q: 'plumber with toolbox',                orientation: 'portrait'  },

  { slot: 'service-1', q: 'burst pipe water leak',            orientation: 'landscape' },
  { slot: 'service-2', q: 'drain cleaning pipe',              orientation: 'landscape' },
  { slot: 'service-3', q: 'water heater boiler installation', orientation: 'landscape' },
  { slot: 'service-4', q: 'water leak wall damage',           orientation: 'landscape' },
  { slot: 'service-5', q: 'kitchen faucet tap installation',  orientation: 'landscape' },
  { slot: 'service-6', q: 'excavation trench pipe ground',    orientation: 'landscape' },

  { slot: 'project-1', q: 'plumber repairing pipe',           orientation: 'landscape' },
  { slot: 'project-2', q: 'sewer drain inspection',           orientation: 'landscape' },
  { slot: 'project-3', q: 'boiler water heater room',         orientation: 'landscape' },
  { slot: 'project-4', q: 'pipe laying construction',         orientation: 'landscape' },
  { slot: 'project-5', q: 'floor repair renovation',          orientation: 'landscape' },
  { slot: 'project-6', q: 'copper pipe soldering',            orientation: 'landscape' },

  { slot: 'post-1', q: 'water damage ceiling',                orientation: 'landscape' },
  { slot: 'post-2', q: 'pipes under kitchen sink',            orientation: 'landscape' },
  { slot: 'post-3', q: 'water heater tank',                   orientation: 'landscape' },
];

/* ---------------------------------------------------------------- providers */

/** Pexels — best trade photography. Free key: https://www.pexels.com/api/ */
async function pexels(query, orientation) {
  const key = process.env.PEXELS_API_KEY;
  const o = orientation === 'squarish' ? 'square' : orientation;
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=${o}`;
  const res = await fetch(url, { headers: { Authorization: key } });
  if (!res.ok) throw new Error(`Pexels ${res.status} ${res.statusText}`);
  const json = await res.json();
  const p = json.photos?.[0];
  if (!p) return null;
  return {
    download: p.src?.large2x ?? p.src?.original,
    credit: {
      provider: 'Pexels',
      licence: 'Pexels License (commercial use, no attribution required)',
      creator: p.photographer,
      creatorUrl: p.photographer_url,
      sourceUrl: p.url,
    },
  };
}

/** Openverse — CC-licensed aggregator, no API key. Filtered to commercial use. */
async function openverse(query, orientation) {
  const ar = orientation === 'portrait' ? 'tall' : orientation === 'landscape' ? 'wide' : 'square';
  const url =
    `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}` +
    `&license_type=commercial&aspect_ratio=${ar}&page_size=1&mature=false`;
  const res = await fetch(url, { headers: { 'User-Agent': 'plumbing-template/1.0' } });
  if (!res.ok) throw new Error(`Openverse ${res.status} ${res.statusText}`);
  const json = await res.json();
  const r = json.results?.[0];
  if (!r) return null;
  return {
    download: r.url,
    credit: {
      provider: 'Openverse',
      licence: `${(r.license ?? '').toUpperCase()} ${r.license_version ?? ''}`.trim(),
      creator: r.creator ?? 'Unknown',
      creatorUrl: r.creator_url ?? null,
      sourceUrl: r.foreign_landing_url ?? r.url,
      title: r.title ?? null,
      // CC-BY and CC-BY-SA REQUIRE visible credit on the page that uses them.
      attributionRequired: !String(r.license ?? '').toLowerCase().startsWith('cc0'),
    },
  };
}

/* ------------------------------------------------------------------ fetching */

/**
 * Download a URL to src/assets/img/<slot>.<ext>.
 * Exported so photos:selftest can exercise this exact path against a URL that
 * is reachable, rather than leaving all the file handling untested.
 */
export async function saveImage(url, slot) {
  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);

  const type = res.headers.get('content-type') ?? '';
  if (!type.startsWith('image/')) throw new Error(`Not an image (${type}): ${url}`);

  const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' }[type.split(';')[0]];
  if (!ext) throw new Error(`Unsupported image type ${type}`);

  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 4096) throw new Error(`Suspiciously small (${buf.length}b): ${url}`);

  await mkdir(IMG, { recursive: true });
  const file = `${slot}.${ext}`;
  await writeFile(join(IMG, file), buf);
  return { file, bytes: buf.length };
}

/* ---------------------------------------------------------------------- main */

async function main() {
  const provider = process.env.PEXELS_API_KEY ? pexels : openverse;
  const name = process.env.PEXELS_API_KEY ? 'Pexels' : 'Openverse';

  const targets = onlySlots.length ? SLOTS.filter((s) => onlySlots.includes(s.slot)) : SLOTS;
  if (!targets.length) {
    console.error(`No slots matched. Known: ${SLOTS.map((s) => s.slot).join(', ')}`);
    process.exit(1);
  }

  console.log(`Provider: ${name}${name === 'Openverse' ? '  (set PEXELS_API_KEY for better trade photography)' : ''}`);
  console.log(`Fetching ${targets.length} photo(s)\n`);

  const credits = [];
  const failures = [];

  for (const t of targets) {
    if (DRY) { console.log(`  [dry] ${t.slot.padEnd(18)} "${t.q}"`); continue; }
    try {
      const hit = await provider(t.q, t.orientation);
      if (!hit) { failures.push({ slot: t.slot, why: 'no results' }); console.log(`  --   ${t.slot.padEnd(18)} no results for "${t.q}"`); continue; }

      const { file, bytes } = await saveImage(hit.download, t.slot);
      credits.push({ slot: t.slot, file, query: t.q, ...hit.credit });
      console.log(`  ok   ${t.slot.padEnd(18)} ${file}  ${(bytes / 1024).toFixed(0)} KB  ${hit.credit.licence}`);

      // Be a good citizen with an unauthenticated public API.
      if (name === 'Openverse') await new Promise((r) => setTimeout(r, 350));
    } catch (e) {
      failures.push({ slot: t.slot, why: e.message });
      console.log(`  FAIL ${t.slot.padEnd(18)} ${e.message}`);
    }
  }

  if (DRY) return;

  if (credits.length) {
    const path = join(ROOT, 'photo-credits.json');
    let existing = [];
    try { existing = JSON.parse(await readFile(path, 'utf8')).photos ?? []; } catch { /* first run */ }
    const merged = [...existing.filter((e) => !credits.some((c) => c.slot === e.slot)), ...credits];
    await writeFile(path, JSON.stringify({
      __note: 'Attribution record for fetched photography. Licences marked attributionRequired MUST be credited visibly on the site (a credits page or image caption). Do not delete this file.',
      generatedBy: 'scripts/photos.mjs',
      photos: merged,
    }, null, 2) + '\n');
    console.log(`\nWrote photo-credits.json (${merged.length} photo(s))`);

    const needAttr = merged.filter((c) => c.attributionRequired);
    if (needAttr.length) {
      console.log(`\n  ${needAttr.length} photo(s) REQUIRE visible attribution:`);
      for (const c of needAttr) console.log(`    ${c.slot}: ${c.creator} — ${c.licence}`);
      console.log('  Add a credits page or captions before launch.');
    }
  }

  console.log(`\nDone. ${credits.length} fetched, ${failures.length} failed.`);
  console.log('Run `npm run build` — the asset registry prefers photos over illustrations automatically.');
  if (failures.length) console.log('Failed slots keep their illustration, so nothing is broken.');
}

// Only run when invoked directly, so photos:selftest can import saveImage.
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => { console.error(e.stack); process.exit(1); });
}

#!/usr/bin/env node
/**
 * Fit raw photographs into the site's image slots.
 *
 *   node scripts/fit-photos.mjs <source-dir> [--map map.json] [--quality 82]
 *
 * Raw camera/stock files are 3-7k pixels wide and 1-3 MB each. Shipping those
 * would wreck LCP on the very pages this template optimises for — one hero
 * photo can outweigh the entire rest of the site. This centre-crops each photo
 * to its slot's aspect ratio, downscales to 2x the slot's CSS size (retina,
 * no more), and re-encodes as JPEG.
 *
 * Target dimensions come from src/assets/img/art.manifest.json, which the
 * illustration generator already writes — so the slot table lives in exactly
 * one place and cannot drift.
 *
 * ponytail: resizing runs through the Chromium already present for QA rather
 * than adding sharp (native binary, platform-specific install) for what canvas
 * does in ten lines.
 */
import { chromium } from 'playwright';
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(ROOT, 'src', 'assets', 'img');

const args = process.argv.slice(2);
const SRC = args[0];
const mapFlag = args.indexOf('--map');
const MAP_PATH = mapFlag === -1 ? null : args[mapFlag + 1];
const qFlag = args.indexOf('--quality');
const QUALITY = qFlag === -1 ? 0.82 : Number(args[qFlag + 1]) / 100;

/**
 * Hard cap on the longest edge.
 *
 * art.manifest's recommendedPixels is 2x the illustration's nominal size, which
 * overshoots badly for photographs — the hero came out 1800x2200 / 597 KB, and
 * that is the LCP image on the busiest page. Nothing here renders wider than
 * ~700 CSS px, so 1400 covers 2x DPR with room to spare. Bytes on the LCP image
 * are the single most expensive thing on the page.
 */
const maxFlag = args.indexOf('--max');
const MAX_EDGE = maxFlag === -1 ? 1400 : Number(args[maxFlag + 1]);

/** Scale a target box down so its longest edge fits MAX_EDGE, keeping ratio. */
function capped(w, h) {
  const longest = Math.max(w, h);
  if (longest <= MAX_EDGE) return { w, h };
  const k = MAX_EDGE / longest;
  return { w: Math.round(w * k), h: Math.round(h * k) };
}

if (!SRC) {
  console.error('Usage: node scripts/fit-photos.mjs <source-dir> [--map map.json] [--quality 82]');
  process.exit(1);
}

/* ------------------------------------------------------- slot dimensions */

const manifest = JSON.parse(await readFile(join(IMG, 'art.manifest.json'), 'utf8'));
const TARGET = Object.fromEntries(
  manifest.replaceBeforeLaunch.map((s) => {
    const [w, h] = s.recommendedPixels.split('x').map(Number);
    return [s.file.replace(/\.svg$/, ''), { w, h, subject: s.intendedSubject }];
  })
);

/* ------------------------------------------------------------------- map */

// { "<slot>": "<filename in SRC>" } — one source file may feed several slots.
const map = MAP_PATH
  ? JSON.parse(await readFile(MAP_PATH, 'utf8'))
  : null;

if (!map) {
  console.log('No --map given. Available slots and their targets:\n');
  for (const [slot, t] of Object.entries(TARGET)) {
    console.log(`  ${slot.padEnd(20)} ${String(t.w + 'x' + t.h).padEnd(12)} ${t.subject}`);
  }
  console.log('\nSource files:');
  for (const f of (await readdir(SRC)).filter((f) => /\.(jpe?g|png|webp)$/i.test(f))) {
    console.log(`  ${f}`);
  }
  process.exit(0);
}

/* ------------------------------------------------- serve sources locally */

// file:// is blocked from a setContent page, so the sources are served over
// loopback for the duration of the run.
const PORT = 4455;
const server = createServer(async (req, res) => {
  // "/" must return a real page: the browser has to be ON this origin so the
  // images count as same-origin. A cross-origin image taints the canvas and
  // toDataURL() then throws SecurityError. A 404 here also navigates the page
  // to an error document mid-run and destroys the execution context.
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end('<!doctype html><title>fit-photos</title><body>');
  }
  try {
    const name = decodeURIComponent(req.url.slice(1));
    const buf = await readFile(join(SRC, name));
    const type = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }[extname(name).toLowerCase()];
    res.writeHead(200, { 'Content-Type': type ?? 'application/octet-stream' });
    res.end(buf);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(PORT, r));

/* ----------------------------------------------------------------- fit */

const browser = await chromium.launch(
  process.env.QA_CHROMIUM ? { executablePath: process.env.QA_CHROMIUM } : {}
);
const page = await browser.newPage();
await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'load' });

await mkdir(IMG, { recursive: true });
let total = 0;
const results = [];

for (const [slot, sourceFile] of Object.entries(map)) {
  const raw = TARGET[slot];
  if (!raw) {
    console.log(`  SKIP ${slot} — not a known slot`);
    continue;
  }
  const t = { ...raw, ...capped(raw.w, raw.h) };

  const dataUrl = await page.evaluate(
    async ({ url, w, h, q }) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;
      await img.decode();

      // Centre-crop to the slot's aspect ratio, then scale down to fit.
      const targetAR = w / h;
      const srcAR = img.naturalWidth / img.naturalHeight;
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
      if (srcAR > targetAR) {
        sw = img.naturalHeight * targetAR;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / targetAR;
        sy = (img.naturalHeight - sh) / 2;
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      return canvas.toDataURL('image/jpeg', q);
    },
    { url: `http://localhost:${PORT}/${encodeURIComponent(sourceFile)}`, w: t.w, h: t.h, q: QUALITY }
  );

  const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
  await writeFile(join(IMG, `${slot}.jpg`), buf);
  total += buf.length;
  results.push({ slot, from: sourceFile, px: `${t.w}x${t.h}`, kb: buf.length / 1024 });
  console.log(`  ${slot.padEnd(20)} ${String(t.w + 'x' + t.h).padEnd(12)} ${(buf.length / 1024).toFixed(0).padStart(4)} KB   <- ${sourceFile}`);
}

await browser.close();
server.close();

console.log(`\n${results.length} slot(s) filled, ${(total / 1024).toFixed(0)} KB total.`);
console.log('Run `npm run build` — the asset registry prefers these over the illustrations.');

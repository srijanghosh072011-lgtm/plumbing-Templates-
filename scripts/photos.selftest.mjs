#!/usr/bin/env node
/**
 * Self-test for the photo pipeline.
 *
 * scripts/photos.mjs could not be run end-to-end where it was written — that
 * sandbox blocks every image host at the proxy. Rather than ship the whole
 * thing unverified, this exercises the parts that do not depend on a provider
 * API: download → content-type check → size guard → write → asset registry
 * resolution → raster-beats-vector precedence.
 *
 * What remains unverified is only the JSON shape of each provider's search
 * response.
 *
 *   npm run photos:selftest
 */
import { readdir, rm, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { saveImage } from './photos.mjs';
import { setAssetRegistry, imgSrc, isPhoto, illustrationsRemaining } from '../src/lib/assets.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(ROOT, 'src', 'assets', 'img');
const SLOT = '__selftest';

// Reachable from the build sandbox and a genuine binary PNG.
const TEST_URL = 'https://raw.githubusercontent.com/github/explore/main/topics/javascript/javascript.png';

let pass = 0, fail = 0;
const check = (name, ok, detail = '') => {
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);
  ok ? pass++ : fail++;
};

try {
  /* 1. download + write */
  const { file, bytes } = await saveImage(TEST_URL, SLOT);
  check('downloads and writes an image', bytes > 4096, `${file}, ${bytes} bytes`);
  check('picks extension from content-type', file.endsWith('.png'), file);

  const onDisk = await stat(join(IMG, file));
  check('file exists on disk with real bytes', onDisk.size === bytes);

  /* 2. registry resolves the new file */
  setAssetRegistry(await readdir(IMG));
  check('registry resolves the slot', imgSrc(SLOT) === `/assets/img/${file}`, imgSrc(SLOT));
  check('registry reports it as a photo', isPhoto(SLOT) === true);

  /* 3. raster must beat the vector illustration for the same base name */
  setAssetRegistry(['hero-primary.svg', 'hero-primary.jpg', 'only-vector.svg']);
  check('raster beats vector', imgSrc('hero-primary') === '/assets/img/hero-primary.jpg', imgSrc('hero-primary'));
  check('vector kept when no raster', imgSrc('only-vector') === '/assets/img/only-vector.svg');
  check('isPhoto false for vector-only', isPhoto('only-vector') === false);
  check('illustrationsRemaining lists vector-only slots',
    JSON.stringify(illustrationsRemaining()) === JSON.stringify(['only-vector']),
    JSON.stringify(illustrationsRemaining()));

  /* 4. missing asset fails loudly rather than emitting a broken <img> */
  let threw = false;
  try { imgSrc('does-not-exist'); } catch { threw = true; }
  check('unknown asset throws', threw);

  /* 5. non-image URLs are rejected */
  let rejected = false;
  try {
    await saveImage('https://raw.githubusercontent.com/github/explore/main/README.md', '__selftest_bad');
  } catch (e) { rejected = /Not an image/.test(e.message); }
  check('rejects non-image content-type', rejected);

} catch (e) {
  check('pipeline ran without throwing', false, e.message);
} finally {
  for (const f of ['__selftest.png', '__selftest.jpg', '__selftest_bad.png']) {
    await rm(join(IMG, f), { force: true });
  }
  // leave the registry reflecting reality for anything running after us
  setAssetRegistry(await readdir(IMG));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

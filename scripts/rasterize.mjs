#!/usr/bin/env node
/**
 * Rasterise the SVG logo into the PNG/ICO assets browsers still ask for.
 *
 * Dev-time only — the outputs are committed, so a client cloning this template
 * never runs it and never needs Playwright installed. Re-run only when the logo
 * changes.
 *
 * ponytail: reuses the Chromium already present for QA rather than pulling in
 * sharp/resvg (native binaries, platform-specific install pain) to draw two icons.
 */
import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(ROOT, 'src', 'assets', 'img');

const SIZES = [
  { file: 'apple-touch-icon.png', size: 180 },
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'favicon-32.png', size: 32 },
];

/**
 * Minimal single-image ICO container wrapping a PNG.
 * PNG-in-ICO is valid and supported by every browser that still requests
 * favicon.ico, so there is no need to encode BMP.
 */
function icoFromPng(png, size) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);   // reserved
  header.writeUInt16LE(1, 2);   // type: icon
  header.writeUInt16LE(1, 4);   // image count

  const entry = Buffer.alloc(16);
  entry.writeUInt8(size >= 256 ? 0 : size, 0); // width  (0 means 256)
  entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2);                      // palette
  entry.writeUInt8(0, 3);                      // reserved
  entry.writeUInt16LE(1, 4);                   // colour planes
  entry.writeUInt16LE(32, 6);                  // bits per pixel
  entry.writeUInt32LE(png.length, 8);          // payload size
  entry.writeUInt32LE(22, 12);                 // payload offset

  return Buffer.concat([header, entry, png]);
}

const browser = await chromium.launch(
  process.env.QA_CHROMIUM ? { executablePath: process.env.QA_CHROMIUM } : {}
);

const svg = await readFile(join(IMG, 'logo.svg'), 'utf8');
const page = await browser.newPage();

for (const { file, size } of SIZES) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(
    `<style>html,body{margin:0;padding:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${svg}`
  );
  const png = await page.screenshot({ omitBackground: true, type: 'png' });
  await writeFile(join(IMG, file), png);
  console.log(`  ${file} (${size}x${size}, ${(png.length / 1024).toFixed(1)} KB)`);

  if (size === 32) {
    await writeFile(join(ROOT, 'src', 'assets', 'favicon.ico'), icoFromPng(png, 32));
    console.log('  favicon.ico');
  }
}

await browser.close();

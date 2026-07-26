#!/usr/bin/env node
/**
 * Capture reference screenshots of the built site.
 * Usage: node tests/screenshot.mjs [outputDir]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = process.env.QA_BASE ?? 'http://localhost:4321';
const OUT = process.argv[2] ?? 'screenshots';

const SHOTS = [
  { file: 'home-desktop.png', path: '/', width: 1440, height: 900, full: true },
  { file: 'home-mobile.png', path: '/', width: 390, height: 844, full: true },
  { file: 'service-desktop.png', path: '/services/water-heater-repair/', width: 1440, height: 900, full: true },
  { file: 'contact-desktop.png', path: '/contact/', width: 1440, height: 900, full: true },
  { file: 'area-desktop.png', path: '/service-areas/lumsden/', width: 1440, height: 900, full: true },
  { file: 'theme-midnight-copper.png', path: '/', width: 1440, height: 900, full: false, theme: 'midnight-copper' },
  { file: 'theme-blueprint-steel.png', path: '/', width: 1440, height: 900, full: false, theme: 'blueprint-steel' },
  { file: 'theme-forest-lime.png', path: '/', width: 1440, height: 900, full: false },
];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch(
  process.env.QA_CHROMIUM ? { executablePath: process.env.QA_CHROMIUM } : {}
);

for (const s of SHOTS) {
  const ctx = await browser.newContext({
    viewport: { width: s.width, height: s.height },
    deviceScaleFactor: 2,
    // Reveal animations are scroll-triggered; disabling motion makes the
    // full-page capture deterministic instead of catching mid-transition state.
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await page.goto(BASE + s.path, { waitUntil: 'networkidle' });

  if (s.theme) {
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), s.theme);
    await page.waitForTimeout(300);
  }

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  await page.screenshot({ path: join(OUT, s.file), fullPage: s.full });
  console.log(`  ${s.file}`);
  await ctx.close();
}

await browser.close();

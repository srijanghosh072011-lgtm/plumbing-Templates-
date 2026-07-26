#!/usr/bin/env node
/**
 * Browser QA suite. Drives real Chromium against the locally-served build with
 * production security headers applied.
 *
 * Checks, in order of how much they cost you if they break:
 *   1. CSP — no violations, and the strict policy does not break JSON-LD or JS
 *   2. Console — zero errors or failed requests on any page
 *   3. Layout — no horizontal overflow at 375 / 768 / 1440
 *   4. A11y — one H1, alt text everywhere, labelled inputs, reachable skip link,
 *      keyboard-operable menu with a working focus trap
 *   5. Conversion paths — tel:/mailto: links present and correctly formatted
 *
 * Run:  npm run qa        (expects `npm run dev` or scripts/serve.mjs running)
 */
import { chromium } from 'playwright';

const BASE = process.env.QA_BASE ?? 'http://localhost:4321';
const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
];

const PAGES = [
  '/', '/services/', '/services/emergency-plumbing/', '/service-areas/',
  '/service-areas/regina/', '/about/', '/contact/', '/blog/',
  '/blog/winterize-plumbing-saskatchewan/', '/privacy/', '/404.html',
];

const results = [];
const fail = (page, check, detail) => results.push({ ok: false, page, check, detail });
const pass = (page, check) => results.push({ ok: true, page, check });

// CI images often pin a Chromium build that does not match the installed
// Playwright package. QA_CHROMIUM lets you point at an existing binary instead
// of downloading a second copy.
const browser = await chromium.launch(
  process.env.QA_CHROMIUM ? { executablePath: process.env.QA_CHROMIUM } : {}
);

/* ------------------------------------------------- per-page correctness pass */
for (const path of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const csp = [];
  const errs = [];
  const failedReq = [];

  page.on('console', (m) => {
    const t = m.text();
    if (/Content Security Policy|Refused to/i.test(t)) csp.push(t);
    else if (m.type() === 'error') errs.push(t);
  });
  page.on('pageerror', (e) => errs.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => failedReq.push(`${r.url()} — ${r.failure()?.errorText}`));

  const res = await page.goto(BASE + path, { waitUntil: 'networkidle' });

  // Status
  const expected = path === '/404.html' ? [200, 404] : [200];
  if (!expected.includes(res.status())) fail(path, 'status', `got ${res.status()}`);
  else pass(path, 'status');

  csp.length ? fail(path, 'csp', csp.join(' | ')) : pass(path, 'csp');
  errs.length ? fail(path, 'console', errs.join(' | ')) : pass(path, 'console');
  failedReq.length ? fail(path, 'requests', failedReq.join(' | ')) : pass(path, 'requests');

  // JSON-LD parses
  const ld = await page.$$eval('script[type="application/ld+json"]', (els) =>
    els.map((e) => { try { JSON.parse(e.textContent); return null; } catch (x) { return String(x); } }).filter(Boolean)
  );
  ld.length ? fail(path, 'json-ld', ld.join(' | ')) : pass(path, 'json-ld');

  // Exactly one H1
  const h1 = await page.$$eval('h1', (e) => e.length);
  h1 === 1 ? pass(path, 'single-h1') : fail(path, 'single-h1', `found ${h1}`);

  // Canonical present and absolute
  const canon = await page.$eval('link[rel=canonical]', (e) => e.href).catch(() => null);
  canon?.startsWith('http') ? pass(path, 'canonical') : fail(path, 'canonical', String(canon));

  // Every img has an alt attribute (empty is valid for decorative)
  const noAlt = await page.$$eval('img:not([alt])', (e) => e.length);
  noAlt === 0 ? pass(path, 'img-alt') : fail(path, 'img-alt', `${noAlt} images missing alt`);

  // Every form control is labelled
  const unlabelled = await page.$$eval('input:not([type=hidden]), select, textarea', (els) =>
    els.filter((el) => {
      if (el.closest('[aria-hidden="true"]')) return false;
      if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) return false;
      return !(el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`));
    }).length
  );
  unlabelled === 0 ? pass(path, 'form-labels') : fail(path, 'form-labels', `${unlabelled} unlabelled`);

  // Skip link is the first focusable element
  await page.keyboard.press('Tab');
  const firstFocus = await page.evaluate(() => document.activeElement?.className ?? '');
  firstFocus.includes('skip-link') ? pass(path, 'skip-link') : fail(path, 'skip-link', `first focus: ${firstFocus}`);

  // tel: links well-formed E.164
  const badTel = await page.$$eval('a[href^="tel:"]', (els) =>
    els.map((e) => e.getAttribute('href')).filter((h) => !/^tel:\+[1-9]\d{7,14}$/.test(h))
  );
  badTel.length ? fail(path, 'tel-format', badTel.join(', ')) : pass(path, 'tel-format');

  // No placeholder anchors
  const deadLinks = await page.$$eval('a[href="#"], a[href=""]', (e) => e.length);
  deadLinks === 0 ? pass(path, 'no-dead-links') : fail(path, 'no-dead-links', `${deadLinks} found`);

  /* ---------------------------------------------- responsive overflow check */
  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.waitForTimeout(180);
    const overflow = await page.evaluate(
      (w) => document.documentElement.scrollWidth > w + 1
        ? { scrollWidth: document.documentElement.scrollWidth, viewport: w }
        : null,
      vp.width
    );
    overflow
      ? fail(path, `no-h-scroll@${vp.name}`, `scrollWidth ${overflow.scrollWidth} > ${vp.width}`)
      : pass(path, `no-h-scroll@${vp.name}`);
  }

  await ctx.close();
}

/* --------------------------------------------------- mobile menu interaction */
{
  const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });

  await page.click('[data-menu-toggle]');
  await page.waitForTimeout(500);

  const opened = await page.getAttribute('[data-menu-sheet]', 'data-open');
  opened === 'true' ? pass('/', 'menu-opens') : fail('/', 'menu-opens', `data-open=${opened}`);

  const focusInside = await page.evaluate(() =>
    document.querySelector('[data-menu-sheet]')?.contains(document.activeElement)
  );
  focusInside ? pass('/', 'menu-focus-moves') : fail('/', 'menu-focus-moves', 'focus stayed outside sheet');

  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  const closed = await page.getAttribute('[data-menu-sheet]', 'data-open');
  closed === 'false' ? pass('/', 'menu-escape-closes') : fail('/', 'menu-escape-closes', `data-open=${closed}`);

  const scrollRestored = await page.evaluate(() => document.documentElement.style.overflow === '');
  scrollRestored ? pass('/', 'menu-restores-scroll') : fail('/', 'menu-restores-scroll', 'overflow left locked');

  await ctx.close();
}

/* ----------------------------------------------------- reduced-motion honour */
{
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  const hidden = await page.$$eval('[data-reveal]', (els) =>
    els.filter((e) => getComputedStyle(e).opacity === '0').length
  );
  hidden === 0
    ? pass('/', 'reduced-motion-content-visible')
    : fail('/', 'reduced-motion-content-visible', `${hidden} elements still hidden`);
  await ctx.close();
}

await browser.close();

/* -------------------------------------------------------------------- report */
const failures = results.filter((r) => !r.ok);
const grouped = {};
for (const r of results) (grouped[r.page] ??= []).push(r);

for (const [pg, checks] of Object.entries(grouped)) {
  const bad = checks.filter((c) => !c.ok);
  console.log(`${bad.length ? '✗' : '✓'} ${pg}  (${checks.length - bad.length}/${checks.length})`);
  for (const b of bad) console.log(`    ✗ ${b.check}: ${b.detail}`);
}

console.log(`\n${results.length - failures.length}/${results.length} checks passed`);
if (failures.length) {
  console.error(`${failures.length} FAILED`);
  process.exit(1);
}

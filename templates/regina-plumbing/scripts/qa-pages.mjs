#!/usr/bin/env node
/**
 * Post-build page QA. Crawls the exported site and asserts the per-page
 * invariants that are easy to break and expensive to miss: exactly one H1,
 * title and description within SERP limits, a canonical, alt text and
 * explicit dimensions on every image, labelled form fields, no empty
 * anchors, no stray noindex, and no skipped heading levels.
 *
 * Usage:
 *   npm run build
 *   npx serve out -p 8899      (or: python3 -m http.server 8899 -d out)
 *   node scripts/qa-pages.mjs
 *
 * Requires playwright and a Chromium binary; set CHROME_PATH if the default
 * is wrong for your machine. This complements prelaunch-check.mjs, which
 * scans source rather than rendered output.
 */

import { chromium } from 'playwright';

const BASE = process.env.QA_BASE_URL || 'http://localhost:8899';
const CHROME = process.env.CHROME_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const b = await chromium.launch({ executablePath: CHROME });
const paths = ['/', '/services/', '/services/drain-cleaning/', '/service-areas/', '/service-areas/lumsden/',
  '/quote/', '/about/', '/reviews/', '/faq/', '/privacy/', '/terms/', '/accessibility/', '/404.html'];
let fails = 0;
for (const path of paths) {
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
  await p.goto(BASE + path, { waitUntil: 'domcontentloaded' });
  const r = await p.evaluate(() => {
    const q = (s) => [...document.querySelectorAll(s)];
    const heads = q('h1,h2,h3,h4').map(h => +h.tagName[1]);
    let jump = null;
    for (let i = 1; i < heads.length; i++) if (heads[i] - heads[i-1] > 1) jump = `${heads[i-1]}->${heads[i]}`;
    return {
      h1: q('h1').length,
      title: document.title.length,
      desc: (document.querySelector('meta[name=description]')?.content || '').length,
      canonical: !!document.querySelector('link[rel=canonical]'),
      imgNoAlt: q('img').filter(i => i.alt === null || i.alt === undefined).length,
      imgNoDim: q('img').filter(i => !i.width || !i.height).length,
      emptyHref: q('a[href="#"]').length,
      unlabelled: q('input,select,textarea').filter(el =>
        el.type !== 'hidden' && !el.labels?.length && !el.getAttribute('aria-label')).length,
      skip: !!document.querySelector('.skip-link'),
      jsonld: q('script[type="application/ld+json"]').length,
      headJump: jump,
      noindex: !!document.querySelector('meta[name=robots][content*=noindex]'),
    };
  });
  const errs = [];
  if (r.h1 !== 1) errs.push(`h1 count=${r.h1}`);
  if (r.title < 10 || r.title > 65) errs.push(`title len=${r.title}`);
  if (r.desc < 50 || r.desc > 165) errs.push(`desc len=${r.desc}`);
  if (!r.canonical && path !== '/404.html') errs.push('no canonical');
  if (r.imgNoAlt) errs.push(`${r.imgNoAlt} img w/o alt`);
  if (r.imgNoDim) errs.push(`${r.imgNoDim} img w/o dims`);
  if (r.emptyHref) errs.push(`${r.emptyHref} href="#"`);
  if (r.unlabelled) errs.push(`${r.unlabelled} unlabelled field`);
  if (!r.skip) errs.push('no skip link');
  if (r.noindex && path !== '/404.html') errs.push('NOINDEX PRESENT');
  if (r.headJump) errs.push(`heading jump ${r.headJump}`);
  if (errs.length) fails++;
  console.log(`${errs.length ? '✖' : '✓'} ${path.padEnd(34)} ld=${r.jsonld} ${errs.join('; ')}`);
  await p.close();
}
await b.close();
console.log(fails ? `\n${fails} page(s) with issues` : '\nAll pages clean');
process.exit(fails ? 1 : 0);

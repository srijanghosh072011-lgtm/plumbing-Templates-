#!/usr/bin/env node
/**
 * Pre-launch gate. The playbook's Stage-1 checklist as executable code.
 *
 *   npm run verify          structural checks — run on every build
 *   npm run verify:launch   adds the BLOCKING launch gate
 *
 * The launch gate exists because "remember to replace the placeholder content"
 * is the single most reliably forgotten step in web delivery, and leftover
 * staging noindex/placeholder data is the most expensive. A checklist item you
 * can tick without doing is not a control; a build that refuses to pass is.
 *
 * Exit code is non-zero on any error, so this drops straight into CI.
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, dirname, relative, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const LAUNCH = process.argv.includes('--launch');

const cfg = JSON.parse(await readFile(join(ROOT, 'site.config.json'), 'utf8'));

const errors = [];
const warnings = [];
const err = (file, msg) => errors.push({ file, msg });
const warn = (file, msg) => warnings.push({ file, msg });

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const all = await walk(DIST).catch(() => {
  console.error('dist/ not found — run `npm run build` first.');
  process.exit(1);
});
const pages = all.filter((f) => f.endsWith('.html'));
const rel = (f) => relative(DIST, f);

if (!pages.length) {
  console.error('No HTML built.');
  process.exit(1);
}

/* ======================================================================
   STRUCTURAL CHECKS — always run
   ====================================================================== */

const titles = new Map();
const descriptions = new Map();
const internalLinks = [];

for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const name = rel(file);

  /* --- head essentials --- */
  const title = /<title>([\s\S]*?)<\/title>/i.exec(html)?.[1]?.trim();
  if (!title) err(name, 'missing <title>');
  else {
    if (title.length > 65) warn(name, `title is ${title.length} chars (aim <=60)`);
    if (titles.has(title)) err(name, `duplicate <title> — also on ${titles.get(title)}`);
    else titles.set(title, name);
  }

  const desc = /<meta name="description" content="([^"]*)"/i.exec(html)?.[1];
  if (!desc) err(name, 'missing meta description');
  else {
    if (desc.length < 50) warn(name, `meta description only ${desc.length} chars`);
    if (desc.length > 165) warn(name, `meta description ${desc.length} chars (aim <=160)`);
    if (descriptions.has(desc)) err(name, `duplicate meta description — also on ${descriptions.get(desc)}`);
    else descriptions.set(desc, name);
  }

  const canonical = /<link rel="canonical" href="([^"]*)"/i.exec(html)?.[1];
  if (!canonical) err(name, 'missing canonical');
  else if (!canonical.startsWith('http')) err(name, `canonical is not absolute: ${canonical}`);

  /* --- headings --- */
  const h1s = html.match(/<h1[\s>]/gi)?.length ?? 0;
  if (h1s === 0) err(name, 'no <h1>');
  if (h1s > 1) err(name, `${h1s} <h1> elements (expected exactly 1)`);

  /* --- images --- */
  const imgs = html.match(/<img\b[^>]*>/gi) ?? [];
  for (const tag of imgs) {
    if (!/\salt=/i.test(tag)) err(name, `<img> without alt: ${tag.slice(0, 90)}`);
    if (!/\swidth=/i.test(tag) || !/\sheight=/i.test(tag)) {
      warn(name, `<img> without explicit width/height (CLS risk): ${tag.slice(0, 70)}`);
    }
  }

  /* --- links --- */
  for (const m of html.matchAll(/href="([^"]*)"/gi)) {
    const href = m[1];
    if (href === '#' || href === '') err(name, 'placeholder link href="#"');
    if (href.startsWith('/') && !href.startsWith('//')) internalLinks.push({ from: name, href });
  }

  /* --- mixed content --- */
  for (const m of html.matchAll(/(?:src|href)="(http:\/\/[^"]*)"/gi)) {
    if (!m[1].startsWith('http://localhost')) err(name, `insecure http:// asset: ${m[1]}`);
  }

  /* --- JSON-LD validity --- */
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try { JSON.parse(m[1]); } catch (e) { err(name, `invalid JSON-LD: ${e.message}`); }
  }

  /* --- leftover developer markers --- */
  for (const marker of ['TODO', 'FIXME', 'XXX:', 'HACK:']) {
    if (html.includes(marker)) warn(name, `contains "${marker}"`);
  }

  /* --- accidental noindex --- */
  if (/<meta name="robots"[^>]*noindex/i.test(html) && name !== '404.html') {
    err(name, 'has noindex — this page will be dropped from the index');
  }
}

/* --- internal links resolve to a real file --- */
const existing = new Set(all.map((f) => '/' + rel(f).replace(/\\/g, '/')));
for (const { from, href } of internalLinks) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean || clean === '/') continue;
  const candidates = [
    clean,
    clean.endsWith('/') ? `${clean}index.html` : `${clean}/index.html`,
  ];
  if (!candidates.some((c) => existing.has(c))) {
    err(from, `internal link 404s: ${href}`);
  }
}

/* --- required root files --- */
for (const required of ['robots.txt', 'sitemap.xml', 'site.webmanifest', '404.html', 'favicon.ico']) {
  if (!existing.has(`/${required}`)) err('dist/', `missing ${required}`);
}

/* --- robots.txt sanity: the catastrophic staging leftover --- */
const robotsTxt = await readFile(join(DIST, 'robots.txt'), 'utf8').catch(() => '');
if (/^\s*Disallow:\s*\/\s*$/m.test(robotsTxt)) {
  err('robots.txt', 'contains "Disallow: /" — this blocks the ENTIRE site from search');
}
if (!/Sitemap:/i.test(robotsTxt)) warn('robots.txt', 'does not reference the sitemap');

/* ======================================================================
   LAUNCH GATE — blocking, only with --launch
   ====================================================================== */

if (LAUNCH) {
  if (cfg.__demo === true) {
    err('site.config.json', '__demo is still true — this is unreplaced demo data');
  }

  const PATTERNS = [
    { re: /lorem\s+ipsum|dolor\s+sit\s+amet/i, label: 'lorem ipsum placeholder text' },
    { re: /\.example\b/, label: '.example reserved TLD (demo domain not replaced)' },
    { re: /\b555-01\d\d\b|\b55501\d\d\b/, label: '555-01XX reserved fictional phone number' },
    { re: /\b(example|test|demo|sample)@/i, label: 'placeholder email address' },
    { re: /123\s+Main\s+(St|Street)/i, label: 'placeholder street address' },
    { re: /\b(staging|dev|preview)\.[a-z0-9-]+\.[a-z]{2,}/i, label: 'staging/dev hostname' },
    { re: /SK-PL-000000/, label: 'placeholder licence number' },
    { re: /\byour[- ](company|business|brand)\b/i, label: 'unreplaced boilerplate' },
  ];

  for (const file of pages) {
    const html = await readFile(file, 'utf8');
    for (const { re, label } of PATTERNS) {
      const hit = re.exec(html);
      if (hit) err(rel(file), `${label} — found "${hit[0]}"`);
    }
  }

  // Generated illustrations must be replaced with real client photography.
  //
  // This checks what the built pages actually REFERENCE, not what sits in the
  // folder. `npm run build` regenerates every illustration on each run, so a
  // file-presence check would keep failing forever even after real photos were
  // added — the SVG is still on disk, it is just no longer used. The asset
  // registry prefers raster over vector, so a slot is genuinely resolved once
  // no page still points at its .svg.
  const manifest = await readFile(join(DIST, 'assets', 'img', 'art.manifest.json'), 'utf8').catch(() => null);
  if (manifest) {
    const illustrationFiles = new Set(JSON.parse(manifest).replaceBeforeLaunch.map((i) => i.file));
    const referenced = new Set();

    for (const file of pages) {
      const html = await readFile(file, 'utf8');
      for (const m of html.matchAll(/<img\b[^>]*\ssrc="\/assets\/img\/([^"]+)"/gi)) {
        if (illustrationFiles.has(m[1])) referenced.add(m[1]);
      }
      // the LCP preload points at an image too
      const pre = /<link rel="preload" href="\/assets\/img\/([^"]+)" as="image"/i.exec(html);
      if (pre && illustrationFiles.has(pre[1])) referenced.add(pre[1]);
    }

    if (referenced.size) {
      const list = [...referenced].sort();
      err(
        'assets/img/',
        `${list.length} generated illustration(s) still in use — replace with real client photos ` +
        `(${list.slice(0, 3).join(', ')}${list.length > 3 ? '…' : ''}). ` +
        `Run \`npm run photos\`, or drop <slot>.jpg into src/assets/img — raster wins automatically.`
      );
    }
  }

  // The contact form must post somewhere real
  for (const file of pages) {
    const html = await readFile(file, 'utf8');
    const action = /<form[^>]*\saction="([^"]*)"/i.exec(html)?.[1];
    if (action !== undefined && (action === '#' || action === '' || action === '/thank-you/')) {
      err(rel(file), `form action is still the placeholder "${action}" — leads will go nowhere`);
    }
  }

  if (!cfg.analytics.ga4MeasurementId && !cfg.analytics.gtmContainerId) {
    warn('site.config.json', 'no GA4/GTM ID — phone-click and form conversions will not be tracked');
  }
  if (cfg.seo.siteUrl.includes('.example')) {
    err('site.config.json', 'seo.siteUrl still points at the demo domain');
  }
}

/* ============================================================== reporting */

const byFile = {};
for (const e of errors) (byFile[e.file] ??= { errors: [], warnings: [] }).errors.push(e.msg);
for (const w of warnings) (byFile[w.file] ??= { errors: [], warnings: [] }).warnings.push(w.msg);

for (const [file, { errors: es, warnings: ws }] of Object.entries(byFile)) {
  if (!es.length && !ws.length) continue;
  console.log(`\n${es.length ? '✗' : '!'} ${file}`);
  for (const e of es) console.log(`    ERROR  ${e}`);
  for (const w of ws) console.log(`    warn   ${w}`);
}

const mode = LAUNCH ? 'LAUNCH GATE' : 'structural';
console.log(`\n${mode}: ${pages.length} pages checked — ${errors.length} error(s), ${warnings.length} warning(s)`);

if (errors.length) {
  console.error(
    LAUNCH
      ? '\nLAUNCH BLOCKED. Fix every error above before DNS cutover.'
      : '\nBuild has errors.'
  );
  process.exit(1);
}
console.log(LAUNCH ? 'Launch gate PASSED.' : 'Structural checks passed.');

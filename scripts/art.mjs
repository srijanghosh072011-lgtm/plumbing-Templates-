#!/usr/bin/env node
/**
 * Generate the site's image assets as SVG.
 *
 * These are DESIGNED PLACEHOLDERS, not stock photography. The playbook forbids
 * shipping stock/placeholder imagery to production, so rather than pretend, this
 * generates abstract art-directed panels that read as intentional in a demo and
 * are registered in art.manifest.json — which `verify:launch` reads and fails on.
 * Replace each slot with real client job/team photos before any launch.
 *
 * Deterministic: a fixed seed means rebuilds produce byte-identical files.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(ROOT, 'src', 'assets', 'img');

/* mulberry32 — tiny deterministic PRNG so art is stable across builds */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const PALETTE = { deep: '#123a2e', deepAlt: '#1b4a3b', accent: '#c6ee3e', cream: '#f6f4ec', mid: '#2f6b55' };

/** Flowing pipe-run polyline with rounded elbows. */
function pipeRun(r, w, h, stroke, width, opacity) {
  const steps = 3 + Math.floor(r() * 3);
  let x = -w * 0.1;
  let y = h * (0.15 + r() * 0.7);
  let d = `M${x.toFixed(1)},${y.toFixed(1)}`;
  for (let i = 0; i < steps; i++) {
    const nx = x + w * (0.2 + r() * 0.28);
    const ny = h * (0.12 + r() * 0.76);
    d += ` L${nx.toFixed(1)},${y.toFixed(1)} L${nx.toFixed(1)},${ny.toFixed(1)}`;
    x = nx;
    y = ny;
  }
  d += ` L${(w * 1.1).toFixed(1)},${y.toFixed(1)}`;
  return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;
}

function panel({ w, h, seed, label }) {
  const r = rng(seed);
  const rotate = (r() * 24 - 12).toFixed(1);
  const cx = (w * (0.25 + r() * 0.5)).toFixed(0);
  const cy = (h * (0.2 + r() * 0.5)).toFixed(0);
  const rad = Math.min(w, h) * (0.3 + r() * 0.25);

  const arcs = Array.from({ length: 4 }, (_, i) => {
    const rr = rad * (0.45 + i * 0.22);
    return `<circle cx="${cx}" cy="${cy}" r="${rr.toFixed(1)}" fill="none" stroke="${PALETTE.accent}" stroke-width="${(1.2 + r() * 1.4).toFixed(1)}" opacity="${(0.1 + r() * 0.16).toFixed(2)}"/>`;
  }).join('');

  const pipes = Array.from({ length: 3 }, (_, i) =>
    pipeRun(r, w, h, i === 1 ? PALETTE.accent : PALETTE.cream, 2 + r() * 5, (0.06 + r() * 0.12).toFixed(2))
  ).join('');

  const dots = Array.from({ length: 26 }, () => {
    const dx = (r() * w).toFixed(0);
    const dy = (r() * h).toFixed(0);
    const dr = (0.8 + r() * 2).toFixed(1);
    return `<circle cx="${dx}" cy="${dy}" r="${dr}" fill="${PALETTE.accent}" opacity="${(0.08 + r() * 0.2).toFixed(2)}"/>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${PALETTE.deepAlt}"/>
      <stop offset="55%" stop-color="${PALETTE.deep}"/>
      <stop offset="100%" stop-color="${PALETTE.mid}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${(cx / w).toFixed(2)}" cy="${(cy / h).toFixed(2)}" r="0.75">
      <stop offset="0%" stop-color="${PALETTE.accent}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="${PALETTE.accent}" stop-opacity="0"/>
    </radialGradient>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3"/><feColorMatrix type="saturate" values="0"/></filter>
    <clipPath id="clip"><rect width="${w}" height="${h}"/></clipPath>
  </defs>
  <g clip-path="url(#clip)">
    <rect width="${w}" height="${h}" fill="url(#g)"/>
    <rect width="${w}" height="${h}" fill="url(#glow)"/>
    <g transform="rotate(${rotate} ${w / 2} ${h / 2})">${pipes}</g>
    ${arcs}
    ${dots}
    <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.05"/>
  </g>
</svg>`;
}

/* ------------------------------------------------------------------ branding */

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" role="img" aria-label="Northline Plumbing Co. logo">
  <circle cx="24" cy="24" r="24" fill="${PALETTE.accent}"/>
  <path d="M14 33V19a5 5 0 0 1 5-5h4.5a5 5 0 0 1 5 5v10a3 3 0 0 0 3 3H34" fill="none" stroke="${PALETTE.deep}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="14" cy="33" r="3.1" fill="${PALETTE.deep}"/>
</svg>`;

const ogSvg = (() => {
  const w = 1200;
  const h = 630;
  const art = panel({ w, h, seed: 999, label: 'Northline Plumbing Co.' })
    .replace(/<svg[^>]*>/, '')
    .replace('</svg>', '');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Northline Plumbing Co. — Trusted Plumbing Experts">
  ${art}
  <g transform="translate(80 210)">
    <rect x="0" y="0" rx="18" width="248" height="38" fill="${PALETTE.accent}" opacity="0.2"/>
    <text x="20" y="25" font-family="Georgia, serif" font-size="15" letter-spacing="3.4" fill="${PALETTE.accent}">TRUSTED PLUMBING EXPERTS</text>
    <text x="0" y="118" font-family="Georgia, serif" font-size="86" font-weight="bold" fill="${PALETTE.cream}">Northline</text>
    <text x="0" y="196" font-family="Georgia, serif" font-size="86" font-weight="bold" fill="${PALETTE.accent}">Plumbing Co.</text>
    <text x="0" y="252" font-family="Helvetica, Arial, sans-serif" font-size="25" fill="${PALETTE.cream}" opacity="0.82">Regina, SK  ·  24/7 Emergency  ·  Licensed &amp; Insured</text>
  </g>
</svg>`;
})();

/* --------------------------------------------------------------------- slots */

const SLOTS = [
  { file: 'hero-primary.svg',      w: 900,  h: 1100, seed: 11, label: 'Licensed plumber on a Regina service call' },
  { file: 'hero-inset.svg',        w: 520,  h: 520,  seed: 12, label: 'Close-up of a pipe fitting being tightened' },
  { file: 'hero-secondary.svg',    w: 620,  h: 460,  seed: 13, label: 'Technician preparing equipment at a work van' },
  { file: 'about-team.svg',        w: 900,  h: 700,  seed: 21, label: 'The Northline Plumbing team' },
  { file: 'about-detail.svg',      w: 560,  h: 700,  seed: 22, label: 'Workshop detail with plumbing tools' },
  { file: 'process-portrait.svg',  w: 640,  h: 640,  seed: 31, label: 'Plumber diagnosing a fixture on site' },
  { file: 'testimonial.svg',       w: 820,  h: 640,  seed: 41, label: 'Completed bathroom plumbing installation' },
  { file: 'cta-figure.svg',        w: 520,  h: 620,  seed: 51, label: 'Emergency plumber ready for dispatch' },
  ...Array.from({ length: 6 }, (_, i) => ({
    file: `service-${i + 1}.svg`, w: 720, h: 560, seed: 100 + i, label: `Plumbing service photograph ${i + 1}`,
  })),
  ...Array.from({ length: 6 }, (_, i) => ({
    file: `project-${i + 1}.svg`, w: 760, h: 600, seed: 200 + i, label: `Completed project photograph ${i + 1}`,
  })),
  ...Array.from({ length: 3 }, (_, i) => ({
    file: `post-${i + 1}.svg`, w: 760, h: 520, seed: 300 + i, label: `Blog article header image ${i + 1}`,
  })),
];

async function main() {
  await mkdir(IMG, { recursive: true });

  for (const slot of SLOTS) {
    await writeFile(join(IMG, slot.file), panel(slot));
  }
  await writeFile(join(IMG, 'logo.svg'), logoSvg);
  await writeFile(join(IMG, 'icon.svg'), logoSvg);
  await writeFile(join(IMG, 'og-default.svg'), ogSvg);

  // The manifest is what verify:launch reads. Every entry here is an unfulfilled
  // promise to the client until a real photograph replaces it.
  await writeFile(
    join(IMG, 'art.manifest.json'),
    JSON.stringify(
      {
        __note: 'Generated placeholder art. Every file listed here MUST be replaced with real client photography before launch. `npm run verify:launch` fails while this manifest lists any file that is still present in dist/.',
        generatedBy: 'scripts/art.mjs',
        replaceBeforeLaunch: SLOTS.map((s) => ({ file: s.file, intendedSubject: s.label, recommendedPixels: `${s.w * 2}x${s.h * 2}` })),
      },
      null,
      2
    )
  );

  console.log(`Generated ${SLOTS.length} placeholder panels + logo, icon and OG image -> src/assets/img/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

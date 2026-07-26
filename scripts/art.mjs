#!/usr/bin/env node
/**
 * Generate every illustration in the site.
 *
 * These are authored vector scenes, not photographs and not stock. Each one
 * depicts a real subject — a water heater cutaway, a P-trap under a basin, a
 * ruptured supply line, a drain camera in a pipe. They are:
 *
 *   - Owned outright. Safe to redistribute across every client repo, no
 *     attribution, no stock licence to track.
 *   - ~4 KB each rather than 200-400 KB, and sharp at any pixel density.
 *   - Theme-aware: the palette is pulled from the ACTIVE theme's own tokens,
 *     so illustrations always sit inside the site's colour world. Change
 *     `theme` in site.config.json and rebuild — the art follows.
 *
 * They are still a stand-in for real client photography of real jobs and real
 * crew, which outperforms any illustration for local trust, GBP and AI signals.
 * art.manifest.json records that, and `verify:launch` blocks on it.
 */
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { render, renderBody } from './lib/scenes.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const IMG = join(ROOT, 'src', 'assets', 'img');

const cfg = JSON.parse(await readFile(join(ROOT, 'site.config.json'), 'utf8'));

/* ------------------------------------------------------------- palette */

/** Pull the active theme's tokens straight from its CSS so nothing drifts. */
async function palette(themeName) {
  const css = await readFile(join(ROOT, 'src', 'themes', `${themeName}.css`), 'utf8');
  const t = {};
  for (const m of css.matchAll(/(--t-[a-z-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) t[m[1]] = m[2];

  const need = (k) => {
    if (!t[k]) throw new Error(`Theme "${themeName}" is missing ${k}`);
    return t[k];
  };

  const deep = need('--t-deep');
  const accent = need('--t-accent');
  const canvas = need('--t-canvas');

  const dark = lum(deep) < 0.18;
  const skin = '#c98a5e';

  // The vest must separate from the background it sits on, and the hard hat
  // must separate from the face beneath it. Both are enforced, not assumed.
  const vest = separate(mix(deep, '#ffffff', dark ? 0.3 : 0.16), deep, 1.9, dark ? '#ffffff' : '#000000');
  const hat = separate(accent, skin, 1.75, lum(accent) > lum(skin) ? '#ffffff' : '#000000');

  return {
    bg: deep,
    bloom: accent,
    accent,
    hat,
    paper: canvas,
    line: need('--t-on-deep-muted'),
    floor: need('--t-deep-soft'),
    shadow: '#000000',
    water: mix(accent, '#7fd4ff', 0.55),
    // Metals are derived from the theme's deep surface so they read as part of
    // the same world rather than a bolted-on grey.
    metal: mix(deep, '#ffffff', dark ? 0.5 : 0.42),
    metalLight: mix(deep, '#ffffff', dark ? 0.7 : 0.64),
    metalDark: mix(deep, '#000000', 0.28),
    vest,
    trouser: separate(mix(deep, '#000000', 0.12), vest, 1.5, dark ? '#000000' : '#000000'),
    // Three skin tones so a crew does not read as clones.
    skin,
    skinB: '#8d5a3b',
    skinC: '#e8b48c',
  };
}

/** Linear blend between two hex colours. */
function mix(a, b, t) {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [r1, g1, b1] = p(a);
  const [r2, g2, b2] = p(b);
  const c = (x, y) => Math.round(x + (y - x) * t).toString(16).padStart(2, '0');
  return `#${c(r1, r2)}${c(g1, g2)}${c(b1, b2)}`;
}

/* ------------------------------------------------------------- contrast */

/** WCAG relative luminance. */
function lum(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const f = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

/**
 * Push `color` away from `against` until it clears `min` contrast.
 *
 * Illustration palettes are derived from arbitrary theme tokens, so shapes can
 * collide: in midnight-copper the accent and the skin tone were near-identical
 * and the hard hat vanished into the face. Rather than hand-tuning each theme,
 * separation is enforced numerically — which also means any NEW theme a client
 * invents stays legible without anyone checking.
 */
function separate(color, against, min, toward) {
  let out = color;
  for (let i = 0; i < 12 && ratio(out, against) < min; i++) {
    out = mix(out, toward, 0.12);
  }
  return out;
}

/* --------------------------------------------------------------- slots */

/** Every image slot the site uses, mapped to the scene that belongs in it. */
const SLOTS = [
  { file: 'hero-primary.svg',     scene: 'workerWrench',   w: 900, h: 1100, seed: 11, label: 'A licensed plumber tightening a valve on an exposed supply line' },
  { file: 'hero-inset.svg',       scene: 'fittingCloseup', w: 560, h: 560,  seed: 12, label: 'Close-up of a pipe wrench tightening a threaded coupling' },
  { file: 'hero-secondary.svg',   scene: 'van',            w: 620, h: 460,  seed: 13, label: 'A liveried plumbing service van' },

  { file: 'about-team.svg',       scene: 'team',           w: 900, h: 700,  seed: 21, label: 'Three plumbing technicians in hard hats beside their service van' },
  { file: 'about-detail.svg',     scene: 'tools',          w: 560, h: 700,  seed: 22, label: 'Plumbing tools arranged on a workshop pegboard' },
  { file: 'process-portrait.svg', scene: 'drainCamera',    w: 640, h: 640,  seed: 31, label: 'A drain inspection camera looking down a pipe with root intrusion' },
  { file: 'testimonial.svg',      scene: 'bathroom',       w: 820, h: 640,  seed: 41, label: 'A completed bathroom with new basin, tap and shower fittings' },
  { file: 'cta-figure.svg',       scene: 'workerWrench',   w: 520, h: 620,  seed: 51, label: 'An emergency plumber ready for dispatch' },

  // One per service, in the order services appear in site.config.json
  { file: 'service-1.svg', scene: 'burstPipe',   w: 720, h: 560, seed: 101, label: 'A ruptured supply pipe spraying water — emergency plumbing' },
  { file: 'service-2.svg', scene: 'drainCamera', w: 720, h: 560, seed: 102, label: 'Camera inspection inside a blocked drain line' },
  { file: 'service-3.svg', scene: 'waterHeater', w: 720, h: 560, seed: 103, label: 'Cutaway of a domestic water heater tank' },
  { file: 'service-4.svg', scene: 'leakDetect',  w: 720, h: 560, seed: 104, label: 'Acoustic and thermal detection of a leak concealed behind a wall' },
  { file: 'service-5.svg', scene: 'faucet',      w: 720, h: 560, seed: 105, label: 'A newly installed mixer tap over a basin' },
  { file: 'service-6.svg', scene: 'sewerDig',    w: 720, h: 560, seed: 106, label: 'An excavated trench exposing a main sewer line' },

  { file: 'project-1.svg', scene: 'burstPipe',      w: 760, h: 600, seed: 201, label: 'Emergency repair of a burst riser' },
  { file: 'project-2.svg', scene: 'drainCamera',    w: 760, h: 600, seed: 202, label: 'Hydro-jetting and camera survey of a grease-choked main' },
  { file: 'project-3.svg', scene: 'waterHeater',    w: 760, h: 600, seed: 203, label: 'Tankless water heater conversion in a new build' },
  { file: 'project-4.svg', scene: 'sewerDig',       w: 760, h: 600, seed: 204, label: 'Replacement of root-intruded clay sewer tile' },
  { file: 'project-5.svg', scene: 'leakDetect',     w: 760, h: 600, seed: 205, label: 'Slab leak located beneath a finished floor' },
  { file: 'project-6.svg', scene: 'fittingCloseup', w: 760, h: 600, seed: 206, label: 'A frozen rural service line thawed and re-insulated' },

  { file: 'post-1.svg', scene: 'leakDetect', w: 760, h: 520, seed: 301, label: 'Illustration of a hidden leak behind a wall cavity' },
  { file: 'post-2.svg', scene: 'pTrap',      w: 760, h: 520, seed: 302, label: 'Under-sink pipework showing the P-trap and shutoff valve' },
  { file: 'post-3.svg', scene: 'waterHeater',w: 760, h: 520, seed: 303, label: 'Comparison illustration of a tank water heater' },
];

/* -------------------------------------------------------------- branding */

function logoSvg(P) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" role="img" aria-label="${cfg.brand.name} logo">
  <circle cx="24" cy="24" r="24" fill="${P.accent}"/>
  <path d="M14 33V19a5 5 0 0 1 5-5h4.5a5 5 0 0 1 5 5v10a3 3 0 0 0 3 3H34" fill="none" stroke="${P.bg}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="14" cy="33" r="3.1" fill="${P.bg}"/>
</svg>`;
}

function ogSvg(P) {
  const w = 1200;
  const h = 630;
  const scene = renderBody('workerWrench', { w, h, seed: 999, palette: P });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${cfg.brand.name} — ${cfg.brand.tagline}">
  ${scene.defs}
  ${scene.body}
  <rect width="${w}" height="${h}" fill="${P.bg}" opacity="0.45"/>
  <g transform="translate(78 214)">
    <rect x="0" y="0" rx="19" width="266" height="40" fill="${P.accent}" opacity="0.22"/>
    <text x="21" y="27" font-family="Georgia, serif" font-size="15" letter-spacing="3.4" fill="${P.accent}">${cfg.brand.tagline.toUpperCase()}</text>
    <text x="0" y="124" font-family="Georgia, serif" font-size="88" font-weight="bold" fill="${P.paper}">${cfg.brand.shortName}</text>
    <text x="0" y="206" font-family="Georgia, serif" font-size="88" font-weight="bold" fill="${P.accent}">Plumbing Co.</text>
    <text x="0" y="262" font-family="Helvetica, Arial, sans-serif" font-size="25" fill="${P.paper}" opacity="0.85">${cfg.contact.addressLocality}, ${cfg.contact.addressRegion}  ·  24/7 Emergency  ·  Licensed &amp; Insured</text>
  </g>
</svg>`;
}

/* ------------------------------------------------------------------ main */

async function main() {
  const themeName = cfg.theme;
  const P = await palette(themeName);

  // Overwrite in place rather than wiping the directory: the rasterised PNG
  // icons (apple-touch-icon, icon-192/512, favicon) live here too and are
  // produced by rasterize.mjs, which needs Playwright and is not part of the
  // normal build. Clearing the folder deleted them and broke every page.
  await mkdir(IMG, { recursive: true });

  let bytes = 0;
  for (const s of SLOTS) {
    const svg = render(s.scene, { w: s.w, h: s.h, seed: s.seed, palette: P, label: s.label });
    await writeFile(join(IMG, s.file), svg);
    bytes += svg.length;
  }

  await writeFile(join(IMG, 'logo.svg'), logoSvg(P));
  await writeFile(join(IMG, 'icon.svg'), logoSvg(P));
  await writeFile(join(IMG, 'og-default.svg'), ogSvg(P));

  await writeFile(
    join(IMG, 'art.manifest.json'),
    JSON.stringify(
      {
        __note:
          'Authored vector illustrations, generated by scripts/art.mjs for the ACTIVE theme. They are original work, owned outright and safe to redistribute. They are still a stand-in for REAL client photography of real jobs and real crew, which outperforms illustration for local trust, Google Business Profile and AI signals. `npm run verify:launch` blocks while these are still in place.',
        theme: themeName,
        generatedBy: 'scripts/art.mjs',
        replaceBeforeLaunch: SLOTS.map((s) => ({
          file: s.file,
          intendedSubject: s.label,
          recommendedPixels: `${s.w * 2}x${s.h * 2}`,
        })),
      },
      null,
      2
    )
  );

  console.log(
    `Generated ${SLOTS.length} illustrations for theme "${themeName}" ` +
    `(avg ${(bytes / SLOTS.length / 1024).toFixed(1)} KB) -> src/assets/img/`
  );
}

main().catch((e) => {
  console.error(e.stack);
  process.exit(1);
});

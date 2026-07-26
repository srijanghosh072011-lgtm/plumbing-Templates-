#!/usr/bin/env node
/**
 * WCAG contrast audit across every theme.
 *
 * Exists so re-theming for a client cannot quietly break accessibility. A brand
 * colour handed over by a client is exactly the kind of change that looks fine
 * to the person who picked it and fails 4.5:1 for everyone else — this makes
 * that a build failure instead of a discovery during an audit.
 *
 * Run: npm run contrast
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const THEMES = join(ROOT, 'src', 'themes');

/* ---------------------------------------------------------------- colour math */

function hexToRgb(hex) {
  const h = hex.replace('#', '').trim();
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
}

/** Relative luminance, WCAG 2.x definition. */
function luminance([r, g, b]) {
  const a = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

function ratio(fg, bg) {
  const l1 = luminance(hexToRgb(fg));
  const l2 = luminance(hexToRgb(bg));
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/* --------------------------------------------------------------------- pairs */

/** [foreground token, background token, minimum, description] */
const PAIRS = [
  ['--t-ink', '--t-canvas', 4.5, 'body text on page background'],
  ['--t-ink-muted', '--t-canvas', 4.5, 'muted text on page background'],
  ['--t-ink-faint', '--t-canvas', 4.5, 'faint metadata on page background'],
  ['--t-ink', '--t-canvas-sunk', 4.5, 'body text on sunken surface'],
  ['--t-ink-muted', '--t-canvas-sunk', 4.5, 'muted text on sunken surface'],
  ['--t-on-deep', '--t-deep', 4.5, 'text on deep surface'],
  ['--t-on-deep-muted', '--t-deep', 4.5, 'muted text on deep surface'],
  ['--t-on-deep', '--t-deep-soft', 4.5, 'text on soft deep surface'],
  ['--t-on-accent', '--t-accent', 4.5, 'text on accent (CTA buttons)'],
  ['--t-accent', '--t-deep', 3.0, 'accent as UI component on deep'],
  ['--t-danger', '--t-canvas', 4.5, 'error text on page background'],
];

/* --------------------------------------------------------------------- audit */

const files = (await readdir(THEMES)).filter((f) => f.endsWith('.css'));
let failures = 0;

for (const file of files) {
  const css = await readFile(join(THEMES, file), 'utf8');
  const tokens = {};
  for (const m of css.matchAll(/(--t-[a-z-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    tokens[m[1]] = m[2];
  }

  console.log(`\n${basename(file, '.css')}`);

  for (const [fgTok, bgTok, min, label] of PAIRS) {
    const fg = tokens[fgTok];
    const bg = tokens[bgTok];
    if (!fg || !bg) {
      console.log(`  ?     ${label} — token missing (${!fg ? fgTok : bgTok})`);
      continue;
    }
    const r = ratio(fg, bg);
    const ok = r >= min;
    if (!ok) failures++;
    console.log(
      `  ${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2)}:1  (min ${min.toFixed(1)})  ${label}`
    );
  }
}

console.log(
  failures === 0
    ? `\nAll contrast pairs pass across ${files.length} themes.`
    : `\n${failures} contrast pair(s) FAILED.`
);
process.exit(failures === 0 ? 0 : 1);

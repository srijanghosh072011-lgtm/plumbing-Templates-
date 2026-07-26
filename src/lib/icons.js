/**
 * Icon set — 24x24 viewBox, 1.25 stroke, round caps/joins.
 *
 * Hand-drawn rather than pulled from a library: high-end-visual-design bans
 * thick-stroked Lucide / FontAwesome / Material outright, and shipping an icon
 * font or full SVG sprite for ~20 glyphs would add a dependency and a network
 * request for bytes we can inline.
 *
 * ponytail: inlined per use. If a single page ever repeats one glyph more than
 * ~8 times, switch to a <symbol> sprite + <use> — not worth it below that.
 */

const wrap = (body, { size = 24, stroke = 1.25 } = {}) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;

const paths = {
  /* --- navigation + actions --- */
  arrowUpRight: '<path d="M7 17 17 7"/><path d="M8.5 7H17v8.5"/>',
  arrowRight: '<path d="M4 12h16"/><path d="m14 6 6 6-6 6"/>',
  arrowLeft: '<path d="M20 12H4"/><path d="m10 6-6 6 6 6"/>',
  chevronDown: '<path d="m5 9 7 7 7-7"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  check: '<path d="m4 12.5 5 5L20 6.5"/>',

  /* --- contact --- */
  phone:
    '<path d="M6.2 3.5h2.3l1.6 4-1.9 1.3a12.5 12.5 0 0 0 5.5 5.5l1.3-1.9 4 1.6v2.3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.2 5.7a2 2 0 0 1 2-2.2Z"/>',
  mail: '<rect x="2.75" y="5.25" width="18.5" height="13.5" rx="2.5"/><path d="m3.5 7 7.4 5.2a2 2 0 0 0 2.2 0L20.5 7"/>',
  mapPin:
    '<path d="M12 21.5s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z"/><circle cx="12" cy="10.5" r="2.6"/>',
  clock: '<circle cx="12" cy="12" r="8.75"/><path d="M12 7.25V12l3.2 1.9"/>',
  calendar:
    '<rect x="3.25" y="5.25" width="17.5" height="15.5" rx="2.5"/><path d="M3.25 10h17.5"/><path d="M8 3.25v4"/><path d="M16 3.25v4"/>',

  /* --- trust --- */
  shield:
    '<path d="M12 2.75 4.75 5.9v5.4c0 4.4 3 8.5 7.25 9.95 4.25-1.45 7.25-5.55 7.25-9.95V5.9Z"/><path d="m9 12 2.2 2.2L15.4 10"/>',
  star: '<path d="m12 3.6 2.6 5.5 5.9.8-4.3 4.2 1.05 6-5.25-2.85L6.75 20.1l1.05-6L3.5 9.9l5.9-.8Z"/>',
  quote:
    '<path d="M9.5 6.5c-2.8 1-4.5 3.4-4.5 6.4v4.6h5.4v-5.4H7.2c0-1.9.8-3.2 2.3-3.9Z"/><path d="M19.5 6.5c-2.8 1-4.5 3.4-4.5 6.4v4.6h5.4v-5.4h-3.2c0-1.9.8-3.2 2.3-3.9Z"/>',
  badge:
    '<circle cx="12" cy="9.5" r="6.25"/><path d="m8.4 15 -1.15 6.25L12 18.9l4.75 2.35L15.6 15"/><path d="m9.9 9.6 1.6 1.6 3-3.1"/>',

  /* --- trade-specific --- */
  siren:
    '<path d="M6 18.5v-5a6 6 0 0 1 12 0v5"/><rect x="3.75" y="18.5" width="16.5" height="3" rx="1.5"/><path d="M12 3.5V2"/><path d="m5.4 6-1-1.05"/><path d="m18.6 6 1-1.05"/>',
  drain:
    '<circle cx="12" cy="12" r="8.75"/><circle cx="12" cy="12" r="3.4"/><path d="M12 3.25v5.35"/><path d="M12 15.4v5.35"/><path d="M3.25 12h5.35"/><path d="M15.4 12h5.35"/>',
  flame:
    '<path d="M12 21.25c3.45 0 5.9-2.35 5.9-5.55 0-4.2-4.35-5.6-3.3-10.95-2.9.9-6.3 4.05-6.3 7.6 0 1.15.4 2.05 1.05 2.7.5-1.35 1.3-2.2 2.2-2.7-.75 3.05-3.35 3.15-3.35 5.5 0 1.9 1.6 3.4 3.8 3.4Z"/>',
  droplet:
    '<path d="M12 2.9c3.2 3.65 6.35 6.9 6.35 10.5A6.35 6.35 0 0 1 12 21.1a6.35 6.35 0 0 1-6.35-7.7C5.65 9.8 8.8 6.55 12 2.9Z"/><path d="M9.15 14.35a2.9 2.9 0 0 0 2.85 3.2"/>',
  faucet:
    '<path d="M3.5 13.75h6.75V11.5a2 2 0 0 1 2-2h3.4a3 3 0 0 1 3 3v1.25"/><rect x="2.75" y="13.75" width="8.25" height="3.25" rx="1.25"/><path d="M18.65 16.5v2.1a1.9 1.9 0 1 1-3.8 0v-2.1"/><path d="M12.25 9.5V6.75a2.5 2.5 0 0 1 5 0"/>',
  pipe:
    '<path d="M3 7.5h6.5a3 3 0 0 1 3 3v3a3 3 0 0 0 3 3H21"/><rect x="2" y="5.25" width="3.25" height="4.5" rx="1"/><rect x="18.75" y="14.25" width="3.25" height="4.5" rx="1"/>',
  wrench:
    '<path d="M15.4 3.6a5.25 5.25 0 0 0-6.6 6.6L3.7 15.3a2.1 2.1 0 0 0 3 3l5.1-5.1a5.25 5.25 0 0 0 6.6-6.6l-3 3-2.6-.7-.7-2.6Z"/>',
  gauge:
    '<path d="M4.4 17.5a9 9 0 1 1 15.2 0"/><path d="m12 12.75 3.9-3.9"/><circle cx="12" cy="13.75" r="1.4"/>',

  /* --- social --- */
  facebook:
    '<path d="M14.9 8.6h2.35V5.55h-2.6c-2.3 0-3.65 1.4-3.65 3.7v1.9H8.75v3.05H11v8.05h3.05V14.2h2.4l.45-3.05h-2.85V9.75c0-.8.35-1.15.85-1.15Z"/>',
  instagram:
    '<rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5"/><circle cx="12" cy="12" r="4.05"/><circle cx="17.05" cy="6.95" r="0.85" fill="currentColor" stroke="none"/>',
  linkedin:
    '<rect x="3.25" y="3.25" width="17.5" height="17.5" rx="3"/><path d="M7.35 10.4v6.35"/><circle cx="7.35" cy="7.5" r="1.15"/><path d="M11.4 16.75V10.4"/><path d="M11.4 12.9a2.5 2.5 0 0 1 5 0v3.85"/>',
  google:
    '<path d="M20.6 12.2c0-.6-.05-1.2-.15-1.75H12v3.4h4.85a4.15 4.15 0 0 1-1.8 2.7v2.25h2.9c1.7-1.55 2.65-3.85 2.65-6.6Z"/><path d="M12 21c2.43 0 4.47-.8 5.95-2.2l-2.9-2.25c-.8.55-1.85.87-3.05.87-2.35 0-4.34-1.58-5.05-3.71H3.95v2.33A9 9 0 0 0 12 21Z"/><path d="M6.95 13.71a5.4 5.4 0 0 1 0-3.42V7.96H3.95a9 9 0 0 0 0 8.08Z"/><path d="M12 6.58c1.32 0 2.5.46 3.44 1.35l2.57-2.57A8.99 8.99 0 0 0 3.95 7.96l3 2.33C7.66 8.16 9.65 6.58 12 6.58Z"/>',
};

/** Render an icon by name. Unknown names throw at build time, never ship blank. */
export function icon(name, opts) {
  const body = paths[name];
  if (!body) throw new Error(`icon("${name}") does not exist. Available: ${Object.keys(paths).join(', ')}`);
  return wrap(body, opts);
}

export const iconNames = Object.keys(paths);

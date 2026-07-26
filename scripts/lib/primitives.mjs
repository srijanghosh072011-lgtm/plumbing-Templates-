/**
 * Illustration primitives — the vocabulary every scene is drawn from.
 *
 * Why hand-authored SVG instead of photography:
 *   - License-clean. You own these outright and can redistribute them across
 *     every client repo with no attribution and no stock licence to track.
 *   - ~4 KB each instead of 200-400 KB, and sharp at any density.
 *   - They recolour with the active theme, because the palette is injected at
 *     build time from the theme's own tokens.
 *
 * Style: flat geometric forms with selective line detail — technical
 * illustration rather than attempted realism. Realism in vector reads as
 * clipart; precise geometry reads as competence, which is the right note for a
 * trades business.
 */

/* -------------------------------------------------------------------- utils */

export const deg = (d) => (d * Math.PI) / 180;

/** mulberry32 — deterministic PRNG so every rebuild is byte-identical. */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const n = (v) => Number(v.toFixed(2));

/* ------------------------------------------------------------------- pipes */

/**
 * A pipe run with body, top highlight and end collars.
 * Drawn as three stacked strokes so it reads as a cylinder without gradients.
 */
export function pipe(x1, y1, x2, y2, w, P, { collars = 'both' } = {}) {
  const d = `M${n(x1)},${n(y1)} L${n(x2)},${n(y2)}`;
  const ang = Math.atan2(y2 - y1, x2 - x1);
  const px = Math.sin(ang);
  const py = -Math.cos(ang);
  const off = w * 0.22;

  const collar = (x, y) => {
    const cw = w * 1.32;
    return `<line x1="${n(x - px * cw / 2)}" y1="${n(y - py * cw / 2)}" x2="${n(x + px * cw / 2)}" y2="${n(y + py * cw / 2)}" stroke="${P.metalDark}" stroke-width="${n(w * 0.3)}" stroke-linecap="round"/>`;
  };

  return `
    <g>
      <path d="${d}" stroke="${P.metal}" stroke-width="${n(w)}" stroke-linecap="round" fill="none"/>
      <path d="M${n(x1 + px * off)},${n(y1 + py * off)} L${n(x2 + px * off)},${n(y2 + py * off)}"
            stroke="${P.metalLight}" stroke-width="${n(w * 0.2)}" stroke-linecap="round" fill="none" opacity="0.85"/>
      <path d="M${n(x1 - px * off * 1.5)},${n(y1 - py * off * 1.5)} L${n(x2 - px * off * 1.5)},${n(y2 - py * off * 1.5)}"
            stroke="${P.metalDark}" stroke-width="${n(w * 0.16)}" stroke-linecap="round" fill="none" opacity="0.5"/>
      ${collars === 'both' || collars === 'start' ? collar(x1, y1) : ''}
      ${collars === 'both' || collars === 'end' ? collar(x2, y2) : ''}
    </g>`;
}

/** Rounded 90-degree elbow joining two pipe runs. */
export function elbow(cx, cy, r, w, startAngle, endAngle, P) {
  const x1 = cx + Math.cos(deg(startAngle)) * r;
  const y1 = cy + Math.sin(deg(startAngle)) * r;
  const x2 = cx + Math.cos(deg(endAngle)) * r;
  const y2 = cy + Math.sin(deg(endAngle)) * r;
  const large = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
  const sweep = endAngle > startAngle ? 1 : 0;
  return `
    <g fill="none" stroke-linecap="round">
      <path d="M${n(x1)},${n(y1)} A${n(r)},${n(r)} 0 ${large} ${sweep} ${n(x2)},${n(y2)}" stroke="${P.metal}" stroke-width="${n(w)}"/>
      <path d="M${n(x1)},${n(y1)} A${n(r)},${n(r)} 0 ${large} ${sweep} ${n(x2)},${n(y2)}" stroke="${P.metalLight}" stroke-width="${n(w * 0.18)}" opacity="0.7" transform="translate(0,${n(-w * 0.2)})"/>
    </g>`;
}

/** Gate valve with wheel handle. */
export function valve(cx, cy, s, P) {
  return `
    <g>
      <rect x="${n(cx - s * 0.42)}" y="${n(cy - s * 0.42)}" width="${n(s * 0.84)}" height="${n(s * 0.84)}" rx="${n(s * 0.14)}" fill="${P.metalDark}"/>
      <rect x="${n(cx - s * 0.3)}" y="${n(cy - s * 0.3)}" width="${n(s * 0.6)}" height="${n(s * 0.6)}" rx="${n(s * 0.1)}" fill="${P.metal}"/>
      <line x1="${n(cx)}" y1="${n(cy - s * 0.42)}" x2="${n(cx)}" y2="${n(cy - s * 0.95)}" stroke="${P.metalDark}" stroke-width="${n(s * 0.13)}" stroke-linecap="round"/>
      <circle cx="${n(cx)}" cy="${n(cy - s)}" r="${n(s * 0.34)}" fill="none" stroke="${P.accent}" stroke-width="${n(s * 0.15)}"/>
      <line x1="${n(cx - s * 0.34)}" y1="${n(cy - s)}" x2="${n(cx + s * 0.34)}" y2="${n(cy - s)}" stroke="${P.accent}" stroke-width="${n(s * 0.1)}"/>
    </g>`;
}

/** Threaded coupling / union nut. */
export function coupling(cx, cy, w, h, P) {
  return `
    <g>
      <rect x="${n(cx - w / 2)}" y="${n(cy - h / 2)}" width="${n(w)}" height="${n(h)}" rx="${n(Math.min(w, h) * 0.18)}" fill="${P.metalDark}"/>
      ${[0.28, 0.5, 0.72].map((t) =>
        `<line x1="${n(cx - w / 2 + w * t)}" y1="${n(cy - h / 2 + h * 0.16)}" x2="${n(cx - w / 2 + w * t)}" y2="${n(cy + h / 2 - h * 0.16)}" stroke="${P.metalLight}" stroke-width="${n(w * 0.05)}" opacity="0.55" stroke-linecap="round"/>`
      ).join('')}
    </g>`;
}

/* ------------------------------------------------------------------ water */

/** Water droplet — classic teardrop, point up. */
export function droplet(cx, cy, r, fill, opacity = 1) {
  return `<path d="M${n(cx)},${n(cy - r * 1.5)} C${n(cx + r * 0.95)},${n(cy - r * 0.2)} ${n(cx + r)},${n(cy + r * 0.75)} ${n(cx)},${n(cy + r)} C${n(cx - r)},${n(cy + r * 0.75)} ${n(cx - r * 0.95)},${n(cy - r * 0.2)} ${n(cx)},${n(cy - r * 1.5)} Z" fill="${fill}" opacity="${opacity}"/>`;
}

/** Arcing spray — for burst-pipe and running-tap scenes. */
export function spray(x, y, dir, len, count, P, r) {
  return Array.from({ length: count }, (_, i) => {
    const spread = (i / (count - 1) - 0.5) * 1.1;
    const ex = x + dir * len * (0.6 + r() * 0.5);
    const ey = y + len * (0.35 + spread * 0.9) + r() * len * 0.2;
    const cx1 = x + dir * len * 0.4;
    const cy1 = y - len * (0.28 - spread * 0.3);
    return `<path d="M${n(x)},${n(y)} Q${n(cx1)},${n(cy1)} ${n(ex)},${n(ey)}" fill="none" stroke="${P.water}" stroke-width="${n(len * (0.035 + r() * 0.03))}" stroke-linecap="round" opacity="${(0.35 + r() * 0.45).toFixed(2)}"/>`;
  }).join('');
}

/** Straight falling stream, e.g. from a tap. */
export function stream(x, y, h, w, P) {
  return `<path d="M${n(x - w / 2)},${n(y)} L${n(x - w * 0.34)},${n(y + h)} L${n(x + w * 0.34)},${n(y + h)} L${n(x + w / 2)},${n(y)} Z" fill="${P.water}" opacity="0.55"/>`;
}

/* ---------------------------------------------------------------- figures */

/**
 * Worker figure — bold flat silhouette with hard hat and hi-vis vest.
 * Deliberately stylised. An attempt at a realistic person in flat vector lands
 * in the uncanny valley; a confident geometric figure does not.
 *
 * @param {'wrench'|'clipboard'|'toolbox'|'idle'|'point'} pose
 */
export function worker(x, y, s, P, { pose = 'wrench', flip = false, skin = null } = {}) {
  const S = (v) => n(v * s);
  const skinTone = skin ?? P.skin;
  const g = flip ? `translate(${n(x * 2)},0) scale(-1,1)` : '';

  const arms = {
    wrench: `
      <path d="M${S(-0.42)},${S(0.12)} L${S(-0.66)},${S(0.56)}" stroke="${P.vest}" stroke-width="${S(0.26)}" stroke-linecap="round" fill="none"/>
      <path d="M${S(0.42)},${S(0.1)} L${S(0.78)},${S(0.46)}" stroke="${P.vest}" stroke-width="${S(0.26)}" stroke-linecap="round" fill="none"/>
      <circle cx="${S(0.8)}" cy="${S(0.5)}" r="${S(0.13)}" fill="${skinTone}"/>
      <g transform="translate(${S(0.86)},${S(0.56)}) rotate(38)">
        <rect x="${S(-0.06)}" y="${S(-0.05)}" width="${S(0.56)}" height="${S(0.13)}" rx="${S(0.05)}" fill="${P.accent}"/>
        <path d="M${S(0.44)},${S(-0.16)} L${S(0.62)},${S(-0.16)} L${S(0.62)},${S(0.0)} L${S(0.52)},${S(0.0)} L${S(0.52)},${S(0.19)} L${S(0.44)},${S(0.19)} Z" fill="${P.accent}"/>
      </g>`,
    clipboard: `
      <path d="M${S(-0.42)},${S(0.12)} L${S(-0.6)},${S(0.6)}" stroke="${P.vest}" stroke-width="${S(0.26)}" stroke-linecap="round" fill="none"/>
      <path d="M${S(0.4)},${S(0.14)} L${S(0.5)},${S(0.6)}" stroke="${P.vest}" stroke-width="${S(0.26)}" stroke-linecap="round" fill="none"/>
      <g transform="translate(${S(0.3)},${S(0.52)}) rotate(-12)">
        <rect x="0" y="0" width="${S(0.48)}" height="${S(0.62)}" rx="${S(0.05)}" fill="${P.paper}"/>
        <rect x="${S(0.15)}" y="${S(-0.05)}" width="${S(0.18)}" height="${S(0.1)}" rx="${S(0.04)}" fill="${P.metalDark}"/>
        ${[0.16, 0.3, 0.44].map((t) => `<line x1="${S(0.09)}" y1="${S(t)}" x2="${S(0.39)}" y2="${S(t)}" stroke="${P.metalDark}" stroke-width="${S(0.035)}" opacity="0.5" stroke-linecap="round"/>`).join('')}
      </g>`,
    toolbox: `
      <path d="M${S(-0.42)},${S(0.12)} L${S(-0.56)},${S(0.62)}" stroke="${P.vest}" stroke-width="${S(0.26)}" stroke-linecap="round" fill="none"/>
      <path d="M${S(0.42)},${S(0.12)} L${S(0.56)},${S(0.62)}" stroke="${P.vest}" stroke-width="${S(0.26)}" stroke-linecap="round" fill="none"/>
      <g transform="translate(${S(0.32)},${S(0.72)})">
        <rect x="0" y="${S(0.06)}" width="${S(0.66)}" height="${S(0.4)}" rx="${S(0.06)}" fill="${P.accent}"/>
        <path d="M${S(0.18)},${S(0.06)} Q${S(0.33)},${S(-0.14)} ${S(0.48)},${S(0.06)}" fill="none" stroke="${P.metalDark}" stroke-width="${S(0.055)}"/>
        <line x1="0" y1="${S(0.2)}" x2="${S(0.66)}" y2="${S(0.2)}" stroke="${P.metalDark}" stroke-width="${S(0.04)}" opacity="0.4"/>
      </g>`,
    point: `
      <path d="M${S(-0.42)},${S(0.12)} L${S(-0.6)},${S(0.6)}" stroke="${P.vest}" stroke-width="${S(0.26)}" stroke-linecap="round" fill="none"/>
      <path d="M${S(0.4)},${S(0.08)} L${S(0.86)},${S(-0.2)}" stroke="${P.vest}" stroke-width="${S(0.26)}" stroke-linecap="round" fill="none"/>
      <circle cx="${S(0.9)}" cy="${S(-0.22)}" r="${S(0.13)}" fill="${skinTone}"/>`,
    idle: `
      <path d="M${S(-0.42)},${S(0.12)} L${S(-0.58)},${S(0.62)}" stroke="${P.vest}" stroke-width="${S(0.26)}" stroke-linecap="round" fill="none"/>
      <path d="M${S(0.42)},${S(0.12)} L${S(0.58)},${S(0.62)}" stroke="${P.vest}" stroke-width="${S(0.26)}" stroke-linecap="round" fill="none"/>`,
  }[pose];

  return `
  <g transform="translate(${n(x)},${n(y)})">
    <g transform="${g}">
      <!-- legs -->
      <path d="M${S(-0.2)},${S(0.72)} L${S(-0.26)},${S(1.55)}" stroke="${P.trouser}" stroke-width="${S(0.3)}" stroke-linecap="round" fill="none"/>
      <path d="M${S(0.2)},${S(0.72)} L${S(0.3)},${S(1.55)}" stroke="${P.trouser}" stroke-width="${S(0.3)}" stroke-linecap="round" fill="none"/>
      <!-- boots -->
      <path d="M${S(-0.41)},${S(1.62)} L${S(-0.11)},${S(1.62)} L${S(-0.11)},${S(1.5)} L${S(-0.41)},${S(1.5)} Z" fill="${P.metalDark}" />
      <path d="M${S(0.15)},${S(1.62)} L${S(0.47)},${S(1.62)} L${S(0.45)},${S(1.5)} L${S(0.15)},${S(1.5)} Z" fill="${P.metalDark}" />
      <!-- torso / hi-vis vest -->
      <path d="M${S(-0.4)},${S(-0.16)} Q${S(-0.44)},${S(0.62)} ${S(-0.3)},${S(0.8)} L${S(0.3)},${S(0.8)} Q${S(0.44)},${S(0.62)} ${S(0.4)},${S(-0.16)} Z" fill="${P.vest}"/>
      <path d="M${S(-0.16)},${S(-0.16)} L${S(-0.16)},${S(0.8)} M${S(0.16)},${S(-0.16)} L${S(0.16)},${S(0.8)}" stroke="${P.accent}" stroke-width="${S(0.09)}" opacity="0.95"/>
      <path d="M${S(-0.4)},${S(0.34)} L${S(0.4)},${S(0.34)}" stroke="${P.accent}" stroke-width="${S(0.09)}" opacity="0.95"/>
      ${arms}
      <!-- head -->
      <circle cx="0" cy="${S(-0.42)}" r="${S(0.27)}" fill="${skinTone}"/>
      <!-- hard hat. P.hat is contrast-checked against skin at build time, so
           the helmet never merges into the face on an unusual theme. -->
      <path d="M${S(-0.36)},${S(-0.52)} Q${S(-0.34)},${S(-0.92)} 0,${S(-0.92)} Q${S(0.34)},${S(-0.92)} ${S(0.36)},${S(-0.52)} Z" fill="${P.hat}"/>
      <rect x="${S(-0.46)}" y="${S(-0.56)}" width="${S(0.92)}" height="${S(0.1)}" rx="${S(0.05)}" fill="${P.hat}"/>
      <path d="M${S(0.36)},${S(-0.56)} L${S(0.56)},${S(-0.56)} L${S(0.54)},${S(-0.46)} L${S(0.36)},${S(-0.46)} Z" fill="${P.hat}"/>
      <path d="M${S(-0.36)},${S(-0.56)} L${S(0.36)},${S(-0.56)}" stroke="${P.metalDark}" stroke-width="${S(0.02)}" opacity="0.3"/>
    </g>
  </g>`;
}

/* ------------------------------------------------------------- backgrounds */

/**
 * Deep panel with a soft bloom behind the subject.
 *
 * The bloom is a true radial gradient at low opacity, plus a vignette. An
 * opaque ellipse (the first attempt) washed the whole frame to a flat pale
 * tint and left a visible oval edge — subjects need to sit against value
 * contrast, not float in a wash.
 */
export function backdrop(w, h, P, r, { bloomX = 0.5, bloomY = 0.42 } = {}) {
  return `
    <rect width="${w}" height="${h}" fill="${P.bg}"/>
    <radialGradient id="bloom-${P.uid}" cx="${bloomX}" cy="${bloomY}" r="0.72">
      <stop offset="0%" stop-color="${P.bloom}" stop-opacity="0.22"/>
      <stop offset="55%" stop-color="${P.bloom}" stop-opacity="0.07"/>
      <stop offset="100%" stop-color="${P.bloom}" stop-opacity="0"/>
    </radialGradient>
    <rect width="${w}" height="${h}" fill="url(#bloom-${P.uid})"/>
    <radialGradient id="vig-${P.uid}" cx="0.5" cy="0.48" r="0.78">
      <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.34"/>
    </radialGradient>
    <rect width="${w}" height="${h}" fill="url(#vig-${P.uid})"/>`;
}

/** Faint technical grid — reads as a blueprint underlay. */
export function grid(w, h, P, step = 46) {
  const lines = [];
  for (let x = step; x < w; x += step) lines.push(`M${x},0 L${x},${h}`);
  for (let y = step; y < h; y += step) lines.push(`M0,${y} L${w},${y}`);
  return `<path d="${lines.join(' ')}" stroke="${P.line}" stroke-width="1" opacity="0.28" fill="none"/>`;
}

/** Ground plane the subject stands on. */
export function floor(w, h, P, atY) {
  return `
    <rect x="0" y="${n(atY)}" width="${w}" height="${n(h - atY)}" fill="${P.floor}" opacity="0.55"/>
    <line x1="0" y1="${n(atY)}" x2="${w}" y2="${n(atY)}" stroke="${P.accent}" stroke-width="2" opacity="0.35"/>`;
}

/** Contact shadow so figures and objects do not float. */
export function shadow(cx, cy, rx, P) {
  return `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(rx * 0.16)}" fill="${P.shadow}" opacity="0.4"/>`;
}

/** Film grain. Applied last, always inert. */
export function grain(w, h, uid = 'x') {
  return `<rect width="${w}" height="${h}" filter="url(#gr-${uid})" opacity="0.055"/>`;
}

/** IDs are namespaced per file so these stay safe if ever inlined side by side. */
export const defs = (uid = 'x') => `
  <defs>
    <filter id="gr-${uid}"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3"/><feColorMatrix type="saturate" values="0"/></filter>
    <clipPath id="frame-${uid}"><rect width="100%" height="100%"/></clipPath>
  </defs>`;

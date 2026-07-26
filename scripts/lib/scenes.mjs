/**
 * Scene library. Each function draws a genuine, recognisable subject.
 *
 * Every scene receives ({ w, h, P, r }) — width, height, theme palette,
 * seeded RNG — and returns SVG body markup. The palette comes from the active
 * theme's own tokens, so illustrations always sit in the site's colour world.
 */
import {
  pipe, elbow, valve, coupling, droplet, spray, stream,
  worker, backdrop, grid, floor, shadow, grain, defs, rng,
} from './primitives.mjs';

const n = (v) => Number(v.toFixed(2));

/* ------------------------------------------------- 1. plumber with wrench */

export function sceneWorkerWrench({ w, h, P, r }) {
  const gy = h * 0.84;
  const s = h * 0.3;
  return `
    ${backdrop(w, h, P, r, { bloomX: 0.56, bloomY: 0.38 })}
    ${grid(w, h, P, 52)}
    ${floor(w, h, P, gy)}
    <!-- pipe run behind the figure -->
    ${pipe(w * -0.05, h * 0.24, w * 0.44, h * 0.24, h * 0.045, P, { collars: 'end' })}
    ${elbow(w * 0.44, h * 0.3, h * 0.06, h * 0.045, -90, 0, P)}
    ${pipe(w * 0.5, h * 0.3, w * 0.5, h * 0.52, h * 0.045, P, { collars: 'none' })}
    ${valve(w * 0.5, h * 0.6, h * 0.055, P)}
    ${pipe(w * 0.5, h * 0.68, w * 1.05, h * 0.68, h * 0.045, P, { collars: 'start' })}
    ${shadow(w * 0.42, gy + 2, s * 0.9, P)}
    ${worker(w * 0.42, gy - s * 1.62, s, P, { pose: 'wrench' })}
    ${grain(w, h, P.uid)}`;
}

/* ------------------------------------------ 2. close-up: wrench on fitting */

export function sceneFittingCloseup({ w, h, P, r }) {
  const cy = h * 0.54;
  const pw = h * 0.15;
  return `
    ${backdrop(w, h, P, r, { bloomY: 0.5 })}
    ${grid(w, h, P, 40)}
    ${pipe(-w * 0.1, cy, w * 1.1, cy, pw, P, { collars: 'none' })}
    ${coupling(w * 0.5, cy, pw * 1.1, pw * 1.42, P)}
    <!-- pipe wrench biting the coupling -->
    <g transform="translate(${n(w * 0.5)},${n(cy)}) rotate(-24)">
      <rect x="${n(-pw * 0.24)}" y="${n(pw * 0.5)}" width="${n(pw * 0.48)}" height="${n(h * 0.5)}" rx="${n(pw * 0.2)}" fill="${P.accent}"/>
      <path d="M${n(-pw * 0.92)},${n(-pw * 0.2)} L${n(pw * 0.92)},${n(-pw * 0.2)} L${n(pw * 0.72)},${n(pw * 0.56)} L${n(-pw * 0.72)},${n(pw * 0.56)} Z" fill="${P.accent}"/>
      <path d="M${n(-pw * 0.78)},${n(-pw * 0.24)} L${n(-pw * 0.78)},${n(-pw * 0.95)} L${n(-pw * 0.3)},${n(-pw * 0.95)} L${n(-pw * 0.3)},${n(-pw * 0.24)} Z" fill="${P.accent}"/>
      <rect x="${n(-pw * 0.62)}" y="${n(-pw * 0.06)}" width="${n(pw * 1.24)}" height="${n(pw * 0.18)}" fill="${P.metalDark}" opacity="0.35"/>
    </g>
    ${droplet(w * 0.68, cy + h * 0.26, h * 0.035, P.water, 0.75)}
    ${droplet(w * 0.76, cy + h * 0.34, h * 0.022, P.water, 0.5)}
    ${grain(w, h, P.uid)}`;
}

/* --------------------------------------------- 3. water heater (cutaway) */

export function sceneWaterHeater({ w, h, P, r }) {
  const cx = w * 0.5;
  const tw = w * 0.34;
  const top = h * 0.2;
  const bot = h * 0.8;
  return `
    ${backdrop(w, h, P, r)}
    ${grid(w, h, P, 46)}
    ${floor(w, h, P, h * 0.86)}
    <!-- inlet / outlet -->
    ${pipe(cx - tw * 0.28, top - h * 0.12, cx - tw * 0.28, top + h * 0.02, h * 0.035, P, { collars: 'start' })}
    ${pipe(cx + tw * 0.28, top - h * 0.12, cx + tw * 0.28, top + h * 0.02, h * 0.035, P, { collars: 'start' })}
    <!-- tank -->
    <rect x="${n(cx - tw / 2)}" y="${n(top)}" width="${n(tw)}" height="${n(bot - top)}" rx="${n(tw * 0.14)}" fill="${P.metal}"/>
    <rect x="${n(cx - tw / 2)}" y="${n(top)}" width="${n(tw * 0.3)}" height="${n(bot - top)}" rx="${n(tw * 0.14)}" fill="${P.metalLight}" opacity="0.35"/>
    <rect x="${n(cx - tw / 2)}" y="${n(top)}" width="${n(tw)}" height="${n(bot - top)}" rx="${n(tw * 0.14)}" fill="none" stroke="${P.metalDark}" stroke-width="3"/>
    <!-- cutaway showing element + sediment -->
    <path d="M${n(cx + tw * 0.06)},${n(top + h * 0.08)} L${n(cx + tw * 0.46)},${n(top + h * 0.08)} L${n(cx + tw * 0.46)},${n(bot - h * 0.06)} L${n(cx + tw * 0.06)},${n(bot - h * 0.06)} Z" fill="${P.bg}" opacity="0.55"/>
    <rect x="${n(cx + tw * 0.08)}" y="${n(bot - h * 0.13)}" width="${n(tw * 0.36)}" height="${n(h * 0.06)}" fill="${P.accent}" opacity="0.3"/>
    ${pipe(cx + tw * 0.12, top + h * 0.22, cx + tw * 0.42, top + h * 0.22, h * 0.022, P, { collars: 'none' })}
    <!-- control dial -->
    <circle cx="${n(cx - tw * 0.16)}" cy="${n(bot - h * 0.16)}" r="${n(tw * 0.13)}" fill="${P.accent}"/>
    <line x1="${n(cx - tw * 0.16)}" y1="${n(bot - h * 0.16)}" x2="${n(cx - tw * 0.16)}" y2="${n(bot - h * 0.2)}" stroke="${P.metalDark}" stroke-width="3" stroke-linecap="round"/>
    <!-- badge plate -->
    <rect x="${n(cx - tw * 0.34)}" y="${n(top + h * 0.09)}" width="${n(tw * 0.34)}" height="${n(h * 0.09)}" rx="4" fill="${P.metalDark}" opacity="0.7"/>
    <!-- legs -->
    <rect x="${n(cx - tw * 0.4)}" y="${n(bot)}" width="${n(tw * 0.1)}" height="${n(h * 0.06)}" fill="${P.metalDark}"/>
    <rect x="${n(cx + tw * 0.3)}" y="${n(bot)}" width="${n(tw * 0.1)}" height="${n(h * 0.06)}" fill="${P.metalDark}"/>
    ${shadow(cx, h * 0.87, tw * 0.7, P)}
    ${grain(w, h, P.uid)}`;
}

/* ------------------------------------------------ 4. under-sink / P-trap */

export function scenePTrap({ w, h, P, r }) {
  const cx = w * 0.5;
  const pw = h * 0.055;
  const basinY = h * 0.24;
  return `
    ${backdrop(w, h, P, r, { bloomY: 0.55 })}
    ${grid(w, h, P, 44)}
    <!-- basin underside -->
    <path d="M${n(cx - w * 0.3)},${n(basinY)} Q${n(cx)},${n(basinY + h * 0.16)} ${n(cx + w * 0.3)},${n(basinY)} Z" fill="${P.metal}"/>
    <rect x="${n(cx - w * 0.34)}" y="${n(basinY - h * 0.05)}" width="${n(w * 0.68)}" height="${n(h * 0.05)}" rx="4" fill="${P.metalDark}"/>
    <!-- tailpiece down, U-bend, trap arm to wall -->
    ${pipe(cx, basinY + h * 0.12, cx, h * 0.52, pw, P, { collars: 'start' })}
    ${elbow(cx + pw * 1.5, h * 0.52, pw * 1.5, pw, 180, 90, P)}
    ${elbow(cx + pw * 1.5, h * 0.52, pw * 1.5, pw, 90, 0, P)}
    ${pipe(cx + pw * 3, h * 0.52, cx + pw * 3, h * 0.38, pw, P, { collars: 'none' })}
    ${elbow(cx + pw * 4.5, h * 0.38, pw * 1.5, pw, 180, 270, P)}
    ${pipe(cx + pw * 4.5, h * 0.365, w * 1.05, h * 0.365, pw, P, { collars: 'start' })}
    ${coupling(cx, h * 0.4, pw * 1.3, pw * 1.5, P)}
    <!-- shutoff valves on the supply lines -->
    ${pipe(cx - w * 0.24, h * 0.46, cx - w * 0.24, h * 0.86, pw * 0.62, P, { collars: 'none' })}
    ${valve(cx - w * 0.24, h * 0.6, pw * 0.9, P)}
    ${droplet(cx + pw * 1.5, h * 0.63, pw * 0.5, P.water, 0.8)}
    ${grain(w, h, P.uid)}`;
}

/* ------------------------------------------------------- 5. burst pipe */

export function sceneBurstPipe({ w, h, P, r }) {
  const cy = h * 0.44;
  const pw = h * 0.09;
  const bx = w * 0.52;
  return `
    ${backdrop(w, h, P, r, { bloomX: 0.52, bloomY: 0.42 })}
    ${grid(w, h, P, 48)}
    ${pipe(-w * 0.08, cy, bx - pw * 0.5, cy, pw, P, { collars: 'end' })}
    ${pipe(bx + pw * 0.5, cy, w * 1.08, cy, pw, P, { collars: 'start' })}
    <!-- rupture -->
    <path d="M${n(bx - pw * 0.6)},${n(cy - pw * 0.5)} L${n(bx - pw * 0.1)},${n(cy - pw * 0.9)} L${n(bx + pw * 0.25)},${n(cy - pw * 0.4)} L${n(bx + pw * 0.6)},${n(cy - pw * 0.8)} L${n(bx + pw * 0.6)},${n(cy + pw * 0.5)} L${n(bx - pw * 0.6)},${n(cy + pw * 0.5)} Z" fill="${P.metalDark}"/>
    ${spray(bx, cy - pw * 0.5, 1, h * 0.42, 7, P, r)}
    ${spray(bx, cy - pw * 0.5, -1, h * 0.32, 5, P, r)}
    ${Array.from({ length: 9 }, () =>
      droplet(bx + (r() - 0.5) * w * 0.8, cy + h * (0.12 + r() * 0.4), h * (0.012 + r() * 0.018), P.water, 0.3 + r() * 0.5)
    ).join('')}
    <!-- pooling water -->
    <ellipse cx="${n(bx)}" cy="${n(h * 0.93)}" rx="${n(w * 0.42)}" ry="${n(h * 0.05)}" fill="${P.water}" opacity="0.3"/>
    ${grain(w, h, P.uid)}`;
}

/* --------------------------------------------- 6. drain camera inspection */

export function sceneDrainCamera({ w, h, P, r }) {
  const cx = w * 0.5;
  const cy = h * 0.5;
  const outer = Math.min(w, h) * 0.42;
  return `
    ${backdrop(w, h, P, r)}
    ${grid(w, h, P, 44)}
    <!-- looking down a pipe: concentric rings receding -->
    ${[1, 0.82, 0.66, 0.52, 0.4, 0.3].map((t, i) => `
      <circle cx="${n(cx)}" cy="${n(cy)}" r="${n(outer * t)}" fill="none" stroke="${i % 2 ? P.metalDark : P.metal}" stroke-width="${n(outer * 0.09)}" opacity="${(0.35 + i * 0.11).toFixed(2)}"/>`).join('')}
    <circle cx="${n(cx)}" cy="${n(cy)}" r="${n(outer * 0.22)}" fill="${P.bg}"/>
    <!-- camera light cone -->
    <path d="M${n(cx)},${n(cy)} L${n(cx - outer * 0.62)},${n(cy - outer * 0.5)} L${n(cx - outer * 0.62)},${n(cy + outer * 0.5)} Z" fill="${P.accent}" opacity="0.18"/>
    <!-- camera head on its rod -->
    <g transform="translate(${n(cx - outer * 0.66)},${n(cy)})">
      <rect x="${n(-outer * 0.3)}" y="${n(-outer * 0.14)}" width="${n(outer * 0.34)}" height="${n(outer * 0.28)}" rx="${n(outer * 0.09)}" fill="${P.metalDark}"/>
      <circle cx="0" cy="0" r="${n(outer * 0.1)}" fill="${P.accent}"/>
      <circle cx="0" cy="0" r="${n(outer * 0.045)}" fill="${P.bg}"/>
      <path d="M${n(-outer * 0.3)},0 Q${n(-outer * 0.7)},${n(-outer * 0.2)} ${n(-outer * 1.15)},${n(outer * 0.06)}" fill="none" stroke="${P.accent}" stroke-width="${n(outer * 0.07)}" stroke-linecap="round" opacity="0.9"/>
    </g>
    <!-- root intrusion at the joint -->
    ${Array.from({ length: 5 }, (_, i) => {
      const a = (-40 + i * 26) * Math.PI / 180;
      const rr = outer * (0.5 + r() * 0.32);
      return `<path d="M${n(cx + Math.cos(a) * outer * 0.86)},${n(cy + Math.sin(a) * outer * 0.86)} Q${n(cx + Math.cos(a) * rr * 0.9)},${n(cy + Math.sin(a) * rr * 1.1)} ${n(cx + Math.cos(a + 0.4) * rr * 0.55)},${n(cy + Math.sin(a + 0.5) * rr * 0.5)}" fill="none" stroke="${P.accent}" stroke-width="${n(outer * 0.035)}" stroke-linecap="round" opacity="0.55"/>`;
    }).join('')}
    ${grain(w, h, P.uid)}`;
}

/* ------------------------------------------------------ 7. tap and basin */

export function sceneFaucet({ w, h, P, r }) {
  const cx = w * 0.48;
  const basinY = h * 0.66;
  const bw = w * 0.5;
  return `
    ${backdrop(w, h, P, r, { bloomY: 0.4 })}
    ${grid(w, h, P, 44)}
    <!-- counter -->
    <rect x="0" y="${n(basinY)}" width="${w}" height="${n(h * 0.04)}" fill="${P.metalDark}"/>
    <!-- basin -->
    <path d="M${n(cx - bw / 2)},${n(basinY)} L${n(cx - bw * 0.38)},${n(basinY + h * 0.22)} Q${n(cx)},${n(basinY + h * 0.3)} ${n(cx + bw * 0.38)},${n(basinY + h * 0.22)} L${n(cx + bw / 2)},${n(basinY)} Z" fill="${P.metal}"/>
    <ellipse cx="${n(cx)}" cy="${n(basinY)}" rx="${n(bw / 2)}" ry="${n(h * 0.045)}" fill="${P.metalLight}" opacity="0.5"/>
    <ellipse cx="${n(cx)}" cy="${n(basinY)}" rx="${n(bw * 0.4)}" ry="${n(h * 0.033)}" fill="${P.bg}" opacity="0.55"/>
    <!-- gooseneck faucet -->
    <path d="M${n(cx - bw * 0.02)},${n(basinY - h * 0.02)} L${n(cx - bw * 0.02)},${n(basinY - h * 0.26)} Q${n(cx - bw * 0.02)},${n(basinY - h * 0.4)} ${n(cx + bw * 0.16)},${n(basinY - h * 0.4)} Q${n(cx + bw * 0.3)},${n(basinY - h * 0.4)} ${n(cx + bw * 0.3)},${n(basinY - h * 0.27)}"
          fill="none" stroke="${P.metal}" stroke-width="${n(h * 0.045)}" stroke-linecap="round"/>
    <path d="M${n(cx - bw * 0.035)},${n(basinY - h * 0.06)} L${n(cx - bw * 0.035)},${n(basinY - h * 0.25)}" stroke="${P.metalLight}" stroke-width="${n(h * 0.012)}" stroke-linecap="round" opacity="0.8"/>
    <rect x="${n(cx - bw * 0.09)}" y="${n(basinY - h * 0.045)}" width="${n(bw * 0.14)}" height="${n(h * 0.03)}" rx="3" fill="${P.metalDark}"/>
    <!-- lever handle -->
    <path d="M${n(cx - bw * 0.04)},${n(basinY - h * 0.2)} L${n(cx - bw * 0.24)},${n(basinY - h * 0.26)}" stroke="${P.accent}" stroke-width="${n(h * 0.028)}" stroke-linecap="round"/>
    ${stream(cx + bw * 0.3, basinY - h * 0.25, h * 0.2, h * 0.028, P)}
    <ellipse cx="${n(cx + bw * 0.3)}" cy="${n(basinY + h * 0.03)}" rx="${n(bw * 0.13)}" ry="${n(h * 0.018)}" fill="${P.water}" opacity="0.4"/>
    ${grain(w, h, P.uid)}`;
}

/* -------------------------------------------------- 8. sewer excavation */

export function sceneSewerDig({ w, h, P, r }) {
  const gy = h * 0.42;
  const pw = h * 0.1;
  return `
    ${backdrop(w, h, P, r, { bloomY: 0.28 })}
    ${grid(w, h, P, 50)}
    <!-- ground line + soil -->
    <rect x="0" y="${n(gy)}" width="${w}" height="${n(h - gy)}" fill="${P.floor}" opacity="0.5"/>
    <line x1="0" y1="${n(gy)}" x2="${w}" y2="${n(gy)}" stroke="${P.accent}" stroke-width="2.5" opacity="0.5"/>
    <!-- trench -->
    <path d="M${n(w * 0.24)},${n(gy)} L${n(w * 0.32)},${n(h * 0.78)} L${n(w * 0.72)},${n(h * 0.78)} L${n(w * 0.8)},${n(gy)} Z" fill="${P.bg}" opacity="0.85"/>
    <!-- exposed main line -->
    ${pipe(w * 0.28, h * 0.7, w * 0.78, h * 0.7, pw, P, { collars: 'both' })}
    ${coupling(w * 0.53, h * 0.7, pw * 0.9, pw * 1.35, P)}
    <!-- soil strata marks -->
    ${[0.52, 0.62].map((t) => `<line x1="0" y1="${n(h * t)}" x2="${n(w * 0.24)}" y2="${n(h * t)}" stroke="${P.line}" stroke-width="2" opacity="0.35"/><line x1="${n(w * 0.8)}" y1="${n(h * t)}" x2="${w}" y2="${n(h * t)}" stroke="${P.line}" stroke-width="2" opacity="0.35"/>`).join('')}
    <!-- safety barrier -->
    ${[0.18, 0.86].map((t) => `<rect x="${n(w * t - 4)}" y="${n(gy - h * 0.16)}" width="8" height="${n(h * 0.16)}" rx="3" fill="${P.metalDark}"/>`).join('')}
    <path d="M${n(w * 0.18)},${n(gy - h * 0.13)} L${n(w * 0.86)},${n(gy - h * 0.13)}" stroke="${P.accent}" stroke-width="6" stroke-linecap="round" stroke-dasharray="26 14"/>
    ${shadow(w * 0.16, gy + 2, h * 0.12, P)}
    ${worker(w * 0.16, gy - h * 0.155, h * 0.095, P, { pose: 'point' })}
    ${grain(w, h, P.uid)}`;
}

/* ---------------------------------------------------- 9. service van */

export function sceneVan({ w, h, P, r }) {
  const gy = h * 0.76;
  const vw = w * 0.74;
  const vh = h * 0.34;
  const vx = w * 0.5 - vw / 2;
  const vy = gy - vh;
  return `
    ${backdrop(w, h, P, r, { bloomY: 0.4 })}
    ${grid(w, h, P, 48)}
    ${floor(w, h, P, gy)}
    ${shadow(w * 0.5, gy + 4, vw * 0.5, P)}
    <!-- body -->
    <path d="M${n(vx)},${n(vy + vh * 0.24)} Q${n(vx)},${n(vy)} ${n(vx + vw * 0.26)},${n(vy)} L${n(vx + vw * 0.58)},${n(vy)} Q${n(vx + vw * 0.74)},${n(vy)} ${n(vx + vw * 0.84)},${n(vy + vh * 0.3)} L${n(vx + vw)},${n(vy + vh * 0.46)} Q${n(vx + vw)},${n(vy + vh * 0.9)} ${n(vx + vw * 0.94)},${n(vy + vh * 0.9)} L${n(vx + vw * 0.06)},${n(vy + vh * 0.9)} Q${n(vx)},${n(vy + vh * 0.9)} ${n(vx)},${n(vy + vh * 0.24)} Z" fill="${P.metalLight}"/>
    <!-- windows -->
    <path d="M${n(vx + vw * 0.6)},${n(vy + vh * 0.1)} Q${n(vx + vw * 0.71)},${n(vy + vh * 0.1)} ${n(vx + vw * 0.79)},${n(vy + vh * 0.34)} L${n(vx + vw * 0.6)},${n(vy + vh * 0.34)} Z" fill="${P.bg}" opacity="0.75"/>
    <rect x="${n(vx + vw * 0.46)}" y="${n(vy + vh * 0.09)}" width="${n(vw * 0.11)}" height="${n(vh * 0.25)}" rx="3" fill="${P.bg}" opacity="0.75"/>
    <!-- livery band + mark -->
    <rect x="${n(vx + vw * 0.03)}" y="${n(vy + vh * 0.46)}" width="${n(vw * 0.42)}" height="${n(vh * 0.2)}" rx="${n(vh * 0.1)}" fill="${P.accent}"/>
    <circle cx="${n(vx + vw * 0.14)}" cy="${n(vy + vh * 0.28)}" r="${n(vh * 0.13)}" fill="${P.accent}"/>
    <!-- wheels -->
    ${[0.24, 0.78].map((t) => `
      <circle cx="${n(vx + vw * t)}" cy="${n(gy)}" r="${n(vh * 0.19)}" fill="${P.metalDark}"/>
      <circle cx="${n(vx + vw * t)}" cy="${n(gy)}" r="${n(vh * 0.08)}" fill="${P.metalLight}"/>`).join('')}
    <!-- roof ladder -->
    <rect x="${n(vx + vw * 0.1)}" y="${n(vy - vh * 0.07)}" width="${n(vw * 0.42)}" height="${n(vh * 0.06)}" rx="3" fill="${P.metalDark}"/>
    ${grain(w, h, P.uid)}`;
}

/* ------------------------------------------------------- 10. tool wall */

export function sceneTools({ w, h, P, r }) {
  const cols = 4;
  const cw = w / cols;
  const tool = (i, x, y, s) => {
    const kind = i % 4;
    if (kind === 0) return `
      <g transform="translate(${n(x)},${n(y)}) rotate(${n((r() - 0.5) * 12)})">
        <rect x="${n(-s * 0.07)}" y="${n(-s * 0.1)}" width="${n(s * 0.14)}" height="${n(s * 0.72)}" rx="${n(s * 0.06)}" fill="${P.accent}"/>
        <path d="M${n(-s * 0.26)},${n(-s * 0.34)} L${n(s * 0.26)},${n(-s * 0.34)} L${n(s * 0.2)},${n(-s * 0.06)} L${n(-s * 0.2)},${n(-s * 0.06)} Z" fill="${P.metal}"/>
        <rect x="${n(-s * 0.24)}" y="${n(-s * 0.5)}" width="${n(s * 0.14)}" height="${n(s * 0.18)}" fill="${P.metal}"/>
      </g>`;
    if (kind === 1) return `
      <g transform="translate(${n(x)},${n(y)}) rotate(${n((r() - 0.5) * 16)})">
        <rect x="${n(-s * 0.055)}" y="${n(-s * 0.42)}" width="${n(s * 0.11)}" height="${n(s * 0.84)}" rx="${n(s * 0.05)}" fill="${P.metal}"/>
        <path d="M${n(-s * 0.2)},${n(-s * 0.42)} L${n(s * 0.2)},${n(-s * 0.42)} L${n(s * 0.13)},${n(-s * 0.2)} L${n(-s * 0.13)},${n(-s * 0.2)} Z" fill="${P.metalLight}"/>
        <rect x="${n(-s * 0.09)}" y="${n(s * 0.12)}" width="${n(s * 0.18)}" height="${n(s * 0.3)}" rx="${n(s * 0.06)}" fill="${P.accent}"/>
      </g>`;
    if (kind === 2) return `
      <g transform="translate(${n(x)},${n(y)}) rotate(${n((r() - 0.5) * 10)})">
        <circle cx="0" cy="${n(-s * 0.12)}" r="${n(s * 0.26)}" fill="none" stroke="${P.metal}" stroke-width="${n(s * 0.09)}"/>
        <rect x="${n(-s * 0.055)}" y="${n(s * 0.1)}" width="${n(s * 0.11)}" height="${n(s * 0.4)}" rx="${n(s * 0.05)}" fill="${P.accent}"/>
      </g>`;
    return `
      <g transform="translate(${n(x)},${n(y)}) rotate(${n((r() - 0.5) * 14)})">
        <path d="M${n(-s * 0.22)},${n(-s * 0.4)} L${n(s * 0.06)},${n(-s * 0.4)} L${n(s * 0.06)},${n(-s * 0.16)} L${n(s * 0.22)},${n(-s * 0.16)} L${n(s * 0.22)},${n(s * 0.05)} L${n(-s * 0.22)},${n(s * 0.05)} Z" fill="${P.metalLight}"/>
        <rect x="${n(-s * 0.06)}" y="${n(s * 0.02)}" width="${n(s * 0.12)}" height="${n(s * 0.42)}" rx="${n(s * 0.05)}" fill="${P.metalDark}"/>
      </g>`;
  };

  const items = [];
  for (let i = 0; i < 8; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    items.push(tool(i, cw * (col + 0.5), h * (0.32 + row * 0.34), Math.min(cw, h * 0.34) * 0.82));
  }

  return `
    ${backdrop(w, h, P, r, { bloomY: 0.5 })}
    ${grid(w, h, P, 38)}
    <!-- pegboard rails -->
    ${[0.2, 0.54].map((t) => `<rect x="0" y="${n(h * t)}" width="${w}" height="${n(h * 0.012)}" fill="${P.metalDark}" opacity="0.6"/>`).join('')}
    ${items.join('')}
    ${grain(w, h, P.uid)}`;
}

/* -------------------------------------------------- 11. finished bathroom */

export function sceneBathroom({ w, h, P, r }) {
  const gy = h * 0.84;
  const vanX = w * 0.08;
  const vanW = w * 0.46;
  const vanY = h * 0.54;
  return `
    ${backdrop(w, h, P, r, { bloomX: 0.42, bloomY: 0.34 })}
    <!-- tiled wall, offset courses -->
    ${Array.from({ length: 8 }, (_, row) =>
      Array.from({ length: 10 }, (_, col) => {
        const tw = w / 8.4;
        const th = h / 10;
        const x = col * tw + (row % 2 ? -tw / 2 : 0);
        return `<rect x="${n(x + 2)}" y="${n(row * th + 2)}" width="${n(tw - 4)}" height="${n(th - 4)}" rx="2" fill="${P.metalLight}" opacity="${(0.04 + r() * 0.045).toFixed(3)}"/>`;
      }).join('')
    ).join('')}
    ${floor(w, h, P, gy)}

    <!-- vanity unit -->
    <rect x="${n(vanX)}" y="${n(vanY)}" width="${n(vanW)}" height="${n(gy - vanY)}" rx="6" fill="${P.metal}" opacity="0.5"/>
    <rect x="${n(vanX)}" y="${n(vanY)}" width="${n(vanW)}" height="${n(h * 0.035)}" rx="4" fill="${P.metalLight}" opacity="0.75"/>
    <line x1="${n(vanX + vanW * 0.5)}" y1="${n(vanY + h * 0.05)}" x2="${n(vanX + vanW * 0.5)}" y2="${n(gy - h * 0.02)}" stroke="${P.metalDark}" stroke-width="2" opacity="0.5"/>
    <rect x="${n(vanX + vanW * 0.2)}" y="${n(vanY + h * 0.11)}" width="${n(vanW * 0.16)}" height="4" rx="2" fill="${P.accent}" opacity="0.8"/>
    <rect x="${n(vanX + vanW * 0.64)}" y="${n(vanY + h * 0.11)}" width="${n(vanW * 0.16)}" height="4" rx="2" fill="${P.accent}" opacity="0.8"/>

    <!-- basin sunk into the counter -->
    <ellipse cx="${n(vanX + vanW * 0.5)}" cy="${n(vanY + h * 0.012)}" rx="${n(vanW * 0.3)}" ry="${n(h * 0.028)}" fill="${P.bg}" opacity="0.72"/>
    <ellipse cx="${n(vanX + vanW * 0.5)}" cy="${n(vanY + h * 0.008)}" rx="${n(vanW * 0.24)}" ry="${n(h * 0.02)}" fill="${P.metalDark}" opacity="0.55"/>

    <!-- mixer tap -->
    <path d="M${n(vanX + vanW * 0.5)},${n(vanY - h * 0.005)} L${n(vanX + vanW * 0.5)},${n(vanY - h * 0.1)} Q${n(vanX + vanW * 0.5)},${n(vanY - h * 0.14)} ${n(vanX + vanW * 0.56)},${n(vanY - h * 0.14)} Q${n(vanX + vanW * 0.62)},${n(vanY - h * 0.14)} ${n(vanX + vanW * 0.62)},${n(vanY - h * 0.09)}"
          fill="none" stroke="${P.metalLight}" stroke-width="${n(h * 0.022)}" stroke-linecap="round"/>
    <path d="M${n(vanX + vanW * 0.46)},${n(vanY - h * 0.075)} L${n(vanX + vanW * 0.36)},${n(vanY - h * 0.1)}" stroke="${P.accent}" stroke-width="${n(h * 0.017)}" stroke-linecap="round"/>
    ${stream(vanX + vanW * 0.62, vanY - h * 0.08, h * 0.075, h * 0.016, P)}

    <!-- framed mirror -->
    <rect x="${n(vanX + vanW * 0.12)}" y="${n(h * 0.14)}" width="${n(vanW * 0.76)}" height="${n(h * 0.3)}" rx="${n(vanW * 0.1)}" fill="${P.bg}" opacity="0.45"/>
    <rect x="${n(vanX + vanW * 0.12)}" y="${n(h * 0.14)}" width="${n(vanW * 0.76)}" height="${n(h * 0.3)}" rx="${n(vanW * 0.1)}" fill="none" stroke="${P.accent}" stroke-width="3" opacity="0.85"/>
    <path d="M${n(vanX + vanW * 0.2)},${n(h * 0.4)} L${n(vanX + vanW * 0.44)},${n(h * 0.17)}" stroke="${P.metalLight}" stroke-width="5" opacity="0.16" stroke-linecap="round"/>

    <!-- recessed niche with bottles -->
    <rect x="${n(w * 0.63)}" y="${n(h * 0.3)}" width="${n(w * 0.24)}" height="${n(h * 0.2)}" rx="4" fill="${P.bg}" opacity="0.6"/>
    <rect x="${n(w * 0.66)}" y="${n(h * 0.36)}" width="${n(w * 0.035)}" height="${n(h * 0.14)}" rx="3" fill="${P.accent}" opacity="0.7"/>
    <rect x="${n(w * 0.71)}" y="${n(h * 0.39)}" width="${n(w * 0.03)}" height="${n(h * 0.11)}" rx="3" fill="${P.metalLight}" opacity="0.5"/>

    <!-- towel rail -->
    <rect x="${n(w * 0.63)}" y="${n(h * 0.58)}" width="${n(w * 0.26)}" height="4" rx="2" fill="${P.metalLight}" opacity="0.8"/>
    <rect x="${n(w * 0.67)}" y="${n(h * 0.6)}" width="${n(w * 0.08)}" height="${n(h * 0.17)}" rx="3" fill="${P.metalLight}" opacity="0.22"/>
    <rect x="${n(w * 0.77)}" y="${n(h * 0.6)}" width="${n(w * 0.07)}" height="${n(h * 0.13)}" rx="3" fill="${P.accent}" opacity="0.28"/>
    ${grain(w, h, P.uid)}`;
}

/* ------------------------------------------------------------ 12. team */

export function sceneTeam({ w, h, P, r }) {
  const gy = h * 0.86;
  const s = h * 0.26;
  return `
    ${backdrop(w, h, P, r, { bloomY: 0.4 })}
    ${grid(w, h, P, 50)}
    ${floor(w, h, P, gy)}
    <!-- van silhouette behind -->
    <g opacity="0.35">
      <rect x="${n(w * 0.56)}" y="${n(gy - h * 0.32)}" width="${n(w * 0.42)}" height="${n(h * 0.32)}" rx="${n(h * 0.05)}" fill="${P.metalDark}"/>
      <circle cx="${n(w * 0.66)}" cy="${n(gy)}" r="${n(h * 0.055)}" fill="${P.bg}"/>
      <circle cx="${n(w * 0.9)}" cy="${n(gy)}" r="${n(h * 0.055)}" fill="${P.bg}"/>
    </g>
    ${shadow(w * 0.2, gy + 2, s * 0.8, P)}
    ${shadow(w * 0.5, gy + 2, s * 0.86, P)}
    ${shadow(w * 0.8, gy + 2, s * 0.8, P)}
    ${worker(w * 0.2, gy - s * 1.6, s * 0.94, P, { pose: 'toolbox', skin: P.skinB })}
    ${worker(w * 0.8, gy - s * 1.6, s * 0.94, P, { pose: 'clipboard', skin: P.skinC, flip: true })}
    ${worker(w * 0.5, gy - s * 1.66, s, P, { pose: 'wrench' })}
    ${grain(w, h, P.uid)}`;
}

/* ------------------------------------------------ 13. leak behind wall */

export function sceneLeakDetect({ w, h, P, r }) {
  const wallX = w * 0.3;
  return `
    ${backdrop(w, h, P, r, { bloomX: 0.62, bloomY: 0.45 })}
    ${grid(w, h, P, 44)}
    <!-- wall section with cutaway -->
    <rect x="${n(wallX)}" y="0" width="${n(w * 0.7)}" height="${h}" fill="${P.metalDark}" opacity="0.35"/>
    <line x1="${n(wallX)}" y1="0" x2="${n(wallX)}" y2="${h}" stroke="${P.accent}" stroke-width="2.5" opacity="0.5"/>
    <!-- studs -->
    ${[0.46, 0.72].map((t) => `<rect x="${n(w * t)}" y="0" width="${n(w * 0.035)}" height="${h}" fill="${P.metalDark}" opacity="0.5"/>`).join('')}
    <!-- concealed supply line with a pinhole -->
    ${pipe(w * 0.38, h * 0.18, w * 0.38, h * 0.86, h * 0.05, P, { collars: 'none' })}
    ${elbow(w * 0.44, h * 0.34, h * 0.06, h * 0.05, 180, 270, P)}
    ${pipe(w * 0.44, h * 0.28, w * 1.05, h * 0.28, h * 0.05, P, { collars: 'end' })}
    <!-- thermal signature rings around the leak -->
    ${[0.34, 0.25, 0.17, 0.1].map((t, i) =>
      `<circle cx="${n(w * 0.62)}" cy="${n(h * 0.28)}" r="${n(Math.min(w, h) * t)}" fill="${P.accent}" opacity="${(0.05 + i * 0.055).toFixed(3)}"/>`
    ).join('')}
    ${spray(w * 0.62, h * 0.3, 1, h * 0.16, 4, P, r)}
    <!-- acoustic probe -->
    <g transform="translate(${n(w * 0.14)},${n(h * 0.52)})">
      <rect x="${n(-w * 0.05)}" y="${n(-h * 0.1)}" width="${n(w * 0.1)}" height="${n(h * 0.2)}" rx="${n(w * 0.03)}" fill="${P.metalDark}"/>
      <circle cx="0" cy="${n(-h * 0.03)}" r="${n(w * 0.028)}" fill="${P.accent}"/>
      ${[1, 2, 3].map((i) => `<path d="M${n(w * 0.06)},${n(-h * 0.03)} A${n(w * 0.04 * i)},${n(w * 0.04 * i)} 0 0 1 ${n(w * 0.06)},${n(h * 0.03)}" fill="none" stroke="${P.accent}" stroke-width="2" opacity="${(0.5 - i * 0.12).toFixed(2)}" transform="translate(${n(w * 0.02 * i)},0)"/>`).join('')}
      <line x1="0" y1="${n(h * 0.1)}" x2="0" y2="${n(h * 0.3)}" stroke="${P.metal}" stroke-width="${n(w * 0.012)}"/>
    </g>
    ${grain(w, h, P.uid)}`;
}

/* -------------------------------------------------------------- registry */

export const SCENES = {
  workerWrench: sceneWorkerWrench,
  fittingCloseup: sceneFittingCloseup,
  waterHeater: sceneWaterHeater,
  pTrap: scenePTrap,
  burstPipe: sceneBurstPipe,
  drainCamera: sceneDrainCamera,
  faucet: sceneFaucet,
  sewerDig: sceneSewerDig,
  van: sceneVan,
  tools: sceneTools,
  bathroom: sceneBathroom,
  team: sceneTeam,
  leakDetect: sceneLeakDetect,
};

/**
 * Build a scene's inner markup plus the defs it needs.
 *
 * Exposed separately so callers that compose a scene into a larger document
 * (the OG image) can take the body directly instead of regex-scraping a
 * rendered <svg> — which silently produced a nested document the moment the
 * markup changed.
 *
 * A seed-derived zoom/pan/flip keeps the same scene from reading as a duplicate
 * when reused across slots. Zoom is always >1 and a base fill sits behind, so
 * panning can never expose empty canvas.
 */
export function renderBody(name, { w, h, seed, palette }) {
  const fn = SCENES[name];
  if (!fn) throw new Error(`Unknown scene "${name}". Available: ${Object.keys(SCENES).join(', ')}`);

  const uid = `s${seed}`;
  const P = { ...palette, uid };
  const vr = rng(seed * 7919 + 13);

  // Kept deliberately gentle: the layout crops these again with object-fit:
  // cover, so the two crops compound. Anything stronger removes heads.
  const zoom = 1.02 + vr() * 0.07;
  const panX = (vr() - 0.5) * w * 0.05;
  const panY = (vr() - 0.5) * h * 0.035;
  const flip = vr() > 0.55;

  const cx = n(w / 2);
  const cy = n(h / 2);
  const transform =
    `translate(${n(cx + panX)},${n(cy + panY)}) scale(${n(flip ? -zoom : zoom)},${n(zoom)}) translate(${n(-cx)},${n(-cy)})`;

  return {
    uid,
    defs: defs(uid),
    body: `<rect width="${w}" height="${h}" fill="${P.bg}"/>
<g clip-path="url(#frame-${uid})"><g transform="${transform}">${fn({ w, h, P, r: rng(seed) })}</g></g>`,
  };
}

/** Render a named scene as a standalone SVG document. */
export function render(name, opts) {
  const { w, h, label } = opts;
  const { defs: d, body } = renderBody(name, opts);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${label}">
${d}
${body}
</svg>`;
}

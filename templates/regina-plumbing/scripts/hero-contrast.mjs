/**
 * Measures the hero's real composited backdrop and the contrast the headline
 * actually gets, in a real browser, against the real photograph.
 *
 * This exists because the hero was twice wrong from eyeballing it: once so
 * dark the photo was invisible, once (earlier) with the reasoning inverted in
 * a code comment. Alphas that compose over a photograph cannot be reasoned
 * about from the CSS — they have to be sampled.
 *
 * Usage:  npm run build && npx serve out -p 8920   (any static server)
 *         node scripts/hero-contrast.mjs http://localhost:8920/
 */
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:8920/';
const EXEC = process.env.CHROMIUM_PATH || undefined;

const srgb = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const lum = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const browser = await chromium.launch({ executablePath: EXEC });
let failed = false;

for (const [label, width, height] of [
  ['desktop', 1440, 900],
  ['mobile', 390, 844],
]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);

  // Hide the text so the sample is of the backdrop the text sits on, not of
  // the text itself. Sampling through the glyphs measures nothing useful.
  const box = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const r = h1.getBoundingClientRect();
    document.querySelectorAll('h1, h1 ~ *').forEach((el) => (el.style.visibility = 'hidden'));
    return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) };
  });
  await page.waitForTimeout(150);

  const shot = await page.screenshot({ clip: box });
  await page.close();

  // Decode the PNG without a dependency: use the browser we already have.
  const p2 = await browser.newPage();
  const px = await p2.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await img.decode();
    const c = new OffscreenCanvas(img.width, img.height);
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const d = ctx.getImageData(0, 0, img.width, img.height).data;
    const px = [];
    let sum = [0, 0, 0];
    let n = 0;
    for (let i = 0; i < d.length; i += 4) {
      const p = [d[i], d[i + 1], d[i + 2]];
      px.push([0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2], p]);
      sum = [sum[0] + p[0], sum[1] + p[1], sum[2] + p[2]];
      n++;
    }
    px.sort((a, b) => a[0] - b[0]);
    return {
      avg: sum.map((v) => Math.round(v / n)),
      // 95th percentile, not the maximum. The gate has to represent the
      // background the glyphs actually sit on; a single blown-out highlight
      // in a photograph is not that, and tuning against it drives the hero
      // back to the near-black wash this design is trying to get away from.
      p95: px[Math.floor(px.length * 0.95)][1],
      max: px[px.length - 1][1],
    };
  }, shot.toString('base64'));
  await p2.close();

  const hex = (c) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
  const white = [255, 255, 255];
  // Gate on p95, not the mean: the mean hides a bright quadrant entirely.
  const worst = ratio(white, px.p95);
  const avg = ratio(white, px.avg);
  const peak = ratio(white, px.max);
  const ok = worst >= 4.5;
  if (!ok) failed = true;

  console.log(
    `${label.padEnd(8)} avg ${hex(px.avg)} ${avg.toFixed(2)}:1   ` +
      `p95 ${hex(px.p95)} ${worst.toFixed(2)}:1   peak ${hex(px.max)} ${peak.toFixed(2)}:1  ` +
      `${ok ? 'PASS' : 'FAIL (p95 needs >= 4.5:1)'}`,
  );
}

await browser.close();
process.exit(failed ? 1 : 0);

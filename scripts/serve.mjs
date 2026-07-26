#!/usr/bin/env node
/**
 * Local preview server that applies the SAME security headers as production.
 *
 * This exists because a CSP that is only ever configured at the host is a CSP
 * nobody tests until launch day. Serving locally with the real policy means a
 * violation shows up in the console now, not after DNS cutover.
 *
 * ponytail: node:http + a MIME map. No express, no serve-handler — this is
 * ~90 lines and has no attack surface of its own.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { securityHeaders, CACHE_RULES } from '../deploy/headers.config.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const PORT = Number(process.env.PORT ?? 4321);

const cfg = JSON.parse(await readFile(join(ROOT, 'site.config.json'), 'utf8'));

// Hashes are only needed if the build actually emitted inline scripts.
let scriptHashes = [];
try {
  scriptHashes = JSON.parse(await readFile(join(ROOT, 'dist', '.csp-hashes.json'), 'utf8'));
} catch {
  /* no hash manifest yet — run `npm run hash` */
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

function cacheFor(pathname) {
  for (const rule of CACHE_RULES) {
    const prefix = rule.path.replace('*', '');
    if (rule.path.startsWith('/*')) continue;
    if (pathname.startsWith(prefix)) return rule.value;
  }
  return 'public, max-age=0, must-revalidate';
}

async function resolve(pathname) {
  // normalize() collapses ../ so a crafted path cannot escape DIST
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(DIST, safe);
  if (!file.startsWith(DIST)) return null;

  try {
    const s = await stat(file);
    if (s.isDirectory()) file = join(file, 'index.html');
  } catch {
    if (!extname(file)) {
      file = join(DIST, safe, 'index.html');
    }
  }
  try {
    await stat(file);
    return file;
  } catch {
    return null;
  }
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, `http://localhost:${PORT}`);
  const headers = securityHeaders({ scriptHashes, analytics: cfg.analytics });

  const file = await resolve(pathname);

  if (!file) {
    const body = await readFile(join(DIST, '404.html')).catch(() => Buffer.from('Not found'));
    res.writeHead(404, { ...headers, 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(body);
  }

  const body = await readFile(file);
  res.writeHead(200, {
    ...headers,
    'Content-Type': MIME[extname(file)] ?? 'application/octet-stream',
    'Cache-Control': cacheFor(pathname),
  });
  res.end(body);
}).listen(PORT, () => {
  console.log(`\n  Preview  http://localhost:${PORT}`);
  console.log(`  Headers  production security headers ARE applied`);
  console.log(`  CSP      ${scriptHashes.length} inline-script hash(es) allowed\n`);
});

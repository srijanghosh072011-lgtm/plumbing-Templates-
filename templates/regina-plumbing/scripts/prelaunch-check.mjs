#!/usr/bin/env node
/**
 * Pre-launch gate. Run with `npm run check`; the deploy workflow runs it
 * before `next build`, so a site carrying placeholder data cannot ship.
 *
 * This automates the parts of playbook section 4 that a human reliably
 * forgets at 11pm the night before a launch: lorem ipsum, 555 numbers,
 * example@ addresses, `href="#"`, TODO markers, and staging URLs.
 *
 * Exit codes: 0 clean, 1 blocking failures found.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SCAN_DIRS = ['app', 'components', 'lib', 'public'];
const SCAN_EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.css', '.json', '.txt', '.html', '.webmanifest']);

/** [name, regex, severity] — 'block' fails the build, 'warn' reports only. */
const RULES = [
  ['Placeholder marker (TODO_)', /TODO_[A-Z0-9_]+/g, 'block'],
  ['Lorem ipsum', /\b(lorem ipsum|dolor sit amet)\b/gi, 'block'],
  ['Fake 555 phone number', /\b\(?\d{3}\)?[\s.-]?555[\s.-]?\d{4}\b/g, 'block'],
  ['Example/test email', /\b[\w.+-]+@(example|test|localhost)\.(com|org|net)\b/gi, 'block'],
  ['Placeholder street address', /\b123\s+(main|test|example)\s+(st|street|ave|avenue|rd|road)\b/gi, 'block'],
  ['Empty anchor href="#"', /href=["']#["']/g, 'block'],
  ['Staging or localhost URL', /https?:\/\/(localhost|127\.0\.0\.1|staging\.|dev\.|.*\.vercel\.app)/gi, 'block'],
  ['Leftover code marker', /\/\/\s*(TODO|FIXME|XXX|HACK)\b/g, 'warn'],
  ['Possible hardcoded secret', /(api[_-]?key|secret|password|token)\s*[:=]\s*["'][A-Za-z0-9_\-]{16,}["']/gi, 'warn'],
  ['console.log left in', /console\.log\(/g, 'warn'],
];

/** Files that legitimately contain the patterns above. */
const EXEMPT = [
  'scripts/prelaunch-check.mjs',  // the rules themselves
  'LAUNCH-CHECKLIST.md',
  'README.md',
];

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry === 'node_modules' || entry === '.next' || entry === 'out') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (SCAN_EXT.has(extname(full))) out.push(full);
  }
  return out;
}

const files = SCAN_DIRS.flatMap((d) => walk(join(ROOT, d)));

/**
 * Demo mode. When client.config.ts declares `isDemo: true`, the data is
 * knowingly fictional — a showcase deployment, not a client site — so every
 * finding drops to a warning and the build proceeds.
 *
 * This is the one legitimate reason to get past the gate. It is deliberately
 * driven by a flag in the config rather than a CI variable, so that turning
 * it off is the same act as putting real data in, and nobody can quietly
 * disable the check from the workflow file.
 */
const isDemo = /isDemo:\s*true/.test(
  readFileSync(join(ROOT, 'lib/client.config.ts'), 'utf8'),
);

const blocking = [];
const warnings = [];

for (const file of files) {
  const rel = relative(ROOT, file);
  if (EXEMPT.some((e) => rel.endsWith(e))) continue;

  const lines = readFileSync(file, 'utf8').split('\n');

  lines.forEach((line, i) => {
    for (const [name, pattern, severity] of RULES) {
      // Regexes carry /g, so lastIndex must be reset between uses.
      pattern.lastIndex = 0;
      const match = pattern.exec(line);
      if (!match) continue;

      const hit = {
        file: rel,
        line: i + 1,
        rule: name,
        text: match[0].slice(0, 60),
      };
      (severity === 'block' && !isDemo ? blocking : warnings).push(hit);
    }
  });
}

const fmt = (h) => `  ${h.file}:${h.line}  ${h.rule} → "${h.text}"`;

if (warnings.length) {
  console.log(`\n⚠  ${warnings.length} warning(s):`);
  console.log(warnings.map(fmt).join('\n'));
}

if (blocking.length) {
  console.error(`\n✖  ${blocking.length} blocking issue(s) — this site is not launch-ready:\n`);
  console.error(blocking.map(fmt).join('\n'));
  console.error(
    '\nThese are placeholders, not content. Fill them in (start with lib/client.config.ts).',
  );
  console.error(
    'This check does not block `npm run build` locally — only the deploy workflow.\n',
  );
  process.exit(1);
}

if (isDemo) {
  console.log(`\n⚠  DEMO MODE — client.config.ts has isDemo: true.`);
  console.log('   The business above is fictional and the checks above were downgraded');
  console.log('   to warnings so the showcase can deploy. Set isDemo: false the moment');
  console.log('   real client data goes in, or this gate protects nothing.\n');
  process.exit(0);
}

console.log(`\n✔  Pre-launch content check passed (${files.length} files scanned).`);
console.log('   This checks content only. The rest of LAUNCH-CHECKLIST.md is still on you.\n');

/**
 * Fails the build on em-dashes.
 *
 * They are the single loudest tell that a paragraph came out of a language
 * model, and this repo is public, so comments count as copy too. One rule is
 * cheaper than an exemption taxonomy: the only survivor is the parenthesised
 * marker glyph in the Skills legend, which is a design element rather than
 * punctuation.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

// Built, never written literally: this file sits inside its own search path,
// and a sweep that edits the detector would disable the check silently.
const EM = String.fromCharCode(0x2014);

const ROOTS = ['src', 'api', 'scripts', 'docs', 'index.html', 'CLAUDE.md'];
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git']);
const TEXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.css', '.html', '.md', '.json']);

function* walk(path) {
  if (statSync(path).isFile()) return yield path;
  for (const entry of readdirSync(path)) {
    if (SKIP_DIRS.has(entry)) continue;
    yield* walk(join(path, entry));
  }
}

const offences = [];
for (const root of ROOTS) {
  for (const file of walk(root)) {
    if (!TEXT.has(extname(file))) continue;
    readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
      if (line.replaceAll('(' + EM + ')', '').includes(EM)) offences.push(`${file}:${i + 1}  ${line.trim()}`);
    });
  }
}

if (offences.length > 0) {
  console.error(`Em-dashes found in ${offences.length} line(s):\n`);
  for (const o of offences) console.error('  ' + o);
  process.exit(1);
}
console.log('No em-dashes.');

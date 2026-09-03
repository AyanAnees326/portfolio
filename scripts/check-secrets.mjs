/**
 * Build gate: fail if a provider credential reached the public bundle, or if
 * source code reaches for a server-only environment variable.
 *
 * A Databricks credential in dist/ is not a billing problem, it is a workspace
 * credential leak, so this runs as a hard failure rather than a warning.
 * Run after every build, before every deploy.
 *
 * Two passes:
 *   1. dist/  scans built output for credential names and value shapes.
 *   2. src/   catches the mistake at authoring time, before it is ever bundled.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const SRC = 'src';

/**
 * Server-only variable names. None of these has any legitimate reason to appear
 * in client output, so the name alone is the signal. Matching names rather than
 * value shapes means a credential format we have not seen still trips the gate.
 */
const SERVER_ONLY_NAMES = [
  'DATABRICKS_CLIENT_SECRET',
  'DATABRICKS_CLIENT_ID',
  'DATABRICKS_HOST',
  'DATABRICKS_ENDPOINT',
  'DATABRICKS_TOKEN',
  'OPENROUTER_API_KEY',
  'CHAT_ALLOWED_ORIGINS',
];

/** Second net: value shapes, for a credential that arrives without its name. */
const VALUE_PATTERNS = [
  { name: 'Databricks PAT', re: /\bdapi[0-9a-f]{16,}/i },
  { name: 'Databricks OAuth secret', re: /\bdose[0-9a-z]{20,}/i },
  { name: 'Databricks workspace host', re: /[a-z0-9-]+\.(cloud\.databricks\.com|azuredatabricks\.net)/i },
  { name: 'OpenRouter key', re: /\bsk-or-v1-[0-9a-zA-Z]{16,}/ },
  { name: 'Generic assigned secret', re: /\b(CLIENT_SECRET|API_KEY|_TOKEN)\s*[:=]\s*["'][A-Za-z0-9_\-.]{20,}["']/ },
];

/**
 * The only VITE_ variable allowed to reach the browser. Web3Forms access keys
 * are public-by-design identifiers, protected by domain restrictions rather
 * than secrecy. Anything else with a VITE_ prefix is a mistake.
 */
const ALLOWED_CLIENT_ENV = ['VITE_WEB3FORMS_KEY'];

/** Skip only known-binary output. Everything text gets scanned, svg and xml included. */
const BINARY = /\.(png|jpe?g|webp|gif|avif|ico|woff2?|ttf|otf|eot|pdf|mp4|webm|zip)$/i;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const findings = [];

// Pass 1: built output.
let distFiles;
try {
  distFiles = walk(DIST);
} catch {
  console.error(`x ${DIST}/ not found. Run "npm run build" first.`);
  process.exit(1);
}

let scanned = 0;
for (const file of distFiles) {
  if (BINARY.test(file)) continue;
  scanned += 1;
  const text = readFileSync(file, 'utf8');

  for (const name of SERVER_ONLY_NAMES) {
    if (text.includes(name)) {
      findings.push({ file, name: `server-only variable ${name} in client output`, sample: name });
    }
  }
  for (const { name, re } of VALUE_PATTERNS) {
    const match = text.match(re);
    if (match) findings.push({ file, name, sample: match[0].slice(0, 12) + '...' });
  }
}

// Pass 2: source. Catches the leak before it is bundled.
const srcFiles = walk(SRC).filter((f) => /\.(ts|tsx)$/.test(f));
for (const file of srcFiles) {
  const text = readFileSync(file, 'utf8');

  for (const match of text.matchAll(/import\.meta\.env\.(VITE_[A-Z0-9_]+)/g)) {
    if (!ALLOWED_CLIENT_ENV.includes(match[1])) {
      findings.push({
        file,
        name: `${match[1]} is not an allowed client variable`,
        sample: match[0],
      });
    }
  }
  if (/\bprocess\.env\./.test(text) && !file.includes('.test.')) {
    findings.push({ file, name: 'process.env in src/ (server-only API)', sample: 'process.env' });
  }
  for (const match of text.matchAll(/from\s+['"]([^'"]*\/api\/[^'"]*|\.\.\/api\/[^'"]*)['"]/g)) {
    findings.push({ file, name: 'src/ imports from api/', sample: match[1] });
  }
}

if (findings.length > 0) {
  console.error('\nx SECRET LEAK. Do not deploy this build:\n');
  for (const f of findings) {
    console.error(`   ${f.name}\n     ${f.file}  (${f.sample})`);
  }
  console.error(
    '\nCredentials belong in Vercel env vars, read only by api/chat.ts.\n' +
      'Nothing in src/ may import them, and none may be VITE_ prefixed.\n',
  );
  process.exit(1);
}

console.log(`> No credentials found (${scanned} built files, ${srcFiles.length} source files scanned)`);

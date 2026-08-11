/**
 * Build gate: fail if a provider credential reached the public bundle.
 *
 * A Databricks PAT in dist/ is not a billing problem, it is a workspace
 * credential leak — so this runs as a hard failure rather than a warning.
 * Run after every build, before every deploy.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';

const PATTERNS = [
  { name: 'Databricks PAT', re: /\bdapi[0-9a-f]{16,}/i },
  { name: 'Databricks workspace host', re: /[a-z0-9-]+\.cloud\.databricks\.com/i },
  { name: 'OpenRouter key', re: /\bsk-or-v1-[0-9a-f]{16,}/i },
  { name: 'Generic bearer secret', re: /\bDATABRICKS_TOKEN\s*[:=]\s*["'][^"']+["']/ },
];

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

let files;
try {
  files = walk(DIST);
} catch {
  console.error(`✗ ${DIST}/ not found — run "npm run build" first.`);
  process.exit(1);
}

const findings = [];
for (const file of files) {
  if (!/\.(js|css|html|json|map)$/.test(file)) continue;
  const text = readFileSync(file, 'utf8');
  for (const { name, re } of PATTERNS) {
    const match = text.match(re);
    if (match) findings.push({ file, name, sample: match[0].slice(0, 12) + '…' });
  }
}

if (findings.length > 0) {
  console.error('\n✗ SECRET LEAK — do not deploy this build:\n');
  for (const f of findings) {
    console.error(`   ${f.name} in ${f.file}  (${f.sample})`);
  }
  console.error(
    '\nCredentials belong in Vercel env vars, read only by api/chat.ts.\n' +
      'Check that nothing in src/ imports them and that none are VITE_ prefixed.\n',
  );
  process.exit(1);
}

console.log(`✓ No credentials found in ${DIST}/ (${files.length} files scanned)`);

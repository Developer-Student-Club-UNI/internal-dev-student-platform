#!/usr/bin/env node
/**
 * Configura el hook pre-commit de Husky automáticamente si existe .git
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const huskyDir = path.join(ROOT, '.husky');

if (!fs.existsSync(huskyDir)) {
  fs.mkdirSync(huskyDir, { recursive: true });
}

const preCommitPath = path.join(huskyDir, 'pre-commit');
const hookContent = `#!/usr/bin/env sh
pnpm validate:all
`;

fs.writeFileSync(preCommitPath, hookContent, { mode: 0o755 });
console.log('[SUCCESS] [setup-hooks] Hook pre-commit Zero-Trust configurado en .husky/pre-commit');

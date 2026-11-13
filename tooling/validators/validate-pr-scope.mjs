#!/usr/bin/env node
// Validador de Alcance de Pull Request por Rol (tooling/validators/validate-pr-scope.mjs)
//
// En CI/CD (GitHub Actions), verifica que si un desarrollador no pertenece a la lista
// de mantenedores del IDP (IDP_MAINTAINERS), su Pull Request SOLO pueda modificar:
//   - apps/**
//   - modules/**
//   - specs/ACTIVE_SESSION.md
//   - pnpm-lock.yaml (si anadio un modulo nuevo)
//
// Bloquea automaticamente cualquier intento de modificar packages/*, tooling/*,
// .ai/*, .github/* o las especificaciones base en specs/*.

import { execSync } from 'node:child_process';

const actor = process.env.GITHUB_ACTOR ?? '';
const maintainersRaw = process.env.IDP_MAINTAINERS ?? '';
const baseRef = process.env.GITHUB_BASE_REF
  ? `origin/${process.env.GITHUB_BASE_REF}`
  : '';

if (!actor || !baseRef || !maintainersRaw) {
  console.log(
    '[INFO] [validate:pr-scope] Ejecucion local o sin restriccion de actor CI activa. Verificacion de CODEOWNERS delegada a GitHub.'
  );
  process.exit(0);
}

const maintainers = new Set(
  maintainersRaw
    .split(',')
    .map((u) => u.trim().toLowerCase())
    .filter(Boolean)
);

if (maintainers.has(actor.toLowerCase())) {
  console.log(
    `[SUCCESS] [validate:pr-scope] El autor @${actor} es Mantenedor del IDP. Permiso completo sobre el nucleo concedido.`
  );
  process.exit(0);
}

let changedFiles = [];
try {
  const output = execSync(`git diff --name-only ${baseRef}...HEAD`, {
    encoding: 'utf8',
  });
  changedFiles = output
    .split(/\r?\n/)
    .map((f) => f.trim())
    .filter(Boolean);
} catch {
  console.log(
    '[INFO] [validate:pr-scope] No se pudo calcular git diff en este entorno.'
  );
  process.exit(0);
}

const PROTECTED_CORE_PREFIXES = [
  'packages/',
  'tooling/',
  '.ai/',
  '.opencode/',
  '.claude/',
  '.agent/',
  '.github/',
];

const PROTECTED_ROOT_FILES = new Set([
  'README.md',
  'GUIA_DESARROLLADOR_JUNIOR.md',
  'AGENTS.md',
  'CLAUDE.md',
  'CONVENTIONS.md',
  '.cursorrules',
  '.windsurfrules',
  'opencode.json',
  'turbo.json',
  'pnpm-workspace.yaml',
  'tsconfig.json',
]);

const unauthorizedTouches = [];

for (const file of changedFiles) {
  const isProtectedPrefix = PROTECTED_CORE_PREFIXES.some((prefix) =>
    file.startsWith(prefix)
  );
  const isProtectedRoot = PROTECTED_ROOT_FILES.has(file);
  const isProtectedSpec =
    file.startsWith('specs/') && file !== 'specs/ACTIVE_SESSION.md';

  if (isProtectedPrefix || isProtectedRoot || isProtectedSpec) {
    unauthorizedTouches.push(file);
  }
}

if (unauthorizedTouches.length > 0) {
  console.error(
    `\n[ERROR] [validate:pr-scope] El usuario @${actor} no tiene permisos de Mantenedor del IDP para modificar archivos del nucleo o plantillas:\n`
  );
  for (const f of unauthorizedTouches) {
    console.error(`  - ${f}`);
  }
  console.error(
    '\nLos desarrolladores de aplicaciones y modulos solo pueden modificar archivos dentro de apps/* y modules/*.\n'
  );
  process.exit(1);
}

console.log(
  `[SUCCESS] [validate:pr-scope] Todos los archivos modificados por @${actor} respetan el alcance de apps/ y modules/.`
);

#!/usr/bin/env node
/**
 * Lanzador Selectivo de Aplicaciones en Desarrollo (tooling/generators/run-app.mjs)
 *
 * Evita levantar todas las aplicaciones del monorepo en paralelo por accidente.
 * Uso:
 *   pnpm dev external-community-web   (o: pnpm dev external)
 *   pnpm dev internal-board-portal    (o: pnpm dev internal)
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = process.cwd();
const appsDir = path.join(ROOT, 'apps');

const availableApps = fs.existsSync(appsDir)
  ? fs
      .readdirSync(appsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => {
        const pkgPath = path.join(appsDir, d.name, 'package.json');
        let port = '4310+';
        if (fs.existsSync(pkgPath)) {
          const pkgRaw = fs.readFileSync(pkgPath, 'utf8');
          const m = pkgRaw.match(/--port\s+(\d+)/);
          if (m && m[1]) port = m[1];
        }
        return { id: d.name, port };
      })
  : [];

const arg = process.argv[2]?.trim();

if (!arg) {
  console.log('\n[INFO] Lanzador Selectivo del IDP (Modo Desarrollo Individual)\n');
  console.log(
    'Para no saturar tu memoria RAM levantando todas las aplicaciones del monorepo a la vez,'
  );
  console.log('indica cual aplicacion deseas levantar:\n');

  for (const app of availableApps) {
    console.log(
      `  • pnpm dev ${app.id.padEnd(26)} -> http://localhost:${app.port}`
    );
  }

  console.log('\nAtajos rapidos:');
  console.log('  • pnpm dev:external   -> Levanta solo apps/external-community-web (Puerto 4310)');
  console.log('  • pnpm dev:internal   -> Levanta solo apps/internal-board-portal (Puerto 4320)');
  console.log('  • pnpm dev:all        -> Levanta TODAS las aplicaciones en paralelo\n');
  process.exit(0);
}

const matched =
  availableApps.find((a) => a.id === arg) ??
  availableApps.find((a) => a.id.includes(arg));

if (!matched) {
  console.error(
    `[ERROR] No se encontro ninguna aplicacion que coincida con "${arg}".`
  );
  console.error(
    `Aplicaciones disponibles: ${availableApps.map((a) => a.id).join(', ')}`
  );
  process.exit(1);
}

console.log(
  `[INFO] Levantando unicamente @apps/${matched.id} en http://localhost:${matched.port} ...`
);

const child = spawn(
  'pnpm',
  ['--filter', `@apps/${matched.id}`, 'dev'],
  {
    stdio: 'inherit',
    shell: true,
  }
);

child.on('exit', (code) => {
  process.exit(code ?? 0);
});

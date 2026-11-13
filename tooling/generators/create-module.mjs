#!/usr/bin/env node
/**
 * Generador CLI de Módulos (tooling/generators/create-module.mjs)
 * Uso:
 *   pnpm create:module --app internal-board-portal --id finance-audit --title "Auditoría Financiera" --icon Activity --roles admin,board
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
function getArg(flag, fallback = '') {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const targetApp = getArg('--app');
const moduleId = getArg('--id');
const title = getArg('--title', moduleId);
const icon = getArg('--icon', 'Layers');
const rolesRaw = getArg('--roles', '');

if (!targetApp || !moduleId || !/^[a-z0-9-]+$/.test(moduleId)) {
  console.error(
    '[ERROR] Uso: pnpm create:module --app <app-id> --id <module-id> --title "Titulo del Modulo" [--icon Layers] [--roles admin,board]'
  );
  process.exit(1);
}

const ROOT = process.cwd();
const appDir = path.join(ROOT, 'apps', targetApp);
const modDir = path.join(ROOT, 'modules', targetApp, moduleId);

if (!fs.existsSync(appDir)) {
  console.error(`[ERROR] La aplicacion destino apps/${targetApp} no existe.`);
  process.exit(1);
}

if (fs.existsSync(modDir)) {
  console.error(`[ERROR] El modulo modules/${targetApp}/${moduleId} ya existe.`);
  process.exit(1);
}

fs.mkdirSync(path.join(modDir, 'views'), { recursive: true });

const pkgName = `@modules/${targetApp}--${moduleId}`;
const pascalName = moduleId
  .split('-')
  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
  .join('');

fs.writeFileSync(
  path.join(modDir, 'package.json'),
  JSON.stringify(
    {
      name: pkgName,
      version: '1.0.0',
      private: true,
      exports: {
        '.': './module.config.ts',
      },
      scripts: {
        typecheck: 'tsc --noEmit',
        lint: 'tsc --noEmit',
      },
      dependencies: {
        '@repo/auth': 'workspace:*',
        '@repo/module-sdk': 'workspace:*',
        '@repo/security': 'workspace:*',
        '@repo/ui': 'workspace:*',
      },
      devDependencies: {
        '@repo/config': 'workspace:*',
        '@types/react': '^19.0.0',
        '@types/react-dom': '^19.0.0',
        react: '^19.0.0',
        'react-dom': '^19.0.0',
        typescript: '^5.7.2',
      },
    },
    null,
    2
  ) + '\n'
);

fs.writeFileSync(
  path.join(modDir, 'tsconfig.json'),
  JSON.stringify(
    {
      extends: '@repo/config/tsconfig.react-library.json',
      include: ['**/*.ts', '**/*.tsx'],
      exclude: ['node_modules'],
    },
    null,
    2
  ) + '\n'
);

fs.writeFileSync(
  path.join(modDir, 'views', `${moduleId}-view.tsx`),
  `'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, PageHeader } from '@repo/ui';

export function ${pascalName}View() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="${title}"
        description="Módulo aislado generado bajo el contrato oficial @repo/module-sdk."
        badge="Módulo Activo"
        icon="${icon}"
      />
      <Card>
        <CardHeader>
          <CardTitle>Vista Principal — ${title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Este módulo se encuentra montado en la ruta <code>/${moduleId}</code> dentro de <code>${targetApp}</code>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
`
);

const rolesBlock = rolesRaw
  ? `  permissions: {\n    roles: [${rolesRaw
      .split(',')
      .map((r) => `'${r.trim()}'`)
      .join(', ')}],\n  },\n`
  : '';

fs.writeFileSync(
  path.join(modDir, 'module.config.ts'),
  `import { defineModule } from '@repo/module-sdk';
import { ${pascalName}View } from './views/${moduleId}-view';

export default defineModule({
  id: '${moduleId}',
  targetApp: '${targetApp}',
  title: '${title}',
  description: 'Módulo ${title} integrado en ${targetApp}.',
  version: '1.0.0',
  mount: {
    type: 'route',
    path: '/${moduleId}',
    slot: '${targetApp.startsWith('internal-') ? 'sidebar-main' : 'header-nav'}',
    order: 50,
    icon: '${icon}',
  },
${rolesBlock}  component: ${pascalName}View,
});
`
);

fs.writeFileSync(
  path.join(modDir, 'SPEC.md'),
  `# SPEC & Checkpoint SDD — \`${targetApp}/${moduleId}\`

- **Tipo:** \`module\`
- **Target:** \`modules/${targetApp}/${moduleId}\`
- **Ruta de Montaje:** \`/${moduleId}\`
- **Permisos RBAC:** \`${rolesRaw || 'public'}\`
- **Estado SDD:** \`implement\`

## 1. Requisitos y Alcance (Specs)
- **Incluye:** Modulo aislado \`${title}\` enchufado en \`${targetApp}\`.
- **Seguridad OWASP (\`@repo/security\`):** Validar entradas con \`validateSafeInput()\` y mutaciones con \`verifyMutationCsrf()\`.

## 2. Plan de Implementacion por Grupos (Planning & Implement)
### Grupo 1: Contrato y Estructura Base
- [x] Crear paquete \`@modules/${targetApp}--${moduleId}\` y \`module.config.ts\`
- [ ] Registrar el modulo en \`modules/${targetApp}/registry.ts\`
### Grupo 2: Interfaz \`@repo/ui\` y Seguridad \`@repo/security\`
- [ ] Construir vista \`views/${moduleId}-view.tsx\` usando componentes de \`@repo/ui\`
### Grupo 3: Pruebas y Seguridad (\`/test\` & \`/security-review\`)
- [ ] Ejecutar \`pnpm validate:all && pnpm typecheck && pnpm build\`

## 3. Criterios de Validacion (Validation Gate)
- [ ] Renderiza protegido dentro de \`<ModuleErrorBoundary>\` y \`<RoleGuard>\`
- [ ] 0 violaciones en \`pnpm validate:all\`
`
);

const activeSessionPath = path.join(ROOT, 'specs', 'ACTIVE_SESSION.md');
if (fs.existsSync(activeSessionPath)) {
  fs.writeFileSync(
    activeSessionPath,
    `# Puntero de Sesion SDD Activa (\`specs/ACTIVE_SESSION.md\`)

- **Scope Activo:** \`modules/${targetApp}/${moduleId}\`
- **Target Spec:** \`modules/${targetApp}/${moduleId}/SPEC.md\`
- **Fase SDD Actual:** \`implement\`
- **Ultimo Grupo Completado:** Grupo 1 (Scaffolding de \`modules/${targetApp}/${moduleId}\`)
- **Siguiente Accion Pendiente:** Ejecutar \`/implement\` sobre Grupo 2 de \`modules/${targetApp}/${moduleId}/SPEC.md\`
`
  );
}

console.log(`[SUCCESS] [create:module] Modulo creado exitosamente en modules/${targetApp}/${moduleId}`);
console.log(`   Checkpoint SDD creado en modules/${targetApp}/${moduleId}/SPEC.md y apuntado en specs/ACTIVE_SESSION.md`);
console.log(`   Recuerda anadir su import en modules/${targetApp}/registry.ts y ejecutar pnpm validate:all`);

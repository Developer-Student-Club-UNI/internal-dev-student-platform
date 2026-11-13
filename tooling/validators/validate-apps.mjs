#!/usr/bin/env node
/**
 * Validador de Contratos de Aplicaciones (tooling/validators/validate-apps.mjs)
 *
 * Verifica que toda aplicación en `apps/*` cumpla con `specs/APP_TEMPLATE.md`:
 * 1. Nombre de directorio prefijado con `external-` o `internal-`.
 * 2. Existencia de `app.config.ts` usando `defineApp(...)`.
 * 3. Consistencia entre el prefijo (`internal-` / `external-`) y `audience`, `layout` y `auth.required`.
 * 4. Uso obligatorio de un Shell de `@repo/layouts` en `src/app/layout.tsx`.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const APPS_DIR = path.join(ROOT, 'apps');

if (!fs.existsSync(APPS_DIR)) {
  console.log('[INFO] [validate:apps] Directorio apps/ aun sin inicializar.');
  process.exit(0);
}

const appDirs = fs
  .readdirSync(APPS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const errors = [];

for (const appName of appDirs) {
  const appPath = path.join(APPS_DIR, appName);
  const isExternal = appName.startsWith('external-');
  const isInternal = appName.startsWith('internal-');

  if (!isExternal && !isInternal) {
    errors.push(
      `[APP: ${appName}] El directorio en apps/ DEBE iniciar con "external-" o "internal-" según specs/APP_TEMPLATE.md.`
    );
  }

  const configPath = path.join(appPath, 'app.config.ts');
  if (!fs.existsSync(configPath)) {
    errors.push(`[APP: ${appName}] Falta archivo obligatorio app.config.ts.`);
    continue;
  }

  const configContent = fs.readFileSync(configPath, 'utf8');

  if (!configContent.includes('defineApp(')) {
    errors.push(
      `[APP: ${appName}] app.config.ts debe exportar su configuración usando defineApp() de @repo/module-sdk.`
    );
  }

  if (!configContent.includes(`id: '${appName}'`) && !configContent.includes(`id: "${appName}"`)) {
    errors.push(
      `[APP: ${appName}] El campo 'id' en app.config.ts debe coincidir exactamente con el nombre de la carpeta ('${appName}').`
    );
  }

  if (isExternal) {
    if (!/audience:\s*['"]external['"]/.test(configContent)) {
      errors.push(
        `[APP: ${appName}] Una app 'external-*' debe declarar audience: 'external' en app.config.ts.`
      );
    }
    if (!/layout:\s*['"](external-public|event-landing)['"]/.test(configContent)) {
      errors.push(
        `[APP: ${appName}] Una app 'external-*' debe usar layout 'external-public' o 'event-landing'.`
      );
    }
  }

  if (isInternal) {
    if (!/audience:\s*['"]internal['"]/.test(configContent)) {
      errors.push(
        `[APP: ${appName}] Una app 'internal-*' debe declarar audience: 'internal' en app.config.ts.`
      );
    }
    if (!/layout:\s*['"]internal-dashboard['"]/.test(configContent)) {
      errors.push(
        `[APP: ${appName}] Una app 'internal-*' debe usar obligatoriamente layout: 'internal-dashboard'.`
      );
    }
    if (!/required:\s*true/.test(configContent)) {
      errors.push(
        `[APP: ${appName}] Una app 'internal-*' debe declarar auth.required: true en app.config.ts.`
      );
    }
  }

  const layoutTsxPath = path.join(appPath, 'src', 'app', 'layout.tsx');
  if (!fs.existsSync(layoutTsxPath)) {
    errors.push(`[APP: ${appName}] Falta src/app/layout.tsx.`);
  } else {
    const layoutContent = fs.readFileSync(layoutTsxPath, 'utf8');
    if (!layoutContent.includes('@repo/layouts')) {
      errors.push(
        `[APP: ${appName}] src/app/layout.tsx debe delegar su estructura visual en un Shell de '@repo/layouts'.`
      );
    }
  }
}

if (errors.length > 0) {
  console.error('\n[ERROR] ERROR DE VALIDACION DE APLICACIONES (validate:apps):\n');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
} else {
  console.log(`[SUCCESS] [validate:apps] ${appDirs.length} aplicacion(es) verificada(s) correctamente.`);
}

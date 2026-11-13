#!/usr/bin/env node
/**
 * Validador de Contratos de Módulos (tooling/validators/validate-modules.mjs)
 *
 * Verifica que todo módulo en `modules/<app-id>/<module-id>` cumpla con `specs/MODULE_CONTRACT.md`:
 * 1. Que `<app-id>` exista realmente dentro de `apps/<app-id>`.
 * 2. Que cada módulo tenga su `module.config.ts` validado con `defineModule(...)`.
 * 3. Que no existan colisiones de `id` ni de `mount.path` entre módulos de una misma app.
 * 4. Que exista `modules/<app-id>/registry.ts` registrando los módulos activos.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const MODULES_DIR = path.join(ROOT, 'modules');
const APPS_DIR = path.join(ROOT, 'apps');

if (!fs.existsSync(MODULES_DIR)) {
  console.log('[INFO] [validate:modules] Directorio modules/ aun sin inicializar.');
  process.exit(0);
}

const appModuleScopes = fs
  .readdirSync(MODULES_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const errors = [];
let totalModulesCount = 0;

for (const targetAppId of appModuleScopes) {
  const targetAppPath = path.join(APPS_DIR, targetAppId);
  if (!fs.existsSync(targetAppPath)) {
    errors.push(
      `[MODULES: ${targetAppId}] El directorio modules/${targetAppId} apunta a una app inexistente en apps/${targetAppId}.`
    );
  }

  const scopeDir = path.join(MODULES_DIR, targetAppId);
  const registryPath = path.join(scopeDir, 'registry.ts');
  if (!fs.existsSync(registryPath)) {
    errors.push(
      `[MODULES: ${targetAppId}] Falta archivo de registro modules/${targetAppId}/registry.ts.`
    );
  }

  const moduleDirs = fs
    .readdirSync(scopeDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== 'node_modules')
    .map((d) => d.name);

  const seenPaths = new Set();

  for (const modName of moduleDirs) {
    totalModulesCount++;
    const modDir = path.join(scopeDir, modName);
    const modConfigPath = path.join(modDir, 'module.config.ts');

    if (!fs.existsSync(modConfigPath)) {
      errors.push(
        `[MODULE: ${targetAppId}/${modName}] Falta archivo obligatorio module.config.ts.`
      );
      continue;
    }

    const content = fs.readFileSync(modConfigPath, 'utf8');

    if (!content.includes('defineModule(')) {
      errors.push(
        `[MODULE: ${targetAppId}/${modName}] module.config.ts debe usar defineModule() de @repo/module-sdk.`
      );
    }

    if (!content.includes(`id: '${modName}'`) && !content.includes(`id: "${modName}"`)) {
      errors.push(
        `[MODULE: ${targetAppId}/${modName}] El campo 'id' en module.config.ts debe coincidir con el directorio '${modName}'.`
      );
    }

    if (
      !content.includes(`targetApp: '${targetAppId}'`) &&
      !content.includes(`targetApp: "${targetAppId}"`)
    ) {
      errors.push(
        `[MODULE: ${targetAppId}/${modName}] El campo 'targetApp' debe ser '${targetAppId}'.`
      );
    }

    const pathMatch = content.match(/path:\s*['"]([^'"]+)['"]/);
    if (pathMatch) {
      const mountPath = pathMatch[1];
      if (!mountPath.startsWith('/')) {
        errors.push(
          `[MODULE: ${targetAppId}/${modName}] mount.path ('${mountPath}') debe comenzar con '/'.`
        );
      }
      if (seenPaths.has(mountPath)) {
        errors.push(
          `[MODULE: ${targetAppId}/${modName}] Colisión de ruta detectada: '${mountPath}' ya está siendo usada por otro módulo en ${targetAppId}.`
        );
      }
      seenPaths.add(mountPath);
    }
  }
}

if (errors.length > 0) {
  console.error('\n[ERROR] ERROR DE VALIDACION DE MODULOS (validate:modules):\n');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
} else {
  console.log(
    `[SUCCESS] [validate:modules] ${totalModulesCount} modulo(s) en ${appModuleScopes.length} app(s) verificado(s) sin colisiones.`
  );
}

#!/usr/bin/env node
/**
 * Zero-Trust Guardrail Enforcer (tooling/validators/enforce-guardrails.mjs)
 *
 * Verifica en cada commit y CI que ningún humano o agente de IA viole:
 * 1. Colores crudos de Tailwind (bg-blue-500, text-slate-800, etc.)
 * 2. Valores arbitrarios de Tailwind (w-[300px], bg-[#123456])
 * 3. Estilos inline (style={{ ... }}) en apps/ o modules/
 * 4. Etiquetas HTML nativas prohibidas (<button>, <input>, <select>, <textarea>, <table>) en apps/ o modules/
 * 5. Etiquetas estructurales reservadas a @repo/layouts (<header>, <footer>, <aside>) en apps/ o modules/
 * 6. Imports cruzados entre módulos o entre aplicaciones
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TARGET_DIRS = ['apps', 'modules'];

const RAW_COLOR_REGEX =
  /\b(?:bg|text|border|ring|from|to|via)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950)\b/g;

const ARBITRARY_TAILWIND_REGEX =
  /\b(?:bg|text|border|w|h|min-w|min-h|max-w|max-h|p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|rounded|text|top|left|right|bottom|z)-\[[^\]]+\]/g;

const INLINE_STYLE_REGEX = /\bstyle=\{\{/g;

const FORBIDDEN_NATIVE_CONTROLS_REGEX =
  /<(button|input|select|textarea|table)(\s|>)/g;

const FORBIDDEN_LAYOUT_TAGS_REGEX = /<(header|footer|aside)(\s|>)/g;

function walkFiles(dirPath, collected = []) {
  if (!fs.existsSync(dirPath)) return collected;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (
      entry.name === 'node_modules' ||
      entry.name === '.next' ||
      entry.name === 'dist' ||
      entry.name === '.turbo'
    ) {
      continue;
    }
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, collected);
    } else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) {
      collected.push(fullPath);
    }
  }
  return collected;
}

const violations = [];

for (const dir of TARGET_DIRS) {
  const files = walkFiles(path.join(ROOT, dir));
  for (const file of files) {
    const relPath = path.relative(ROOT, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, index) => {
      const lineNum = index + 1;
      if (line.trim().startsWith('//') || line.trim().startsWith('*')) return;

      const rawColorMatches = line.match(RAW_COLOR_REGEX);
      if (rawColorMatches) {
        violations.push(
          `[DISEÑO] ${relPath}:${lineNum} -> Color crudo prohibido (${rawColorMatches.join(', ')}). Usa tokens semánticos de @repo/ui (ej. bg-surface, text-foreground, bg-primary, status-success).`
        );
      }

      const arbitraryMatches = line.match(ARBITRARY_TAILWIND_REGEX);
      if (arbitraryMatches) {
        violations.push(
          `[DISEÑO] ${relPath}:${lineNum} -> Valor arbitrario prohibido (${arbitraryMatches.join(', ')}). Usa la escala estándar del Design System.`
        );
      }

      if (INLINE_STYLE_REGEX.test(line)) {
        violations.push(
          `[DISEÑO] ${relPath}:${lineNum} -> Prop 'style={{...}}' prohibida en apps/ y modules/. Usa clases semánticas de @repo/ui.`
        );
      }

      const controlMatch = line.match(FORBIDDEN_NATIVE_CONTROLS_REGEX);
      if (controlMatch) {
        violations.push(
          `[COMPONENTES] ${relPath}:${lineNum} -> Etiqueta HTML nativa prohibida (${controlMatch[0].trim()}). Importa Button, Input, Select, Textarea o DataTable desde "@repo/ui".`
        );
      }

      const layoutMatch = line.match(FORBIDDEN_LAYOUT_TAGS_REGEX);
      if (layoutMatch) {
        violations.push(
          `[LAYOUT] ${relPath}:${lineNum} -> Etiqueta estructural prohibida (${layoutMatch[0].trim()}). Los Headers, Sidebars y Footers pertenecen exclusivamente a "@repo/layouts".`
        );
      }

      // Reglas de aislamiento de imports para módulos
      if (relPath.startsWith('modules/')) {
        const parts = relPath.split('/');
        // modules/<app-id>/<module-id>/...
        const currentAppId = parts[1];
        const currentModuleId = parts[2];

        const importMatch = line.match(/from\s+['"]([^'"]+)['"]/);
        if (importMatch && currentModuleId && currentModuleId !== 'registry.ts') {
          const importedPkg = importMatch[1];

          if (importedPkg.startsWith('@apps/') || importedPkg.includes('/apps/')) {
            violations.push(
              `[ARQUITECTURA] ${relPath}:${lineNum} -> Un módulo NO puede importar desde una aplicación (${importedPkg}).`
            );
          }

          if (importedPkg.startsWith('@modules/')) {
            const expectedSelfPrefix = `@modules/${currentAppId}--${currentModuleId}`;
            if (!importedPkg.startsWith(expectedSelfPrefix)) {
              violations.push(
                `[ARQUITECTURA] ${relPath}:${lineNum} -> Import cruzado entre módulos prohibido (${importedPkg}). Cada módulo en modules/${currentAppId}/${currentModuleId} debe ser 100% independiente.`
              );
            }
          }

          if (importedPkg.startsWith('../../') && !relPath.endsWith('registry.ts')) {
            // Verificar si sale de la carpeta del módulo
            const resolved = path
              .resolve(path.dirname(file), importedPkg)
              .replace(/\\/g, '/');
            const moduleRoot = path
              .join(ROOT, 'modules', currentAppId, currentModuleId)
              .replace(/\\/g, '/');
            if (!resolved.startsWith(moduleRoot)) {
              violations.push(
                `[ARQUITECTURA] ${relPath}:${lineNum} -> Import relativo fuera de los límites del módulo (${importedPkg}).`
              );
            }
          }
        }
      }
    });
  }
}

if (violations.length > 0) {
  console.error('\n[ERROR] VIOLACION DE GUARDRAILS ZERO-TRUST DETECTADA:\n');
  for (const v of violations) {
    console.error(`  - ${v}`);
  }
  console.error(
    `\nTotal de violaciones: ${violations.length}. Consulta AGENTS.md y specs/DESIGN_SYSTEM.md.\n`
  );
  process.exit(1);
} else {
  console.log('[SUCCESS] [validate:guardrails] 0 violaciones de diseno, componentes o fronteras arquitectonicas.');
}

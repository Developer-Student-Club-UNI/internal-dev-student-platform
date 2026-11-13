#!/usr/bin/env node
// Validador Estático de Seguridad OWASP Top 10 & OWASP AI (tooling/validators/validate-security.mjs)
//
// Bloquea cualquier commit o build si detecta:
// 1. Uso de puertos prohibidos 3000 o 3001 en apps/<app> (Política de Puertos 4310+).
// 2. Ausencia de getSecurityHeaders() o poweredByHeader: false en apps/<app>/next.config.mjs.
// 3. Vectores XSS / Ejecución de Código: dangerouslySetInnerHTML, .innerHTML, document.write, eval(), new Function().
// 4. Vectores SQLi / NoSQLi: concatenación SQL en template strings o $queryRawUnsafe / $executeRawUnsafe.
// 5. Vectores Path Traversal / Excessive Agency (OWASP AI LLM08): import de fs, child_process, net en apps/ o modules/.
// 6. Inseguridad de Cookies y Almacenamiento (OWASP A02/A07): document.cookie o localStorage/sessionStorage para sesiones.
// 7. Secretos Hardcodeados (OWASP A02 & LLM06): claves sk-proj-..., ghp_..., AIza..., PRIVATE KEY.
// 8. Exfiltración de Datos / SSRF (OWASP A10): fetch() directo hacia URLs externas hardcodeadas en modules/<app>.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const errors = [];

function walkCodeFiles(dirPath, collected = []) {
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
      walkCodeFiles(fullPath, collected);
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) {
      collected.push(fullPath);
    }
  }
  return collected;
}

// ---------------------------------------------------------------------------
// 1. VERIFICACIÓN DE PUERTOS (PROHIBIDO 3000 / 3001) Y SECURITY HEADERS EN APPS
// ---------------------------------------------------------------------------
const appsDir = path.join(ROOT, 'apps');
if (fs.existsSync(appsDir)) {
  const appNames = fs
    .readdirSync(appsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  for (const appName of appNames) {
    const pkgPath = path.join(appsDir, appName, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkgRaw = fs.readFileSync(pkgPath, 'utf8');
      if (/--port\s+(3000|3001)\b|-p\s+(3000|3001)\b/.test(pkgRaw)) {
        errors.push(
          `[PUERTOS] apps/${appName}/package.json -> Uso prohibido de puerto 3000 o 3001. Usa el rango dedicado 4310+ (specs/SECURITY.md).`
        );
      }
    }

    const nextConfigPath = path.join(appsDir, appName, 'next.config.mjs');
    if (fs.existsSync(nextConfigPath)) {
      const nextConfigRaw = fs.readFileSync(nextConfigPath, 'utf8');
      if (!nextConfigRaw.includes('getSecurityHeaders')) {
        errors.push(
          `[OWASP A05: Security Headers] apps/${appName}/next.config.mjs -> Debe inyectar getSecurityHeaders() desde '@repo/security/headers'.`
        );
      }
      if (!nextConfigRaw.includes('poweredByHeader: false')) {
        errors.push(
          `[OWASP A05: Fingerprinting] apps/${appName}/next.config.mjs -> Debe declarar 'poweredByHeader: false'.`
        );
      }
      if (!nextConfigRaw.includes('removeConsole')) {
        errors.push(
          `[OWASP A09: Log Sanitization] apps/${appName}/next.config.mjs -> Debe configurar 'compiler.removeConsole' para eliminar logs en produccion.`
        );
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 2. ESCANEO ESTÁTICO DE CÓDIGO EN APPS, MODULES Y PACKAGES
// ---------------------------------------------------------------------------
const scanDirs = ['apps', 'modules', 'packages'];

const XSS_SINK_REGEX =
  /\b(?:dangerouslySetInnerHTML|document\.write\s*\(|eval\s*\(|new\s+Function\s*\()|\.innerHTML\s*=|\.outerHTML\s*=/;

const RAW_SQL_INTERPOLATION_REGEX =
  /`[^`]*\b(?:SELECT\s+.+\s+FROM|INSERT\s+INTO|UPDATE\s+.+\s+SET|DELETE\s+FROM)\b[^`]*\$\{/i;

const UNSAFE_ORM_RAW_REGEX = /\$(?:queryRawUnsafe|executeRawUnsafe)\b/;

const FORBIDDEN_NODE_MODULES_IN_UI_REGEX =
  /from\s+['"](?:node:)?(?:fs|child_process|net|dgram|tls|cluster|worker_threads)['"]/;

const INSECURE_COOKIE_STORAGE_REGEX =
  /\b(?:document\.cookie\s*=|localStorage\.(?:setItem|getItem)\s*\(|sessionStorage\.(?:setItem|getItem)\s*\()/;

const HARDCODED_SECRET_REGEX =
  /\b(?:sk-proj-[A-Za-z0-9_-]{20,}|ghp_[A-Za-z0-9]{25,}|AIzaSy[A-Za-z0-9_-]{25,}|-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----)/;

const DIRECT_EXTERNAL_FETCH_IN_MODULE_REGEX =
  /\bfetch\s*\(\s*['"`]https?:\/\//i;

const UNSAFE_CONSOLE_LOG_REGEX =
  /\bconsole\.(?:log|info|debug)\s*\([^)]*(?:password|token|secret|credential|auth|apiKey|jwt|cookie)[^)]*\)/i;

for (const dir of scanDirs) {
  const files = walkCodeFiles(path.join(ROOT, dir));
  for (const file of files) {
    const relPath = path.relative(ROOT, file).replace(/\\/g, '/');

    // Excluir las definiciones de patrones del propio motor @repo/security
    const isSecurityEngine = relPath.startsWith('packages/security/');
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*')) return;

      if (!isSecurityEngine && XSS_SINK_REGEX.test(line)) {
        errors.push(
          `[OWASP A03: XSS / Code Execution] ${relPath}:${lineNum} -> Uso prohibido de sink inseguro (${trimmed}).`
        );
      }

      if (!isSecurityEngine && (RAW_SQL_INTERPOLATION_REGEX.test(line) || UNSAFE_ORM_RAW_REGEX.test(line))) {
        errors.push(
          `[OWASP A03: SQL Injection] ${relPath}:${lineNum} -> Concatenación SQL cruda o consulta insegura detectada.`
        );
      }

      if (
        (relPath.startsWith('apps/') || relPath.startsWith('modules/')) &&
        FORBIDDEN_NODE_MODULES_IN_UI_REGEX.test(line)
      ) {
        errors.push(
          `[OWASP A01 / AI LLM08: Path Traversal & OS Access] ${relPath}:${lineNum} -> Prohibido importar módulos de sistema (${trimmed}) en apps/ o modules/.`
        );
      }

      if (!isSecurityEngine && INSECURE_COOKIE_STORAGE_REGEX.test(line)) {
        errors.push(
          `[OWASP A02/A07: Cookie & Session Security] ${relPath}:${lineNum} -> Prohibido acceder a document.cookie o almacenar estado en localStorage/sessionStorage.`
        );
      }

      if (!isSecurityEngine && HARDCODED_SECRET_REGEX.test(line)) {
        errors.push(
          `[OWASP A02 / AI LLM06: Hardcoded Secret] ${relPath}:${lineNum} -> Secreto o clave privada hardcodeada detectada.`
        );
      }

      if (
        relPath.startsWith('modules/') &&
        DIRECT_EXTERNAL_FETCH_IN_MODULE_REGEX.test(line)
      ) {
        errors.push(
          `[OWASP A10: Data Exfiltration / SSRF] ${relPath}:${lineNum} -> Prohibido realizar llamadas fetch() directas hacia dominios externos desde un módulo.`
        );
      }

      if (
        (relPath.startsWith('apps/') || relPath.startsWith('modules/')) &&
        UNSAFE_CONSOLE_LOG_REGEX.test(line)
      ) {
        errors.push(
          `[OWASP A09: Sensitive Log Exposure] ${relPath}:${lineNum} -> Registro de credenciales/tokens en consola sin sanitizar. Usa safeLogger de @repo/security.`
        );
      }
    });
  }
}

if (errors.length > 0) {
  console.error(
    '\n[ERROR] VIOLACION DE SEGURIDAD OWASP TOP 10 / OWASP AI DETECTADA (validate:security):\n'
  );
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  console.error(
    `\nTotal de vulnerabilidades bloqueadas: ${errors.length}. Consulta specs/SECURITY.md.\n`
  );
  process.exit(1);
} else {
  console.log(
    '[SUCCESS] [validate:security] Auditoria OWASP Top 10 Web + OWASP AI + Politica de Puertos (4310+) superada sin vulnerabilidades.'
  );
}

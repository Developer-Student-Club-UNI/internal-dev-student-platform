# Especificación de Seguridad Zero-Trust: OWASP Top 10 & OWASP AI (`specs/SECURITY.md`)

> **MANDATO DE SEGURIDAD OBLIGATORIO:**
> Toda aplicación (`apps/*`), módulo (`modules/*/*`) y paquete (`packages/*`) dentro de este IDP está sujeto a validación estática (`pnpm validate:security`) y protecciones en tiempo de ejecución (`@repo/security`). Cualquier código generado por humanos o agentes de IA que infrinja estas políticas será bloqueado en pre-commit y CI/CD.

---

## 1. Política de Puertos de Red Locales (No-3000/3001 Policy)

- **PROHIBIDO** utilizar los puertos `3000` o `3001` en cualquier aplicación del monorepo (para evitar colisiones locales, secuestro de sesión en localhost o confusión de origen entre servicios).
- El rango oficial reservado para aplicaciones del IDP es **`4310` – `4990`** en saltos de 10:
  - `apps/external-community-web`: Puerto `4310`
  - `apps/internal-board-portal`: Puerto `4320`
  - Nuevas aplicaciones generadas con `pnpm create:app`: Auto-asignadas a partir de `4330+`.

---

## 2. Matriz de Mitigación OWASP Top 10 (Web Security)

| Categoría OWASP | Vector de Ataque | Mitigación Obligatoria en el IDP (`@repo/security` + `@repo/auth`) |
| :--- | :--- | :--- |
| **A01: Broken Access Control** | Escalada de privilegios, acceso a rutas internas, Path Traversal (`../`). | 1. `<RoleGuard>` obligatorio en apps internas y módulos con roles.<br>2. Simulador RBAC (`RbacRoleSwitcher`) **estrictamente deshabilitado en producción** (`NODE_ENV === 'production'`).<br>3. `sanitizeRoutePath()` bloquea secuencias `..`, `%2e%2e`, `%2f`, `\` y null bytes en `[[...modulePath]]`. |
| **A02: Cryptographic Failures** | Exposición de secretos, cookies sin cifrar, tokens en `localStorage`. | 1. **PROHIBIDO** guardar tokens JWT, sesiones reales o credenciales en `localStorage` o `sessionStorage`.<br>2. Cookies de sesión con prefijo `__Host-`, `HttpOnly: true`, `Secure: true`, `SameSite: 'strict'`.<br>3. Bloqueo estático de secretos hardcodeados (`sk-`, `ghp_`, `eyJ`, `PRIVATE_KEY`). |
| **A03: Injection (SQLi, NoSQLi, XSS, Command)** | Inyección SQL/NoSQL en filtros/formularios, XSS vía DOM, ejecución de comandos. | 1. **XSS:** Prohibido `dangerouslySetInnerHTML`, `.innerHTML`, `document.write`, `eval()`, `new Function()`, y URLs `javascript:` / `data:`.<br>2. **SQLi/NoSQLi:** Toda entrada de usuario debe pasar por `sanitizeInput()` / `assertNoInjection()` de `@repo/security` que rechaza payloads SQL (`UNION SELECT`, `' OR 1=1`, `; DROP`, `--`) y operadores NoSQL (`$where`, `$ne`, `$gt`, `__proto__`).<br>3. Prohibido importar `child_process` o `fs` en `apps/` y `modules/`. |
| **A04: Insecure Design** | Módulos que tumban la app principal o acceden a datos de otros módulos. | Aislamiento estricto por fronteras (`enforce-guardrails.mjs`) + jaula `<ModuleErrorBoundary>` con sanitización de mensajes de error. |
| **A05: Security Misconfiguration** | Ausencia de cabeceras de seguridad HTTP (CSP, HSTS, X-Frame-Options). | Toda app en `apps/*` inyecta obligatoriamente `getSecurityHeaders()` desde `@repo/security` en `next.config.mjs` (`Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`). |
| **A07: Identification & Auth Failures** | Fijación de sesión, falta de expiración, CSRF en mutaciones. | Validación de origen (`assertSameOrigin`), tokens anti-CSRF (`verifyCsrfToken`) y sesiones de corta duración con rotación. |
| **A08: Software & Data Integrity** | Modificación no autorizada de contratos o payloads sin esquema. | Validación estricta con esquemas Zod en `defineApp()`, `defineModule()` y entradas de formularios. |
| **A09: Security Logging & Monitoring** | Fuga de PII, secretos en logs de consola, Log Injection (CRLF). | 1. `compiler.removeConsole` obligatorio en `next.config.mjs` de todas las apps para eliminar logs en producción.<br>2. `safeLogger` y `installGlobalLogSanitizer()` en `@repo/security` neutralizan CRLF (`\r\n`), truncan mensajes excesivos y enmascaran automáticamente emails, JWTs, Bearer tokens y credenciales.<br>3. Prohibido registrar tokens o passwords en `console.log()`. |
| **A10: SSRF & Data Exfiltration** | Peticiones a metadatos cloud (`169.254.169.254`), redes internas o dominios de exfiltración. | `assertSafeExternalUrl()` bloquea IPs privadas (RFC1918, `localhost`, `127.0.0.1`, `169.254.169.254`) y exige lista blanca de dominios permitidos (`ALLOWED_EGRESS_DOMAINS`). |

---

## 3. Matriz de Mitigación OWASP Top 10 for LLM & AI Applications

Dado que este IDP es operado y extendido tanto por desarrolladores humanos como por **Agentes de IA (OpenCode, Claude Code, Codex, Cursor)** y puede alojar módulos con capacidades de IA:

1. **LLM01: Prompt Injection (Directa e Indirecta):**
   - Toda entrada de usuario o contenido externo que pueda ser procesado por un flujo de IA o renderizado dinámico debe pasar por `detectPromptInjection()` y `sanitizeAiPromptInput()` de `@repo/security`, bloqueando instrucciones de anulación de sistema (`Ignore previous instructions`, `System prompt override`, delimitadores de inyección `<|im_start|>`, etc.).
2. **LLM02: Insecure Output Handling:**
   - Cualquier salida generada por IA o datos externos se trata como **texto plano no confiable**; jamás se pasa a `dangerouslySetInnerHTML`, `eval()` ni redirecciones abiertas.
3. **LLM06: Sensitive Information Disclosure:**
   - Ningún módulo puede leer variables de entorno de servidor privadas desde componentes de cliente ni exponer secretos en props serializadas. `redactSensitiveData()` limpia cualquier traza de credenciales.
4. **LLM07 / LLM08: Insecure Plugin Design & Excessive Agency:**
   - Los agentes de IA que construyen módulos están confinados a `modules/<app-id>/<module-id>` y **no tienen permiso** para usar APIs de sistema de archivos (`fs`), procesos (`child_process`), red arbitraria ni saltar `<RoleGuard>`.

---

## 4. Uso Obligatorio de `@repo/security` en Módulos y Formularios

Todo formulario o entrada de búsqueda en `modules/*` debe validar y sanitizar sus entradas con `@repo/security`:

```ts
import { validateSafeInput, sanitizeText } from '@repo/security';

const check = validateSafeInput(userInput);
if (!check.safe) {
  // Bloquear envío y mostrar alerta de seguridad con @repo/ui
}
const cleanValue = sanitizeText(userInput);
```

---

## 5. Política de Sanitización de Logs en Producción (OWASP A09 & LLM06)

Para prevenir la exfiltración involuntaria de datos sensibles a través de la consola del navegador o los logs del servidor:

1. **Eliminación en Compilación (`removeConsole`):**
   - En todas las aplicaciones (`apps/*`), `next.config.mjs` debe configurar `compiler: { removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false }`.
   - Las llamadas a `console.log`, `console.info`, `console.debug` y `console.warn` se remueven automáticamente del bundle productivo.
2. **Logger Seguro de Plataforma (`safeLogger`):**
   - Cualquier registro intencional debe realizarse mediante `safeLogger` o `createSafeLogger('CONTEXTO')` importado desde `@repo/security`.
   - Sanitiza automáticamente cada argumento: neutraliza saltos de línea CRLF (evitando Log Injection), enmascara direcciones de correo electrónico, JWTs, Bearer tokens y claves API, y trunca payloads mayores a 2000 caracteres para evitar Log Flooding (DoS).
3. **Interceptor Global en Producción:**
   - `<AppShell>` ejecuta `installGlobalLogSanitizer()` al inicializarse, envolviendo `console.error` y `console.warn` para filtrar y sanitizar cualquier excepción o advertencia residual de librerías de terceros.

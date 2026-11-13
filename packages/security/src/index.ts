import { z } from 'zod';

export type ThreatCategory =
  | 'XSS'
  | 'SQLI'
  | 'NOSQLI'
  | 'PATH_TRAVERSAL'
  | 'PROMPT_INJECTION'
  | 'SSRF_EXFILTRATION';

export interface SecurityValidationResult {
  safe: boolean;
  sanitized: string;
  threatType?: ThreatCategory;
  reason?: string;
}

// ---------------------------------------------------------------------------
// 1. PATRONES DE DETECCIÓN OWASP TOP 10 WEB & OWASP AI TOP 10
// ---------------------------------------------------------------------------

const XSS_PATTERNS: RegExp[] = [
  /<\s*\/?\s*(?:script|iframe|object|embed|applet|meta|link|style|svg|math|base|form)\b/i,
  /\bon[a-z]+\s*=/i, // onerror=, onload=, onclick=...
  /(?:javascript|vbscript|data)\s*:/i,
  /expression\s*\(/i,
  /srcdoc\s*=/i,
];

const SQLI_PATTERNS: RegExp[] = [
  /\b(?:UNION\s+(?:ALL\s+)?SELECT|SELECT\s+.+\s+FROM|INSERT\s+INTO|UPDATE\s+.+\s+SET|DELETE\s+FROM|DROP\s+(?:TABLE|DATABASE)|ALTER\s+TABLE|TRUNCATE\s+TABLE|EXEC(?:UTE)?\s+)/i,
  /(?:'|")\s*(?:OR|AND)\s*(?:'[^']*'|"\d+"|\d+)\s*=\s*(?:'[^']*'|"\d+"|\d+)/i, // ' OR '1'='1
  /;\s*(?:--|\/\*|\bDROP\b|\bSELECT\b|\bINSERT\b|\bDELETE\b)/i,
  /\b(?:SLEEP|BENCHMARK|WAITFOR\s+DELAY|PG_SLEEP)\s*\(/i,
];

const NOSQLI_PATTERNS: RegExp[] = [
  /\$(?:where|ne|gt|gte|lt|lte|in|nin|regex|expr|function|accumulator)\b/i,
  /__proto__|constructor\s*\[|prototype\s*\[/i,
];

const PATH_TRAVERSAL_PATTERNS: RegExp[] = [
  /(?:^|[\\/])\.\.(?:[\\/]|$)/,
  /%2e%2e/i,
  /%252e%252e/i,
  /%2f|%5c/i,
  /\0/, // Null byte injection
  /\\/, // Backslash traversal in web routes
];

const PROMPT_INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(?:all\s+)?(?:previous|prior|above)\s+(?:instructions|prompts|rules)/i,
  /(?:system\s+prompt|developer\s+message|hidden\s+instructions)\s*(?:override|reveal|leak|dump)/i,
  /<\|(?:im_start|im_end|system|endoftext)\|>/i,
  /\[\s*INST\s*\]|\[\s*\/INST\s*\]|<<SYS>>|<\/SYS>>/i,
  /\b(?:jailbreak|do\s+anything\s+now|DAN\s+mode)\b/i,
];

// ---------------------------------------------------------------------------
// 2. DETECTORES Y SANITIZADORES DE ENTRADA
// ---------------------------------------------------------------------------

export function detectXss(input: string): boolean {
  return XSS_PATTERNS.some((rx) => rx.test(input));
}

export function detectSqlInjection(input: string): boolean {
  return SQLI_PATTERNS.some((rx) => rx.test(input));
}

export function detectNoSqlInjection(input: string): boolean {
  return NOSQLI_PATTERNS.some((rx) => rx.test(input));
}

export function detectPathTraversal(input: string): boolean {
  return PATH_TRAVERSAL_PATTERNS.some((rx) => rx.test(input));
}

export function detectPromptInjection(input: string): boolean {
  return PROMPT_INJECTION_PATTERNS.some((rx) => rx.test(input));
}

/**
 * Escapa caracteres especiales HTML para neutralizar cualquier vector XSS reflejado o almacenado.
 */
export function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Limpia texto de entrada eliminando etiquetas de control, caracteres nulos y exceso de espacios.
 */
export function sanitizeText(raw: string, maxLength = 1000): string {
  return raw
    .replace(/\0/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, maxLength);
}

/**
 * Validador integral Zero-Trust para cualquier input de formulario, búsqueda o parámetro.
 * Verifica simultáneamente XSS, SQLi, NoSQLi, Path Traversal y Prompt Injection (OWASP AI).
 */
export function validateSafeInput(
  raw: string,
  maxLength = 1000
): SecurityValidationResult {
  const sanitized = sanitizeText(raw, maxLength);

  if (detectXss(raw)) {
    return {
      safe: false,
      sanitized: escapeHtml(sanitized),
      threatType: 'XSS',
      reason:
        'Se detectó un patrón potencial de Cross-Site Scripting (XSS) o inyección HTML/JS.',
    };
  }

  if (detectSqlInjection(raw)) {
    return {
      safe: false,
      sanitized: escapeHtml(sanitized),
      threatType: 'SQLI',
      reason:
        'Se detectó una estructura sospechosa de inyección SQL (SQLi).',
    };
  }

  if (detectNoSqlInjection(raw)) {
    return {
      safe: false,
      sanitized: escapeHtml(sanitized),
      threatType: 'NOSQLI',
      reason:
        'Se detectó un operador de inyección NoSQL o contaminación de prototipo.',
    };
  }

  if (detectPathTraversal(raw)) {
    return {
      safe: false,
      sanitized: escapeHtml(sanitized),
      threatType: 'PATH_TRAVERSAL',
      reason:
        'Se detectó una secuencia de salto de directorio (Path Traversal).',
    };
  }

  if (detectPromptInjection(raw)) {
    return {
      safe: false,
      sanitized: escapeHtml(sanitized),
      threatType: 'PROMPT_INJECTION',
      reason:
        'Se detectó un intento de manipulación de instrucciones (OWASP AI LLM01 Prompt Injection).',
    };
  }

  return {
    safe: true,
    sanitized,
  };
}

/**
 * Schema Zod reutilizable con validación OWASP integrada para formularios.
 */
export const SafeStringSchema = z
  .string()
  .max(1000)
  .superRefine((val, ctx) => {
    const res = validateSafeInput(val);
    if (!res.safe) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: res.reason ?? 'Entrada rechazada por el firewall de seguridad.',
      });
    }
  });

// ---------------------------------------------------------------------------
// 3. PROTECCIÓN CONTRA PATH TRAVERSAL EN ENRUTAMIENTO DINÁMICO
// ---------------------------------------------------------------------------

/**
 * Normaliza y valida rutas de módulos dinámicos (`[[...modulePath]]`).
 * Lanza o devuelve null si detecta Path Traversal (`..`, `%2e`, `\`, etc.)
 */
export function sanitizeRoutePath(rawPathname: string): {
  safe: boolean;
  normalizedPath: string;
  reason?: string;
} {
  if (!rawPathname || typeof rawPathname !== 'string') {
    return { safe: false, normalizedPath: '/', reason: 'Ruta vacía o inválida.' };
  }

  let decoded = rawPathname;
  try {
    decoded = decodeURIComponent(rawPathname);
  } catch {
    return {
      safe: false,
      normalizedPath: '/',
      reason: 'Codificación URL malformada en la ruta.',
    };
  }

  if (detectPathTraversal(rawPathname) || detectPathTraversal(decoded)) {
    return {
      safe: false,
      normalizedPath: '/',
      reason: 'Intento de Path Traversal bloqueado por @repo/security.',
    };
  }

  const normalized = ('/' + decoded.replace(/^\/+/, '').replace(/\/+$/, ''))
    .replace(/\/+/g, '/');

  if (!/^\/[a-z0-9-/]*$/.test(normalized)) {
    return {
      safe: false,
      normalizedPath: '/',
      reason:
        'La ruta contiene caracteres fuera del estándar kebab-case permitido.',
    };
  }

  return {
    safe: true,
    normalizedPath: normalized,
  };
}

// ---------------------------------------------------------------------------
// 4. PROTECCIÓN DE URLS, ANTI-EXFILTRACIÓN & SSRF (OWASP A10)
// ---------------------------------------------------------------------------

const PRIVATE_IP_OR_METADATA_REGEX =
  /^(?:localhost|127\.\d+\.\d+\.\d+|0\.0\.0\.0|10\.\d+\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[0-1])\.\d+\.\d+|192\.168\.\d+\.\d+|169\.254\.\d+\.\d+|\[::1\])/i;

export function sanitizeUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (
    trimmed.startsWith('/') &&
    !trimmed.startsWith('//') &&
    !detectPathTraversal(trimmed)
  ) {
    return trimmed;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return '#blocked-unsafe-protocol';
    }
    return parsed.toString();
  } catch {
    return '#invalid-url';
  }
}

export function isSafeEgressUrl(
  targetUrl: string,
  allowedDomains: readonly string[] = []
): boolean {
  try {
    const parsed = new URL(targetUrl);
    if (parsed.protocol !== 'https:') {
      return false;
    }
    if (PRIVATE_IP_OR_METADATA_REGEX.test(parsed.hostname)) {
      return false;
    }
    if (allowedDomains.length > 0) {
      return allowedDomains.some(
        (domain) =>
          parsed.hostname === domain || parsed.hostname.endsWith(`.${domain}`)
      );
    }
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// 5. HARDENING DE COOKIES Y PROTECCIÓN CSRF (OWASP A02 & A07)
// ---------------------------------------------------------------------------

export interface SecureCookieConfig {
  name: string;
  httpOnly: true;
  secure: boolean;
  sameSite: 'strict' | 'lax';
  path: '/';
  maxAge: number;
}

export function getSecureCookieConfig(
  baseName = 'idp_session',
  isProduction = process.env.NODE_ENV === 'production'
): SecureCookieConfig {
  return {
    name: isProduction ? `__Host-${baseName}` : baseName,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 4, // 4 horas máximo de vida de sesión sin rotación
  };
}

/**
 * Genera un token anti-CSRF determinista por sesión/formulario para validar mutaciones.
 */
export function generateCsrfToken(sessionSeed: string): string {
  let hash = 2166136261;
  const payload = `idp-csrf-v1:${sessionSeed}`;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `csrf_${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function verifyCsrfToken(
  providedToken: string,
  sessionSeed: string
): boolean {
  if (!providedToken || !sessionSeed) return false;
  const expected = generateCsrfToken(sessionSeed);
  if (providedToken.length !== expected.length) return false;
  // Comparación en tiempo constante para evitar timing attacks
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= providedToken.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

// ---------------------------------------------------------------------------
// 6. REDACCIÓN DE DATOS SENSIBLES Y TOKENS (OWASP A09 & OWASP AI LLM06)
// ---------------------------------------------------------------------------

/**
 * Enmascara JWTs, API Keys, Bearer tokens y secretos antes de mostrar errores en UI o logs.
 */
export function redactSensitiveData(text: string): string {
  return text
    .replace(
      /\bBearer\s+[A-Za-z0-9\-._~+/]+=*/gi,
      'Bearer [REDACTED_TOKEN]'
    )
    .replace(
      /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g,
      '[REDACTED_JWT]'
    )
    .replace(
      /\b(?:sk|pk|ghp|gho|AIza|xoxb|xoxp)-[A-Za-z0-9_\-]{12,}\b/g,
      '[REDACTED_API_KEY]'
    )
    .replace(
      /(?:password|secret|token|api_key|apikey)\s*[:=]\s*['"]?[^\s'"]+['"]?/gi,
      '[REDACTED_CREDENTIAL]'
    );
}

// ---------------------------------------------------------------------------
// 7. SANITIZACION DE LOGS Y LOGGER SEGURO (OWASP A09 & OWASP AI LLM06)
// ---------------------------------------------------------------------------

export {
  sanitizeLogArgument,
  createSafeLogger,
  safeLogger,
  installGlobalLogSanitizer,
  type SafeLogger,
  type LogLevel,
} from './logger';

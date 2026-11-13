import { redactSensitiveData } from './index';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const SENSITIVE_KEY_REGEX =
  /^(?:password|secret|token|api_?key|auth(?:orization)?|cookie|credential|refresh_?token|jwt|access_?token|private_?key|cvv|credit_?card)$/i;

const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

/**
 * Sanitiza cualquier valor antes de registrarlo en logs (OWASP A09 & OWASP AI LLM06).
 * 1. Neutraliza Log Injection / CRLF (`\r`, `\n`).
 * 2. Enmascara tokens, JWTs, Bearer auth, API keys y contrasenas.
 * 3. Enmascara PII (correos electronicos).
 * 4. Trunca mensajes excesivos para prevenir ataques de Log Flooding (DoS).
 */
export function sanitizeLogArgument(arg: unknown, depth = 0): unknown {
  if (depth > 5) return '[MAX_DEPTH_REACHED]';

  if (typeof arg === 'string') {
    let clean = arg
      .replace(/[\r\n]+/g, ' ') // Neutralizar CRLF Log Injection
      .slice(0, 2000); // Prevenir DoS por log flooding

    clean = redactSensitiveData(clean);
    clean = clean.replace(EMAIL_REGEX, '[REDACTED_EMAIL]');
    return clean;
  }

  if (typeof arg === 'number' || typeof arg === 'boolean' || arg == null) {
    return arg;
  }

  if (arg instanceof Error) {
    const safeError = new Error(
      sanitizeLogArgument(arg.message, depth + 1) as string
    );
    safeError.name = arg.name;
    if (arg.stack) {
      safeError.stack = redactSensitiveData(
        arg.stack.replace(/\r\n/g, '\n')
      ).replace(EMAIL_REGEX, '[REDACTED_EMAIL]');
    }
    return safeError;
  }

  if (Array.isArray(arg)) {
    return arg.map((item) => sanitizeLogArgument(item, depth + 1));
  }

  if (typeof arg === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(arg)) {
      if (SENSITIVE_KEY_REGEX.test(key)) {
        result[key] = '[REDACTED_CONFIDENTIAL]';
      } else {
        result[key] = sanitizeLogArgument(value, depth + 1);
      }
    }
    return result;
  }

  return String(arg).slice(0, 500);
}

export interface SafeLogger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

/**
 * Fabrica un logger seguro para produccion y desarrollo.
 * En produccion, silencia logs de debug/info y sanitiza errores/advertencias.
 */
export function createSafeLogger(context = 'IDP'): SafeLogger {
  const isProduction =
    typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';
  const allowVerbose =
    typeof process !== 'undefined' &&
    process.env?.IDP_VERBOSE_LOGS === 'true';

  const prefix = `[${context}]`;

  return {
    debug: (...args: unknown[]) => {
      if (isProduction && !allowVerbose) return;
      const clean = args.map((a) => sanitizeLogArgument(a));
      // eslint-disable-next-line no-console
      console.debug(prefix, ...clean);
    },
    info: (...args: unknown[]) => {
      if (isProduction && !allowVerbose) return;
      const clean = args.map((a) => sanitizeLogArgument(a));
      // eslint-disable-next-line no-console
      console.info(prefix, ...clean);
    },
    warn: (...args: unknown[]) => {
      const clean = args.map((a) => sanitizeLogArgument(a));
      // eslint-disable-next-line no-console
      console.warn(prefix, ...clean);
    },
    error: (...args: unknown[]) => {
      const clean = args.map((a) => sanitizeLogArgument(a));
      // eslint-disable-next-line no-console
      console.error(prefix, ...clean);
    },
  };
}

export const safeLogger = createSafeLogger('IDP_CORE');

/**
 * Instala un envoltorio de sanitizacion sobre console.error y console.warn en produccion.
 * Garantiza que cualquier log inesperado de librerias pase por el filtro de redaccion.
 */
export function installGlobalLogSanitizer(): void {
  if (typeof process === 'undefined' || process.env?.NODE_ENV !== 'production') {
    return;
  }

  const originalError = console.error;
  const originalWarn = console.warn;

  console.error = (...args: unknown[]) => {
    const sanitized = args.map((a) => sanitizeLogArgument(a));
    originalError.apply(console, sanitized);
  };

  console.warn = (...args: unknown[]) => {
    const sanitized = args.map((a) => sanitizeLogArgument(a));
    originalWarn.apply(console, sanitized);
  };
}

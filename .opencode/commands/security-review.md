---
description: Audita en solo lectura el Target Spec activo contra specs/SECURITY.md (OWASP Top 10 Web + OWASP AI Top 10)
agent: security-reviewer
---

**Contexto adicional del usuario:** `$ARGUMENTS`

1. Lee `specs/ACTIVE_SESSION.md`, el `SPEC.md` activo y los archivos del modulo/app correspondiente.
2. Audita contra `specs/SECURITY.md` (XSS, SQLi/NoSQLi, Path Traversal, Prompt Injection, CSRF, RBAC `can()`, sanitizacion de logs y cero emojis).
3. Reporta hallazgos con severidad (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INFO`).

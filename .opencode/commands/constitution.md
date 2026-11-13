---
description: Crea o actualiza la constitucion del proyecto (mission.md, tech-stack.md, roadmap.md) dentro de specs/
agent: spec-writer
---

**Contexto del usuario:** `$ARGUMENTS`

Lee `AGENTS.md`, `specs/ARCHITECTURE.md`, `specs/DESIGN_SYSTEM.md` y `specs/SECURITY.md` y crea o actualiza en `specs/`:
- `specs/mission.md` — Problema que resuelve el IDP, audiencias (`external` e `internal`), soporte White-Label Open Source y alcance negativo explicito.
- `specs/tech-stack.md` — Stack del monorepo (`pnpm`, `Turborepo`, `Next.js 15`, `@repo/ui`, `@repo/layouts`, `@repo/auth`, `@repo/security`, `@repo/api-client`, `@repo/module-sdk`) y decisiones arquitectonicas.
- `specs/roadmap.md` — Fases evolutivas del ecosistema verificables e incrementales.

IMPORTANTE: Si necesitas aclarar decisiones estrategicas con el usuario antes de modificar estos archivos, utiliza la herramienta `question` agrupando todas las dudas en una sola llamada.

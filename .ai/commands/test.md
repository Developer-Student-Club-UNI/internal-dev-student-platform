---
description: Ejecuta la verificacion Zero-Trust sobre el Target Spec activo en specs/ACTIVE_SESSION.md
agent: test-writer
---

**Contexto adicional del usuario:** `$ARGUMENTS`

1. Lee `specs/ACTIVE_SESSION.md` y el `SPEC.md` activo.
2. Ejecuta `pnpm validate:all && pnpm typecheck && pnpm build`.
3. Marca los criterios verificados en la seccion `3. Criterios de Validacion` del `SPEC.md` activo y actualiza `Fase SDD Actual: test` en `specs/ACTIVE_SESSION.md`.

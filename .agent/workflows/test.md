---
description: Ejecuta la verificacion Zero-Trust sobre el Target Spec activo en specs/ACTIVE_SESSION.md
agent: test-writer
---

**Contexto adicional del usuario:** `$ARGUMENTS`

1. Lee `specs/ACTIVE_SESSION.md` y el `SPEC.md` activo.
2. Ejecuta `pnpm validate:all && pnpm typecheck && pnpm build`.
3. **Importante:** Como `pnpm build` sobrescribe la carpeta `.next/`, si el servidor de desarrollo (`pnpm dev`) estaba corriendo en paralelo en `http://localhost:4310` o `4320`, recuérdale siempre al usuario reiniciar `pnpm dev` (`Ctrl + C` y volver a ejecutar `pnpm dev`) para evitar errores `500` de chunks o estilos rotos.
4. Marca los criterios verificados en la seccion `3. Criterios de Validacion` del `SPEC.md` activo y actualiza `Fase SDD Actual: test` en `specs/ACTIVE_SESSION.md`.

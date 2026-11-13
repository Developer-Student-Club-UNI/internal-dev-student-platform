---
description: Lee specs/ACTIVE_SESSION.md, abre el SPEC.md activo, ejecuta UN SOLO GRUPO pendiente y guarda el checkpoint
agent: build
---

**Contexto adicional del usuario:** `$ARGUMENTS`

1. Lee `specs/ACTIVE_SESSION.md` para identificar el `Target Spec` activo (sin escanear todo el monorepo).
2. Abre ese `SPEC.md` y localiza el **PRIMER grupo de tareas** con casillas `- [ ]` pendientes.
3. Ejecuta unicamente ese grupo de tareas respetando los Mandamientos de `AGENTS.md`. **PROHIBIDO modificar `README.md`, `packages/*`, `tooling/*` o `specs/*` (salvo `specs/ACTIVE_SESSION.md`).**
4. Corre `pnpm validate:guardrails` para confirmar que no se introdujeron estilos ni imports ilegales.
5. Marca las casillas completadas con `- [x]` en el `SPEC.md`, actualiza `specs/ACTIVE_SESSION.md` con el ultimo grupo completado y detente resumiendo en 2-3 lineas el avance.

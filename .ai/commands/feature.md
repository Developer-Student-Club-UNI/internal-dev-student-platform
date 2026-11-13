---
description: Inicia o actualiza una App o Modulo usando un unico archivo compacto SPEC.md dentro de su carpeta y actualiza specs/ACTIVE_SESSION.md (sin saturar specs/ con carpetas de fechas)
agent: spec-writer
---

**Contexto del usuario:** `$ARGUMENTS`

Para evitar saturar el monorepo con decenas de carpetas por fecha y ahorrar ventana de contexto:
1. Determina el destino del trabajo:
   - Si es una aplicacion: `apps/<app-id>/SPEC.md`
   - Si es un modulo: `modules/<app-id>/<module-id>/SPEC.md`
2. Antes de escribir, usa la herramienta `question` (si hay dudas de alcance, audiencia o capacidad RBAC) agrupando las preguntas en una sola tanda.
3. Crea o actualiza el archivo unico `SPEC.md` (< 80 lineas) dentro de esa app o modulo usando la plantilla `specs/_template/SPEC.md` (que unifica Requisitos, Plan por grupos con `- [ ]`, Seguridad OWASP y Validacion en un solo archivo compacto).
4. Actualiza `specs/ACTIVE_SESSION.md` apuntando `Target Spec` hacia ese `SPEC.md` y fijando `Fase SDD Actual: planning`.
5. **PROHIBIDO** modificar `README.md`, `packages/*`, `tooling/*` o cualquier otro archivo fuera del `SPEC.md` objetivo y `specs/ACTIVE_SESSION.md`.

---
trigger: always_on
description: Constitucion y Guardrails Zero-Trust del IDP de Frontend
---

# AGENTS.md — Constitución del IDP de Frontend (Spec-Driven & Agent-Agnostic)

> **ATENCIÓN AGENTE DE IA (OpenCode, Claude Code, Codex, Cursor, Windsurf, Copilot):**
> Este repositorio es un **Internal Developer Platform (IDP) de Frontend** gobernado por especificaciones estrictas y guardrails automatizados Zero-Trust. Antes de modificar o crear cualquier archivo, **DEBES** leer las especificaciones enlazadas en este documento.

---

## 1. Mapa de Especificaciones Obligatorias (`specs/`)

Toda decisión de arquitectura, diseño visual, seguridad, creación de aplicaciones o creación de módulos está regulada por:

1. [`specs/ARCHITECTURE.md`](./specs/ARCHITECTURE.md) — Topología del monorepo, reglas de grafo de dependencias e aislamiento entre `apps/`, `modules/` y `packages/`.
2. [`specs/DESIGN_SYSTEM.md`](./specs/DESIGN_SYSTEM.md) — Sistema de diseño cerrado (`@repo/ui`), tokens semánticos obligatorios y prohibición de estilos arbitrarios.
3. [`specs/SECURITY.md`](./specs/SECURITY.md) — **Seguridad Zero-Trust (OWASP Top 10 Web + OWASP Top 10 AI/LLM)**, prevención de XSS, SQLi/NoSQLi, CSRF, Path Traversal, Cookies seguras, anti-exfiltración y política de puertos (`4310+`, prohibido `3000`/`3001`).
4. [`specs/APP_TEMPLATE.md`](./specs/APP_TEMPLATE.md) — Contrato para crear nuevas aplicaciones (`apps/external-*` y `apps/internal-*`) y configurar `app.config.ts` (incluyendo soporte White-Label multi-comunidad).
5. [`specs/MODULE_CONTRACT.md`](./specs/MODULE_CONTRACT.md) — Contrato para crear y enchufar módulos aislados (`modules/<app-id>/<module-id>`) mediante `module.config.ts` y permisos por capacidades (`can()`).
6. [`specs/BACKEND_CONTRACT.md`](./specs/BACKEND_CONTRACT.md) — Estándar de API, DTOs, autenticación en memoria con rotación Single-Flight y modelo de dominio basado en `dsc-web-backend` (`@repo/api-client`).

### Playbooks / Workflows Ejecutables para Agentes
- **Para crear una nueva Aplicación:** Sigue paso a paso [`specs/workflows/crear-app.md`](./specs/workflows/crear-app.md) o ejecuta `pnpm create:app`.
- **Para crear un nuevo Módulo dentro de una App:** Sigue paso a paso [`specs/workflows/crear-modulo.md`](./specs/workflows/crear-modulo.md) o ejecuta `pnpm create:module`.

---

## 2. Los 8 Mandamientos Inquebrantables (Zero-Trust Guardrails)

Cualquier violación a estas reglas provocará que `pnpm validate:all` y el hook de pre-commit (`Husky`) bloqueen tu código:

1. **PROHIBIDO usar colores crudos o valores arbitrarios de Tailwind:**
   - [RECHAZADO]: `bg-blue-600`, `text-slate-800`, `border-gray-200`, `bg-[#1a2b3c]`, `w-[350px]`, `style={{ color: 'red' }}`.
   - [PERMITIDO]: Usa exclusivamente tokens semánticos de `@repo/ui`: `bg-background`, `bg-surface`, `bg-surface-elevated`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `text-primary-foreground`, `border-subtle`, `status-success`, `status-warning`, `status-danger`.
2. **PROHIBIDO crear controles HTML nativos fuera de `packages/ui`:**
   - [RECHAZADO] en `apps/` o `modules/`: `<button>`, `<input>`, `<select>`, `<textarea>`, `<table>`.
   - [PERMITIDO]: Importar `<Button>`, `<Input>`, `<Select>`, `<Badge>`, `<Card>`, `<DataTable>`, `<PageHeader>` desde `@repo/ui`.
3. **PROHIBIDO construir Headers, Sidebars o Footers dentro de `apps/` o `modules/`:**
   - Toda aplicación en `apps/*` debe delegar su estructura raíz en un Shell de `@repo/layouts` (`ExternalPublicShell`, `EventLandingShell`, `InternalDashboardShell`).
4. **PROHIBIDO importar entre módulos o entre aplicaciones:**
   - Un módulo en `modules/<app-A>/<mod-1>` **NUNCA** puede importar archivos de `modules/<app-A>/<mod-2>` ni de `apps/*`.
   - Los módulos solo pueden importar de `@repo/ui`, `@repo/auth`, `@repo/security`, `@repo/module-sdk` y sus propios archivos internos.
5. **SEGURIDAD OWASP Top 10 & OWASP AI Obligatoria (`@repo/security`):**
   - Prohibido `dangerouslySetInnerHTML`, `eval()`, `new Function()`, `document.cookie`, concatenación SQL cruda, `fs`/`child_process` en apps o módulos, secretos hardcodeados o llamadas `fetch` hacia dominios externos no autorizados.
   - Toda entrada de formulario/búsqueda debe validarse contra XSS, SQLi/NoSQLi, Path Traversal y Prompt Injection con `@repo/security`.
   - Toda app debe inyectar `getSecurityHeaders()` de `@repo/security` en `next.config.mjs`.
6. **POLÍTICA DE PUERTOS (`4310+`):**
   - Prohibido usar los puertos `3000` o `3001`. Las aplicaciones usan el rango dedicado `4310`, `4320`, `4330+`.
7. **Contratos `app.config.ts` y `module.config.ts` validados por `@repo/module-sdk`:**
   - `apps/external-*` -> `audience: 'external'`.
   - `apps/internal-*` -> `audience: 'internal'`, `layout: 'internal-dashboard'` y `auth.required: true`.
8. **PROHIBIDO modificar `README.md` y archivos del núcleo del IDP:**
   - Los agentes tienen **estrictamente prohibido** editar, sobrescribir o eliminar `README.md`, `packages/*`, `tooling/*`, `specs/*` (excepto `specs/ACTIVE_SESSION.md`) o archivos de configuración raíz al crear o modificar aplicaciones y módulos.
9. **Verificación Obligatoria Antes de Finalizar:**
   - Antes de dar por terminada cualquier tarea, ejecuta siempre:
     ```bash
     pnpm validate:all && pnpm typecheck && pnpm build
     ```
   - **REGLA CRÍTICA DE REINICIO DE `pnpm dev` TRAS `pnpm build`:** Ejecutar `pnpm build` (`next build`) sobrescribe la carpeta `.next/` con artefactos de producción. Si hay un servidor de desarrollo (`pnpm dev`, `pnpm dev:external`, `pnpm dev:internal` o `pnpm dev:all`) corriendo al mismo tiempo en los puertos `4310+`, sus estilos y chunks devolverán `500 Internal Server Error`. Siempre que ejecutes `pnpm build`, **DEBES** advertir al usuario que detenga (`Ctrl + C`) y vuelva a iniciar `pnpm dev` (o reiniciarlo tú mismo si corre en tu sesión) y recargue el navegador (`Ctrl + Shift + R`).

---

## 3. Flujo Obligatorio SDD Compacto (`specs -> planning -> implement -> test -> security`)

Para evitar que el monorepo se sature de carpetas por fecha y ahorrar ventana de contexto:

1. **Constitución Base (`/constitution`):**
   - `specs/mission.md`, `specs/tech-stack.md` y `specs/roadmap.md` contienen el propósito, stack y hoja de ruta global.
2. **Puntero de Sesión Activa (`specs/ACTIVE_SESSION.md`):**
   - Archivo de 25 líneas que indica cuál aplicación o módulo se está trabajando en este momento (`Target Spec`).
3. **Checkpoint Único por App o Módulo (`/feature` -> `SPEC.md`):**
   - Cada aplicación (`apps/<app-id>/SPEC.md`) o módulo (`modules/<app-id>/<module-id>/SPEC.md`) posee un único archivo `SPEC.md` compacto (< 80 líneas) generado desde `specs/_template/SPEC.md` con Requisitos, Plan por grupos (`[ ]` / `[x]`), Seguridad y Validación.
4. **Implementación Incremental por Grupos (`/implement`):**
   - El agente lee `specs/ACTIVE_SESSION.md`, abre el `SPEC.md` activo, ejecuta **un solo grupo de tareas** a la vez y marca `[x]` en `SPEC.md`.
5. **Testing (`/test`) y Auditoría de Seguridad (`/security-review`):**
   - `test-writer` ejecuta `pnpm validate:all && pnpm typecheck && pnpm build`. `security-reviewer` audita el diff en solo lectura contra `specs/SECURITY.md`.
6. **Sincronización Universal Agnóstica al Harness (`pnpm sdd:sync`):**
   - Fuente única neutral en `.ai/` (`agents/`, `commands/`, `skills/`). Al correr `pnpm sdd:sync`, se actualizan automáticamente OpenCode (`.opencode/`), Claude Code (`CLAUDE.md` + `.claude/commands/`), Antigravity (`.agent/rules/` + `.agent/workflows/`), Codex (`CONVENTIONS.md`), Cursor (`.cursorrules`), Windsurf (`.windsurfrules`) y Copilot (`.github/copilot-instructions.md`).

---

## Roles y Subagentes SDD (.ai/agents/)

Subagentes especializados para el ciclo `specs -> planning -> implement -> test -> security`:
- **code-reviewer**: Revision de calidad de codigo, cumplimiento del Design System (@repo/ui) y aislamiento modular en solo lectura. (`.ai/agents/code-reviewer.md`)
- **proof-of-concept**: Construye pruebas de concepto (POC) rapidas y aisladas para validar hipotesis tecnicas antes de comprometer la arquitectura. (`.ai/agents/proof-of-concept.md`)
- **security-reviewer**: Revision de seguridad Zero-Trust de solo lectura antes de mergear (OWASP Top 10 Web, OWASP AI Top 10, sanitizacion de logs y RBAC). (`.ai/agents/security-reviewer.md`)
- **spec-writer**: Redacta la constitucion del proyecto y specs de feature/app/modulo (mission, tech-stack, roadmap, requirements, plan, validation). NUNCA escribe codigo de aplicacion. (`.ai/agents/spec-writer.md`)
- **test-writer**: Escribe y ejecuta pruebas y validadores del IDP a partir de requirements.md y validation.md de la feature actual. (`.ai/agents/test-writer.md`)

---

## Skills Reutilizables (.ai/skills/)

Habilidades disponibles para cualquier harness:
- **cost-guard**: `.ai/skills/cost-guard/SKILL.md`
- **definicion-de-marca**: `.ai/skills/definicion-de-marca/SKILL.md`
- **deploy-netlify**: `.ai/skills/deploy-netlify/SKILL.md`
- **generador-de-skills**: `.ai/skills/generador-de-skills/SKILL.md`
- **poc-strategy**: `.ai/skills/poc-strategy/SKILL.md`
- **seguridad-buenas-practicas**: `.ai/skills/seguridad-buenas-practicas/SKILL.md`
- **test-strategy**: `.ai/skills/test-strategy/SKILL.md`

---

## Comandos SDD Compactos para Monorepo (.ai/commands/)

Comandos disponibles en todos los harnesses:

### Comando: `/constitution`
- **Proposito:** Crea o actualiza la constitucion del proyecto (mission.md, tech-stack.md, roadmap.md) dentro de specs/
- **Rol asignado:** `spec-writer` (`.ai/agents/spec-writer.md`)
- **Definicion:** `.ai/commands/constitution.md`

### Comando: `/feature`
- **Proposito:** Inicia o actualiza una App o Modulo usando un unico archivo compacto SPEC.md dentro de su carpeta y actualiza specs/ACTIVE_SESSION.md (sin saturar specs/ con carpetas de fechas)
- **Rol asignado:** `spec-writer` (`.ai/agents/spec-writer.md`)
- **Definicion:** `.ai/commands/feature.md`

### Comando: `/implement`
- **Proposito:** Lee specs/ACTIVE_SESSION.md, abre el SPEC.md activo, ejecuta UN SOLO GRUPO pendiente y guarda el checkpoint
- **Rol asignado:** `build` (`.ai/agents/build.md`)
- **Definicion:** `.ai/commands/implement.md`

### Comando: `/poc`
- **Proposito:** Construye una prueba de concepto (POC) aislada para validar hipotesis tecnicas antes de implementar
- **Rol asignado:** `proof-of-concept` (`.ai/agents/proof-of-concept.md`)
- **Definicion:** `.ai/commands/poc.md`

### Comando: `/security-review`
- **Proposito:** Audita en solo lectura el Target Spec activo contra specs/SECURITY.md (OWASP Top 10 Web + OWASP AI Top 10)
- **Rol asignado:** `security-reviewer` (`.ai/agents/security-reviewer.md`)
- **Definicion:** `.ai/commands/security-review.md`

### Comando: `/test`
- **Proposito:** Ejecuta la verificacion Zero-Trust sobre el Target Spec activo en specs/ACTIVE_SESSION.md
- **Rol asignado:** `test-writer` (`.ai/agents/test-writer.md`)
- **Definicion:** `.ai/commands/test.md`

---

## Protocolo de Checkpoint SDD Ligero (Cero Perdida de Contexto / Minimo Consumo de Tokens)

Este monorepo NO crea carpetas por fecha en `specs/`. En su lugar usa **Checkpoints Localizados**:
1. `specs/ACTIVE_SESSION.md` (25 lineas): Indica cual es la App o Modulo activo y en que grupo va.
2. `apps/<app>/SPEC.md` o `modules/<app>/<mod>/SPEC.md` (< 80 lineas): Contiene Requisitos, Plan (`[x]` / `[ ]`), Seguridad y Validacion en un unico archivo.

Para retomar cualquier sesion en cero segundos sin gastar ventana de contexto, lee solo `AGENTS.md` + `specs/ACTIVE_SESSION.md` + el `SPEC.md` activo.

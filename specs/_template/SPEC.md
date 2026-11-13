# SPEC & Checkpoint SDD — `<id-app-o-modulo>`

- **Tipo:** `app` | `module`
- **Target:** `apps/<app-id>` | `modules/<app-id>/<module-id>`
- **Audiencia / Layout:** `external` | `internal`
- **Permiso RBAC (`can()`):** `public` | `event:write` | `project:write` | `person:write` | `team-unit:write` | `term:write` | `site:write` | `message:read` | `user:write` | `audit:read`
- **Estado SDD:** `specs` | `planning` | `implement` | `test` | `security` | `done`

## 1. Requisitos y Alcance (Specs)
- **Incluye:**
- **Fuera de alcance:**
- **Seguridad OWASP (`@repo/security`):** Inputs validados con `validateSafeInput()` y mutaciones con `verifyMutationCsrf()`.

## 2. Plan de Implementacion por Grupos (Planning & Implement)
<!-- /implement ejecuta UN SOLO GRUPO a la vez y marca [x] -->
### Grupo 1: Contrato y Estructura Base
- [ ] Configurar `app.config.ts` o `module.config.ts` y registrar en `registry.ts`
### Grupo 2: Interfaz `@repo/ui` y Validacion `@repo/security`
- [ ] Implementar vistas exclusivamente con componentes y tokens de `@repo/ui`
### Grupo 3: Pruebas y Seguridad (`/test` & `/security-review`)
- [ ] Ejecutar `pnpm validate:all && pnpm typecheck && pnpm build`

## 3. Criterios de Validacion (Validation Gate)
- [ ] Renderiza sin errores dentro de `@repo/layouts` y `<ModuleErrorBoundary>`
- [ ] 0 violaciones en `pnpm validate:all` y auditoria `/security-review` aprobada

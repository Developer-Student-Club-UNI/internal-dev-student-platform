# SPEC & Checkpoint SDD — `internal-board-portal`

- **Tipo:** `app`
- **Target:** `apps/internal-board-portal` (Puerto `4320`)
- **Audiencia / Layout:** `internal` / `internal-dashboard`
- **Permiso RBAC (`can()`):** `authenticated` + capacidades por modulo (`event:write`, `project:write`, `person:write`, `team-unit:write`, `term:write`, `site:write`, `message:read`, `user:write`, `audit:read`)
- **Estado SDD:** `done`

## 1. Requisitos y Alcance (Specs)
- **Incluye:** Ficha editable `Mi cuenta` (`/`) y las 10 secciones administrativas del panel como modulos aislados en `modules/internal-board-portal/*` (`/eventos`, `/proyectos`, `/equipo`, `/unidades`, `/ciclos`, `/sitio`, `/mensajes`, `/usuarios`, `/auditoria`, `/certificates`).
- **Seguridad OWASP (`@repo/security`):** Proteccion `<RoleGuard>` con capacidades `can()`, regla `409 LAST_PRESIDENT` en `/usuarios`, regla `409 TERM_HAS_MEMBERSHIPS` en `/ciclos`, `validateSafeInput` en todos los formularios y redaccion de JWTs en `<ModuleErrorBoundary>`.

## 2. Plan de Implementacion por Grupos (Planning & Implement)
### Grupo 1: Contrato y Shell Interno
- [x] Configurar `app.config.ts` en puerto `4320` con `InternalDashboardShell`
### Grupo 2: Modulos Administrativos por Capacidades
- [x] Implementar y registrar los 10 modulos en `modules/internal-board-portal/registry.ts`
### Grupo 3: Pruebas y Seguridad (`/test` & `/security-review`)
- [x] Ejecutar `pnpm validate:all && pnpm typecheck && pnpm build`

## 3. Criterios de Validacion (Validation Gate)
- [x] El menu lateral filtra dinamicamente las secciones segun las capacidades del rol activo
- [x] 0 violaciones en `pnpm validate:all` y auditoria `/security-review` aprobada

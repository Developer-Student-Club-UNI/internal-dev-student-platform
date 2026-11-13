# SPEC & Checkpoint SDD — `external-community-web`

- **Tipo:** `app`
- **Target:** `apps/external-community-web` (Puerto `4310`)
- **Audiencia / Layout:** `external` / `external-public`
- **Permiso RBAC (`can()`):** `public`
- **Estado SDD:** `done`

## 1. Requisitos y Alcance (Specs)
- **Incluye:** Portada Home DSC UNI (Hero, Eventos Destacados, Proyectos, Alianzas, CallToAction) y 4 modulos enchufados (`/nosotros`, `/team`, `/eventos`, `/contacto`). Soporte White-Label mediante `app.config.ts -> community`.
- **Seguridad OWASP (`@repo/security`):** Cabeceras CSP/HSTS en `next.config.mjs`, `removeConsole` en produccion, y validacion `validateSafeInput` + `verifyMutationCsrf` en busquedas y formulario de contacto.

## 2. Plan de Implementacion por Grupos (Planning & Implement)
### Grupo 1: Contrato y Activos Oficiales
- [x] Configurar `app.config.ts` en puerto `4310` e integrar activos de `dsc-web-frontend` en `public/`
### Grupo 2: Portada y Modulos Publicos (`@repo/ui`)
- [x] Implementar Home y modulos `nosotros`, `team`, `events-showcase` (`/eventos`) y `volunteer-signup` (`/contacto`)
### Grupo 3: Pruebas y Seguridad (`/test` & `/security-review`)
- [x] Ejecutar `pnpm validate:all && pnpm typecheck && pnpm build`

## 3. Criterios de Validacion (Validation Gate)
- [x] Renderiza dentro de `ExternalPublicShell` (`@repo/layouts`)
- [x] 0 violaciones en `pnpm validate:all` y auditoria `/security-review` aprobada

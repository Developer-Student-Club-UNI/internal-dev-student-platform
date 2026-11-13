# Hoja de Ruta Evolutiva del IDP (`specs/roadmap.md`)

Cada fase del roadmap representa un incremento verificable gobernado por el ciclo **SDD (`specs -> planning -> implement -> test -> security`)**.

---

## Fase 1: Cimientos del Monorepo, Guardrails Zero-Trust y Seguridad OWASP [COMPLETADA]
- [x] Configuracion de `pnpm workspaces`, `turbo.json` y `@repo/config`.
- [x] Implementacion de `@repo/security` (XSS, SQLi/NoSQLi, Path Traversal, CSRF, Cookies seguras, SSRF, OWASP AI Prompt Injection y `safeLogger`).
- [x] Validadores automaticos (`validate:apps`, `validate:modules`, `validate:guardrails`, `validate:security`) y politica de puertos `4310+` (prohibido `3000`/`3001`).

## Fase 2: Sistema de Diseno Cerrado (`@repo/ui`) y Shells Estructurales (`@repo/layouts`) [COMPLETADA]
- [x] Tokens CSS semanticos en `packages/ui/src/styles/tokens.css` con el tema oficial de **DSC UNI** (`dsc-uni`) y presets White-Label Open Source (`tech-indigo`, `ai-guild`).
- [x] Catalogo de componentes cerrados (`Button`, `Input`, `Select`, `Textarea`, `Badge`, `Card`, `DataTable`, `PageHeader`, `SectionTitle`, `Highlight`, `AlliancesShowcase`, `CallToActionBanner`, `ModalDialog`).
- [x] Shells maestros en `@repo/layouts`: `ExternalPublicShell`, `EventLandingShell` e `InternalDashboardShell`.

## Fase 3: Contratos de Extension (`@repo/module-sdk`), Capacidades RBAC (`@repo/auth`) y Cliente Backend (`@repo/api-client`) [COMPLETADA]
- [x] Contratos `defineApp` y `defineModule` con aislamiento `<ModuleErrorBoundary>` y `<RoleGuard>`.
- [x] Modelo de capacidades granulares `can(roles, permission)` (`event:write`, `project:write`, `person:write`, `team-unit:write`, `term:write`, `site:write`, `message:read`, `user:write`, `audit:read`).
- [x] Cliente HTTP `@repo/api-client` con `accessToken` en memoria y renovacion Single-Flight (`refreshInFlight`).

## Fase 4: Web Publica DSC UNI (`apps/external-community-web`) y Panel Interno (`apps/internal-board-portal`) [COMPLETADA]
- [x] Portada publica y modulos `/nosotros`, `/team`, `/eventos` y `/contacto` en `apps/external-community-web` (Puerto `4310`).
- [x] Ficha `Mi cuenta` y los 10 modulos administrativos (`/eventos`, `/proyectos`, `/equipo`, `/unidades`, `/ciclos`, `/sitio`, `/mensajes`, `/usuarios`, `/auditoria`, `/certificates`) en `apps/internal-board-portal` (Puerto `4320`).

## Fase 5: Framework SDD Multi-Harness (`sdd-es-opencode`) y Automatizacion CI/CD [COMPLETADA]
- [x] Integracion de `.opencode/` (`agent/`, `commands/`, `skills/`, `scripts/sync.js`), `opencode.json` y `flow.mermaid`.
- [x] Sincronizacion automatica de `AGENTS.md`, `CLAUDE.md`, `.cursorrules`, `.windsurfrules` y `CONVENTIONS.md`.
- [x] Pipeline selectivo `.github/workflows/ci-selective-deploy.yml` para Cloudflare Pages y Vercel.

---

## Siguientes Fases Abiertas para Nuevas Features (`/feature <nombre>`)
- [ ] **Fase 6 (`convocatoria-crt`):** Modulo publico de convocatoria gamificada (`/convocatoria` y `/convocatoria/registro`) conectado a `apps/external-community-web`.
- [ ] **Fase 7 (`auth-flows-live`):** Pantallas conectadas en vivo a los endpoints de autenticacion de `dsc-web-backend` (`/login`, `/register`, `/recuperar-contrasena`, `/verificar-correo`).
- [ ] **Fase 8 (`external-event-summit`):** Nueva aplicacion independiente `apps/external-event-summit` usando `EventLandingShell` para congresos y hackathons anuales.

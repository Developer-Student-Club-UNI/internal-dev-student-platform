# Stack Tecnologico y Decisiones de Arquitectura (`specs/tech-stack.md`)

## 1. Stack Elegido y Justificacion

| Capa | Tecnologia Elegida | Por Que se Eligio | Alternativas Descartadas |
| :--- | :--- | :--- | :--- |
| **Orquestacion Monorepo** | `pnpm workspaces` + `Turborepo` | Aislamiento estricto de dependencias, cache por tarea y `turbo prune` para CI/CD selectivo por aplicacion. | `npm workspaces` / `Nx` (mayor complejidad de configuracion para voluntarios). |
| **Meta-Framework** | `Next.js 15 (App Router)` + `React 19` + `TypeScript 5.x` | Un unico modelo mental tanto para apps publicas (SEO/SSG) como para portales internos (RBAC dinamico), maximizando la precision de cualquier agente LLM. | Combinacion hibrida Astro + Vite (obligaria a mantener dos sistemas de componentes y dos SDKs de modulos). |
| **Design System (`@repo/ui`)** | `Tailwind CSS` (Preset cerrado) + Variables HSL + `Lucide React` | Centraliza el 100% del diseno en `packages/ui/src/styles/tokens.css` y bloquea colores/tamanos arbitrarios. | CSS libre por modulo o SASS duplicado en cada app (imposible de auditar automaticamente). |
| **Contratos y Validacion** | `Zod` (`@repo/module-sdk` y `@repo/security`) | Validacion en tiempo de ejecucion y compilacion para `app.config.ts`, `module.config.ts` y entradas de usuario. | Interfaces TS puras sin validacion runtime. |
| **Cliente Backend (`@repo/api-client`)** | `fetch` encapsulado con `accessToken` en memoria + `refreshInFlight` Single-Flight + `X-CSRF-Token` | Espejo exacto del contrato de `dsc-web-backend`: inmune a robo de tokens en `localStorage` y a revocaciones por condiciones de carrera en renovacion paralela. | `axios` con interceptores acoplados a `localStorage`. |
| **Seguridad (`@repo/security`)** | Firewall OWASP Top 10 Web + OWASP AI Top 10 + `safeLogger` | Prevencion isomorfica de XSS, SQLi, NoSQLi, Path Traversal, Prompt Injection (LLM01) y redaccion de PII/tokens en logs (A09/LLM06). | Validacion manual dispersa en cada formulario. |
| **CI/CD Multi-Deploy** | `GitHub Actions` + `Cloudflare Pages` & `Vercel` | Despliega unicamente las apps afectadas en cada PR o merge, aprovechando las capas gratuitas sin agotar cuotas. | Redesplegar todas las apps del monorepo en cada commit. |

## 2. Comandos Oficiales del Monorepo
- Instalar dependencias: `pnpm install`
- Desarrollo paralelo: `pnpm dev` (`http://localhost:4310` y `http://localhost:4320`)
- Sincronizar SDD entre harnesses: `pnpm sdd:sync`
- Validar todos los guardrails Zero-Trust: `pnpm validate:all`
- Verificar tipos en todos los paquetes: `pnpm typecheck`
- Compilar produccion: `pnpm build`
- Crear nueva aplicacion: `pnpm create:app --id <external|internal>-<slug> --name "<Nombre>" --layout <layout> --port <4330+>`
- Crear nuevo modulo: `pnpm create:module --app <app-id> --id <mod-id> --title "<Titulo>" --icon <IconName> --roles <roles>`

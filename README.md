# Internal Developer Platform (IDP) de Frontend — Spec-Driven, Multi-App & Harness-Agnostic

Plataforma de Desarrollo Interna (IDP) de Frontend construida sobre **pnpm workspaces**, **Turborepo** y **Next.js 15 (App Router)**. Permite que múltiples desarrolladores, directivos, voluntarios y agentes de IA construyan tanto **aplicaciones web independientes** como **módulos aislados dentro de aplicaciones existentes** con cero desviación visual, seguridad Zero-Trust (**OWASP Top 10 Web + OWASP Top 10 AI/LLM**) y despliegue continuo gratuito.

> **Estándar de Referencia DSC UNI + White-Label Open Source:**
> El ecosistema implementa por defecto la identidad visual, las vistas y el contrato de backend del **Developer Student Club de la Universidad Nacional de Ingeniería (DSC UNI)** (`dsc-web-frontend` + `dsc-web-backend`), pero está diseñado de forma **100% White-Label y Open Source** para que cualquier otra comunidad estudiantil, club de programación o capítulo técnico pueda adoptarlo modificando un único bloque declarativo (`community` en `app.config.ts`).
>
> **¿Eres nuevo o desarrollador junior?** Lee también la [**Guía Completa para Desarrolladores Junior (`GUIA_DESARROLLADOR_JUNIOR.md`)**](./GUIA_DESARROLLADOR_JUNIOR.md).

---

## Tabla de Contenidos

0. [Paso 0 (Previo): Requisitos, CLIs Recomendadas y Clonación del Repositorio](#paso-0-previo-requisitos-clis-recomendadas-y-clonación-del-repositorio)
1. [¿Qué es este proyecto y cómo está compuesto?](#1-qué-es-este-proyecto-y-cómo-está-compuesto)
2. [Catálogo Completo de Flags, Layouts, Temas, Iconos, Roles y Permisos](#2-catálogo-completo-de-flags-layouts-temas-iconos-roles-y-permisos)
3. [Gobernanza del Monorepo: ¿Dónde alojarlo y cómo separar roles (Mantenedores vs Desarrolladores)?](#3-gobernanza-del-monorepo-dónde-alojarlo-y-cómo-separar-roles-mantenedores-vs-desarrolladores)
4. [Guía 1: Cómo comenzar a usar el proyecto (Ejecución individual sin levantar todas las apps)](#guía-1-cómo-comenzar-a-usar-el-proyecto-ejecución-individual-sin-levantar-todas-las-apps)
5. [Guía 2: Cómo usar cualquier Agente de IA (Con o Sin Slash Commands `/`)](#guía-2-cómo-usar-cualquier-agente-de-ia-con-o-sin-slash-commands-)
6. [Guía 3: Cómo construir una Nueva Aplicación asistido por tu Agente](#guía-3-cómo-construir-una-nueva-aplicación-asistido-por-tu-agente)
7. [Guía 4: Cómo añadir un Nuevo Módulo dentro de una Aplicación asistido por tu Agente](#guía-4-cómo-añadir-un-nuevo-módulo-dentro-de-una-aplicación-asistido-por-tu-agente)
8. [Guía 5: Cierre Todo-en-Uno (Tests + Seguridad + Git + Pull Request con 1 solo Prompt)](#guía-5-cierre-todo-en-uno-tests--seguridad--git--pull-request-con-1-solo-prompt)
9. [Guía 6: Arquitectura de Backend, Base de Datos y Paso a Producción con Agentes + CLIs (Supabase, Cloudflare, Vercel, GitHub)](#guía-6-arquitectura-de-backend-base-de-datos-y-paso-a-producción-con-agentes--clis-supabase-cloudflare-vercel-github)

---

## Paso 0 (Previo): Requisitos, CLIs Recomendadas y Clonación del Repositorio

### 0.1 Requisitos Base
- **Node.js:** versión `22.x` o superior (`node -v`).
- **pnpm:** versión `11.x` (`corepack enable && corepack prepare pnpm@11.24.0 --activate`).
- **Git** instalado.
- **Agente de IA:** Claude Code (`claude`), OpenCode (`opencode`), Cursor, Windsurf, GitHub Copilot, Antigravity o Codex.

### 0.2 Herramientas CLI Recomendadas (Para que tu Agente haga todo el trabajo de Nube y BD por ti)
Instalar estas herramientas de línea de comandos permite que **tu Agente de IA cree ramas, abra Pull Requests, configure bases de datos en Supabase y despliegue en Cloudflare o Vercel directamente desde el chat**, sin que tengas que configurar paneles web manualmente:

| Herramienta CLI | ¿Para qué la usa tu Agente? | Cómo instalarla y autenticarte una sola vez |
| :--- | :--- | :--- |
| **GitHub CLI (`gh`)** | Crear ramas, subir commits, abrir Pull Requests y cargar Secrets (`gh secret set`). | Instalar: `winget install GitHub.cli` (Win) o `brew install gh` (Mac) -> Login: `gh auth login` |
| **Supabase CLI (`supabase`)** | Crear/vincular proyectos PostgreSQL, correr migraciones y obtener URLs de BD. | `npm install -g supabase` -> Login: `npx supabase login` |
| **Cloudflare CLI (`wrangler`)** | Crear proyectos en Cloudflare Pages, subir variables de entorno y desplegar apps. | `npm install -g wrangler` -> Login: `npx wrangler login` |
| **Vercel CLI (`vercel`)** | Vincular proyectos en Vercel, configurar variables de entorno y desplegar. | `npm install -g vercel` -> Login: `npx vercel login` |

### 0.3 Clonar el Repositorio e Inicializar
```bash
# 1. Clonar el repositorio y entrar a la carpeta
git clone https://github.com/<tu-organizacion>/internal-dev-student-platform.git
cd internal-dev-student-platform

# 2. Instalar dependencias y sincronizar las reglas de todos los agentes de IA
pnpm install
pnpm sdd:sync
```

> **O pídeselo directamente a tu Agente tras clonar el repositorio:**
> ```text
> Inicializa el entorno ejecutando pnpm install y pnpm sdd:sync. Luego ejecuta pnpm dev para listarme las aplicaciones actuales del monorepo, sus puertos y confirmar que todo está listo.
> ```

---

## 1. ¿Qué es este proyecto y cómo está compuesto?

```text
internal-dev-student-platform/
├── AGENTS.md                        # Constitución maestra cargada por todos los agentes de IA
├── GUIA_DESARROLLADOR_JUNIOR.md     # Guía paso a paso explicada en lenguaje sencillo para juniors
├── .ai/                             # FUENTE ÚNICA AGNÓSTICA AL HARNESS (agents/, commands/, skills/, scripts/sync.mjs)
├── .opencode/ + opencode.json       # Configuración auto-sincronizada para OpenCode
├── .claude/commands/ + CLAUDE.md    # Comandos slash nativos y reglas para Claude Code
├── .agent/rules/ + .agent/workflows/# Reglas y workflows nativos para Google Antigravity IDE
├── CONVENTIONS.md                   # Reglas sincronizadas para OpenAI Codex / Aider
├── .cursorrules / .windsurfrules    # Reglas sincronizadas para Cursor y Windsurf
├── .github/
│   ├── CODEOWNERS                   # Protección de núcleo IDP por equipos (@org/idp-maintainers vs @org/app-developers)
│   ├── copilot-instructions.md      # Reglas sincronizadas para GitHub Copilot
│   └── workflows/ci-selective-deploy.yml
├── specs/                           # Especificaciones Base del IDP (Sin carpetas fechadas que saturen el repo)
│   ├── ACTIVE_SESSION.md            # Puntero de 25 líneas al SPEC.md activo (ahorro extremo de ventana de contexto)
│   ├── _template/SPEC.md            # Plantilla de Checkpoint SDD único (<80 líneas) por app o módulo
│   ├── mission.md / tech-stack.md / roadmap.md
│   └── ARCHITECTURE.md / DESIGN_SYSTEM.md / SECURITY.md / BACKEND_CONTRACT.md / APP_TEMPLATE.md / MODULE_CONTRACT.md
├── packages/                        # Núcleo Protegido de Plataforma (Solo editable por Mantenedores del IDP)
│   ├── config/                      # @repo/config: TSConfig y preset ESLint
│   ├── ui/                          # @repo/ui: Tokens CSS (temas dsc-uni, tech-indigo, ai-guild) y componentes cerrados
│   ├── security/                    # @repo/security: Firewall XSS/SQLi/NoSQLi/PathTraversal/PromptInjection, CSP/HSTS y safeLogger
│   ├── api-client/                  # @repo/api-client: Cliente HTTP con accessToken en memoria, refreshInFlight y DTOs
│   ├── auth/                        # @repo/auth: Autorización por capacidades can(roles, permission), RoleGuard y simulador RBAC
│   ├── module-sdk/                  # @repo/module-sdk: Contratos Zod (defineApp, defineModule), ModuleErrorBoundary y ModuleHost
│   └── layouts/                     # @repo/layouts: Shells maestros (ExternalPublicShell, EventLandingShell, InternalDashboardShell)
├── apps/                            # Aplicaciones Desplegables Independientemente (Cada una con su SPEC.md local)
│   ├── external-community-web/      # Web Pública Oficial (Puerto 4310 — ExternalPublicShell)
│   └── internal-board-portal/       # Panel Operativo Interno (Puerto 4320 — InternalDashboardShell + RBAC)
├── modules/                         # Módulos Enchufables Aislados (Cada uno con su SPEC.md local)
│   ├── external-community-web/      # 4 módulos públicos: /nosotros, /team, /eventos, /contacto
│   └── internal-board-portal/       # 10 módulos internos: /eventos, /proyectos, /equipo, /unidades, /ciclos, /sitio, /mensajes, /usuarios, /auditoria, /certificates
└── tooling/
    ├── validators/                  # Guardrails Zero-Trust (validate-apps, validate-modules, enforce-guardrails, validate-security, validate-pr-scope)
    └── generators/                  # CLI: run-app.mjs (ejecución individual), create-app.mjs y create-module.mjs
```

---

## 2. Catálogo Completo de Flags, Layouts, Temas, Iconos, Roles y Permisos

Esta sección reúne todos los valores válidos exigidos por `@repo/module-sdk`, `@repo/ui` y `@repo/auth`. No necesitas memorizarlos: **tu Agente de IA puede elegirlos por ti** (ver Guías 3 y 4), pero aquí tienes la referencia completa.

### 2.1 Flags del Generador de Aplicaciones (`pnpm create:app`)

| Flag | ¿Obligatorio? | Valores Permitidos / Formato | Explicación |
| :--- | :--- | :--- | :--- |
| `--id` | Sí | `external-<slug>` o `internal-<slug>` (kebab-case: minúsculas, números y `-`) | Si empieza con `external-`, crea una app pública sin login obligatorio. Si empieza con `internal-`, crea una app privada con RBAC obligatorio. |
| `--name` | Sí | Texto entre comillas (ej. `"Gestor de Agendas"`) | Nombre oficial visible en la cabecera, título SEO y panel. |
| `--layout` | Opcional | `external-public` \| `event-landing` \| `internal-dashboard` | Shell visual de `@repo/layouts` (ver detalle en 2.2). Si el `--id` empieza con `internal-`, el generador fuerza automáticamente `internal-dashboard`. |
| `--port` | Opcional | Número entre `4310` y `4990` (por defecto `4330`) | Puerto de desarrollo local. **PROHIBIDO usar `3000` o `3001`** (`specs/SECURITY.md`). Usa saltos de 10 (`4330`, `4340`, `4350`). |

### 2.2 Tipos de `--layout` disponibles (`@repo/layouts`)

| Valor de `--layout` | Audiencia Permitida | Componente Shell que monta | ¿Cuándo elegirlo? |
| :--- | :--- | :--- | :--- |
| `external-public` | Solo `external-*` | `ExternalPublicShell` | Portales públicos institucionales, webs de capítulos estudiantiles, blogs o catálogos abiertos con barra de navegación superior (`header-nav`) y footer. |
| `event-landing` | Solo `external-*` | `EventLandingShell` | Landings de eventos, hackathons, talleres o convocatorias con cintillo superior de fecha/ubicación (`eventDate`, `eventLocation`) y botón CTA de registro. |
| `internal-dashboard` | Solo `internal-*` | `InternalDashboardShell` | Aplicaciones operativas internas, paneles administrativos, gestores de agendas, tesorería o CRM con barra lateral (`sidebar-main`), selector RBAC y `<RoleGuard>` activo. |

### 2.3 Temas Visuales White-Label (`community.themePreset` en `app.config.ts`)

| Valor de `themePreset` | Estética / Paleta Semántica | Caso de uso recomendado |
| :--- | :--- | :--- |
| `dsc-uni` | Azul institucional tecnológico de alto contraste (valor por defecto) | Comunidades de desarrollo, capítulos estudiantiles y portales académicos. |
| `tech-indigo` | Índigo profundo e ingeniería | Clubes de ingeniería, robótica, electrónica o sistemas. |
| `ai-guild` | Verde esmeralda / cibernético oscuro | Clubes de Inteligencia Artificial, Data Science, Ciberseguridad o Hackathons. |

### 2.4 Flags del Generador de Módulos (`pnpm create:module`)

| Flag | ¿Obligatorio? | Valores Permitidos / Formato | Explicación |
| :--- | :--- | :--- | :--- |
| `--app` | Sí | ID exacto de una carpeta en `apps/` (ej. `internal-board-portal`) | Aplicación host donde se enchufará el módulo. |
| `--id` | Sí | Slug en `kebab-case` (ej. `agenda-studio`, `finanzas`) | Identificador único del módulo. Define el nombre de la carpeta y la ruta URL (`/<id>`). |
| `--title` | Sí | Texto entre comillas (ej. `"Agendas y Timer"`) | Título visible en el menú lateral o superior y en la cabecera `<PageHeader>`. |
| `--icon` | Opcional | Uno de los **39 iconos de `@repo/ui`** (por defecto `Layers`) | Icono vectorial del menú y cabecera (ver lista completa en 2.5). |
| `--roles` | Opcional | Roles separados por coma sin espacios: `admin,board,volunteer,member,guest` | Roles que pueden acceder al módulo a través de `<RoleGuard>`. Si se omite, el módulo es público. |

### 2.5 Lista Completa de los 39 Iconos Válidos (`--icon` e `<Icon name="..." />`)

```text
Activity       AlertTriangle  ArrowRight     Award          BookOpen       Calendar
CheckCircle2   ChevronRight   Clock          Code2          Compass        ExternalLink
FileCheck      Filter         FolderKanban   Globe          GraduationCap  Home
Info           Layers         LayoutDashboard Lock          LogOut         Mail
MapPin         Menu           Plus           RefreshCw      Rocket         Search
Settings       ShieldCheck    Sparkles       Terminal       UserCheck      UserPlus
Users          X
```

### 2.6 Roles, Permisos Granulares (`can()`) y Slots de Montaje (`module.config.ts`)

| Categoría | Valores Permitidos | Descripción |
| :--- | :--- | :--- |
| **Roles (`IDP_ROLES`)** | `admin`, `board`, `volunteer`, `member`, `guest` | Nivel jerárquico del usuario autenticado. |
| **Permisos (`IDP_PERMISSIONS`)** | `event:write`, `project:write`, `person:write`, `team-unit:write`, `term:write`, `site:write`, `message:read`, `user:write`, `audit:read` | Capacidades específicas verificadas con `can(user.roles, 'permiso')`. |
| **Slots (`mount.slot`)** | `sidebar-main`, `sidebar-footer`, `header-nav`, `landing-body`, `dashboard-overview` | Ubicación donde el Shell de la app inyecta el módulo. |
| **Tipo de Montaje (`mount.type`)** | `route` (página dedicada en `/<id>`) \| `section` (bloque incrustado en página) | Cómo se renderiza el módulo dentro de la aplicación. |

---

## 3. Gobernanza del Monorepo: ¿Dónde alojarlo y cómo separar roles (Mantenedores vs Desarrolladores)?

1. **Alojar en una GitHub Organization oficial:** Permite crear equipos (`@org/idp-maintainers` y `@org/app-developers`) y usar Cloudflare Pages con despliegues y Preview URLs ilimitados sin costo por asiento.
2. **Doble Candado Automático sobre el Núcleo del IDP y el `README.md`:**
   - **Candado 1 (`.github/CODEOWNERS` + Regla #8 de `AGENTS.md`):** Tanto los agentes como los desarrolladores tienen prohibido modificar `README.md`, `GUIA_DESARROLLADOR_JUNIOR.md`, `packages/**`, `tooling/**`, `specs/**` y archivos raíz.
   - **Candado 2 (`pnpm validate:pr-scope`):** En cada Pull Request, si el autor no pertenece a `vars.IDP_MAINTAINERS` e intenta modificar algo fuera de `apps/*`, `modules/*` o `specs/ACTIVE_SESSION.md`, el CI rechaza el PR automáticamente.

---

## Guía 1: Cómo comenzar a usar el proyecto (Ejecución individual sin levantar todas las apps)

```bash
# 1. Ver la lista de aplicaciones disponibles y sus puertos actuales (NO levanta ningún servidor pesado)
pnpm dev

# 2. Levantar ÚNICAMENTE la aplicación que necesitas trabajar:
pnpm dev external-community-web     # Levanta SOLO la web pública en http://localhost:4310
pnpm dev internal-board-portal      # Levanta SOLO el panel interno en http://localhost:4320
```

---

## Guía 2: Cómo usar cualquier Agente de IA (Con o Sin Slash Commands `/`)

Algunos agentes soportan comandos slash nativos (`/feature`, `/implement`, `/test`, `/security-review`), mientras que otros (como **Cursor Chat**, **Windsurf**, **GitHub Copilot Chat** o **Codex**) requieren que escribas la instrucción en texto normal.

Usa esta tabla de equivalencia en cualquier paso de las guías siguientes:

| Fase SDD | En Claude Code / OpenCode / Antigravity (Con `/`) | En Cursor / Windsurf / Copilot / Codex (Prompt en texto normal) |
| :--- | :--- | :--- |
| **1. Planificar (`feature`)** | `/feature <ruta> <descripción>` | `"Sigue .ai/commands/feature.md para <ruta>: <descripción>. Crea su SPEC.md y actualiza specs/ACTIVE_SESSION.md."` |
| **2. Programar (`implement`)** | `/implement` | `"Sigue .ai/commands/implement.md: lee specs/ACTIVE_SESSION.md, abre el SPEC.md activo y ejecuta solo el primer grupo pendiente [ ]."` |
| **3. Validar (`test`)** | `/test` | `"Sigue .ai/commands/test.md: ejecuta pnpm validate:all && pnpm typecheck && pnpm build y marca los criterios en el SPEC.md activo."` |
| **4. Auditar (`security`)** | `/security-review` | `"Sigue .ai/commands/security-review.md: audita el SPEC.md activo contra specs/SECURITY.md y reporta hallazgos."` |

---

## Guía 3: Cómo construir una Nueva Aplicación asistido por tu Agente

### Paso 3.1: Crear la App (El Agente te guía si no sabes el `--id`, `--layout` o `--port`)
Si tienes una idea de aplicación pero no sabes qué ID, layout o puerto corresponde, **solo pégale este prompt a tu Agente**:

```text
Quiero crear una nueva aplicación en este IDP para: [describe tu idea en 1 línea, ej. "gestionar agendas de reuniones de voluntarios con un timer"].
Todavía no he elegido el --id, el --layout ni el --port.
Por favor:
1. Revisa qué puertos están ocupados actualmente en apps/.
2. Hazme las preguntas necesarias (audiencia pública vs interna, tipo de layout y tema visual) para definir los parámetros correctos según specs/APP_TEMPLATE.md.
3. Cuando te responda, ejecuta por mí el comando pnpm create:app correspondiente y luego pnpm install.
```

### Paso 3.2: Planificar el alcance de la App (`feature`)
- **Con Slash Command (Claude Code / OpenCode):**
  ```text
  /feature apps/<id-de-tu-app> Configurar la pantalla principal, tema visual y estructura de navegación de la aplicación.
  ```
- **Sin Slash Command (Cursor / Copilot / Windsurf):**
  ```text
  Sigue .ai/commands/feature.md para apps/<id-de-tu-app>: Configurar la pantalla principal, tema visual y estructura de navegación de la aplicación.
  ```

### Paso 3.3: Implementar por grupos (`implement`)
- **Con Slash Command:** `/implement`
- **Sin Slash Command:** `"Sigue .ai/commands/implement.md y ejecuta el siguiente grupo pendiente [ ] del SPEC.md activo."`

---

## Guía 4: Cómo añadir un Nuevo Módulo dentro de una Aplicación asistido por tu Agente

### Paso 4.1 y 4.2: El Agente te ayuda a elegir `--app`, `--id`, `--icon` y `--roles` y crea el Módulo
No necesitas buscar manualmente el nombre de la app ni la lista de iconos. Pega este prompt en tu Agente:

```text
Quiero crear un nuevo módulo para: [describe qué hará tu pantalla/módulo, ej. "configurar agendas por horas/puntos con timer en vivo y generador de resúmenes"].
Ayúdame a elegir los parámetros correctos:
1. Muéstrame las aplicaciones existentes en apps/ y dime en cuál debería ir.
2. Sugiéreme el --id, --title, el --icon (de los 39 iconos válidos de @repo/ui) y los --roles (de @repo/auth) más adecuados.
3. Tras mi confirmación, ejecuta por mí pnpm create:module con esos parámetros y corre pnpm install.
```

### Paso 4.3: Planificar el `SPEC.md` del Módulo (`feature`)
- **Con Slash Command (Claude Code / OpenCode):**
  ```text
  /feature modules/<app-id>/<module-id> [Describe aquí todo lo que debe tener tu módulo: formularios, tablas, timer, filtros y permisos].
  ```
- **Sin Slash Command (Cursor / Copilot / Windsurf):**
  ```text
  Sigue .ai/commands/feature.md para modules/<app-id>/<module-id>: [Describe aquí todo lo que debe tener tu módulo: formularios, tablas, timer, filtros y permisos].
  ```

### Paso 4.4: Programar grupo por grupo (`implement`)
Ejecuta una vez por cada grupo pendiente `[ ]` del `SPEC.md`:
- **Con Slash Command:** `/implement`
- **Sin Slash Command:** `"Sigue .ai/commands/implement.md: lee specs/ACTIVE_SESSION.md, abre el SPEC.md activo, programa únicamente el primer grupo pendiente [ ], ejecuta pnpm validate:guardrails y marca [x]."`

---

## Guía 5: Cierre Todo-en-Uno (Tests + Seguridad + Git + Pull Request con 1 solo Prompt)

Para que el cierre sea lo más simple posible y **cero manual**, cuando termines la implementación pega **este único prompt** en tu Agente:

```text
Realiza el cierre completo de esta tarea siguiendo estos pasos en orden:
1. Ejecuta la fase de validación (.ai/commands/test.md): corre pnpm validate:all && pnpm typecheck && pnpm build. Si algún validador o tipo falla, corrígelo hasta que todo quede en verde y marca los criterios en el SPEC.md activo.
2. Ejecuta la auditoría de seguridad (.ai/commands/security-review.md) contra specs/SECURITY.md y confirma que no existan vulnerabilidades OWASP ni modificaciones en archivos protegidos (README.md, packages/*, tooling/*).
3. Crea una rama git con prefijo feat/, añade únicamente los archivos de apps/, modules/, specs/ACTIVE_SESSION.md y pnpm-lock.yaml, crea el commit descriptivo, haz push a origin y abre el Pull Request hacia main usando gh pr create.
```

---

## Guía 6: Arquitectura de Backend, Base de Datos y Paso a Producción con Agentes + CLIs (Supabase, Cloudflare, Vercel, GitHub)

### 6.1 ¿Todas las Apps comparten un mismo Backend o cada App tiene su propio Backend?

El IDP soporta **3 modalidades** según lo que necesite tu aplicación (se configura en `app.config.ts -> community.apiBaseUrl` y en la variable de entorno `NEXT_PUBLIC_API_URL`):

| Modalidad | ¿Cómo funciona? | ¿Cuándo usarla? |
| :--- | :--- | :--- |
| **Modalidad 1: Backend Central Compartido (`dsc-web-backend`)** *(Por defecto)* | Todas las apps de la organización apuntan al mismo servidor API (`NEXT_PUBLIC_API_URL=https://api.tucomunidad.org/api/v1`) y a la **misma Base de Datos PostgreSQL**. | Cuando quieres que los mismos usuarios, miembros, roles (`admin`, `board`, `volunteer`), eventos y proyectos estén disponibles en todas las apps sin duplicar cuentas. |
| **Modalidad 2: Backend / Base de Datos Propia por App (ej. Supabase dedicado)** | Una app específica en `apps/<mi-app>` apunta a su propio backend o proyecto de **Supabase** mediante su propio archivo `apps/<mi-app>/.env.local` y sus propias variables en Cloudflare/Vercel. | Cuando construyes una aplicación o experimento independiente que no comparte tablas con el resto del club. |
| **Modalidad 3: Utilidad 100% Frontend (Sin Base de Datos)** | La app funciona íntegramente en el navegador del usuario (ej. Timer de reuniones en vivo con generador de actas copiables). | Cuando no necesitas guardar historial en servidor desde el día 1. Despliega directo sin configurar base de datos. |

---

### 6.2 Variables de Entorno: ¿Cuáles existen y dónde van?

#### A. En cada Aplicación Frontend (`apps/<app-id>/.env.local` en local, o en el panel de Cloudflare/Vercel en producción)
```env
# URL base del Backend API al que se conectará @repo/api-client
NEXT_PUBLIC_API_URL="https://api.tucomunidad.org/api/v1"
```

#### B. En el Servidor Backend (`dsc-web-backend/.env` en producción)
```env
NODE_ENV="production"
# Conexión PostgreSQL (Supabase / Neon / Railway)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Secretos para firmar tokens JWT (Access en memoria RAM + Refresh en Cookie HttpOnly)
JWT_ACCESS_SECRET="<cadena-aleatoria-segura-de-64-caracteres>"
JWT_REFRESH_SECRET="<otra-cadena-aleatoria-segura-de-64-caracteres>"

# Dominios Frontend autorizados a enviar peticiones y cookies (separados por coma)
CORS_ORIGINS="https://tucomunidad.org,https://panel.tucomunidad.org,https://agendas.tucomunidad.org"

# Almacenamiento de imágenes y archivos (Cloudflare R2 o S3)
R2_ACCOUNT_ID="<tu-account-id>"
R2_ACCESS_KEY_ID="<tu-access-key>"
R2_SECRET_ACCESS_KEY="<tu-secret-key>"
R2_BUCKET_NAME="idp-community-media"
R2_PUBLIC_URL="https://media.tucomunidad.org"
```

---

### 6.3 Prompts para pasar a Producción usando tu Agente + CLIs Oficiales (Cero Configuración Manual)

Si instalaste las CLIs recomendadas en el **Paso 0.2** (`gh`, `supabase`, `wrangler`, `vercel`), **no tienes que entrar a configurar pantallas web a mano**. Pégale estos prompts a tu Agente según lo que quieras llevar a producción:

#### Prompt A — Configurar la Base de Datos en Producción con Supabase CLI + Prisma
*(Ejecútalo con tu Agente dentro del repositorio del backend o donde gestiones tu esquema Prisma)*:
```text
Usa la CLI de Supabase (npx supabase) y Prisma para dejar lista la base de datos en producción:
1. Verifica mi sesión con npx supabase projects list (o ayúdame a vincular el proyecto con npx supabase link).
2. Genera los secretos seguros para JWT_ACCESS_SECRET y JWT_REFRESH_SECRET usando node crypto.
3. Prepara el archivo .env.production.example con la estructura exacta de DATABASE_URL, DIRECT_URL, JWT_* y CORS_ORIGINS.
4. Ejecuta pnpm prisma migrate deploy para aplicar todas las migraciones en la base de datos PostgreSQL de producción.
```

#### Prompt B — Configurar los Secrets del Monorepo en GitHub usando `gh` CLI
```text
Ayúdame a configurar las variables y secretos de despliegue en GitHub usando la CLI gh sin salir de la terminal:
1. Verifica mi sesión con gh auth status.
2. Configura la variable de repositorio IDP_MAINTAINERS con mi usuario actual de GitHub usando: gh variable set IDP_MAINTAINERS --body "<mi-usuario>".
3. Pídeme los valores necesarios y ejecuta los comandos gh secret set para dejar configurados CLOUDFLARE_API_TOKEN y CLOUDFLARE_ACCOUNT_ID (o VERCEL_TOKEN y VERCEL_ORG_ID).
```

#### Prompt C — Crear y Desplegar una App en Cloudflare Pages usando `wrangler` CLI
```text
Usa la CLI de Cloudflare (npx wrangler) para preparar y desplegar en producción la aplicación apps/<id-de-tu-app>:
1. Crea el proyecto en Cloudflare Pages con el nombre estándar del pipeline ejecutando: npx wrangler pages project create idp-<id-de-tu-app> --production-branch main.
2. Configura la variable NEXT_PUBLIC_API_URL en el proyecto de Cloudflare Pages.
3. Compila únicamente esta aplicación con pnpm turbo run build --filter=@apps/<id-de-tu-app> y verifica el despliegue con npx wrangler pages deploy.
```

#### Prompt D — Vincular y Desplegar una App en Vercel usando `vercel` CLI
```text
Usa la CLI de Vercel (npx vercel) para vincular y desplegar la aplicación apps/<id-de-tu-app>:
1. Ejecuta npx vercel link dentro de apps/<id-de-tu-app>.
2. Configura la variable de entorno NEXT_PUBLIC_API_URL usando npx vercel env add.
3. Obtén el projectId y orgId generados en .vercel/project.json y regístralos automáticamente en los Secrets de GitHub usando gh secret set VERCEL_PROJECT_ID_<id-de-tu-app>.
```

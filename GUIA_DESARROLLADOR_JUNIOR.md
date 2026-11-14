# Guía Completa para Desarrolladores Junior: Cómo Funciona y Cómo Usar el IDP de Frontend

Bienvenido/a al repositorio del **Internal Developer Platform (IDP) de Frontend**. Esta guía está escrita en lenguaje claro y directo para que cualquier desarrollador técnico o voluntario entienda **qué es esta plataforma, cómo clonarla, cómo usar cualquier Agente de IA (tenga o no comandos `/`), cómo funciona el Backend/Base de Datos (compartido vs. independiente) y qué prompts exactos copiar y pegar para llegar hasta producción con ayuda de CLIs (`gh`, `supabase`, `wrangler`, `vercel`)**.

---

## Índice

1. [Paso 0 (Previo): Requisitos, CLIs Recomendadas y Clonación](#0-paso-0-previo-requisitos-clis-recomendadas-y-clonación)
2. [¿Qué es este proyecto? (La analogía LEGO)](#1-qué-es-este-proyecto-la-analogía-lego)
3. [Mapa del Repositorio: ¿Qué puedo tocar y qué NO debo tocar?](#2-mapa-del-repositorio-qué-puedo-tocar-y-qué-no-debo-tocar)
4. [Diccionario Completo de Flags, Layouts, Temas, Iconos, Roles y Permisos](#3-diccionario-completo-de-flags-layouts-temas-iconos-roles-y-permisos)
5. [Las 8 Reglas de Oro (Guardrails) explicadas en simple](#4-las-8-reglas-de-oro-guardrails-explicadas-en-simple)
6. [Cómo usar cualquier Agente de IA (Con o Sin comandos `/`)](#5-cómo-usar-cualquier-agente-de-ia-con-o-sin-comandos-)
7. [Recetario Paso a Paso: Prompts de Principio a Fin (El Agente te guía)](#6-recetario-paso-a-paso-prompts-de-principio-a-fin-el-agente-te-guía)
8. [Backend, Base de Datos y Paso a Producción Asistido por Agentes + CLIs](#7-backend-base-de-datos-y-paso-a-producción-asistido-por-agentes--clis)
9. [Preguntas Frecuentes (FAQ para Juniors)](#8-preguntas-frecuentes-faq-para-juniors)

---

## 0. Paso 0 (Previo): Requisitos, CLIs Recomendadas y Clonación

### 0.1 Requisitos básicos en tu PC

1. **Node.js `22.x` o superior** (`node -v`).
2. **pnpm `11.x`** (`corepack enable && corepack prepare pnpm@11.24.0 --activate`).
3. **Git** instalado.
4. **Tu Agente de IA:** Claude Code (`claude`), OpenCode (`opencode`), Cursor, Windsurf, Copilot, Antigravity o Codex.

### 0.2 Instala estas 4 CLIs para que tu Agente haga el trabajo de Nube y Base de Datos por ti

En lugar de entrar a configurar pantallas web complejas en GitHub, Supabase, Cloudflare o Vercel, instala estas herramientas una sola vez en tu terminal. Así **tu Agente de IA podrá ejecutarlas por ti mediante simples prompts**:


| CLI                             | ¿Qué le permite hacer a tu Agente?                                               | Instalación rápida y Login único                                        |
| :------------------------------- | :-------------------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| **GitHub CLI (`gh`)**           | Subir tu rama, abrir el Pull Request y guardar Secrets de despliegue.            | `winget install GitHub.cli` (o `brew install gh`) -&gt; `gh auth login` |
| **Supabase CLI (`supabase`)**   | Crear o conectar tu base de datos PostgreSQL y aplicar tablas desde la terminal. | `npm install -g supabase` -&gt; `npx supabase login`                    |
| **Cloudflare CLI (`wrangler`)** | Crear proyectos en Cloudflare Pages, configurar variables y desplegar gratis.    | `npm install -g wrangler` -&gt; `npx wrangler login`                    |
| **Vercel CLI (`vercel`)**       | Vincular y desplegar una app en Vercel y configurar sus variables de entorno.    | `npm install -g vercel` -&gt; `npx vercel login`                        |


### 0.3 Clonar el repositorio e inicializar

```bash
git clone https://github.com/<tu-organizacion>/internal-dev-student-platform.git
cd internal-dev-student-platform
pnpm install
pnpm sdd:sync
```

> **O pídeselo directamente a tu Agente apenas clones el repo:**
>
> ```text
> Inicializa el proyecto ejecutando pnpm install y pnpm sdd:sync. Luego ejecuta pnpm dev y dime qué aplicaciones existen actualmente en el monorepo y en qué puertos corren.
> ```

---

## 1. ¿Qué es este proyecto? (La analogía LEGO)

Este repositorio es una **fábrica de aplicaciones tipo LEGO** basada en un **Monorepo** (`pnpm workspaces` + `Turborepo`) con **Next.js 15 y React 19**:

- **Las piezas base (`packages/`)** ya están construidas y blindadas en seguridad por los mantenedores.
- **Las aplicaciones (`apps/`)** son las webs independientes (cada una con su puerto `4310`, `4320`, `4330+` y su propio dominio en producción).
- **Los módulos (`modules/`)** son bloques enchufables aislados (como "Eventos", "Finanzas" o "Timer de Agendas") que se conectan a una aplicación sin riesgo de romper el resto.

### 1.1 Mapa Visual Simplificado (Cómo encajan las piezas y cuál es tu flujo)

```mermaid
flowchart TB
    %% ==========================================
    %% FLUJO DEL DESARROLLADOR JUNIOR + AGENTE IA
    %% ==========================================
    subgraph TU_FLUJO["Tu Flujo de Trabajo Diario (Tú + Tu Agente de IA)"]
        direction LR
        PASO1["1. Pides crear App o Módulo<br/>(pnpm create:app / create:module)"] --> PASO2["2. Planifican el SPEC.md<br/>(/feature + ACTIVE_SESSION.md)"]
        PASO2 --> PASO3["3. Tu Agente programa por grupos<br/>(/implement en apps/* o modules/*)"]
        PASO3 --> PASO4["4. Cierre automático<br/>(/test + /security-review + PR con gh)"]
    end

    %% ==========================================
    %% QUÉ SE CONSTRUYE: NIVEL EXTERNO VS INTERNO
    %% ==========================================
    subgraph APPS_Y_MODS["Lo que Tú y tu Agente Construyen (Zonas Editables)"]
        direction LR
        subgraph EXTERNO["Camino A: Webs Externas / Públicas (apps/external-*)"]
            EXT_WEB["Web Pública (Puerto 4310 / 4330+)<br/>Sin login obligatorio · Shell Público"] --> EXT_MOD["Módulos Públicos (modules/external-*)<br/>Ej: /nosotros · /eventos · /contacto"]
        end

        subgraph INTERNO["Camino B: Paneles Internos / Privados (apps/internal-*)"]
            INT_WEB["Panel Interno (Puerto 4320 / 4330+)<br/>Con Login + Guardia de Roles (RoleGuard)"] --> INT_MOD["Módulos Internos (modules/internal-*)<br/>Ej: /proyectos · /usuarios · /agendas<br/>Permisos con can(roles, permiso)"]
        end
    end

    %% ==========================================
    %% NÚCLEO LISTO PARA USAR (NO SE TOCA)
    %% ==========================================
    subgraph NUCLEO["Las Piezas LEGO Listas para Usar (packages/* — No las editas, solo las importas)"]
        direction LR
        LEGO_UI["@repo/ui<br/>Botones, Tablas, Cards,<br/>Colores e Iconos listos"]
        LEGO_SEC["@repo/security<br/>Escudo contra Hackeos<br/>(validateSafeInput)"]
        LEGO_API["@repo/api-client<br/>Conexión segura al Backend<br/>y Base de Datos"]
    end

    %% Conexiones simples
    PASO3 -->|"Escribe código aquí"| APPS_Y_MODS
    EXT_MOD -->|"Usa piezas de"| LEGO_UI
    INT_MOD -->|"Usa piezas de"| LEGO_UI
    EXT_MOD -->|"Limpia formularios con"| LEGO_SEC
    INT_MOD -->|"Limpia formularios con"| LEGO_SEC
    EXT_MOD -->|"Lee/Guarda datos con"| LEGO_API
    INT_MOD -->|"Lee/Guarda datos con"| LEGO_API
```

---

## 2. Mapa del Repositorio: ¿Qué puedo tocar y qué NO debo tocar?


| Carpeta                                               | ¿Qué contiene?                                                                                                                            | ¿Quién puede editarla?                                                  |
| :----------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- |
| **`apps/`**                                           | Las aplicaciones web independientes (`external-*` públicas e `internal-*` privadas).                                                      | **Tú y tu Agente**                                                      |
| **`modules/`**                                        | Las pantallas o módulos enchufables de cada aplicación (`modules/<app-id>/<module-id>`).                                                  | **Tú y tu Agente**                                                      |
| **`specs/ACTIVE_SESSION.md`**                         | Puntero de 25 líneas que le dice a la IA en qué módulo estás trabajando hoy.                                                              | **Tú y tu Agente**                                                      |
| **`README.md` / `packages/` / `tooling/` / `specs/`** | Documentación raíz y motor del IDP (`@repo/ui`, `@repo/layouts`, `@repo/security`, `@repo/auth`, `@repo/api-client`, `@repo/module-sdk`). | **Nadie salvo Mantenedores del IDP** (Bloqueado en `AGENTS.md` y en CI) |


---

## 3. Diccionario Completo de Flags, Layouts, Temas, Iconos, Roles y Permisos

No tienes que memorizar esta sección (en la Sección 6 verás cómo tu Agente elige estos valores por ti haciéndote preguntas simples), pero aquí tienes el catálogo oficial:

### 3.1 Flags para crear una Aplicación (`pnpm create:app`)

- **`--id`**: `external-<slug>` (pública sin login obligatorio) o `internal-<slug>` (privada con login y roles).
- **`--name`**: Nombre entre comillas (ej. `"Gestor de Agendas"`).
- **`--layout`**:
  - `external-public`: Web pública con barra superior y footer (`ExternalPublicShell`).
  - `event-landing`: Landing de evento/hackathon con banner de fecha/lugar y botón de inscripción (`EventLandingShell`).
  - `internal-dashboard`: Panel interno con barra lateral izquierda y selector RBAC (`InternalDashboardShell`). Obligatorio en `internal-*`.
- **`--port`**: Puerto entre `4310` y `4990` en saltos de 10 (`4330`, `4340`...). **Prohibidos `3000` y `3001`**.

### 3.2 Temas de Color (`community.themePreset` en `app.config.ts`)

- **`dsc-uni`**: Azul institucional tecnológico (por defecto).
- **`tech-indigo`**: Índigo profundo e ingeniería.
- **`ai-guild`**: Verde esmeralda / estilo cibernético.

### 3.3 Flags para crear un Módulo (`pnpm create:module`)

- **`--app`**: ID de la aplicación donde se enchufará (ej. `internal-board-portal` o tu nueva app).
- **`--id`**: Identificador en minúsculas y guiones (ej. `agenda-studio`). Define la URL `/<id>`.
- **`--title`**: Nombre en el menú lateral o superior (ej. `"Agendas y Timer"`).
- **`--icon`**: Uno de los **39 iconos válidos de `@repo/ui`**:
`Activity`, `AlertTriangle`, `ArrowRight`, `Award`, `BookOpen`, `Calendar`, `CheckCircle2`, `ChevronRight`, `Clock`, `Code2`, `Compass`, `ExternalLink`, `FileCheck`, `Filter`, `FolderKanban`, `Globe`, `GraduationCap`, `Home`, `Info`, `Layers`, `LayoutDashboard`, `Lock`, `LogOut`, `Mail`, `MapPin`, `Menu`, `Plus`, `RefreshCw`, `Rocket`, `Search`, `Settings`, `ShieldCheck`, `Sparkles`, `Terminal`, `UserCheck`, `UserPlus`, `Users`, `X`.
- **`--roles`**: Roles separados por coma entre los **5 roles oficiales**: `admin,board,volunteer,member,guest`.

---

## 4. Las 8 Reglas de Oro (Guardrails) explicadas en simple

Tu agente ya conoce estas reglas porque están en `AGENTS.md`, y el comando `pnpm validate:all` las verifica automáticamente:

1. **Cero colores crudos de Tailwind (`bg-blue-500`) o tamaños fijos (`w-[300px]`):** Solo tokens semánticos de `@repo/ui` (`bg-background`, `bg-surface`, `text-foreground`, `bg-primary`, `border-subtle`, `text-status-success`, `text-status-danger`).
2. **Cero etiquetas nativas `button`, `input`, `select`, `textarea` o `table`:** Solo componentes `<Button>`, `<Input>`, `<Select>`, `<Textarea>`, `<DataTable>` de `@repo/ui`.
3. **Cero `header`, `footer` o `aside` propios:** El Shell de `@repo/layouts` dibuja la estructura; tú usas `<PageHeader>` y `<Card>`.
4. **Cero imports entre módulos:** Un módulo nunca importa de otro módulo ni de `apps/*`.
5. **Seguridad en formularios:** Todo input de usuario pasa por `validateSafeInput()` y `sanitizeText()` de `@repo/security`.
6. **Cero `localStorage` para sesiones:** Los tokens viven en memoria RAM dentro de `@repo/api-client`.
7. **Puertos `4310+`:** Prohibido usar `3000` o `3001`.
8. **Prohibido tocar `README.md` o `packages/*`:** Ni tú ni el agente deben modificar archivos del núcleo al crear una app o módulo.

---

## 5. Cómo usar cualquier Agente de IA (Con o Sin comandos `/`)

- Si usas **Claude Code**, **OpenCode** o **Antigravity**, puedes escribir directamente los comandos cortos con barra: `/feature`, `/implement`, `/test`, `/security-review`.
- Si usas **Cursor Chat**, **Windsurf**, **GitHub Copilot Chat** o **Codex**, a veces el chat no reconoce `/` como comando propio. En ese caso, **usa el Prompt Equivalente en Texto Normal** de esta tabla:


| Acción         | En Claude Code / OpenCode (Con `/`) | En Cursor / Windsurf / Copilot / Codex (Sin `/`)                                                                          |
| :-------------- | :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **Planificar** | `/feature <ruta> <tu idea>`         | `"Sigue las instrucciones de .ai/commands/feature.md para <ruta>: <tu idea>"`                                             |
| **Programar**  | `/implement`                        | `"Sigue las instrucciones de .ai/commands/implement.md y ejecuta solo el primer grupo pendiente [ ] del SPEC.md activo."` |
| **Probar**     | `/test`                             | `"Sigue las instrucciones de .ai/commands/test.md ejecutando pnpm validate:all && pnpm typecheck && pnpm build."`         |
| **Auditar**    | `/security-review`                  | `"Sigue las instrucciones de .ai/commands/security-review.md y audita el SPEC.md activo contra specs/SECURITY.md."`       |


---

## 6. Recetario Paso a Paso: Prompts de Principio a Fin (El Agente te guía)

Aquí tienes los prompts exactos para que el Agente te haga las preguntas necesarias, elija los parámetros técnicos por ti, programe y suba todo.

### Paso 1: Crear una Nueva Aplicación (Sin que tengas que saber el `--id`, `--layout` ni `--port`)

Pega este prompt en tu Agente:

```text
Quiero crear una nueva aplicación desde cero para: [escribe tu idea aquí, ej. "gestionar agendas de reuniones de voluntarios con un timer configurable y generador de resúmenes"].
No sé todavía qué --id, --layout ni --port debo usar.
Por favor:
1. Revisa qué aplicaciones y puertos existen actualmente en apps/.
2. Hazme las preguntas necesarias (si es pública o interna, qué diseño le corresponde y qué tema de color prefiero) para que tú determines el --id, --layout y el siguiente puerto libre (4330+).
3. Con mis respuestas, ejecuta tú mismo pnpm create:app y pnpm install.
```

---

### Paso 2: Crear un Nuevo Módulo (El Agente te sugiere `--app`, `--id`, `--icon` y `--roles`)

Tanto si acabas de crear la app en el Paso 1 como si vas a añadir el módulo a una app que ya existía, pega este prompt en tu Agente:

```text
Quiero crear un módulo llamado [nombre de tu idea, ej. "Estudio de Agendas y Timer"] que permita [describe brevemente qué hará].
Ayúdame a configurar sus parámetros:
1. Confírmame en cuál aplicación de apps/ debe enchufarse (--app).
2. Sugiéreme el --id en kebab-case, el --title, el --icon más adecuado (de los 39 iconos válidos en @repo/ui) y los --roles permitidos (de @repo/auth).
3. Cuando te confirme, ejecuta tú mismo el comando pnpm create:module y corre pnpm install.
```

---

### Paso 3: Planificar el detalle funcional del Módulo (`feature`)

- **Si tu agente acepta `/` (ej. Claude Code / OpenCode):**
  ```text
  /feature modules/internal-meeting-agendas/agenda-studio Construir utilidad interna para gestionar agendas de reuniones con voluntarios:
  1. Configurador por cantidad de horas/minutos totales y cantidad de puntos de agenda.
  2. Timer en vivo por punto de agenda y tiempo total con alertas visuales de @repo/ui.
  3. Formulario por punto para acuerdos y próximos pasos validado con validateSafeInput() y sanitizeText() de @repo/security.
  4. Generador de resumen ejecutivo y tabla de próximos pasos listo para copiar.
  5. Registrar el módulo en registry.ts, package.json, next.config.mjs y src/app/page.tsx de la app.
  ```
- **Si tu agente NO acepta `/` (ej. Cursor / Copilot / Windsurf):**
*(Pega exactamente el mismo texto pero cambiando la primera línea por: `"Sigue las instrucciones de .ai/commands/feature.md para modules/internal-meeting-agendas/agenda-studio:"`).*

---

### Paso 4: Programar grupo por grupo (`implement`)

Repite este paso por cada grupo `[ ]` que tenga tu archivo `SPEC.md`:

- **Con `/`:**
  ```text
  /implement
  ```
- **Sin `/`:**
  ```text
  Sigue las instrucciones de .ai/commands/implement.md: lee specs/ACTIVE_SESSION.md, abre el SPEC.md activo, ejecuta únicamente el primer grupo pendiente [ ], corre pnpm validate:guardrails y marca [x].
  ```

> **¿Quieres ver tu aplicación en el navegador mientras el agente avanza?**
> Pídele al agente: `"Levanta solo mi aplicación con pnpm dev <id-de-la-app>"` y abre `http://localhost:4330`.

---

### Paso 5: Cierre Todo-en-Uno (Validar + Auditar Seguridad + Git + Pull Request con 1 solo Prompt)

En vez de correr comandos manuales de pruebas y de Git por separado, pega **este único prompt** cuando hayas terminado el Paso 4:

```text
Haz el cierre completo de mi desarrollo ejecutando todo esto por mí en orden:
1. Ejecuta la validación completa (.ai/commands/test.md): corre pnpm validate:all && pnpm typecheck && pnpm build. Si aparece cualquier error, corrígelo hasta que los 3 comandos pasen en verde y marca las casillas de validación en el SPEC.md activo.
2. Ejecuta la auditoría de seguridad (.ai/commands/security-review.md) verificando que se cumpla specs/SECURITY.md y que NO se haya modificado README.md, packages/* ni tooling/*.
3. Crea una rama git nueva con prefijo feat/, haz git add únicamente de mis cambios en apps/, modules/, specs/ACTIVE_SESSION.md y pnpm-lock.yaml, haz el commit, súbelo con git push y abre el Pull Request hacia main usando gh pr create.
```

> **IMPORTANTE si tenías `pnpm dev` abierto al correr `pnpm build`:**
> Cuando se ejecuta `pnpm build` (`next build`), Next.js sobrescribe la carpeta `.next/` con los archivos de producción. Si tenías `http://localhost:4310` o `http://localhost:4320` corriendo en otra terminal con `pnpm dev`, la página perderá sus estilos o dará error `500`. Para solucionarlo, detén el servidor (`Ctrl + C`), vuelve a ejecutar `pnpm dev:all` (o `pnpm dev <app>`) y recarga el navegador (`Ctrl + Shift + R`).

---

## 7. Backend, Base de Datos y Paso a Producción Asistido por Agentes + CLIs

### 7.1 ¿Existe un solo Backend compartido para todo el proyecto o cada App tiene su propio Backend?

Esta es una duda clave y la respuesta es muy sencilla: **el IDP soporta las 3 formas** según lo que necesites construir:

1. **Forma 1: Usar el Backend Central Compartido (`dsc-web-backend`) — *Lo más común en el club***
   - La web pública (`external-community-web`), el panel de directiva (`internal-board-portal`) y tus nuevas utilidades internas pueden conectarse al **mismo servidor Backend y a la misma Base de Datos PostgreSQL**.
   - **Ventaja:** Los usuarios, miembros del club, roles (`admin`, `board`, `volunteer`), ciclos académicos y eventos son los mismos en todas las aplicaciones. Un voluntario inicia sesión una sola vez y ya tiene permiso en todas las herramientas internas.
2. **Forma 2: Que tu nueva App tenga su propio Backend o su propio proyecto en Supabase independiente**
   - Si estás creando una aplicación nueva que no tiene nada que ver con las tablas del club y quieres que tenga su **propia base de datos separada** (por ejemplo, un proyecto nuevo en Supabase o un backend propio), solo configuras la variable `NEXT_PUBLIC_API_URL` dentro de tu carpeta `apps/<tu-app>/.env.local` (y en el Cloudflare/Vercel de esa app) apuntando a tu propio servidor. Las demás apps del monorepo ni se enteran.
3. **Forma 3: Aplicaciones que no necesitan Base de Datos (100% en navegador)**
   - Si tu aplicación es una utilidad interactiva en vivo (como un Timer de reuniones que calcula tiempos y arma el texto de resumen para copiar y pegar en WhatsApp/Discord/Notion), **no necesita base de datos para salir a producción**. Funciona desde el primer día solo desplegando el frontend.

---

### 7.2 ¿Cuáles son las Variables de Entorno que se usan?

1. **En tu Aplicación Frontend (`apps/<tu-app>/.env.local` en tu PC, o en Cloudflare/Vercel en producción):**
   ```env
    # Dirección del servidor Backend al que llamará @repo/api-client
    NEXT_PUBLIC_API_URL="https://api.tucomunidad.org/api/v1"
   ```
2. **En el Servidor Backend (cuando configuras la API conectada a PostgreSQL en Supabase/Neon):**
   ```env
    NODE_ENV="production"
    DATABASE_URL="postgresql://postgres.[id]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
    DIRECT_URL="postgresql://postgres.[id]:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
    JWT_ACCESS_SECRET="<secreto-largo-generado-por-el-agente>"
    JWT_REFRESH_SECRET="<otro-secreto-largo-generado-por-el-agente>"
    CORS_ORIGINS="https://tucomunidad.org,https://panel.tucomunidad.org,https://agendas.tucomunidad.org"
    R2_ACCOUNT_ID="<id-cloudflare>"
    R2_ACCESS_KEY_ID="<access-key>"
    R2_SECRET_ACCESS_KEY="<secret-key>"
    R2_BUCKET_NAME="idp-media"
    R2_PUBLIC_URL="https://media.tucomunidad.org"
   ```

---

### 7.3 Prompts para que tu Agente configure la Base de Datos y el Despliegue en Producción usando CLIs

Con las CLIs instaladas en el **Paso 0.2** (`gh`, `supabase`, `wrangler`, `vercel`), **pídele a tu Agente que haga la configuración productiva por ti** con estos prompts:

#### Prompt 1: Configurar o actualizar la Base de Datos PostgreSQL con Supabase CLI

```text
Ayúdame a configurar la base de datos de producción usando la CLI de Supabase y Prisma:
1. Verifica mis proyectos con npx supabase projects list y ayúdame a vincular el proyecto correcto.
2. Genera automáticamente claves criptográficas seguras para JWT_ACCESS_SECRET y JWT_REFRESH_SECRET y déjame listo el archivo .env con DATABASE_URL, DIRECT_URL y CORS_ORIGINS.
3. Si mi módulo necesita una tabla nueva en PostgreSQL, crea el modelo Prisma con UUIDv7 y timestamptz y aplica la migración con pnpm prisma migrate deploy.
```

#### Prompt 2: Subir los Secrets de Despliegue a GitHub usando `gh` CLI

```text
Usa la CLI de GitHub (gh) para dejar configurados los secretos y variables de CI/CD de este repositorio:
1. Verifica mi cuenta con gh auth status.
2. Registra la variable IDP_MAINTAINERS con mi usuario ejecutando gh variable set IDP_MAINTAINERS.
3. Guíame paso a paso para guardar los secretos CLOUDFLARE_API_TOKEN y CLOUDFLARE_ACCOUNT_ID (o VERCEL_TOKEN y VERCEL_ORG_ID) usando gh secret set.
```

#### Prompt 3: Crear el proyecto y desplegar mi App en Cloudflare Pages con `wrangler` CLI

```text
Usa la CLI de Cloudflare (npx wrangler) para publicar mi aplicación apps/<id-de-mi-app> en producción:
1. Crea el proyecto en Cloudflare Pages con el nombre exacto que usa el pipeline: npx wrangler pages project create idp-<id-de-mi-app> --production-branch main.
2. Ayúdame a definir la variable de entorno NEXT_PUBLIC_API_URL en ese proyecto.
3. Compila solo mi aplicación con pnpm turbo run build --filter=@apps/<id-de-mi-app> y realiza el despliegue inicial con npx wrangler pages deploy.
```

#### Prompt 4: Vincular y desplegar mi App en Vercel con `vercel` CLI (Si prefieres Vercel)

```text
Usa la CLI de Vercel (npx vercel) para dejar mi aplicación apps/[[ORCA_RICH_MD:39a552efd7a8641d27b36f566c7f5c55:inline-html:%3Cid-de-mi-app%3E]] en producción:
1. Vincula la carpeta apps/[[ORCA_RICH_MD:39a552efd7a8641d27b36f566c7f5c55:inline-html:%3Cid-de-mi-app%3E]] con npx vercel link.
2. Configura la variable NEXT_PUBLIC_API_URL en Vercel con npx vercel env add.
3. Lee el archivo .vercel/project.json generado y sube automáticamente el projectId al secreto VERCEL_PROJECT_ID_[[ORCA_RICH_MD:39a552efd7a8641d27b36f566c7f5c55:inline-html:%3Cid-de-mi-app%3E]] de GitHub usando gh secret set.
```

---

## 8. Preguntas Frecuentes (FAQ)

### 1. ¿Cómo pruebo diferentes roles (`admin`, `board`, `volunteer`, `guest`) en mi PC?

Cuando levantas una app en modo desarrollo (`pnpm dev <id-de-tu-app>`), verás en la esquina el **Simulador RBAC (`RbacRoleSwitcher`)**. Ahí puedes cambiar de rol con un clic para comprobar cómo se comporta tu módulo con distintos permisos. En producción ese selector desaparece automáticamente.

### 2. ¿Qué hago si `pnpm validate:all` muestra un error en rojo?

Copia el mensaje de error y pégale este prompt a tu agente:

```text
Corrige las violaciones reportadas por pnpm validate:all usando exclusivamente componentes y tokens semánticos de @repo/ui y vuelve a ejecutar la validación.
```

### 3. ¿Por qué se rompió o perdió los estilos `http://localhost:4310` (o `4320`) después de correr `pnpm build`?

Porque `pnpm build` (`next build`) sobrescribe la carpeta `.next/` con archivos de producción mientras `next dev` seguía abierto en memoria, haciendo que los archivos CSS/JS de desarrollo devuelvan `500 Internal Server Error`.
**Solución en 5 segundos:**
1. En la terminal donde corre `pnpm dev`, presiona **`Ctrl + C`**.
2. Vuelve a ejecutar **`pnpm dev:all`** (o `pnpm dev:external` / `pnpm dev:internal`).
3. Recarga el navegador con **`Ctrl + Shift + R`**.


# Mision del Proyecto (`specs/mission.md`)

## 1. Que Problema Resolvemos
Multiples desarrolladores, directivos y voluntarios construyen aplicaciones web independientes y nuevos modulos dentro de aplicaciones existentes utilizando distintos asistentes de IA (OpenCode, Claude Code, Cursor, Windsurf, Codex). Sin una plataforma gobernada por especificaciones, aparecen cuatro problemas criticos:
1. **Fragmentacion visual:** Cada voluntario o agente inventa colores, botones, headers y estilos dispares.
2. **Duplicacion de infraestructura:** Se reescriben autenticacion, RBAC, cliente HTTP, manejo de errores y validaciones de seguridad en cada proyecto.
3. **Perdida de contexto entre sesiones:** Al cambiar de agente o limpiar la ventana de contexto, se pierden las decisiones arquitectonicas y el estado de avance.
4. **Riesgos de seguridad y acoplamiento:** Un cambio en una seccion secundaria puede romper la aplicacion principal o introducir vulnerabilidades OWASP.

## 2. Nuestra Solucion: IDP de Frontend Spec-Driven & White-Label Open Source
Construimos un **Internal Developer Platform (IDP) de Frontend** en monorepo (`pnpm workspaces` + `Turborepo`) con:
- **Dos niveles de extension:**
  1. **Nivel Aplicaciones (`apps/external-*` y `apps/internal-*`):** Aplicaciones web desplegables de forma independiente en su propio dominio y puerto (`4310+`).
  2. **Nivel Modulos (`modules/<app-id>/<module-id>`):** Modulos enchufables aislados con `<ModuleErrorBoundary>` y `<RoleGuard>` que extienden una aplicacion sin tocar su nucleo.
- **Estandar de Referencia DSC UNI + White-Label Open Source:**
  - Adopta por defecto la identidad visual, estructura y contrato de API de **Developer Student Club UNI (`dsc-web-frontend` + `dsc-web-backend`)**.
  - Es 100% parametrizable mediante `app.config.ts -> community` (`themePreset: 'dsc-uni' | 'tech-indigo' | 'ai-guild'`) para que cualquier otra comunidad estudiantil u organizacion Open Source lo adopte cambiando un unico bloque declarativo.
- **Ciclo SDD Persistente (`specs -> planning -> implement -> test -> security`):**
  - Integrado con `.opencode/` y sincronizado con todos los harnesses (`CLAUDE.md`, `.cursorrules`, `.windsurfrules`, `CONVENTIONS.md`).

## 3. Alcance Negativo Explicito (Que NO Haremos)
- **NO** permitiremos estilos libres, colores crudos de Tailwind ni etiquetas HTML nativas de formulario/tabla (`<button>`, `<input>`, `<select>`, `<textarea>`, `<table>`, `<header>`, `<footer>`, `<aside>`) dentro de `apps/` o `modules/`.
- **NO** permitiremos que un modulo importe codigo de otro modulo ni de otra aplicacion.
- **NO** usaremos los puertos `3000` o `3001` en ninguna aplicacion del monorepo.
- **NO** guardaremos tokens de acceso ni credenciales en `localStorage` o `sessionStorage`.
- **NO** escribiremos codigo de una nueva feature sin antes definir su carpeta `specs/YYYY-MM-DD-<feature>/` con `requirements.md`, `plan.md` y `validation.md`.

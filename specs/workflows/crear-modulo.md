# Workflow: Crear un Nuevo Módulo en una App (`specs/workflows/crear-modulo.md`)

> **Playbook Ejecutable para Desarrolladores y Agentes de IA (OpenCode, Claude Code, Codex, Cursor)**

Sigue este flujo cuando necesites añadir una nueva página o sección funcional dentro de una aplicación existente sin tocar el núcleo de la app host.

---

## Paso 1: Ejecutar el Generador de Módulos

```bash
pnpm create:module \
  --app internal-board-portal \
  --id speakers-crm \
  --title "Gestión de Ponentes" \
  --icon Users \
  --roles admin,board
```

Esto creará automáticamente:
1. `modules/<app-id>/<module-id>/package.json` (`@modules/<app-id>--<module-id>`)
2. `modules/<app-id>/<module-id>/module.config.ts` (con `defineModule`)
3. `modules/<app-id>/<module-id>/views/<module-id>-view.tsx` (usando componentes de `@repo/ui`)
4. Registro automático del módulo en `modules/<app-id>/registry.ts` y en `apps/<app-id>/package.json` + `next.config.mjs`.

---

## Paso 2: Desarrollar la Vista del Módulo (`views/<module-id>-view.tsx`)

Respeta estrictamente las reglas de `specs/DESIGN_SYSTEM.md`:
- Importa todos los componentes desde `@repo/ui` (`PageHeader`, `Card`, `Button`, `Input`, `Select`, `DataTable`, `Badge`, `Alert`, `StatCard`).
- Si necesitas leer el usuario o rol actual, importa `{ useAuth } from '@repo/auth'`.
- **NUNCA** uses colores crudos (`bg-blue-500`), valores arbitrarios (`w-[320px]`), estilos en línea (`style={{}}`), ni etiquetas `<button>`, `<input>`, `<table>` nativas.

---

## Paso 3: Verificación Zero-Trust

```bash
pnpm install
pnpm validate:all
pnpm typecheck
pnpm build
```

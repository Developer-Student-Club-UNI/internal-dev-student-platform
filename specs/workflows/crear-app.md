# Workflow: Crear una Nueva Aplicación (`specs/workflows/crear-app.md`)

> **Playbook Ejecutable para Desarrolladores y Agentes de IA (OpenCode, Claude Code, Codex, Cursor)**

Sigue este flujo cuando necesites crear una nueva aplicación independiente (con su propio dominio/URL de despliegue) dentro de `apps/`.

---

## Paso 1: Determinar la Audiencia y el Prefijo

1. **¿Es una aplicación pública sin login obligatorio?** (ej. landing de un evento, web de una iniciativa, convocatoria pública):
   - El ID **DEBE** empezar con `external-` (ej. `external-hackathon-2026`).
   - Elige el layout: `'external-public'` o `'event-landing'`.
2. **¿Es una aplicación interna operativa protegida por roles?** (ej. panel de tesorería, gestión de inventario, portal de mentores):
   - El ID **DEBE** empezar con `internal-` (ej. `internal-mentors-portal`).
   - El layout **DEBE** ser `'internal-dashboard'` y `auth.required: true`.

---

## Paso 2: Ejecutar el Generador Oficial

Usa el generador CLI del IDP para crear toda la estructura base validada:

```bash
# Ejemplo para App Externa de Evento:
pnpm create:app --id external-hackathon-2026 --name "Hackathon Estudiantil 2026" --layout event-landing

# Ejemplo para App Interna Operativa:
pnpm create:app --id internal-mentors-portal --name "Portal de Mentores" --layout internal-dashboard
```

El generador creará automáticamente:
- `apps/<app-id>/package.json`
- `apps/<app-id>/app.config.ts` (validado con `defineApp`)
- `apps/<app-id>/tailwind.config.ts` (conectado a `@repo/ui/tailwind.preset`)
- `apps/<app-id>/src/app/layout.tsx` (conectado a `<AppShell>` de `@repo/layouts`)
- `apps/<app-id>/src/app/page.tsx` y `apps/<app-id>/src/app/[...modulePath]/page.tsx`
- `modules/<app-id>/registry.ts` (registro vacío listo para recibir módulos)

---

## Paso 3: Instalar y Verificar Guardrails

```bash
pnpm install
pnpm validate:all
pnpm --filter @apps/<app-id> typecheck
pnpm --filter @apps/<app-id> build
```

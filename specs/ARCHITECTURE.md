# Arquitectura del Monorepo e IDP de Frontend (`specs/ARCHITECTURE.md`)

## 1. Visión General

Este monorepo implementa un **Internal Developer Platform (IDP) de Frontend** basado en `pnpm workspaces` y `Turborepo`. El sistema permite que múltiples desarrolladores, voluntarios y agentes de IA construyan:

1. **Aplicaciones Independientes (`apps/`):** Desplegables en su propio dominio/subdominio con Preview URLs automáticas.
2. **Módulos Enchufables (`modules/`):** Funcionalidades o secciones desarrolladas en aislamiento que se inyectan en una aplicación host sin alterar su núcleo.

---

## 2. Topología de Directorios y Responsabilidades

```text
internal-dev-student-platform/
├── apps/
│   ├── external-<slug>/         # Apps públicas (SEO, SSG/ISR, sin login obligatorio)
│   └── internal-<slug>/         # Apps privadas (Dashboards operativos, RBAC obligatorio)
├── modules/
│   └── <app-id>/
│       ├── registry.ts          # Registro declarativo de módulos de <app-id>
│       └── <module-id>/         # Paquete aislado (@modules/<app-id>--<module-id>)
│           ├── package.json
│           ├── module.config.ts # Contrato tipado del módulo
│           └── views/           # Vistas y lógica encapsulada del módulo
├── packages/
│   ├── ui/                      # @repo/ui: Tokens CSS semánticos + Componentes cerrados
│   ├── layouts/                 # @repo/layouts: Shells visuales (Public, Event, Dashboard)
│   ├── auth/                    # @repo/auth: Autenticación + RBAC + Session Switcher Dev
│   ├── module-sdk/              # @repo/module-sdk: Contratos Zod, Registry, ErrorBoundary
│   └── config/                  # @repo/config: TSConfig + ESLint Guardrails
└── tooling/
    ├── validators/              # Validadores estáticos Zero-Trust
    └── generators/              # Generadores CLI para apps y módulos
```

---

## 3. Grafo Estricto de Dependencias (Regla de Capas)

El flujo de dependencias es estrictamente unidireccional (DAG):

```text
[apps/*] ──────► [modules/<target-app>/*]
   │                       │
   ▼                       ▼
[@repo/layouts] ──► [@repo/module-sdk]
   │                       │
   ▼                       ▼
[@repo/auth] ──────► [@repo/ui] ──────► [@repo/config]
```

### Matriz de Imports Permitidos vs Prohibidos

| Origen | Puede Importar De | PROHIBIDO Importar De |
| :--- | :--- | :--- |
| `apps/<app-id>` | `@repo/ui`, `@repo/layouts`, `@repo/auth`, `@repo/module-sdk`, `@modules/<app-id>/*` | Otra app (`apps/*`) o módulos de otra app |
| `modules/<app-id>/<mod-A>` | `@repo/ui`, `@repo/auth`, `@repo/module-sdk` | `apps/*`, `@repo/layouts`, u otro módulo (`<mod-B>`) |
| `packages/layouts` | `@repo/ui`, `@repo/auth`, `@repo/module-sdk` | `apps/*`, `modules/*` |
| `packages/auth` | `@repo/ui` | `apps/*`, `modules/*`, `@repo/layouts` |
| `packages/module-sdk` | `@repo/ui`, `@repo/auth` | `apps/*`, `modules/*` |
| `packages/ui` | Librerías base (React, Lucide, Tailwind) | Cualquier otro paquete de negocio del monorepo |

---

## 4. Aislamiento de Fallos en Tiempo de Ejecución

Cada módulo montado por `@repo/module-sdk` a través de `<ModuleHost />` o `<ModuleSlotRenderer />` se ejecuta dentro de una jaula de seguridad:
1. **Verificación de Permisos (`<RoleGuard>`):** Si el módulo define `permissions.roles`, se valida contra la sesión activa de `@repo/auth`.
2. **Aislamiento de Excepciones (`<ModuleErrorBoundary>`):** Si un módulo falla al renderizar, el fallo se captura y se muestra un bloque de contingencia de `@repo/ui` con opción de reintento, sin tumbar el App Shell ni afectar a los demás módulos.

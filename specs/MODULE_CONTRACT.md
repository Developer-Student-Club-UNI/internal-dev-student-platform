# Contrato de Módulos (`specs/MODULE_CONTRACT.md`)

## 1. Principio de Extensión Sin Modificación (Open-Closed)

Para añadir una nueva funcionalidad a una aplicación existente (por ejemplo, añadir un generador de certificados a `internal-board-portal` o una sección de ponentes a `external-community-web`), **NO se edita el núcleo de la aplicación**. Se crea un módulo aislado en `modules/<target-app>/<module-id>`.

---

## 2. Anatomía de un Módulo

```text
modules/<target-app>/<module-id>/
├── package.json                 # Nombre: @modules/<target-app>--<module-id>
├── tsconfig.json                # Extiende @repo/config/tsconfig.react-library.json
├── module.config.ts             # Contrato exportado con defineModule()
└── views/
    └── <module-id>-view.tsx     # Componentes compuestos con @repo/ui
```

---

## 3. Modos de Montaje (`mount.type`)

Un módulo puede inyectarse en su aplicación host de dos maneras:

1. **`type: 'route'` (Página Independiente):**
   - Genera automáticamente una ruta en la aplicación (ej. `/certificates`) y añade un enlace en el menú lateral (`sidebar-main`) o barra superior (`header-nav`).
2. **`type: 'section'` (Sección Embebida en Landing/Overview):**
   - Se inyecta automáticamente en el flujo de la página principal de la app según su prioridad `order` (ideal para secciones de landing pages como Agenda, Speakers, Métricas o Bloques de Resumen).

---

## 4. Ejemplo de `module.config.ts`

```ts
import { defineModule } from '@repo/module-sdk';
import { CertificatesView } from './views/certificates-view';

export default defineModule({
  id: 'certificates',
  targetApp: 'internal-board-portal',
  title: 'Emisión de Certificados',
  description: 'Generación, firma verificable y envío de certificados para eventos y voluntariado.',
  version: '1.0.0',
  mount: {
    type: 'route',
    path: '/certificates',
    slot: 'sidebar-main',
    order: 20,
    icon: 'Award',
    badge: ' Oficial',
  },
  permissions: {
    roles: ['admin', 'board'],
  },
  component: CertificatesView,
});
```

---

## 5. Reglas de Aislamiento

1. **Cero Estado Global Compartido No Tipado:** El módulo recibe contexto del usuario únicamente a través de los hooks oficiales de `@repo/auth` (`useAuth()`).
2. **Cero Imports Cruzados:** Un módulo no puede importar código de otro módulo. Si dos módulos necesitan un componente visual genérico, ese componente pertenece a `@repo/ui`.
3. **Tolerancia a Fallos:** Todo módulo es montado automáticamente dentro de `<ModuleErrorBoundary>` provisto por `@repo/module-sdk`.

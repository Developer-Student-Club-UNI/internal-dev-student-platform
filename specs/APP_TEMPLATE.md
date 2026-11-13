# Plantilla y Contrato de Aplicaciones (`specs/APP_TEMPLATE.md`)

## 1. Clasificación de Aplicaciones

Toda aplicación reside en `apps/<prefijo>-<slug>` y debe pertenecer a una de las dos audiencias soportadas:

1. **Aplicaciones Externas (`apps/external-*`):**
   - Orientadas a estudiantes, público general, eventos o captación.
   - `audience: 'external'`
   - `auth.required: false`
   - Layouts permitidos: `'external-public'` o `'event-landing'`.
2. **Aplicaciones Internas (`apps/internal-*`):**
   - Orientadas a junta directiva, coordinadores y voluntarios operativos.
   - `audience: 'internal'`
   - `auth.required: true` (con lista explícita de `allowedRoles`).
   - Layout obligatorio: `'internal-dashboard'`.

---

## 2. Estructura Obligatoria de una Aplicación

```text
apps/<app-id>/
├── package.json                 # Nombre: @apps/<app-id> (Puerto dedicado >= 4310, PROHIBIDO 3000/3001)
├── next.config.mjs              # transpilePackages + getSecurityHeaders() de @repo/security
├── tailwind.config.ts           # Extiende exclusivamente de @repo/ui/tailwind.preset
├── tsconfig.json                # Extiende de @repo/config/tsconfig.nextjs.json
├── app.config.ts                # Contrato declarativo validado con defineApp()
└── src/
    └── app/
        ├── layout.tsx           # Monta el Shell de @repo/layouts + AuthProvider
        ├── page.tsx             # Página raíz (Dashboard overview o Landing con slots)
        └── [[...modulePath]]/
            └── page.tsx         # Enrutador dinámico protegido contra Path Traversal
```

---

## 3. Especificación de `app.config.ts`

```ts
import { defineApp } from '@repo/module-sdk';

export default defineApp({
  id: 'external-community-web',
  name: 'Comunidad Estudiantil de Desarrollo',
  subtitle: 'Innovación, proyectos open-source y formación técnica',
  audience: 'external',
  layout: 'external-public',
  seo: {
    titleTemplate: '%s | Comunidad Dev Estudiantil',
    defaultDescription: 'Plataforma oficial de eventos, proyectos y formación.',
  },
  auth: {
    required: false,
    allowedRoles: ['guest', 'member', 'volunteer', 'board', 'admin'],
  },
  branding: {
    badgeText: 'Open Community',
    primaryCta: {
      label: 'Unirse a la Comunidad',
      href: '/volunteer-signup',
    },
  },
  navigation: {
    staticLinks: [
      { label: 'Inicio', href: '/', icon: 'Home' },
    ],
  },
});
```

#!/usr/bin/env node
/**
 * Generador CLI de Aplicaciones (tooling/generators/create-app.mjs)
 * Uso:
 *   pnpm create:app --id external-summit-2026 --name "Tech Summit 2026" --layout event-landing
 */
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
function getArg(flag, fallback = '') {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback;
}

const appId = getArg('--id');
const appName = getArg('--name', appId);
const requestedLayout = getArg('--layout');
const port = getArg('--port', '4330');

if (port === '3000' || port === '3001') {
  console.error(
    '[ERROR] Politica de Puertos (specs/SECURITY.md): Los puertos 3000 y 3001 estan prohibidos. Usa el rango 4310+ (ej. --port 4330).'
  );
  process.exit(1);
}

if (!appId || !/^(external|internal)-[a-z0-9-]+$/.test(appId)) {
  console.error(
    '[ERROR] Uso: pnpm create:app --id <external-slug | internal-slug> --name "Nombre de la App" [--layout external-public|event-landing|internal-dashboard]'
  );
  process.exit(1);
}

const isInternal = appId.startsWith('internal-');
const audience = isInternal ? 'internal' : 'external';
const layout = isInternal
  ? 'internal-dashboard'
  : requestedLayout === 'event-landing'
  ? 'event-landing'
  : 'external-public';

const ROOT = process.cwd();
const appDir = path.join(ROOT, 'apps', appId);
const moduleScopeDir = path.join(ROOT, 'modules', appId);

if (fs.existsSync(appDir)) {
  console.error(`[ERROR] La aplicacion apps/${appId} ya existe.`);
  process.exit(1);
}

fs.mkdirSync(path.join(appDir, 'src', 'app', '[...modulePath]'), {
  recursive: true,
});
fs.mkdirSync(moduleScopeDir, { recursive: true });

fs.writeFileSync(
  path.join(moduleScopeDir, 'registry.ts'),
  `import type { ModuleConfig } from '@repo/module-sdk';

export const registeredModules: ModuleConfig[] = [];

export default registeredModules;
`
);

fs.writeFileSync(
  path.join(appDir, 'package.json'),
  JSON.stringify(
    {
      name: `@apps/${appId}`,
      version: '1.0.0',
      private: true,
      scripts: {
        dev: `next dev --port ${port}`,
        build: 'next build',
        start: `next start --port ${port}`,
        lint: 'tsc --noEmit',
        typecheck: 'tsc --noEmit',
      },
      dependencies: {
        '@repo/api-client': 'workspace:*',
        '@repo/auth': 'workspace:*',
        '@repo/layouts': 'workspace:*',
        '@repo/module-sdk': 'workspace:*',
        '@repo/security': 'workspace:*',
        '@repo/ui': 'workspace:*',
        next: '^15.1.0',
        react: '^19.0.0',
        'react-dom': '^19.0.0',
      },
      devDependencies: {
        '@repo/config': 'workspace:*',
        '@types/node': '^22.10.0',
        '@types/react': '^19.0.0',
        '@types/react-dom': '^19.0.0',
        autoprefixer: '^10.4.20',
        postcss: '^8.4.49',
        tailwindcss: '^3.4.17',
        typescript: '^5.7.2',
      },
    },
    null,
    2
  ) + '\n'
);

fs.writeFileSync(
  path.join(appDir, 'next.config.mjs'),
  `import { getSecurityHeaders } from '@repo/security/headers';

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  transpilePackages: [
    '@repo/ui',
    '@repo/layouts',
    '@repo/auth',
    '@repo/security',
    '@repo/api-client',
    '@repo/module-sdk',
  ],
  webpack(config) {
    config.cache = false;
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: getSecurityHeaders(),
      },
    ];
  },
};

export default nextConfig;
`
);

fs.writeFileSync(
  path.join(appDir, 'tailwind.config.ts'),
  `import type { Config } from 'tailwindcss';
import idpPreset from '@repo/ui/tailwind.preset';

const config: Config = {
  presets: [idpPreset as Config],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../packages/layouts/src/**/*.{ts,tsx}',
    '../../packages/auth/src/**/*.{ts,tsx}',
    '../../packages/module-sdk/src/**/*.{ts,tsx}',
    '../../modules/${appId}/*/views/**/*.{ts,tsx}',
    '../../modules/${appId}/*/*.{ts,tsx}',
  ],
};

export default config;
`
);

fs.writeFileSync(
  path.join(appDir, 'postcss.config.mjs'),
  `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`
);

fs.writeFileSync(
  path.join(appDir, 'tsconfig.json'),
  JSON.stringify(
    {
      extends: '@repo/config/tsconfig.nextjs.json',
      compilerOptions: {
        baseUrl: '.',
        paths: {
          '@repo/ui': ['../../packages/ui/src/index.ts'],
          '@repo/layouts': ['../../packages/layouts/src/index.ts'],
          '@repo/api-client': ['../../packages/api-client/src/index.ts'],
          '@repo/auth': ['../../packages/auth/src/index.ts'],
          '@repo/security': ['../../packages/security/src/index.ts'],
          '@repo/module-sdk': ['../../packages/module-sdk/src/index.ts'],
        },
      },
      include: [
        'next-env.d.ts',
        'app.config.ts',
        'src/**/*.ts',
        'src/**/*.tsx',
        '.next/types/**/*.ts',
      ],
      exclude: ['node_modules'],
    },
    null,
    2
  ) + '\n'
);

fs.writeFileSync(
  path.join(appDir, 'app.config.ts'),
  `import { defineApp } from '@repo/module-sdk';

export default defineApp({
  id: '${appId}',
  name: '${appName}',
  subtitle: 'Aplicación generada con el estándar del IDP de Frontend',
  audience: '${audience}',
  layout: '${layout}',
  seo: {
    titleTemplate: '%s | ${appName}',
    defaultDescription: 'Aplicación oficial construida sobre el IDP de Frontend.',
  },
  auth: {
    required: ${isInternal ? 'true' : 'false'},
    allowedRoles: ${
      isInternal
        ? "['admin', 'board', 'volunteer']"
        : "['guest', 'member', 'volunteer', 'board', 'admin']"
    },
  },
  navigation: {
    staticLinks: [{ label: 'Inicio', href: '/', icon: 'Home' }],
  },
});
`
);

fs.writeFileSync(
  path.join(appDir, 'src', 'app', 'layout.tsx'),
  `import * as React from 'react';
import type { Metadata } from 'next';
import '@repo/ui/styles.css';
import { AppShell } from '@repo/layouts';
import appConfig from '../../app.config';
import registeredModules from '../../../../modules/${appId}/registry';

export const metadata: Metadata = {
  title: appConfig.name,
  description: appConfig.seo.defaultDescription,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AppShell app={appConfig} modules={registeredModules}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
`
);

fs.writeFileSync(
  path.join(appDir, 'src', 'app', 'page.tsx'),
  `import * as React from 'react';
import { EmptyState, PageHeader } from '@repo/ui';
import appConfig from '../../app.config';

export default function AppHomePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title={appConfig.name}
        description={appConfig.subtitle}
        badge={appConfig.audience}
        icon="Rocket"
      />
      <EmptyState
        title="App Shell inicializado correctamente"
        description="Conecta tu primer módulo ejecutando: pnpm create:module --app ${appId} --id mi-modulo --title 'Mi Módulo'"
      />
    </div>
  );
}
`
);

fs.writeFileSync(
  path.join(appDir, 'src', 'app', '[...modulePath]', 'page.tsx'),
  `import * as React from 'react';
import { ModuleRouteResolver } from '@repo/module-sdk';
import registeredModules from '../../../../../modules/${appId}/registry';

export default async function DynamicModulePage({
  params,
}: {
  params: Promise<{ modulePath: string[] }>;
}) {
  const resolvedParams = await params;
  const pathname = '/' + (resolvedParams.modulePath?.join('/') ?? '');

  return (
    <ModuleRouteResolver modules={registeredModules} pathname={pathname} />
  );
}
`
);

fs.writeFileSync(
  path.join(appDir, 'SPEC.md'),
  `# SPEC & Checkpoint SDD — \`${appId}\`

- **Tipo:** \`app\`
- **Target:** \`apps/${appId}\` (Puerto \`${port}\`)
- **Audiencia / Layout:** \`${audience}\` / \`${layout}\`
- **Estado SDD:** \`implement\`

## 1. Requisitos y Alcance (Specs)
- **Incluye:** Aplicacion \`${appName}\` desplegable independientemente.
- **Seguridad OWASP (\`@repo/security\`):** Cabeceras CSP/HSTS y \`removeConsole\` activos en \`next.config.mjs\`.

## 2. Plan de Implementacion por Grupos (Planning & Implement)
### Grupo 1: Contrato y Estructura Base
- [x] Generar App Shell y \`app.config.ts\` en puerto \`${port}\`
### Grupo 2: Vistas y Modulos (\`@repo/ui\`)
- [ ] Personalizar pagina principal y conectar modulos en \`modules/${appId}/registry.ts\`
### Grupo 3: Pruebas y Seguridad (\`/test\` & \`/security-review\`)
- [ ] Ejecutar \`pnpm validate:all && pnpm typecheck && pnpm build\`

## 3. Criterios de Validacion (Validation Gate)
- [ ] Renderiza sin errores dentro de \`@repo/layouts\`
- [ ] 0 violaciones en \`pnpm validate:all\`
`
);

const activeSessionPath = path.join(ROOT, 'specs', 'ACTIVE_SESSION.md');
if (fs.existsSync(activeSessionPath)) {
  fs.writeFileSync(
    activeSessionPath,
    `# Puntero de Sesion SDD Activa (\`specs/ACTIVE_SESSION.md\`)

- **Scope Activo:** \`apps/${appId}\`
- **Target Spec:** \`apps/${appId}/SPEC.md\`
- **Fase SDD Actual:** \`implement\`
- **Ultimo Grupo Completado:** Grupo 1 (Scaffolding de \`apps/${appId}\`)
- **Siguiente Accion Pendiente:** Ejecutar \`/implement\` sobre Grupo 2 de \`apps/${appId}/SPEC.md\`
`
  );
}

console.log(`[SUCCESS] [create:app] Aplicacion creada exitosamente en apps/${appId}`);
console.log(`   Checkpoint SDD creado en apps/${appId}/SPEC.md y apuntado en specs/ACTIVE_SESSION.md`);
console.log(`   Para levantar SOLO esta app ejecuta: pnpm dev ${appId}`);

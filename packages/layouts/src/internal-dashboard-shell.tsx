'use client';

import * as React from 'react';
import { RbacRoleSwitcher, RoleGuard, useAuth } from '@repo/auth';
import { DSC_UNI_COMMUNITY_DEFAULT } from '@repo/module-sdk';
import { Badge, Icon } from '@repo/ui';
import type { ShellProps } from './external-public-shell';

/**
 * InternalDashboardShell (@repo/layouts)
 * Espejo arquitectónico y visual de `PanelLayout.tsx` + `PanelLayout.module.scss`
 * de `dsc-web-frontend` ($color-teal-dark header, etiqueta pill "Panel",
 * sidebar de 220px con sección "Administración" gobernada por capacidades `can()`).
 */
export function InternalDashboardShell({ app, modules, children }: ShellProps) {
  const community = app.community ?? DSC_UNI_COMMUNITY_DEFAULT;
  const { user, canAccess } = useAuth();

  const visibleModules = React.useMemo(
    () =>
      modules
        .filter(
          (m) =>
            m.mount.type === 'route' &&
            canAccess(m.permissions?.roles, m.permissions?.permission)
        )
        .sort((a, b) => a.mount.order - b.mount.order),
    [modules, canAccess]
  );

  // Igual que `canAdminister` en `PanelLayout.tsx`: el rótulo "Administración"
  // solo aparece si el usuario posee capacidad para al menos una sección.
  const canAdminister = visibleModules.length > 0;

  return (
    <div
      data-community-theme={community.themePreset}
      className="min-h-screen flex flex-col bg-background text-foreground"
    >
      {/* Cabecera Oscura del Panel ($color-teal-dark #0b3d3f en tema dsc-uni) */}
      <header className="sticky top-0 z-40 bg-primary-hover text-primary-foreground shadow-sm">
        <div className="flex min-h-14 flex-wrap items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="inline-flex items-center font-semibold text-primary-foreground"
            >
              <span>{community.shortName}</span>
              <span className="ml-2 rounded-pill bg-surface/15 px-2.5 py-0.5 text-xs uppercase tracking-wider">
                Panel
              </span>
            </a>
            <span className="hidden md:inline text-xs opacity-75">
              · {app.name}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <RbacRoleSwitcher />
            <div className="hidden sm:flex items-center gap-3">
              <span className="opacity-85 text-xs">{user.name}</span>
              <a
                href="/"
                className="text-xs text-primary-foreground border-b border-primary-foreground/40 hover:border-primary-foreground"
              >
                Inicio del Panel
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row items-stretch">
        {/* Sidebar de 220px fiel a PanelLayout.module.scss */}
        <aside className="w-full md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-subtle bg-surface p-4 flex flex-col justify-between">
          <nav
            aria-label="Secciones del panel"
            className="flex flex-row md:flex-col gap-1 overflow-x-auto"
          >
            {app.navigation.staticLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-background hover:text-primary transition-colors whitespace-nowrap"
              >
                <Icon
                  name={link.icon ?? 'Home'}
                  className="h-4 w-4 text-primary shrink-0"
                />
                <span>{link.label}</span>
              </a>
            ))}

            {canAdminister && (
              <>
                <span className="mt-0 md:mt-4 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground self-center md:self-auto">
                  Administración
                </span>
                {visibleModules.map((mod) => (
                  <a
                    key={mod.id}
                    href={mod.mount.path}
                    className="flex items-center justify-between gap-2 rounded-sm px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-background hover:text-primary transition-colors whitespace-nowrap"
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon
                        name={mod.mount.icon}
                        className="h-4 w-4 text-primary shrink-0"
                      />
                      <span>{mod.title}</span>
                    </span>
                    {mod.mount.badge && (
                      <Badge variant="info">{mod.mount.badge}</Badge>
                    )}
                  </a>
                ))}
              </>
            )}
          </nav>

          <div className="hidden md:block mt-8 rounded-sm border border-subtle bg-background p-3 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-semibold text-foreground">
              <span>{community.shortName} · Zero-Trust</span>
              <Icon
                name="ShieldCheck"
                className="h-4 w-4 text-status-success"
              />
            </div>
            <p className="text-muted-foreground">
              Roles activos:{' '}
              <code>
                {[user.role, ...(user.backendRoles ?? [])].join(', ')}
              </code>
            </p>
            <p className="text-muted-foreground">
              Secciones autorizadas: {visibleModules.length} / {modules.length}
            </p>
          </div>
        </aside>

        {/* Contenido Principal del Panel */}
        <main className="flex-1 p-6 sm:p-8 max-w-6xl">
          <RoleGuard
            requireAuth={app.auth.required}
            allowedRoles={app.auth.allowedRoles}
            fallbackTitle={`Tu rol no tiene acceso a ${app.name}`}
          >
            {children}
          </RoleGuard>
        </main>
      </div>
    </div>
  );
}

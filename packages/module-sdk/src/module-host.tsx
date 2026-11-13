'use client';

import * as React from 'react';
import { RoleGuard } from '@repo/auth';
import { sanitizeRoutePath } from '@repo/security';
import { Alert, EmptyState, Skeleton } from '@repo/ui';
import type { ModuleConfig, ModuleSlot } from './contracts';
import { ModuleErrorBoundary } from './error-boundary';

export interface ModuleHostProps {
  module: ModuleConfig;
}

export function ModuleHost({ module }: ModuleHostProps) {
  const ModuleComponent = module.component;

  return (
    <RoleGuard
      allowedRoles={module.permissions?.roles}
      permission={module.permissions?.permission}
      fallbackTitle={`Acceso restringido al módulo "${module.title}"`}
    >
      <ModuleErrorBoundary moduleId={module.id} moduleTitle={module.title}>
        <React.Suspense
          fallback={
            <div className="space-y-4 py-4">
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-64 w-full" />
            </div>
          }
        >
          <ModuleComponent />
        </React.Suspense>
      </ModuleErrorBoundary>
    </RoleGuard>
  );
}

export interface ModuleRouteResolverProps {
  modules: ModuleConfig[];
  pathname: string;
}

export function ModuleRouteResolver({
  modules,
  pathname,
}: ModuleRouteResolverProps) {
  const routeCheck = sanitizeRoutePath(pathname);

  if (!routeCheck.safe) {
    return (
      <Alert
        variant="danger"
        title="Solicitud Bloqueada por Firewall de Rutas (@repo/security)"
        description={
          routeCheck.reason ??
          'Se detectó un patrón de Path Traversal o caracteres no autorizados en la URL.'
        }
      />
    );
  }

  const normalized = routeCheck.normalizedPath;
  const aliasMap: Record<string, string> = {
    '/events-showcase': '/eventos',
    '/volunteer-signup': '/contacto',
    '/members-directory': '/equipo',
  };
  const targetPath = aliasMap[normalized] ?? normalized;
  const matched = modules.find(
    (m) =>
      m.mount.path === targetPath ||
      m.mount.path === targetPath.replace(/\/$/, '') ||
      `/${m.id}` === normalized
  );

  if (!matched) {
    return (
      <EmptyState
        icon="Compass"
        title="Módulo no encontrado en este App Shell"
        description={`No existe ningún módulo registrado para la ruta "${normalized}". Verifica modules/<app-id>/registry.ts.`}
      />
    );
  }

  return <ModuleHost module={matched} />;
}

export interface ModuleSlotRendererProps {
  modules: ModuleConfig[];
  slot: ModuleSlot;
}

export function ModuleSlotRenderer({ modules, slot }: ModuleSlotRendererProps) {
  const slotModules = React.useMemo(
    () =>
      modules
        .filter((m) => m.mount.slot === slot || m.mount.type === 'section')
        .sort((a, b) => a.mount.order - b.mount.order),
    [modules, slot]
  );

  return (
    <div className="space-y-10">
      {slotModules.map((mod) => (
        <div key={mod.id} id={mod.id}>
          <ModuleHost module={mod} />
        </div>
      ))}
    </div>
  );
}

'use client';

import * as React from 'react';
import { AuthProvider, type UserRole } from '@repo/auth';
import { installGlobalLogSanitizer } from '@repo/security';
import {
  ExternalPublicShell,
  type ShellProps,
} from './external-public-shell';
import { EventLandingShell } from './event-landing-shell';
import { InternalDashboardShell } from './internal-dashboard-shell';

// Sanitización global de logs activa en producción para mitigar OWASP A09 & LLM06
installGlobalLogSanitizer();

export interface AppShellProps extends ShellProps {
  defaultRole?: UserRole;
}

/**
 * Dispatcher universal de Layouts para todas las aplicaciones del Monorepo.
 * Selecciona el Shell oficial según `app.layout` definido en `app.config.ts`.
 */
export function AppShell({
  app,
  modules,
  defaultRole,
  children,
}: AppShellProps) {
  const initialRole: UserRole =
    defaultRole ?? (app.audience === 'internal' ? 'board' : 'guest');

  return (
    <AuthProvider defaultRole={initialRole}>
      {app.layout === 'internal-dashboard' ? (
        <InternalDashboardShell app={app} modules={modules}>
          {children}
        </InternalDashboardShell>
      ) : app.layout === 'event-landing' ? (
        <EventLandingShell app={app} modules={modules}>
          {children}
        </EventLandingShell>
      ) : (
        <ExternalPublicShell app={app} modules={modules}>
          {children}
        </ExternalPublicShell>
      )}
    </AuthProvider>
  );
}

'use client';

import * as React from 'react';
import { Badge, Button, Icon } from '@repo/ui';
import type { ShellProps } from './external-public-shell';

export function EventLandingShell({ app, modules, children }: ShellProps) {
  const orderedModules = React.useMemo(
    () => [...modules].sort((a, b) => a.mount.order - b.mount.order),
    [modules]
  );

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="bg-primary text-primary-foreground px-4 py-2 text-xs font-medium">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon name="Sparkles" className="h-3.5 w-3.5" />
            <span>{app.branding?.badgeText ?? 'Evento Oficial de la Comunidad'}</span>
          </div>
          <div className="flex items-center gap-4">
            {app.branding?.eventDate && (
              <span className="inline-flex items-center gap-1">
                <Icon name="Calendar" className="h-3.5 w-3.5" />
                {app.branding.eventDate}
              </span>
            )}
            {app.branding?.eventLocation && (
              <span className="inline-flex items-center gap-1">
                <Icon name="MapPin" className="h-3.5 w-3.5" />
                {app.branding.eventLocation}
              </span>
            )}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-subtle bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Icon name="Rocket" className="h-5 w-5" />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              {app.name}
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            {orderedModules.map((mod) => {
              const href =
                mod.mount.type === 'section' ? `/#${mod.id}` : mod.mount.path;
              return (
                <a
                  key={mod.id}
                  href={href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {mod.title}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {app.branding?.primaryCta && (
              <a href={app.branding.primaryCta.href}>
                <Button size="sm" variant="primary">
                  {app.branding.primaryCta.label}
                </Button>
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="border-t border-subtle bg-surface py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>{app.name} — EventLandingShell (@repo/layouts)</span>
          <Badge variant="outline">Modo Evento Público</Badge>
        </div>
      </footer>
    </div>
  );
}

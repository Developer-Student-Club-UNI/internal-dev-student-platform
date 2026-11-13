'use client';

import * as React from 'react';
import { Button, Icon } from '@repo/ui';
import {
  DSC_UNI_COMMUNITY_DEFAULT,
  type AppConfig,
  type ModuleConfig,
} from '@repo/module-sdk';

export interface ShellProps {
  app: AppConfig;
  modules: ModuleConfig[];
  children: React.ReactNode;
}

const CORE_DSC_PATHS = new Set([
  '/',
  '/nosotros',
  '/team',
  '/eventos',
  '/events-showcase',
  '/contacto',
  '/volunteer-signup',
]);

/**
 * ExternalPublicShell (@repo/layouts)
 * Replicación exacta de `Navbar.tsx`, `Layout.tsx` y `Footer.tsx` de `dsc-web-frontend`.
 * Parametrizado mediante `app.community` para ser White-Label Open Source.
 */
export function ExternalPublicShell({ app, modules, children }: ShellProps) {
  const community = app.community ?? DSC_UNI_COMMUNITY_DEFAULT;
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [nosotrosOpen, setNosotrosOpen] = React.useState(false);

  const extraModules = React.useMemo(
    () =>
      modules
        .filter(
          (m) => m.mount.type === 'route' && !CORE_DSC_PATHS.has(m.mount.path)
        )
        .sort((a, b) => a.mount.order - b.mount.order),
    [modules]
  );

  React.useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileMenuOpen]);

  return (
    <div
      data-community-theme={community.themePreset}
      className="min-h-screen flex flex-col bg-surface text-foreground"
    >
      {/* Navbar Fiel a dsc-web-frontend/src/components/layout/Navbar.tsx */}
      <header className="sticky top-0 z-50 border-b border-subtle bg-surface shadow-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-5 lg:px-12">
          <a href="/" className="flex items-center gap-3">
            <img
              src="/assets/DSC-logo.png"
              alt={`${community.organizationName} ${community.shortName}`}
              className="h-10 w-auto"
            />
            <span className="hidden sm:flex flex-col leading-tight text-foreground">
              <strong className="text-base font-bold">
                {community.organizationName}
              </strong>
              <small className="text-xs text-muted-foreground">
                {community.institutionName}
              </small>
            </span>
          </a>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-base font-medium">
            <a
              href="/"
              className="pb-1 border-b-2 border-transparent text-foreground transition-colors hover:text-primary-medium hover:border-primary-dark"
            >
              Home
            </a>

            {/* Dropdown "Nosotros" -> Acerca de / Equipo */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setNosotrosOpen(true)}
              onMouseLeave={() => setNosotrosOpen(false)}
            >
              <Button
                variant="ghost"
                size="sm"
                aria-expanded={nosotrosOpen}
                onClick={() => setNosotrosOpen((prev) => !prev)}
                className="px-1 py-1 text-base font-medium text-foreground hover:bg-transparent hover:text-primary-medium"
              >
                <span>Nosotros</span>
                <svg
                  className={`h-4 w-4 transition-transform ${
                    nosotrosOpen ? 'rotate-180' : ''
                  }`}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </Button>

              {nosotrosOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                  <div className="flex min-w-40 flex-col gap-1 rounded-md border border-subtle bg-surface p-2.5 shadow-lg">
                    <a
                      href="/nosotros"
                      className="rounded-sm px-3 py-2 text-sm font-medium text-foreground hover:bg-background hover:text-primary"
                    >
                      Acerca de
                    </a>
                    <a
                      href="/team"
                      className="rounded-sm px-3 py-2 text-sm font-medium text-foreground hover:bg-background hover:text-primary"
                    >
                      Equipo
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a
              href="/eventos"
              className="pb-1 border-b-2 border-transparent text-foreground transition-colors hover:text-primary-medium hover:border-primary-dark"
            >
              Eventos
            </a>

            <a
              href="/contacto"
              className="pb-1 border-b-2 border-transparent text-foreground transition-colors hover:text-primary-medium hover:border-primary-dark"
            >
              Contacto
            </a>

            {extraModules.map((mod) => (
              <a
                key={mod.id}
                href={mod.mount.path}
                className="pb-1 border-b-2 border-transparent text-foreground transition-colors hover:text-primary-medium hover:border-primary-dark"
              >
                {mod.title}
              </a>
            ))}
          </nav>

          {/* Botón Iniciar Sesión (igual a Navbar.tsx) */}
          <div className="hidden md:flex items-center">
            <a href={app.branding?.primaryCta?.href ?? '/contacto'}>
              <Button
                size="md"
                variant="primary"
                className="rounded-md px-6 h-10 text-sm font-semibold"
              >
                {app.branding?.primaryCta?.label ?? 'Iniciar Sesión'}
              </Button>
            </a>
          </div>

          {/* Botón Hamburguesa Móvil */}
          <div className="flex md:hidden">
            <Button
              size="sm"
              variant="ghost"
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <Icon name={mobileMenuOpen ? 'X' : 'Menu'} className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Menú Móvil Fiel a Navbar.module.scss */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-subtle bg-surface px-5 py-6 space-y-5 shadow-lg">
            <nav className="flex flex-col space-y-2">
              <a
                href="/"
                className="py-2 text-lg font-medium text-foreground hover:text-primary"
              >
                Home
              </a>
              <div className="space-y-2">
                <span className="block pt-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Nosotros
                </span>
                <div className="ml-3 flex flex-col space-y-2 border-l-2 border-subtle pl-4">
                  <a
                    href="/nosotros"
                    className="py-1.5 text-base font-medium text-foreground hover:text-primary"
                  >
                    Acerca de
                  </a>
                  <a
                    href="/team"
                    className="py-1.5 text-base font-medium text-foreground hover:text-primary"
                  >
                    Equipo
                  </a>
                </div>
              </div>
              <a
                href="/eventos"
                className="py-2 text-lg font-medium text-foreground hover:text-primary"
              >
                Eventos
              </a>
              <a
                href="/contacto"
                className="py-2 text-lg font-medium text-foreground hover:text-primary"
              >
                Contacto
              </a>
            </nav>
            <div>
              <a
                href={app.branding?.primaryCta?.href ?? '/contacto'}
                className="block"
              >
                <Button fullWidth variant="primary">
                  {app.branding?.primaryCta?.label ?? 'Iniciar Sesión'}
                </Button>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Main Full-Bleed (como en Layout.tsx de dsc-web-frontend) */}
      <main className="flex-1 w-full">{children}</main>

      {/* Footer Negro Fiel a dsc-web-frontend/src/components/layout/Footer.tsx */}
      <footer className="bg-footer text-primary-foreground px-6 py-12 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-10 md:flex-row">
          <div className="flex flex-col gap-5">
            <img
              src="/assets/logo-blanco-dsc.svg"
              alt={`${community.organizationName} ${community.shortName}`}
              className="w-72 max-w-full h-auto"
            />
            <div className="flex items-center gap-4 text-xs text-primary-foreground/80">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-foreground"
              >
                LinkedIn
              </a>
              <a
                href="https://wa.me/51989098789"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-foreground"
              >
                WhatsApp
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-foreground"
              >
                TikTok
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-foreground"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-foreground"
              >
                Instagram
              </a>
            </div>
          </div>

          <nav className="flex flex-wrap content-start gap-x-8 gap-y-3 text-sm text-primary-foreground/85">
            <a href="/" className="hover:text-primary-foreground">
              Inicio
            </a>
            <a href="/team" className="hover:text-primary-foreground">
              Equipo
            </a>
            <a href="/nosotros" className="hover:text-primary-foreground">
              Nosotros
            </a>
            <a href="/eventos" className="hover:text-primary-foreground">
              Eventos
            </a>
            <a href="/contacto" className="hover:text-primary-foreground">
              Contacto
            </a>
            <a href="/contacto" className="hover:text-primary-foreground">
              Iniciar Sesión
            </a>
          </nav>

          <div className="space-y-2 text-sm text-primary-foreground/85">
            <h3 className="font-bold text-primary-foreground">Información</h3>
            <p className="flex items-center gap-2">
              <Icon name="Mail" className="h-4 w-4 shrink-0" />
              <span>dsc@gmail.com</span>
            </p>
            <p className="flex items-center gap-2">
              <Icon name="MapPin" className="h-4 w-4 shrink-0" />
              <span>Ubicación FIIE - UNI</span>
            </p>
            <h3 className="pt-3 font-bold text-primary-foreground">
              Horario de Atención
            </h3>
            <p>Lunes - Sábado (9:00-22:00)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

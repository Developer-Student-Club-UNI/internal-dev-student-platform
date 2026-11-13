import * as React from 'react';
import type { Metadata } from 'next';
import '@repo/ui/styles.css';
import { AppShell } from '@repo/layouts';
import appConfig from '../../app.config';
import internalBoardPortalModules from '../../../../modules/internal-board-portal/registry';

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
        <AppShell
          app={appConfig}
          modules={internalBoardPortalModules}
          defaultRole="board"
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}

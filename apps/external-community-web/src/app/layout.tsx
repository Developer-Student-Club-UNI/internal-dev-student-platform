import * as React from 'react';
import type { Metadata } from 'next';
import '@repo/ui/styles.css';
import { AppShell } from '@repo/layouts';
import appConfig from '../../app.config';
import externalCommunityWebModules from '../../../../modules/external-community-web/registry';

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
        <AppShell app={appConfig} modules={externalCommunityWebModules}>
          {children}
        </AppShell>
      </body>
    </html>
  );
}

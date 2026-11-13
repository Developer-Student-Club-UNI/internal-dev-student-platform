import * as React from 'react';
import { ModuleRouteResolver } from '@repo/module-sdk';
import externalCommunityWebModules from '../../../../../modules/external-community-web/registry';

export default async function DynamicModulePage({
  params,
}: {
  params: Promise<{ modulePath: string[] }>;
}) {
  const resolvedParams = await params;
  const pathname = '/' + (resolvedParams.modulePath?.join('/') ?? '');

  return (
    <ModuleRouteResolver
      modules={externalCommunityWebModules}
      pathname={pathname}
    />
  );
}

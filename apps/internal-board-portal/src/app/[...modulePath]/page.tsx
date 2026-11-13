import * as React from 'react';
import { ModuleRouteResolver } from '@repo/module-sdk';
import internalBoardPortalModules from '../../../../../modules/internal-board-portal/registry';

export default async function InternalDynamicModulePage({
  params,
}: {
  params: Promise<{ modulePath: string[] }>;
}) {
  const resolvedParams = await params;
  const pathname = '/' + (resolvedParams.modulePath?.join('/') ?? '');

  return (
    <ModuleRouteResolver
      modules={internalBoardPortalModules}
      pathname={pathname}
    />
  );
}

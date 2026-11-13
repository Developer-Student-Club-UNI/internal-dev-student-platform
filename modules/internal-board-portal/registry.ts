import type { ModuleConfig } from '@repo/module-sdk';
import panelEventsModule from './panel-events/module.config';
import panelProjectsModule from './panel-projects/module.config';
import membersDirectoryModule from './members-directory/module.config';
import panelUnitsModule from './panel-units/module.config';
import panelTermsModule from './panel-terms/module.config';
import panelSiteModule from './panel-site/module.config';
import panelMessagesModule from './panel-messages/module.config';
import panelUsersModule from './panel-users/module.config';
import panelAuditModule from './panel-audit/module.config';
import certificatesModule from './certificates/module.config';

/**
 * Registro declarativo completo de módulos administrativos de `internal-board-portal`.
 * Incluye las 9 secciones del Panel de `dsc-web-frontend` + el módulo de Certificados.
 */
export const internalBoardPortalModules: ModuleConfig[] = [
  panelEventsModule,
  panelProjectsModule,
  membersDirectoryModule,
  panelUnitsModule,
  panelTermsModule,
  panelSiteModule,
  panelMessagesModule,
  panelUsersModule,
  panelAuditModule,
  certificatesModule,
];

export default internalBoardPortalModules;

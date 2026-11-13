import type { ModuleConfig } from '@repo/module-sdk';
import nosotrosModule from './nosotros/module.config';
import teamModule from './team/module.config';
import eventsShowcaseModule from './events-showcase/module.config';
import volunteerSignupModule from './volunteer-signup/module.config';

/**
 * Registro declarativo de módulos públicos de `external-community-web` (DSC UNI).
 * Cubre las rutas oficiales: /nosotros, /team, /eventos y /contacto.
 */
export const externalCommunityWebModules: ModuleConfig[] = [
  nosotrosModule,
  teamModule,
  eventsShowcaseModule,
  volunteerSignupModule,
];

export default externalCommunityWebModules;

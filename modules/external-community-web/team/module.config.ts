import { defineModule } from '@repo/module-sdk';
import { TeamView } from './views/team-view';

export default defineModule({
  id: 'team',
  targetApp: 'external-community-web',
  title: 'Equipo',
  description:
    'Junta Directiva, Directores de Área, Tech Leads, Squads y Voluntarios del DSC UNI.',
  version: '1.0.0',
  mount: {
    type: 'route',
    path: '/team',
    slot: 'header-nav',
    order: 8,
    icon: 'Users',
  },
  component: TeamView,
});

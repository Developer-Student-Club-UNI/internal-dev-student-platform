import { defineModule } from '@repo/module-sdk';
import { PanelUnitsView } from './views/panel-units-view';

export default defineModule({
  id: 'panel-units',
  targetApp: 'internal-board-portal',
  title: 'Unidades',
  description:
    'Catálogo de Direcciones y Squads del club con reordenamiento en vivo (GET/POST/PATCH /api/v1/admin/team-units).',
  version: '1.0.0',
  mount: {
    type: 'route',
    path: '/unidades',
    slot: 'sidebar-main',
    order: 40,
    icon: 'FolderKanban',
  },
  permissions: {
    roles: ['admin', 'board'],
    permission: 'team-unit:write',
  },
  component: PanelUnitsView,
});

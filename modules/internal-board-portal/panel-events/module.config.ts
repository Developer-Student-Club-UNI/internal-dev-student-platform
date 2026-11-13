import { defineModule } from '@repo/module-sdk';
import { PanelEventsView } from './views/panel-events-view';

export default defineModule({
  id: 'panel-events',
  targetApp: 'internal-board-portal',
  title: 'Eventos',
  description:
    'Gestión de eventos, talleres y borradores del club (GET/POST/PATCH /api/v1/admin/events).',
  version: '1.0.0',
  mount: {
    type: 'route',
    path: '/eventos',
    slot: 'sidebar-main',
    order: 10,
    icon: 'Calendar',
  },
  permissions: {
    roles: ['admin', 'board', 'volunteer'],
    permission: 'event:write',
  },
  component: PanelEventsView,
});

import { defineModule } from '@repo/module-sdk';
import { PanelUsersView } from './views/panel-users-view';

export default defineModule({
  id: 'panel-users',
  targetApp: 'internal-board-portal',
  title: 'Usuarios',
  description:
    'Administración de cuentas, otorgamiento de presidencia y suspensión inmediata (GET/PUT/PATCH /api/v1/admin/users).',
  version: '1.0.0',
  mount: {
    type: 'route',
    path: '/usuarios',
    slot: 'sidebar-main',
    order: 80,
    icon: 'ShieldCheck',
  },
  permissions: {
    roles: ['admin'],
    permission: 'user:write',
  },
  component: PanelUsersView,
});

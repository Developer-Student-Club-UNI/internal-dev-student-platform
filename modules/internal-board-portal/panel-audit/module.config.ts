import { defineModule } from '@repo/module-sdk';
import { PanelAuditView } from './views/panel-audit-view';

export default defineModule({
  id: 'panel-audit',
  targetApp: 'internal-board-portal',
  title: 'Auditoría',
  description:
    'Visor inmutable de cambios del panel con diff { before, after } por campo (GET /api/v1/admin/audit-logs).',
  version: '1.0.0',
  mount: {
    type: 'route',
    path: '/auditoria',
    slot: 'sidebar-main',
    order: 90,
    icon: 'Activity',
  },
  permissions: {
    roles: ['admin', 'board'],
    permission: 'audit:read',
  },
  component: PanelAuditView,
});

import { defineModule } from '@repo/module-sdk';
import { PanelTermsView } from './views/panel-terms-view';

export default defineModule({
  id: 'panel-terms',
  targetApp: 'internal-board-portal',
  title: 'Ciclos',
  description:
    'Gestión de ciclos académicos con invariante de ciclo vigente único (GET/POST/PATCH/DELETE /api/v1/admin/terms).',
  version: '1.0.0',
  mount: {
    type: 'route',
    path: '/ciclos',
    slot: 'sidebar-main',
    order: 50,
    icon: 'Clock',
  },
  permissions: {
    roles: ['admin', 'board'],
    permission: 'term:write',
  },
  component: PanelTermsView,
});

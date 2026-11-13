import { defineModule } from '@repo/module-sdk';
import { PanelSiteView } from './views/panel-site-view';

export default defineModule({
  id: 'panel-site',
  targetApp: 'internal-board-portal',
  title: 'Sitio',
  description:
    'Ajustes globales de contacto y redes sociales del sitio público (GET/PUT /api/v1/admin/site).',
  version: '1.0.0',
  mount: {
    type: 'route',
    path: '/sitio',
    slot: 'sidebar-main',
    order: 60,
    icon: 'Globe',
  },
  permissions: {
    roles: ['admin', 'board'],
    permission: 'site:write',
  },
  component: PanelSiteView,
});

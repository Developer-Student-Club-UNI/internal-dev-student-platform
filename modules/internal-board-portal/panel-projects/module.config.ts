import { defineModule } from '@repo/module-sdk';
import { PanelProjectsView } from './views/panel-projects-view';

export default defineModule({
  id: 'panel-projects',
  targetApp: 'internal-board-portal',
  title: 'Proyectos',
  description:
    'Catálogo de proyectos del club, tecnologías y estado de publicación (GET/POST/PATCH /api/v1/admin/projects).',
  version: '1.0.0',
  mount: {
    type: 'route',
    path: '/proyectos',
    slot: 'sidebar-main',
    order: 20,
    icon: 'Code2',
  },
  permissions: {
    roles: ['admin', 'board', 'volunteer'],
    permission: 'project:write',
  },
  component: PanelProjectsView,
});

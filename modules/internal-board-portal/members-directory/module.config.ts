import { defineModule } from '@repo/module-sdk';
import { MembersDirectoryView } from './views/members-directory-view';

export default defineModule({
  id: 'members-directory',
  targetApp: 'internal-board-portal',
  title: 'Equipo',
  description:
    'Directorio completo del club, vinculación por linkEmail y membresías por ciclo (GET/POST/PATCH /api/v1/admin/people).',
  version: '1.0.0',
  mount: {
    type: 'route',
    path: '/equipo',
    slot: 'sidebar-main',
    order: 30,
    icon: 'Users',
  },
  permissions: {
    roles: ['admin', 'board', 'volunteer'],
    permission: 'person:write',
  },
  component: MembersDirectoryView,
});

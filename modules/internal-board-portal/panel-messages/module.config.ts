import { defineModule } from '@repo/module-sdk';
import { PanelMessagesView } from './views/panel-messages-view';

export default defineModule({
  id: 'panel-messages',
  targetApp: 'internal-board-portal',
  title: 'Mensajes',
  description:
    'Buzón de solo lectura con los mensajes enviados desde la página de Contacto (GET /api/v1/admin/contact-messages).',
  version: '1.0.0',
  mount: {
    type: 'route',
    path: '/mensajes',
    slot: 'sidebar-main',
    order: 70,
    icon: 'Mail',
  },
  permissions: {
    roles: ['admin', 'board'],
    permission: 'message:read',
  },
  component: PanelMessagesView,
});

import { defineModule } from '@repo/module-sdk';
import { CertificatesView } from './views/certificates-view';

export default defineModule({
  id: 'certificates',
  targetApp: 'internal-board-portal',
  title: 'Certificados',
  description:
    'Emisión verificable de certificados y prueba de aislamiento ErrorBoundary.',
  version: '1.0.0',
  mount: {
    type: 'route',
    path: '/certificates',
    slot: 'sidebar-main',
    order: 100,
    icon: 'Award',
  },
  permissions: {
    roles: ['admin', 'board'],
    permission: 'audit:read',
  },
  component: CertificatesView,
});

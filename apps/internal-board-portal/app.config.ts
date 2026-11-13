import { defineApp } from '@repo/module-sdk';

export default defineApp({
  id: 'internal-board-portal',
  name: 'Panel de Administración y Comunidad',
  subtitle: 'Gestión de Eventos, Proyectos, Equipo, Unidades, Ciclos y Auditoría',
  audience: 'internal',
  layout: 'internal-dashboard',
  community: {
    shortName: 'DSC UNI',
    organizationName: 'Developer Student Club',
    institutionName: 'Universidad Nacional de Ingeniería',
    themePreset: 'dsc-uni',
    apiBaseUrl: '/api/v1',
  },
  seo: {
    titleTemplate: '%s | Panel DSC UNI',
    defaultDescription:
      'Panel operativo interno gobernado por capacidades (RBAC) y auditoría.',
  },
  auth: {
    required: true,
    allowedRoles: ['admin', 'board', 'volunteer', 'member'],
    unauthorizedRedirect: '/login',
  },
  navigation: {
    staticLinks: [
      { label: 'Mi cuenta', href: '/', icon: 'LayoutDashboard' },
    ],
  },
});

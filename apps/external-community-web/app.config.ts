import { defineApp } from '@repo/module-sdk';

export default defineApp({
  id: 'external-community-web',
  name: 'Developer Student Club UNI',
  subtitle: 'Universidad Nacional de Ingeniería',
  audience: 'external',
  layout: 'external-public',
  community: {
    shortName: 'DSC UNI',
    organizationName: 'Developer Student Club',
    institutionName: 'Universidad Nacional de Ingeniería',
    themePreset: 'dsc-uni',
    apiBaseUrl: '/api/v1',
  },
  seo: {
    titleTemplate: '%s | Developer Student Club UNI',
    defaultDescription:
      'Web oficial del Developer Student Club de la Universidad Nacional de Ingeniería (DSC UNI).',
  },
  auth: {
    required: false,
    allowedRoles: ['guest', 'member', 'volunteer', 'board', 'admin'],
  },
  branding: {
    badgeText: 'DSC UNI',
    primaryCta: {
      label: 'Iniciar Sesión',
      href: '/contacto',
    },
  },
  navigation: {
    staticLinks: [{ label: 'Home', href: '/', icon: 'Home' }],
  },
});

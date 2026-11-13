import * as React from 'react';
import { z } from 'zod';
import {
  IDP_PERMISSIONS,
  IDP_ROLES,
  type IdpPermission,
  type UserRole,
} from '@repo/auth';
import { ICON_REGISTRY, type IconName } from '@repo/ui';

const iconNames = Object.keys(ICON_REGISTRY) as [IconName, ...IconName[]];

export const CommunityThemePresetSchema = z.enum([
  'dsc-uni',
  'tech-indigo',
  'ai-guild',
]);
export type CommunityThemePreset = z.infer<typeof CommunityThemePresetSchema>;

/**
 * Configuración White-Label de Comunidad (Open-Source Ready).
 * Por defecto usa los datos del Developer Student Club UNI (DSC UNI),
 * pero cualquier otra comunidad estudiantil puede inyectar su propia identidad.
 */
export const CommunityIdentitySchema = z.object({
  shortName: z.string().min(2).default('DSC UNI'),
  organizationName: z.string().min(2).default('Developer Student Club'),
  institutionName: z
    .string()
    .min(2)
    .default('Universidad Nacional de Ingeniería'),
  themePreset: CommunityThemePresetSchema.default('dsc-uni'),
  apiBaseUrl: z.string().default('/api/v1'),
});

export type CommunityIdentity = z.infer<typeof CommunityIdentitySchema>;

export const DSC_UNI_COMMUNITY_DEFAULT: CommunityIdentity = {
  shortName: 'DSC UNI',
  organizationName: 'Developer Student Club',
  institutionName: 'Universidad Nacional de Ingeniería',
  themePreset: 'dsc-uni',
  apiBaseUrl: '/api/v1',
};

export const AppAudienceSchema = z.enum(['external', 'internal']);
export type AppAudience = z.infer<typeof AppAudienceSchema>;

export const AppLayoutSchema = z.enum([
  'external-public',
  'event-landing',
  'internal-dashboard',
]);
export type AppLayoutType = z.infer<typeof AppLayoutSchema>;

export const NavLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().startsWith('/'),
  icon: z.enum(iconNames).optional(),
});

export type NavLink = z.infer<typeof NavLinkSchema>;

export const AppConfigSchema = z
  .object({
    id: z.string().regex(/^(external|internal)-[a-z0-9-]+$/, {
      message:
        'El ID de la aplicación debe comenzar con "external-" o "internal-" en kebab-case.',
    }),
    name: z.string().min(2),
    subtitle: z.string().optional(),
    audience: AppAudienceSchema,
    layout: AppLayoutSchema,
    community: CommunityIdentitySchema.optional(),
    seo: z.object({
      titleTemplate: z.string().min(2),
      defaultDescription: z.string().min(5),
    }),
    auth: z.object({
      required: z.boolean(),
      allowedRoles: z.array(z.enum(IDP_ROLES)).min(1),
      unauthorizedRedirect: z.string().optional(),
    }),
    branding: z
      .object({
        badgeText: z.string().optional(),
        eventDate: z.string().optional(),
        eventLocation: z.string().optional(),
        primaryCta: z
          .object({
            label: z.string(),
            href: z.string(),
          })
          .optional(),
      })
      .optional(),
    navigation: z.object({
      staticLinks: z.array(NavLinkSchema).default([]),
    }),
  })
  .superRefine((val, ctx) => {
    if (val.id.startsWith('internal-') && val.audience !== 'internal') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `La aplicación ${val.id} tiene prefijo 'internal-' pero su audience no es 'internal'.`,
      });
    }
    if (val.audience === 'internal' && !val.auth.required) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Toda aplicación interna (${val.id}) debe tener auth.required = true.`,
      });
    }
    if (val.audience === 'internal' && val.layout !== 'internal-dashboard') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Toda aplicación interna (${val.id}) debe usar layout 'internal-dashboard'.`,
      });
    }
  });

export type AppConfig = z.infer<typeof AppConfigSchema>;

export function defineApp(config: AppConfig): AppConfig {
  return AppConfigSchema.parse({
    ...config,
    community: config.community ?? DSC_UNI_COMMUNITY_DEFAULT,
  });
}

export const ModuleMountTypeSchema = z.enum(['route', 'section']);
export type ModuleMountType = z.infer<typeof ModuleMountTypeSchema>;

export const ModuleSlotSchema = z.enum([
  'sidebar-main',
  'sidebar-footer',
  'header-nav',
  'landing-body',
  'dashboard-overview',
]);
export type ModuleSlot = z.infer<typeof ModuleSlotSchema>;

export interface ModuleConfig {
  id: string;
  targetApp: string;
  title: string;
  description: string;
  version?: string;
  mount: {
    type: ModuleMountType;
    path: string;
    slot: ModuleSlot;
    order: number;
    icon: IconName;
    badge?: string;
  };
  permissions?: {
    roles?: UserRole[];
    permission?: IdpPermission;
  };
  component: React.ComponentType;
}

const ModuleMetadataSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  targetApp: z.string().regex(/^(external|internal)-[a-z0-9-]+$/),
  title: z.string().min(2),
  description: z.string().min(5),
  version: z.string().default('1.0.0'),
  mount: z.object({
    type: ModuleMountTypeSchema,
    path: z.string().startsWith('/'),
    slot: ModuleSlotSchema,
    order: z.number().int().min(0).max(1000),
    icon: z.enum(iconNames),
    badge: z.string().optional(),
  }),
  permissions: z
    .object({
      roles: z.array(z.enum(IDP_ROLES)).optional(),
      permission: z.enum(IDP_PERMISSIONS).optional(),
    })
    .optional(),
});

export function defineModule(config: ModuleConfig): ModuleConfig {
  ModuleMetadataSchema.parse(config);
  return config;
}

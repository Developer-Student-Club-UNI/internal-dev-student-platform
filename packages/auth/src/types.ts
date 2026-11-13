export const IDP_ROLES = [
  'guest',
  'member',
  'volunteer',
  'board',
  'admin',
] as const;

export type UserRole = (typeof IDP_ROLES)[number];

/**
 * Capacidades granulares del estándar Backend (`dsc-web-backend` / Open Source IDP).
 * Las pantallas y módulos pueden exigir una capacidad (`permission: 'event:write'`)
 * además o en lugar de un rol fijo.
 */
export const IDP_PERMISSIONS = [
  'event:write',
  'project:write',
  'person:write',
  'team-unit:write',
  'term:write',
  'site:write',
  'message:read',
  'user:write',
  'audit:read',
] as const;

export type IdpPermission = (typeof IDP_PERMISSIONS)[number];

/**
 * Mapa de capacidades por rol (Espejo de `ROLE_PERMISSIONS` en `dsc-web-backend`).
 * Soporta tanto los roles del IDP (`admin`, `board`, `volunteer`, `member`)
 * como los códigos de base de datos (`DSC_PRESIDENT`, `CLUB_PRESIDENT`, `USER`).
 */
export const ROLE_PERMISSIONS: Record<string, readonly string[]> = {
  DSC_PRESIDENT: ['*'],
  CLUB_PRESIDENT: ['*'],
  admin: ['*'],
  board: [
    'event:write',
    'project:write',
    'person:write',
    'team-unit:write',
    'term:write',
    'site:write',
    'message:read',
    'audit:read',
  ],
  volunteer: ['event:write', 'project:write', 'person:write'],
  member: [],
  USER: [],
  guest: [],
};

/**
 * Evalúa la unión de capacidades de los roles del usuario (idéntico a `can()` en `dsc-web-frontend`).
 */
export function can(
  roles: readonly string[] | string | undefined,
  permission?: string
): boolean {
  if (!permission) return true;
  const roleList = Array.isArray(roles) ? roles : roles ? [roles] : [];
  const granted = new Set(
    roleList.flatMap((r) => ROLE_PERMISSIONS[r] ?? [])
  );
  return granted.has('*') || granted.has(permission);
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  backendRoles: string[];
  department?: string;
  avatarInitials: string;
  provider: 'oidc-production' | 'supabase-jwt' | 'idp-dev-sandbox';
}

export interface AuthSession {
  isAuthenticated: boolean;
  user: AuthUser;
}

export const DEMO_PROFILES: Record<UserRole, AuthUser> = {
  admin: {
    id: 'usr_admin_01',
    name: 'Sofía Mendoza (Presidencia DSC UNI)',
    email: 'presidencia@dscuni.community',
    role: 'admin',
    backendRoles: ['DSC_PRESIDENT', 'USER'],
    department: 'Presidencia & Platform Engineering',
    avatarInitials: 'SM',
    provider: 'idp-dev-sandbox',
  },
  board: {
    id: 'usr_board_02',
    name: 'Mateo Vargas (Junta Directiva)',
    email: 'mateo.directiva@dscuni.community',
    role: 'board',
    backendRoles: ['board', 'USER'],
    department: 'Dirección Académica y Eventos',
    avatarInitials: 'MV',
    provider: 'idp-dev-sandbox',
  },
  volunteer: {
    id: 'usr_vol_03',
    name: 'Valeria Rojas (Squad Lead / Voluntaria)',
    email: 'valeria.squad@dscuni.community',
    role: 'volunteer',
    backendRoles: ['volunteer', 'USER'],
    department: 'Squad de IA & Ciencia de Datos',
    avatarInitials: 'VR',
    provider: 'idp-dev-sandbox',
  },
  member: {
    id: 'usr_mem_04',
    name: 'Diego Herrera (Miembro Registrado)',
    email: 'diego.estudiante@uni.edu.pe',
    role: 'member',
    backendRoles: ['USER'],
    department: 'Ingeniería de Sistemas — UNI',
    avatarInitials: 'DH',
    provider: 'idp-dev-sandbox',
  },
  guest: {
    id: 'usr_guest_00',
    name: 'Visitante Externo',
    email: 'visitante@publico.org',
    role: 'guest',
    backendRoles: [],
    department: 'Público General',
    avatarInitials: 'VE',
    provider: 'idp-dev-sandbox',
  },
};

export function hasRequiredRole(
  currentRole: UserRole,
  allowedRoles?: readonly UserRole[],
  requiredPermission?: string
): boolean {
  if (requiredPermission && !can([currentRole], requiredPermission)) {
    return false;
  }
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }
  if (currentRole === 'admin') {
    return true;
  }
  return allowedRoles.includes(currentRole);
}

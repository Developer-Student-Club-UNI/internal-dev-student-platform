'use client';

import * as React from 'react';
import {
  can,
  DEMO_PROFILES,
  hasRequiredRole,
  IDP_ROLES,
  type AuthSession,
  type IdpPermission,
  type UserRole,
} from './types';
import { generateCsrfToken, verifyCsrfToken } from '@repo/security';
import { Badge, Button, Card, CardContent, Icon } from '@repo/ui';

interface AuthContextValue extends AuthSession {
  csrfToken: string;
  verifyMutationCsrf: (token: string) => boolean;
  switchRole: (role: UserRole) => void;
  canAccess: (
    allowedRoles?: readonly UserRole[],
    requiredPermission?: IdpPermission
  ) => boolean;
  hasPermission: (permission: IdpPermission) => boolean;
  isSandboxMode: boolean;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export interface AuthProviderProps {
  children: React.ReactNode;
  defaultRole?: UserRole;
  initialSession?: AuthSession;
}

export function AuthProvider({
  children,
  defaultRole = 'board',
  initialSession,
}: AuthProviderProps) {
  const isSandboxMode =
    process.env.NODE_ENV !== 'production' ||
    process.env.NEXT_PUBLIC_IDP_SANDBOX === 'true';

  const [role, setRole] = React.useState<UserRole>(
    initialSession?.user.role ?? defaultRole
  );

  const switchRole = React.useCallback(
    (nextRole: UserRole) => {
      if (!isSandboxMode) {
        return;
      }
      if (IDP_ROLES.includes(nextRole)) {
        setRole(nextRole);
      }
    },
    [isSandboxMode]
  );

  const user = initialSession?.user ?? DEMO_PROFILES[role];
  const isAuthenticated = role !== 'guest';
  const csrfToken = React.useMemo(
    () => generateCsrfToken(`${user.id}:${user.role}`),
    [user.id, user.role]
  );

  const verifyMutationCsrf = React.useCallback(
    (providedToken: string) =>
      verifyCsrfToken(providedToken, `${user.id}:${user.role}`),
    [user.id, user.role]
  );

  const canAccess = React.useCallback(
    (
      allowedRoles?: readonly UserRole[],
      requiredPermission?: IdpPermission
    ) => hasRequiredRole(user.role, allowedRoles, requiredPermission),
    [user.role]
  );

  const hasPermission = React.useCallback(
    (permission: IdpPermission) =>
      can([user.role, ...(user.backendRoles ?? [])], permission),
    [user.role, user.backendRoles]
  );

  const value = React.useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      user,
      csrfToken,
      verifyMutationCsrf,
      switchRole,
      canAccess,
      hasPermission,
      isSandboxMode,
    }),
    [
      isAuthenticated,
      user,
      csrfToken,
      verifyMutationCsrf,
      switchRole,
      canAccess,
      hasPermission,
      isSandboxMode,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    const guest = DEMO_PROFILES.guest;
    return {
      isAuthenticated: false,
      user: guest,
      csrfToken: generateCsrfToken(`${guest.id}:${guest.role}`),
      verifyMutationCsrf: () => false,
      switchRole: () => {},
      canAccess: (allowedRoles, requiredPermission) =>
        hasRequiredRole('guest', allowedRoles, requiredPermission),
      hasPermission: () => false,
      isSandboxMode: false,
    };
  }
  return ctx;
}

export interface RoleGuardProps {
  allowedRoles?: readonly UserRole[];
  permission?: IdpPermission;
  requireAuth?: boolean;
  children: React.ReactNode;
  fallbackTitle?: string;
}

export function RoleGuard({
  allowedRoles,
  permission,
  requireAuth = false,
  children,
  fallbackTitle = 'Acceso Restringido por Capacidad / Rol (RBAC)',
}: RoleGuardProps) {
  const { isAuthenticated, user, canAccess, switchRole, isSandboxMode } =
    useAuth();

  if (requireAuth && !isAuthenticated) {
    return (
      <Card className="max-w-xl mx-auto my-10">
        <CardContent className="p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-status-warning-bg text-status-warning">
            <Icon name="Lock" className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Autenticación Institucional Requerida
          </h2>
          <p className="text-sm text-muted-foreground">
            Esta aplicación es de uso exclusivo para miembros autorizados (OWASP A01 / A07).
          </p>
          {isSandboxMode && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Button size="sm" onClick={() => switchRole('board')}>
                Entrar como Junta Directiva
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => switchRole('volunteer')}
              >
                Entrar como Voluntario
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!canAccess(allowedRoles, permission)) {
    return (
      <Card className="max-w-xl mx-auto my-8">
        <CardContent className="p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-status-danger-bg text-status-danger">
            <Icon name="ShieldCheck" className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <Badge variant="danger">Política Zero-Trust RBAC (OWASP A01)</Badge>
            <h3 className="text-lg font-bold text-foreground pt-1">
              {fallbackTitle}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Tu rol actual (<strong className="text-foreground">{user.role}</strong>) no posee privilegios suficientes.
            {permission && (
              <>
                {' '}
                Capacidad requerida: <code className="font-bold">{permission}</code>.
              </>
            )}{' '}
            Roles admitidos:{' '}
            <strong className="text-foreground">
              {allowedRoles?.join(', ') ?? 'con capacidad autorizada'}
            </strong>
            .
          </p>
          {isSandboxMode && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => switchRole('admin')}
              >
                Simular Presidencia (DSC_PRESIDENT)
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => switchRole('board')}
              >
                Simular Directiva (board)
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}

export function RbacRoleSwitcher() {
  const { user, switchRole, isSandboxMode } = useAuth();

  if (!isSandboxMode) {
    return <Badge variant="success">Sesión Verificada ({user.role})</Badge>;
  }

  return (
    <div className="flex items-center gap-2 rounded-sm border border-subtle bg-surface px-2.5 py-1 text-xs text-foreground shadow-sm">
      <Icon name="ShieldCheck" className="h-3.5 w-3.5 text-primary shrink-0" />
      <span className="text-muted-foreground hidden md:inline">
        Sandbox RBAC:
      </span>
      <div className="flex items-center gap-1">
        {IDP_ROLES.map((r) => (
          <Button
            key={r}
            size="sm"
            variant={user.role === r ? 'primary' : 'ghost'}
            className="h-6 px-2 text-xs"
            onClick={() => switchRole(r)}
          >
            {r}
          </Button>
        ))}
      </div>
    </div>
  );
}

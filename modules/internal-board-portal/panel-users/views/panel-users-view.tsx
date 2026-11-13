'use client';

import * as React from 'react';
import { validateSafeInput } from '@repo/security';
import {
  Alert,
  Badge,
  Button,
  DataTable,
  Input,
  PageHeader,
  type DataTableColumn,
} from '@repo/ui';

type AccountStatus = 'ACTIVE' | 'SUSPENDED';

interface AdminUserRow {
  id: string;
  email: string;
  personName: string | null;
  roles: string[];
  status: AccountStatus;
  emailVerified: boolean;
  lastLoginAt: string | null;
}

const INITIAL_USERS: AdminUserRow[] = [
  {
    id: 'usr-01',
    email: 'presidencia@dscuni.community',
    personName: 'Sofía Mendoza',
    roles: ['DSC_PRESIDENT', 'USER'],
    status: 'ACTIVE',
    emailVerified: true,
    lastLoginAt: '12 nov 2026',
  },
  {
    id: 'usr-02',
    email: 'mateo.directiva@dscuni.community',
    personName: 'Mateo Vargas',
    roles: ['USER'],
    status: 'ACTIVE',
    emailVerified: true,
    lastLoginAt: '11 nov 2026',
  },
  {
    id: 'usr-03',
    email: 'valeria.squad@dscuni.community',
    personName: 'Valeria Rojas',
    roles: ['USER'],
    status: 'ACTIVE',
    emailVerified: true,
    lastLoginAt: '09 nov 2026',
  },
  {
    id: 'usr-04',
    email: 'cuenta.suspendida@uni.edu.pe',
    personName: null,
    roles: ['USER'],
    status: 'SUSPENDED',
    emailVerified: false,
    lastLoginAt: null,
  },
];

export function PanelUsersView() {
  const [users, setUsers] = React.useState<AdminUserRow[]>(INITIAL_USERS);
  const [statusFilter, setStatusFilter] = React.useState<'ALL' | AccountStatus>(
    'ALL'
  );
  const [onlyPresidents, setOnlyPresidents] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [rowError, setRowError] = React.useState<string | null>(null);

  const queryCheck = React.useMemo(
    () => validateSafeInput(query, 120),
    [query]
  );

  const filtered = React.useMemo(() => {
    if (!queryCheck.safe) return [];
    const q = queryCheck.sanitized.toLowerCase();

    return users.filter((u) => {
      if (statusFilter !== 'ALL' && u.status !== statusFilter) return false;
      if (onlyPresidents && !u.roles.includes('DSC_PRESIDENT')) return false;
      if (q) {
        const matchEmail = u.email.toLowerCase().includes(q);
        const matchName = (u.personName ?? '').toLowerCase().includes(q);
        if (!matchEmail && !matchName) return false;
      }
      return true;
    });
  }, [users, statusFilter, onlyPresidents, queryCheck]);

  const activePresidentsCount = React.useMemo(
    () =>
      users.filter(
        (u) => u.status === 'ACTIVE' && u.roles.includes('DSC_PRESIDENT')
      ).length,
    [users]
  );

  const togglePresident = (target: AdminUserRow) => {
    setRowError(null);
    const isPres = target.roles.includes('DSC_PRESIDENT');
    if (isPres && target.status === 'ACTIVE' && activePresidentsCount <= 1) {
      setRowError(
        `[409 LAST_PRESIDENT] ${target.email} es el único presidente activo. Nombra a otro antes de quitarle el acceso para no dejar el sistema sin administrador.`
      );
      return;
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== target.id) return u;
        return {
          ...u,
          roles: isPres ? ['USER'] : ['DSC_PRESIDENT', 'USER'],
        };
      })
    );
  };

  const toggleStatus = (target: AdminUserRow) => {
    setRowError(null);
    const isSuspending = target.status === 'ACTIVE';
    if (
      isSuspending &&
      target.roles.includes('DSC_PRESIDENT') &&
      activePresidentsCount <= 1
    ) {
      setRowError(
        `[409 LAST_PRESIDENT] No puedes suspender a ${target.email} porque es el único presidente activo del club.`
      );
      return;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === target.id
          ? { ...u, status: isSuspending ? 'SUSPENDED' : 'ACTIVE' }
          : u
      )
    );
  };

  const columns: DataTableColumn<AdminUserRow>[] = [
    {
      key: 'account',
      header: 'Cuenta',
      render: (row) => (
        <div>
          <p className="font-bold text-foreground">{row.email}</p>
          <p className="text-xs text-muted-foreground">
            {row.personName ?? 'Sin persona vinculada'}
            {!row.emailVerified && ' · correo sin verificar'}
          </p>
        </div>
      ),
    },
    {
      key: 'roles',
      header: 'Roles',
      render: (row) =>
        row.roles.includes('DSC_PRESIDENT') ? (
          <Badge variant="primary">Presidente (DSC_PRESIDENT)</Badge>
        ) : (
          <span className="text-xs text-muted-foreground">Usuario (USER)</span>
        ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'success' : 'danger'}>
          {row.status === 'ACTIVE' ? 'Activa' : 'Suspendida'}
        </Badge>
      ),
    },
    {
      key: 'lastLogin',
      header: 'Último acceso',
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.lastLoginAt ?? 'Nunca'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      render: (row) => {
        const isPres = row.roles.includes('DSC_PRESIDENT');
        return (
          <div className="flex items-center justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => togglePresident(row)}
            >
              {isPres ? 'Quitar presidencia' : 'Hacer presidente'}
            </Button>
            <Button
              size="sm"
              variant={row.status === 'ACTIVE' ? 'danger' : 'secondary'}
              onClick={() => toggleStatus(row)}
            >
              {row.status === 'ACTIVE' ? 'Suspender' : 'Reactivar'}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuarios"
        description="Quién puede entrar al panel y con qué permisos. Quitar un rol aplica al volver a iniciar sesión; suspender corta el acceso en la siguiente petición (Capacidad: user:write)."
        badge={`${filtered.length} cuentas`}
        icon="ShieldCheck"
      />

      {rowError && (
        <Alert
          variant="danger"
          title="Regla de Seguridad de Administración (LAST_PRESIDENT)"
          description={rowError}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { value: 'ALL', label: 'Todas' },
              { value: 'ACTIVE', label: 'Activas' },
              { value: 'SUSPENDED', label: 'Suspendidas' },
            ] as const
          ).map((opt) => (
            <Button
              key={opt.value}
              size="sm"
              variant={statusFilter === opt.value ? 'primary' : 'outline'}
              onClick={() => setStatusFilter(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
          <Button
            size="sm"
            variant={onlyPresidents ? 'primary' : 'outline'}
            onClick={() => setOnlyPresidents((prev) => !prev)}
          >
            Solo presidentes
          </Button>
        </div>

        <div className="w-full sm:w-80">
          <Input
            placeholder="Buscar por correo o nombre..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            error={!queryCheck.safe ? queryCheck.reason : undefined}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.id}
        emptyTitle="Ninguna cuenta coincide con lo buscado"
        emptyDescription="Intenta ajustar los filtros de estado o búsqueda."
      />
    </div>
  );
}

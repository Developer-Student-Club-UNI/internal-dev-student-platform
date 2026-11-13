'use client';

import * as React from 'react';
import { validateSafeInput } from '@repo/security';
import {
  Alert,
  Badge,
  Button,
  DataTable,
  Icon,
  Input,
  ModalDialog,
  PageHeader,
  Select,
  type DataTableColumn,
} from '@repo/ui';

type MembershipLevel =
  | 'BOARD'
  | 'DIRECTOR'
  | 'SQUAD_LEAD'
  | 'LEADER'
  | 'VOLUNTEER';

interface AdminPersonRow {
  slug: string;
  firstName: string;
  lastName: string;
  linkEmail: string | null;
  hasAccount: boolean;
  roleLabel: string | null;
  level: MembershipLevel | null;
  unitName: string | null;
  term: string | null;
  status: 'active' | 'past' | 'none';
}

const LEVEL_LABELS: Record<MembershipLevel, string> = {
  BOARD: 'Junta Directiva',
  DIRECTOR: 'Dirección',
  SQUAD_LEAD: 'Squad Lead',
  LEADER: 'Liderazgo',
  VOLUNTEER: 'Voluntariado',
};

const INITIAL_PEOPLE: AdminPersonRow[] = [
  {
    slug: 'luis-gonzales',
    firstName: 'Luis',
    lastName: 'Gonzales',
    linkEmail: 'luis.lead@dscuni.community',
    hasAccount: true,
    roleLabel: 'Lead',
    level: 'BOARD',
    unitName: null,
    term: '2026-I',
    status: 'active',
  },
  {
    slug: 'daniela-chanta',
    firstName: 'Daniela',
    lastName: 'Chanta',
    linkEmail: 'daniela.colead@dscuni.community',
    hasAccount: true,
    roleLabel: 'Co - Lead',
    level: 'BOARD',
    unitName: null,
    term: '2026-I',
    status: 'active',
  },
  {
    slug: 'cristina-ruiz',
    firstName: 'Cristina',
    lastName: 'Ruiz',
    linkEmail: 'cristina.capacitaciones@dscuni.community',
    hasAccount: true,
    roleLabel: 'Capacitaciones',
    level: 'DIRECTOR',
    unitName: 'Capacitaciones',
    term: '2026-I',
    status: 'active',
  },
  {
    slug: 'gerson-zuniga',
    firstName: 'Gerson',
    lastName: 'Zuñiga',
    linkEmail: 'gerson.tech@dscuni.community',
    hasAccount: true,
    roleLabel: 'Tech Team Lead Dev',
    level: 'LEADER',
    unitName: 'Tecnología',
    term: '2026-I',
    status: 'active',
  },
  {
    slug: 'eduardo-roberto',
    firstName: 'Eduardo',
    lastName: 'Roberto',
    linkEmail: 'eduardo.google@dscuni.community',
    hasAccount: false,
    roleLabel: 'Google',
    level: 'SQUAD_LEAD',
    unitName: 'Google Cloud',
    term: '2026-I',
    status: 'active',
  },
  {
    slug: 'alejandra-caceres',
    firstName: 'Alejandra',
    lastName: 'Cáceres Jaramillo',
    linkEmail: null,
    hasAccount: false,
    roleLabel: 'Voluntaria de Marketing',
    level: 'VOLUNTEER',
    unitName: 'Marketing',
    term: '2025-II',
    status: 'past',
  },
];

export function MembersDirectoryView() {
  const [people, setPeople] = React.useState<AdminPersonRow[]>(INITIAL_PEOPLE);
  const [statusFilter, setStatusFilter] = React.useState<
    'active' | 'past' | 'all'
  >('active');
  const [query, setQuery] = React.useState('');
  const [modalOpen, setModalOpen] = React.useState(false);

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [linkEmail, setLinkEmail] = React.useState('');
  const [roleLabel, setRoleLabel] = React.useState('');
  const [level, setLevel] = React.useState<MembershipLevel>('VOLUNTEER');
  const [unitName, setUnitName] = React.useState('Tecnología');
  const [formError, setFormError] = React.useState<string | null>(null);

  const queryCheck = React.useMemo(
    () => validateSafeInput(query, 120),
    [query]
  );

  const filtered = React.useMemo(() => {
    if (!queryCheck.safe) return [];
    const q = queryCheck.sanitized.toLowerCase();

    return people.filter((p) => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (q) {
        const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
        const email = (p.linkEmail ?? '').toLowerCase();
        if (!fullName.includes(q) && !email.includes(q)) return false;
      }
      return true;
    });
  }, [people, statusFilter, queryCheck]);

  const handleCreatePerson = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    for (const val of [firstName, lastName, linkEmail, roleLabel]) {
      const check = validateSafeInput(val);
      if (!check.safe) {
        setFormError(`[${check.threatType}] ${check.reason}`);
        return;
      }
    }

    const slug = `${firstName}-${lastName}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

    setPeople((prev) => [
      {
        slug,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        linkEmail: linkEmail.trim() || null,
        hasAccount: false,
        roleLabel: roleLabel.trim() || null,
        level,
        unitName: level === 'BOARD' ? null : unitName,
        term: '2026-I',
        status: 'active',
      },
      ...prev,
    ]);
    setModalOpen(false);
    setFirstName('');
    setLastName('');
    setLinkEmail('');
    setRoleLabel('');
  };

  const columns: DataTableColumn<AdminPersonRow>[] = [
    {
      key: 'person',
      header: 'Persona',
      render: (row) => (
        <div>
          <p className="font-bold text-primary">
            {row.firstName} {row.lastName}
          </p>
          <p className="text-xs text-muted-foreground">
            {row.linkEmail ?? 'Sin correo para vincular'}
            {row.hasAccount && ' · con cuenta'}
          </p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Cargo',
      render: (row) =>
        row.level ? (
          <div>
            <span className="block font-medium text-foreground">
              {row.roleLabel ?? 'Sin etiqueta'}
            </span>
            <span className="text-xs text-muted-foreground">
              {LEVEL_LABELS[row.level]}
            </span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Sin cargo</span>
        ),
    },
    {
      key: 'unit',
      header: 'Unidad',
      render: (row) => (
        <span>
          {row.unitName ?? <span className="text-muted-foreground">—</span>}
        </span>
      ),
    },
    {
      key: 'term',
      header: 'Ciclo',
      render: (row) => (
        <span>
          {row.term ?? <span className="text-muted-foreground">—</span>}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => (
        <Badge
          variant={
            row.status === 'active'
              ? 'success'
              : row.status === 'past'
              ? 'default'
              : 'warning'
          }
        >
          {row.status === 'active'
            ? 'Vigente'
            : row.status === 'past'
            ? 'Histórico'
            : 'Sin cargo'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipo"
        description="El equipo de este ciclo. En «Todos» está el directorio histórico completo del club (Capacidad: person:write)."
        badge={`${filtered.length} personas`}
        icon="Users"
        actions={
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <Icon name="UserPlus" className="h-4 w-4" />
            <span>Nueva persona</span>
          </Button>
        }
      />

      {!queryCheck.safe && (
        <Alert
          variant="danger"
          title={`Filtro bloqueado por @repo/security [${queryCheck.threatType}]`}
          description={queryCheck.reason}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div
          className="flex flex-wrap items-center gap-2"
          role="group"
          aria-label="Filtrar por estado"
        >
          {(
            [
              { value: 'active', label: 'Con cargo vigente' },
              { value: 'past', label: 'Solo históricos' },
              { value: 'all', label: 'Todos' },
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
        </div>

        <div className="w-full sm:w-80">
          <Input
            placeholder="Buscar por nombre o correo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            error={!queryCheck.safe ? queryCheck.reason : undefined}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.slug}
        emptyTitle="Nadie coincide con los filtros"
        emptyDescription="Prueba cambiando el filtro entre vigentes, históricos o todos."
      />

      <ModalDialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nueva persona en el directorio"
      >
        <form onSubmit={handleCreatePerson} className="space-y-4">
          {formError && (
            <Alert
              variant="danger"
              title="Bloqueado por @repo/security"
              description={formError}
            />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Nombres"
              placeholder="Ej. Valeria"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Apellidos"
              placeholder="Ej. Galindez"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <Input
            label="Correo de vinculación (linkEmail)"
            type="email"
            placeholder="valeria@uni.edu.pe"
            helperText="Permite que al registrarse con este correo adopte automáticamente su ficha del equipo."
            value={linkEmail}
            onChange={(e) => setLinkEmail(e.target.value)}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <Select
              label="Nivel (Membership Level)"
              value={level}
              onChange={(e) => setLevel(e.target.value as MembershipLevel)}
              options={[
                { value: 'BOARD', label: 'Junta Directiva (BOARD)' },
                { value: 'DIRECTOR', label: 'Dirección (DIRECTOR)' },
                { value: 'LEADER', label: 'Liderazgo (LEADER)' },
                { value: 'SQUAD_LEAD', label: 'Squad Lead (SQUAD_LEAD)' },
                { value: 'VOLUNTEER', label: 'Voluntariado (VOLUNTEER)' },
              ]}
            />
            <Input
              label="Etiqueta de Cargo"
              placeholder="Ej. Tech Team Lead Dev"
              value={roleLabel}
              onChange={(e) => setRoleLabel(e.target.value)}
            />
            <Select
              label="Unidad"
              value={unitName}
              onChange={(e) => setUnitName(e.target.value)}
              options={[
                { value: 'Tecnología', label: 'Tecnología' },
                { value: 'Capacitaciones', label: 'Capacitaciones' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'GTH', label: 'GTH' },
                { value: 'RRPP', label: 'RRPP' },
                { value: 'Google Cloud', label: 'Squad Google Cloud' },
                { value: 'AWS', label: 'Squad AWS' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Dar de alta
            </Button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
}

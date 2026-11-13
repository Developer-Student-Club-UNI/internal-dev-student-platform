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

type UnitKind = 'DIRECTORATE' | 'SQUAD';

interface AdminTeamUnitRow {
  slug: string;
  name: string;
  kind: UnitKind;
  isActive: boolean;
  displayOrder: number;
  memberships: number;
}

const INITIAL_UNITS: AdminTeamUnitRow[] = [
  {
    slug: 'capacitaciones',
    name: 'Capacitaciones',
    kind: 'DIRECTORATE',
    isActive: true,
    displayOrder: 1,
    memberships: 8,
  },
  {
    slug: 'gth',
    name: 'GTH (Gestión de Talento)',
    kind: 'DIRECTORATE',
    isActive: true,
    displayOrder: 2,
    memberships: 5,
  },
  {
    slug: 'marketing',
    name: 'Marketing',
    kind: 'DIRECTORATE',
    isActive: true,
    displayOrder: 3,
    memberships: 14,
  },
  {
    slug: 'tecnologia',
    name: 'Tecnología',
    kind: 'DIRECTORATE',
    isActive: true,
    displayOrder: 4,
    memberships: 11,
  },
  {
    slug: 'rrpp',
    name: 'RRPP',
    kind: 'DIRECTORATE',
    isActive: true,
    displayOrder: 5,
    memberships: 4,
  },
  {
    slug: 'google',
    name: 'Google Cloud',
    kind: 'SQUAD',
    isActive: true,
    displayOrder: 6,
    memberships: 6,
  },
  {
    slug: 'aws',
    name: 'AWS',
    kind: 'SQUAD',
    isActive: true,
    displayOrder: 7,
    memberships: 5,
  },
  {
    slug: 'huawei',
    name: 'Huawei Cloud',
    kind: 'SQUAD',
    isActive: true,
    displayOrder: 8,
    memberships: 3,
  },
  {
    slug: 'ibm-legacy',
    name: 'IBM Cloud (Histórico)',
    kind: 'SQUAD',
    isActive: false,
    displayOrder: 9,
    memberships: 2,
  },
];

export function PanelUnitsView() {
  const [units, setUnits] = React.useState<AdminTeamUnitRow[]>(INITIAL_UNITS);
  const [kindFilter, setKindFilter] = React.useState<'ALL' | UnitKind>('ALL');
  const [hideRetired, setHideRetired] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [kind, setKind] = React.useState<UnitKind>('DIRECTORATE');
  const [formError, setFormError] = React.useState<string | null>(null);

  const canReorder = kindFilter === 'ALL' && !hideRetired;

  const filtered = React.useMemo(() => {
    return [...units]
      .filter((u) => {
        if (kindFilter !== 'ALL' && u.kind !== kindFilter) return false;
        if (hideRetired && !u.isActive) return false;
        return true;
      })
      .sort(
        (a, b) =>
          a.displayOrder - b.displayOrder || a.slug.localeCompare(b.slug)
      );
  }, [units, kindFilter, hideRetired]);

  const swapOrder = (slugA: string, slugB: string) => {
    setUnits((prev) => {
      const unitA = prev.find((u) => u.slug === slugA);
      const unitB = prev.find((u) => u.slug === slugB);
      if (!unitA || !unitB) return prev;
      const orderA = unitB.displayOrder;
      const orderB = unitA.displayOrder;
      return prev.map((u) => {
        if (u.slug === slugA) return { ...u, displayOrder: orderA };
        if (u.slug === slugB) return { ...u, displayOrder: orderB };
        return u;
      });
    });
  };

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const check = validateSafeInput(name, 80);
    if (!check.safe) {
      setFormError(`[${check.threatType}] ${check.reason}`);
      return;
    }

    const slug = check.sanitized
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    setUnits((prev) => [
      ...prev,
      {
        slug,
        name: check.sanitized,
        kind,
        isActive: true,
        displayOrder: prev.length + 1,
        memberships: 0,
      },
    ]);
    setName('');
    setModalOpen(false);
  };

  const columns: DataTableColumn<AdminTeamUnitRow>[] = [
    {
      key: 'name',
      header: 'Unidad',
      render: (row) => (
        <div>
          <p className="font-bold text-primary">{row.name}</p>
          <p className="text-xs font-mono text-muted-foreground">{row.slug}</p>
        </div>
      ),
    },
    {
      key: 'kind',
      header: 'Tipo',
      render: (row) => (
        <span>{row.kind === 'DIRECTORATE' ? 'Dirección' : 'Squad'}</span>
      ),
    },
    {
      key: 'memberships',
      header: 'Cargos',
      render: (row) =>
        row.memberships === 0 ? (
          <span className="text-xs text-muted-foreground">Ninguno</span>
        ) : (
          <span className="font-semibold">{row.memberships}</span>
        ),
    },
    {
      key: 'order',
      header: 'Orden',
      render: (row) => {
        const idx = filtered.findIndex((u) => u.slug === row.slug);
        const prevUnit = idx > 0 ? filtered[idx - 1] : undefined;
        const nextUnit =
          idx < filtered.length - 1 ? filtered[idx + 1] : undefined;

        return (
          <div className="flex items-center gap-1.5">
            <span className="font-mono w-6">{row.displayOrder}</span>
            <Button
              size="sm"
              variant="outline"
              disabled={!canReorder || !prevUnit}
              aria-label={`Subir ${row.name}`}
              onClick={() => prevUnit && swapOrder(row.slug, prevUnit.slug)}
            >
              ↑
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!canReorder || !nextUnit}
              aria-label={`Bajar ${row.name}`}
              onClick={() => nextUnit && swapOrder(row.slug, nextUnit.slug)}
            >
              ↓
            </Button>
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Badge variant={row.isActive ? 'success' : 'default'}>
            {row.isActive ? 'Activa' : 'Retirada'}
          </Badge>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              setUnits((prev) =>
                prev.map((u) =>
                  u.slug === row.slug ? { ...u, isActive: !u.isActive } : u
                )
              )
            }
          >
            {row.isActive ? 'Retirar' : 'Reactivar'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Unidades"
        description="Las direcciones y squads del club, incluidas las retiradas. El orden aquí define el orden en /team (Capacidad: team-unit:write)."
        badge={`${filtered.length} unidades`}
        icon="FolderKanban"
        actions={
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <Icon name="Plus" className="h-4 w-4" />
            <span>Nueva unidad</span>
          </Button>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              { value: 'ALL', label: 'Todas' },
              { value: 'DIRECTORATE', label: 'Direcciones' },
              { value: 'SQUAD', label: 'Squads' },
            ] as const
          ).map((opt) => (
            <Button
              key={opt.value}
              size="sm"
              variant={kindFilter === opt.value ? 'primary' : 'outline'}
              onClick={() => setKindFilter(opt.value)}
            >
              {opt.label}
            </Button>
          ))}
        </div>

        <Button
          size="sm"
          variant={hideRetired ? 'primary' : 'outline'}
          onClick={() => setHideRetired((prev) => !prev)}
        >
          {hideRetired ? 'Mostrando solo activas' : 'Ocultar retiradas'}
        </Button>
      </div>

      {!canReorder && (
        <Alert
          variant="info"
          title="Reordenamiento desactivado con filtros activos"
          description="Quita los filtros para reordenar: las flechas intercambian con la fila vecina del catálogo completo."
        />
      )}

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.slug}
      />

      <ModalDialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nueva unidad"
      >
        <form onSubmit={handleCreateUnit} className="space-y-4">
          {formError && (
            <Alert
              variant="danger"
              title="Bloqueado por @repo/security"
              description={formError}
            />
          )}

          <Input
            label="Nombre de la Unidad"
            placeholder="Ej. Ciberseguridad / Squad Microsoft"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Select
            label="Tipo de Unidad (Kind)"
            value={kind}
            onChange={(e) => setKind(e.target.value as UnitKind)}
            options={[
              { value: 'DIRECTORATE', label: 'Dirección (DIRECTORATE)' },
              { value: 'SQUAD', label: 'Squad (SQUAD)' },
            ]}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Crear unidad
            </Button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
}

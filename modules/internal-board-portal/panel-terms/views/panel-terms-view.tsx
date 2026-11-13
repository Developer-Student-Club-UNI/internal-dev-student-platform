'use client';

import * as React from 'react';
import { validateSafeInput } from '@repo/security';
import {
  Alert,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Input,
  PageHeader,
  Select,
  type DataTableColumn,
} from '@repo/ui';

interface AdminTermRow {
  id: string;
  name: string;
  startsOn: string;
  endsOn: string;
  isCurrent: boolean;
  memberships: number;
}

const INITIAL_TERMS: AdminTermRow[] = [
  {
    id: 'term-2026-1',
    name: '2026-I',
    startsOn: '2026-03-15',
    endsOn: '2026-07-31',
    isCurrent: true,
    memberships: 32,
  },
  {
    id: 'term-2025-2',
    name: '2025-II',
    startsOn: '2025-08-18',
    endsOn: '2025-12-20',
    isCurrent: false,
    memberships: 28,
  },
  {
    id: 'term-2026-2',
    name: '2026-II',
    startsOn: '2026-08-17',
    endsOn: '2026-12-18',
    isCurrent: false,
    memberships: 0,
  },
];

export function PanelTermsView() {
  const [terms, setTerms] = React.useState<AdminTermRow[]>(INITIAL_TERMS);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [name, setName] = React.useState('');
  const [startsOn, setStartsOn] = React.useState('2027-03-15');
  const [endsOn, setEndsOn] = React.useState('2027-07-30');
  const [isCurrent, setIsCurrent] = React.useState('false');
  const [formError, setFormError] = React.useState<string | null>(null);
  const [blockedError, setBlockedError] = React.useState<string | null>(null);

  const startEdit = (term: AdminTermRow) => {
    setEditingId(term.id);
    setName(term.name);
    setStartsOn(term.startsOn);
    setEndsOn(term.endsOn);
    setIsCurrent(term.isCurrent ? 'true' : 'false');
    setFormError(null);
    setBlockedError(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setStartsOn('2027-03-15');
    setEndsOn('2027-07-30');
    setIsCurrent('false');
    setFormError(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setBlockedError(null);

    const check = validateSafeInput(name, 40);
    if (!check.safe) {
      setFormError(`[${check.threatType}] ${check.reason}`);
      return;
    }

    const markCurrent = isCurrent === 'true';

    if (editingId) {
      setTerms((prev) =>
        prev.map((t) => {
          if (t.id === editingId) {
            return {
              ...t,
              name: check.sanitized,
              startsOn,
              endsOn,
              isCurrent: markCurrent,
            };
          }
          return markCurrent ? { ...t, isCurrent: false } : t;
        })
      );
    } else {
      const nextId = `term-${Date.now()}`;
      setTerms((prev) => [
        {
          id: nextId,
          name: check.sanitized,
          startsOn,
          endsOn,
          isCurrent: markCurrent,
          memberships: 0,
        },
        ...prev.map((t) => (markCurrent ? { ...t, isCurrent: false } : t)),
      ]);
    }
    resetForm();
  };

  const handleDelete = (term: AdminTermRow) => {
    setBlockedError(null);
    if (term.memberships > 0) {
      setBlockedError(
        `[409 TERM_HAS_MEMBERSHIPS] El ciclo ${term.name} tiene ${term.memberships} cargos asociados: son el histórico del equipo, así que el ciclo no puede borrarse.`
      );
      return;
    }
    setTerms((prev) => prev.filter((t) => t.id !== term.id));
    if (editingId === term.id) resetForm();
  };

  const columns: DataTableColumn<AdminTermRow>[] = [
    {
      key: 'name',
      header: 'Ciclo',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">{row.name}</span>
          {row.isCurrent && <Badge variant="success">Vigente</Badge>}
        </div>
      ),
    },
    {
      key: 'dates',
      header: 'Fechas',
      render: (row) => (
        <span className="font-mono text-xs">
          {row.startsOn} → {row.endsOn}
        </span>
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
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={editingId === row.id}
            onClick={() => startEdit(row)}
          >
            {editingId === row.id ? 'Editando' : 'Editar'}
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(row)}
          >
            Borrar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ciclos"
        description="Los periodos académicos a los que se adscribe cada cargo. Solo uno está vigente a la vez (Capacidad: term:write)."
        badge={`${terms.length} ciclos`}
        icon="Clock"
      />

      {blockedError && (
        <Alert
          variant="warning"
          title="Borrado bloqueado por integridad de histórico"
          description={blockedError}
        />
      )}

      {/* Formulario Permanente en la misma pantalla (como en PanelTerms.tsx) */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {editingId ? `Editar ciclo` : 'Nuevo ciclo'}
            </CardTitle>
            {editingId && (
              <Button size="sm" variant="ghost" onClick={resetForm}>
                Crear uno nuevo
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            {formError && (
              <Alert
                variant="danger"
                title="Bloqueado por @repo/security"
                description={formError}
              />
            )}

            <div className="grid gap-4 sm:grid-cols-4">
              <Input
                label="Nombre"
                placeholder="2027-I"
                helperText="Formato: YYYY-I o YYYY-II"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Inicio"
                type="date"
                value={startsOn}
                onChange={(e) => setStartsOn(e.target.value)}
                required
              />
              <Input
                label="Fin"
                type="date"
                value={endsOn}
                onChange={(e) => setEndsOn(e.target.value)}
                required
              />
              <Select
                label="¿Es el ciclo vigente?"
                value={isCurrent}
                onChange={(e) => setIsCurrent(e.target.value)}
                helperText="Al marcarlo desmarca el anterior."
                options={[
                  { value: 'false', label: 'No vigente' },
                  { value: 'true', label: 'Sí, ciclo vigente único' },
                ]}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary">
                {editingId ? 'Guardar cambios' : 'Crear ciclo'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        data={terms}
        rowKey={(row) => row.id}
      />
    </div>
  );
}

'use client';

import * as React from 'react';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  PageHeader,
} from '@repo/ui';

interface AuditFieldChange {
  field: string;
  label: string;
  before: string;
  after: string;
}

interface AuditLogEntry {
  id: string;
  actorName: string;
  actorEmail: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  entityLabel: string;
  createdAt: string;
  fields: AuditFieldChange[];
}

const ACTION_VERB: Record<AuditLogEntry['action'], string> = {
  CREATE: 'creó',
  UPDATE: 'editó',
  DELETE: 'eliminó',
};

const ACTION_BADGE: Record<
  AuditLogEntry['action'],
  'success' | 'info' | 'danger'
> = {
  CREATE: 'success',
  UPDATE: 'info',
  DELETE: 'danger',
};

const AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-101',
    actorName: 'Sofía Mendoza',
    actorEmail: 'presidencia@dscuni.community',
    action: 'UPDATE',
    entityLabel: 'Evento',
    createdAt: '12 nov 2026, 16:40 (Hora Lima)',
    fields: [
      {
        field: 'status',
        label: 'estado',
        before: 'DRAFT',
        after: 'PUBLISHED',
      },
      {
        field: 'place',
        label: 'lugar',
        before: 'Por confirmar',
        after: 'Auditorio FIIS - UNI',
      },
    ],
  },
  {
    id: 'aud-102',
    actorName: 'Mateo Vargas',
    actorEmail: 'mateo.directiva@dscuni.community',
    action: 'CREATE',
    entityLabel: 'Cargo',
    createdAt: '11 nov 2026, 18:12 (Hora Lima)',
    fields: [
      {
        field: 'roleTitle',
        label: 'cargo',
        before: '—',
        after: 'Tech Team Lead Dev',
      },
      {
        field: 'term',
        label: 'ciclo',
        before: '—',
        after: '2026-I',
      },
    ],
  },
  {
    id: 'aud-103',
    actorName: 'Sofía Mendoza',
    actorEmail: 'presidencia@dscuni.community',
    action: 'UPDATE',
    entityLabel: 'Sitio',
    createdAt: '10 nov 2026, 09:25 (Hora Lima)',
    fields: [
      {
        field: 'schedule',
        label: 'horario',
        before: 'Lunes - Viernes (9:00-18:00)',
        after: 'Lunes - Sábado (9:00-22:00)',
      },
    ],
  },
];

export function PanelAuditView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Auditoría"
        description="Quién cambió qué y cuándo, del más reciente al más antiguo. Cada cambio del panel se registra en la misma transacción (Capacidad: audit:read)."
        badge={`${AUDIT_LOGS.length} registros`}
        icon="Activity"
      />

      <ul className="space-y-4">
        {AUDIT_LOGS.map((log) => (
          <li key={log.id}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-foreground flex items-center gap-2">
                    <strong className="font-bold">{log.actorName}</strong>
                    <span className="text-muted-foreground">
                      {ACTION_VERB[log.action]}
                    </span>
                    <Badge variant={ACTION_BADGE[log.action]}>
                      {log.entityLabel}
                    </Badge>
                  </p>
                  <time className="text-xs font-mono text-muted-foreground">
                    {log.createdAt}
                  </time>
                </div>
              </CardHeader>
              <CardContent>
                <dl className="grid gap-2 sm:grid-cols-2">
                  {log.fields.map((f) => (
                    <div
                      key={f.field}
                      className="rounded-sm border border-subtle bg-background px-3.5 py-2.5 text-xs"
                    >
                      <dt className="font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        {f.label}
                      </dt>
                      <dd className="flex items-center gap-2 font-mono text-foreground">
                        {log.action === 'CREATE' ? (
                          <span className="text-status-success font-semibold">
                            {f.after}
                          </span>
                        ) : log.action === 'DELETE' ? (
                          <span className="text-status-danger line-through">
                            {f.before}
                          </span>
                        ) : (
                          <>
                            <span className="text-muted-foreground line-through">
                              {f.before}
                            </span>
                            <span aria-label="cambió a">→</span>
                            <span className="text-status-success font-semibold">
                              {f.after}
                            </span>
                          </>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

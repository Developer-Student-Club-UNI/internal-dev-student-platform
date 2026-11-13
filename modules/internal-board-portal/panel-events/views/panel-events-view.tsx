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
  Textarea,
  type DataTableColumn,
} from '@repo/ui';

type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED';

interface AdminEventRow {
  slug: string;
  title: string;
  speaker: string;
  place: string;
  startsAtDate: string;
  startsAtTime: string;
  category: string;
  modality: string;
  status: EventStatus;
  description: string;
}

const INITIAL_ADMIN_EVENTS: AdminEventRow[] = [
  {
    slug: 'aprende-desarrollo-movil-con-kotlin',
    title: 'Aprende Desarrollo Móvil con Kotlin',
    speaker: 'Juan Guillermo Gómez',
    place: 'Google Meet',
    startsAtDate: '16 jul 2026',
    startsAtTime: '19:00',
    category: 'Mobile',
    modality: 'Virtual',
    status: 'PUBLISHED',
    description:
      'Fundamentos del desarrollo de aplicaciones móviles con Kotlin junto a Google Developer Expert.',
  },
  {
    slug: 'tu-primera-web-con-angular-y-firebase',
    title: 'Tu primera Web con Angular y Firebase',
    speaker: 'Cristina Ruiz',
    place: 'Auditorio FIIS - UNI',
    startsAtDate: '18 jul 2026',
    startsAtTime: '17:00',
    category: 'Web',
    modality: 'Presencial',
    status: 'PUBLISHED',
    description:
      'Taller práctico para construir y desplegar tu primera aplicación web con Angular y Firebase.',
  },
  {
    slug: 'bootcamp-mlops-2026',
    title: 'Bootcamp MLOps & Modelos Fundacionales',
    speaker: 'Daniela Chanta',
    place: 'Lab. C4 - UNI / Híbrido',
    startsAtDate: '05 ago 2026',
    startsAtTime: '18:00',
    category: 'IA',
    modality: 'Híbrido',
    status: 'DRAFT',
    description:
      'Borrador en preparación por la Dirección de Capacitaciones para el ciclo 2026-II.',
  },
  {
    slug: 'meetup-cloud-cancelado',
    title: 'Sesión Introductoria a Serverless (Reprogramado)',
    speaker: 'Jonatan Rojas',
    place: 'Google Meet',
    startsAtDate: '02 jun 2026',
    startsAtTime: '20:00',
    category: 'Cloud',
    modality: 'Virtual',
    status: 'CANCELLED',
    description: 'Sesión reprogramada por cruce con semana de exámenes parciales.',
  },
];

const STATUS_LABEL: Record<EventStatus, string> = {
  DRAFT: 'Borrador',
  PUBLISHED: 'Publicado',
  CANCELLED: 'Cancelado',
};

const STATUS_BADGE: Record<EventStatus, 'warning' | 'success' | 'danger'> = {
  DRAFT: 'warning',
  PUBLISHED: 'success',
  CANCELLED: 'danger',
};

export function PanelEventsView() {
  const [events, setEvents] =
    React.useState<AdminEventRow[]>(INITIAL_ADMIN_EVENTS);
  const [statusFilter, setStatusFilter] = React.useState<EventStatus | 'ALL'>(
    'ALL'
  );
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingSlug, setEditingSlug] = React.useState<string | null>(null);

  const [title, setTitle] = React.useState('');
  const [speaker, setSpeaker] = React.useState('');
  const [place, setPlace] = React.useState('');
  const [startsAtDate, setStartsAtDate] = React.useState('20 ago 2026');
  const [startsAtTime, setStartsAtTime] = React.useState('18:00');
  const [category, setCategory] = React.useState('Web');
  const [modality, setModality] = React.useState('Presencial');
  const [status, setStatus] = React.useState<EventStatus>('DRAFT');
  const [description, setDescription] = React.useState('');
  const [formError, setFormError] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    if (statusFilter === 'ALL') return events;
    return events.filter((e) => e.status === statusFilter);
  }, [events, statusFilter]);

  const openNewModal = () => {
    setEditingSlug(null);
    setTitle('');
    setSpeaker('');
    setPlace('');
    setStartsAtDate('20 ago 2026');
    setStartsAtTime('18:00');
    setCategory('Web');
    setModality('Presencial');
    setStatus('DRAFT');
    setDescription('');
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (row: AdminEventRow) => {
    setEditingSlug(row.slug);
    setTitle(row.title);
    setSpeaker(row.speaker);
    setPlace(row.place);
    setStartsAtDate(row.startsAtDate);
    setStartsAtTime(row.startsAtTime);
    setCategory(row.category);
    setModality(row.modality);
    setStatus(row.status);
    setDescription(row.description);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    for (const val of [title, speaker, place, description]) {
      const check = validateSafeInput(val);
      if (!check.safe) {
        setFormError(`[${check.threatType}] ${check.reason}`);
        return;
      }
    }

    const slug =
      editingSlug ??
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const nextRow: AdminEventRow = {
      slug,
      title: title.trim(),
      speaker: speaker.trim() || 'Sin ponente',
      place: place.trim() || 'Por definir',
      startsAtDate,
      startsAtTime,
      category,
      modality,
      status,
      description: description.trim(),
    };

    if (editingSlug) {
      setEvents((prev) =>
        prev.map((item) => (item.slug === editingSlug ? nextRow : item))
      );
    } else {
      setEvents((prev) => [nextRow, ...prev]);
    }
    setModalOpen(false);
  };

  const columns: DataTableColumn<AdminEventRow>[] = [
    {
      key: 'title',
      header: 'Evento',
      render: (row) => (
        <div>
          <p className="font-bold text-primary">{row.title}</p>
          <p className="text-xs text-muted-foreground">
            {row.speaker} · {row.place} ({row.modality})
          </p>
        </div>
      ),
    },
    {
      key: 'when',
      header: 'Cuándo',
      render: (row) => (
        <div>
          <span className="block font-medium text-foreground">
            {row.startsAtDate}
          </span>
          <span className="text-xs text-muted-foreground">
            {row.startsAtTime} (Hora Lima)
          </span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Categoría',
      render: (row) => <span>{row.category}</span>,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => (
        <Badge variant={STATUS_BADGE[row.status]}>
          {STATUS_LABEL[row.status]}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      align: 'right',
      render: (row) => (
        <Button size="sm" variant="outline" onClick={() => openEditModal(row)}>
          Editar
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Eventos"
        description="Aquí aparecen también los borradores y cancelados, que el sitio público no muestra (Capacidad: event:write)."
        badge={`${filtered.length} eventos`}
        icon="Calendar"
        actions={
          <Button variant="primary" onClick={openNewModal}>
            <Icon name="Plus" className="h-4 w-4" />
            <span>Nuevo evento</span>
          </Button>
        }
      />

      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filtrar por estado"
      >
        {(
          [
            { value: 'ALL', label: 'Todos' },
            { value: 'DRAFT', label: 'Borradores' },
            { value: 'PUBLISHED', label: 'Publicados' },
            { value: 'CANCELLED', label: 'Cancelados' },
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

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.slug}
        emptyTitle="Todavía no hay eventos en este estado"
        emptyDescription="Puedes crear un nuevo evento en borrador o cambiar el filtro activo."
      />

      <ModalDialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSlug ? 'Editar Evento' : 'Nuevo Evento'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && (
            <Alert
              variant="danger"
              title="Bloqueado por @repo/security"
              description={formError}
            />
          )}

          <Input
            label="Título del Evento"
            placeholder="Ej. Taller de Arquitectura Cloud"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Ponente"
              placeholder="Ej. Cristina Ruiz"
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              required
            />
            <Input
              label="Lugar / Plataforma"
              placeholder="Ej. Auditorio FIIS - UNI / Google Meet"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Select
              label="Categoría"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={[
                { value: 'Web', label: 'Web' },
                { value: 'Mobile', label: 'Mobile' },
                { value: 'Cloud', label: 'Cloud' },
                { value: 'IA', label: 'IA' },
                { value: 'Desarrollo', label: 'Desarrollo' },
              ]}
            />
            <Select
              label="Modalidad (isVirtual / isInPerson)"
              value={modality}
              onChange={(e) => setModality(e.target.value)}
              options={[
                { value: 'Presencial', label: 'Presencial' },
                { value: 'Virtual', label: 'Virtual' },
                { value: 'Híbrido', label: 'Híbrido (Ambos true)' },
              ]}
            />
            <Select
              label="Estado"
              value={status}
              onChange={(e) => setStatus(e.target.value as EventStatus)}
              options={[
                { value: 'DRAFT', label: 'Borrador (DRAFT)' },
                { value: 'PUBLISHED', label: 'Publicado (PUBLISHED)' },
                { value: 'CANCELLED', label: 'Cancelado (CANCELLED)' },
              ]}
            />
          </div>

          <Textarea
            label="Descripción"
            placeholder="Resumen del taller o evento..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar evento
            </Button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
}

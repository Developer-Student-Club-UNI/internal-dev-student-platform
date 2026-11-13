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

interface AdminProjectRow {
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  linkUrl: string | null;
  hasCover: boolean;
  displayOrder: number;
  isPublished: boolean;
}

const INITIAL_PROJECTS: AdminProjectRow[] = [
  {
    slug: 'plataforma-de-eventos-dsc',
    title: 'Plataforma de Eventos DSC',
    description:
      'Sistema web para gestionar y difundir los eventos del club: registro de asistentes y panel.',
    technologies: [
      'React',
      'TypeScript',
      'Firebase',
      'Node.js',
      'Express',
      'MongoDB',
    ],
    linkUrl: 'https://github.com/dsc-uni',
    hasCover: true,
    displayOrder: 1,
    isPublished: true,
  },
  {
    slug: 'app-de-mentorias',
    title: 'App de Mentorías',
    description:
      'Aplicación móvil que conecta a estudiantes con mentores del club según áreas de interés.',
    technologies: [
      'Flutter',
      'Dart',
      'Firebase',
      'TypeScript',
      'Supabase',
      'Next.js',
    ],
    linkUrl: null,
    hasCover: true,
    displayOrder: 2,
    isPublished: true,
  },
  {
    slug: 'bot-de-comunidad',
    title: 'Bot de Comunidad',
    description:
      'Bot de Discord que automatiza el onboarding de nuevos miembros y retos semanales.',
    technologies: ['Python', 'Discord.py', 'PostgreSQL', 'Node.js', 'Express'],
    linkUrl: null,
    hasCover: true,
    displayOrder: 3,
    isPublished: true,
  },
  {
    slug: 'idp-frontend-multiapp',
    title: 'IDP de Frontend Multi-App (Open Source)',
    description:
      'Plataforma de desarrollo interna gobernada por especificaciones para agentes de IA.',
    technologies: ['Next.js 15', 'Turborepo', 'TypeScript', 'Tailwind CSS', 'Zod'],
    linkUrl: 'https://github.com/dsc-uni/idp',
    hasCover: false,
    displayOrder: 4,
    isPublished: false,
  },
];

const TECH_SHOWN = 4;

export function PanelProjectsView() {
  const [projects, setProjects] =
    React.useState<AdminProjectRow[]>(INITIAL_PROJECTS);
  const [filter, setFilter] = React.useState<'ALL' | 'PUBLISHED' | 'DRAFT'>(
    'ALL'
  );
  const [modalOpen, setModalOpen] = React.useState(false);

  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [techsRaw, setTechsRaw] = React.useState('React, TypeScript, Node.js');
  const [linkUrl, setLinkUrl] = React.useState('');
  const [displayOrder, setDisplayOrder] = React.useState('5');
  const [isPublished, setIsPublished] = React.useState('false');
  const [formError, setFormError] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    if (filter === 'ALL') return projects;
    const target = filter === 'PUBLISHED';
    return projects.filter((p) => p.isPublished === target);
  }, [projects, filter]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    for (const val of [title, description, techsRaw, linkUrl]) {
      const check = validateSafeInput(val);
      if (!check.safe) {
        setFormError(`[${check.threatType}] ${check.reason}`);
        return;
      }
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const techs = techsRaw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    setProjects((prev) => [
      ...prev,
      {
        slug,
        title: title.trim(),
        description: description.trim(),
        technologies: techs,
        linkUrl: linkUrl.trim() || null,
        hasCover: false,
        displayOrder: Number(displayOrder) || prev.length + 1,
        isPublished: isPublished === 'true',
      },
    ]);
    setModalOpen(false);
    setTitle('');
    setDescription('');
    setLinkUrl('');
  };

  const columns: DataTableColumn<AdminProjectRow>[] = [
    {
      key: 'title',
      header: 'Proyecto',
      render: (row) => (
        <div>
          <p className="font-bold text-primary">{row.title}</p>
          <p className="text-xs text-muted-foreground">
            {row.linkUrl ? 'Con enlace' : 'Sin enlace'} ·{' '}
            {row.hasCover ? 'con portada' : 'sin portada'}
          </p>
        </div>
      ),
    },
    {
      key: 'technologies',
      header: 'Tecnologías',
      render: (row) => {
        const shown = row.technologies.slice(0, TECH_SHOWN);
        const rest = row.technologies.length - shown.length;
        return (
          <div className="flex flex-wrap items-center gap-1.5">
            {shown.map((t) => (
              <Badge key={t} variant="default">
                {t}
              </Badge>
            ))}
            {rest > 0 && <Badge variant="primary">+{rest}</Badge>}
          </div>
        );
      },
    },
    {
      key: 'displayOrder',
      header: 'Orden',
      render: (row) => <span className="font-mono">{row.displayOrder}</span>,
    },
    {
      key: 'status',
      header: 'Estado',
      render: (row) => (
        <Badge variant={row.isPublished ? 'success' : 'warning'}>
          {row.isPublished ? 'Publicado' : 'Sin publicar'}
        </Badge>
      ),
    },
    {
      key: 'toggle',
      header: 'Acción',
      align: 'right',
      render: (row) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            setProjects((prev) =>
              prev.map((p) =>
                p.slug === row.slug ? { ...p, isPublished: !p.isPublished } : p
              )
            )
          }
        >
          {row.isPublished ? 'Pasar a borrador' : 'Publicar'}
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Proyectos"
        description="Aquí aparecen también los proyectos que aún no se publican en la portada (Capacidad: project:write)."
        badge={`${filtered.length} proyectos`}
        icon="Code2"
        actions={
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <Icon name="Plus" className="h-4 w-4" />
            <span>Nuevo proyecto</span>
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        {(
          [
            { value: 'ALL', label: 'Todos' },
            { value: 'DRAFT', label: 'Sin publicar' },
            { value: 'PUBLISHED', label: 'Publicados' },
          ] as const
        ).map((opt) => (
          <Button
            key={opt.value}
            size="sm"
            variant={filter === opt.value ? 'primary' : 'outline'}
            onClick={() => setFilter(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        rowKey={(row) => row.slug}
        emptyTitle="No hay proyectos en este filtro"
        emptyDescription="Crea un nuevo proyecto o cambia el estado de publicación."
      />

      <ModalDialog
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nuevo proyecto"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          {formError && (
            <Alert
              variant="danger"
              title="Bloqueado por @repo/security"
              description={formError}
            />
          )}

          <Input
            label="Título del Proyecto"
            placeholder="Ej. Plataforma de Mentorías"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Textarea
            label="Descripción"
            placeholder="Describe el propósito y alcance técnico del proyecto..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <Input
            label="Tecnologías (separadas por comas)"
            placeholder="React, TypeScript, Node.js, PostgreSQL"
            value={techsRaw}
            onChange={(e) => setTechsRaw(e.target.value)}
            required
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Enlace (GitHub / Demo)"
              placeholder="https://github.com/..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
            />
            <Input
              label="Orden de aparición"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(e.target.value)}
            />
            <Select
              label="Visibilidad inicial"
              value={isPublished}
              onChange={(e) => setIsPublished(e.target.value)}
              options={[
                { value: 'false', label: 'Sin publicar (Borrador)' },
                { value: 'true', label: 'Publicado' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Crear proyecto
            </Button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
}

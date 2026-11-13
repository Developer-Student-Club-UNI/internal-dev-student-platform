'use client';

import * as React from 'react';
import { validateSafeInput } from '@repo/security';
import {
  Alert,
  Badge,
  Button,
  CallToActionBanner,
  Card,
  CardContent,
  EmptyState,
  Highlight,
  Icon,
  Input,
  ModalDialog,
  Select,
} from '@repo/ui';

interface DscEventItem {
  id: number;
  slug: string;
  title: string;
  category: 'Mobile' | 'Web' | 'Cloud' | 'IA' | 'Desarrollo';
  modality: 'Virtual' | 'Presencial' | 'Híbrido';
  speaker: string;
  organizer: string;
  isOwnOrganizer: boolean;
  place: string;
  startTime: string;
  endTime: string;
  date: string;
  when: 'upcoming' | 'past';
  description: string;
  image: string;
  registerUrl?: string;
}

const ALL_DSC_EVENTS: DscEventItem[] = [
  {
    id: 1,
    slug: 'aprende-desarrollo-movil-con-kotlin',
    title: 'Aprende Desarrollo Móvil con Kotlin',
    category: 'Mobile',
    modality: 'Virtual',
    speaker: 'Juan Guillermo Gómez',
    organizer: 'GDG Lima',
    isOwnOrganizer: false,
    place: 'Google Meet',
    startTime: '7:00 pm',
    endTime: '9:00 pm',
    date: '2026-07-16',
    when: 'upcoming',
    description:
      'Aprende los fundamentos del desarrollo de aplicaciones móviles con Kotlin para llevar tus proyectos al siguiente nivel junto a Juan Guillermo Gómez, Google Developer Expert en Kotlin, Firebase y GCP.',
    image: '/images/jpgs/charla1.jpg',
    registerUrl: '/contacto',
  },
  {
    id: 2,
    slug: 'tu-primera-web-con-angular-y-firebase',
    title: 'Tu primera Web con Angular y Firebase',
    category: 'Web',
    modality: 'Presencial',
    speaker: 'Cristina Ruiz',
    organizer: 'DSC UNI',
    isOwnOrganizer: true,
    place: 'Auditorio FIIS - UNI',
    startTime: '5:00 pm',
    endTime: '7:00 pm',
    date: '2026-07-18',
    when: 'upcoming',
    description:
      'Taller práctico: construye y publica tu primera aplicación web con Angular y Firebase, desde el primer componente hasta el despliegue.',
    image: '/images/jpgs/charla3.jpg',
  },
  {
    id: 3,
    slug: 'introduccion-a-google-cloud-platform',
    title: 'Introducción a Google Cloud Platform',
    category: 'Cloud',
    modality: 'Virtual',
    speaker: 'Jonatan Rojas',
    organizer: 'GDG Cloud Lima',
    isOwnOrganizer: false,
    place: 'YouTube Live',
    startTime: '8:00 pm',
    endTime: '10:00 pm',
    date: '2026-07-21',
    when: 'upcoming',
    description:
      'Descubre los conceptos base de la nube: cómputo, almacenamiento y redes, y despliega tu primera aplicación en un proveedor cloud real.',
    image: '/images/jpgs/charla2.jpg',
    registerUrl: '/contacto',
  },
  {
    id: 4,
    slug: 'machine-learning-para-principiantes',
    title: 'Machine Learning para principiantes',
    category: 'IA',
    modality: 'Virtual',
    speaker: 'Daniela Chanta',
    organizer: 'DSC UNI',
    isOwnOrganizer: true,
    place: 'Google Meet',
    startTime: '6:30 pm',
    endTime: '8:30 pm',
    date: '2026-07-23',
    when: 'upcoming',
    description:
      'Una introducción amigable al Machine Learning: entrena tu primer modelo y entiende qué hay detrás de la inteligencia artificial moderna.',
    image: '/images/jpgs/charla4.jpg',
  },
  {
    id: 5,
    slug: 'taller-git-y-github-desde-cero',
    title: 'Taller: Git y GitHub desde cero',
    category: 'Desarrollo',
    modality: 'Presencial',
    speaker: 'Gerson Zuñiga',
    organizer: 'DSC UNI',
    isOwnOrganizer: true,
    place: 'Lab. C4 - UNI',
    startTime: '4:00 pm',
    endTime: '6:00 pm',
    date: '2026-07-25',
    when: 'upcoming',
    description:
      'Domina el control de versiones: commits, ramas, pull requests y colaboración en equipo con GitHub, la herramienta esencial de todo developer.',
    image: '/images/jpgs/charla5.jpg',
    registerUrl: '/contacto',
  },
  {
    id: 6,
    slug: 'hackathon-dsc-reborn-2026',
    title: 'Hackathon DSC Reborn 2026',
    category: 'Desarrollo',
    modality: 'Presencial',
    speaker: 'Comité Técnico DSC UNI',
    organizer: 'DSC UNI',
    isOwnOrganizer: true,
    place: 'Pabellón Central - UNI',
    startTime: '9:00 am',
    endTime: '6:00 pm',
    date: '2026-05-12',
    when: 'past',
    description:
      'Jornada intensiva de innovación y desarrollo de soluciones tecnológicas en equipo para problemas reales de la comunidad universitaria.',
    image: '/images/jpgs/charla6.jpg',
  },
];

export function EventsShowcaseView() {
  const [search, setSearch] = React.useState('');
  const [when, setWhen] = React.useState<'upcoming' | 'past'>('upcoming');
  const [category, setCategory] = React.useState('ALL');
  const [modality, setModality] = React.useState('ALL');
  const [organizerFilter, setOrganizerFilter] = React.useState('ALL');
  const [selectedEvent, setSelectedEvent] =
    React.useState<DscEventItem | null>(null);

  const searchSecurity = React.useMemo(
    () => validateSafeInput(search, 120),
    [search]
  );

  const filteredEvents = React.useMemo(() => {
    if (!searchSecurity.safe) return [];
    const q = searchSecurity.sanitized.toLowerCase();

    return ALL_DSC_EVENTS.filter((evt) => {
      if (evt.when !== when) return false;
      if (category !== 'ALL' && evt.category !== category) return false;
      if (modality !== 'ALL' && evt.modality !== modality) return false;
      if (organizerFilter === 'OWN' && !evt.isOwnOrganizer) return false;
      if (organizerFilter === 'EXTERNAL' && evt.isOwnOrganizer) return false;
      if (
        q &&
        !evt.title.toLowerCase().includes(q) &&
        !evt.speaker.toLowerCase().includes(q) &&
        !evt.description.toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [searchSecurity, when, category, modality, organizerFilter]);

  const hasActiveFilters =
    search !== '' ||
    when !== 'upcoming' ||
    category !== 'ALL' ||
    modality !== 'ALL' ||
    organizerFilter !== 'ALL';

  const handleClearFilters = () => {
    setSearch('');
    setWhen('upcoming');
    setCategory('ALL');
    setModality('ALL');
    setOrganizerFilter('ALL');
  };

  return (
    <div>
      {/* 1. HERO DE AGENDA DE EVENTOS (Eventos.tsx + Eventos.module.scss) */}
      <section className="mx-auto max-w-7xl px-5 pt-12 pb-6 lg:px-12 text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
          Agenda de <Highlight>Eventos</Highlight>
        </h1>
        <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-foreground">
          Talleres, charlas y hackathons del DSC y otras agrupaciones para crecer como desarrollador. Encuentra tu próximo evento y regístrate.
        </p>
      </section>

      {/* 2. CUERPO PRINCIPAL: SIDEBAR DE FILTROS + GRILLA DE EVENTOS */}
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-12">
        {!searchSecurity.safe && (
          <div className="mb-6">
            <Alert
              variant="danger"
              title={`Búsqueda bloqueada por @repo/security [${searchSecurity.threatType}]`}
              description={searchSecurity.reason}
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Columna Lateral de Filtros (FiltersPanel.tsx) */}
          <div className="w-full lg:w-72 shrink-0 space-y-5">
            <Card>
              <CardContent className="p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Icon name="Filter" className="h-4 w-4 text-primary" />
                    <span>Filtros</span>
                  </h2>
                  {hasActiveFilters && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleClearFilters}
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </div>

                <Input
                  label="Buscar evento o ponente"
                  placeholder="Ej. Kotlin, Cloud, Git..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  error={!searchSecurity.safe ? searchSecurity.reason : undefined}
                />

                <div className="space-y-1.5">
                  <span className="block text-sm font-medium text-foreground">
                    Periodo
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      variant={when === 'upcoming' ? 'primary' : 'outline'}
                      onClick={() => setWhen('upcoming')}
                    >
                      Próximos
                    </Button>
                    <Button
                      size="sm"
                      variant={when === 'past' ? 'primary' : 'outline'}
                      onClick={() => setWhen('past')}
                    >
                      Pasados
                    </Button>
                  </div>
                </div>

                <Select
                  label="Categoría"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={[
                    { value: 'ALL', label: 'Todas las categorías' },
                    { value: 'Mobile', label: 'Mobile' },
                    { value: 'Web', label: 'Web' },
                    { value: 'Cloud', label: 'Cloud' },
                    { value: 'IA', label: 'IA & Machine Learning' },
                    { value: 'Desarrollo', label: 'Desarrollo' },
                  ]}
                />

                <Select
                  label="Modalidad"
                  value={modality}
                  onChange={(e) => setModality(e.target.value)}
                  options={[
                    { value: 'ALL', label: 'Todas las modalidades' },
                    { value: 'Virtual', label: 'Virtual' },
                    { value: 'Presencial', label: 'Presencial' },
                  ]}
                />

                <Select
                  label="Organizador"
                  value={organizerFilter}
                  onChange={(e) => setOrganizerFilter(e.target.value)}
                  options={[
                    { value: 'ALL', label: 'Todos los organizadores' },
                    { value: 'OWN', label: 'DSC UNI (Oficiales)' },
                    { value: 'EXTERNAL', label: 'Comunidades Aliadas' },
                  ]}
                />
              </CardContent>
            </Card>
          </div>

          {/* Lista de Eventos */}
          <div className="flex-1 w-full space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-subtle pb-4">
              <h2 className="text-2xl font-bold text-foreground">
                {when === 'past' ? (
                  <>
                    Eventos <Highlight>Pasados</Highlight>
                  </>
                ) : (
                  <>
                    <Highlight>Próximos</Highlight> Eventos
                  </>
                )}
              </h2>
              <span className="text-sm font-medium text-muted-foreground">
                {filteredEvents.length === 1
                  ? '1 evento encontrado'
                  : `${filteredEvents.length} eventos encontrados`}
              </span>
            </div>

            {filteredEvents.length === 0 ? (
              <EmptyState
                icon="Search"
                title="No encontramos eventos"
                description={
                  when === 'past'
                    ? 'Aún no hay eventos pasados que coincidan.'
                    : 'Prueba con otros filtros.'
                }
                action={
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleClearFilters}
                  >
                    Restablecer filtros
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {filteredEvents.map((event) => (
                  <article
                    key={event.slug}
                    className="flex flex-col rounded-feature rounded-bl-none border border-subtle bg-surface shadow-md overflow-hidden"
                  >
                    <div className="relative h-52 w-full overflow-hidden group">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge variant="primary">{event.category}</Badge>
                        <Badge variant="info">{event.modality}</Badge>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center bg-primary-darkest/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          size="sm"
                          variant="secondary"
                          shape="pill"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <Icon name="Search" className="h-4 w-4" />
                          <span>Ampliar afiche</span>
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Organiza: <strong>{event.organizer}</strong>
                        </p>
                        <h3 className="text-lg font-bold text-foreground mt-0.5">
                          {event.title}
                        </h3>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {event.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-1 text-xs text-muted-foreground">
                        <div>
                          <strong className="block text-foreground">
                            Ponente:
                          </strong>
                          <span>{event.speaker}</span>
                        </div>
                        <div>
                          <strong className="block text-foreground">
                            Ubicación:
                          </strong>
                          <span>{event.place}</span>
                        </div>
                        <div>
                          <strong className="block text-foreground">
                            Fecha:
                          </strong>
                          <span>{event.date}</span>
                        </div>
                        <div>
                          <strong className="block text-foreground">
                            Hora:
                          </strong>
                          <span>
                            {event.startTime} - {event.endTime}
                          </span>
                        </div>
                      </div>

                      <div className="mt-auto pt-4 flex items-center justify-between">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedEvent(event)}
                        >
                          Ver detalles
                        </Button>
                        {event.registerUrl ? (
                          <a href={event.registerUrl}>
                            <Button size="sm" variant="primary" shape="pill">
                              Registro
                            </Button>
                          </a>
                        ) : (
                          <span className="rounded-pill border border-dashed border-subtle px-4 py-1 text-xs font-semibold text-muted-foreground">
                            Registro pronto
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mt-12">
        <CallToActionBanner href="/contacto" buttonLabel="Ver más" />
      </div>

      <ModalDialog
        isOpen={selectedEvent !== null}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title}
      >
        {selectedEvent && (
          <div className="space-y-4">
            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              className="w-full max-h-72 object-cover rounded-md"
            />
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">{selectedEvent.category}</Badge>
              <Badge variant="info">{selectedEvent.modality}</Badge>
              <Badge variant="outline">{selectedEvent.organizer}</Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedEvent.description}
            </p>
            <div className="grid grid-cols-2 gap-3 rounded-sm bg-background p-4 text-xs">
              <div>
                <strong className="block text-foreground">Ponente:</strong>
                <span className="text-muted-foreground">
                  {selectedEvent.speaker}
                </span>
              </div>
              <div>
                <strong className="block text-foreground">Ubicación:</strong>
                <span className="text-muted-foreground">
                  {selectedEvent.place}
                </span>
              </div>
              <div>
                <strong className="block text-foreground">Fecha:</strong>
                <span className="text-muted-foreground">
                  {selectedEvent.date}
                </span>
              </div>
              <div>
                <strong className="block text-foreground">Horario:</strong>
                <span className="text-muted-foreground">
                  {selectedEvent.startTime} - {selectedEvent.endTime}
                </span>
              </div>
            </div>
          </div>
        )}
      </ModalDialog>
    </div>
  );
}

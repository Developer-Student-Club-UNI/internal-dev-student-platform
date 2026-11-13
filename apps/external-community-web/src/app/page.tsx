'use client';

import * as React from 'react';
import {
  AlliancesShowcase,
  Badge,
  Button,
  CallToActionBanner,
  Highlight,
  Icon,
  ModalDialog,
  SectionTitle,
} from '@repo/ui';

interface FeaturedEvent {
  slug: string;
  title: string;
  category: string;
  modality: string;
  speaker: string;
  organizer: string;
  place: string;
  dateFormatted: string;
  timeFormatted: string;
  description: string;
  image: string;
  registerUrl?: string;
}

const FEATURED_EVENTS: FeaturedEvent[] = [
  {
    slug: 'aprende-desarrollo-movil-con-kotlin',
    title: 'Aprende Desarrollo Móvil con Kotlin',
    category: 'Mobile',
    modality: 'Virtual',
    speaker: 'Juan Guillermo Gómez',
    organizer: 'GDG Lima',
    place: 'Google Meet',
    dateFormatted: '16 de julio de 2026',
    timeFormatted: '7:00 pm - 9:00 pm',
    description:
      'Aprende los fundamentos del desarrollo de aplicaciones móviles con Kotlin para llevar tus proyectos al siguiente nivel junto a Juan Guillermo Gómez, Google Developer Expert en Kotlin, Firebase y GCP.',
    image: '/images/jpgs/charla1.jpg',
    registerUrl: '/contacto',
  },
  {
    slug: 'tu-primera-web-con-angular-y-firebase',
    title: 'Tu primera Web con Angular y Firebase',
    category: 'Web',
    modality: 'Presencial',
    speaker: 'Cristina Ruiz',
    organizer: 'DSC UNI',
    place: 'Auditorio FIIS - UNI',
    dateFormatted: '18 de julio de 2026',
    timeFormatted: '5:00 pm - 7:00 pm',
    description:
      'Taller práctico: construye y publica tu primera aplicación web con Angular y Firebase, desde el primer componente hasta el despliegue.',
    image: '/images/jpgs/charla3.jpg',
  },
  {
    slug: 'introduccion-a-google-cloud-platform',
    title: 'Introducción a Google Cloud Platform',
    category: 'Cloud',
    modality: 'Virtual',
    speaker: 'Jonatan Rojas',
    organizer: 'GDG Cloud Lima',
    place: 'YouTube Live',
    dateFormatted: '21 de julio de 2026',
    timeFormatted: '8:00 pm - 10:00 pm',
    description:
      'Descubre los conceptos base de la nube: cómputo, almacenamiento y redes, y despliega tu primera aplicación en un proveedor cloud real.',
    image: '/images/jpgs/charla2.jpg',
    registerUrl: '/contacto',
  },
  {
    slug: 'machine-learning-para-principiantes',
    title: 'Machine Learning para principiantes',
    category: 'IA',
    modality: 'Virtual',
    speaker: 'Daniela Chanta',
    organizer: 'DSC UNI',
    place: 'Google Meet',
    dateFormatted: '23 de julio de 2026',
    timeFormatted: '6:30 pm - 8:30 pm',
    description:
      'Una introducción amigable al Machine Learning: entrena tu primer modelo y entiende qué hay detrás de la inteligencia artificial moderna.',
    image: '/images/jpgs/charla4.jpg',
  },
  {
    slug: 'taller-git-y-github-desde-cero',
    title: 'Taller: Git y GitHub desde cero',
    category: 'Desarrollo',
    modality: 'Presencial',
    speaker: 'Gerson Zuñiga',
    organizer: 'DSC UNI',
    place: 'Lab. C4 - UNI',
    dateFormatted: '25 de julio de 2026',
    timeFormatted: '4:00 pm - 6:00 pm',
    description:
      'Domina el control de versiones: commits, ramas, pull requests y colaboración en equipo con GitHub, la herramienta esencial de todo developer.',
    image: '/images/jpgs/charla5.jpg',
    registerUrl: '/contacto',
  },
];

interface FeaturedProject {
  slug: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  link?: string;
}

const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    slug: 'plataforma-de-eventos-dsc',
    title: 'Plataforma de Eventos DSC',
    description:
      'Sistema web para gestionar y difundir los eventos del club: registro de asistentes, recordatorios por correo y panel de administración para los organizadores.',
    technologies: [
      'React',
      'TypeScript',
      'Firebase',
      'Node.js',
      'Express',
      'MongoDB',
    ],
    image: '/images/jpgs/charla1.jpg',
    link: 'https://github.com/dsc-uni',
  },
  {
    slug: 'app-de-mentorias',
    title: 'App de Mentorías',
    description:
      'Aplicación móvil que conecta a estudiantes con mentores del club según áreas de interés, con agenda de sesiones y seguimiento de progreso.',
    technologies: [
      'Flutter',
      'Dart',
      'Firebase',
      'TypeScript',
      'Supabase',
      'Next.js',
    ],
    image: '/images/jpgs/charla2.jpg',
  },
  {
    slug: 'bot-de-comunidad',
    title: 'Bot de Comunidad',
    description:
      'Bot de Discord que automatiza el onboarding de nuevos miembros, comparte recursos de aprendizaje y organiza retos de programación semanales.',
    technologies: [
      'Python',
      'Discord.py',
      'PostgreSQL',
      'Node.js',
      'Express',
      'Flutter',
    ],
    image: '/images/jpgs/charla4.jpg',
  },
  {
    slug: 'portal-de-recursos',
    title: 'Portal de Recursos',
    description:
      'Biblioteca colaborativa de tutoriales, guías y grabaciones de talleres, con buscador por tecnología y sistema de contribuciones de la comunidad.',
    technologies: [
      'Next.js',
      'Tailwind',
      'Supabase',
      'TypeScript',
      'Node.js',
      'Express',
    ],
    image: '/images/jpgs/charla5.jpg',
  },
];

export default function ExternalHomePage() {
  const [carouselOffset, setCarouselOffset] = React.useState(0);
  const [selectedEvent, setSelectedEvent] =
    React.useState<FeaturedEvent | null>(null);
  const [selectedProject, setSelectedProject] =
    React.useState<FeaturedProject | null>(null);

  const visibleEvents = React.useMemo(() => {
    const count = 3;
    const slice = FEATURED_EVENTS.slice(carouselOffset, carouselOffset + count);
    if (slice.length < count) {
      return [
        ...slice,
        ...FEATURED_EVENTS.slice(0, count - slice.length),
      ];
    }
    return slice;
  }, [carouselOffset]);

  const handlePrevEvents = () => {
    setCarouselOffset((prev) =>
      prev === 0 ? FEATURED_EVENTS.length - 1 : prev - 1
    );
  };

  const handleNextEvents = () => {
    setCarouselOffset((prev) =>
      prev + 1 >= FEATURED_EVENTS.length ? 0 : prev + 1
    );
  };

  return (
    <div>
      {/* 1. HERO OFICIAL DSC UNI (Hero.tsx + Hero.module.scss) */}
      <section className="relative overflow-hidden bg-surface pt-8">
        <img
          src="/assets/points-left.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-0 -left-8 hidden lg:block w-52 opacity-90"
        />
        <img
          src="/assets/points-right.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-0 -right-8 hidden lg:block w-52 opacity-90"
        />

        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3 px-6 pb-8">
          <div className="flex flex-col items-center sm:items-end text-center sm:text-right leading-tight">
            <strong className="text-2xl sm:text-3xl font-bold text-foreground">
              Developer Student Club
            </strong>
            <small className="text-lg sm:text-xl text-muted-foreground">
              Universidad Nacional de Ingeniería
            </small>
          </div>
          <div
            aria-hidden="true"
            className="hidden sm:block h-20 w-1 bg-foreground shrink-0 mx-1"
          />
          <img
            src="/assets/DSC-logo.png"
            alt="DSC UNI"
            className="h-16 sm:h-24 w-auto"
          />
        </div>

        <div className="relative mt-8 lg:mt-12 flex items-center justify-center gap-6 bg-primary-darkest rounded-bl-hero px-6 py-10 lg:py-0">
          <img
            src="/assets/fondo.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 w-full h-24 lg:h-44 -translate-y-1/3 object-cover rounded-bl-hero"
          />

          <img
            src="/assets/boy.png"
            alt=""
            aria-hidden="true"
            className="relative z-10 hidden md:block w-44 lg:w-72 h-auto shrink-0 -mt-14 lg:-mt-24 rounded-bl-hero"
          />

          <h1 className="relative z-10 flex-1 text-center text-3xl sm:text-4xl font-normal leading-snug text-primary-foreground py-6">
            Making{' '}
            <span className="font-bold text-primary-medium">good</span>
            <br />
            things,{' '}
            <span className="inline-block bg-surface px-2.5 font-bold text-primary-dark">
              together
            </span>
          </h1>

          <img
            src="/assets/girl.png"
            alt=""
            aria-hidden="true"
            className="relative z-10 hidden md:block w-44 lg:w-72 h-auto shrink-0 -mt-14 lg:-mt-24"
          />
        </div>
      </section>

      {/* 2. EVENTOS DESTACADOS (EventsCarousel.tsx + EventCard.tsx) */}
      <section className="bg-surface py-16 px-5 lg:px-12">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="flex items-center justify-center gap-6 sm:gap-12">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Eventos anteriores"
              onClick={handlePrevEvents}
              className="h-10 w-10 rounded-full border border-subtle text-primary hover:bg-background"
            >
              ‹
            </Button>

            <SectionTitle>
              <Highlight>Eventos</Highlight> Destacados
            </SectionTitle>

            <Button
              variant="ghost"
              size="sm"
              aria-label="Siguientes eventos"
              onClick={handleNextEvents}
              className="h-10 w-10 rounded-full border border-subtle text-primary hover:bg-background"
            >
              ›
            </Button>
          </div>

          <div className="grid gap-8 md:grid-cols-3 justify-items-center">
            {visibleEvents.map((event) => (
              <article
                key={event.slug}
                className="flex flex-col w-full max-w-sm rounded-feature rounded-bl-none bg-surface shadow-md border border-subtle overflow-hidden"
              >
                <div className="relative h-56 w-full overflow-hidden group">
                  <img
                    src={event.image}
                    alt={`Afiche del evento ${event.title}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className=" inset-0 absolute flex items-center justify-center bg-primary-darkest/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      size="sm"
                      variant="secondary"
                      shape="pill"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <Icon name="Search" className="h-4 w-4" />
                      <span>Ver detalle</span>
                    </Button>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-2.5 p-5">
                  <p className="text-xs text-muted-foreground">
                    Información del evento:
                  </p>
                  <h3 className="text-lg font-bold text-foreground">
                    {event.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1 text-xs text-muted-foreground">
                    <div className="flex items-start gap-1.5">
                      <Icon
                        name="Users"
                        className="h-4 w-4 shrink-0 text-primary-dark mt-0.5"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          Ponente:
                        </span>
                        <span>{event.speaker}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <Icon
                        name="MapPin"
                        className="h-4 w-4 shrink-0 text-primary-dark mt-0.5"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          Ubicación:
                        </span>
                        <span>{event.place}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <Icon
                        name="Calendar"
                        className="h-4 w-4 shrink-0 text-primary-dark mt-0.5"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          Fecha:
                        </span>
                        <span>{event.dateFormatted}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1.5">
                      <Icon
                        name="Clock"
                        className="h-4 w-4 shrink-0 text-primary-dark mt-0.5"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          Hora:
                        </span>
                        <span>{event.timeFormatted}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 flex justify-center">
                    {event.registerUrl ? (
                      <a href={event.registerUrl}>
                        <Button size="sm" variant="primary" shape="pill" className="px-8">
                          Registro
                        </Button>
                      </a>
                    ) : (
                      <span className="rounded-pill border border-dashed border-subtle px-6 py-1.5 text-sm font-semibold text-muted-foreground">
                        Registro pronto
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <a
              href="/eventos"
              className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary-dark transition-colors"
            >
              <span>Ver todos los eventos</span>
              <Icon name="ArrowRight" className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* 3. NUESTROS PROYECTOS (ProjectsSection.tsx + ProjectCard.tsx) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark py-16 px-5 lg:px-12">
        <img
          src="/assets/dsc-logo2.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-6 right-8 w-52 lg:w-80 opacity-25"
        />
        <img
          src="/assets/dsc-logo2.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-14 -left-24 w-52 lg:w-80 -rotate-6 opacity-25"
        />

        <div className="relative z-10 mx-auto max-w-7xl space-y-10">
          <div className="space-y-1">
            <p className="text-sm text-primary-foreground/80">
              Destaca y ponte a prueba
            </p>
            <SectionTitle inverted align="left">
              Nuestros <Highlight inverted>Proyectos</Highlight>
            </SectionTitle>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {FEATURED_PROJECTS.map((project) => (
              <article
                key={project.slug}
                className="flex flex-col justify-between gap-4 rounded-md bg-surface p-6 text-foreground shadow-lg"
              >
                <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-stretch">
                  <div className="flex flex-1 flex-col min-w-0">
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm font-semibold text-primary-medium mb-1">
                      Descripción del proyecto:
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>

                    <ul className="mt-auto pt-4 flex flex-wrap gap-2">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <li
                          key={tech}
                          className="rounded-sm border border-subtle bg-background px-3 py-1 text-xs text-muted-foreground"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col items-center gap-3 shrink-0 w-32">
                    <div className="h-32 w-32 rounded-full overflow-hidden border border-subtle">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="primary"
                      shape="pill"
                      fullWidth
                      onClick={() => setSelectedProject(project)}
                    >
                      Ver más
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. NUESTRAS ALIANZAS (AlliancesCarousel.tsx) */}
      <AlliancesShowcase />

      {/* 5. CALL TO ACTION (CallToAction.tsx) */}
      <CallToActionBanner href="/contacto" buttonLabel="Ver más" />

      {/* MODAL DE DETALLE DE EVENTO */}
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
                <strong className="block text-foreground">Lugar:</strong>
                <span className="text-muted-foreground">
                  {selectedEvent.place}
                </span>
              </div>
              <div>
                <strong className="block text-foreground">Fecha:</strong>
                <span className="text-muted-foreground">
                  {selectedEvent.dateFormatted}
                </span>
              </div>
              <div>
                <strong className="block text-foreground">Horario:</strong>
                <span className="text-muted-foreground">
                  {selectedEvent.timeFormatted}
                </span>
              </div>
            </div>
          </div>
        )}
      </ModalDialog>

      {/* MODAL DE DETALLE DE PROYECTO */}
      <ModalDialog
        isOpen={selectedProject !== null}
        onClose={() => setSelectedProject(null)}
        title={selectedProject?.title}
      >
        {selectedProject && (
          <div className="space-y-4">
            <img
              src={selectedProject.image}
              alt={selectedProject.title}
              className="w-full max-h-64 object-cover rounded-md"
            />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedProject.description}
            </p>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Tecnologías empleadas
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies.map((tech) => (
                  <Badge key={tech} variant="primary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
            {selectedProject.link && (
              <div className="pt-2">
                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="primary" shape="pill">
                    <span>Ver repositorio en GitHub</span>
                    <Icon name="ExternalLink" className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
            )}
          </div>
        )}
      </ModalDialog>
    </div>
  );
}

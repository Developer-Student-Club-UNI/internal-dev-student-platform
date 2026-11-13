'use client';

import * as React from 'react';
import {
  Badge,
  Button,
  CallToActionBanner,
  Highlight,
  Icon,
  ModalDialog,
  SectionTitle,
} from '@repo/ui';

type LeaderGroup = 'junta-directiva' | 'direccion' | 'tech' | 'squad';

interface TeamLeader {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  group: LeaderGroup;
  photo: string;
  about: string;
  skills: string[];
  linkedin?: string;
  github?: string;
}

interface TeamVolunteer {
  id: number;
  firstName: string;
  lastName: string;
  career: string;
  area: string;
  photo: string;
  about: string;
  skills: string[];
  linkedin?: string;
  github?: string;
}

const LEADERS: TeamLeader[] = [
  {
    id: 1,
    firstName: 'Valeria',
    lastName: 'Galindez',
    role: 'Secretaría',
    group: 'junta-directiva',
    photo: '/images/avatars/avatar.svg',
    about:
      '¡Hola! Soy estudiante de Ingeniería. Me encanta organizar equipos y hacer que las cosas sucedan dentro del club.',
    skills: ['Gestión', 'Scrum', 'Notion', 'Comunicación'],
    linkedin: 'https://linkedin.com',
  },
  {
    id: 2,
    firstName: 'Luis',
    lastName: 'Gonzales',
    role: 'Lead',
    group: 'junta-directiva',
    photo: '/images/avatars/avatar.svg',
    about:
      'Lead del DSC UNI. Apasionado por construir comunidad y por el desarrollo backend.',
    skills: ['Node.js', 'GCP', 'Firebase', 'Liderazgo'],
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
  },
  {
    id: 3,
    firstName: 'Daniela',
    lastName: 'Chanta',
    role: 'Co - Lead',
    group: 'junta-directiva',
    photo: '/images/avatars/avatar.svg',
    about:
      'Co-Lead del club. Me interesa el diseño de producto y la experiencia de usuario.',
    skills: ['UX', 'Figma', 'Design Systems', 'Investigación'],
    linkedin: 'https://linkedin.com',
  },
  {
    id: 4,
    firstName: 'Cristina',
    lastName: 'Ruiz',
    role: 'Capacitaciones',
    group: 'direccion',
    photo: '/images/avatars/avatar.svg',
    about:
      'Dirijo las capacitaciones del club: talleres, charlas y rutas de aprendizaje para los miembros.',
    skills: ['Machine Learning', 'Python', 'Teaching'],
    linkedin: 'https://linkedin.com',
  },
  {
    id: 5,
    firstName: 'Sharon',
    lastName: 'Quiñones',
    role: 'GTH',
    group: 'direccion',
    photo: '/images/avatars/avatar.svg',
    about:
      '¡Hola! Soy estudiante de Ingeniería. Me gusta crear experiencias amigables para los usuarios en la web.',
    skills: [
      'Javascript',
      'Angular',
      'SEO',
      'Typescript',
      'Accessibility',
      'Web Performance',
    ],
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
  },
  {
    id: 6,
    firstName: 'Maria',
    lastName: 'Limachi',
    role: 'Marketing',
    group: 'direccion',
    photo: '/images/avatars/avatar.svg',
    about:
      'Encargada de la imagen del club y de que nuestros eventos lleguen a más estudiantes.',
    skills: ['Marketing Digital', 'Branding', 'Redes Sociales'],
    linkedin: 'https://linkedin.com',
  },
  {
    id: 7,
    firstName: 'Fransua',
    lastName: 'Leon',
    role: 'Tecnología',
    group: 'direccion',
    photo: '/images/avatars/avatar.svg',
    about:
      'Dirijo el área de tecnología del club: proyectos internos y mentoría técnica.',
    skills: ['React', 'TypeScript', 'Cloud', 'Arquitectura'],
    github: 'https://github.com',
  },
  {
    id: 8,
    firstName: 'Sebastian',
    lastName: 'Siccha',
    role: 'RRPP',
    group: 'direccion',
    photo: '/images/avatars/avatar.svg',
    about:
      'Gestiono las relaciones públicas y las alianzas del club con empresas y otras comunidades.',
    skills: ['Networking', 'Alianzas', 'Comunicación'],
    linkedin: 'https://linkedin.com',
  },
  {
    id: 9,
    firstName: 'Cesar',
    lastName: 'Salazar',
    role: 'Subdirector de Tecnología',
    group: 'tech',
    photo: '/images/avatars/avatar.svg',
    about:
      'Apoyo la dirección técnica del club y coordino los equipos de desarrollo.',
    skills: ['Java', 'Spring', 'DevOps'],
    github: 'https://github.com',
  },
  {
    id: 10,
    firstName: 'Gerson',
    lastName: 'Zuñiga',
    role: 'Tech Team Lead Dev',
    group: 'tech',
    photo: '/images/avatars/avatar.svg',
    about:
      'Lidero el equipo de desarrollo web del club. Fan de React y del open source.',
    skills: ['React', 'TypeScript', 'Node.js', 'SCSS'],
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
  },
  {
    id: 11,
    firstName: 'Jonatan',
    lastName: 'Rojas',
    role: 'Tech Team Lead Cloud',
    group: 'tech',
    photo: '/images/avatars/avatar.svg',
    about:
      'Lidero el equipo de cloud. Me apasiona la infraestructura y la automatización.',
    skills: ['GCP', 'Terraform', 'Kubernetes'],
    github: 'https://github.com',
  },
  {
    id: 12,
    firstName: 'Jheisson',
    lastName: 'Hilario',
    role: 'Huawei',
    group: 'squad',
    photo: '/images/avatars/avatar.svg',
    about: 'Miembro del squad Huawei Cloud del club.',
    skills: ['Huawei Cloud', 'Python'],
    linkedin: 'https://linkedin.com',
  },
  {
    id: 13,
    firstName: 'Eduardo',
    lastName: 'Roberto',
    role: 'Google',
    group: 'squad',
    photo: '/images/avatars/avatar.svg',
    about: 'Miembro del squad de Google Cloud del club.',
    skills: ['GCP', 'Firebase', 'Flutter'],
    github: 'https://github.com',
  },
  {
    id: 14,
    firstName: 'Jhon',
    lastName: 'Rojas',
    role: 'IBM',
    group: 'squad',
    photo: '/images/avatars/avatar.svg',
    about: 'Miembro del squad de IBM Cloud del club.',
    skills: ['IBM Cloud', 'Watson', 'Node.js'],
    linkedin: 'https://linkedin.com',
  },
  {
    id: 15,
    firstName: 'Brenda',
    lastName: 'Mendoza',
    role: 'AWS',
    group: 'squad',
    photo: '/images/avatars/avatar.svg',
    about: 'Miembro del squad de AWS del club.',
    skills: ['AWS', 'Lambda', 'DynamoDB'],
    linkedin: 'https://linkedin.com',
  },
  {
    id: 16,
    firstName: 'Cesar',
    lastName: 'Augusto',
    role: 'Microsoft',
    group: 'squad',
    photo: '/images/avatars/avatar.svg',
    about: 'Miembro del squad de Microsoft Azure del club.',
    skills: ['Azure', 'C#', '.NET'],
    github: 'https://github.com',
  },
];

const VOLUNTEERS: TeamVolunteer[] = [
  {
    id: 1,
    firstName: 'Alejandra',
    lastName: 'Cáceres Jaramillo',
    career: 'Ing. de Sistemas',
    area: 'Marketing',
    photo: '/images/jpgs/charla1.jpg',
    about:
      'Voluntaria del área de Marketing. Me encanta contar historias y hacer que la comunidad crezca a través de las redes.',
    skills: ['Marketing Digital', 'Copywriting', 'Canva', 'Community Management'],
    linkedin: 'https://linkedin.com',
  },
  {
    id: 2,
    firstName: 'Julio Alfonso',
    lastName: 'Suarez Durand',
    career: 'Ing. de Sistemas',
    area: 'Marketing',
    photo: '/images/jpgs/charla2.jpg',
    about:
      'Apasionado por la creación de contenido y el diseño de campañas para eventos del club.',
    skills: ['Diseño Gráfico', 'Redes Sociales', 'Figma', 'Storytelling'],
    github: 'https://github.com',
  },
  {
    id: 3,
    firstName: 'Camila',
    lastName: 'Paredes Soto',
    career: 'Ing. de Software',
    area: 'Tecnología',
    photo: '/images/jpgs/charla3.jpg',
    about:
      'Colaboro en el desarrollo de las plataformas web del club y talleres prácticos de frontend.',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    github: 'https://github.com',
  },
  {
    id: 4,
    firstName: 'Rodrigo',
    lastName: 'Vargas Quispe',
    career: 'Ciencia de la Computación',
    area: 'Inteligencia Artificial',
    photo: '/images/jpgs/charla4.jpg',
    about:
      'Entusiasta de los modelos de lenguaje y visión computacional aplicados a proyectos estudiantiles.',
    skills: ['Python', 'PyTorch', 'Machine Learning', 'Data Science'],
    linkedin: 'https://linkedin.com',
  },
  {
    id: 5,
    firstName: 'Lucía',
    lastName: 'Mendoza Salazar',
    career: 'Ing. Industrial',
    area: 'Gestión de Talento (GTH)',
    photo: '/images/jpgs/charla5.jpg',
    about:
      'Coordino la integración de nuevos voluntarios y el seguimiento de clima dentro de los squads.',
    skills: ['Liderazgo', 'Organización', 'Mentoría', 'Scrum'],
    linkedin: 'https://linkedin.com',
  },
  {
    id: 6,
    firstName: 'Mateo',
    lastName: 'Huamán Castro',
    career: 'Ing. de Sistemas',
    area: 'Cloud & DevOps',
    photo: '/images/jpgs/charla6.jpg',
    about:
      'Apoyo en el despliegue de laboratorios cloud y talleres de contenedores para la comunidad.',
    skills: ['Docker', 'Google Cloud', 'Linux', 'GitHub Actions'],
    github: 'https://github.com',
  },
];

interface SelectedMemberModal {
  name: string;
  subtitle: string;
  photo: string;
  about: string;
  skills: string[];
  linkedin?: string;
  github?: string;
}

const GROUP_BADGE_LABEL: Partial<Record<LeaderGroup, string>> = {
  'junta-directiva': 'Junta Directiva',
  direccion: 'Dirección',
  squad: 'Squad',
};

const GROUP_BADGE_VARIANT: Partial<
  Record<LeaderGroup, 'warning' | 'primary' | 'success'>
> = {
  'junta-directiva': 'warning',
  direccion: 'primary',
  squad: 'success',
};

export function TeamView() {
  const [selectedMember, setSelectedMember] =
    React.useState<SelectedMemberModal | null>(null);

  const renderLeaderChips = (group: LeaderGroup) =>
    LEADERS.filter((l) => l.group === group).map((leader) => {
      const fullName = `${leader.firstName} ${leader.lastName}`;
      const badgeLabel = GROUP_BADGE_LABEL[leader.group];
      const badgeVariant = GROUP_BADGE_VARIANT[leader.group] ?? 'primary';

      return (
        <div
          key={leader.id}
          className="flex items-center gap-3.5 rounded-pill border border-subtle bg-surface px-4 py-2.5 shadow-sm transition-transform hover:-translate-y-0.5"
        >
          <img
            src={leader.photo}
            alt={fullName}
            className="h-12 w-12 rounded-full object-cover border border-subtle bg-background shrink-0"
          />
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold text-foreground">
              {fullName}
            </span>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground">
                {leader.role}
              </span>
              {badgeLabel && <Badge variant={badgeVariant}>{badgeLabel}</Badge>}
            </div>
          </div>
          <Button
            size="sm"
            variant="ghost"
            shape="pill"
            aria-label={`Ver perfil de ${fullName}`}
            onClick={() =>
              setSelectedMember({
                name: fullName,
                subtitle: `${badgeLabel ?? 'Liderazgo Técnico'} — ${leader.role}`,
                photo: leader.photo,
                about: leader.about,
                skills: leader.skills,
                linkedin: leader.linkedin,
                github: leader.github,
              })
            }
          >
            Ver
          </Button>
        </div>
      );
    });

  return (
    <div>
      {/* 1. HERO DE EQUIPO (Team.tsx + Team.module.scss) */}
      <section className="mx-auto flex max-w-7xl flex-col md:flex-row items-center justify-between gap-10 px-5 py-12 lg:px-12">
        <div className="max-w-xl space-y-6">
          <h1 className="text-2xl sm:text-4xl font-bold leading-snug text-foreground">
            Conoce a nuestro{' '}
            <span className="inline-block bg-primary-dark px-3 text-primary-foreground">
              Equipo
            </span>
            <br />
            y a las personas que ya son
            <br />
            parte de nuestra{' '}
            <span className="inline-block bg-primary-dark px-3 text-primary-foreground">
              Comunidad
            </span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Únete a nosotros y accede a beneficios como oportunidades de crecimiento profesional, participación en proyectos innovadores, talleres exclusivos, y un ambiente de networking con otros estudiantes apasionados por la tecnología.
          </p>
        </div>

        <img
          src="/assets/team.png"
          alt="Equipo DSC UNI"
          className="w-64 sm:w-80 h-auto"
        />
      </section>

      {/* 2. NUESTROS LÍDERES (Junta Directiva, Dirección, Liderazgo y Squads) */}
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-12 space-y-8">
        <SectionTitle>
          <Highlight>Nuestros</Highlight> Líderes
        </SectionTitle>

        {/* Fila 1: Junta Directiva */}
        <div className="flex flex-wrap justify-center gap-4">
          {renderLeaderChips('junta-directiva')}
        </div>

        {/* Fila 2: Dirección */}
        <div className="flex flex-wrap justify-center gap-4">
          {renderLeaderChips('direccion')}
        </div>

        {/* Columnas inferiores: Liderazgo Técnico a la izquierda, Squads a la derecha */}
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto pt-4">
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
              Liderazgo Técnico
            </h3>
            {renderLeaderChips('tech')}
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-center">
              Squad Leads
            </h3>
            {renderLeaderChips('squad')}
          </div>
        </div>
      </section>

      {/* 3. VOLUNTARIOS (VolunteerHex) */}
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-12 space-y-10">
        <h2 className="text-center text-2xl font-normal text-foreground">
          Estos son algunos de nuestros
          <br />
          <strong className="text-3xl font-bold">Voluntarios</strong>
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VOLUNTEERS.map((vol) => {
            const fullName = `${vol.firstName} ${vol.lastName}`;
            return (
              <div
                key={vol.id}
                className="group relative overflow-hidden rounded-md border border-subtle bg-surface shadow-sm transition-all hover:shadow-md"
              >
                <div className="h-52 w-full overflow-hidden">
                  <img
                    src={vol.photo}
                    alt={fullName}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {fullName}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {vol.career} · Área: <strong>{vol.area}</strong>
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    shape="pill"
                    onClick={() =>
                      setSelectedMember({
                        name: fullName,
                        subtitle: `${vol.career} — ${vol.area}`,
                        photo: vol.photo,
                        about: vol.about,
                        skills: vol.skills,
                        linkedin: vol.linkedin,
                        github: vol.github,
                      })
                    }
                  >
                    Ficha
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CallToActionBanner href="/contacto" buttonLabel="Ver más" />

      {/* MODAL DE FICHA DE MIEMBRO (MemberModal.tsx) */}
      <ModalDialog
        isOpen={selectedMember !== null}
        onClose={() => setSelectedMember(null)}
        title={selectedMember?.name}
      >
        {selectedMember && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <img
                src={selectedMember.photo}
                alt={selectedMember.name}
                className="h-20 w-20 rounded-full object-cover border border-subtle bg-background"
              />
              <div>
                <h4 className="text-xl font-bold text-foreground">
                  {selectedMember.name}
                </h4>
                <p className="text-sm font-medium text-primary">
                  {selectedMember.subtitle}
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {selectedMember.about}
            </p>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Skills & Especialidades
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedMember.skills.map((skill) => (
                  <Badge key={skill} variant="primary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {selectedMember.linkedin && (
                <a
                  href={selectedMember.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="primary" shape="pill">
                    <span>LinkedIn</span>
                    <Icon name="ExternalLink" className="h-3.5 w-3.5" />
                  </Button>
                </a>
              )}
              {selectedMember.github && (
                <a
                  href={selectedMember.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline" shape="pill">
                    <span>GitHub</span>
                    <Icon name="ExternalLink" className="h-3.5 w-3.5" />
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </ModalDialog>
    </div>
  );
}

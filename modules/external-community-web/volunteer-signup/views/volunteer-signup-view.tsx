'use client';

import * as React from 'react';
import { useAuth } from '@repo/auth';
import { sanitizeText, validateSafeInput } from '@repo/security';
import {
  Alert,
  Button,
  CallToActionBanner,
  Highlight,
  Icon,
  Input,
  ModalDialog,
  SectionTitle,
  Textarea,
} from '@repo/ui';

interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqEntry[] = [
  {
    id: 'faq-1',
    question:
      '¿Los eventos están disponibles a estudiantes de otras carreras o incluso de otras universidades?',
    answer:
      'Sí. Aunque somos un club de la UNI, nuestros talleres y charlas están abiertos a estudiantes de cualquier carrera y universidad. Solo necesitas interés en aprender sobre desarrollo web, cloud o Machine Learning.',
  },
  {
    id: 'faq-2',
    question: '¿Necesito experiencia previa en programación para unirme?',
    answer:
      'No es necesario tener experiencia previa. Contamos con actividades para todos los niveles, desde talleres introductorios hasta sesiones avanzadas, así que puedes empezar desde cero y crecer con la comunidad.',
  },
  {
    id: 'faq-3',
    question: '¿Tiene algún costo participar en las actividades del club?',
    answer:
      'La mayoría de nuestros eventos y talleres son totalmente gratuitos. Cuando alguna actividad requiera un costo por materiales o certificación, lo indicaremos con claridad en la convocatoria.',
  },
  {
    id: 'faq-4',
    question: '¿Cómo puedo formar parte del equipo de voluntarios?',
    answer:
      'Abrimos convocatorias de voluntariado cada ciclo. Puedes escribirnos a través del formulario de contacto o seguir nuestras redes sociales para enterarte de las fechas de postulación y los roles disponibles.',
  },
  {
    id: 'faq-5',
    question: '¿Dónde se realizan los eventos presenciales?',
    answer:
      'Nuestros eventos presenciales se realizan principalmente en la Facultad de Ingeniería Industrial y de Sistemas (FIIS) de la UNI. La ubicación exacta de cada evento se comparte en la convocatoria correspondiente.',
  },
];

export function VolunteerSignupView() {
  const { csrfToken, verifyMutationCsrf } = useAuth();
  const [openFaqId, setOpenFaqId] = React.useState<string | null>('faq-1');
  const [messageModalOpen, setMessageModalOpen] = React.useState(false);

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [organization, setOrganization] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [securityError, setSecurityError] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError(null);

    if (!verifyMutationCsrf(csrfToken)) {
      setSecurityError(
        'Token anti-CSRF inválido o expirado (OWASP A07). Recarga la página.'
      );
      return;
    }

    const fields = [
      { label: 'Nombres', value: firstName },
      { label: 'Apellidos', value: lastName },
      { label: 'Correo electrónico', value: email },
      { label: 'Teléfono', value: phone },
      { label: 'Organización', value: organization },
      { label: 'Mensaje', value: message },
    ];

    for (const field of fields) {
      const check = validateSafeInput(field.value);
      if (!check.safe) {
        setSecurityError(
          `[${check.threatType}] Campo "${field.label}": ${check.reason}`
        );
        return;
      }
    }

    setFirstName(sanitizeText(firstName, 100));
    setLastName(sanitizeText(lastName, 100));
    setEmail(sanitizeText(email, 160));
    setPhone(sanitizeText(phone, 30));
    setOrganization(sanitizeText(organization, 120));
    setMessage(sanitizeText(message, 1000));
    setSubmitted(true);
  };

  return (
    <div>
      {/* 1. HERO CONTÁCTANOS (Contacto.tsx + Contacto.module.scss) */}
      <section className="relative">
        <img
          src="/PortadaContacto.png"
          alt="Miembros del Developer Student Club UNI"
          className="block h-72 sm:h-96 w-full object-cover"
        />
        <div className="absolute right-0 bottom-6 sm:bottom-12 bg-primary-darkest/90 px-8 py-4 sm:px-16 sm:py-6">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-wide text-primary-foreground">
            CONTÁCTANOS
          </h1>
        </div>
      </section>

      {/* 2. PANEL DE INFORMACIÓN (GRADIENTE TEAL) + UBICACIÓN FIIS-UNI */}
      <section className="grid md:grid-cols-3">
        <div className="flex flex-col justify-between gap-7 bg-gradient-to-br from-primary-dark to-primary-medium p-8 sm:p-12 text-primary-foreground">
          <div className="space-y-7">
            <div className="space-y-2.5">
              <h2 className="text-lg font-bold tracking-wide">INFORMACIÓN</h2>
              <p className="flex items-center gap-2.5 text-sm">
                <Icon name="Mail" className="h-4 w-4 shrink-0" />
                <span>dsc@gmail.com</span>
              </p>
              <p className="flex items-center gap-2.5 text-sm">
                <Icon name="Activity" className="h-4 w-4 shrink-0" />
                <span>989098789</span>
              </p>
            </div>

            <div className="space-y-2.5">
              <h2 className="text-lg font-bold tracking-wide">UBICACIÓN</h2>
              <p className="flex items-center gap-2.5 text-sm">
                <Icon name="MapPin" className="h-4 w-4 shrink-0" />
                <span>Ubicación FIIE / FIIS - UNI</span>
              </p>
            </div>

            <div className="space-y-2.5">
              <h2 className="text-lg font-bold tracking-wide">
                HORARIO DE ATENCIÓN
              </h2>
              <p className="flex items-center gap-2.5 text-sm">
                <Icon name="Clock" className="h-4 w-4 shrink-0" />
                <span>Lunes - Sábado (9:00-22:00)</span>
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="secondary"
              shape="pill"
              onClick={() => {
                setSubmitted(false);
                setSecurityError(null);
                setMessageModalOpen(true);
              }}
              className="bg-surface text-primary font-semibold px-7 hover:bg-background"
            >
              Envíanos un mensaje
            </Button>
          </div>
        </div>

        <div className="md:col-span-2 relative min-h-80 bg-surface-elevated flex flex-col items-center justify-center p-8 text-center">
          <img
            src="/images/jpgs/team-dsc.jpg"
            alt="Campus Universidad Nacional de Ingeniería"
            className="absolute inset-0 h-full w-full object-cover opacity-20"
          />
          <div className="relative z-10 max-w-lg space-y-4 rounded-md border border-subtle bg-surface/95 p-8 shadow-md">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
              <Icon name="MapPin" className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-foreground">
              Universidad Nacional de Ingeniería (FIIS / FIIE - UNI)
            </h3>
            <p className="text-sm text-muted-foreground">
              Av. Túpac Amaru 210, Rímac — Lima, Perú. Nuestras sesiones presenciales y talleres se desarrollan en los laboratorios y auditorios de la facultad.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="https://maps.google.com/?q=GDSC+UNI+Lima"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="sm" variant="primary" shape="pill">
                  <span>Ver en Google Maps</span>
                  <Icon name="ExternalLink" className="h-3.5 w-3.5" />
                </Button>
              </a>
              <Button
                size="sm"
                variant="outline"
                shape="pill"
                onClick={() => setMessageModalOpen(true)}
              >
                Escribir al Club
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PREGUNTAS FRECUENTES (FaqAccordion.tsx + faq.json) */}
      <section className="bg-background py-16 px-5 lg:px-12">
        <div className="mx-auto max-w-4xl space-y-10">
          <SectionTitle>
            <Highlight>Preguntas</Highlight> Frecuentes
          </SectionTitle>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => {
              const isOpen = openFaqId === item.id;
              return (
                <div
                  key={item.id}
                  className="rounded-md border border-subtle bg-surface overflow-hidden shadow-sm"
                >
                  <div className="flex items-center justify-between p-5">
                    <h3 className="text-base font-semibold text-foreground pr-4">
                      {item.question}
                    </h3>
                    <Button
                      size="sm"
                      variant="ghost"
                      aria-expanded={isOpen}
                      onClick={() =>
                        setOpenFaqId((prev) =>
                          prev === item.id ? null : item.id
                        )
                      }
                    >
                      <Icon
                        name="ChevronRight"
                        className={`h-4 w-4 transition-transform ${
                          isOpen ? 'rotate-90 text-primary' : ''
                        }`}
                      />
                    </Button>
                  </div>
                  {isOpen && (
                    <div className="border-t border-subtle bg-background/50 px-5 py-4 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CallToActionBanner
        href="/contacto"
        buttonLabel="Ver más"
      />

      {/* MODAL DE MENSAJE DE CONTACTO (MessageModal.tsx + POST /api/v1/contact) */}
      <ModalDialog
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        title="Envíanos un mensaje — DSC UNI"
      >
        <div className="space-y-4">
          {securityError && (
            <Alert
              variant="danger"
              title="Mensaje bloqueado por Firewall OWASP (@repo/security)"
              description={securityError}
            />
          )}

          {submitted ? (
            <Alert
              variant="success"
              title="Mensaje enviado correctamente"
              description={`Gracias ${firstName} ${lastName}. Hemos registrado tu mensaje (${email}) en el buzón del club.`}
              action={
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setFirstName('');
                    setLastName('');
                    setEmail('');
                    setPhone('');
                    setOrganization('');
                    setMessage('');
                  }}
                >
                  Enviar otro
                </Button>
              }
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Nombres"
                  placeholder="Ej. Camila"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input
                  label="Apellidos"
                  placeholder="Ej. Paredes"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Correo electrónico"
                  type="email"
                  placeholder="camila@uni.edu.pe"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Teléfono / Celular"
                  placeholder="989098789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Universidad / Organización (Opcional)"
                placeholder="Ej. Universidad Nacional de Ingeniería"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
              />

              <Textarea
                label="Mensaje"
                placeholder="Escribe tu consulta, propuesta de alianza o interés en postular..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                helperText="Protegido contra XSS, SQLi/NoSQLi, Path Traversal y OWASP AI Prompt Injection."
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-muted-foreground">
                  CSRF: {csrfToken}
                </span>
                <Button type="submit" variant="primary" shape="pill">
                  Enviar mensaje
                </Button>
              </div>
            </form>
          )}
        </div>
      </ModalDialog>
    </div>
  );
}

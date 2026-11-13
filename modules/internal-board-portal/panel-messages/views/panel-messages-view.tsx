'use client';

import * as React from 'react';
import {
  Alert,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  PageHeader,
} from '@repo/ui';

interface ContactMessageItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string | null;
  message: string;
  createdAt: string;
}

const MESSAGES: ContactMessageItem[] = [
  {
    id: 'msg-01',
    firstName: 'Andrea',
    lastName: 'Villanueva',
    email: 'andrea.villanueva@uni.edu.pe',
    phone: '987654321',
    organization: 'Facultad de Ingeniería de Sistemas (FIIS - UNI)',
    message:
      'Hola equipo de DSC UNI, me gustaría saber cuándo inicia la próxima convocatoria para el Squad de Inteligencia Artificial y qué requisitos piden para estudiantes de tercer ciclo.',
    createdAt: '12 nov 2026, 14:30',
  },
  {
    id: 'msg-02',
    firstName: 'Carlos',
    lastName: 'Mendoza',
    email: 'carlos.mendoza@techpartner.pe',
    phone: '998112233',
    organization: 'Cloud Partners Perú',
    message:
      'Buenas tardes, escribimos desde el equipo de relaciones con universidades para proponer el auspicio de talleres prácticos de Google Cloud y créditos de laboratorio para su próximo Hackathon.',
    createdAt: '10 nov 2026, 11:15',
  },
  {
    id: 'msg-03',
    firstName: 'Fernanda',
    lastName: 'Quispe',
    email: 'fernanda.quispe@unmsm.edu.pe',
    phone: '945678123',
    organization: 'Universidad Nacional Mayor de San Marcos',
    message:
      '¡Hola! Vi el afiche del taller de Desarrollo Móvil con Kotlin y quería confirmar si los estudiantes de otras universidades también podemos recibir constancia de participación.',
    createdAt: '08 nov 2026, 19:05',
  },
];

export function PanelMessagesView() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Mensajes"
        description="Lo que la gente escribe desde el formulario de contacto, del más reciente al más antiguo. Es de solo lectura e inmutable (Capacidad: message:read)."
        badge={`${MESSAGES.length} mensajes`}
        icon="Mail"
      />

      <Alert
        variant="info"
        title="Registro Inmutable de Contacto"
        description="Esta vista es de solo lectura: ni edita ni borra lo que escribieron los visitantes. Puedes responder directamente pulsando sobre su correo o teléfono."
      />

      <ul className="space-y-4">
        {MESSAGES.map((msg) => (
          <li key={msg.id}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">
                      {msg.firstName} {msg.lastName}
                    </CardTitle>
                    {msg.organization && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {msg.organization}
                      </p>
                    )}
                  </div>
                  <time className="text-xs font-mono text-muted-foreground">
                    {msg.createdAt}
                  </time>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs font-medium text-primary flex flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${msg.email}`}
                    className="underline hover:text-primary-dark"
                  >
                    {msg.email}
                  </a>
                  <span aria-hidden="true">·</span>
                  <a
                    href={`tel:${msg.phone}`}
                    className="underline hover:text-primary-dark"
                  >
                    {msg.phone}
                  </a>
                </p>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {msg.message}
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

'use client';

import * as React from 'react';
import {
  AlliancesShowcase,
  CallToActionBanner,
  Highlight,
  SectionTitle,
} from '@repo/ui';

const WHO_WE_ARE = {
  image: '/images/jpgs/team-dsc.jpg',
  paragraphs: [
    'Developer Student Club es un grupo comunitario para estudiantes universitarios interesados en desarrollo web, cloud y Machine Learning. Son bienvenidos los estudiantes de todos los programas de pregrado o posgrado que tengan interés en crecer como desarrolladores.',
    'En DSC UNI nuestro objetivo es aprender y enseñar. Desarrolladores y diseñadores se reúnen bajo un mismo techo para crear una comunidad que inspira a miles. ¡Únete a nosotros!',
  ],
};

const OUR_FOCUS = {
  image: '/images/png/nosotros-enfoque.png',
  paragraphs: [
    'Pensamos un poco fuera de lo común, creemos que los recursos de un club no solo deben canalizarse para realizar eventos sino también para propagar el aprendizaje y la enseñanza, de manera simbiótica.',
    'Dicho esto, llevamos a cabo nuestro primer evento emblemático, DSC REBORN: Desarrollando tu primera Página Web con Angular y Firebase, ¡y crearemos toneladas de talleres interesantes!',
  ],
};

export function NosotrosView() {
  return (
    <div>
      {/* Bloque 1: ¿Quiénes Somos? (Nosotros.tsx + Nosotros.module.scss) */}
      <section className="mx-auto flex max-w-7xl flex-col md:flex-row items-center px-5 py-12 lg:px-12">
        <img
          src={WHO_WE_ARE.image}
          alt="Miembros del Developer Student Club UNI"
          className="relative z-10 w-full md:w-2/5 shrink-0 object-cover rounded-feature rounded-br-none shadow-md"
        />
        <div className="flex-1 rounded-md bg-background p-8 md:py-10 md:pr-12 md:pl-28 md:-ml-20 space-y-4">
          <SectionTitle align="left">
            <Highlight>¿Quiénes</Highlight> Somos?
          </SectionTitle>
          {WHO_WE_ARE.paragraphs.map((p) => (
            <p
              key={p}
              className="text-base text-muted-foreground leading-relaxed"
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      {/* Bloque 2: Nuestro Enfoque (Reverse) */}
      <section className="mx-auto flex max-w-7xl flex-col md:flex-row-reverse items-center px-5 py-12 lg:px-12">
        <img
          src={OUR_FOCUS.image}
          alt="Taller del Developer Student Club UNI"
          className="relative z-10 w-full md:w-2/5 shrink-0 object-cover rounded-feature rounded-bl-none shadow-md"
        />
        <div className="flex-1 rounded-md bg-background p-8 md:py-10 md:pl-12 md:pr-28 md:-mr-20 space-y-4">
          <SectionTitle align="left">
            Nuestro <Highlight>Enfoque</Highlight>
          </SectionTitle>
          {OUR_FOCUS.paragraphs.map((p) => (
            <p
              key={p}
              className="text-base text-muted-foreground leading-relaxed"
            >
              {p}
            </p>
          ))}
        </div>
      </section>

      <AlliancesShowcase />
      <CallToActionBanner href="/contacto" buttonLabel="Ver más" />
    </div>
  );
}

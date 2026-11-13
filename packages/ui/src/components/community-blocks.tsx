'use client';

import * as React from 'react';
import { cn } from '../lib/cn';
import { Button } from './button';
import { Icon } from './icon';

export interface SectionTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  inverted?: boolean;
  align?: 'center' | 'left';
}

export function SectionTitle({
  inverted = false,
  align = 'center',
  className,
  children,
  ...props
}: SectionTitleProps) {
  return (
    <h2
      className={cn(
        'flex flex-wrap items-center gap-2 text-2xl sm:text-3xl font-bold tracking-tight',
        align === 'center' ? 'justify-center text-center' : 'justify-start text-left',
        inverted ? 'text-primary-foreground' : 'text-foreground',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export interface HighlightProps extends React.HTMLAttributes<HTMLSpanElement> {
  inverted?: boolean;
}

export function Highlight({
  inverted = false,
  className,
  children,
  ...props
}: HighlightProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-sm px-3 py-0.5 font-bold',
        inverted
          ? 'bg-surface text-primary-dark'
          : 'bg-primary-dark text-primary-foreground',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export interface AllianceItem {
  id: number | string;
  name: string;
  logo: string;
}

const DEFAULT_ALLIANCES: AllianceItem[] = [
  { id: 1, name: 'Alianza 1', logo: '/images/jpgs/01-alianza.jpg' },
  { id: 2, name: 'Alianza 2', logo: '/images/jpgs/02-alianza.jpg' },
  { id: 3, name: 'Núcleo Centro Cultural', logo: '/images/jpgs/03-alianza.jpg' },
  { id: 4, name: 'Alianza 4', logo: '/images/jpgs/04-alianza.jpg' },
  { id: 5, name: 'Alianza 5', logo: '/images/jpgs/05-alianza.jpg' },
  { id: 6, name: 'Alianza 6', logo: '/images/jpgs/06-alianza.jpg' },
  { id: 7, name: 'Alianza 7', logo: '/images/jpgs/07-alianza.jpg' },
  { id: 8, name: 'Alianza 8', logo: '/images/jpgs/08-alianza.jpg' },
  { id: 9, name: 'Alianza 9', logo: '/images/jpgs/09-alianza.jpg' },
  { id: 10, name: 'Alianza 10', logo: '/images/jpgs/10-alianza.jpg' },
];

export interface AlliancesShowcaseProps {
  alliances?: AllianceItem[];
}

export function AlliancesShowcase({
  alliances = DEFAULT_ALLIANCES,
}: AlliancesShowcaseProps) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const visibleCount = 4;

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? Math.max(0, alliances.length - visibleCount) : prev - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev + visibleCount >= alliances.length ? 0 : prev + 1
    );
  };

  const visibleItems = React.useMemo(() => {
    const slice = alliances.slice(activeIndex, activeIndex + visibleCount);
    if (slice.length < visibleCount) {
      return [...slice, ...alliances.slice(0, visibleCount - slice.length)];
    }
    return slice;
  }, [alliances, activeIndex]);

  return (
    <section className="bg-surface py-16 px-5 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="text-center space-y-3">
          <SectionTitle>
            Nuestras <Highlight>Alianzas</Highlight>
          </SectionTitle>
          <p className="text-sm sm:text-base text-muted-foreground">
            Estas son algunas de las empresas que confían en nosotros
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Alianzas anteriores"
            onClick={handlePrev}
            className="shrink-0"
          >
            ‹
          </Button>

          <div className="grid flex-1 grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {visibleItems.map((alliance, idx) => (
              <div
                key={`${alliance.id}-${idx}`}
                className="flex h-36 items-center justify-center rounded-md border border-subtle bg-surface p-6 shadow-sm transition-transform hover:scale-105"
              >
                <img
                  src={alliance.logo}
                  alt={alliance.name}
                  className="max-h-24 w-auto object-contain"
                />
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            aria-label="Siguientes alianzas"
            onClick={handleNext}
            className="shrink-0"
          >
            ›
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2">
          {alliances.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              aria-label={`Ir a alianza ${idx + 1}`}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'h-2.5 rounded-pill transition-all',
                idx === activeIndex
                  ? 'w-6 bg-primary'
                  : 'w-2.5 bg-strong/50 hover:bg-primary/60'
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export interface CallToActionBannerProps {
  href?: string;
  buttonLabel?: string;
  backgroundImage?: string;
}

export function CallToActionBanner({
  href = '/contacto',
  buttonLabel = 'Ver más',
  backgroundImage = '/assets/call-to-action.jpg',
}: CallToActionBannerProps) {
  return (
    <section className="relative overflow-hidden bg-primary-darkest text-primary-foreground">
      <img
        src={backgroundImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-darkest/80 to-primary-dark/80" />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-6 py-20 md:flex-row md:items-center lg:px-12">
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold leading-snug text-primary-foreground">
            ¿Te animas a formar parte de
            <br />
            esta nueva{' '}
            <span className="inline-block bg-surface px-3 text-primary-dark">
              Experiencia
            </span>{' '}
            ?
          </h2>
          <p className="text-base text-primary-foreground/90">
            Crea una cuenta y ponte en contacto con nosotros
          </p>
        </div>

        <a href={href} className="shrink-0">
          <Button
            size="lg"
            shape="rounded"
            className="bg-primary-medium hover:bg-primary-dark text-primary-foreground px-14 py-3 text-base font-semibold rounded-md shadow-md"
          >
            {buttonLabel}
          </Button>
        </a>
      </div>
    </section>
  );
}

export interface ModalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function ModalDialog({
  isOpen,
  onClose,
  title,
  children,
}: ModalDialogProps) {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title ?? 'Detalle'}
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary-darkest/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-screen w-full max-w-2xl overflow-y-auto rounded-md border border-subtle bg-surface p-6 sm:p-8 text-foreground shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-subtle pb-4 mb-5">
          {title ? (
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
          ) : (
            <span />
          )}
          <Button
            size="sm"
            variant="ghost"
            aria-label="Cerrar ventana"
            onClick={onClose}
          >
            <Icon name="X" className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

import * as React from 'react';
import { cn } from '../lib/cn';
import { Badge, type BadgeVariant } from './badge';
import { Icon, type IconName } from './icon';

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  badgeVariant?: BadgeVariant;
  icon?: IconName;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  badge,
  badgeVariant = 'primary',
  icon,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-6 mb-6 border-b border-subtle sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2.5">
          {icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Icon name={icon} className="h-5 w-5" />
            </div>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {badge && <Badge variant={badgeVariant}>{badge}</Badge>}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground max-w-3xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
}

export interface SectionContainerProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  eyebrow?: string;
}

export function SectionContainer({
  title,
  subtitle,
  eyebrow,
  className,
  children,
  ...props
}: SectionContainerProps) {
  return (
    <section className={cn('py-10 sm:py-12', className)} {...props}>
      {(eyebrow || title || subtitle) && (
        <div className="mb-8 space-y-2">
          {eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-sm text-muted-foreground max-w-2xl">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

export interface StatCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendStatus?: 'success' | 'warning' | 'danger' | 'info';
  icon?: IconName;
}

export function StatCard({
  label,
  value,
  trend,
  trendStatus = 'info',
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-lg border border-subtle bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-elevated text-primary">
            <Icon name={icon} className="h-4 w-4" />
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </span>
        {trend && <Badge variant={trendStatus}>{trend}</Badge>}
      </div>
    </div>
  );
}

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: IconName;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  icon = 'Layers',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-strong bg-surface/60 p-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground mb-4">
        <Icon name={icon} className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export interface AlertProps {
  title: string;
  description?: string;
  variant?: 'info' | 'success' | 'warning' | 'danger';
  action?: React.ReactNode;
}

const alertStyles = {
  info: 'bg-status-info-bg border-status-info/30 text-status-info',
  success: 'bg-status-success-bg border-status-success/30 text-status-success',
  warning: 'bg-status-warning-bg border-status-warning/30 text-status-warning',
  danger: 'bg-status-danger-bg border-status-danger/30 text-status-danger',
};

export function Alert({
  title,
  description,
  variant = 'info',
  action,
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-md border p-4',
        alertStyles[variant]
      )}
    >
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">{title}</h4>
        {description && <p className="text-xs opacity-90">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-surface-elevated', className)}
      {...props}
    />
  );
}

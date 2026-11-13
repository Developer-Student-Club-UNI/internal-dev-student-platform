import * as React from 'react';
import { cn } from '../lib/cn';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'cta';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonShape = 'rounded' | 'pill';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: ButtonShape;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm focus-visible:ring-ring',
  cta: 'bg-status-success text-primary-foreground hover:opacity-90 shadow-sm focus-visible:ring-ring',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-surface-elevated focus-visible:ring-ring',
  outline:
    'border border-primary bg-surface text-primary hover:bg-accent focus-visible:ring-ring',
  ghost:
    'bg-transparent text-foreground hover:bg-surface-elevated focus-visible:ring-ring',
  danger:
    'bg-status-danger text-primary-foreground hover:opacity-90 focus-visible:ring-status-danger',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-xs gap-1.5',
  md: 'h-10 px-5 text-sm gap-2',
  lg: 'h-12 px-8 text-base gap-2.5',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      shape = 'rounded',
      fullWidth = false,
      type = 'button',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          shape === 'pill' ? 'rounded-pill' : 'rounded-sm',
          fullWidth && 'w-full',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

import type { Config } from 'tailwindcss';

/**
 * Preset de Tailwind Cerrado (@repo/ui/tailwind.preset)
 * Expone únicamente los tokens semánticos autorizados en specs/DESIGN_SYSTEM.md
 */
export const idpTailwindPreset: Partial<Config> = {
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--idp-font-sans)'],
      },
      colors: {
        background: 'hsl(var(--idp-background) / <alpha-value>)',
        surface: {
          DEFAULT: 'hsl(var(--idp-surface) / <alpha-value>)',
          elevated: 'hsl(var(--idp-surface-elevated) / <alpha-value>)',
        },
        foreground: 'hsl(var(--idp-foreground) / <alpha-value>)',
        'muted-foreground': 'hsl(var(--idp-muted-foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--idp-primary) / <alpha-value>)',
          hover: 'hsl(var(--idp-primary-hover) / <alpha-value>)',
          dark: 'hsl(var(--idp-primary-dark) / <alpha-value>)',
          darkest: 'hsl(var(--idp-primary-darkest) / <alpha-value>)',
          medium: 'hsl(var(--idp-primary-medium) / <alpha-value>)',
          foreground: 'hsl(var(--idp-primary-foreground) / <alpha-value>)',
        },
        footer: 'hsl(var(--idp-footer-bg) / <alpha-value>)',
        secondary: {
          DEFAULT: 'hsl(var(--idp-secondary) / <alpha-value>)',
          foreground: 'hsl(var(--idp-secondary-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--idp-accent) / <alpha-value>)',
          foreground: 'hsl(var(--idp-accent-foreground) / <alpha-value>)',
        },
        subtle: 'hsl(var(--idp-border-subtle) / <alpha-value>)',
        strong: 'hsl(var(--idp-border-strong) / <alpha-value>)',
        ring: 'hsl(var(--idp-ring) / <alpha-value>)',
        status: {
          success: 'hsl(var(--idp-status-success) / <alpha-value>)',
          'success-bg': 'hsl(var(--idp-status-success-bg) / <alpha-value>)',
          warning: 'hsl(var(--idp-status-warning) / <alpha-value>)',
          'warning-bg': 'hsl(var(--idp-status-warning-bg) / <alpha-value>)',
          danger: 'hsl(var(--idp-status-danger) / <alpha-value>)',
          'danger-bg': 'hsl(var(--idp-status-danger-bg) / <alpha-value>)',
          info: 'hsl(var(--idp-status-info) / <alpha-value>)',
          'info-bg': 'hsl(var(--idp-status-info-bg) / <alpha-value>)',
        },
      },
      borderColor: {
        DEFAULT: 'hsl(var(--idp-border-subtle) / <alpha-value>)',
        subtle: 'hsl(var(--idp-border-subtle) / <alpha-value>)',
        strong: 'hsl(var(--idp-border-strong) / <alpha-value>)',
      },
      borderRadius: {
        sm: 'var(--idp-radius-sm)',
        md: 'var(--idp-radius-md)',
        lg: 'var(--idp-radius-lg)',
        pill: 'var(--idp-radius-pill)',
        feature: '3.75rem',
        hero: '7.5rem',
      },
    },
  },
};

export default idpTailwindPreset;

import type { Config } from 'tailwindcss';
import idpPreset from '@repo/ui/tailwind.preset';

const config: Config = {
  presets: [idpPreset as Config],
  content: [
    './src/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../packages/layouts/src/**/*.{ts,tsx}',
    '../../packages/auth/src/**/*.{ts,tsx}',
    '../../packages/module-sdk/src/**/*.{ts,tsx}',
    '../../modules/internal-board-portal/*/views/**/*.{ts,tsx}',
    '../../modules/internal-board-portal/*/*.{ts,tsx}',
  ],
};

export default config;

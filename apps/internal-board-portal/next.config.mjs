import { getSecurityHeaders } from '@repo/security/headers';

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  transpilePackages: [
    '@repo/ui',
    '@repo/layouts',
    '@repo/auth',
    '@repo/security',
    '@repo/api-client',
    '@repo/module-sdk',
    '@modules/internal-board-portal--panel-events',
    '@modules/internal-board-portal--panel-projects',
    '@modules/internal-board-portal--members-directory',
    '@modules/internal-board-portal--panel-units',
    '@modules/internal-board-portal--panel-terms',
    '@modules/internal-board-portal--panel-site',
    '@modules/internal-board-portal--panel-messages',
    '@modules/internal-board-portal--panel-users',
    '@modules/internal-board-portal--panel-audit',
    '@modules/internal-board-portal--certificates',
  ],
  webpack(config) {
    config.cache = false;
    return config;
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: getSecurityHeaders(),
      },
    ];
  },
};

export default nextConfig;

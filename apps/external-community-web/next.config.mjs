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
    '@modules/external-community-web--nosotros',
    '@modules/external-community-web--team',
    '@modules/external-community-web--events-showcase',
    '@modules/external-community-web--volunteer-signup',
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

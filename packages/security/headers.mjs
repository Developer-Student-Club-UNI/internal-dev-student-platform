/**
 * @repo/security/headers
 * Cabeceras HTTP OWASP Top 10 obligatorias para todas las aplicaciones Next.js del IDP.
 * Mitiga XSS, Clickjacking, MIME-Sniffing, Data Exfiltration y downgrade HTTPS.
 */
export function getSecurityHeaders(options = {}) {
  const allowedConnectOrigins = Array.isArray(options.allowedConnectOrigins)
    ? options.allowedConnectOrigins.join(' ')
    : '';

  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self' ${allowedConnectOrigins}`.trim(),
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; ');

  return [
    {
      key: 'Content-Security-Policy',
      value: cspDirectives,
    },
    {
      key: 'X-Frame-Options',
      value: 'DENY',
    },
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff',
    },
    {
      key: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin',
    },
    {
      key: 'Permissions-Policy',
      value:
        'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=()',
    },
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
      key: 'Cross-Origin-Opener-Policy',
      value: 'same-origin',
    },
    {
      key: 'Cross-Origin-Resource-Policy',
      value: 'same-origin',
    },
    {
      key: 'X-DNS-Prefetch-Control',
      value: 'off',
    },
  ];
}

export default getSecurityHeaders;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.com https://*.clerk.accounts.dev https://*.clerk.com https://*.amaryllissuccess.co.zw https://challenges.cloudflare.com https://www.google.com https://www.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://*.clerk.com https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com https://*.clerk.com",
              "img-src 'self' data: https:",
              "connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://*.amaryllissuccess.co.zw https://lexizw-backend-production.up.railway.app",
              "worker-src 'self' blob:",
              "frame-src 'self' https://challenges.cloudflare.com https://www.google.com https://*.clerk.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
  env: {},
  experimental: {
    serverActions: { allowedOrigins: ['lexizw.amaryllissuccess.co.zw'] },
  },
};
module.exports = nextConfig;

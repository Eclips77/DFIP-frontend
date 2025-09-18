import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/api/v1/images/**',
      },
      // Production API on Render
      {
        protocol: 'https',
        hostname: '*.onrender.com',
        pathname: '/api/v1/images/**',
      },
    ],
  },
  // Production optimization
  output: 'standalone',
  // Enable compression
  compress: true,
  // Disable source maps in production for security
  productionBrowserSourceMaps: false,
  // Environment configuration
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
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
        ],
      },
    ];
  },
};

export default nextConfig;

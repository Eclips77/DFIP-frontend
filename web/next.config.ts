import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/api/v1/images/**',
      },
      {
        protocol: 'https',
        hostname: 'dfip-api-966e801161c5.herokuapp.com',
        pathname: '/api/v1/images/**',
      },
    ],
  },
};

export default nextConfig;

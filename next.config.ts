import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Allow images from local uploads
  images: {
    remotePatterns: [],
    localPatterns: [
      {
        pathname: '/uploads/**',
      },
    ],
  },
  // Turbopack config (Next.js 16 default bundler)
  // better-sqlite3 is a native addon — no special config needed for Turbopack
  // as it handles native modules automatically on the server
  serverExternalPackages: ['better-sqlite3'],
  turbopack: {},
};

export default nextConfig;

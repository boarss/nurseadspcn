import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PWA will be configured via next-pwa in production
  reactStrictMode: true,
  experimental: {
    serverActions: {},
  },
};

export default nextConfig;

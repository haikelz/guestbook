import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["@heroui/react"],
    webpackBuildWorker: true,
    webpackMemoryOptimizations: true,
    preloadEntriesOnStart: true,
  },
  images: {
    // Header logo only; a wildcard host would turn /_next/image into an open proxy.
    remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com" }],
  },
};

export default nextConfig;

import withPWAInit, { runtimeCaching } from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  workboxOptions: {
    // Plugin defaults, plus Next 15's dynamic-css-manifest.json: the build emits
    // it but never serves it, so precaching its 404 aborts the worker install.
    exclude: [
      /\/_next\/static\/.*(?<!\.p)\.woff2/,
      /\.map$/,
      /^manifest.*\.js$/,
      /dynamic-css-manifest\.json$/,
    ],
    runtimeCaching: [
      // First match wins: never cache API responses. They carry the session,
      // admin data with contributor emails, and mutation results.
      {
        urlPattern: ({ sameOrigin, url }) =>
          sameOrigin && url.pathname.startsWith("/api/"),
        handler: "NetworkOnly",
      },
      ...runtimeCaching,
    ],
  },
});

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Browsers must revalidate the worker so updates roll out promptly.
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
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

export default withPWA(nextConfig);

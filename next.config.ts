import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  // Optimise les imports des librairies core
  experimental: {
    optimizePackageImports: ["react", "react-dom"],
  },
};

export default nextConfig;

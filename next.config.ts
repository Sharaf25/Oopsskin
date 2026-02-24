import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // output: "export", // Temporarily disabled for dynamic API fetching
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

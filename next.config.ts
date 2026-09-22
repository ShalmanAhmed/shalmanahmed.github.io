import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standard",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;

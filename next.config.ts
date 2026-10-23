import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: process.env.CLOUDFLARE_BUILD === "1" ? "export" : "standalone",
  devIndicators: false,
};

export default nextConfig;

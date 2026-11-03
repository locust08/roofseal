import path from "node:path";
import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const cloudflare = process.env.CLOUDFLARE_DEPLOY === "true";
const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      ...["/materials", "/bluescope-materials"].map(source => ({ source, destination: "/materials-from-bluescope-malaysia", permanent: true })),
      ...["articles", "news", "events"].map(slug => ({ source: `/${slug}`, destination: `/blogs/${slug}`, permanent: true })),
    ];
  },
  devIndicators: false,
  typescript: { tsconfigPath: cloudflare ? "tsconfig.cloudflare.json" : "tsconfig.json" },
  serverExternalPackages: ["jose", "pg-cloudflare"],
  webpack: (config) => {
    // Payload's SQLite and D1 configs share an import alias. Keep cached modules
    // separate when switching between local and Cloudflare production builds.
    if (config.cache && typeof config.cache === "object") {
      config.cache.version = `${config.cache.version || ""}|roofseal-runtime:${cloudflare ? "cloudflare" : "local"}`;
    }
    if (cloudflare) {
      config.resolve.alias["@payload-config"] = path.resolve("payload.cloudflare.config.ts");
      config.module.rules.push({
        test: /payload[/\\]dist[/\\]auth[/\\].*\.js$/,
        enforce: "pre",
        use: [path.resolve("scripts/cloudflare/payload-auth-loader.cjs")],
      });
    }
    return config;
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });

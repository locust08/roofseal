import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  devIndicators: false,
};

export default withPayload(nextConfig);

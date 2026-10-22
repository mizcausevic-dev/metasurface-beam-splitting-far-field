import type { NextConfig } from "next";

const repo = "metasurface-beam-splitting-far-field";
const pages = process.env.GITHUB_PAGES === "1";
const basePath = pages ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  assetPrefix: pages ? `${basePath}/` : undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;

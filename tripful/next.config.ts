import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "standalone",
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }, { protocol: "https", hostname: "i.pravatar.cc" }] },
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
  turbopack: { root: __dirname },
};
export default nextConfig;

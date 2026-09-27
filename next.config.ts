import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // No output: "standalone" — that's for Docker; Vercel handles output itself.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Serve static assets (_next/*) from Phase 2's direct Vercel URL
  // This ensures CSS/JS loads correctly when accessed through Phase 1 rewrites
  assetPrefix: process.env.NODE_ENV === "production" 
    ? "https://profyt-phase2.vercel.app"
    : undefined,
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Single self-contained folder for the production Docker/Kubernetes runtime.
  output: "standalone",
  // Set at build time (git SHA) so rolling updates detect version skew.
  deploymentId: process.env.NEXT_DEPLOYMENT_ID,
  allowedDevOrigins: ["192.168.0.106"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;

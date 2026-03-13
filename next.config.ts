import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./lib/cloudinary.ts",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

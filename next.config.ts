import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "f49cld0f7s.ufs.sh",
        port: "",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;

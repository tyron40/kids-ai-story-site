/** @type {import('next').NextConfig} */
const config = {
  images: {
    domains: ["firebasestorage.googleapis.com"],
    unoptimized: false,
    deviceSizes: [256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["@nextui-org/react"],
  },
}

export default config

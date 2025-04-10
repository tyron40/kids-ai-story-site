/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "lh3.googleusercontent.com", // optional: for Google profile pics
      "cdn.jsdelivr.net", // optional: for models or images from CDNs
    ],
    unoptimized: true, // since you're using custom image logic or external links
  },

  webpack: (config) => {
    // Fix warnings from face-api.js or TensorFlow trying to import 'fs' or 'encoding'
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      encoding: false,
    }

    return config
  },
}

export default nextConfig

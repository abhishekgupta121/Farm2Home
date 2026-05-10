/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "goqii.com",
      },
      {
        protocol: "https",
        hostname: "5.imimg.com",
      },
    ],
  },
  experimental: {
  },
};

module.exports = nextConfig;
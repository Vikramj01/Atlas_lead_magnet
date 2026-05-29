/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "v0-atlas-product-website.vercel.app",
      },
    ],
  },
};

export default nextConfig;

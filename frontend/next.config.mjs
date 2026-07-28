/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
      // Directus-hosted assets (local dev + Docker network)
      { protocol: "http", hostname: "localhost", port: "8055" },
      { protocol: "http", hostname: "directus", port: "8055" },
    ],
  },
};

export default nextConfig;

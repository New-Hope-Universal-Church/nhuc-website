import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Sermon thumbnails from YouTube; announcement images and event flyers from Cloudinary.
  // Pages folded into others: old links (shared on WhatsApp, say) still work.
  async redirects() {
    return [
      { source: '/contact', destination: '/visit#contact', permanent: true },
      { source: '/announcements', destination: '/events#news', permanent: true },
      { source: '/online', destination: '/watch#online', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

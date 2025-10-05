/** @type {import('next').NextConfig} */

const nextConfig = {
  // output: 'export', // Disabled for dev server - enable for static build
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'out',
  images: {
    unoptimized: true, // Required for static export
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'admin.gardenbros.sk',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
  // Experimental features for performance
  experimental: {
    // optimizeCss: true, // Disabled - causing bus error in dev
    optimizePackageImports: ['@headlessui/react', '@heroicons/react'],
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  // Generate static pages for better performance
  generateEtags: false,
}

module.exports = nextConfig
  
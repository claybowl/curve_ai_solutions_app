/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Restore standalone for Vercel deployment
  output: 'standalone',
  trailingSlash: true,
  // Disabled experimental features for build stability
  // experimental: {
  //   webpackBuildWorker: true,
  // },
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Optimize webpack for dev mode
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      }
    }
    return config
  },
  // Reduce file watching for better performance
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  }
}

export default nextConfig

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
      // Optimize webpack for dev mode - reduce memory usage
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      }

      // Optimize caching to reduce memory pressure
      config.cache = {
        type: 'filesystem',
        compression: 'gzip',
        maxAge: 5184000000, // 60 days
      }
    }

    // Optimize chunk splitting to reduce bundle size
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
            },
            // Supabase chunk (isolate heavy library)
            supabase: {
              name: 'supabase',
              test: /[\\/]node_modules[\\/](@supabase)[\\/]/,
              chunks: 'all',
              priority: 30,
            },
            // Commons chunk
            common: {
              minChunks: 2,
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
          },
        },
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

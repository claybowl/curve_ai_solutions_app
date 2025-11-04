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
  // Enable standalone for Vercel deployment only (causes permission issues on Windows)
  ...(process.env.VERCEL ? { output: 'standalone' } : {}),
  trailingSlash: true,
}

export default nextConfig

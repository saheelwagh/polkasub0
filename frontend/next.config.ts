import type { NextConfig } from "next"
import webpack from "webpack"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Biome
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Build Mode (`standalone` for self-hosted builds)
  output: process.env.NEXT_OUTPUT as "standalone" | undefined,
  // Fix Next.js Turbopack Builds in Bun Monorepos
  // Source: https://github.com/vercel/next.js/discussions/55987#discussioncomment-12316599
  // outputFileTracingRoot: path.join(__dirname, "../../"),
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
      };
    }
    return config;
  },
}

export default nextConfig

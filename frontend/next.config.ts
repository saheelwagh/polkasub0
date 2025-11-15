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
  
  // Turbopack configuration for browser polyfills
  turbo: {
    resolveAlias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
    },
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
      };

      // Add polyfill for Buffer
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }
    return config;
  },
}

export default nextConfig

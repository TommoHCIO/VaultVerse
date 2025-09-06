import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  
  // Server external packages
  serverExternalPackages: [
    'bcryptjs',
    'jsonwebtoken',
    'pino-pretty',
  ],

  // Experimental performance optimizations
  experimental: {
    // Enable optimized package imports for faster compilation
    optimizePackageImports: [
      'framer-motion',
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-slot',
      '@rainbow-me/rainbowkit',
      '@tanstack/react-query',
    ],
    
    // Enable faster bundling
    optimizeCss: true,
    
    // Reduce memory usage
    webVitalsAttribution: ['CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB'],
  },

  // Webpack performance optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Optimize chunks and modules
    if (dev) {
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
              test: /[\\/]node_modules[\\/]/,
              priority: 20,
              reuseExistingChunk: true,
            },
            // Common chunk
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Framework chunk (React, Next.js)
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
          },
        },
        // Reduce module evaluation overhead
        providedExports: true,
        usedExports: true,
        sideEffects: false,
      };

      // Speed up module resolution
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, './src'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/app': path.resolve(__dirname, './src/app'),
      };

      // Optimize loaders for faster compilation
      config.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader',
          options: {
            jsc: {
              parser: {
                syntax: 'typescript',
                tsx: true,
                decorators: false,
                dynamicImport: true,
              },
              target: 'es2022',
              loose: false,
              minify: {
                compress: false,
                mangle: false,
              },
            },
            module: {
              type: 'es6',
            },
            minify: false,
            sourceMaps: true,
          },
        },
      });

      // Reduce I/O operations
      config.snapshot = {
        ...config.snapshot,
        buildDependencies: {
          timestamp: true,
          hash: false,
        },
        module: {
          timestamp: true,
          hash: false,
        },
        resolve: {
          timestamp: true,
          hash: false,
        },
      };

      // Cache configuration for faster rebuilds
      config.cache = {
        type: 'filesystem',
        cacheDirectory: path.resolve(__dirname, '.next/cache'),
        buildDependencies: {
          config: [__filename],
        },
        memoryCacheUnaffected: true,
      };
    }

    return config;
  },

  // SWC minifier is now enabled by default in Next.js 15
  
  // Reduce compilation overhead
  output: 'standalone',
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 hours
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Reduce bundle size
  compress: true,
  
  // Performance headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
        ],
      },
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
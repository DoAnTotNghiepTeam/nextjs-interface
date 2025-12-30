const createNextIntlPlugin = require('next-intl/plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Proxy uploads từ frontend sang backend  ( chuyeenr sang để lấy dc ảnh avatart từ backend vì khác port)
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:8080/uploads/:path*',
      },
    ];
  },
  webpack: (config, { isServer, dev }) => {
    config.resolve.fallback = { fs: false, path: false };

    // Disable source maps in development
    if (dev) {
      config.devtool = false;
    }

    return config;
  },
  productionBrowserSourceMaps: false,
  sassOptions: {
    sourceMap: false,
  },
};


const withNextIntl = createNextIntlPlugin('./i8n/request.ts');

module.exports = withNextIntl(nextConfig);

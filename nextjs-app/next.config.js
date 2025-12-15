const createNextIntlPlugin = require('next-intl/plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['localhost'],
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

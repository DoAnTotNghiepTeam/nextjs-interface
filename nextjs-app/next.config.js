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
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Disable CSS source maps
  sassOptions: {
    sourceMap: false,
  },
}

module.exports = nextConfig
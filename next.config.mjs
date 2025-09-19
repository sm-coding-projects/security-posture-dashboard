/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
  transpilePackages: ['@radix-ui/react-separator', '@radix-ui/react-switch']
};

export default nextConfig;

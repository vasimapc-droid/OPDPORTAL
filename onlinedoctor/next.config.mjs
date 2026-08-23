/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = __dirname;
    return config;
  },
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.coincap.io',
        pathname: '/assets/icons/**',
      },
      {
        protocol: 'https',
        hostname: 's2.coinmarketcap.com',
        pathname: '/static/img/coins/**',
      },
    ],
  },
};

export default nextConfig;

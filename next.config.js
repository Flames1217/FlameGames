/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/wolfcha',
        destination: 'https://www.wolf-cha.com/',
        permanent: false,
      },
      {
        source: '/wolfcha/:path*',
        destination: 'https://www.wolf-cha.com/:path*',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/drysland',
        destination: 'https://drysland-nu.vercel.app/',
      },
      {
        source: '/drysland/:path*',
        destination: 'https://drysland-nu.vercel.app/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

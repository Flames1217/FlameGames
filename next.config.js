/** @type {import('next').NextConfig} */
const nextConfig = {
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
      {
        source: '/wolfcha',
        destination: 'https://wolfcha.vercel.app/',
      },
      {
        source: '/wolfcha/:path*',
        destination: 'https://wolfcha.vercel.app/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

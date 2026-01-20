// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'export',
//   trailingSlash: true,

//   images: {
//     unoptimized: true,
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'i.imgur.com',
//       },
//     ],
//   },

//   reactStrictMode: true,
// };

// module.exports = nextConfig;



/** @type {import('next').NextConfig} */
const repo = 'pitomnick-page';

const nextConfig = {
  output: 'export',
  trailingSlash: true,

  basePath: `/${repo}`,
  assetPrefix: `/${repo}/`,

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'i.imgur.com' }
    ],
  },

  reactStrictMode: true,
};

module.exports = nextConfig;

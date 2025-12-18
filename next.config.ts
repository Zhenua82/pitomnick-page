import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactCompiler: true,
//   reactStrictMode: true,
// };

// export default nextConfig;

const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
    ],
  },
};
export default nextConfig;

// const nextConfig: NextConfig = {
//   reactCompiler: true,
//   reactStrictMode: true,
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "i.imgur.com",
//       },
//     ],
//   },
//   output: 'export', // добавляем сюда
//   trailingSlash: true, // ОБЯЗАТЕЛЬНО
// };

// export default nextConfig;

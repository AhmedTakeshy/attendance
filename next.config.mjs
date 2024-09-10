/** @type {import('next').NextConfig} */
import pkg from "@next/bundle-analyzer";
const withBundleAnalyzer = pkg({
  enabled: process.env.ANALYZE === "true",
});
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app",
      },
      {
        protocol: "https",
        hostname: "vojislavd.com",
      },
      {
        protocol: "https",
        hostname: "pagedone.io",
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);

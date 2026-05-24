import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@creit.tech/stellar-wallets-kit"],
  turbopack: {
    resolveAlias: {
      buffer: "buffer",
    },
  },
};

export default nextConfig;

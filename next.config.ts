import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // disables SSR, forces static export
};

export default nextConfig;

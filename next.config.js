/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  env: {
    AWS_REGION: process.env.AWS_REGION,
  }
};

module.exports = nextConfig;
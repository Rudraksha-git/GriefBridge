/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdfkit', '@xenova/transformers', 'pdf-parse'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

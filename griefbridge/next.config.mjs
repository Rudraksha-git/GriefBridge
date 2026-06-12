/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pdfkit', '@xenova/transformers', 'pdf-parse'],
};

export default nextConfig;

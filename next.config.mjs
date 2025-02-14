/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'i.imgur.com'], // Combine both domains in a single array
  },
};

export default nextConfig;

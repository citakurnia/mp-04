/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: 'http://localhost:8000/api',
    BASE_URL: 'http://localhost:3000',
    IMAGE_URL: 'http://localhost:8000/images',
  },
};

export default nextConfig;

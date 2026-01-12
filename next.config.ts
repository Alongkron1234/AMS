/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ สั่งให้ข้ามการตรวจ ESLint ตอน Build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // ✅ สั่งให้ข้ามการตรวจ Type ตอน Build (ถ้าจำเป็น)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
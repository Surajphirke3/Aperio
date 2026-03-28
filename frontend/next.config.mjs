/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // Server-side only: where Next should proxy API requests to.
    // Keep this separate from NEXT_PUBLIC_API_URL (which is used in the browser).
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8000/v1";
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
}

export default nextConfig

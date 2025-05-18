/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'cdn.shopify.com',
      'images.unsplash.com',
      'placehold.co',
      'via.placeholder.com',
      'kgzgkdaoextyfbhuigwi.supabase.co',
      'i.ytimg.com'
    ],
  },
  experimental: {
    workerThreads: false,
  },
  // Force all API routes to be treated as Edge-compatible for static builds
  // This prevents the 'Dynamic Server Usage' errors during build
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'x-api-route',
            value: 'edge',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig

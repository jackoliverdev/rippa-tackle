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
}

module.exports = nextConfig

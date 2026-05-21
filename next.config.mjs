/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Optimize for Vercel deployment
  // Vercel handles most of this automatically, but explicit configuration helps with local parity
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  // Ensure production builds are clean
  eslint: {
    // Only run ESLint on specific directories during production builds (next build) for faster CI
    dirs: ['src'],
  },

  // TypeScript optimization
  typescript: {
    // Re-enable if you want to skip type checking during build (not recommended for production)
    // ignoreBuildErrors: false,
  },

  // Experimental features for Next.js 15 / React 19 compatibility
  experimental: {
    // If you have specific needs for React 19, add them here
  },
};

export default nextConfig;

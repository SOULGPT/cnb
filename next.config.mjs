/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // Explicitly set the root to current directory to avoid incorrect inference 
    // from stray lockfiles in parent directories
    root: process.cwd(),
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig

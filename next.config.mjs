/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['placehold.co'],
    unoptimized: true,
  },
  transpilePackages: ['@supabase/ssr', '@supabase/supabase-js'],
  // Suprimir avisos de hidratação em desenvolvimento
  onDemandEntries: {
    // Período de tempo que uma página fica no cache (em ms)
    maxInactiveAge: 25 * 1000,
    // Número de páginas que devem ser mantidas simultaneamente
    pagesBufferLength: 2,
  },
  // Configuração para desenvolvimento
  ...(process.env.NODE_ENV === 'development' && {
    devIndicators: {
      buildActivity: false,
    },
  }),
}

export default nextConfig
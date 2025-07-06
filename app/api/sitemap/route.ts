import { NextResponse } from 'next/server'

const baseUrl = 'https://autopropelidos.com.br'

// Static pages
const staticPages = [
  '',
  '/resolucao-996',
  '/ferramentas',
  '/ferramentas/verificador-conformidade',
  '/noticias',
  '/sobre',
  '/contato',
  '/privacidade',
  '/termos'
]

// Dynamic pages (you can fetch these from your database)
const dynamicPages = [
  // Add dynamic routes like blog posts, news articles, etc.
  // Example: '/noticias/nova-regulamentacao-patinetes-eletricos',
]

export async function GET() {
  const currentDate = new Date().toISOString()
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page === '' ? 'daily' : page.includes('noticias') ? 'weekly' : 'monthly'}</changefreq>
    <priority>${page === '' ? '1.0' : page.includes('resolucao-996') ? '0.9' : '0.8'}</priority>
  </url>`).join('')}
${dynamicPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}
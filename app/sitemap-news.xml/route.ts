import { NextResponse } from 'next/server'
import { getLatestNews } from '@/lib/services/news'

const baseUrl = 'https://autopropelidos.com.br'

// Função para gerar slugs SEO-friendly
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-|-$/g, '') // Remove hífens do início e fim
}

const categoryLabels = {
  regulation: 'Regulamentação',
  safety: 'Segurança',
  technology: 'Tecnologia',
  urban_mobility: 'Mobilidade Urbana',
  general: 'Geral'
}

export async function GET() {
  try {
    // Google News só aceita notícias dos últimos 2 dias
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    const allNews = await getLatestNews('all', 100)
    
    // Filtrar apenas notícias recentes e relevantes
    const recentNews = allNews
      .filter(news => new Date(news.published_at) > twoDaysAgo)
      .filter(news => news.relevance_score >= 70) // Apenas notícias relevantes
      .slice(0, 30) // Google News limita a 1000, mas 30 é um número razoável
    
    const newsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${recentNews.map(news => {
  const slug = generateSlug(news.title)
  const publishedDate = new Date(news.published_at).toISOString()
  
  return `
  <url>
    <loc>${baseUrl}/noticias/${slug}</loc>
    <news:news>
      <news:publication>
        <news:name>Portal Autopropelidos</news:name>
        <news:language>pt</news:language>
      </news:publication>
      <news:publication_date>${publishedDate}</news:publication_date>
      <news:title><![CDATA[${news.title}]]></news:title>
      <news:keywords><![CDATA[${news.tags.join(', ')}, autopropelidos, mobilidade urbana, CONTRAN 996]]></news:keywords>
      <news:stock_tickers></news:stock_tickers>
      <news:genre>PressRelease</news:genre>
    </news:news>
  </url>`
}).join('')}
</urlset>`

    return new NextResponse(newsSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800', // Cache menor para news
        'X-Robots-Tag': 'noindex'
      }
    })
  } catch (error) {
    console.error('Error generating news sitemap:', error)
    
    // Fallback vazio
    const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
</urlset>`

    return new NextResponse(emptySitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=1800, s-maxage=1800'
      }
    })
  }
}

// Revalidar a cada 30 minutos para manter o Google News atualizado
export const revalidate = 1800
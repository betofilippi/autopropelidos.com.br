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

// Static pages com configurações específicas
const staticPages = [
  { url: '', priority: '1.0', changefreq: 'daily' },
  { url: '/resolucao-996', priority: '0.9', changefreq: 'monthly' },
  { url: '/ferramentas', priority: '0.8', changefreq: 'weekly' },
  { url: '/ferramentas/verificador-conformidade', priority: '0.7', changefreq: 'monthly' },
  { url: '/ferramentas/calculadora-custos', priority: '0.7', changefreq: 'monthly' },
  { url: '/ferramentas/checklist-seguranca', priority: '0.7', changefreq: 'monthly' },
  { url: '/ferramentas/guia-documentacao', priority: '0.7', changefreq: 'monthly' },
  { url: '/ferramentas/planejador-rotas', priority: '0.7', changefreq: 'monthly' },
  { url: '/ferramentas/buscador-regulamentacoes', priority: '0.7', changefreq: 'weekly' },
  { url: '/noticias', priority: '0.9', changefreq: 'daily' },
  { url: '/videos', priority: '0.8', changefreq: 'weekly' },
  { url: '/biblioteca', priority: '0.6', changefreq: 'monthly' },
  { url: '/glossario', priority: '0.6', changefreq: 'monthly' },
  { url: '/faq', priority: '0.6', changefreq: 'monthly' },
  { url: '/busca', priority: '0.5', changefreq: 'weekly' }
]

const categoryLabels = {
  regulation: 'Regulamentação',
  safety: 'Segurança',
  technology: 'Tecnologia',
  urban_mobility: 'Mobilidade Urbana',
  general: 'Geral'
}

export async function GET() {
  const currentDate = new Date().toISOString()
  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  
  try {
    // Buscar todas as notícias para incluir no sitemap
    const allNews = await getLatestNews('all', 1000)
    
    // Filtrar notícias recentes para Google News (últimas 48 horas)
    const recentNews = allNews.filter(news => 
      new Date(news.published_at) > twoDaysAgo
    )
    
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
${allNews.map(news => {
  const slug = generateSlug(news.title)
  const publishedDate = new Date(news.published_at).toISOString()
  const isRecent = new Date(news.published_at) > twoDaysAgo
  
  // Calcular prioridade baseada na relevância e recência
  let priority = 0.6
  if (news.relevance_score >= 90) priority = 0.9
  else if (news.relevance_score >= 80) priority = 0.8
  else if (news.relevance_score >= 70) priority = 0.7
  
  if (isRecent) priority += 0.1 // Boost para notícias recentes
  priority = Math.min(priority, 1.0)
  
  return `
  <url>
    <loc>${baseUrl}/noticias/${slug}</loc>
    <lastmod>${publishedDate}</lastmod>
    <changefreq>${isRecent ? 'hourly' : 'daily'}</changefreq>
    <priority>${priority.toFixed(1)}</priority>${isRecent ? `
    <news:news>
      <news:publication>
        <news:name>Portal Autopropelidos</news:name>
        <news:language>pt</news:language>
      </news:publication>
      <news:publication_date>${publishedDate}</news:publication_date>
      <news:title><![CDATA[${news.title}]]></news:title>
      <news:keywords>${news.tags.join(', ')}</news:keywords>
      <news:stock_tickers></news:stock_tickers>
    </news:news>` : ''}${news.image_url ? `
    <image:image>
      <image:loc>${news.image_url}</image:loc>
      <image:title><![CDATA[${news.title}]]></image:title>
      <image:caption><![CDATA[${news.description}]]></image:caption>
    </image:image>` : ''}
  </url>`
}).join('')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'X-Robots-Tag': 'noindex'
      }
    })
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Fallback sitemap sem notícias dinâmicas
    const fallbackSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}
</urlset>`

    return new NextResponse(fallbackSitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  }
}
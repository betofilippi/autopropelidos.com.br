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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const currentDate = new Date().toISOString()
  
  try {
    // Buscar notícias baseado na categoria (se especificada)
    const allNews = await getLatestNews(category || 'all', 50)
    
    // Configurar título e descrição baseado na categoria
    let feedTitle = 'Portal Autopropelidos - Notícias e Atualizações'
    let feedDescription = 'Fique por dentro das últimas notícias sobre equipamentos autopropelidos, regulamentação e mobilidade urbana'
    
    if (category && category !== 'all') {
      const categoryLabel = categoryLabels[category as keyof typeof categoryLabels]
      feedTitle = `Portal Autopropelidos - ${categoryLabel}`
      feedDescription = `Últimas notícias sobre ${categoryLabel.toLowerCase()} de equipamentos autopropelidos`
    }

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:wfw="http://wellformedweb.org/CommentAPI/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
     xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
     xmlns:georss="http://www.georss.org/georss"
     xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#"
     xmlns:media="http://search.yahoo.com/mrss/"
     xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd">
  <channel>
    <title><![CDATA[${feedTitle}]]></title>
    <link>${baseUrl}</link>
    <description><![CDATA[${feedDescription}]]></description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>60</ttl>
    <generator>Portal Autopropelidos RSS Generator v2.0</generator>
    <managingEditor>contato@autopropelidos.com.br (Portal Autopropelidos)</managingEditor>
    <webMaster>contato@autopropelidos.com.br (Portal Autopropelidos)</webMaster>
    <copyright>© 2024 Portal Autopropelidos. Todos os direitos reservados.</copyright>
    <category>Transportation</category>
    <category>Legal</category>
    <category>Urban Mobility</category>
    <category>Technology</category>
    <category>Safety</category>
    
    <!-- Channel Image -->
    <image>
      <url>${baseUrl}/placeholder-logo.png</url>
      <title>${feedTitle}</title>
      <link>${baseUrl}</link>
      <width>200</width>
      <height>60</height>
      <description>Logo do Portal Autopropelidos</description>
    </image>
    
    <!-- iTunes Podcast Tags (para compatibilidade futura) -->
    <itunes:subtitle>Portal de notícias sobre equipamentos autopropelidos</itunes:subtitle>
    <itunes:author>Portal Autopropelidos</itunes:author>
    <itunes:summary><![CDATA[${feedDescription}]]></itunes:summary>
    <itunes:owner>
      <itunes:name>Portal Autopropelidos</itunes:name>
      <itunes:email>contato@autopropelidos.com.br</itunes:email>
    </itunes:owner>
    <itunes:image href="${baseUrl}/placeholder-logo.png" />
    <itunes:category text="Government">
      <itunes:category text="Local"/>
    </itunes:category>
    <itunes:explicit>no</itunes:explicit>
    
    <!-- Atom Feed Link -->
    <atom:link href="${baseUrl}/api/rss${category ? `?category=${category}` : ''}" rel="self" type="application/rss+xml" />
    
    <!-- Alternative Category Feeds -->
    <atom:link href="${baseUrl}/api/rss?category=regulation" rel="alternate" type="application/rss+xml" title="Regulamentação" />
    <atom:link href="${baseUrl}/api/rss?category=safety" rel="alternate" type="application/rss+xml" title="Segurança" />
    <atom:link href="${baseUrl}/api/rss?category=technology" rel="alternate" type="application/rss+xml" title="Tecnologia" />
    <atom:link href="${baseUrl}/api/rss?category=urban_mobility" rel="alternate" type="application/rss+xml" title="Mobilidade Urbana" />
    
    ${allNews.map(news => {
      const slug = generateSlug(news.title)
      const pubDate = new Date(news.published_at).toUTCString()
      const categoryLabel = categoryLabels[news.category as keyof typeof categoryLabels] || 'Geral'
      
      return `
    <item>
      <title><![CDATA[${news.title}]]></title>
      <description><![CDATA[${news.description}]]></description>
      <link>${baseUrl}/noticias/${slug}</link>
      <guid isPermaLink="true">${baseUrl}/noticias/${slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${categoryLabel}]]></category>
      <dc:creator><![CDATA[${news.source}]]></dc:creator>
      <dc:subject><![CDATA[${news.tags.join(', ')}]]></dc:subject>
      <content:encoded><![CDATA[
        <div>
          ${news.image_url ? `<img src="${news.image_url}" alt="${news.title}" style="max-width: 100%; height: auto; margin-bottom: 1rem;" />` : ''}
          <p><strong>Fonte:</strong> ${news.source}</p>
          <p><strong>Categoria:</strong> ${categoryLabel}</p>
          <p><strong>Relevância:</strong> ${news.relevance_score}%</p>
          <div style="margin-top: 1rem;">
            ${news.content || news.description}
          </div>
          ${news.tags.length > 0 ? `
          <div style="margin-top: 1rem;">
            <strong>Tags:</strong> ${news.tags.map(tag => `<span style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-size: 0.8em; margin-right: 4px;">${tag}</span>`).join('')}
          </div>
          ` : ''}
          <p style="margin-top: 1rem;">
            <a href="${baseUrl}/noticias/${slug}" target="_blank">Leia a matéria completa no Portal Autopropelidos</a>
          </p>
        </div>
      ]]></content:encoded>
      
      <!-- Media RSS para imagens -->
      ${news.image_url ? `
      <media:content url="${news.image_url}" type="image/jpeg" medium="image">
        <media:title type="plain">${news.title}</media:title>
        <media:description type="plain">${news.description}</media:description>
        <media:credit role="author">${news.source}</media:credit>
        <media:copyright>© ${news.source}</media:copyright>
      </media:content>
      <media:thumbnail url="${news.image_url}" width="150" height="113" />
      ` : ''}
      
      <!-- Custom Fields -->
      <source url="${news.url}">${news.source}</source>
      <relevance>${news.relevance_score}</relevance>
      <originalUrl>${news.url}</originalUrl>
      
      <!-- Geo RSS (se aplicável) -->
      <georss:point>-23.5505 -46.6333</georss:point>
      <geo:lat>-23.5505</geo:lat>
      <geo:long>-46.6333</geo:long>
    </item>`
    }).join('')}
  </channel>
</rss>`

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'X-Content-Type-Options': 'nosniff'
      }
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    
    // Fallback RSS mínimo
    const fallbackRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Portal Autopropelidos - Erro Temporário</title>
    <link>${baseUrl}</link>
    <description>Erro temporário ao gerar feed RSS. Tente novamente em alguns minutos.</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml" />
  </channel>
</rss>`

    return new NextResponse(fallbackRss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300' // Cache menor em caso de erro
      }
    })
  }
}

// Revalidar a cada hora
export const revalidate = 3600
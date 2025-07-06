import { NextResponse } from 'next/server'

const baseUrl = 'https://autopropelidos.com.br'

export async function GET() {
  const currentDate = new Date().toISOString()
  
  // In a real application, you would fetch this from your database
  const articles = [
    {
      title: 'Nova Regulamentação para Patinetes Elétricos em 2024',
      description: 'Conheça as principais mudanças na regulamentação de equipamentos autopropelidos',
      link: `${baseUrl}/noticias/nova-regulamentacao-patinetes-eletricos-2024`,
      pubDate: new Date('2024-01-15').toISOString(),
      category: 'Regulamentação'
    },
    {
      title: 'Guia Completo da Resolução 996 do CONTRAN',
      description: 'Tudo que você precisa saber sobre a Resolução 996 e seus impactos',
      link: `${baseUrl}/resolucao-996`,
      pubDate: new Date('2024-01-10').toISOString(),
      category: 'Legislação'
    },
    {
      title: 'Segurança no Trânsito: Equipamentos Obrigatórios',
      description: 'Lista completa dos equipamentos de segurança obrigatórios para equipamentos autopropelidos',
      link: `${baseUrl}/noticias/seguranca-transito-equipamentos-obrigatorios`,
      pubDate: new Date('2024-01-05').toISOString(),
      category: 'Segurança'
    }
  ]

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:wfw="http://wellformedweb.org/CommentAPI/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
     xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
     xmlns:georss="http://www.georss.org/georss"
     xmlns:geo="http://www.w3.org/2003/01/geo/wgs84_pos#">
  <channel>
    <title>Portal Autopropelidos - Notícias e Atualizações</title>
    <link>${baseUrl}</link>
    <description>Fique por dentro das últimas notícias sobre equipamentos autopropelidos, regulamentação e mobilidade urbana</description>
    <language>pt-BR</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <pubDate>${currentDate}</pubDate>
    <ttl>60</ttl>
    <generator>Portal Autopropelidos</generator>
    <managingEditor>contato@autopropelidos.com.br (Portal Autopropelidos)</managingEditor>
    <webMaster>contato@autopropelidos.com.br (Portal Autopropelidos)</webMaster>
    <copyright>© 2024 Portal Autopropelidos. Todos os direitos reservados.</copyright>
    <category>Transportation</category>
    <category>Legal</category>
    <category>Urban Mobility</category>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Portal Autopropelidos</title>
      <link>${baseUrl}</link>
      <width>200</width>
      <height>60</height>
      <description>Logo do Portal Autopropelidos</description>
    </image>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
    
    ${articles.map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.description}]]></description>
      <link>${article.link}</link>
      <guid isPermaLink="true">${article.link}</guid>
      <pubDate>${new Date(article.pubDate).toUTCString()}</pubDate>
      <category><![CDATA[${article.category}]]></category>
      <dc:creator><![CDATA[Portal Autopropelidos]]></dc:creator>
      <content:encoded><![CDATA[${article.description}]]></content:encoded>
    </item>`).join('')}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/rss+xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  })
}
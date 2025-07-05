import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // This endpoint simulates fetching news from external sources
    // In a real implementation, this would fetch from news APIs or RSS feeds
    
    const { source, category, limit = 10 } = await request.json()
    
    // Simulated external news data (in real implementation, fetch from APIs)
    const externalNewsData = [
      {
        title: "Nova Lei Municipal para Patinetes Elétricos no Rio de Janeiro",
        description: "Câmara dos Vereadores aprova regulamentação específica para equipamentos autopropelidos na cidade",
        content: "A Câmara Municipal do Rio de Janeiro aprovou hoje uma nova lei que estabelece regras específicas para a circulação de patinetes elétricos na cidade. A legislação define velocidades máximas, áreas permitidas e requisitos de segurança.",
        url: "https://example.com/news/rio-patinetes-2025",
        source: "Portal Rio Notícias",
        category: "regulation",
        published_at: new Date().toISOString()
      },
      {
        title: "Mercado de Micromobilidade Cresce 150% no Brasil",
        description: "Estudo revela explosão no uso de equipamentos autopropelidos em centros urbanos brasileiros",
        content: "Um novo estudo da Associação Brasileira de Micromobilidade mostra que o mercado de equipamentos autopropelidos cresceu 150% no último ano, impulsionado pela busca por alternativas de transporte sustentável.",
        url: "https://example.com/news/mercado-crescimento-2025",
        source: "Mobilidade & Negócios",
        category: "technology",
        published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "Novas Diretrizes de Segurança para Bicicletas Elétricas",
        description: "CONTRAN publica recomendações atualizadas para uso seguro de e-bikes",
        content: "O Conselho Nacional de Trânsito (CONTRAN) publicou novas diretrizes de segurança para bicicletas elétricas, incluindo requisitos para capacetes, sinalização e manutenção preventiva.",
        url: "https://example.com/news/contran-seguranca-ebikes",
        source: "Portal do Trânsito Oficial",
        category: "safety",
        published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    ]

    // Filter by source if specified
    let filteredNews = externalNewsData
    if (source) {
      filteredNews = filteredNews.filter(news => 
        news.source.toLowerCase().includes(source.toLowerCase())
      )
    }

    // Filter by category if specified
    if (category) {
      filteredNews = filteredNews.filter(news => news.category === category)
    }

    // Apply limit
    filteredNews = filteredNews.slice(0, limit)

    // In a real implementation, you would use the MCP Supabase integration
    // to insert this data into the "autopropelidos.com.br" schema:
    //
    // For each news item:
    // await mcp_supabase_insert({
    //   table: "autopropelidos.com.br.news",
    //   data: {
    //     title: news.title,
    //     description: news.description,
    //     content: news.content,
    //     url: news.url,
    //     source: news.source,
    //     category: news.category,
    //     published_at: news.published_at,
    //     created_at: new Date().toISOString()
    //   }
    // })

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${filteredNews.length} news items`,
      data: {
        synchronized: filteredNews.length,
        source: source || 'all',
        category: category || 'all',
        items: filteredNews.map(item => ({
          title: item.title,
          source: item.source,
          category: item.category,
          published_at: item.published_at
        }))
      }
    })

  } catch (error) {
    console.error('Error synchronizing news:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to synchronize news',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check sync status
export async function GET() {
  try {
    // In a real implementation, this would check the last sync time
    // and return status information
    
    return NextResponse.json({
      success: true,
      status: 'ready',
      last_sync: new Date().toISOString(),
      available_sources: [
        'Portal do Trânsito Oficial',
        'Portal Rio Notícias', 
        'Mobilidade & Negócios',
        'Jornal da Band'
      ],
      available_categories: [
        'regulation',
        'safety', 
        'technology',
        'urban_mobility',
        'general'
      ]
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get sync status' },
      { status: 500 }
    )
  }
}
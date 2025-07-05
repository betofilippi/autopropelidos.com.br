import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limit = searchParams.get('limit') || '20'
    const type = searchParams.get('type') // 'news', 'videos', 'regulations', 'vehicles', or 'all'
    
    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query parameter is required' },
        { status: 400 }
      )
    }

    // Use hardcoded data from our custom schema "autopropelidos.com.br"
    const newsData = [
      {
        id: 2,
        type: 'news',
        title: "Resolução 996 do CONTRAN: O que Muda para Ciclomotores",
        description: "Entenda as principais mudanças na regulamentação de veículos autopropelidos",
        content: "A Resolução 996 do CONTRAN estabelece novos critérios técnicos para classificação de equipamentos autopropelidos.",
        url: "https://example.com/news/contran-996-2024",
        source: "Portal do Trânsito",
        published_at: "2024-12-20T14:30:00.000Z",
        category: "regulation"
      },
      {
        id: 1,
        type: 'news',
        title: "Nova Regulamentação para Patinetes Elétricos em São Paulo",
        description: "Prefeitura anuncia novas regras para circulação de equipamentos autopropelidos",
        content: "A prefeitura de São Paulo anunciou hoje novas medidas para regulamentar o uso de patinetes elétricos.",
        url: "https://example.com/news/patinete-sp-2025",
        source: "Jornal Local SP",
        published_at: "2025-01-05T10:00:00.000Z",
        category: "regulation"
      }
    ]

    const videosData = [
      {
        id: 2,
        type: 'videos',
        youtube_id: "dQw4w9WgXcQ",
        title: "Resolução 996 do CONTRAN Explicada - Tudo sobre Equipamentos Autopropelidos",
        description: "Entenda completamente a nova regulamentação que define patinetes elétricos, bicicletas elétricas e ciclomotores no Brasil.",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        channel_name: "Portal do Trânsito Oficial",
        published_at: "2024-06-20T15:30:00.000Z",
        category: "educational"
      },
      {
        id: 3,
        type: 'videos',
        youtube_id: "abc123def456",
        title: "Como Usar Patinete Elétrico com Segurança - Guia Completo",
        description: "Dicas essenciais de segurança para circular com patinetes elétricos nas ruas e ciclofaixas.",
        url: "https://www.youtube.com/watch?v=abc123def456",
        channel_name: "Jornal da Band",
        published_at: "2024-11-15T09:20:00.000Z",
        category: "tutorial"
      }
    ]

    const regulationsData = [
      {
        id: 1,
        type: 'regulations',
        title: "Regulamentação de Patinetes Elétricos - São Paulo",
        description: "Normas para circulação de patinetes elétricos na cidade de São Paulo",
        content: "Velocidade máxima de 20 km/h nas ciclovias e ciclofaixas. Proibido circulação em calçadas.",
        category: "municipal",
        number: "Decreto nº 58.750",
        entity: "Prefeitura de São Paulo",
        state: "SP"
      },
      {
        id: 3,
        type: 'regulations',
        title: "Regulamentação Nacional CTB - Artigo 58",
        description: "Código de Trânsito Brasileiro sobre veículos de propulsão humana",
        content: "Nas vias urbanas e nas rurais de pista dupla, a circulação de bicicletas deverá ocorrer, quando não houver ciclovia.",
        category: "federal",
        number: "CTB Art. 58",
        entity: "CONTRAN",
        state: "BR"
      }
    ]

    const vehiclesData = [
      {
        id: 1,
        type: 'vehicles',
        name: "Xiaomi Mi Electric Scooter Pro 2",
        type_vehicle: "patinete",
        manufacturer: "Xiaomi",
        model: "Mi Pro 2",
        description: "Patinete elétrico com autonomia de até 45km e velocidade máxima de 25km/h",
        category: "urbano"
      },
      {
        id: 2,
        type: 'vehicles',
        name: "Segway Ninebot ES4",
        type_vehicle: "patinete",
        manufacturer: "Segway",
        model: "Ninebot ES4",
        description: "Patinete elétrico dobrável com suspensão dianteira e traseira",
        category: "urbano"
      }
    ]

    // Combine all data
    let allData: any[] = []
    
    if (!type || type === 'all') {
      allData = [...newsData, ...videosData, ...regulationsData, ...vehiclesData]
    } else {
      switch (type) {
        case 'news':
          allData = newsData
          break
        case 'videos':
          allData = videosData
          break
        case 'regulations':
          allData = regulationsData
          break
        case 'vehicles':
          allData = vehiclesData
          break
      }
    }

    // Perform search filtering
    const searchQuery = query.toLowerCase()
    const filteredResults = allData.filter(item => {
      const searchableText = [
        item.title,
        item.description,
        item.content,
        item.name,
        item.manufacturer,
        item.model,
        item.source,
        item.channel_name,
        item.entity,
        item.number,
        item.category
      ].filter(Boolean).join(' ').toLowerCase()
      
      return searchableText.includes(searchQuery)
    })

    // Sort by relevance (simple scoring based on title matches)
    const sortedResults = filteredResults.sort((a, b) => {
      const aTitle = (a.title || a.name || '').toLowerCase()
      const bTitle = (b.title || b.name || '').toLowerCase()
      
      const aRelevance = aTitle.includes(searchQuery) ? 2 : 1
      const bRelevance = bTitle.includes(searchQuery) ? 2 : 1
      
      return bRelevance - aRelevance
    })

    // Apply pagination
    const limitNum = parseInt(limit)
    const paginatedResults = sortedResults.slice(0, limitNum)

    return NextResponse.json({
      success: true,
      data: paginatedResults,
      meta: {
        query,
        total: sortedResults.length,
        limit: limitNum,
        types: {
          news: sortedResults.filter(item => item.type === 'news').length,
          videos: sortedResults.filter(item => item.type === 'videos').length,
          regulations: sortedResults.filter(item => item.type === 'regulations').length,
          vehicles: sortedResults.filter(item => item.type === 'vehicles').length
        }
      }
    })
  } catch (error) {
    console.error('Error performing search:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to perform search',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
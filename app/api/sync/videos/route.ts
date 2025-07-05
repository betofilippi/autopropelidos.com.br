import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // This endpoint simulates fetching videos from external sources
    // In a real implementation, this would fetch from YouTube API or other video platforms
    
    const { channel, category, limit = 10 } = await request.json()
    
    // Simulated external video data (in real implementation, fetch from YouTube API)
    const externalVideoData = [
      {
        title: "Como Usar Patinete Elétrico com Segurança",
        description: "Tutorial completo sobre uso seguro de patinetes elétricos em vias urbanas",
        youtube_id: "dQw4w9WgXcQ",
        thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
        channel_name: "Canal Mobilidade Urbana",
        channel_id: "UC123456789",
        duration: "12:34",
        category: "tutorial",
        published_at: new Date().toISOString(),
        view_count: 15420,
        like_count: 892
      },
      {
        title: "Revisão: Xiaomi Mi Electric Scooter Pro 2",
        description: "Análise completa do patinete elétrico Xiaomi Pro 2, incluindo autonomia, velocidade e recursos",
        youtube_id: "abc123def456",
        thumbnail_url: "https://img.youtube.com/vi/abc123def456/maxresdefault.jpg",
        channel_name: "Tech Reviews BR",
        channel_id: "UC987654321",
        duration: "18:45",
        category: "review",
        published_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        view_count: 28750,
        like_count: 1456
      },
      {
        title: "Bicicletas Elétricas: Guia de Compra 2025",
        description: "Tudo que você precisa saber antes de comprar uma bicicleta elétrica em 2025",
        youtube_id: "xyz789ghi012",
        thumbnail_url: "https://img.youtube.com/vi/xyz789ghi012/maxresdefault.jpg",
        channel_name: "Bike Elétrica Brasil",
        channel_id: "UC456789123",
        duration: "22:17",
        category: "guide",
        published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        view_count: 42300,
        like_count: 2104
      }
    ]

    // Filter by channel if specified
    let filteredVideos = externalVideoData
    if (channel) {
      filteredVideos = filteredVideos.filter(video => 
        video.channel_name.toLowerCase().includes(channel.toLowerCase())
      )
    }

    // Filter by category if specified
    if (category) {
      filteredVideos = filteredVideos.filter(video => video.category === category)
    }

    // Apply limit
    filteredVideos = filteredVideos.slice(0, limit)

    // In a real implementation, you would use the MCP Supabase integration
    // to insert this data into the "autopropelidos.com.br" schema:
    //
    // For each video:
    // await mcp_supabase_insert({
    //   table: "autopropelidos.com.br.videos",
    //   data: {
    //     title: video.title,
    //     description: video.description,
    //     youtube_id: video.youtube_id,
    //     thumbnail_url: video.thumbnail_url,
    //     channel_name: video.channel_name,
    //     channel_id: video.channel_id,
    //     duration: video.duration,
    //     category: video.category,
    //     published_at: video.published_at,
    //     view_count: video.view_count,
    //     like_count: video.like_count,
    //     created_at: new Date().toISOString()
    //   }
    // })

    return NextResponse.json({
      success: true,
      message: `Successfully synchronized ${filteredVideos.length} videos`,
      data: {
        synchronized: filteredVideos.length,
        channel: channel || 'all',
        category: category || 'all',
        items: filteredVideos.map(item => ({
          title: item.title,
          channel_name: item.channel_name,
          category: item.category,
          published_at: item.published_at,
          view_count: item.view_count
        }))
      }
    })

  } catch (error) {
    console.error('Error synchronizing videos:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to synchronize videos',
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
      available_channels: [
        'Canal Mobilidade Urbana',
        'Tech Reviews BR', 
        'Bike Elétrica Brasil',
        'Patinetes & Cia'
      ],
      available_categories: [
        'tutorial',
        'review', 
        'guide',
        'news',
        'test'
      ]
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get sync status' },
      { status: 500 }
    )
  }
}
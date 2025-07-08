import { NextRequest, NextResponse } from 'next/server'

// Mock video data - em produção, você conectaria com YouTube API
interface VideoData {
  id: string
  title: string
  description: string
  url: string
  thumbnail_url: string
  channel: string
  published_at: string
  duration: number
  views: number
  likes: number
  category: string
  tags: string[]
  relevance_score: number
}

const mockVideoData: VideoData[] = [
  {
    id: 'video-1',
    title: 'Como usar patinete elétrico com segurança',
    description: 'Tutorial completo sobre uso seguro de patinetes elétricos nas ruas.',
    url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=640&h=360&fit=crop&auto=format&q=80',
    channel: 'Mobilidade Urbana',
    published_at: new Date().toISOString(),
    duration: 720,
    views: 45230,
    likes: 1250,
    category: 'safety',
    tags: ['patinete', 'segurança', 'tutorial'],
    relevance_score: 92
  },
  {
    id: 'video-2',
    title: 'Resolução 996 CONTRAN explicada',
    description: 'Entenda todos os detalhes da nova resolução do CONTRAN para equipamentos autopropelidos.',
    url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=640&h=360&fit=crop&auto=format&q=80',
    channel: 'Direito do Trânsito',
    published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    duration: 1200,
    views: 38500,
    likes: 890,
    category: 'regulation',
    tags: ['CONTRAN', 'resolução 996', 'regulamentação'],
    relevance_score: 88
  },
  {
    id: 'video-3',
    title: 'Melhores bicicletas elétricas 2024',
    description: 'Review das melhores bicicletas elétricas disponíveis no mercado brasileiro.',
    url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1543762996-8e14c13a8cb8?w=640&h=360&fit=crop&auto=format&q=80',
    channel: 'Tech Reviews',
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 900,
    views: 52100,
    likes: 1480,
    category: 'technology',
    tags: ['bicicleta elétrica', 'review', 'tecnologia'],
    relevance_score: 85
  },
  {
    id: 'video-4',
    title: 'Dicas de manutenção para patinetes elétricos',
    description: 'Aprenda como fazer a manutenção básica do seu patinete elétrico.',
    url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=640&h=360&fit=crop&auto=format&q=80',
    channel: 'Manual do Patinete',
    published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 480,
    views: 28500,
    likes: 720,
    category: 'technology',
    tags: ['manutenção', 'patinete', 'tutorial'],
    relevance_score: 78
  },
  {
    id: 'video-5',
    title: 'Equipamentos de segurança obrigatórios',
    description: 'Conheça os equipamentos de segurança obrigatórios para usar patinetes elétricos.',
    url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=640&h=360&fit=crop&auto=format&q=80',
    channel: 'Segurança no Trânsito',
    published_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 360,
    views: 19200,
    likes: 485,
    category: 'safety',
    tags: ['segurança', 'equipamentos', 'obrigatório'],
    relevance_score: 82
  }
]

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category') || 'all'
    
    // Simular delay da API
    await new Promise(resolve => setTimeout(resolve, 800))
    
    let filteredVideos = mockVideoData
    
    if (category !== 'all') {
      filteredVideos = mockVideoData.filter(video => video.category === category)
    }
    
    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      success: true,
      data: filteredVideos.slice(0, limit),
      metadata: {
        total: filteredVideos.length,
        limit,
        category,
        timestamp: new Date().toISOString(),
        responseTime,
        source: 'mock_youtube_api'
      }
    })
    
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch video data',
      metadata: {
        timestamp: new Date().toISOString(),
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Endpoint para sincronizar vídeos com YouTube API
    const { channel_id, force_refresh } = await request.json()
    
    // Simular sincronização com YouTube
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const syncedCount = mockVideoData.length
    
    return NextResponse.json({
      success: true,
      message: `Synchronized ${syncedCount} videos`,
      data: {
        synced_count: syncedCount,
        channel_id: channel_id || 'default',
        force_refresh: force_refresh || false,
        last_sync: new Date().toISOString()
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to sync video data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
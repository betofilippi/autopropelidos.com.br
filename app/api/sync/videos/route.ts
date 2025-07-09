import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { VideoItem } from '@/lib/types/services'
import { aggregateYouTubeVideos, searchYouTubeVideos } from '@/lib/services/youtube'
import type { Video as DatabaseVideo } from '@/lib/types'
import type { YouTubeVideo } from '@/lib/types/api'

// Verificar se as APIs estão configuradas
const isYouTubeAPIConfigured = !!process.env.YOUTUBE_API_KEY
const isSupabaseConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY

// Dados mock como fallback (usando o formato VideoItem)
const mockVideoData: VideoItem[] = [
  {
    id: 'video-1',
    youtube_id: 'dQw4w9WgXcQ',
    title: 'Como usar patinete elétrico com segurança',
    description: 'Tutorial completo sobre uso seguro de patinetes elétricos nas ruas.',
    thumbnail_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=640&h=360&fit=crop&auto=format&q=80',
    channel_name: 'Mobilidade Urbana',
    channel_id: 'UCMobilidadeUrbana',
    published_at: new Date().toISOString(),
    duration: '12:00',
    view_count: 45230,
    category: 'safety',
    tags: ['patinete', 'segurança', 'tutorial'],
    relevance_score: 92,
    likes: 1250
  },
  {
    id: 'video-2',
    youtube_id: 'aBc123DeF456',
    title: 'Resolução 996 CONTRAN explicada',
    description: 'Entenda todos os detalhes da nova resolução do CONTRAN para equipamentos autopropelidos.',
    thumbnail_url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=640&h=360&fit=crop&auto=format&q=80',
    channel_name: 'Direito do Trânsito',
    channel_id: 'UCDireitoTransito',
    published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    duration: '20:00',
    view_count: 38500,
    category: 'regulation',
    tags: ['CONTRAN', 'resolução 996', 'regulamentação'],
    relevance_score: 88,
    likes: 890
  },
  {
    id: 'video-3',
    youtube_id: 'xYz789GhI012',
    title: 'Melhores bicicletas elétricas 2024',
    description: 'Review das melhores bicicletas elétricas disponíveis no mercado brasileiro.',
    thumbnail_url: 'https://images.unsplash.com/photo-1543762996-8e14c13a8cb8?w=640&h=360&fit=crop&auto=format&q=80',
    channel_name: 'Tech Reviews',
    channel_id: 'UCTechReviews',
    published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: '15:00',
    view_count: 52100,
    category: 'technology',
    tags: ['bicicleta elétrica', 'review', 'tecnologia'],
    relevance_score: 85,
    likes: 1480
  },
  {
    id: 'video-4',
    youtube_id: 'mNp345QrS678',
    title: 'Dicas de manutenção para patinetes elétricos',
    description: 'Aprenda como fazer a manutenção básica do seu patinete elétrico.',
    thumbnail_url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=640&h=360&fit=crop&auto=format&q=80',
    channel_name: 'Manual do Patinete',
    channel_id: 'UCManualPatinete',
    published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration: '8:00',
    view_count: 28500,
    category: 'technology',
    tags: ['manutenção', 'patinete', 'tutorial'],
    relevance_score: 78,
    likes: 720
  },
  {
    id: 'video-5',
    youtube_id: 'tUv901WxY234',
    title: 'Equipamentos de segurança obrigatórios',
    description: 'Conheça os equipamentos de segurança obrigatórios para usar patinetes elétricos.',
    thumbnail_url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=640&h=360&fit=crop&auto=format&q=80',
    channel_name: 'Segurança no Trânsito',
    channel_id: 'UCSegurancaTransito',
    published_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    duration: '6:00',
    view_count: 19200,
    category: 'safety',
    tags: ['segurança', 'equipamentos', 'obrigatório'],
    relevance_score: 82,
    likes: 485
  }
]

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category') || 'all'
    
    let videoData: VideoItem[] = []
    let source = 'unknown'
    
    // Tentar buscar dados reais do YouTube API
    if (isYouTubeAPIConfigured) {
      try {
        console.log('🔍 Fetching real videos from YouTube API...')
        const realVideos = await searchYouTubeVideos('patinete elétrico bicicleta elétrica')
        if (realVideos && realVideos.items && realVideos.items.length > 0) {
          // Transform YouTube API format to VideoItem format
          videoData = realVideos.items.map((video, index): VideoItem => ({
            id: video.id.videoId,
            youtube_id: video.id.videoId,
            title: video.snippet.title,
            description: video.snippet.description,
            channel_name: video.snippet.channelTitle,
            channel_id: video.snippet.channelId,
            thumbnail_url: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default.url,
            published_at: video.snippet.publishedAt,
            duration: video.contentDetails?.duration || 'PT0S',
            view_count: parseInt(video.statistics?.viewCount || '0'),
            category: 'technology', // Default category
            tags: video.snippet.tags || [],
            relevance_score: Math.max(90 - index * 5, 50), // Higher score for earlier results
            likes: parseInt(video.statistics?.likeCount || '0')
          }))
          source = 'youtube_api'
          console.log(`✅ Successfully fetched ${videoData.length} videos from YouTube API`)
        } else {
          console.log('⚠️ YouTube API returned no data')
          source = 'youtube_api_empty'
        }
      } catch (error) {
        console.error('❌ Error fetching from YouTube API:', error)
        source = 'youtube_api_failed'
      }
    } else {
      console.warn('⚠️ YouTube API not configured - YOUTUBE_API_KEY missing')
      source = 'youtube_api_not_configured'
    }
    
    // Se não conseguiu dados do YouTube API, usar dados do banco
    if (videoData.length === 0 && isSupabaseConfigured) {
      try {
        console.log('🔍 Fetching videos from database...')
        const supabase = createAdminClient()
        const { data: dbVideos, error } = await supabase
          .schema('public')
          .from('videos')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(50)
        
        if (error) {
          console.error('❌ Database error:', error)
          source = 'database_failed'
        } else if (dbVideos && dbVideos.length > 0) {
          // Transform database format to service format
          videoData = dbVideos.map((item: DatabaseVideo): VideoItem => ({
            id: item.id,
            youtube_id: item.youtube_id,
            title: item.title,
            description: item.description,
            channel_name: item.channel_name,
            channel_id: item.channel_id,
            thumbnail_url: item.thumbnail_url,
            published_at: item.published_at,
            duration: item.duration,
            view_count: item.views,
            category: 'technology', // Default category since database doesn't have it
            tags: [], // Database doesn't have tags, use empty array
            relevance_score: 50 // Default relevance score
          }))
          source = 'database'
          console.log(`✅ Successfully fetched ${videoData.length} videos from database`)
        } else {
          console.log('⚠️ Database returned no data')
          source = 'database_empty'
        }
      } catch (error) {
        console.error('❌ Error fetching from database:', error)
        source = 'database_failed'
      }
    }
    
    // Se ainda não tem dados, usar mock
    if (videoData.length === 0) {
      console.log('⚠️ Using mock data as fallback')
      videoData = mockVideoData
      source = 'mock_fallback'
    }
    
    // Filtrar por categoria se especificada
    let filteredVideos = videoData
    if (category !== 'all' && videoData.length > 0) {
      filteredVideos = videoData.filter(video => video.category === category)
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
        source,
        configured: {
          youtube_api: isYouTubeAPIConfigured,
          supabase: isSupabaseConfigured
        }
      }
    })
    
  } catch (error) {
    const responseTime = Date.now() - startTime
    console.error('❌ Error in videos API:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch video data',
      metadata: {
        timestamp: new Date().toISOString(),
        responseTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        configured: {
          youtube_api: isYouTubeAPIConfigured,
          supabase: isSupabaseConfigured
        }
      }
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { channel_id, force_refresh } = await request.json()
    
    if (!isYouTubeAPIConfigured) {
      return NextResponse.json({
        success: false,
        error: 'YouTube API not configured',
        details: 'YOUTUBE_API_KEY environment variable is required'
      }, { status: 400 })
    }
    
    if (!isSupabaseConfigured) {
      return NextResponse.json({
        success: false,
        error: 'Supabase not configured',
        details: 'Supabase environment variables are required'
      }, { status: 400 })
    }
    
    console.log('🔄 Starting video aggregation...')
    
    // Executar agregação real de vídeos
    const result = await aggregateYouTubeVideos()
    
    console.log('✅ Video aggregation completed:', result)
    
    return NextResponse.json({
      success: result.success,
      message: `Synchronized ${result.processed || 0} videos`,
      data: {
        synced_count: result.processed || 0,
        channel_id: channel_id || 'default',
        force_refresh: force_refresh || false,
        last_sync: new Date().toISOString(),
        errors: result.errors || []
      }
    })
    
  } catch (error) {
    console.error('❌ Error in video sync:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to sync video data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
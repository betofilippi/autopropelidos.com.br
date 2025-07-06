import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Função para calcular trending score
function calculateTrendingScore(
  views: number,
  publishedAt: string,
  relevanceScore: number
): number {
  const now = new Date()
  const published = new Date(publishedAt)
  const hoursAgo = (now.getTime() - published.getTime()) / (1000 * 60 * 60)
  
  // Fator de decay temporal (conteúdo mais recente tem maior peso)
  const timeFactor = Math.max(0.1, 1 - (hoursAgo / (24 * 7))) // Decay ao longo de 7 dias
  
  // Fator de visualizações normalizado
  const viewFactor = Math.min(1, views / 100000) // Normaliza até 100k views
  
  // Fator de relevância
  const relevanceFactor = relevanceScore / 100
  
  // Calcula o score final
  return Math.round((viewFactor * 40 + timeFactor * 35 + relevanceFactor * 25) * 100) / 100
}

export async function GET() {
  try {
    const startTime = Date.now()
    const supabase = await createClient()
    
    // Buscar notícias recentes (últimas 48 horas)
    const { data: recentNews, error: newsError } = await supabase
      .from('news')
      .select('*')
      .gte('published_at', new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString())
      .order('published_at', { ascending: false })
    
    // Buscar vídeos recentes (últimos 7 dias)
    const { data: recentVideos, error: videosError } = await supabase
      .from('videos')
      .select('*')
      .gte('published_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('published_at', { ascending: false })
    
    if (newsError || videosError) {
      console.error('Error fetching data for trending:', { newsError, videosError })
      return NextResponse.json(
        { success: false, error: 'Failed to fetch trending data' },
        { status: 500 }
      )
    }
    
    // Calcular trending scores para notícias
    const trendingNews = (recentNews || []).map(news => ({
      ...news,
      trending_score: calculateTrendingScore(0, news.published_at, news.relevance_score),
      content_type: 'news'
    }))
    
    // Calcular trending scores para vídeos
    const trendingVideos = (recentVideos || []).map(video => ({
      ...video,
      trending_score: calculateTrendingScore(
        video.view_count || 0,
        video.published_at,
        video.relevance_score
      ),
      content_type: 'video'
    }))
    
    // Combinar e ordenar por trending score
    const allTrending = [...trendingNews, ...trendingVideos]
      .sort((a, b) => b.trending_score - a.trending_score)
      .slice(0, 20) // Top 20 trending
    
    // Atualizar trending scores no banco
    for (const item of allTrending) {
      try {
        if (item.content_type === 'news') {
          await supabase
            .from('news')
            .update({ trending_score: item.trending_score })
            .eq('id', item.id)
        } else {
          await supabase
            .from('videos')
            .update({ trending_score: item.trending_score })
            .eq('id', item.id)
        }
      } catch (updateError) {
        console.error(`Error updating trending score for ${item.content_type} ${item.id}:`, updateError)
      }
    }
    
    const duration = Date.now() - startTime
    
    // Log da operação
    console.log('TRENDING_SYNC_COMPLETED', {
      total_items: allTrending.length,
      news_items: trendingNews.length,
      video_items: trendingVideos.length,
      duration_ms: duration,
      trigger: 'cron'
    })
    
    return NextResponse.json({
      success: true,
      message: `Successfully calculated trending scores for ${allTrending.length} items`,
      data: {
        total_items: allTrending.length,
        news_items: trendingNews.length,
        video_items: trendingVideos.length,
        top_trending: allTrending.slice(0, 10).map(item => ({
          id: item.id,
          title: item.title,
          type: item.content_type,
          trending_score: item.trending_score,
          published_at: item.published_at
        })),
        duration_ms: duration,
        trigger: 'cron',
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Error in trending sync cron:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate trending scores',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Manual trigger with same logic as GET
    return await GET()
  } catch (error) {
    console.error('Error in trending sync endpoint:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to calculate trending scores',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
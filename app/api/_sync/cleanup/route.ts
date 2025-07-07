import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { invalidateNewsCache } from '@/lib/services/news'

export async function GET() {
  try {
    const startTime = Date.now()
    const supabase = await createClient()
    
    // Definir datas de corte
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    
    let deletedNews = 0
    let deletedVideos = 0
    let invalidatedCache = 0
    
    // Limpar notícias antigas com baixa relevância
    const { data: oldNews, error: newsError } = await supabase
      .from('news')
      .delete()
      .lt('published_at', sixMonthsAgo.toISOString())
      .lt('relevance_score', 50)
    
    if (!newsError) {
      deletedNews = oldNews?.length || 0
    }
    
    // Limpar vídeos antigos com baixa relevância
    const { data: oldVideos, error: videosError } = await supabase
      .from('videos')
      .delete()
      .lt('published_at', oneYearAgo.toISOString())
      .lt('relevance_score', 40)
    
    if (!videosError) {
      deletedVideos = oldVideos?.length || 0
    }
    
    // Limpar notícias duplicadas (mesma URL)
    const { data: duplicateNews } = await supabase
      .from('news')
      .select('url, id')
      .order('published_at', { ascending: false })
    
    if (duplicateNews) {
      const seen = new Set<string>()
      const toDelete: string[] = []
      
      for (const news of duplicateNews) {
        if (seen.has(news.url)) {
          toDelete.push(news.id)
        } else {
          seen.add(news.url)
        }
      }
      
      if (toDelete.length > 0) {
        await supabase
          .from('news')
          .delete()
          .in('id', toDelete)
        
        deletedNews += toDelete.length
      }
    }
    
    // Limpar vídeos duplicados (mesmo youtube_id)
    const { data: duplicateVideos } = await supabase
      .from('videos')
      .select('youtube_id, id')
      .order('published_at', { ascending: false })
    
    if (duplicateVideos) {
      const seen = new Set<string>()
      const toDelete: string[] = []
      
      for (const video of duplicateVideos) {
        if (seen.has(video.youtube_id)) {
          toDelete.push(video.id)
        } else {
          seen.add(video.youtube_id)
        }
      }
      
      if (toDelete.length > 0) {
        await supabase
          .from('videos')
          .delete()
          .in('id', toDelete)
        
        deletedVideos += toDelete.length
      }
    }
    
    // Invalidar cache de notícias
    try {
      invalidatedCache = invalidateNewsCache()
    } catch (cacheError) {
      console.error('Error invalidating cache:', cacheError)
    }
    
    // Limpeza de registros órfãos ou corrompidos
    // Notícias sem título ou URL
    const { data: orphanNews } = await supabase
      .from('news')
      .delete()
      .or('title.is.null,url.is.null')
    
    if (orphanNews) {
      deletedNews += orphanNews.length
    }
    
    // Vídeos sem título ou youtube_id
    const { data: orphanVideos } = await supabase
      .from('videos')
      .delete()
      .or('title.is.null,youtube_id.is.null')
    
    if (orphanVideos) {
      deletedVideos += orphanVideos.length
    }
    
    const duration = Date.now() - startTime
    
    // Log da operação
    console.log('CLEANUP_SYNC_COMPLETED', {
      deleted_news: deletedNews,
      deleted_videos: deletedVideos,
      invalidated_cache: invalidatedCache,
      duration_ms: duration,
      trigger: 'cron'
    })
    
    return NextResponse.json({
      success: true,
      message: `Cleanup completed: ${deletedNews} news items and ${deletedVideos} videos removed`,
      data: {
        deleted_news: deletedNews,
        deleted_videos: deletedVideos,
        invalidated_cache: invalidatedCache,
        cutoff_dates: {
          news: sixMonthsAgo.toISOString(),
          videos: oneYearAgo.toISOString()
        },
        duration_ms: duration,
        trigger: 'cron',
        timestamp: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Error in cleanup sync cron:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform cleanup',
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
    console.error('Error in cleanup sync endpoint:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform cleanup',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
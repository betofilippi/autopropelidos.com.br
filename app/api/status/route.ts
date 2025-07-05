import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Count news
    const { count: newsCount, error: newsError } = await supabase
      .from('news')
      .select('*', { count: 'exact', head: true })
    
    // Count videos
    const { count: videosCount, error: videosError } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true })
    
    // Get latest news
    const { data: latestNews, error: latestNewsError } = await supabase
      .from('news')
      .select('id, title, published_at')
      .order('published_at', { ascending: false })
      .limit(3)
    
    // Get latest videos
    const { data: latestVideos, error: latestVideosError } = await supabase
      .from('videos')
      .select('id, title, view_count')
      .order('view_count', { ascending: false })
      .limit(3)
    
    return NextResponse.json({
      status: 'ok',
      database: {
        news: {
          count: newsCount || 0,
          error: newsError?.message,
          latest: latestNews || []
        },
        videos: {
          count: videosCount || 0,
          error: videosError?.message,
          latest: latestVideos || []
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
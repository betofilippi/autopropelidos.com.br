import { NextResponse } from 'next/server'
import { aggregateNews } from '@/lib/services/news'
import { aggregateYouTubeVideos } from '@/lib/services/youtube'

// Esta rota deve ser protegida e executada via cron job
export async function POST(request: Request) {
  try {
    // Verificar autorização (implementar sua própria lógica)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Executar agregação em paralelo
    const [newsResult, videosResult] = await Promise.allSettled([
      aggregateNews(),
      aggregateYouTubeVideos()
    ])

    const results = {
      news: newsResult.status === 'fulfilled' ? 'success' : 'failed',
      videos: videosResult.status === 'fulfilled' ? 'success' : 'failed',
      timestamp: new Date().toISOString()
    }

    return NextResponse.json({
      message: 'Content aggregation completed',
      results
    })
  } catch (error) {
    console.error('Aggregation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
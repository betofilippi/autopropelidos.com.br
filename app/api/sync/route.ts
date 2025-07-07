import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Verificar se tem autorização (opcional - adicionar um bearer token)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.SYNC_TOKEN || 'sync-token-secret'
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Import services
    const { aggregateNews } = await import('@/lib/services/news')
    const { aggregateYouTubeVideos } = await import('@/lib/services/youtube')

    // Execute both aggregations in parallel
    const [newsResult, videosResult] = await Promise.all([
      aggregateNews(),
      aggregateYouTubeVideos()
    ])

    return NextResponse.json({
      success: true,
      data: {
        news: {
          success: newsResult.success,
          processed: newsResult.processed,
          errors: newsResult.errors
        },
        videos: {
          success: videosResult.success,
          processed: videosResult.processed,
          errors: videosResult.errors
        }
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in sync endpoint:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Sync failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint para verificar status
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Sync endpoint is ready. Use POST with Bearer token to trigger sync.',
    timestamp: new Date().toISOString()
  })
}
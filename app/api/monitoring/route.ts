import { NextRequest, NextResponse } from 'next/server'
import { monitoring } from '@/lib/utils/monitoring'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'dashboard'

    switch (type) {
      case 'dashboard':
        return NextResponse.json({
          success: true,
          data: monitoring.getDashboard(),
          timestamp: new Date().toISOString()
        })

      case 'alerts':
        return NextResponse.json({
          success: true,
          data: {
            active_alerts: monitoring.getAlerts(),
            alert_count: monitoring.getAlerts().length
          },
          timestamp: new Date().toISOString()
        })

      case 'health':
        const dashboard = monitoring.getDashboard()
        return NextResponse.json({
          success: true,
          data: {
            status: dashboard.overall_health,
            healthy: dashboard.overall_health === 'healthy',
            alerts: dashboard.active_alerts,
            last_update: new Date().toISOString()
          },
          timestamp: new Date().toISOString()
        })

      case 'database':
        const supabase = await createClient()
        
        // Verificar conectividade com o banco
        const { data: newsCount, error: newsError } = await supabase
          .from('news')
          .select('id', { count: 'exact', head: true })

        const { data: videosCount, error: videosError } = await supabase
          .from('videos')
          .select('id', { count: 'exact', head: true })

        return NextResponse.json({
          success: true,
          data: {
            database_healthy: !newsError && !videosError,
            tables: {
              news: {
                accessible: !newsError,
                count: newsCount || 0,
                error: newsError?.message
              },
              videos: {
                accessible: !videosError,
                count: videosCount || 0,
                error: videosError?.message
              }
            },
            timestamp: new Date().toISOString()
          }
        })

      case 'apis':
        // Verificar status das APIs externas
        const apiStatuses = await Promise.allSettled([
          // Teste simples da News API
          fetch('https://newsapi.org/v2/top-headlines?country=us&pageSize=1&apiKey=' + process.env.NEWS_API_KEY),
          // Teste simples da YouTube API
          fetch('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=test&key=' + process.env.YOUTUBE_API_KEY)
        ])

        return NextResponse.json({
          success: true,
          data: {
            apis: {
              news_api: {
                available: apiStatuses[0].status === 'fulfilled' && (apiStatuses[0].value as Response).ok,
                configured: !!process.env.NEWS_API_KEY,
                last_check: new Date().toISOString()
              },
              youtube_api: {
                available: apiStatuses[1].status === 'fulfilled' && (apiStatuses[1].value as Response).ok,
                configured: !!process.env.YOUTUBE_API_KEY,
                last_check: new Date().toISOString()
              }
            },
            timestamp: new Date().toISOString()
          }
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid monitoring type' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error in monitoring endpoint:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get monitoring data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, alert_id } = body

    switch (action) {
      case 'resolve_alert':
        if (!alert_id) {
          return NextResponse.json(
            { success: false, error: 'alert_id is required' },
            { status: 400 }
          )
        }
        
        monitoring.resolveAlert(alert_id)
        
        return NextResponse.json({
          success: true,
          message: `Alert ${alert_id} resolved`,
          timestamp: new Date().toISOString()
        })

      case 'trigger_health_check':
        // Executar verificação completa de saúde
        const dashboard = monitoring.getDashboard()
        
        return NextResponse.json({
          success: true,
          message: 'Health check completed',
          data: dashboard,
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Error in monitoring POST endpoint:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process monitoring action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
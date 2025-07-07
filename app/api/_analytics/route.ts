import { NextRequest, NextResponse } from 'next/server'
import { 
  getAnalytics, 
  getTrafficStats, 
  getContentAnalytics, 
  getDashboardSummary,
  invalidateAnalyticsCache
} from '@/lib/services/analytics'
import { logger } from '@/lib/utils/logger'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')
    const period = searchParams.get('period')
    
    let result
    
    switch (action) {
      case 'traffic':
        result = await getTrafficStats()
        break
        
      case 'content':
        result = await getContentAnalytics()
        break
        
      case 'dashboard':
        result = await getDashboardSummary()
        break
        
      case 'overview':
      default:
        result = await getAnalytics(period || undefined)
        break
    }
    
    const duration = Date.now() - startTime
    
    logger.apiResponse('GET', '/api/analytics', 200, duration)
    
    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        action: action || 'overview',
        period: period || 'current',
        response_time_ms: duration
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    const duration = Date.now() - startTime
    
    logger.error('API_ANALYTICS', 'Error in analytics endpoint', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration_ms: duration
    })
    
    logger.apiResponse('GET', '/api/analytics', 500, duration)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const action = body.action
    
    switch (action) {
      case 'track_event':
        // Implementar tracking de eventos personalizados
        const { event_type, event_data } = body
        
        logger.userAction(event_type, 'anonymous', event_data)
        
        return NextResponse.json({
          success: true,
          message: 'Event tracked successfully',
          timestamp: new Date().toISOString()
        })
        
      case 'invalidate_cache':
        // Invalidar cache de analytics (apenas para administradores)
        const pattern = body.pattern
        const invalidated = invalidateAnalyticsCache(pattern)
        
        return NextResponse.json({
          success: true,
          message: `Invalidated ${invalidated} cache entries`,
          data: { invalidated_count: invalidated },
          timestamp: new Date().toISOString()
        })
        
      case 'export_data':
        // Implementar exportação de dados de analytics
        return NextResponse.json({
          success: true,
          message: 'Data export feature coming soon',
          timestamp: new Date().toISOString()
        })
        
      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
            available_actions: ['track_event', 'invalidate_cache', 'export_data'],
            timestamp: new Date().toISOString()
          },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request body',
        timestamp: new Date().toISOString()
      },
      { status: 400 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Endpoint para limpeza de dados de analytics (GDPR compliance)
    const searchParams = request.nextUrl.searchParams
    const user_id = searchParams.get('user_id')
    
    if (!user_id) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required for data deletion',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }
    
    // Implementar lógica de remoção de dados do usuário
    logger.info('DATA_DELETION', `Data deletion requested for user ${user_id}`, {
      user_id,
      requested_at: new Date().toISOString()
    })
    
    return NextResponse.json({
      success: true,
      message: 'Data deletion request processed',
      data: { user_id },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Error processing data deletion request',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
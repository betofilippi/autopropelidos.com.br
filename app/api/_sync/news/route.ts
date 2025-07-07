import { NextRequest, NextResponse } from 'next/server'
import { aggregateNews } from '@/lib/services/news'

export async function POST(request: NextRequest) {
  try {
    // Check if this is a cron job or manual trigger
    const body = await request.json().catch(() => ({}))
    const { force = false } = body
    
    const startTime = Date.now()
    
    // Execute news aggregation using real APIs
    const result = await aggregateNews()
    
    const duration = Date.now() - startTime
    
    // Log the operation
    console.log('NEWS_SYNC_COMPLETED', {
      success: result.success,
      processed: result.processed,
      errors: result.errors.length,
      duration_ms: duration,
      trigger: force ? 'manual' : 'cron'
    })

    return NextResponse.json({
      success: result.success,
      message: result.success 
        ? `Successfully synchronized ${result.processed} news items`
        : `Sync completed with ${result.errors.length} errors`,
      data: {
        synchronized: result.processed,
        duration_ms: duration,
        errors: result.errors,
        trigger: force ? 'manual' : 'cron',
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error in news sync endpoint:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to synchronize news',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint for cron jobs (Vercel requires GET for cron)
export async function GET() {
  try {
    const startTime = Date.now()
    
    // Execute news aggregation using real APIs
    const result = await aggregateNews()
    
    const duration = Date.now() - startTime
    
    // Log the operation
    console.log('NEWS_SYNC_CRON_COMPLETED', {
      success: result.success,
      processed: result.processed,
      errors: result.errors.length,
      duration_ms: duration,
      trigger: 'cron'
    })

    return NextResponse.json({
      success: result.success,
      message: result.success 
        ? `Successfully synchronized ${result.processed} news items`
        : `Sync completed with ${result.errors.length} errors`,
      data: {
        synchronized: result.processed,
        duration_ms: duration,
        errors: result.errors,
        trigger: 'cron',
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error in news sync cron:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to synchronize news',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}


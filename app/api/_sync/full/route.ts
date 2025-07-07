import { NextRequest, NextResponse } from 'next/server'
import { syncService } from '@/lib/services/api/sync'
import { FullSyncService } from '@/lib/services/api/full-sync'

const fullSyncService = new FullSyncService()

export async function POST(request: NextRequest) {
  try {
    // Security check
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = process.env.SYNC_API_KEY

    if (expectedKey && apiKey !== expectedKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request body for sync options
    const body = await request.json().catch(() => ({}))
    const {
      batchSize = 50,
      maxRetries = 3,
      includeAnalytics = true,
      forceRefresh = false,
      webhook = null,
      priority = 'normal'
    } = body

    // Validate configuration
    if (!process.env.NEWS_API_KEY || !process.env.YOUTUBE_API_KEY) {
      return NextResponse.json({
        error: 'API keys not configured',
        details: {
          newsAPI: !process.env.NEWS_API_KEY ? 'Missing' : 'OK',
          youTube: !process.env.YOUTUBE_API_KEY ? 'Missing' : 'OK'
        }
      }, { status: 500 })
    }

    // Check if full sync is already running
    const status = fullSyncService.getStatus()
    if (status.isRunning) {
      return NextResponse.json({
        error: 'Full sync already in progress',
        status,
        estimatedCompletion: status.estimatedCompletion
      }, { status: 409 })
    }

    // Start full sync process
    const syncPromise = fullSyncService.startFullSync({
      batchSize,
      maxRetries,
      includeAnalytics,
      forceRefresh,
      webhook,
      priority
    })

    // Don't wait for completion - return immediately with job ID
    const jobId = fullSyncService.getJobId()

    return NextResponse.json({
      success: true,
      jobId,
      message: 'Full sync started',
      status: 'initiated',
      estimatedDuration: '10-30 minutes',
      checkStatusUrl: `/api/sync/full/status/${jobId}`
    })

  } catch (error) {
    console.error('Full sync API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const status = fullSyncService.getStatus()
    const regularSyncStatus = syncService.getSyncStatus()

    return NextResponse.json({
      fullSync: status,
      regularSync: regularSyncStatus,
      system: {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Full sync status error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = process.env.SYNC_API_KEY

    if (expectedKey && apiKey !== expectedKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const jobId = searchParams.get('jobId')
    const force = searchParams.get('force') === 'true'

    if (jobId) {
      const result = await fullSyncService.cancelJob(jobId, force)
      return NextResponse.json({
        success: true,
        result,
        message: `Job ${jobId} cancelled`
      })
    }

    // Cancel all running jobs
    const result = await fullSyncService.cancelAllJobs(force)
    return NextResponse.json({
      success: true,
      result,
      message: 'All sync jobs cancelled'
    })

  } catch (error) {
    console.error('Cancel sync error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
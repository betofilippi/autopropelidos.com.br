import { NextRequest, NextResponse } from 'next/server'
import { syncService } from '@/lib/services/api/sync'
// import { youTubeService } from '@/lib/services/youtube' // Commented out for build compatibility

// API route to manually trigger content sync
export async function POST(request: NextRequest) {
  try {
    // Check for API key in headers for basic security
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = process.env.SYNC_API_KEY

    if (expectedKey && apiKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if required API keys are configured
    if (!process.env.NEWS_API_KEY || !process.env.YOUTUBE_API_KEY) {
      return NextResponse.json(
        { 
          error: 'API keys not configured',
          details: {
            newsAPI: !process.env.NEWS_API_KEY ? 'Missing NEWS_API_KEY' : 'Configured',
            youTube: !process.env.YOUTUBE_API_KEY ? 'Missing YOUTUBE_API_KEY' : 'Configured',
          }
        },
        { status: 500 }
      )
    }

    // Check if sync is already running
    const status = syncService.getSyncStatus()
    if (status.isRunning) {
      return NextResponse.json(
        { 
          error: 'Sync already in progress',
          status 
        },
        { status: 409 }
      )
    }

    // Perform sync
    const result = await syncService.performSync()

    // Get YouTube quota status
    // const quotaStatus = youTubeService.getQuotaStatus() // Commented out for build compatibility

    return NextResponse.json({
      success: true,
      result,
      // quotaStatus, // Commented out for build compatibility
    })
  } catch (error) {
    console.error('Sync API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check sync status
export async function GET(request: NextRequest) {
  try {
    const status = syncService.getSyncStatus()
    // const quotaStatus = youTubeService.getQuotaStatus() // Commented out for build compatibility

    return NextResponse.json({
      sync: status,
      youtube: {
        // quota: quotaStatus, // Commented out for build compatibility
      },
      apis: {
        newsAPI: process.env.NEWS_API_KEY ? 'Configured' : 'Missing',
        youTube: process.env.YOUTUBE_API_KEY ? 'Configured' : 'Missing',
      },
    })
  } catch (error) {
    console.error('Status API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE endpoint to cleanup old content
export async function DELETE(request: NextRequest) {
  try {
    // Check for API key
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = process.env.SYNC_API_KEY

    if (expectedKey && apiKey !== expectedKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get days parameter from query
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '90')

    if (isNaN(days) || days < 1) {
      return NextResponse.json(
        { error: 'Invalid days parameter' },
        { status: 400 }
      )
    }

    const result = await syncService.cleanupOldContent(days)

    return NextResponse.json({
      success: true,
      result,
      message: `Deleted content older than ${days} days`,
    })
  } catch (error) {
    console.error('Cleanup API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
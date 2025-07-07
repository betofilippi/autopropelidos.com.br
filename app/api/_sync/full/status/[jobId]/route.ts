import { NextRequest, NextResponse } from 'next/server'
import { FullSyncService } from '@/lib/services/api/full-sync'

const fullSyncService = new FullSyncService()

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobId = params.jobId

    if (!jobId) {
      return NextResponse.json({
        error: 'Job ID is required'
      }, { status: 400 })
    }

    const jobStatus = fullSyncService.getJobStatus(jobId)

    if (!jobStatus) {
      return NextResponse.json({
        error: 'Job not found',
        jobId
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      jobId,
      status: jobStatus,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Job status error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const apiKey = request.headers.get('x-api-key')
    const expectedKey = process.env.SYNC_API_KEY

    if (expectedKey && apiKey !== expectedKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const jobId = params.jobId
    const { searchParams } = new URL(request.url)
    const force = searchParams.get('force') === 'true'

    if (!jobId) {
      return NextResponse.json({
        error: 'Job ID is required'
      }, { status: 400 })
    }

    const result = await fullSyncService.cancelJob(jobId, force)

    if (!result.found) {
      return NextResponse.json({
        error: 'Job not found',
        jobId
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      jobId,
      cancelled: result.cancelled,
      message: result.cancelled ? 'Job cancelled successfully' : 'Job was already completed'
    })

  } catch (error) {
    console.error('Cancel job error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
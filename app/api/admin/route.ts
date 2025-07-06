import { NextRequest, NextResponse } from 'next/server'
import { AdminService } from '@/lib/services/admin'
import { createAdminClient } from '@/lib/supabase/admin'

const adminService = new AdminService()

export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const authResult = await adminService.authenticateAdmin(request)
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    switch (action) {
      case 'dashboard':
        const dashboard = await adminService.getDashboardData()
        return NextResponse.json(dashboard)

      case 'content':
        const content = await adminService.getContentForReview(page, limit)
        return NextResponse.json(content)

      case 'analytics':
        const analytics = await adminService.getAnalyticsSummary()
        return NextResponse.json(analytics)

      case 'users':
        const users = await adminService.getUsersOverview(page, limit)
        return NextResponse.json(users)

      case 'system':
        const system = await adminService.getSystemHealth()
        return NextResponse.json(system)

      case 'logs':
        const logs = await adminService.getSystemLogs(page, limit)
        return NextResponse.json(logs)

      default:
        return NextResponse.json({
          error: 'Invalid action',
          availableActions: ['dashboard', 'content', 'analytics', 'users', 'system', 'logs']
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Admin API error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await adminService.authenticateAdmin(request)
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'approve_content':
        const approvalResult = await adminService.approveContent(data.contentId, data.contentType)
        return NextResponse.json(approvalResult)

      case 'reject_content':
        const rejectionResult = await adminService.rejectContent(data.contentId, data.contentType, data.reason)
        return NextResponse.json(rejectionResult)

      case 'update_content':
        const updateResult = await adminService.updateContent(data.contentId, data.contentType, data.updates)
        return NextResponse.json(updateResult)

      case 'schedule_content':
        const scheduleResult = await adminService.scheduleContent(data.contentId, data.contentType, data.publishAt)
        return NextResponse.json(scheduleResult)

      case 'bulk_action':
        const bulkResult = await adminService.performBulkAction(data.action, data.items)
        return NextResponse.json(bulkResult)

      case 'update_settings':
        const settingsResult = await adminService.updateSystemSettings(data.settings)
        return NextResponse.json(settingsResult)

      case 'create_manual_content':
        const createResult = await adminService.createManualContent(data.contentType, data.content)
        return NextResponse.json(createResult)

      default:
        return NextResponse.json({
          error: 'Invalid action',
          availableActions: [
            'approve_content', 'reject_content', 'update_content', 
            'schedule_content', 'bulk_action', 'update_settings', 'create_manual_content'
          ]
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Admin POST error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await adminService.authenticateAdmin(request)
    if (!authResult.authorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const id = searchParams.get('id')

    switch (action) {
      case 'delete_content':
        if (!id) {
          return NextResponse.json({ error: 'Content ID required' }, { status: 400 })
        }
        const deleteResult = await adminService.deleteContent(id)
        return NextResponse.json(deleteResult)

      case 'clear_cache':
        const cacheResult = await adminService.clearCache()
        return NextResponse.json(cacheResult)

      case 'cleanup_old_logs':
        const cleanupResult = await adminService.cleanupOldLogs()
        return NextResponse.json(cleanupResult)

      default:
        return NextResponse.json({
          error: 'Invalid action',
          availableActions: ['delete_content', 'clear_cache', 'cleanup_old_logs']
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Admin DELETE error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
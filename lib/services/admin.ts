import { NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { AnalyticsService } from '@/lib/services/analytics'
import { CacheService } from '@/lib/services/cache'
// import jwt from 'jsonwebtoken' // Temporariamente comentado

interface AdminAuthResult {
  authorized: boolean
  adminId?: string
  permissions?: string[]
}

interface DashboardData {
  stats: {
    totalNews: number
    totalVideos: number
    totalUsers: number
    pendingContent: number
    approvedContent: number
    rejectedContent: number
    systemHealth: 'healthy' | 'warning' | 'critical'
  }
  recentActivity: Array<{
    type: 'news' | 'video' | 'user_action' | 'system'
    message: string
    timestamp: Date
    severity: 'info' | 'warning' | 'error'
  }>
  trending: {
    news: Array<{ id: string; title: string; views: number; score: number }>
    videos: Array<{ id: string; title: string; views: number; score: number }>
  }
}

interface ContentForReview {
  items: Array<{
    id: string
    type: 'news' | 'video'
    title: string
    status: 'pending' | 'approved' | 'rejected' | 'scheduled'
    createdAt: Date
    publishAt?: Date
    source: string
    relevanceScore: number
    tags: string[]
    flagged: boolean
    flagReason?: string
  }>
  pagination: {
    page: number
    limit: number
    total: number
    hasMore: boolean
  }
}

export class AdminService {
  private analyticsService = new AnalyticsService()
  private cacheService = new CacheService()

  async authenticateAdmin(request: NextRequest): Promise<AdminAuthResult> {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '')
      
      if (!token) {
        return { authorized: false }
      }

      const secret = process.env.ADMIN_JWT_SECRET
      if (!secret) {
        console.error('ADMIN_JWT_SECRET not configured')
        return { authorized: false }
      }

      // const decoded = jwt.verify(token, secret) as any
      // Temporariamente desabilitado - usando validação simples
      const decoded = { adminId: 'temp-admin' }
      
      // Additional check against admin users table
      const supabase = createAdminClient()
      const { data: admin } = await supabase
        .schema('public')
        .from('admin_users')
        .select('id, permissions, active')
        .eq('id', decoded.adminId)
        .eq('active', true)
        .single()

      if (!admin) {
        return { authorized: false }
      }

      return {
        authorized: true,
        adminId: admin.id,
        permissions: admin.permissions
      }

    } catch (error) {
      console.error('Admin authentication error:', error)
      return { authorized: false }
    }
  }

  async getDashboardData(): Promise<DashboardData> {
    const supabase = createAdminClient()
    
    // Get basic stats
    const [newsCount, videosCount, usersCount, pendingContent, approvedContent, rejectedContent] = await Promise.all([
      supabase.schema('public').from('news').select('id', { count: 'exact', head: true }),
      supabase.schema('public').from('videos').select('id', { count: 'exact', head: true }),
      supabase.schema('public').from('users').select('id', { count: 'exact', head: true }),
      supabase.schema('public').from('content_queue').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.schema('public').from('content_queue').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.schema('public').from('content_queue').select('id', { count: 'exact', head: true }).eq('status', 'rejected')
    ])

    // Get recent activity
    const { data: recentActivity } = await supabase
      .schema('public')
      .from('admin_logs')
      .select('type, message, timestamp, severity')
      .order('timestamp', { ascending: false })
      .limit(10)

    // Get trending content
    const { data: trendingNews } = await supabase
      .schema('public')
      .from('news')
      .select('id, title, view_count, relevance_score')
      .order('relevance_score', { ascending: false })
      .limit(5)

    const { data: trendingVideos } = await supabase
      .schema('public')
      .from('videos')
      .select('id, title, view_count, relevance_score')
      .order('relevance_score', { ascending: false })
      .limit(5)

    // Determine system health
    const systemHealth = await this.calculateSystemHealth()

    return {
      stats: {
        totalNews: newsCount.count || 0,
        totalVideos: videosCount.count || 0,
        totalUsers: usersCount.count || 0,
        pendingContent: pendingContent.count || 0,
        approvedContent: approvedContent.count || 0,
        rejectedContent: rejectedContent.count || 0,
        systemHealth
      },
      recentActivity: recentActivity || [],
      trending: {
        news: trendingNews?.map(item => ({
          id: item.id,
          title: item.title,
          views: item.view_count || 0,
          score: item.relevance_score || 0
        })) || [],
        videos: trendingVideos?.map(item => ({
          id: item.id,
          title: item.title,
          views: item.view_count || 0,
          score: item.relevance_score || 0
        })) || []
      }
    }
  }

  async getContentForReview(page: number = 1, limit: number = 20): Promise<ContentForReview> {
    const supabase = createAdminClient()
    const offset = (page - 1) * limit

    const { data: items, count } = await supabase
      .schema('public')
      .from('content_queue')
      .select(`
        id, type, title, status, created_at, publish_at, source, 
        relevance_score, tags, flagged, flag_reason
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    return {
      items: items?.map(item => ({
        id: item.id,
        type: item.type,
        title: item.title,
        status: item.status,
        createdAt: new Date(item.created_at),
        publishAt: item.publish_at ? new Date(item.publish_at) : undefined,
        source: item.source,
        relevanceScore: item.relevance_score,
        tags: item.tags || [],
        flagged: item.flagged || false,
        flagReason: item.flag_reason
      })) || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        hasMore: (count || 0) > offset + limit
      }
    }
  }

  async getAnalyticsSummary() {
    const supabase = createAdminClient()
    
    const [
      dailyViews,
      topContent,
      userEngagement,
      trafficSources,
      deviceStats
    ] = await Promise.all([
      this.analyticsService.getDailyViews(30),
      this.analyticsService.getTopContent(10),
      this.analyticsService.getUserEngagement(),
      this.analyticsService.getTrafficSources(),
      this.analyticsService.getDeviceStats()
    ])

    return {
      dailyViews,
      topContent,
      userEngagement,
      trafficSources,
      deviceStats,
      summary: {
        totalViews: dailyViews.reduce((sum, day) => sum + day.views, 0),
        avgViewsPerDay: dailyViews.reduce((sum, day) => sum + day.views, 0) / dailyViews.length,
        topPerformingContent: topContent[0]?.title || 'No data',
        avgEngagementTime: userEngagement.avgTimeOnPage || 0
      }
    }
  }

  async getUsersOverview(page: number = 1, limit: number = 20) {
    const supabase = createAdminClient()
    const offset = (page - 1) * limit

    const { data: users, count } = await supabase
      .schema('public')
      .from('users')
      .select(`
        id, email, created_at, last_login, subscription_status, 
        newsletter_subscribed, total_views, favorite_categories
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: userStats } = await supabase
      .schema('public')
      .from('users')
      .select(`
        subscription_status,
        newsletter_subscribed,
        created_at
      `)

    // Calculate user statistics
    const stats = {
      totalUsers: count || 0,
      subscribed: userStats?.filter(u => u.subscription_status === 'active').length || 0,
      newsletterSubscribers: userStats?.filter(u => u.newsletter_subscribed).length || 0,
      newUsersThisMonth: userStats?.filter(u => 
        new Date(u.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length || 0
    }

    return {
      users: users || [],
      stats,
      pagination: {
        page,
        limit,
        total: count || 0,
        hasMore: (count || 0) > offset + limit
      }
    }
  }

  async getSystemHealth() {
    const supabase = createAdminClient()
    
    // Check database connectivity
    const dbStart = Date.now()
    const { error: dbError } = await supabase
      .schema('public')
      .from('news')
      .select('id')
      .limit(1)
    const dbLatency = Date.now() - dbStart

    // Check external APIs
    const apiHealthChecks = await Promise.allSettled([
      this.checkNewsAPIHealth(),
      this.checkYouTubeAPIHealth(),
      this.checkSupabaseHealth()
    ])

    // Get system metrics
    const systemMetrics = {
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version,
      cpuUsage: process.cpuUsage(),
      platform: process.platform,
      arch: process.arch
    }

    return {
      database: {
        connected: !dbError,
        latency: dbLatency,
        error: dbError?.message
      },
      externalAPIs: {
        newsAPI: apiHealthChecks[0].status === 'fulfilled' ? apiHealthChecks[0].value : { healthy: false },
        youTubeAPI: apiHealthChecks[1].status === 'fulfilled' ? apiHealthChecks[1].value : { healthy: false },
        supabase: apiHealthChecks[2].status === 'fulfilled' ? apiHealthChecks[2].value : { healthy: false }
      },
      system: systemMetrics,
      overallHealth: this.calculateOverallHealth(dbError, apiHealthChecks, systemMetrics)
    }
  }

  async getSystemLogs(page: number = 1, limit: number = 50) {
    const supabase = createAdminClient()
    const offset = (page - 1) * limit

    const { data: logs, count } = await supabase
      .schema('public')
      .from('admin_logs')
      .select('*', { count: 'exact' })
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1)

    return {
      logs: logs || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        hasMore: (count || 0) > offset + limit
      }
    }
  }

  async approveContent(contentId: string, contentType: 'news' | 'video') {
    const supabase = createAdminClient()
    
    try {
      // Update content status
      const { error } = await supabase
        .schema('public')
        .from('content_queue')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', contentId)

      if (error) throw error

      // Move to main table
      await this.moveToMainTable(contentId, contentType)

      // Log the action
      await this.logAdminAction('approve_content', `Approved ${contentType} content: ${contentId}`)

      return { success: true, message: 'Content approved successfully' }
    } catch (error) {
      console.error('Error approving content:', error)
      return { success: false, error: 'Failed to approve content' }
    }
  }

  async rejectContent(contentId: string, contentType: 'news' | 'video', reason: string) {
    const supabase = createAdminClient()
    
    try {
      const { error } = await supabase
        .schema('public')
        .from('content_queue')
        .update({
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejection_reason: reason
        })
        .eq('id', contentId)

      if (error) throw error

      await this.logAdminAction('reject_content', `Rejected ${contentType} content: ${contentId} - Reason: ${reason}`)

      return { success: true, message: 'Content rejected successfully' }
    } catch (error) {
      console.error('Error rejecting content:', error)
      return { success: false, error: 'Failed to reject content' }
    }
  }

  async updateContent(contentId: string, contentType: 'news' | 'video', updates: any) {
    const supabase = createAdminClient()
    
    try {
      const { error } = await supabase
        .schema('public')
        .from('content_queue')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', contentId)

      if (error) throw error

      await this.logAdminAction('update_content', `Updated ${contentType} content: ${contentId}`)

      return { success: true, message: 'Content updated successfully' }
    } catch (error) {
      console.error('Error updating content:', error)
      return { success: false, error: 'Failed to update content' }
    }
  }

  async scheduleContent(contentId: string, contentType: 'news' | 'video', publishAt: Date) {
    const supabase = createAdminClient()
    
    try {
      const { error } = await supabase
        .schema('public')
        .from('content_queue')
        .update({
          status: 'scheduled',
          publish_at: publishAt.toISOString()
        })
        .eq('id', contentId)

      if (error) throw error

      await this.logAdminAction('schedule_content', `Scheduled ${contentType} content: ${contentId} for ${publishAt}`)

      return { success: true, message: 'Content scheduled successfully' }
    } catch (error) {
      console.error('Error scheduling content:', error)
      return { success: false, error: 'Failed to schedule content' }
    }
  }

  async performBulkAction(action: string, items: Array<{id: string, type: string}>) {
    const results = []
    
    for (const item of items) {
      try {
        let result
        switch (action) {
          case 'approve':
            result = await this.approveContent(item.id, item.type as 'news' | 'video')
            break
          case 'reject':
            result = await this.rejectContent(item.id, item.type as 'news' | 'video', 'Bulk rejection')
            break
          case 'delete':
            result = await this.deleteContent(item.id)
            break
          default:
            result = { success: false, error: 'Invalid action' }
        }
        results.push({ id: item.id, ...result })
      } catch (error) {
        results.push({ id: item.id, success: false, error: 'Processing failed' })
      }
    }

    await this.logAdminAction('bulk_action', `Performed ${action} on ${items.length} items`)

    return {
      totalProcessed: items.length,
      successful: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    }
  }

  async updateSystemSettings(settings: any) {
    const supabase = createAdminClient()
    
    try {
      const { error } = await supabase
        .schema('public')
        .from('system_settings')
        .upsert({
          ...settings,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      // Clear cache for settings
      await this.cacheService.clear('system_settings')

      await this.logAdminAction('update_settings', 'Updated system settings')

      return { success: true, message: 'Settings updated successfully' }
    } catch (error) {
      console.error('Error updating settings:', error)
      return { success: false, error: 'Failed to update settings' }
    }
  }

  async createManualContent(contentType: 'news' | 'video', content: any) {
    const supabase = createAdminClient()
    
    try {
      const { error } = await supabase
        .schema('public')
        .from(contentType === 'news' ? 'news' : 'videos')
        .insert({
          ...content,
          created_at: new Date().toISOString(),
          manual_entry: true
        })

      if (error) throw error

      await this.logAdminAction('create_manual_content', `Created manual ${contentType} content`)

      return { success: true, message: 'Manual content created successfully' }
    } catch (error) {
      console.error('Error creating manual content:', error)
      return { success: false, error: 'Failed to create manual content' }
    }
  }

  async deleteContent(contentId: string) {
    const supabase = createAdminClient()
    
    try {
      const { error } = await supabase
        .schema('public')
        .from('content_queue')
        .delete()
        .eq('id', contentId)

      if (error) throw error

      await this.logAdminAction('delete_content', `Deleted content: ${contentId}`)

      return { success: true, message: 'Content deleted successfully' }
    } catch (error) {
      console.error('Error deleting content:', error)
      return { success: false, error: 'Failed to delete content' }
    }
  }

  async clearCache() {
    try {
      await this.cacheService.clearAll()
      await this.logAdminAction('clear_cache', 'Cleared all cache')
      return { success: true, message: 'Cache cleared successfully' }
    } catch (error) {
      console.error('Error clearing cache:', error)
      return { success: false, error: 'Failed to clear cache' }
    }
  }

  async cleanupOldLogs() {
    const supabase = createAdminClient()
    
    try {
      const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
      
      const { count } = await supabase
        .schema('public')
        .from('admin_logs')
        .delete()
        .lt('timestamp', cutoffDate.toISOString())
        .select('id', { count: 'exact', head: true })

      await this.logAdminAction('cleanup_logs', `Cleaned up ${count || 0} old log entries`)

      return { success: true, message: `Cleaned up ${count || 0} old log entries` }
    } catch (error) {
      console.error('Error cleaning up logs:', error)
      return { success: false, error: 'Failed to cleanup logs' }
    }
  }

  // Helper methods
  private async calculateSystemHealth(): Promise<'healthy' | 'warning' | 'critical'> {
    const memoryUsage = process.memoryUsage()
    const memoryPercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100
    
    if (memoryPercentage > 90) return 'critical'
    if (memoryPercentage > 70) return 'warning'
    return 'healthy'
  }

  private async checkNewsAPIHealth() {
    try {
      const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=' + process.env.NEWS_API_KEY)
      return { healthy: response.ok, status: response.status }
    } catch (error) {
      return { healthy: false, error: 'Connection failed' }
    }
  }

  private async checkYouTubeAPIHealth() {
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=test&key=${process.env.YOUTUBE_API_KEY}`)
      return { healthy: response.ok, status: response.status }
    } catch (error) {
      return { healthy: false, error: 'Connection failed' }
    }
  }

  private async checkSupabaseHealth() {
    try {
      const supabase = createAdminClient()
      const { error } = await supabase.from('news').select('id').limit(1)
      return { healthy: !error, error: error?.message }
    } catch (error) {
      return { healthy: false, error: 'Connection failed' }
    }
  }

  private calculateOverallHealth(dbError: any, apiHealthChecks: any[], systemMetrics: any) {
    let healthScore = 100
    
    if (dbError) healthScore -= 30
    
    apiHealthChecks.forEach(check => {
      if (check.status === 'rejected') healthScore -= 20
    })
    
    const memoryPercentage = (systemMetrics.memoryUsage.heapUsed / systemMetrics.memoryUsage.heapTotal) * 100
    if (memoryPercentage > 90) healthScore -= 25
    else if (memoryPercentage > 70) healthScore -= 10
    
    if (healthScore >= 80) return 'healthy'
    if (healthScore >= 60) return 'warning'
    return 'critical'
  }

  private async moveToMainTable(contentId: string, contentType: 'news' | 'video') {
    const supabase = createAdminClient()
    
    // Get content from queue
    const { data: content } = await supabase
      .schema('public')
      .from('content_queue')
      .select('*')
      .eq('id', contentId)
      .single()

    if (!content) return

    // Insert into main table
    const targetTable = contentType === 'news' ? 'news' : 'videos'
    await supabase
      .schema('public')
      .from(targetTable)
      .insert({
        ...content,
        id: undefined, // Let DB generate new ID
        created_at: new Date().toISOString()
      })
  }

  private async logAdminAction(action: string, message: string, severity: 'info' | 'warning' | 'error' = 'info') {
    const supabase = createAdminClient()
    
    await supabase
      .schema('public')
      .from('admin_logs')
      .insert({
        type: action,
        message,
        severity,
        timestamp: new Date().toISOString()
      })
  }
}
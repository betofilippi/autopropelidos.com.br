import { createClient } from '@/lib/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'

// Define Analytics types locally
interface Analytics {
  id: string
  event_type: string
  user_id?: string
  session_id?: string
  page_url: string
  referrer?: string
  timestamp: string
  metadata?: any
}

interface AnalyticsInsert {
  event_type: string
  user_id?: string
  session_id?: string
  page_url: string
  referrer?: string
  metadata?: any
}

export type EventType = 
  | 'page_view'
  | 'news_click'
  | 'video_play'
  | 'search'
  | 'filter_apply'
  | 'download'
  | 'share'
  | 'question_create'
  | 'answer_create'
  | 'upvote'
  | 'user_signup'
  | 'newsletter_subscribe'
  | 'vehicle_view'
  | 'regulation_view'
  | 'external_link_click'

export interface AnalyticsEvent {
  event_type: EventType
  event_data?: Record<string, any>
  user_id?: string | null
  session_id: string
  page_url: string
}

export interface AnalyticsFilters {
  eventType?: EventType
  userId?: string
  sessionId?: string
  startDate?: string
  endDate?: string
  pageUrl?: string
  limit?: number
  offset?: number
}

export interface AnalyticsResponse {
  data: Analytics[]
  count: number
  error?: string
}

export interface AnalyticsSummary {
  totalEvents: number
  uniqueUsers: number
  uniqueSessions: number
  eventCounts: Record<EventType, number>
  topPages: Array<{ url: string; count: number }>
  averageEventsPerSession: number
}

export interface PageAnalytics {
  pageUrl: string
  views: number
  uniqueVisitors: number
  averageTimeOnPage?: number
  bounceRate?: number
  exitRate?: number
}

class AnalyticsService {
  private getClient(): SupabaseClient {
    if (typeof window === 'undefined') {
      try {
        return createClient()
      } catch {
        return createClient()
      }
    }
    return createClient()
  }

  private generateSessionId(): string {
    // Generate a unique session ID if not provided
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  async track(event: AnalyticsEvent): Promise<boolean> {
    try {
      const supabase = this.getClient()
      
      const analyticsData: AnalyticsInsert = {
        event_type: event.event_type,
        metadata: event.event_data || {},
        user_id: event.user_id || undefined,
        session_id: event.session_id || this.generateSessionId(),
        page_url: event.page_url,
      }

      const { error } = await supabase
        .from('analytics')
        .insert(analyticsData)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error tracking analytics event:', error)
      return false
    }
  }

  async trackPageView(pageUrl: string, userId?: string | null, sessionId?: string): Promise<boolean> {
    return this.track({
      event_type: 'page_view',
      page_url: pageUrl,
      user_id: userId,
      session_id: sessionId || this.generateSessionId(),
    })
  }

  async trackSearch(query: string, results: number, pageUrl: string, userId?: string | null): Promise<boolean> {
    return this.track({
      event_type: 'search',
      event_data: { query, results_count: results },
      page_url: pageUrl,
      user_id: userId,
      session_id: this.generateSessionId(),
    })
  }

  async trackClick(
    elementType: 'news' | 'video' | 'vehicle' | 'regulation' | 'external_link',
    elementId: string,
    pageUrl: string,
    userId?: string | null
  ): Promise<boolean> {
    const eventTypeMap = {
      news: 'news_click',
      video: 'video_play',
      vehicle: 'vehicle_view',
      regulation: 'regulation_view',
      external_link: 'external_link_click',
    }

    return this.track({
      event_type: eventTypeMap[elementType] as EventType,
      event_data: { element_id: elementId },
      page_url: pageUrl,
      user_id: userId,
      session_id: this.generateSessionId(),
    })
  }

  async getAll(filters?: AnalyticsFilters): Promise<AnalyticsResponse> {
    try {
      const supabase = this.getClient()
      let query = supabase.from('analytics').select('*', { count: 'exact' })

      // Apply filters
      if (filters?.eventType) {
        query = query.eq('event_type', filters.eventType)
      }
      if (filters?.userId) {
        query = query.eq('user_id', filters.userId)
      }
      if (filters?.sessionId) {
        query = query.eq('session_id', filters.sessionId)
      }
      if (filters?.pageUrl) {
        query = query.eq('page_url', filters.pageUrl)
      }
      if (filters?.startDate) {
        query = query.gte('created_at', filters.startDate)
      }
      if (filters?.endDate) {
        query = query.lte('created_at', filters.endDate)
      }

      // Apply ordering
      query = query.order('created_at', { ascending: false })

      // Apply pagination
      const limit = filters?.limit || 100
      const offset = filters?.offset || 0
      query = query.range(offset, offset + limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      return {
        data: data || [],
        count: count || 0,
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Failed to fetch analytics',
      }
    }
  }

  async getSummary(startDate?: string, endDate?: string): Promise<AnalyticsSummary | null> {
    try {
      const supabase = this.getClient()
      let query = supabase.from('analytics').select('*')

      if (startDate) {
        query = query.gte('created_at', startDate)
      }
      if (endDate) {
        query = query.lte('created_at', endDate)
      }

      const { data, error } = await query

      if (error) throw error
      if (!data || data.length === 0) return null

      // Calculate summary statistics
      const uniqueUsers = new Set(data.filter(e => e.user_id).map(e => e.user_id))
      const uniqueSessions = new Set(data.map(e => e.session_id))
      
      const eventCounts: Record<string, number> = {}
      const pageViews: Record<string, number> = {}

      data.forEach(event => {
        // Count events by type
        eventCounts[event.event_type] = (eventCounts[event.event_type] || 0) + 1

        // Count page views
        if (event.event_type === 'page_view') {
          pageViews[event.page_url] = (pageViews[event.page_url] || 0) + 1
        }
      })

      // Get top pages
      const topPages = Object.entries(pageViews)
        .map(([url, count]) => ({ url, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      return {
        totalEvents: data.length,
        uniqueUsers: uniqueUsers.size,
        uniqueSessions: uniqueSessions.size,
        eventCounts: eventCounts as Record<EventType, number>,
        topPages,
        averageEventsPerSession: data.length / uniqueSessions.size,
      }
    } catch (error) {
      console.error('Error calculating analytics summary:', error)
      return null
    }
  }

  async getPageAnalytics(pageUrl: string, startDate?: string, endDate?: string): Promise<PageAnalytics | null> {
    try {
      const supabase = this.getClient()
      let query = supabase
        .from('analytics')
        .select('*')
        .eq('page_url', pageUrl)

      if (startDate) {
        query = query.gte('created_at', startDate)
      }
      if (endDate) {
        query = query.lte('created_at', endDate)
      }

      const { data, error } = await query

      if (error) throw error
      if (!data || data.length === 0) return null

      const pageViews = data.filter(e => e.event_type === 'page_view')
      const uniqueVisitors = new Set(pageViews.filter(e => e.user_id).map(e => e.user_id))

      return {
        pageUrl,
        views: pageViews.length,
        uniqueVisitors: uniqueVisitors.size,
      }
    } catch (error) {
      console.error('Error fetching page analytics:', error)
      return null
    }
  }

  async getUserActivity(userId: string, limit = 100): Promise<Analytics[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching user activity:', error)
      return []
    }
  }

  async getSessionActivity(sessionId: string): Promise<Analytics[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching session activity:', error)
      return []
    }
  }

  async getPopularContent(
    contentType: 'news' | 'video' | 'vehicle' | 'regulation',
    days = 7,
    limit = 10
  ): Promise<Array<{ id: string; count: number }>> {
    try {
      const supabase = this.getClient()
      const dateLimit = new Date()
      dateLimit.setDate(dateLimit.getDate() - days)

      const eventTypeMap = {
        news: 'news_click',
        video: 'video_play',
        vehicle: 'vehicle_view',
        regulation: 'regulation_view',
      }

      const { data, error } = await supabase
        .from('analytics')
        .select('event_data')
        .eq('event_type', eventTypeMap[contentType])
        .gte('created_at', dateLimit.toISOString())

      if (error) throw error
      if (!data) return []

      // Count occurrences of each content ID
      const contentCounts: Record<string, number> = {}
      data.forEach(event => {
        const elementId = (event.event_data as any)?.element_id
        if (elementId) {
          contentCounts[elementId] = (contentCounts[elementId] || 0) + 1
        }
      })

      // Sort by count and return top items
      return Object.entries(contentCounts)
        .map(([id, count]) => ({ id, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
    } catch (error) {
      console.error('Error fetching popular content:', error)
      return []
    }
  }

  async getSearchTerms(days = 7, limit = 20): Promise<Array<{ query: string; count: number }>> {
    try {
      const supabase = this.getClient()
      const dateLimit = new Date()
      dateLimit.setDate(dateLimit.getDate() - days)

      const { data, error } = await supabase
        .from('analytics')
        .select('event_data')
        .eq('event_type', 'search')
        .gte('created_at', dateLimit.toISOString())

      if (error) throw error
      if (!data) return []

      // Count search queries
      const queryCounts: Record<string, number> = {}
      data.forEach(event => {
        const query = (event.event_data as any)?.query
        if (query) {
          queryCounts[query.toLowerCase()] = (queryCounts[query.toLowerCase()] || 0) + 1
        }
      })

      // Sort by count and return top queries
      return Object.entries(queryCounts)
        .map(([query, count]) => ({ query, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
    } catch (error) {
      console.error('Error fetching search terms:', error)
      return []
    }
  }

  async cleanup(daysToKeep = 90): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

      const { error } = await supabase
        .from('analytics')
        .delete()
        .lt('created_at', cutoffDate.toISOString())

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error cleaning up old analytics:', error)
      return false
    }
  }
}

export const analyticsService = new AnalyticsService()
import { createClient } from '@/lib/supabase/client'
import { NewsItem } from '@/lib/types'
import type { SupabaseClient } from '@supabase/supabase-js'

// Type aliases for consistency
type News = NewsItem
type NewsInsert = Omit<NewsItem, 'id' | 'created_at'>
type NewsUpdate = Partial<NewsInsert>

export interface NewsFilters {
  category?: News['category']
  source?: string
  tags?: string[]
  searchQuery?: string
  startDate?: string
  endDate?: string
  limit?: number
  offset?: number
}

export interface NewsResponse {
  data: News[]
  count: number
  error?: string
}

class NewsService {
  private getClient() {
    // Use server client if available (server-side), otherwise use browser client
    if (typeof window === 'undefined') {
      try {
        return createClient()
      } catch {
        return createClient()
      }
    }
    return createClient()
  }

  async getAll(filters?: NewsFilters): Promise<NewsResponse> {
    try {
      const supabase = this.getClient()
      let query = supabase.from('news').select('*', { count: 'exact' })

      // Apply filters
      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      if (filters?.source) {
        query = query.eq('source', filters.source)
      }
      if (filters?.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags)
      }
      if (filters?.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%,content.ilike.%${filters.searchQuery}%`)
      }
      if (filters?.startDate) {
        query = query.gte('published_at', filters.startDate)
      }
      if (filters?.endDate) {
        query = query.lte('published_at', filters.endDate)
      }

      // Apply ordering
      query = query.order('published_at', { ascending: false })

      // Apply pagination
      const limit = filters?.limit || 10
      const offset = filters?.offset || 0
      query = query.range(offset, offset + limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      return {
        data: data || [],
        count: count || 0,
      }
    } catch (error) {
      console.error('Error fetching news:', error)
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Failed to fetch news',
      }
    }
  }

  async getById(id: string): Promise<News | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching news by id:', error)
      return null
    }
  }

  async getByUrl(url: string): Promise<News | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('url', url)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 is "no rows returned"
      return data
    } catch (error) {
      console.error('Error fetching news by url:', error)
      return null
    }
  }

  async create(news: NewsInsert): Promise<News | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('news')
        .insert(news)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating news:', error)
      return null
    }
  }

  async update(id: string, updates: NewsUpdate): Promise<News | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('news')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating news:', error)
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting news:', error)
      return false
    }
  }

  async search(query: string, limit = 10): Promise<News[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`)
        .order('published_at', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching news:', error)
      return []
    }
  }

  async getRelated(newsId: string, limit = 5): Promise<News[]> {
    try {
      const supabase = this.getClient()
      
      // First get the current news item
      const currentNews = await this.getById(newsId)
      if (!currentNews) return []

      // Find related news by category and tags
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .neq('id', newsId)
        .eq('category', currentNews.category)
        .order('published_at', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching related news:', error)
      return []
    }
  }

  async getTrending(days = 7, limit = 10): Promise<News[]> {
    try {
      const supabase = this.getClient()
      const dateLimit = new Date()
      dateLimit.setDate(dateLimit.getDate() - days)

      const { data, error } = await supabase
        .from('news')
        .select('*')
        .gte('published_at', dateLimit.toISOString())
        .order('published_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching trending news:', error)
      return []
    }
  }

  async getSources(): Promise<string[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('news')
        .select('source')
        .order('source')

      if (error) throw error
      
      // Extract unique sources
      const sources = new Set(data?.map(item => item.source) || [])
      return Array.from(sources)
    } catch (error) {
      console.error('Error fetching news sources:', error)
      return []
    }
  }

  async incrementRelevanceScore(id: string, increment = 1): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const news = await this.getById(id)
      if (!news) return false

      const { error } = await supabase
        .from('news')
        .update({ updated_at: new Date().toISOString() } as any)
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error incrementing relevance score:', error)
      return false
    }
  }
}

export const newsService = new NewsService()
import { createClient } from '@/lib/supabase/client'
import { Video } from '@/lib/types'

// Type aliases for consistency
type VideoInsert = Omit<Video, 'id' | 'created_at'>
type VideoUpdate = Partial<VideoInsert>

import type { SupabaseClient } from '@supabase/supabase-js'

export interface VideoFilters {
  category?: string
  channelId?: string
  tags?: string[]
  searchQuery?: string
  startDate?: string
  endDate?: string
  minViews?: number
  limit?: number
  offset?: number
}

export interface VideoResponse {
  data: Video[]
  count: number
  error?: string
}

class VideoService {
  private getClient() {
    if (typeof window === 'undefined') {
      try {
        return createClient()
      } catch {
        return createClient()
      }
    }
    return createClient()
  }

  async getAll(filters?: VideoFilters): Promise<VideoResponse> {
    try {
      const supabase = this.getClient()
      let query = supabase.from('videos').select('*', { count: 'exact' })

      // Apply filters
      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      if (filters?.channelId) {
        query = query.eq('channel_id', filters.channelId)
      }
      if (filters?.tags && filters.tags.length > 0) {
        query = query.contains('tags', filters.tags)
      }
      if (filters?.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%,transcript.ilike.%${filters.searchQuery}%`)
      }
      if (filters?.startDate) {
        query = query.gte('published_at', filters.startDate)
      }
      if (filters?.endDate) {
        query = query.lte('published_at', filters.endDate)
      }
      if (filters?.minViews) {
        query = query.gte('view_count', filters.minViews)
      }

      // Apply ordering
      query = query.order('published_at', { ascending: false })

      // Apply pagination
      const limit = filters?.limit || 12
      const offset = filters?.offset || 0
      query = query.range(offset, offset + limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      return {
        data: data || [],
        count: count || 0,
      }
    } catch (error) {
      console.error('Error fetching videos:', error)
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Failed to fetch videos',
      }
    }
  }

  async getById(id: string): Promise<Video | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching video by id:', error)
      return null
    }
  }

  async getByYoutubeId(youtubeId: string): Promise<Video | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('youtube_id', youtubeId)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return data
    } catch (error) {
      console.error('Error fetching video by YouTube ID:', error)
      return null
    }
  }

  async create(video: VideoInsert): Promise<Video | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('videos')
        .insert(video)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating video:', error)
      return null
    }
  }

  async update(id: string, updates: VideoUpdate): Promise<Video | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('videos')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating video:', error)
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting video:', error)
      return false
    }
  }

  async search(query: string, limit = 12): Promise<Video[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,transcript.ilike.%${query}%,channel_name.ilike.%${query}%`)
        .order('published_at', { ascending: false })
        .order('view_count', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching videos:', error)
      return []
    }
  }

  async getRelated(videoId: string, limit = 6): Promise<Video[]> {
    try {
      const supabase = this.getClient()
      
      // First get the current video
      const currentVideo = await this.getById(videoId)
      if (!currentVideo) return []

      // Find related videos by category, tags, and channel
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .neq('id', videoId)
        .eq('channel_id', currentVideo.channel_id)
        .order('published_at', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching related videos:', error)
      return []
    }
  }

  async getTrending(days = 7, limit = 12): Promise<Video[]> {
    try {
      const supabase = this.getClient()
      const dateLimit = new Date()
      dateLimit.setDate(dateLimit.getDate() - days)

      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .gte('published_at', dateLimit.toISOString())
        .order('view_count', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching trending videos:', error)
      return []
    }
  }

  async getByChannel(channelId: string, limit = 20): Promise<Video[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('channel_id', channelId)
        .order('published_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching videos by channel:', error)
      return []
    }
  }

  async getChannels(): Promise<Array<{ channel_id: string; channel_name: string; video_count: number }>> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('videos')
        .select('channel_id, channel_name')

      if (error) throw error
      
      // Count videos per channel
      const channelMap = new Map<string, { name: string; count: number }>()
      data?.forEach(video => {
        const existing = channelMap.get(video.channel_id)
        if (existing) {
          existing.count++
        } else {
          channelMap.set(video.channel_id, { name: video.channel_name, count: 1 })
        }
      })

      return Array.from(channelMap.entries())
        .map(([id, { name, count }]) => ({
          channel_id: id,
          channel_name: name,
          video_count: count,
        }))
        .sort((a, b) => b.video_count - a.video_count)
    } catch (error) {
      console.error('Error fetching channels:', error)
      return []
    }
  }

  async updateViewCount(id: string, viewCount: number): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const { error } = await supabase
        .from('videos')
        .update({ view_count: viewCount })
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating view count:', error)
      return false
    }
  }

  async incrementRelevanceScore(id: string, increment = 1): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const video = await this.getById(id)
      if (!video) return false

      const { error } = await supabase
        .from('videos')
        .update({ updated_at: new Date().toISOString() } as any)
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error incrementing relevance score:', error)
      return false
    }
  }

  async getEducationalContent(limit = 20): Promise<Video[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .in('category', ['educational', 'tutorial'])
        .order('published_at', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching educational content:', error)
      return []
    }
  }
}

export const videoService = new VideoService()
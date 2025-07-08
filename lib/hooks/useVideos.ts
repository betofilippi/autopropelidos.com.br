'use client'

import { useState, useEffect, useCallback } from 'react'
// import { VideoData } from '@/lib/types/services'

interface VideoData {
  id: string
  title: string
  description: string
  url: string
  thumbnail_url: string
  channel: string
  published_at: string
  duration: number
  views: number
  likes: number
  category: string
  tags: string[]
  relevance_score: number
}

interface UseVideosOptions {
  category?: string
  limit?: number
  autoRefresh?: boolean
  refreshInterval?: number
}

interface UseVideosReturn {
  videos: VideoData[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  lastUpdated: Date | null
}

export function useVideos(options: UseVideosOptions = {}): UseVideosReturn {
  const {
    category = 'all',
    limit = 10,
    autoRefresh = false,
    refreshInterval = 10 * 60 * 1000 // 10 minutes
  } = options

  const [videos, setVideos] = useState<VideoData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        limit: limit.toString(),
        category
      })

      const response = await fetch(`/api/sync/videos?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setVideos(result.data)
        setLastUpdated(new Date())
      } else {
        throw new Error(result.error || 'Failed to fetch videos')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [category, limit])

  const refresh = useCallback(async () => {
    await fetchVideos()
  }, [fetchVideos])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(fetchVideos, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, fetchVideos])

  return {
    videos,
    loading,
    error,
    refresh,
    lastUpdated
  }
}
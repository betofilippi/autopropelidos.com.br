'use client'

import { useState, useEffect, useCallback } from 'react'
import { NewsItem } from '@/lib/types/services'

interface UseNewsOptions {
  category?: string
  limit?: number
  autoRefresh?: boolean
  refreshInterval?: number
}

interface UseNewsReturn {
  news: NewsItem[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  lastUpdated: Date | null
}

export function useNews(options: UseNewsOptions = {}): UseNewsReturn {
  const {
    category = 'all',
    limit = 10,
    autoRefresh = false,
    refreshInterval = 5 * 60 * 1000 // 5 minutes
  } = options

  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        limit: limit.toString(),
        category
      })

      const response = await fetch(`/api/sync/news?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        setNews(result.data)
        setLastUpdated(new Date())
      } else {
        throw new Error(result.error || 'Failed to fetch news')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [category, limit])

  const refresh = useCallback(async () => {
    await fetchNews()
  }, [fetchNews])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(fetchNews, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, fetchNews])

  return {
    news,
    loading,
    error,
    refresh,
    lastUpdated
  }
}
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Eye, ExternalLink } from "lucide-react"
import { SkeletonVideo } from '@/components/ui/skeletons'
import { cn } from '@/lib/utils'

const categoryColors = {
  educational: 'bg-green-100 text-green-800 border-green-200',
  tutorial: 'bg-blue-100 text-blue-800 border-blue-200',
  review: 'bg-purple-100 text-purple-800 border-purple-200',
  news_report: 'bg-red-100 text-red-800 border-red-200',
  analysis: 'bg-orange-100 text-orange-800 border-orange-200'
}

const categoryLabels = {
  educational: 'Educativo',
  tutorial: 'Tutorial',
  review: 'Review',
  news_report: 'Reportagem',
  analysis: 'Análise'
}

function formatDuration(duration: string) {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return duration
  
  const hours = parseInt(match[1] || '0')
  const minutes = parseInt(match[2] || '0')
  const seconds = parseInt(match[3] || '0')
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

function formatViewCount(count: number) {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}

function formatPublishedDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'há 1 dia'
  if (diffDays < 7) return `há ${diffDays} dias`
  if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semanas`
  if (diffDays < 365) return `há ${Math.floor(diffDays / 30)} meses`
  return `há ${Math.floor(diffDays / 365)} anos`
}

interface Video {
  id: string
  youtube_id: string
  title: string
  description: string
  channel_name: string
  channel_id: string
  thumbnail_url: string
  duration: string
  view_count: number
  like_count: number
  comment_count: number
  published_at: string
  category: string
  relevance_score: number
}

interface VideosContentProps {
  initialVideos: Video[]
}

export function VideosContent({ initialVideos }: VideosContentProps) {
  const [videos, setVideos] = useState(initialVideos)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [thumbnailsLoaded, setThumbnailsLoaded] = useState<Record<string, boolean>>({})

  const handleThumbnailLoad = (id: string) => {
    setThumbnailsLoaded(prev => ({ ...prev, [id]: true }))
  }

  const handleThumbnailError = (id: string) => {
    setThumbnailsLoaded(prev => ({ ...prev, [id]: true }))
  }

  const loadMoreVideos = async () => {
    setLoadingMore(true)
    try {
      const response = await fetch(`/api/videos?limit=8&offset=${videos.length}`)
      const result = await response.json()
      
      if (result.success) {
        setVideos(prev => [...prev, ...result.data])
      }
    } catch (error) {
      console.error('Error loading more videos:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <>
      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          // Show skeletons while loading
          Array.from({ length: 8 }).map((_, i) => (
            <SkeletonVideo key={i} />
          ))
        ) : (
          videos.map((video) => (
            <Card 
              key={video.id} 
              className="group hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500"
            >
              <Link 
                href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block focus:outline-none"
                aria-label={`Assistir vídeo: ${video.title}`}
              >
                <div className="relative">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
                    {!thumbnailsLoaded[video.id] && (
                      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    )}
                    <img
                      src={video.thumbnail_url || 'https://via.placeholder.com/480x360/e5e7eb/9ca3af?text=Video+Thumbnail'}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      loading="lazy"
                      onLoad={() => {
                        console.log('Video thumbnail loaded:', video.thumbnail_url)
                        handleThumbnailLoad(video.id)
                      }}
                      onError={(e) => {
                        console.log('Video thumbnail error:', video.thumbnail_url)
                        e.currentTarget.src = 'https://via.placeholder.com/480x360/e5e7eb/9ca3af?text=Video+Thumbnail'
                        handleThumbnailError(video.id)
                      }}
                    />
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                      <div className="bg-red-600 rounded-full p-3 transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                        <Play className="h-6 w-6 text-white fill-current" />
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatDuration(video.duration)}
                    </div>

                    {/* External link indicator */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg">
                        <ExternalLink className="h-3.5 w-3.5 text-gray-700 dark:text-gray-300" />
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    {/* Category Badge */}
                    <Badge 
                      variant="outline" 
                      className={`${categoryColors[video.category as keyof typeof categoryColors]} mb-2`}
                    >
                      {categoryLabels[video.category as keyof typeof categoryLabels]}
                    </Badge>

                    {/* Title */}
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {video.title}
                    </h3>

                    {/* Channel */}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
                      {video.channel_name}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        <span className="sr-only">Visualizações:</span>
                        {formatViewCount(video.view_count)}
                      </div>
                      <div>
                        {formatPublishedDate(video.published_at)}
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Link>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <Button 
          variant="outline" 
          size="lg"
          onClick={loadMoreVideos}
          disabled={loadingMore}
          className="min-w-[200px]"
          aria-label="Carregar mais vídeos"
        >
          {loadingMore ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Carregando...
            </div>
          ) : (
            'Carregar mais vídeos'
          )}
        </Button>
      </div>
    </>
  )
}
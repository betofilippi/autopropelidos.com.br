'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, ExternalLink, TrendingUp } from "lucide-react"
import Link from 'next/link'
import { SkeletonNews } from '@/components/ui/skeletons'
import { cn } from '@/lib/utils'

const categoryColors = {
  regulation: 'bg-blue-100 text-blue-800 border-blue-200',
  safety: 'bg-red-100 text-red-800 border-red-200',
  technology: 'bg-purple-100 text-purple-800 border-purple-200',
  urban_mobility: 'bg-green-100 text-green-800 border-green-200',
  general: 'bg-gray-100 text-gray-800 border-gray-200'
}

const categoryLabels = {
  regulation: 'Regulamentação',
  safety: 'Segurança',
  technology: 'Tecnologia',
  urban_mobility: 'Mobilidade Urbana',
  general: 'Geral'
}

function formatPublishedDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffHours < 24) return `há ${diffHours}h`
  if (diffDays === 1) return 'há 1 dia'
  if (diffDays < 7) return `há ${diffDays} dias`
  if (diffDays < 30) return `há ${Math.floor(diffDays / 7)} semanas`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function getRelevanceLevel(score: number) {
  if (score >= 90) return { label: 'Alta Relevância', color: 'text-red-600' }
  if (score >= 70) return { label: 'Relevante', color: 'text-orange-600' }
  return { label: 'Normal', color: 'text-gray-600' }
}

interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  source: string
  published_at: string
  category: string
  relevance_score: number
  image_url?: string
}

interface NewsContentProps {
  initialNews: NewsItem[]
}

export function NewsContent({ initialNews }: NewsContentProps) {
  const [news, setNews] = useState(initialNews)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({})

  const highlightedNews = news.filter(item => item.relevance_score >= 85).slice(0, 3)
  const regularNews = news.filter(item => item.relevance_score < 85)

  const handleImageLoad = (id: string) => {
    setImageLoading(prev => ({ ...prev, [id]: false }))
  }

  const handleImageError = (id: string) => {
    setImageLoading(prev => ({ ...prev, [id]: false }))
  }

  const loadMoreNews = async () => {
    setLoadingMore(true)
    try {
      const response = await fetch(`/api/news?limit=6&offset=${news.length}`)
      const result = await response.json()
      
      if (result.success) {
        setNews(prev => [...prev, ...result.data])
      }
    } catch (error) {
      console.error('Error loading more news:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <>
      {/* Highlighted News */}
      {highlightedNews.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-5 w-5 text-red-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Notícias em Destaque
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {highlightedNews.map((item, index) => (
              <Card 
                key={item.id} 
                className={cn(
                  "hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1",
                  index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                )}
              >
                <div className="relative">
                  {item.image_url && (
                    <div className={cn(
                      "relative bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-t-lg",
                      index === 0 ? 'aspect-video' : 'aspect-[4/3]'
                    )}>
                      {imageLoading[item.id] !== false && (
                        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                      )}
                      <img
                        src={item.image_url || 'https://placehold.co/400x300/e5e7eb/9ca3af?text=Sem+Imagem'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onLoad={() => {
                          console.log('News image loaded:', item.image_url)
                          handleImageLoad(item.id)
                        }}
                        onError={(e) => {
                          console.log('News image error:', item.image_url)
                          e.currentTarget.src = 'https://placehold.co/400x300/e5e7eb/9ca3af?text=Sem+Imagem'
                          handleImageError(item.id)
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge 
                          variant="outline" 
                          className={`${categoryColors[item.category as keyof typeof categoryColors]} bg-white`}
                        >
                          {categoryLabels[item.category as keyof typeof categoryLabels]}
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                        {item.source}
                      </span>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatPublishedDate(item.published_at)}
                      </div>
                    </div>
                    
                    <h3 className={cn(
                      "font-bold mb-3 hover:text-blue-600 transition-colors",
                      index === 0 ? 'text-xl' : 'text-lg'
                    )}>
                      <Link href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </Link>
                    </h3>
                    
                    <p className={cn(
                      "text-gray-600 dark:text-gray-400 mb-4",
                      index === 0 ? 'text-base' : 'text-sm'
                    )}>
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className={`text-xs ${getRelevanceLevel(item.relevance_score).color}`}>
                        {getRelevanceLevel(item.relevance_score).label}
                      </div>
                      <Link
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors group"
                      >
                        Ler mais
                        <ExternalLink className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular News Grid */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Todas as Notícias
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Show skeletons while loading
          Array.from({ length: 6 }).map((_, i) => (
            <SkeletonNews key={i} />
          ))
        ) : (
          regularNews.map((item) => (
            <Card 
              key={item.id} 
              className="hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
            >
              <div className="relative">
                {item.image_url && (
                  <div className="relative aspect-[4/3] bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-t-lg">
                    {imageLoading[item.id] !== false && (
                      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    )}
                    <img
                      src={item.image_url || 'https://placehold.co/400x300/e5e7eb/9ca3af?text=Sem+Imagem'}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onLoad={() => {
                        console.log('News image loaded:', item.image_url)
                        handleImageLoad(item.id)
                      }}
                      onError={(e) => {
                        console.log('News image error:', item.image_url)
                        e.currentTarget.src = 'https://placehold.co/400x300/e5e7eb/9ca3af?text=Sem+Imagem'
                        handleImageError(item.id)
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <Badge 
                        variant="outline" 
                        className={`${categoryColors[item.category as keyof typeof categoryColors]} bg-white`}
                      >
                        {categoryLabels[item.category as keyof typeof categoryLabels]}
                      </Badge>
                    </div>
                  </div>
                )}
                
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                      {item.source}
                    </span>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatPublishedDate(item.published_at)}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2 hover:text-blue-600 transition-colors">
                    <Link href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </Link>
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className={`text-xs ${getRelevanceLevel(item.relevance_score).color}`}>
                      {getRelevanceLevel(item.relevance_score).label}
                    </div>
                    <Link
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors group"
                    >
                      Ler mais
                      <ExternalLink className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      <div className="text-center mt-12">
        <Button 
          variant="outline" 
          size="lg"
          onClick={loadMoreNews}
          disabled={loadingMore}
          className="min-w-[200px]"
        >
          {loadingMore ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Carregando...
            </div>
          ) : (
            'Carregar mais notícias'
          )}
        </Button>
      </div>
    </>
  )
}
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, ExternalLink, RefreshCw, AlertCircle } from "lucide-react"
import { useNews } from '@/lib/hooks/useNews'
import { ImageWithFallback } from '@/components/ui/image-with-fallback'
import Link from "next/link"

const categoryColors = {
  regulation: 'bg-slate-100 text-slate-700 border-slate-300',
  safety: 'bg-amber-100 text-amber-700 border-amber-300', 
  technology: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  urban_mobility: 'bg-blue-100 text-blue-700 border-blue-300',
  general: 'bg-zinc-100 text-zinc-700 border-zinc-300'
}

const categoryLabels = {
  regulation: 'Regulamentação',
  safety: 'Segurança',
  technology: 'Tecnologia', 
  urban_mobility: 'Mobilidade Urbana',
  general: 'Geral'
}

interface LiveNewsProps {
  category?: string
  limit?: number
  autoRefresh?: boolean
  showRefreshButton?: boolean
  title?: string
}

export function LiveNews({ 
  category = 'all', 
  limit = 6, 
  autoRefresh = true,
  showRefreshButton = true,
  title = "Últimas Notícias"
}: LiveNewsProps) {
  const { news, loading, error, refresh, lastUpdated } = useNews({
    category,
    limit,
    autoRefresh,
    refreshInterval: 5 * 60 * 1000 // 5 minutes
  })

  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await refresh()
    setRefreshing(false)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span>Erro ao carregar notícias: {error}</span>
          </div>
          <Button 
            onClick={handleRefresh}
            variant="outline" 
            size="sm" 
            className="mt-4"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Atualizado: {formatDate(lastUpdated.toISOString())}</span>
            </div>
          )}
          {showRefreshButton && (
            <Button 
              onClick={handleRefresh}
              variant="outline" 
              size="sm"
              disabled={refreshing || loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Atualizando...' : 'Atualizar'}
            </Button>
          )}
        </div>
      </div>

      {loading && news.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article) => (
            <Card key={article.id} className="group hover:shadow-lg transition-shadow duration-200">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <ImageWithFallback
                  src={article.image_url || '/placeholder-news.svg'}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fallbackSrc="/placeholder-news.svg"
                />
                <div className="absolute top-2 left-2">
                  <Badge 
                    variant="secondary" 
                    className={categoryColors[article.category as keyof typeof categoryColors]}
                  >
                    {categoryLabels[article.category as keyof typeof categoryLabels]}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {article.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{article.source}</span>
                  <span>{formatDate(article.published_at)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      Relevância: {article.relevance_score}%
                    </span>
                  </div>
                  <Link href={article.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Ler mais
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {news.length === 0 && !loading && (
        <Card className="border-dashed border-gray-300">
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Nenhuma notícia encontrada para esta categoria.</p>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
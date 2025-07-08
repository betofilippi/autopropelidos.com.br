'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LiveNews } from '@/components/dynamic/live-news'
import { useVideos } from '@/lib/hooks/useVideos'
import { ImageWithFallback } from '@/components/ui/image-with-fallback'
import { Play, ExternalLink, RefreshCw, Clock } from 'lucide-react'
import Link from 'next/link'

const categoryOptions = [
  { value: 'all', label: 'Todas' },
  { value: 'regulation', label: 'Regulamentação' },
  { value: 'safety', label: 'Segurança' },
  { value: 'technology', label: 'Tecnologia' },
  { value: 'urban_mobility', label: 'Mobilidade Urbana' }
]

function LiveVideos({ category = 'all', limit = 6 }: { category?: string; limit?: number }) {
  const { videos, loading, error, refresh, lastUpdated } = useVideos({
    category,
    limit,
    autoRefresh: true,
    refreshInterval: 10 * 60 * 1000 // 10 minutes
  })

  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    await refresh()
    setRefreshing(false)
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 text-red-600">
            <span>Erro ao carregar vídeos: {error}</span>
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
        <h2 className="text-2xl font-bold text-gray-900">Vídeos Recentes</h2>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              <span>Atualizado: {formatDate(lastUpdated.toISOString())}</span>
            </div>
          )}
          <Button 
            onClick={handleRefresh}
            variant="outline" 
            size="sm"
            disabled={refreshing || loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </Button>
        </div>
      </div>

      {loading && videos.length === 0 ? (
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
          {videos.map((video) => (
            <Card key={video.id} className="group hover:shadow-lg transition-shadow duration-200">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <ImageWithFallback
                  src={video.thumbnail_url || '/placeholder-video.svg'}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  fallbackSrc="/placeholder-video.svg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 flex items-center justify-center">
                  <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
                <div className="absolute bottom-2 right-2">
                  <Badge variant="secondary" className="bg-black bg-opacity-75 text-white">
                    {formatDuration(video.duration)}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {video.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {video.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{video.channel}</span>
                  <span>{formatDate(video.published_at)}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{video.views.toLocaleString('pt-BR')} visualizações</span>
                    <span>{video.likes.toLocaleString('pt-BR')} likes</span>
                  </div>
                  <Link href={video.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Assistir
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {videos.length === 0 && !loading && (
        <Card className="border-dashed border-gray-300">
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">Nenhum vídeo encontrado para esta categoria.</p>
          </CardContent>
        </Card>
      )}
    </section>
  )
}

export default function NoticiasDignamasPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Conteúdo Dinâmico
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Acompanhe as últimas notícias e vídeos sobre equipamentos autopropelidos 
            em tempo real, atualizados automaticamente via API.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Filtros de Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="news" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="news">Notícias ao Vivo</TabsTrigger>
            <TabsTrigger value="videos">Vídeos ao Vivo</TabsTrigger>
          </TabsList>
          
          <TabsContent value="news" className="space-y-6">
            <LiveNews 
              category={selectedCategory}
              limit={9}
              autoRefresh={true}
              showRefreshButton={true}
              title="Notícias Atualizadas Automaticamente"
            />
          </TabsContent>
          
          <TabsContent value="videos" className="space-y-6">
            <LiveVideos 
              category={selectedCategory}
              limit={9}
            />
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="text-center text-sm text-gray-500 space-y-2">
              <p>
                <strong>Atualização Automática:</strong> As notícias são atualizadas a cada 5 minutos 
                e os vídeos a cada 10 minutos.
              </p>
              <p>
                <strong>Fontes:</strong> Dados simulados para demonstração. 
                Em produção, conecte com APIs reais de notícias e YouTube.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
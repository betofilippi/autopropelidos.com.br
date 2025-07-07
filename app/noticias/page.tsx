import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar, ExternalLink, TrendingUp } from "lucide-react"
import { getLatestNews } from '@/lib/services/news'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamic import for mobile components (client-side only)
const MobileNewsPageClient = dynamic(() => import('@/components/mobile/mobile-news-page-client'), {
  loading: () => <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Carregando notícias...</p>
    </div>
  </div>
})

export const metadata: Metadata = {
  title: 'Notícias sobre Equipamentos Autopropelidos | Portal Autopropelidos',
  description: 'Acompanhe as últimas notícias sobre patinetes elétricos, bicicletas elétricas e regulamentações do CONTRAN.',
  keywords: 'notícias, patinete elétrico, bicicleta elétrica, CONTRAN 996, autopropelidos, regulamentação'
}

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

export default async function NoticiasPage() {
  const news = await getLatestNews('all', 50)
  const highlightedNews = news.filter(item => item.relevance_score >= 85).slice(0, 3)
  const regularNews = news.filter(item => item.relevance_score < 85)

  // Transform news data for mobile component
  const transformedNews = news.map(item => ({
    id: item.id,
    title: item.title,
    description: item.description,
    image_url: item.image_url,
    source: item.source,
    category: item.category,
    published_at: item.published_at,
    url: item.url,
    relevance_score: item.relevance_score,
    views: Math.floor(Math.random() * 1000) + 100,
    likes: Math.floor(Math.random() * 50) + 5,
    comments: Math.floor(Math.random() * 20) + 1,
    reading_time: Math.floor(Math.random() * 8) + 2,
    tags: ['mobilidade', 'regulamentação', 'segurança', 'tecnologia'].slice(0, Math.floor(Math.random() * 3) + 1)
  }))

  const loadMoreNews = async () => {
    'use server'
    // In a real app, this would fetch more news from the API
    const moreNews = await getLatestNews('all', 20)
    return moreNews.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      source: item.source,
      category: item.category,
      published_at: item.published_at,
      url: item.url,
      relevance_score: item.relevance_score,
      views: Math.floor(Math.random() * 1000) + 100,
      likes: Math.floor(Math.random() * 50) + 5,
      comments: Math.floor(Math.random() * 20) + 1,
      reading_time: Math.floor(Math.random() * 8) + 2,
      tags: ['mobilidade', 'regulamentação', 'segurança', 'tecnologia'].slice(0, Math.floor(Math.random() * 3) + 1)
    }))
  }

  return (
    <>
      {/* Mobile-first experience */}
      <div className="block lg:hidden">
        <MobileNewsPageClient
          initialNews={transformedNews}
          onLoadMore={loadMoreNews}
          hasMore={true}
          loading={false}
        />
      </div>

      {/* Desktop experience */}
      <div className="hidden lg:block min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Notícias sobre Equipamentos Autopropelidos
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Fique atualizado com as últimas notícias, regulamentações e desenvolvimentos 
                no mundo da micromobilidade urbana
              </p>
            </div>
          </div>
        </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar notícias..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  <SelectItem value="regulation">Regulamentação</SelectItem>
                  <SelectItem value="safety">Segurança</SelectItem>
                  <SelectItem value="technology">Tecnologia</SelectItem>
                  <SelectItem value="urban_mobility">Mobilidade Urbana</SelectItem>
                  <SelectItem value="general">Geral</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="recent">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="relevant">Mais relevantes</SelectItem>
                  <SelectItem value="source">Por fonte</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

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
                <Card key={item.id} className={`hover:shadow-lg transition-shadow duration-200 ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}>
                  <div className="relative">
                    {item.image_url && (
                      <div className={`relative bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-t-lg ${index === 0 ? 'aspect-video' : 'aspect-[4/3]'}`}>
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
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
                      
                      <h3 className={`font-bold mb-3 hover:text-blue-600 transition-colors ${index === 0 ? 'text-xl' : 'text-lg'}`}>
                        <Link href={item.url} target="_blank" rel="noopener noreferrer">
                          {item.title}
                        </Link>
                      </h3>
                      
                      <p className={`text-gray-600 dark:text-gray-400 mb-4 ${index === 0 ? 'text-base' : 'text-sm'}`}>
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
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Ler mais
                          <ExternalLink className="h-3 w-3 ml-1" />
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
          {regularNews.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow duration-200">
              <div className="relative">
                {item.image_url && (
                  <div className="relative aspect-[4/3] bg-gray-200 dark:bg-gray-700 overflow-hidden rounded-t-lg">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
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
                      className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Ler mais
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Carregar mais notícias
          </Button>
        </div>
      </div>
      </div>
    </>
  )
}
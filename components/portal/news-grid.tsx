import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Clock, ExternalLink, ArrowRight, TrendingUp, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  source: string
  published_at: string
  category: string
  image_url?: string
  author?: string
  relevance_score: number
  views?: number
}

interface NewsGridProps {
  news: NewsItem[]
  title?: string
  subtitle?: string
  showViewAll?: boolean
  layout?: 'grid' | 'list'
  itemsPerRow?: 2 | 3 | 4
  showMeta?: boolean
}

export default function NewsGrid({ 
  news, 
  title = "Últimas Notícias",
  subtitle = "Mantenha-se informado sobre as principais novidades",
  showViewAll = true,
  layout = 'grid',
  itemsPerRow = 3,
  showMeta = true
}: NewsGridProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'regulation': return 'category-regulation'
      case 'safety': return 'category-safety'
      case 'technology': return 'category-technology'
      case 'urban_mobility': return 'category-urban_mobility'
      default: return 'category-general'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'regulation': return 'Regulamentação'
      case 'safety': return 'Segurança'
      case 'technology': return 'Tecnologia'
      case 'urban_mobility': return 'Mobilidade Urbana'
      default: return 'Geral'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min atrás`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} h atrás`
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    }
  }

  const formatViews = (views: number) => {
    if (views < 1000) return views.toString()
    if (views < 1000000) return `${(views / 1000).toFixed(1)}K`
    return `${(views / 1000000).toFixed(1)}M`
  }

  const getGridCols = () => {
    if (layout === 'list') return 'grid-cols-1'
    switch (itemsPerRow) {
      case 2: return 'grid-cols-1 md:grid-cols-2'
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  const isRecentNews = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    return diffInHours < 24
  }

  const isHighRelevance = (score: number) => score >= 90

  if (!news || news.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
            <p className="text-gray-600 mb-8">{subtitle}</p>
            <div className="bg-white rounded-lg p-12 border border-gray-200">
              <p className="text-gray-500">
                Nenhuma notícia encontrada. Verifique novamente em breve.
              </p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 portal-title">
              {title}
            </h2>
            <p className="mt-4 text-lg text-gray-600 portal-subtitle">
              {subtitle}
            </p>
          </div>
          
          {showViewAll && (
            <Link href="/noticias">
              <Button variant="outline" className="gap-2">
                Ver todas
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* News Grid */}
        <div className={`grid ${getGridCols()} gap-6`}>
          {news.map((item) => (
            <Card 
              key={item.id} 
              className={`news-card overflow-hidden bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 ${
                layout === 'list' ? 'flex flex-col md:flex-row' : ''
              }`}
            >
              <Link href={item.url} target="_blank" rel="noopener noreferrer" className="group">
                <div className={`relative bg-gray-100 ${
                  layout === 'list' ? 'h-48 md:h-full md:w-80 md:flex-shrink-0' : 'h-48'
                }`}>
                  {item.image_url && (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  
                  {/* Badges overlay */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className={`${getCategoryColor(item.category)} text-xs font-medium`}>
                      {getCategoryLabel(item.category)}
                    </Badge>
                    
                    {isRecentNews(item.published_at) && (
                      <Badge className="bg-red-600 text-white text-xs font-medium">
                        NOVO
                      </Badge>
                    )}
                    
                    {isHighRelevance(item.relevance_score) && (
                      <Badge className="bg-orange-600 text-white text-xs font-medium">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        TRENDING
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
              
              <div className={`flex-1 ${layout === 'list' ? 'p-6' : ''}`}>
                <CardHeader className={`pb-3 ${layout === 'list' ? 'p-0 mb-4' : ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{formatDate(item.published_at)}</span>
                    </div>
                    
                    {showMeta && item.views && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Eye className="h-4 w-4" />
                        <span>{formatViews(item.views)}</span>
                      </div>
                    )}
                  </div>
                  
                  <Link href={item.url} target="_blank" rel="noopener noreferrer">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-primary transition-colors portal-title">
                      {item.title}
                    </h3>
                  </Link>
                </CardHeader>

                <CardContent className={`pt-0 ${layout === 'list' ? 'p-0' : ''}`}>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                      {item.source}
                    </span>
                    
                    <Link href={item.url} target="_blank" rel="noopener noreferrer">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="gap-2 text-primary hover:text-primary/80 hover:bg-primary/10 transition-colors"
                      >
                        Ler mais
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        {news.length >= 9 && (
          <div className="text-center mt-12">
            <Link href="/noticias">
              <Button size="lg" className="gap-2">
                Carregar mais notícias
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

// Component para News Categories Filter
export function NewsCategoriesFilter({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: {
  categories: Array<{ id: string; label: string; count: number }>
  activeCategory: string
  onCategoryChange: (category: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={activeCategory === category.id ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.id)}
          className="gap-2"
        >
          {category.label}
          <Badge variant="secondary" className="text-xs">
            {category.count}
          </Badge>
        </Button>
      ))}
    </div>
  )
}

// Component para News Stats
export function NewsStats({ totalNews, todayNews, trendingNews }: {
  totalNews: number
  todayNews: number
  trendingNews: number
}) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
        <div className="text-2xl font-bold text-primary">{totalNews}</div>
        <div className="text-sm text-gray-600">Total de notícias</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
        <div className="text-2xl font-bold text-green-600">{todayNews}</div>
        <div className="text-sm text-gray-600">Hoje</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
        <div className="text-2xl font-bold text-orange-600">{trendingNews}</div>
        <div className="text-sm text-gray-600">Em alta</div>
      </div>
    </div>
  )
}
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ExternalLink, ArrowRight, User } from "lucide-react"
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
}

interface HeroNewsProps {
  mainNews: NewsItem
  sideNews: NewsItem[]
}

export default function HeroNews({ mainNews, sideNews }: HeroNewsProps) {
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

  return (
    <section className="bg-white py-8 lg:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main News */}
          <div className="lg:col-span-2">
            <div className="relative group cursor-pointer overflow-hidden rounded-xl bg-gray-100">
              <Link href={mainNews.url} target="_blank" rel="noopener noreferrer">
                <div className="relative h-80 sm:h-96 lg:h-[28rem]">
                  <Image
                    src={mainNews.image_url || '/placeholder-news.jpg'}
                    alt={mainNews.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority
                  />
                  <div className="hero-news-overlay absolute inset-0" />
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Badge className={`${getCategoryColor(mainNews.category)} font-medium`}>
                          {getCategoryLabel(mainNews.category)}
                        </Badge>
                        <div className="flex items-center gap-1 text-white/90 text-sm">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(mainNews.published_at)}</span>
                        </div>
                      </div>
                      
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white portal-title">
                        {mainNews.title}
                      </h1>
                      
                      <p className="text-white/90 text-base sm:text-lg leading-relaxed line-clamp-3 portal-subtitle">
                        {mainNews.description}
                      </p>
                      
                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <User className="h-4 w-4" />
                          <span>{mainNews.source}</span>
                        </div>
                        
                        <Button 
                          variant="secondary"
                          size="lg"
                          className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
                        >
                          Leia a matéria completa
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Side News */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Destaques</h2>
              <Link href="/noticias">
                <Button variant="outline" size="sm" className="gap-2">
                  Ver todas
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {sideNews.map((news, index) => (
                <article key={news.id} className="news-card bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300">
                  <Link href={news.url} target="_blank" rel="noopener noreferrer">
                    <div className="flex gap-4">
                      {news.image_url && (
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={news.image_url}
                            alt={news.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant="secondary" 
                            className={`${getCategoryColor(news.category)} text-xs`}
                          >
                            {getCategoryLabel(news.category)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {formatDate(news.published_at)}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 portal-title">
                          {news.title}
                        </h3>
                        
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {news.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{news.source}</span>
                          <ExternalLink className="h-3 w-3 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
            
            {/* Quick Actions */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-semibold text-blue-900 mb-3">Acesso Rápido</h3>
              <div className="space-y-2">
                <Link href="/resolucao-996" className="block portal-link text-sm">
                  → Resolução 996 CONTRAN
                </Link>
                <Link href="/ferramentas" className="block portal-link text-sm">
                  → Ferramentas e Calculadoras
                </Link>
                <Link href="/noticias?categoria=regulation" className="block portal-link text-sm">
                  → Últimas Regulamentações
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Hook para obter notícias para o hero
export function useHeroNews(news: NewsItem[]) {
  if (!news || news.length === 0) {
    return {
      mainNews: null,
      sideNews: []
    }
  }

  // Pega a notícia principal (maior relevância)
  const sortedNews = [...news].sort((a, b) => b.relevance_score - a.relevance_score)
  const mainNews = sortedNews[0]
  
  // Pega 4 notícias secundárias (exclui a principal)
  const sideNews = sortedNews.slice(1, 5)

  return {
    mainNews,
    sideNews
  }
}
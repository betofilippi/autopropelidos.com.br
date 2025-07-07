import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Clock, ExternalLink, Play, Star, AlertCircle } from "lucide-react"
import { getLatestNews } from "@/lib/services/news"
import { getLatestVideos } from "@/lib/services/youtube"
import Link from "next/link"
import Image from "next/image"

// Categorias e suas cores
const categoryColors = {
  regulation: 'bg-red-100 text-red-800 border-red-200',
  safety: 'bg-orange-100 text-orange-800 border-orange-200', 
  technology: 'bg-blue-100 text-blue-800 border-blue-200',
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

function formatTimeAgo(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffHours < 24) return `${diffHours}h atrás`
  if (diffDays === 1) return '1 dia atrás'
  if (diffDays < 7) return `${diffDays} dias atrás`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export default async function Home() {
  // Buscar conteúdo dinâmico - usando try/catch para builds
  let latestNews, featuredVideos
  try {
    [latestNews, featuredVideos] = await Promise.all([
      getLatestNews(undefined, 20),
      getLatestVideos(undefined, 8)
    ])
  } catch (error) {
    console.error('Error loading content, using fallback:', error)
    // Fallback para build
    latestNews = []
    featuredVideos = []
  }

  // Separar notícias por relevância - com fallback para arrays vazios
  const breakingNews = (latestNews || []).filter(news => news.relevance_score >= 90).slice(0, 1)
  const featuredNews = (latestNews || []).filter(news => news.relevance_score >= 80 && news.relevance_score < 90).slice(0, 3)
  const trendingNews = (latestNews || []).filter(news => news.relevance_score >= 70 && news.relevance_score < 80).slice(0, 6)
  const regularNews = (latestNews || []).filter(news => news.relevance_score < 70).slice(0, 8)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breaking News Bar */}
      {breakingNews.length > 0 && (
        <div className="bg-red-600 text-white py-2 px-4 overflow-hidden">
          <div className="container mx-auto flex items-center gap-4">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <AlertCircle className="h-4 w-4 animate-pulse" />
              <span className="font-bold text-sm">URGENTE</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="breaking-news-scroll">
                <Link href={breakingNews[0].url} className="hover:underline">
                  {breakingNews[0].title}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Enhanced News Portal Style */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white py-16 md:py-24">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Main Content */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="bg-red-500/20 px-3 py-1 rounded-full text-sm font-medium border border-red-500/30 uppercase tracking-wide">
                  AO VIVO
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="text-emerald-400">Portal</span> Autopropelidos
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
                Seu portal de notícias sobre <strong>Resolução 996</strong> do CONTRAN e 
                regulamentações para equipamentos de mobilidade urbana
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg">
                  <Link href="/resolucao-996" className="flex items-center gap-2">
                    Ver Resolução 996
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link href="/noticias" className="flex items-center gap-2">
                    Últimas Notícias
                    <Clock className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              {/* Stats Bar */}
              <div className="flex items-center gap-6 text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span>Atualizado diariamente</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>24h por dia</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - Featured News Preview */}
            {featuredNews && featuredNews.length > 0 && (
              <div className="lg:block hidden">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-bold mb-4 text-white">🔥 Destaque do Momento</h3>
                  <div className="space-y-4">
                    {featuredNews.slice(0, 2).map((news, index) => (
                      <div key={news.id} className="flex gap-4 items-start">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="font-semibold text-sm text-white mb-1 line-clamp-2">
                            <Link href={news.url} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300">
                              {news.title}
                            </Link>
                          </h4>
                          <p className="text-xs text-blue-200">{news.source} • {formatTimeAgo(news.published_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured News Section - Enhanced Portal Style */}
      {featuredNews && featuredNews.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Star className="h-6 w-6 text-yellow-500" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Notícias em Destaque</h2>
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                As principais notícias sobre equipamentos autopropelidos e regulamentações
              </p>
            </div>
            
            {/* Featured News Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {featuredNews.map((news, index) => (
                <Card key={news.id} className="news-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  {/* News Image */}
                  {news.image_url && (
                    <div className="relative aspect-video bg-gray-200 overflow-hidden rounded-t-xl">
                      <Image
                        src={news.image_url}
                        alt={news.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <Badge 
                          variant="outline" 
                          className={`${categoryColors[news.category as keyof typeof categoryColors]} bg-white/90 backdrop-blur-sm border-white/20`}
                        >
                          {categoryLabels[news.category as keyof typeof categoryLabels]}
                        </Badge>
                      </div>
                      {index === 0 && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-red-500 text-white border-0 animate-pulse">
                            🔥 DESTAQUE
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    {/* Meta Information */}
                    <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                      <span className="font-medium bg-gray-100 px-2 py-1 rounded">{news.source}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(news.published_at)}
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="font-bold text-lg mb-3 line-clamp-2 hover:text-blue-600 transition-colors leading-tight">
                      <Link href={news.url} target="_blank" rel="noopener noreferrer">
                        {news.title}
                      </Link>
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {news.description}
                    </p>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 font-medium">
                          Relevância: {news.relevance_score}%
                        </span>
                      </div>
                      <Link
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
                      >
                        Ler mais
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending & Latest News - Enhanced Portal Style */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Trending News */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Tendências</h2>
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span>Em alta agora</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {trendingNews.map((news, index) => (
                  <Card key={news.id} className="news-card border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge 
                          variant="outline" 
                          className={`${categoryColors[news.category as keyof typeof categoryColors]} text-xs`}
                        >
                          {categoryLabels[news.category as keyof typeof categoryLabels]}
                        </Badge>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(news.published_at)}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition-colors leading-tight">
                        <Link href={news.url} target="_blank" rel="noopener noreferrer">
                          {news.title}
                        </Link>
                      </h3>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">{news.source}</span>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                          <span className="text-xs text-orange-600 font-medium">{news.relevance_score}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Enhanced Sidebar */}
            <div className="space-y-8">
              {/* Featured Videos */}
              {featuredVideos && featuredVideos.length > 0 && (
                <Card className="border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-t-lg">
                    <CardTitle className="flex items-center gap-2">
                      <Play className="h-5 w-5" />
                      Vídeos em Destaque
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6">
                    {featuredVideos.slice(0, 3).map((video) => (
                      <div key={video.id} className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="relative w-20 h-14 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          {video.thumbnail_url && (
                            <Image
                              src={video.thumbnail_url}
                              alt={video.title}
                              fill
                              className="object-cover"
                            />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">
                            <Link href={video.url} target="_blank" rel="noopener noreferrer" className="hover:text-red-600">
                              {video.title}
                            </Link>
                          </h4>
                          <p className="text-xs text-gray-500">{video.channel_name}</p>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                      <Link href="/videos">Ver Todos os Vídeos</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Quick Links */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle>Links Rápidos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 p-6">
                  <Link href="/resolucao-996" className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors border border-blue-100">
                    <span className="font-medium text-blue-700">Resolução 996</span>
                    <ArrowRight className="h-4 w-4 text-blue-500" />
                  </Link>
                  <Link href="/ferramentas" className="flex items-center justify-between p-3 rounded-lg hover:bg-green-50 transition-colors border border-green-100">
                    <span className="font-medium text-green-700">Ferramentas</span>
                    <ArrowRight className="h-4 w-4 text-green-500" />
                  </Link>
                  <Link href="/biblioteca" className="flex items-center justify-between p-3 rounded-lg hover:bg-purple-50 transition-colors border border-purple-100">
                    <span className="font-medium text-purple-700">Biblioteca</span>
                    <ArrowRight className="h-4 w-4 text-purple-500" />
                  </Link>
                  <Link href="/faq" className="flex items-center justify-between p-3 rounded-lg hover:bg-orange-50 transition-colors border border-orange-100">
                    <span className="font-medium text-orange-700">FAQ</span>
                    <ArrowRight className="h-4 w-4 text-orange-500" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Grid - Enhanced Portal Style */}
      {regularNews && regularNews.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Últimas Notícias</h2>
                <p className="text-gray-600">Mantenha-se informado com as novidades mais recentes</p>
              </div>
              <Button variant="outline" className="bg-white shadow-sm hover:shadow-md">
                <Link href="/noticias" className="flex items-center gap-2">
                  Ver Todas
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regularNews.map((news) => (
                <Card key={news.id} className="news-card border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
                  {news.image_url && (
                    <div className="relative aspect-video bg-gray-200 overflow-hidden rounded-t-lg">
                      <Image
                        src={news.image_url}
                        alt={news.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                    </div>
                  )}
                  
                  <CardContent className="p-4">
                    <Badge 
                      variant="outline" 
                      className={`${categoryColors[news.category as keyof typeof categoryColors]} mb-3 text-xs`}
                    >
                      {categoryLabels[news.category as keyof typeof categoryLabels]}
                    </Badge>
                    
                    <h3 className="font-semibold text-sm mb-3 line-clamp-2 hover:text-blue-600 transition-colors leading-tight">
                      <Link href={news.url} target="_blank" rel="noopener noreferrer">
                        {news.title}
                      </Link>
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span className="bg-gray-50 px-2 py-1 rounded">{news.source}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(news.published_at)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section - Enhanced Portal Style */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="bg-emerald-500/20 px-3 py-1 rounded-full text-sm font-medium border border-emerald-500/30 uppercase tracking-wide">
                Newsletter Portal
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              📧 Fique por dentro das <span className="text-emerald-400">novidades</span>
            </h2>
            
            <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto leading-relaxed">
              Receba as últimas notícias, regulamentações e atualizações sobre equipamentos autopropelidos 
              diretamente no seu email. <strong>Gratuito e sem spam!</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto mb-8">
              <input 
                type="email" 
                placeholder="Seu melhor email"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 border-2 border-transparent focus:border-emerald-400 focus:outline-none shadow-lg"
              />
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 px-8 py-4 rounded-xl shadow-lg font-semibold">
                Assinar Newsletter
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-6 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Mais de 1.000 assinantes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Enviado semanalmente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
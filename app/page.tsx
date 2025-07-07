import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Clock, ExternalLink, Play, Star, AlertCircle, Zap, Users, Shield, Globe, Eye } from "lucide-react"
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
  // Durante o build (processo estático), sempre usar dados mock
  let latestNews, featuredVideos
  
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    // Build estático - usar dados mock diretamente
    latestNews = [
      {
        id: '1',
        title: 'CONTRAN publica Resolução 996: Nova era para equipamentos autopropelidos',
        description: 'Resolução regulamenta patinetes elétricos, bicicletas elétricas e ciclomotores no Brasil',
        url: 'https://portal.autopropelidos.com.br/noticias/contran-996',
        source: 'Portal do Trânsito',
        published_at: '2023-06-15T10:00:00Z',
        category: 'regulation',
        image_url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=400&h=300&fit=crop',
        relevance_score: 95
      },
      {
        id: '2',
        title: 'Mercado de patinetes elétricos cresce 150% no Brasil',
        description: 'Setor de micromobilidade apresenta expansão acelerada com nova regulamentação',
        url: 'https://portal.autopropelidos.com.br/noticias/mercado-crescimento',
        source: 'Mobilidade Urbana',
        published_at: '2024-01-10T14:30:00Z',
        category: 'technology',
        image_url: 'https://images.unsplash.com/photo-1558618666-7bd5ad0e9bf5?w=400&h=300&fit=crop',
        relevance_score: 85
      },
      {
        id: '3',
        title: 'Acidentes com patinetes elétricos aumentam 40% em 2024',
        description: 'Dados revelam necessidade de maior conscientização sobre segurança no trânsito',
        url: 'https://portal.autopropelidos.com.br/noticias/acidentes-dados',
        source: 'Segurança no Trânsito',
        published_at: '2024-02-15T09:15:00Z',
        category: 'safety',
        image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
        relevance_score: 78
      }
    ]
    
    featuredVideos = [
      {
        id: '1',
        youtube_id: 'dQw4w9WgXcQ',
        title: 'Resolução 996 do CONTRAN Explicada - Tudo sobre Equipamentos Autopropelidos',
        description: 'Entenda completamente a nova regulamentação para equipamentos de mobilidade urbana',
        channel_name: 'Portal do Trânsito Oficial',
        channel_id: 'UC1234567890',
        thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        published_at: '2023-06-20T15:30:00Z',
        duration: 'PT8M45S',
        view_count: 125000,
        category: 'educational',
        tags: ['CONTRAN', '996', 'regulamentação'],
        relevance_score: 98,
        url: 'https://youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        id: '2',
        youtube_id: 'abc123def456',
        title: 'Como Usar Patinete Elétrico com Segurança - Guia Completo',
        description: 'Dicas essenciais de segurança para circular com patinetes elétricos',
        channel_name: 'Jornal da Band',
        channel_id: 'UCX8pU3lBmmGiEchT8kq_LrQ',
        thumbnail_url: 'https://img.youtube.com/vi/abc123def456/mqdefault.jpg',
        published_at: '2023-11-15T09:20:00Z',
        duration: 'PT12M30S',
        view_count: 89000,
        category: 'tutorial',
        tags: ['segurança', 'patinete elétrico'],
        relevance_score: 92,
        url: 'https://youtube.com/watch?v=abc123def456'
      }
    ]
  } else {
    // Runtime - tentar buscar dados dinâmicos
    try {
      [latestNews, featuredVideos] = await Promise.all([
        getLatestNews(undefined, 20),
        getLatestVideos(undefined, 8)
      ])
    } catch (error) {
      console.error('Error loading content, using fallback:', error)
      latestNews = []
      featuredVideos = []
    }
  }

  // Separar notícias por relevância - com fallback para arrays vazios
  const breakingNews = (latestNews || []).filter(news => news.relevance_score >= 90).slice(0, 1)
  const featuredNews = (latestNews || []).filter(news => news.relevance_score >= 80 && news.relevance_score < 90).slice(0, 3)
  const trendingNews = (latestNews || []).filter(news => news.relevance_score >= 70 && news.relevance_score < 80).slice(0, 6)
  const regularNews = (latestNews || []).filter(news => news.relevance_score < 70).slice(0, 8)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breaking News Bar - Enhanced */}
      {breakingNews.length > 0 && (
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white py-3 px-4 overflow-hidden shadow-lg">
          <div className="container mx-auto flex items-center gap-4">
            <div className="flex items-center gap-3 whitespace-nowrap">
              <div className="relative">
                <AlertCircle className="h-5 w-5 animate-pulse" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
              </div>
              <span className="font-bold text-sm bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">🚨 URGENTE</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="breaking-news-scroll">
                <Link href={breakingNews[0].url} className="hover:underline font-medium">
                  {breakingNews[0].title}
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">AO VIVO</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section - Ultra Modern Portal Style */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-transparent"></div>
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Main Content */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="relative">
                  <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="absolute -top-1 -left-1 w-6 h-6 bg-red-500/30 rounded-full animate-ping"></div>
                </div>
                <span className="bg-gradient-to-r from-red-500/30 to-orange-500/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold border border-red-500/40 uppercase tracking-wide shadow-lg">
                  📡 Portal AO VIVO
                </span>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 animate-pulse">
                  ✅ Online
                </Badge>
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
                <span className="bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                  Portal
                </span>
                <br />
                <span className="text-white drop-shadow-2xl">
                  Autopropelidos
                </span>
                <div className="text-lg md:text-xl text-emerald-300 font-normal mt-2 tracking-wider">
                  🚀 Sua fonte #1 de notícias
                </div>
              </h1>
              
              <div className="space-y-6 mb-10">
                <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
                  O <strong className="text-emerald-300">portal mais completo</strong> sobre 
                  <strong className="text-yellow-300">Resolução 996</strong> do CONTRAN e 
                  regulamentações de equipamentos de mobilidade urbana
                </p>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-3 py-1">
                    🏆 Mais de 50k leitores
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-3 py-1">
                    ⚡ Atualizado 24/7
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-3 py-1">
                    📊 +200% crescimento
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-2xl border-0 transform hover:scale-105 transition-all duration-300">
                  <Link href="/resolucao-996" className="flex items-center gap-3">
                    <Shield className="h-5 w-5" />
                    Ver Resolução 996
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-2xl border-0 transform hover:scale-105 transition-all duration-300">
                  <Link href="/noticias" className="flex items-center gap-3">
                    <Zap className="h-5 w-5" />
                    Últimas Notícias
                    <Clock className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm shadow-xl transform hover:scale-105 transition-all duration-300">
                  <Link href="/videos" className="flex items-center gap-3">
                    <Play className="h-5 w-5" />
                    Vídeos
                  </Link>
                </Button>
              </div>
              
              {/* Enhanced Stats Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-2 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  <div>
                    <div className="text-sm font-bold text-white">24/7</div>
                    <div className="text-xs text-blue-200">Atualizado</div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-2 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <Users className="h-5 w-5 text-blue-400" />
                  <div>
                    <div className="text-sm font-bold text-white">50k+</div>
                    <div className="text-xs text-blue-200">Leitores</div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-2 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <Globe className="h-5 w-5 text-purple-400" />
                  <div>
                    <div className="text-sm font-bold text-white">100%</div>
                    <div className="text-xs text-blue-200">Confiável</div>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-2 p-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <Clock className="h-5 w-5 text-yellow-400" />
                  <div>
                    <div className="text-sm font-bold text-white">Tempo Real</div>
                    <div className="text-xs text-blue-200">Notícias</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Featured News Preview Enhanced */}
            {featuredNews && featuredNews.length > 0 && (
              <div className="lg:block hidden relative">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                      <Star className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Destaque do Momento</h3>
                    <Badge className="bg-red-500/20 text-red-300 border-red-500/30 animate-pulse">🔥 HOT</Badge>
                  </div>
                  <div className="space-y-6">
                    {featuredNews.slice(0, 3).map((news, index) => (
                      <div key={news.id} className="group p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300">
                        <div className="flex gap-4 items-start">
                          <div className="relative">
                            <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full mt-2 flex-shrink-0 animate-pulse"></div>
                            <div className="absolute -top-1 -left-1 w-5 h-5 bg-emerald-400/20 rounded-full animate-ping"></div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-sm text-white mb-2 line-clamp-2 group-hover:text-emerald-300 transition-colors">
                              <Link href={news.url} target="_blank" rel="noopener noreferrer">
                                {news.title}
                              </Link>
                            </h4>
                            <div className="flex items-center gap-2 text-xs">
                              <Badge variant="outline" className="text-blue-300 border-blue-300/30 bg-blue-500/10">
                                {news.source}
                              </Badge>
                              <span className="text-blue-200">•</span>
                              <span className="text-blue-200">{formatTimeAgo(news.published_at)}</span>
                            </div>
                          </div>
                          {index === 0 && (
                            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                              #1
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-6 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                    <Link href="/noticias" className="flex items-center gap-2">
                      Ver Todas as Notícias
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
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
            {/* Section Header Enhanced */}
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                    Notícias em <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Destaque</span>
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Badge className="bg-red-500 text-white animate-pulse">🔥 QUENTE</Badge>
                    <Badge className="bg-blue-500 text-white">📊 RELEVANTE</Badge>
                    <Badge className="bg-green-500 text-white">✅ VERIFICADO</Badge>
                  </div>
                </div>
                <div className="p-3 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                As <strong className="text-blue-600">principais notícias</strong> sobre equipamentos autopropelidos, 
                regulamentações do CONTRAN e inovações em <strong className="text-emerald-600">mobilidade urbana</strong>
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
                    <Button className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg btn-interactive">
                      <Link href="/videos" className="flex items-center gap-2">
                        Ver Todos os Vídeos
                        <Play className="h-4 w-4" />
                      </Link>
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
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 btn-interactive">
                <Link href="/noticias" className="flex items-center gap-2">
                  Ver Todas
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {regularNews.map((news, index) => (
                <Card key={news.id} className={`news-card border-0 shadow-modern hover:shadow-modern-lg bg-white glow fade-in`} style={{animationDelay: `${index * 0.1}s`}}>
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
                    
                    <h3 className="font-semibold text-sm mb-3 line-clamp-2 leading-tight">
                      <Link href={news.url} target="_blank" rel="noopener noreferrer" className="portal-link hover:scale-105 transition-all duration-300">
                        {news.title}
                      </Link>
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span className="glass px-2 py-1 rounded">{news.source}</span>
                      <span className="flex items-center gap-1 glass px-2 py-1 rounded">
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

      {/* Newsletter Section - Ultra Enhanced Portal Style */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse float"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl animate-pulse float" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8 bounce-in">
              <div className="relative">
                <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-emerald-400/30 rounded-full animate-ping"></div>
              </div>
              <span className="bg-gradient-to-r from-emerald-500/30 to-blue-500/30 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-bold border border-emerald-500/40 uppercase tracking-wide shadow-2xl glass">
                📧 Newsletter Portal Premium
              </span>
              <Badge className="bg-gold bg-yellow-500/20 text-yellow-300 border-yellow-500/30 animate-pulse">⭐ VIP</Badge>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight scale-in">
              📧 Fique por dentro das 
              <span className="gradient-text block mt-2">novidades exclusivas</span>
            </h2>
            
            <div className="space-y-6 mb-10 fade-in" style={{animationDelay: '0.5s'}}>
              <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
                Receba as <strong className="text-emerald-300">últimas notícias</strong>, regulamentações do CONTRAN e 
                atualizações sobre equipamentos autopropelidos diretamente no seu email.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">✅ 100% Gratuito</Badge>
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">🚫 Zero Spam</Badge>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">⚡ Conteúdo Exclusivo</Badge>
                <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 px-4 py-2">📊 Insights Premium</Badge>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto mb-10 slide-up" style={{animationDelay: '0.8s'}}>
              <input 
                type="email" 
                placeholder="Digite seu melhor email aqui..."
                className="flex-1 px-8 py-5 rounded-2xl text-gray-900 placeholder-gray-500 border-2 border-transparent focus:border-emerald-400 focus:outline-none shadow-2xl glass backdrop-blur-sm bg-white/95 font-medium text-lg focus:ring-4 focus:ring-emerald-400/20 transition-all duration-300"
              />
              <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 px-10 py-5 rounded-2xl shadow-2xl font-bold text-lg transform hover:scale-105 transition-all duration-300 btn-interactive border-2 border-emerald-400/30">
                🚀 Assinar Grátis
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center fade-in" style={{animationDelay: '1s'}}>
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl glass backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <Users className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">50,000+</div>
                  <div className="text-sm text-blue-200">Assinantes Ativos</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl glass backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                  <Clock className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">Diário</div>
                  <div className="text-sm text-blue-200">Conteúdo Atualizado</div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl glass backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <Shield className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">Seguro</div>
                  <div className="text-sm text-blue-200">Cancele Quando Quiser</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
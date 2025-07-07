import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, ExternalLink, Play, FileText, Shield, Zap, TrendingUp, Calendar, User } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Import services safely
import { getLatestNews } from "@/lib/services/news"
import { getLatestVideos } from "@/lib/services/youtube"

// Paleta de cores Slate/Zinc
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
  // Durante o build, usar dados mock para evitar problemas de conexão
  let latestNews, featuredVideos
  
  // Verificar se estamos em ambiente de build
  const isBuildTime = typeof window === 'undefined' && process.env.NODE_ENV === 'production'
  
  if (isBuildTime) {
    // Durante build: usar dados mock diretamente
    latestNews = [
      {
        id: '1',
        title: 'CONTRAN publica Resolução 996: Nova era para equipamentos autopropelidos',
        description: 'Resolução regulamenta patinetes elétricos, bicicletas elétricas e ciclomotores no Brasil com novas regras de segurança e circulação.',
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
        description: 'Setor de micromobilidade apresenta expansão acelerada com nova regulamentação favorecendo o crescimento sustentável.',
        url: 'https://portal.autopropelidos.com.br/noticias/mercado-crescimento',
        source: 'Mobilidade Urbana',
        published_at: '2024-01-10T14:30:00Z',
        category: 'technology',
        image_url: 'https://images.unsplash.com/photo-1558618666-7bd5ad0e9bf5?w=400&h=300&fit=crop',
        relevance_score: 88
      },
      {
        id: '3',
        title: 'Acidentes com patinetes elétricos aumentam 40% em 2024',
        description: 'Dados revelam necessidade de maior conscientização sobre segurança no trânsito e uso adequado de equipamentos.',
        url: 'https://portal.autopropelidos.com.br/noticias/acidentes-dados',
        source: 'Segurança no Trânsito',
        published_at: '2024-02-15T09:15:00Z',
        category: 'safety',
        image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
        relevance_score: 82
      },
      {
        id: '4',
        title: 'Novas ciclofaixas em São Paulo para equipamentos autopropelidos',
        description: 'Prefeitura anuncia expansão da infraestrutura com 200km de novas ciclofaixas para patinetes e bicicletas elétricas.',
        url: 'https://portal.autopropelidos.com.br/noticias/ciclofaixas-sp',
        source: 'Prefeitura SP',
        published_at: '2024-03-20T11:00:00Z',
        category: 'urban_mobility',
        image_url: 'https://images.unsplash.com/photo-1558454065-b44d4af6671e?w=400&h=300&fit=crop',
        relevance_score: 75
      },
      {
        id: '5',
        title: 'Baterias de lítio: nova tecnologia promete maior autonomia',
        description: 'Fabricantes investem em baterias mais eficientes que podem aumentar autonomia em até 50% para equipamentos elétricos.',
        url: 'https://portal.autopropelidos.com.br/noticias/baterias-litio',
        source: 'Tech News',
        published_at: '2024-04-05T16:45:00Z',
        category: 'technology',
        image_url: 'https://images.unsplash.com/photo-1609107665453-4056fad9c68e?w=400&h=300&fit=crop',
        relevance_score: 72
      },
      {
        id: '6',
        title: 'Capacetes inteligentes chegam ao mercado brasileiro',
        description: 'Nova linha de capacetes com conectividade Bluetooth, GPS integrado e sistema de chamadas de emergência.',
        url: 'https://portal.autopropelidos.com.br/noticias/capacetes-inteligentes',
        source: 'Inovação BR',
        published_at: '2024-04-12T08:30:00Z',
        category: 'safety',
        image_url: 'https://images.unsplash.com/photo-1544943410-1c3ecb2fb67d?w=400&h=300&fit=crop',
        relevance_score: 70
      },
      {
        id: '7',
        title: 'Sharing de patinetes chega a 50 cidades brasileiras',
        description: 'Serviços de compartilhamento se expandem pelo interior do país com modelos sustentáveis de negócio.',
        url: 'https://portal.autopropelidos.com.br/noticias/sharing-expansao',
        source: 'Mobilidade Brasil',
        published_at: '2024-04-18T12:15:00Z',
        category: 'urban_mobility',
        image_url: 'https://images.unsplash.com/photo-1558618666-c3c5c2b6d31e?w=400&h=300&fit=crop',
        relevance_score: 68
      },
      {
        id: '8',
        title: 'Governo federal estuda subsídios para veículos elétricos',
        description: 'Ministério dos Transportes avalia incentivos fiscais para equipamentos de mobilidade elétrica urbana.',
        url: 'https://portal.autopropelidos.com.br/noticias/subsidios-governo',
        source: 'Gov.br',
        published_at: '2024-04-22T14:20:00Z',
        category: 'regulation',
        image_url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
        relevance_score: 65
      },
      {
        id: '9',
        title: 'Aplicativo de rotas otimizadas para patinetes é lançado',
        description: 'Nova ferramenta usa IA para sugerir melhores trajetos considerando ciclofaixas e pontos de recarga.',
        url: 'https://portal.autopropelidos.com.br/noticias/app-rotas',
        source: 'StartupBR',
        published_at: '2024-04-25T09:45:00Z',
        category: 'technology',
        image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop',
        relevance_score: 62
      },
      {
        id: '10',
        title: 'Curso online gratuito ensina segurança em patinetes',
        description: 'Plataforma educacional oferece certificação em condução segura de equipamentos autopropelidos.',
        url: 'https://portal.autopropelidos.com.br/noticias/curso-seguranca',
        source: 'EduMob',
        published_at: '2024-04-28T11:30:00Z',
        category: 'safety',
        image_url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop',
        relevance_score: 60
      },
      {
        id: '11',
        title: 'Estações de recarga solar para patinetes em parques',
        description: 'Iniciativa pioneira instala pontos de recarga movidos a energia solar em parques públicos de São Paulo.',
        url: 'https://portal.autopropelidos.com.br/noticias/recarga-solar',
        source: 'EcoSP',
        published_at: '2024-05-02T15:00:00Z',
        category: 'technology',
        image_url: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
        relevance_score: 58
      },
      {
        id: '12',
        title: 'Multas por uso irregular de patinetes aumentam 300%',
        description: 'Fiscalização intensificada resulta em mais autuações por circulação em calçadas e desrespeito às regras.',
        url: 'https://portal.autopropelidos.com.br/noticias/multas-aumento',
        source: 'Trânsito Hoje',
        published_at: '2024-05-05T13:45:00Z',
        category: 'regulation',
        image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop',
        relevance_score: 55
      }
    ]
    
    featuredVideos = [
      {
        id: '1',
        youtube_id: 'dQw4w9WgXcQ',
        title: 'Resolução 996 do CONTRAN Explicada - Guia Completo',
        description: 'Entenda completamente a nova regulamentação para equipamentos de mobilidade urbana',
        channel_name: 'Portal do Trânsito Oficial',
        thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
        published_at: '2023-06-20T15:30:00Z',
        view_count: 125000,
        url: 'https://youtube.com/watch?v=dQw4w9WgXcQ'
      },
      {
        id: '2',
        youtube_id: 'abc123def456',
        title: 'Como Usar Patinete Elétrico com Segurança',
        description: 'Dicas essenciais de segurança para circular com patinetes elétricos',
        channel_name: 'Jornal da Band',
        thumbnail_url: 'https://img.youtube.com/vi/abc123def456/mqdefault.jpg',
        published_at: '2023-11-15T09:20:00Z',
        view_count: 89000,
        url: 'https://youtube.com/watch?v=abc123def456'
      },
      {
        id: '3',
        youtube_id: 'xyz789uvw012',
        title: 'Equipamentos Aprovados pelo CONTRAN 2024',
        description: 'Lista completa dos equipamentos em conformidade com a regulamentação',
        channel_name: 'Mobilidade Brasil',
        thumbnail_url: 'https://img.youtube.com/vi/xyz789uvw012/mqdefault.jpg',
        published_at: '2024-01-08T14:15:00Z',
        view_count: 67000,
        url: 'https://youtube.com/watch?v=xyz789uvw012'
      }
    ]
  } else {
    // Runtime: tentar buscar dados reais
    try {
      [latestNews, featuredVideos] = await Promise.all([
        getLatestNews(undefined, 20),
        getLatestVideos(undefined, 8)
      ])
    } catch (error) {
      console.error('Error loading real data, using fallback:', error)
      // Fallback para dados mock se houver erro
      latestNews = []
      featuredVideos = []
    }
  }

  // Separar notícias por relevância
  const breakingNews = (latestNews || []).filter(news => news.relevance_score >= 90).slice(0, 1)
  const featuredNews = (latestNews || []).filter(news => news.relevance_score >= 70 && news.relevance_score < 90).slice(0, 4)
  const regularNews = (latestNews || []).filter(news => news.relevance_score < 70).slice(0, 8)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breaking News Bar */}
      {breakingNews.length > 0 && (
        <div className="bg-red-600 text-white py-2 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-white text-red-600 font-semibold text-xs">URGENTE</Badge>
              <Link href={breakingNews[0].url} className="hover:underline text-sm truncate">
                {breakingNews[0].title}
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                Portal Autopropelidos
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-6 max-w-3xl mx-auto">
                Seu portal completo sobre a <span className="font-semibold text-slate-800">Resolução 996</span> do CONTRAN 
                e regulamentações para equipamentos de mobilidade urbana
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800" asChild>
                  <Link href="/resolucao-996" className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Ver Resolução 996
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100" asChild>
                  <Link href="/noticias" className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Últimas Notícias
                  </Link>
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Informações Oficiais</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>Atualizado Diariamente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Featured News */}
            {featuredNews && featuredNews.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="h-6 w-6 text-slate-700" />
                  <h2 className="text-2xl font-bold text-slate-900">Notícias em Destaque</h2>
                </div>
                
                <div className="grid gap-6">
                  {/* First featured news - large */}
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow border-slate-200">
                    <div className="grid md:grid-cols-2 gap-0">
                      {featuredNews[0].image_url && (
                        <div className="relative h-64 md:h-auto">
                          <Image
                            src={featuredNews[0].image_url}
                            alt={featuredNews[0].title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge 
                            variant="outline" 
                            className={categoryColors[featuredNews[0].category as keyof typeof categoryColors]}
                          >
                            {categoryLabels[featuredNews[0].category as keyof typeof categoryLabels]}
                          </Badge>
                          <Badge className="bg-slate-900 text-white">PRINCIPAL</Badge>
                        </div>
                        
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                          <Link href={featuredNews[0].url} target="_blank" rel="noopener noreferrer" className="hover:text-slate-700">
                            {featuredNews[0].title}
                          </Link>
                        </h3>
                        
                        <p className="text-slate-600 mb-4">
                          {featuredNews[0].description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>{featuredNews[0].source}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatTimeAgo(featuredNews[0].published_at)}</span>
                            </div>
                            <Link
                              href={featuredNews[0].url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-slate-700 hover:text-slate-900 font-medium"
                            >
                              Ler mais
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Other featured news - smaller grid */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {featuredNews.slice(1, 4).map((news) => (
                      <Card key={news.id} className="overflow-hidden hover:shadow-md transition-shadow border-slate-200">
                        {news.image_url && (
                          <div className="aspect-video relative">
                            <Image
                              src={news.image_url}
                              alt={news.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <Badge 
                            variant="outline" 
                            className={`${categoryColors[news.category as keyof typeof categoryColors]} mb-3 text-xs`}
                          >
                            {categoryLabels[news.category as keyof typeof categoryLabels]}
                          </Badge>
                          
                          <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 text-sm">
                            <Link href={news.url} target="_blank" rel="noopener noreferrer" className="hover:text-slate-700">
                              {news.title}
                            </Link>
                          </h3>
                          
                          <p className="text-slate-600 text-xs mb-3 line-clamp-2">
                            {news.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{news.source}</span>
                            <span>{formatTimeAgo(news.published_at)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Regular News Grid */}
            {regularNews && regularNews.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Mais Notícias</h2>
                  <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-100" asChild>
                    <Link href="/noticias">
                      Ver todas
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {regularNews.map((news) => (
                    <Card key={news.id} className="overflow-hidden hover:shadow-md transition-shadow border-slate-200">
                      {news.image_url && (
                        <div className="aspect-video relative">
                          <Image
                            src={news.image_url}
                            alt={news.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <CardContent className="p-3">
                        <Badge 
                          variant="outline" 
                          className={`${categoryColors[news.category as keyof typeof categoryColors]} mb-2 text-xs`}
                        >
                          {categoryLabels[news.category as keyof typeof categoryLabels]}
                        </Badge>
                        
                        <h3 className="font-medium text-slate-900 mb-2 line-clamp-2 text-sm">
                          <Link href={news.url} target="_blank" rel="noopener noreferrer" className="hover:text-slate-700">
                            {news.title}
                          </Link>
                        </h3>
                        
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="truncate">{news.source}</span>
                          <span>{formatTimeAgo(news.published_at)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Featured Videos */}
            {featuredVideos && featuredVideos.length > 0 && (
              <Card className="border-slate-200">
                <CardHeader className="bg-slate-800 text-white">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Play className="h-5 w-5" />
                    Vídeos em Destaque
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-4">
                  {featuredVideos.slice(0, 6).map((video) => (
                    <div key={video.id} className="group">
                      <Link href={video.url} target="_blank" rel="noopener noreferrer">
                        <div className="flex gap-3">
                          <div className="relative w-20 h-14 bg-slate-200 rounded overflow-hidden flex-shrink-0">
                            {video.thumbnail_url && (
                              <Image
                                src={video.thumbnail_url}
                                alt={video.title}
                                fill
                                className="object-cover"
                              />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                              <Play className="h-3 w-3 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-slate-700 text-slate-900">
                              {video.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1">{video.channel_name}</p>
                            <p className="text-xs text-slate-400 mt-1">{video.view_count?.toLocaleString()} visualizações</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                  
                  <Button className="w-full mt-4 bg-slate-800 hover:bg-slate-700" asChild>
                    <Link href="/videos">
                      Ver todos os vídeos
                      <Play className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Links */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg text-slate-900">Acesso Rápido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4">
                <Link 
                  href="/resolucao-996" 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <span className="font-medium text-slate-700">Resolução 996</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
                <Link 
                  href="/ferramentas" 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <span className="font-medium text-slate-700">Ferramentas</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
                <Link 
                  href="/biblioteca" 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <span className="font-medium text-slate-700">Biblioteca</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
                <Link 
                  href="/faq" 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <span className="font-medium text-slate-700">FAQ</span>
                  <ArrowRight className="h-4 w-4 text-slate-400" />
                </Link>
              </CardContent>
            </Card>

            {/* Newsletter */}
            <Card className="bg-slate-800 border-slate-700 text-white">
              <CardHeader>
                <CardTitle className="text-lg">Newsletter</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-slate-300 mb-4">
                  Receba as últimas notícias e atualizações sobre equipamentos autopropelidos.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Seu email"
                    className="w-full px-3 py-2 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 bg-slate-700 text-white placeholder-slate-400"
                  />
                  <Button className="w-full bg-white text-slate-900 hover:bg-slate-100">
                    Assinar Grátis
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
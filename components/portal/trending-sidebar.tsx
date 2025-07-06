'use client'

import { useState, useEffect } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { 
  TrendingUp, 
  Clock, 
  Eye, 
  Heart, 
  MessageCircle,
  Share2,
  Mail,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Youtube,
  Rss,
  BookOpen,
  Users,
  Calendar,
  Sun,
  Cloud,
  CloudRain,
  Wind,
  Thermometer,
  Zap,
  MapPin,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface TrendingTopic {
  id: string
  title: string
  hashtag: string
  posts: number
  growth: number
  category: string
  url: string
}

interface PopularArticle {
  id: string
  title: string
  views: number
  timeframe: 'hour' | 'day' | 'week'
  url: string
  category: string
  author: string
  published_at: string
  reading_time: number
}

interface SocialPost {
  id: string
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin'
  content: string
  url: string
  likes: number
  shares: number
  timestamp: string
}

interface WeatherData {
  location: string
  temperature: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'windy'
  humidity: number
  windSpeed: number
  description: string
}

export default function TrendingSidebar() {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [popularArticles, setPopularArticles] = useState<PopularArticle[]>([])
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([])
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [newsletter, setNewsletter] = useState({ email: '', name: '' })
  const [isNewsletterLoading, setIsNewsletterLoading] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'hour' | 'day' | 'week'>('day')

  // Mock data loading
  useEffect(() => {
    const loadTrendingData = () => {
      const mockTrendingTopics: TrendingTopic[] = [
        {
          id: '1',
          title: 'Patinetes Elétricos CONTRAN',
          hashtag: '#PatinetesCONTRAN',
          posts: 1247,
          growth: 85,
          category: 'regulation',
          url: '/busca?q=patinetes+eletricos+contran'
        },
        {
          id: '2',
          title: 'Ciclofaixas São Paulo',
          hashtag: '#CiclofaixasSP',
          posts: 892,
          growth: 42,
          category: 'urban_mobility',
          url: '/busca?q=ciclofaixas+sao+paulo'
        },
        {
          id: '3',
          title: 'Delivery Sustentável',
          hashtag: '#DeliverySustentavel',
          posts: 734,
          growth: 67,
          category: 'technology',
          url: '/busca?q=delivery+sustentavel'
        },
        {
          id: '4',
          title: 'Mobilidade Urbana 2024',
          hashtag: '#MobilidadeUrbana2024',
          posts: 623,
          growth: 23,
          category: 'urban_mobility',
          url: '/busca?q=mobilidade+urbana+2024'
        },
        {
          id: '5',
          title: 'Segurança Viária',
          hashtag: '#SegurancaViaria',
          posts: 445,
          growth: 18,
          category: 'safety',
          url: '/busca?q=seguranca+viaria'
        }
      ]

      const mockPopularArticles: PopularArticle[] = [
        {
          id: '1',
          title: 'CONTRAN aprova novas regras para patinetes elétricos',
          views: 12540,
          timeframe: 'hour',
          url: '/noticias/contran-novas-regras-patinetes',
          category: 'regulation',
          author: 'Redação',
          published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          reading_time: 3
        },
        {
          id: '2',
          title: 'São Paulo expande rede de ciclofaixas em 2024',
          views: 8920,
          timeframe: 'day',
          url: '/noticias/sao-paulo-expande-ciclofaixas',
          category: 'urban_mobility',
          author: 'Ana Silva',
          published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          reading_time: 5
        },
        {
          id: '3',
          title: 'Delivery por bicicletas elétricas cresce 200%',
          views: 7650,
          timeframe: 'day',
          url: '/noticias/delivery-bicicletas-eletricas-crescimento',
          category: 'technology',
          author: 'João Santos',
          published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          reading_time: 4
        },
        {
          id: '4',
          title: 'Segurança em equipamentos autopropelidos',
          views: 6780,
          timeframe: 'week',
          url: '/noticias/seguranca-equipamentos-autopropelidos',
          category: 'safety',
          author: 'Maria Costa',
          published_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          reading_time: 6
        },
        {
          id: '5',
          title: 'Multas por uso incorreto de patinetes aumentam',
          views: 5420,
          timeframe: 'week',
          url: '/noticias/multas-patinetes-uso-incorreto',
          category: 'regulation',
          author: 'Pedro Lima',
          published_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
          reading_time: 3
        }
      ]

      const mockSocialPosts: SocialPost[] = [
        {
          id: '1',
          platform: 'twitter',
          content: 'Novo limite de velocidade para patinetes elétricos aprovado pelo CONTRAN! 🛴⚡',
          url: 'https://twitter.com/autopropelidos/status/1234567890',
          likes: 245,
          shares: 67,
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          platform: 'facebook',
          content: 'São Paulo ganha novas ciclofaixas para equipamentos autopropelidos! 🚴‍♂️',
          url: 'https://facebook.com/autopropelidos/posts/1234567890',
          likes: 189,
          shares: 43,
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          platform: 'instagram',
          content: 'Dicas de segurança para usar patinetes elétricos na cidade 🛡️',
          url: 'https://instagram.com/p/1234567890',
          likes: 324,
          shares: 89,
          timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString()
        }
      ]

      const mockWeatherData: WeatherData = {
        location: 'São Paulo, SP',
        temperature: 24,
        condition: 'cloudy',
        humidity: 68,
        windSpeed: 12,
        description: 'Parcialmente nublado'
      }

      setTrendingTopics(mockTrendingTopics)
      setPopularArticles(mockPopularArticles)
      setSocialPosts(mockSocialPosts)
      setWeatherData(mockWeatherData)
    }

    loadTrendingData()
  }, [])

  const formatViews = (views: number) => {
    if (views < 1000) return views.toString()
    if (views < 1000000) return `${(views / 1000).toFixed(1)}K`
    return `${(views / 1000000).toFixed(1)}M`
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Agora'
    if (diffInHours < 24) return `${diffInHours}h`
    return `${Math.floor(diffInHours / 24)}d`
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="h-4 w-4" />
      case 'facebook': return <Facebook className="h-4 w-4" />
      case 'instagram': return <Instagram className="h-4 w-4" />
      case 'linkedin': return <Linkedin className="h-4 w-4" />
      default: return <Share2 className="h-4 w-4" />
    }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="h-5 w-5 text-yellow-500" />
      case 'cloudy': return <Cloud className="h-5 w-5 text-gray-500" />
      case 'rainy': return <CloudRain className="h-5 w-5 text-blue-500" />
      case 'windy': return <Wind className="h-5 w-5 text-gray-400" />
      default: return <Sun className="h-5 w-5 text-yellow-500" />
    }
  }

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsNewsletterLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Newsletter inscrita com sucesso!",
        description: "Você receberá nossas últimas notícias em seu email.",
      })
      
      setNewsletter({ email: '', name: '' })
    } catch (error) {
      toast({
        title: "Erro ao inscrever newsletter",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      })
    } finally {
      setIsNewsletterLoading(false)
    }
  }

  const filteredArticles = popularArticles.filter(article => article.timeframe === selectedTimeframe)

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Trending Topics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-red-500" />
            Trending Topics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <Link key={topic.id} href={topic.url}>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                    index === 0 ? "bg-red-500 text-white" :
                    index === 1 ? "bg-orange-500 text-white" :
                    index === 2 ? "bg-yellow-500 text-white" :
                    "bg-gray-200 text-gray-600"
                  )}>
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{topic.title}</h4>
                    <p className="text-xs text-gray-500">{topic.hashtag}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{topic.posts} posts</div>
                  <div className={cn(
                    "text-xs flex items-center gap-1",
                    topic.growth > 50 ? "text-green-600" : "text-orange-600"
                  )}>
                    {topic.growth > 50 ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    {topic.growth}%
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Most Read Articles */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-500" />
            Mais Lidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTimeframe} onValueChange={(value: any) => setSelectedTimeframe(value)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hour" className="text-xs">Hora</TabsTrigger>
              <TabsTrigger value="day" className="text-xs">Hoje</TabsTrigger>
              <TabsTrigger value="week" className="text-xs">Semana</TabsTrigger>
            </TabsList>
            
            <TabsContent value={selectedTimeframe} className="mt-4 space-y-3">
              {filteredArticles.map((article, index) => (
                <Link key={article.id} href={article.url}>
                  <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-2">{article.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <Eye className="h-3 w-3" />
                          <span>{formatViews(article.views)}</span>
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(article.published_at)}</span>
                          <span>•</span>
                          <BookOpen className="h-3 w-3" />
                          <span>{article.reading_time} min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Social Media Integration */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="h-5 w-5 text-purple-500" />
            Redes Sociais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {socialPosts.map((post) => (
            <Link key={post.id} href={post.url} target="_blank" rel="noopener noreferrer">
              <div className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                <div className="flex items-start gap-3">
                  <div className="text-gray-500">
                    {getPlatformIcon(post.platform)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{post.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-3 w-3" />
                        <span>{post.shares}</span>
                      </div>
                      <span>{formatTime(post.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {/* Social Follow */}
          <div className="border-t pt-3">
            <p className="text-sm text-gray-600 mb-3">Siga-nos nas redes sociais:</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Signup */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5 text-green-500" />
            Newsletter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleNewsletterSubmit} className="space-y-3">
            <div>
              <Label htmlFor="newsletter-name" className="text-sm">Nome</Label>
              <Input
                id="newsletter-name"
                type="text"
                placeholder="Seu nome"
                value={newsletter.name}
                onChange={(e) => setNewsletter(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="newsletter-email" className="text-sm">Email</Label>
              <Input
                id="newsletter-email"
                type="email"
                placeholder="seu@email.com"
                value={newsletter.email}
                onChange={(e) => setNewsletter(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isNewsletterLoading}
            >
              {isNewsletterLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Inscrevendo...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Inscrever
                </>
              )}
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Receba as últimas notícias sobre mobilidade urbana diretamente em seu email.
          </p>
        </CardContent>
      </Card>

      {/* Weather Widget */}
      {weatherData && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              {getWeatherIcon(weatherData.condition)}
              Clima
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">{weatherData.location}</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {weatherData.temperature}°C
              </div>
              <p className="text-sm text-gray-600 mb-3">{weatherData.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span>Umidade: {weatherData.humidity}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="h-3 w-3 text-gray-500" />
                  <span>Vento: {weatherData.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            Estatísticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1.2K</div>
              <div className="text-xs text-gray-500">Artigos publicados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">45K</div>
              <div className="text-xs text-gray-500">Leitores mensais</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">890</div>
              <div className="text-xs text-gray-500">Vídeos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">156</div>
              <div className="text-xs text-gray-500">Ferramentas</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
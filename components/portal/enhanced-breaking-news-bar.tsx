'use client'

import { useState, useEffect, useRef } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { 
  AlertCircle, 
  Clock, 
  TrendingUp, 
  Volume2, 
  VolumeX, 
  Share2,
  ExternalLink,
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface BreakingNewsItem {
  id: string
  title: string
  description: string
  url: string
  timestamp: string
  priority: 'urgent' | 'breaking' | 'high' | 'normal'
  category: string
  source: string
  image_url?: string
  author?: string
  reading_time?: number
  views?: number
}

interface EnhancedBreakingNewsBarProps {
  news: BreakingNewsItem[]
  enableSound?: boolean
  autoRotate?: boolean
  rotationSpeed?: number
  showFullDescription?: boolean
  enableNotifications?: boolean
}

export default function EnhancedBreakingNewsBar({ 
  news, 
  enableSound = true,
  autoRotate = true,
  rotationSpeed = 5000,
  showFullDescription = false,
  enableNotifications = true
}: EnhancedBreakingNewsBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedNews, setSelectedNews] = useState<BreakingNewsItem | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(enableSound)
  const [hasPlayedSound, setHasPlayedSound] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  if (!news || news.length === 0) return null

  // Filter and sort news by priority
  const priorityOrder = { urgent: 4, breaking: 3, high: 2, normal: 1 }
  const sortedNews = [...news].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
  const urgentNews = sortedNews.filter(item => item.priority === 'urgent' || item.priority === 'breaking')
  const displayNews = urgentNews.length > 0 ? urgentNews : sortedNews.slice(0, 5)

  // Auto-rotation effect
  useEffect(() => {
    if (!autoRotate || isPaused || displayNews.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayNews.length)
    }, rotationSpeed)

    return () => clearInterval(interval)
  }, [autoRotate, isPaused, displayNews.length, rotationSpeed])

  // Sound notification for urgent news
  useEffect(() => {
    if (soundEnabled && !hasPlayedSound && urgentNews.length > 0) {
      // Create audio element for notification sound
      if (!audioRef.current) {
        audioRef.current = new Audio('/sounds/notification.mp3')
        audioRef.current.volume = 0.3
      }
      
      audioRef.current.play().catch(() => {
        // Handle audio play failures silently
      })
      setHasPlayedSound(true)
    }
  }, [soundEnabled, hasPlayedSound, urgentNews.length])

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return {
          badge: 'URGENTE',
          color: 'bg-red-600 text-white',
          bgColor: 'bg-red-600',
          textColor: 'text-white',
          animation: 'animate-pulse'
        }
      case 'breaking':
        return {
          badge: 'ÚLTIMO MINUTO',
          color: 'bg-orange-600 text-white',
          bgColor: 'bg-orange-600',
          textColor: 'text-white',
          animation: 'animate-bounce'
        }
      case 'high':
        return {
          badge: 'IMPORTANTE',
          color: 'bg-blue-600 text-white',
          bgColor: 'bg-blue-600',
          textColor: 'text-white',
          animation: ''
        }
      default:
        return {
          badge: 'NOTÍCIA',
          color: 'bg-gray-600 text-white',
          bgColor: 'bg-gray-600',
          textColor: 'text-white',
          animation: ''
        }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Agora mesmo'
    if (diffInMinutes < 60) return `${diffInMinutes} min`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} h`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  const handleNewsClick = (newsItem: BreakingNewsItem) => {
    setSelectedNews(newsItem)
    setIsExpanded(true)
  }

  const handleShare = async (newsItem: BreakingNewsItem) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: newsItem.title,
          text: newsItem.description,
          url: newsItem.url
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(newsItem.url)
      }
    } else {
      navigator.clipboard.writeText(newsItem.url)
    }
  }

  const currentNews = displayNews[currentIndex]
  const priorityConfig = getPriorityConfig(currentNews.priority)

  return (
    <>
      <div 
        className={cn(
          "breaking-news-bar text-white py-3 px-4 overflow-hidden relative",
          priorityConfig.bgColor
        )}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30 animate-pulse" />
        
        <div className="container mx-auto relative">
          <div className="flex items-center gap-4">
            {/* Breaking News Label with Sound Control */}
            <div className="flex items-center gap-3 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <AlertCircle className={cn("h-5 w-5", priorityConfig.animation)} />
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-xs font-bold border-0 shadow-sm",
                    priorityConfig.color
                  )}
                >
                  {priorityConfig.badge}
                </Badge>
              </div>
              
              {/* Sound Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            </div>

            {/* News Content */}
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => handleNewsClick(currentNews)}>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm leading-tight line-clamp-1 hover:line-clamp-none transition-all">
                        {currentNews.title}
                      </h3>
                      {showFullDescription && (
                        <p className="text-xs text-white/90 mt-1 line-clamp-2">
                          {currentNews.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 text-xs text-white/90">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(currentNews.timestamp)}</span>
                      </div>
                      <span className="font-medium">{currentNews.source}</span>
                    </div>
                  </div>
                </div>

                {/* Navigation Controls */}
                {displayNews.length > 1 && (
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentIndex((prev) => (prev - 1 + displayNews.length) % displayNews.length)}
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {displayNews.map((_, index) => (
                        <div
                          key={index}
                          className={cn(
                            "h-1.5 w-1.5 rounded-full transition-all",
                            index === currentIndex ? "bg-white" : "bg-white/40"
                          )}
                        />
                      ))}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentIndex((prev) => (prev + 1) % displayNews.length)}
                      className="h-8 w-8 p-0 text-white hover:bg-white/20"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleShare(currentNews)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>

              <Link href="/noticias?categoria=breaking">
                <Button 
                  size="sm" 
                  variant="secondary"
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors text-xs"
                >
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Ver mais
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded News Modal */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold pr-8">
              {selectedNews?.title}
            </DialogTitle>
          </DialogHeader>
          
          {selectedNews && (
            <div className="space-y-4">
              {/* News Meta */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <Badge className={getPriorityConfig(selectedNews.priority).color}>
                    {getPriorityConfig(selectedNews.priority).badge}
                  </Badge>
                  <span>{selectedNews.source}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(selectedNews.timestamp)}</span>
                  </div>
                  {selectedNews.reading_time && (
                    <span>{selectedNews.reading_time} min de leitura</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare(selectedNews)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                  
                  <Link href={selectedNews.url} target="_blank" rel="noopener noreferrer">
                    <Button size="sm">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ler completo
                    </Button>
                  </Link>
                </div>
              </div>

              {/* News Content */}
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {selectedNews.description}
                </p>
              </div>

              {/* Related News */}
              {displayNews.length > 1 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">Outras notícias em destaque</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {displayNews
                      .filter(item => item.id !== selectedNews.id)
                      .slice(0, 4)
                      .map((item) => (
                        <Card key={item.id} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
                          <div onClick={() => setSelectedNews(item)}>
                            <div className="flex items-start gap-3">
                              <Badge 
                                className={cn("text-xs", getPriorityConfig(item.priority).color)}
                              >
                                {getPriorityConfig(item.priority).badge}
                              </Badge>
                              <div className="flex-1">
                                <h5 className="font-medium text-sm line-clamp-2">
                                  {item.title}
                                </h5>
                                <p className="text-xs text-gray-600 mt-1">
                                  {formatDate(item.timestamp)} • {item.source}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

// Hook para gerenciar notícias breaking news
export function useEnhancedBreakingNews(): BreakingNewsItem[] {
  const [news, setNews] = useState<BreakingNewsItem[]>([])

  useEffect(() => {
    // Simular dados de breaking news
    const mockBreakingNews: BreakingNewsItem[] = [
      {
        id: '1',
        title: 'URGENTE: CONTRAN aprova novas regras para patinetes elétricos com limite de 25 km/h',
        description: 'A nova resolução estabelece velocidade máxima de 25 km/h para patinetes elétricos em vias públicas, além de tornar obrigatório o uso de capacete e equipamentos de segurança. A medida entra em vigor em 60 dias.',
        url: '/noticias/contran-novas-regras-patinetes-2024',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        priority: 'urgent',
        category: 'regulation',
        source: 'CONTRAN',
        author: 'Redação',
        reading_time: 3,
        views: 12540
      },
      {
        id: '2',
        title: 'ÚLTIMO MINUTO: São Paulo proíbe circulação de bicicletas elétricas em calçadas',
        description: 'A prefeitura de São Paulo anunciou nova regulamentação que proíbe o uso de bicicletas elétricas em calçadas do centro da cidade. Multa pode chegar a R$ 500.',
        url: '/noticias/sao-paulo-proibe-bicicletas-calcadas',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        priority: 'breaking',
        category: 'urban_mobility',
        source: 'Prefeitura SP',
        author: 'João Silva',
        reading_time: 2,
        views: 8920
      },
      {
        id: '3',
        title: 'Delivery por bicicletas elétricas cresce 300% no Brasil em 2024',
        description: 'Setor de delivery registra crescimento expressivo no uso de bicicletas elétricas, impulsionado por novas regulamentações e incentivos fiscais.',
        url: '/noticias/crescimento-delivery-bicicletas-eletricas',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        priority: 'high',
        category: 'technology',
        source: 'Portal Mobilidade',
        author: 'Ana Costa',
        reading_time: 4,
        views: 6780
      },
      {
        id: '4',
        title: 'Rio de Janeiro expande ciclofaixas para equipamentos autopropelidos',
        description: 'A cidade do Rio de Janeiro anunciou a expansão da rede de ciclofaixas para incluir equipamentos autopropelidos, beneficiando milhares de usuários.',
        url: '/noticias/rio-expande-ciclofaixas',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        category: 'urban_mobility',
        source: 'Prefeitura RJ',
        author: 'Carlos Mendes',
        reading_time: 3,
        views: 5420
      },
      {
        id: '5',
        title: 'Multas por uso incorreto de patinetes aumentam 150% em capitais brasileiras',
        description: 'Levantamento mostra crescimento significativo nas multas aplicadas por uso incorreto de patinetes elétricos nas principais capitais do país.',
        url: '/noticias/multas-patinetes-aumentam',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        priority: 'normal',
        category: 'safety',
        source: 'Detran Nacional',
        author: 'Maria Santos',
        reading_time: 5,
        views: 4120
      }
    ]

    setNews(mockBreakingNews)
  }, [])

  return news
}
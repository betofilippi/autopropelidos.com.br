'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { 
  Search, 
  Filter, 
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Menu,
  X,
  Heart,
  Share2,
  Bookmark,
  Eye,
  Clock,
  TrendingUp,
  Calendar,
  Tag,
  User,
  MapPin,
  Grid3X3,
  List,
  Settings,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Plus,
  Minus,
  Play,
  Pause,
  Volume2,
  Loader2,
  Zap,
  Star,
  MessageCircle,
  ExternalLink,
  Download,
  Home,
  News,
  Video,
  Tool,
  Info
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface MobileNewsItem {
  id: string
  title: string
  description: string
  image: string
  category: string
  source: string
  published_at: string
  views: number
  likes: number
  reading_time: number
  url: string
  tags: string[]
}

interface SwipeGestureHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

// Hook for swipe gestures
function useSwipeGestures(handlers: SwipeGestureHandlers, threshold = 50) {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const touchEndRef = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    }
  }

  const handleTouchEnd = () => {
    if (!touchStartRef.current || !touchEndRef.current) return

    const deltaX = touchEndRef.current.x - touchStartRef.current.x
    const deltaY = touchEndRef.current.y - touchStartRef.current.y

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          handlers.onSwipeRight?.()
        } else {
          handlers.onSwipeLeft?.()
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          handlers.onSwipeDown?.()
        } else {
          handlers.onSwipeUp?.()
        }
      }
    }

    touchStartRef.current = null
    touchEndRef.current = null
  }

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd
  }
}

// Pull to Refresh Component
function PullToRefresh({ 
  onRefresh, 
  children, 
  threshold = 80 
}: { 
  onRefresh: () => Promise<void>
  children: React.ReactNode
  threshold?: number 
}) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [canRefresh, setCanRefresh] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0 && !isRefreshing) {
      const currentY = e.touches[0].clientY
      const distance = Math.max(0, currentY - startY.current)
      setPullDistance(distance)
      setCanRefresh(distance > threshold)
    }
  }

  const handleTouchEnd = async () => {
    if (canRefresh && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
        toast({
          title: "Atualizado",
          description: "Conteúdo atualizado com sucesso!",
        })
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao atualizar. Tente novamente.",
          variant: "destructive"
        })
      } finally {
        setIsRefreshing(false)
      }
    }
    setPullDistance(0)
    setCanRefresh(false)
  }

  const refreshIndicatorHeight = Math.min(pullDistance, 60)
  const refreshProgress = Math.min(pullDistance / threshold, 1)

  return (
    <div
      ref={containerRef}
      className="relative overflow-auto h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to Refresh Indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 z-50"
        style={{ 
          height: refreshIndicatorHeight,
          transform: `translateY(${refreshIndicatorHeight - 60}px)`
        }}
      >
        <div className="bg-white rounded-full p-2 shadow-lg border">
          {isRefreshing ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <RefreshCw 
              className={cn(
                "h-6 w-6 transition-all duration-200",
                canRefresh ? "text-primary" : "text-gray-400"
              )}
              style={{ 
                transform: `rotate(${refreshProgress * 180}deg)` 
              }}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ paddingTop: isRefreshing ? 60 : 0 }}>
        {children}
      </div>
    </div>
  )
}

// Swipeable News Cards
function SwipeableNewsCard({ 
  news, 
  onLike, 
  onSave, 
  onShare 
}: { 
  news: MobileNewsItem
  onLike: (id: string) => void
  onSave: (id: string) => void
  onShare: (news: MobileNewsItem) => void
}) {
  const [swipeOffset, setSwipeOffset] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const swipeHandlers = useSwipeGestures({
    onSwipeLeft: () => {
      setIsLiked(!isLiked)
      onLike(news.id)
      toast({
        title: isLiked ? "Like removido" : "Curtido!",
        description: news.title,
      })
    },
    onSwipeRight: () => {
      setIsSaved(!isSaved)
      onSave(news.id)
      toast({
        title: isSaved ? "Removido dos salvos" : "Salvo!",
        description: news.title,
      })
    }
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Agora'
    if (diffInHours < 24) return `${diffInHours}h`
    return `${Math.floor(diffInHours / 24)}d`
  }

  const formatViews = (views: number) => {
    if (views < 1000) return views.toString()
    if (views < 1000000) return `${(views / 1000).toFixed(1)}K`
    return `${(views / 1000000).toFixed(1)}M`
  }

  return (
    <div
      ref={cardRef}
      className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden touch-manipulation"
      {...swipeHandlers}
    >
      {/* Swipe Actions Background */}
      <div className="absolute inset-0 flex">
        <div className="flex-1 bg-green-500 flex items-center justify-start pl-6">
          <div className="text-white">
            <Bookmark className="h-6 w-6 mb-1" />
            <span className="text-sm font-medium">Salvar</span>
          </div>
        </div>
        <div className="flex-1 bg-red-500 flex items-center justify-end pr-6">
          <div className="text-white text-right">
            <Heart className="h-6 w-6 mb-1 ml-auto" />
            <span className="text-sm font-medium">Curtir</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div 
        className="relative bg-white transition-transform duration-200"
        style={{ transform: `translateX(${swipeOffset}px)` }}
      >
        <Link href={news.url}>
          <div className="flex gap-4 p-4">
            <div className="relative w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={news.image} 
                alt={news.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-2 left-2">
                <Badge variant="secondary" className="text-xs px-1 py-0.5">
                  {news.category}
                </Badge>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm line-clamp-2 text-gray-900 mb-2">
                {news.title}
              </h3>
              
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <span>{news.source}</span>
                <span>•</span>
                <span>{formatDate(news.published_at)}</span>
                <span>•</span>
                <span>{news.reading_time} min</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{formatViews(news.views)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className={cn("h-3 w-3", isLiked ? "fill-red-500 text-red-500" : "")} />
                    <span>{news.likes + (isLiked ? 1 : 0)}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      onShare(news)
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Share2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

// Bottom Sheet for Filters
function MobileFilterSheet({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange 
}: {
  isOpen: boolean
  onClose: () => void
  filters: any
  onFiltersChange: (filters: any) => void
}) {
  const [localFilters, setLocalFilters] = useState(filters)

  const applyFilters = () => {
    onFiltersChange(localFilters)
    onClose()
    toast({
      title: "Filtros aplicados",
      description: "Os resultados foram atualizados.",
    })
  }

  const clearFilters = () => {
    const clearedFilters = {
      category: [],
      type: [],
      dateRange: 'all',
      sortBy: 'relevance'
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
    onClose()
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 py-4">
          {/* Categories */}
          <div>
            <Label className="text-base font-medium mb-3 block">Categorias</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'regulation', label: 'Regulamentação' },
                { value: 'safety', label: 'Segurança' },
                { value: 'technology', label: 'Tecnologia' },
                { value: 'urban_mobility', label: 'Mobilidade' }
              ].map((category) => (
                <div key={category.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.value}
                    checked={localFilters.category.includes(category.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setLocalFilters({
                          ...localFilters,
                          category: [...localFilters.category, category.value]
                        })
                      } else {
                        setLocalFilters({
                          ...localFilters,
                          category: localFilters.category.filter((c: string) => c !== category.value)
                        })
                      }
                    }}
                  />
                  <Label htmlFor={category.value} className="text-sm">{category.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Content Type */}
          <div>
            <Label className="text-base font-medium mb-3 block">Tipo de Conteúdo</Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'article', label: 'Artigos' },
                { value: 'video', label: 'Vídeos' },
                { value: 'tool', label: 'Ferramentas' },
                { value: 'regulation', label: 'Regulamentações' }
              ].map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={type.value}
                    checked={localFilters.type.includes(type.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setLocalFilters({
                          ...localFilters,
                          type: [...localFilters.type, type.value]
                        })
                      } else {
                        setLocalFilters({
                          ...localFilters,
                          type: localFilters.type.filter((t: string) => t !== type.value)
                        })
                      }
                    }}
                  />
                  <Label htmlFor={type.value} className="text-sm">{type.label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <Label className="text-base font-medium mb-3 block">Período</Label>
            <Select
              value={localFilters.dateRange}
              onValueChange={(value) => setLocalFilters({ ...localFilters, dateRange: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os períodos</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
                <SelectItem value="year">Este ano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div>
            <Label className="text-base font-medium mb-3 block">Ordenar por</Label>
            <Select
              value={localFilters.sortBy}
              onValueChange={(value) => setLocalFilters({ ...localFilters, sortBy: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="views">Visualizações</SelectItem>
                <SelectItem value="likes">Curtidas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" onClick={clearFilters} className="flex-1">
            Limpar
          </Button>
          <Button onClick={applyFilters} className="flex-1">
            Aplicar Filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Sticky Header with Search
function StickyMobileHeader({ 
  searchQuery, 
  onSearchChange, 
  onFilterClick, 
  resultsCount 
}: {
  searchQuery: string
  onSearchChange: (query: string) => void
  onFilterClick: () => void
  resultsCount: number
}) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={cn(
      "sticky top-0 z-40 bg-white transition-all duration-200",
      isScrolled ? "shadow-md" : "shadow-sm"
    )}>
      <div className="px-4 py-3 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
          <Button variant="outline" size="sm" onClick={onFilterClick}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        {resultsCount > 0 && (
          <div className="text-sm text-gray-600">
            {resultsCount} resultado{resultsCount !== 1 ? 's' : ''} encontrado{resultsCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  )
}

// Infinite Scroll Component
function InfiniteScrollContainer({ 
  items, 
  renderItem, 
  onLoadMore, 
  hasMore, 
  isLoading 
}: {
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
}) {
  const [shouldLoadMore, setShouldLoadMore] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasMore && !isLoading) {
          setShouldLoadMore(true)
        }
      },
      { threshold: 0.1 }
    )

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoading])

  useEffect(() => {
    if (shouldLoadMore) {
      onLoadMore()
      setShouldLoadMore(false)
    }
  }, [shouldLoadMore, onLoadMore])

  return (
    <div className="space-y-3">
      {items.map((item, index) => renderItem(item, index))}
      
      {hasMore && (
        <div ref={loaderRef} className="py-4 text-center">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-gray-600">Carregando mais...</span>
            </div>
          ) : (
            <Button variant="outline" onClick={onLoadMore} className="w-full">
              Carregar mais
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Main Mobile Portal Component
export default function MobileFirstPortal() {
  const [newsItems, setNewsItems] = useState<MobileNewsItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: [],
    type: [],
    dateRange: 'all',
    sortBy: 'relevance'
  })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  // Mock data
  const mockNews: MobileNewsItem[] = [
    {
      id: '1',
      title: 'CONTRAN aprova novas regras para patinetes elétricos em 2024',
      description: 'Novas regulamentações estabelecem limites de velocidade e equipamentos obrigatórios.',
      image: '/images/news-placeholder.jpg',
      category: 'Regulamentação',
      source: 'CONTRAN',
      published_at: new Date().toISOString(),
      views: 12540,
      likes: 892,
      reading_time: 5,
      url: '/noticias/contran-patinetes-2024',
      tags: ['CONTRAN', 'patinetes', 'regulamentação']
    },
    {
      id: '2',
      title: 'São Paulo expande rede de ciclofaixas para equipamentos autopropelidos',
      description: 'Cidade investe em infraestrutura para mobilidade urbana sustentável.',
      image: '/images/news-placeholder.jpg',
      category: 'Mobilidade',
      source: 'Prefeitura SP',
      published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      views: 8920,
      likes: 445,
      reading_time: 3,
      url: '/noticias/sao-paulo-ciclofaixas',
      tags: ['São Paulo', 'ciclofaixas', 'mobilidade']
    },
    {
      id: '3',
      title: 'Segurança no trânsito: Dicas essenciais para usuários de bicicletas elétricas',
      description: 'Guia completo com as melhores práticas de segurança no trânsito urbano.',
      image: '/images/video-placeholder.jpg',
      category: 'Segurança',
      source: 'Canal Autopropelidos',
      published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      views: 15230,
      likes: 1205,
      reading_time: 8,
      url: '/videos/seguranca-bicicletas-eletricas',
      tags: ['segurança', 'bicicletas', 'dicas']
    }
  ]

  // Initialize data
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setNewsItems(mockNews)
    setIsLoading(false)
  }

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500))
    setNewsItems(mockNews)
    setPage(1)
    setHasMore(true)
  }

  const handleLoadMore = async () => {
    if (isLoading || !hasMore) return
    
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Simulate loading more items
    const newItems = mockNews.map(item => ({
      ...item,
      id: `${item.id}-${page}`,
      title: `${item.title} (Página ${page + 1})`
    }))
    
    setNewsItems(prev => [...prev, ...newItems])
    setPage(prev => prev + 1)
    
    // Simulate reaching end of data
    if (page >= 3) {
      setHasMore(false)
    }
    
    setIsLoading(false)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    // Implement search logic here
  }

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters)
    // Implement filter logic here
  }

  const handleLike = (id: string) => {
    setNewsItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, likes: item.likes + 1 }
          : item
      )
    )
  }

  const handleSave = (id: string) => {
    // Implement save logic
    console.log('Save news:', id)
  }

  const handleShare = (news: MobileNewsItem) => {
    if (navigator.share) {
      navigator.share({
        title: news.title,
        text: news.description,
        url: news.url
      })
    } else {
      navigator.clipboard.writeText(news.url)
      toast({
        title: "Link copiado",
        description: "O link foi copiado para a área de transferência.",
      })
    }
  }

  const filteredNews = useMemo(() => {
    return newsItems.filter(item => {
      const matchesSearch = !searchQuery || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = filters.category.length === 0 || 
        filters.category.includes(item.category.toLowerCase())
      
      return matchesSearch && matchesCategory
    })
  }, [newsItems, searchQuery, filters])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <StickyMobileHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        onFilterClick={() => setIsFilterOpen(true)}
        resultsCount={filteredNews.length}
      />

      {/* Content with Pull to Refresh */}
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="px-4 py-4 pb-20">
          {isLoading && newsItems.length === 0 ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                        <div className="h-3 bg-gray-200 rounded w-2/3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <InfiniteScrollContainer
              items={filteredNews}
              renderItem={(item, index) => (
                <SwipeableNewsCard
                  key={item.id}
                  news={item}
                  onLike={handleLike}
                  onSave={handleSave}
                  onShare={handleShare}
                />
              )}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              isLoading={isLoading}
            />
          )}
        </div>
      </PullToRefresh>

      {/* Bottom Navigation (optional) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-30">
        <div className="flex items-center justify-around">
          <Button variant="ghost" size="sm" className="flex-col gap-1">
            <Home className="h-4 w-4" />
            <span className="text-xs">Início</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col gap-1">
            <News className="h-4 w-4" />
            <span className="text-xs">Notícias</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col gap-1">
            <Video className="h-4 w-4" />
            <span className="text-xs">Vídeos</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex-col gap-1">
            <Tool className="h-4 w-4" />
            <span className="text-xs">Ferramentas</span>
          </Button>
        </div>
      </div>

      {/* Filter Bottom Sheet */}
      <MobileFilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
    </div>
  )
}

// Additional mobile components export
export {
  PullToRefresh,
  SwipeableNewsCard,
  MobileFilterSheet,
  StickyMobileHeader,
  InfiniteScrollContainer,
  useSwipeGestures
}
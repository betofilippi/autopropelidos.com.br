'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Bell, 
  Bookmark, 
  Share2, 
  Heart, 
  MessageCircle,
  Eye,
  Clock,
  ChevronDown,
  Zap,
  Globe,
  Smartphone,
  Wifi,
  WifiOff
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

// Mobile Components
import { useMobileAdvanced, useScrollDetection } from '@/hooks/use-mobile-advanced'
import { BottomNavigation, FloatingActionButton, QuickActionMenu } from './bottom-navigation'
import { SwipeCard, SwipeCardStack } from './swipe-card'
import { TouchCarousel, CompactTouchCarousel } from './touch-carousel'
import { PullToRefresh } from './pull-to-refresh'
import { VirtualScroll, InfiniteScroll } from './virtual-scroll'

interface NewsItem {
  id: string
  title: string
  description: string
  content?: string
  image_url?: string
  source: string
  category: string
  published_at: string
  url: string
  relevance_score: number
  views?: number
  likes?: number
  comments?: number
  reading_time?: number
  tags?: string[]
}

interface MobileNewsPageProps {
  initialNews: NewsItem[]
  onLoadMore: () => Promise<NewsItem[]>
  hasMore: boolean
  loading: boolean
}

export function MobileNewsPage({
  initialNews,
  onLoadMore,
  hasMore,
  loading
}: MobileNewsPageProps) {
  const { isMobile, isOnline, shouldOptimizeForPerformance } = useMobileAdvanced()
  const { scrollDirection, isNearTop, scrollProgress } = useScrollDetection()

  // State management
  const [news, setNews] = useState<NewsItem[]>(initialNews)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'cards' | 'swipe' | 'feed'>('cards')
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([])
  const [likedItems, setLikedItems] = useState<string[]>([])
  const [readItems, setReadItems] = useState<string[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showBreakingNews, setShowBreakingNews] = useState(true)

  // Categories
  const categories = [
    { id: 'all', label: 'Todas', icon: Globe },
    { id: 'regulation', label: 'Regulamentação', icon: Smartphone },
    { id: 'safety', label: 'Segurança', icon: Zap },
    { id: 'technology', label: 'Tecnologia', icon: Smartphone },
    { id: 'urban_mobility', label: 'Mobilidade', icon: Globe },
    { id: 'general', label: 'Geral', icon: Globe }
  ]

  // Filtered and sorted news
  const filteredNews = useMemo(() => {
    let filtered = news

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.source.toLowerCase().includes(query)
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    return filtered
  }, [news, searchQuery, selectedCategory])

  // Breaking news
  const breakingNews = useMemo(() => {
    return news.filter(item => item.relevance_score >= 85).slice(0, 5)
  }, [news])

  // Trending topics
  const trendingTopics = useMemo(() => {
    const topics = news.flatMap(item => item.tags || [])
    const topicCounts = topics.reduce((acc, topic) => {
      acc[topic] = (acc[topic] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([topic, count]) => ({ topic, count }))
  }, [news])

  // Handlers
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In real app, fetch fresh data
      console.log('Refreshing news...')
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  const handleLoadMore = useCallback(async () => {
    if (!hasMore || loading) return
    
    const newNews = await onLoadMore()
    setNews(prev => [...prev, ...newNews])
  }, [hasMore, loading, onLoadMore])

  const handleSwipe = useCallback((cardId: string, direction: 'left' | 'right' | 'up' | 'down') => {
    const item = news.find(n => n.id === cardId)
    if (!item) return

    switch (direction) {
      case 'left':
        // Dislike/Skip
        break
      case 'right':
        // Like/Save
        setLikedItems(prev => [...prev, cardId])
        setBookmarkedItems(prev => [...prev, cardId])
        break
      case 'up':
        // Bookmark
        setBookmarkedItems(prev => [...prev, cardId])
        break
      case 'down':
        // Share
        if (navigator.share) {
          navigator.share({
            title: item.title,
            text: item.description,
            url: item.url
          })
        }
        break
    }
  }, [news])

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'refresh':
        handleRefresh()
        break
      case 'search':
        // Focus search input
        break
      case 'filter':
        setShowFilters(true)
        break
      case 'bookmark':
        // Show bookmarks
        break
      case 'settings':
        // Show settings
        break
    }
  }

  const quickActions = [
    {
      id: 'refresh',
      label: 'Atualizar',
      icon: <TrendingUp className="w-6 h-6" />,
      onClick: () => handleQuickAction('refresh'),
      color: 'text-blue-600'
    },
    {
      id: 'search',
      label: 'Buscar',
      icon: <Search className="w-6 h-6" />,
      onClick: () => handleQuickAction('search'),
      color: 'text-green-600'
    },
    {
      id: 'filter',
      label: 'Filtrar',
      icon: <Filter className="w-6 h-6" />,
      onClick: () => handleQuickAction('filter'),
      color: 'text-purple-600'
    },
    {
      id: 'bookmark',
      label: 'Salvos',
      icon: <Bookmark className="w-6 h-6" />,
      onClick: () => handleQuickAction('bookmark'),
      color: 'text-orange-600'
    }
  ]

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffHours < 1) return 'Agora'
    if (diffHours < 24) return `há ${diffHours}h`
    if (diffDays === 1) return 'há 1 dia'
    if (diffDays < 7) return `há ${diffDays} dias`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      regulation: 'bg-blue-100 text-blue-800',
      safety: 'bg-red-100 text-red-800',
      technology: 'bg-purple-100 text-purple-800',
      urban_mobility: 'bg-green-100 text-green-800',
      general: 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || colors.general
  }

  const renderNewsCard = (item: NewsItem, index: number) => {
    const isBookmarked = bookmarkedItems.includes(item.id)
    const isLiked = likedItems.includes(item.id)
    const isRead = readItems.includes(item.id)

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="mb-4"
      >
        <Card className={cn(
          "overflow-hidden transition-all duration-200 hover:shadow-lg",
          isRead && "opacity-75"
        )}>
          {/* Image */}
          {item.image_url && (
            <div className="relative aspect-video overflow-hidden">
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              {/* Category badge */}
              <Badge className={cn("absolute top-3 left-3", getCategoryColor(item.category))}>
                {item.category}
              </Badge>
              
              {/* Reading time */}
              {item.reading_time && (
                <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {item.reading_time}min
                </div>
              )}
            </div>
          )}

          <CardContent className="p-4">
            {/* Source and date */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {item.source}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(item.published_at)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              {item.description}
            </p>

            {/* Tags */}
            {item.tags && (
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (isLiked) {
                      setLikedItems(prev => prev.filter(id => id !== item.id))
                    } else {
                      setLikedItems(prev => [...prev, item.id])
                    }
                  }}
                  className={cn(isLiked && "text-red-500")}
                >
                  <Heart className={cn("w-4 h-4 mr-1", isLiked && "fill-current")} />
                  <span className="text-sm">{item.likes || 0}</span>
                </Button>
                
                <Button variant="ghost" size="sm">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span className="text-sm">{item.comments || 0}</span>
                </Button>
                
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  <span className="text-sm">{item.views || 0}</span>
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (isBookmarked) {
                      setBookmarkedItems(prev => prev.filter(id => id !== item.id))
                    } else {
                      setBookmarkedItems(prev => [...prev, item.id])
                    }
                  }}
                  className={cn(isBookmarked && "text-blue-500")}
                >
                  <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: item.title,
                        text: item.description,
                        url: item.url
                      })
                    }
                  }}
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Offline indicator */}
      {!isOnline && (
        <div className="bg-red-500 text-white px-4 py-2 text-center text-sm">
          <WifiOff className="w-4 h-4 inline mr-2" />
          Sem conexão - Modo offline
        </div>
      )}

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800",
          scrollDirection === 'down' && !isNearTop && "transform -translate-y-full transition-transform duration-300"
        )}
      >
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Notícias
            </h1>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQuickActions(true)}
              >
                <Filter className="w-5 h-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBreakingNews(!showBreakingNews)}
              >
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar notícias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex overflow-x-auto space-x-2 scrollbar-hide">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex-shrink-0"
              >
                <category.icon className="w-4 h-4 mr-1" />
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800">
          <motion.div
            className="h-full bg-blue-600 dark:bg-blue-400"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </motion.header>

      {/* Breaking news */}
      {showBreakingNews && breakingNews.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4"
        >
          <div className="flex items-center mb-3">
            <Zap className="w-5 h-5 text-red-500 mr-2" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Últimas Notícias
            </h2>
          </div>
          
          <CompactTouchCarousel
            items={breakingNews.map(item => ({
              id: item.id,
              title: item.title,
              description: item.description,
              image: item.image_url,
              href: item.url
            }))}
            onItemClick={(item) => {
              setReadItems(prev => [...prev, item.id])
            }}
          />
        </motion.section>
      )}

      {/* Trending topics */}
      {trendingTopics.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4"
        >
          <div className="flex items-center mb-3">
            <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Tendências
            </h2>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {trendingTopics.map(({ topic, count }) => (
              <Button
                key={topic}
                variant="secondary"
                size="sm"
                onClick={() => setSearchQuery(topic)}
                className="flex items-center"
              >
                <span className="mr-1">#{topic}</span>
                <Badge variant="outline" className="ml-1 text-xs">
                  {count}
                </Badge>
              </Button>
            ))}
          </div>
        </motion.section>
      )}

      {/* View mode selector */}
      <div className="px-4 mb-4">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="swipe">Swipe</TabsTrigger>
            <TabsTrigger value="feed">Feed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="px-4">
          <AnimatePresence mode="wait">
            {viewMode === 'cards' && (
              <motion.div
                key="cards"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {filteredNews.map((item, index) => renderNewsCard(item, index))}
                
                {/* Load more */}
                {hasMore && (
                  <div className="text-center py-8">
                    <Button
                      variant="outline"
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="flex items-center"
                    >
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 mr-2"
                          >
                            <TrendingUp className="w-4 h-4" />
                          </motion.div>
                          Carregando...
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Carregar mais
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {viewMode === 'swipe' && (
              <motion.div
                key="swipe"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="min-h-96"
              >
                <SwipeCardStack
                  cards={filteredNews.map(item => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    image: item.image_url,
                    source: item.source,
                    category: item.category,
                    publishedAt: item.published_at,
                    url: item.url,
                    relevanceScore: item.relevance_score
                  }))}
                  onCardSwipe={handleSwipe}
                  maxVisible={3}
                />
              </motion.div>
            )}

            {viewMode === 'feed' && (
              <motion.div
                key="feed"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <InfiniteScroll
                  items={filteredNews.map(item => ({
                    id: item.id,
                    height: 200,
                    data: item
                  }))}
                  renderItem={(item) => renderNewsCard(item.data, 0)}
                  onLoadMore={handleLoadMore}
                  hasMore={hasMore}
                  loading={loading}
                  containerHeight={600}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PullToRefresh>

      {/* Floating Action Button */}
      <FloatingActionButton
        icon={<TrendingUp className="w-6 h-6" />}
        onClick={() => setShowQuickActions(true)}
        variant="primary"
      />

      {/* Quick Actions Menu */}
      <QuickActionMenu
        isOpen={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        actions={quickActions}
      />

      {/* Bottom Navigation */}
      <BottomNavigation
        items={[
          {
            id: 'home',
            label: 'Início',
            icon: <Globe className="w-5 h-5" />,
            href: '/'
          },
          {
            id: 'news',
            label: 'Notícias',
            icon: <TrendingUp className="w-5 h-5" />,
            href: '/noticias',
            badge: filteredNews.length
          },
          {
            id: 'bookmarks',
            label: 'Salvos',
            icon: <Bookmark className="w-5 h-5" />,
            href: '/salvos',
            badge: bookmarkedItems.length
          },
          {
            id: 'profile',
            label: 'Perfil',
            icon: <Eye className="w-5 h-5" />,
            href: '/perfil'
          }
        ]}
      />
    </div>
  )
}

export default MobileNewsPage
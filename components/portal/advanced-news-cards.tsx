'use client'

import { useState, useEffect, useRef } from 'react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { 
  Clock, 
  ExternalLink, 
  Share2, 
  Bookmark,
  BookmarkCheck,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  User,
  Calendar,
  Tag,
  Link2,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreHorizontal
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

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
  reading_time?: number
  views?: number
  likes?: number
  comments?: number
  relevance_score: number
  tags?: string[]
}

interface AdvancedNewsCardProps {
  news: NewsItem
  variant?: 'default' | 'compact' | 'featured' | 'minimal'
  showActions?: boolean
  showMetrics?: boolean
  showPreview?: boolean
  onSave?: (newsId: string) => void
  onLike?: (newsId: string) => void
  onShare?: (newsItem: NewsItem) => void
  savedNewsIds?: string[]
  likedNewsIds?: string[]
}

export default function AdvancedNewsCard({
  news,
  variant = 'default',
  showActions = true,
  showMetrics = true,
  showPreview = true,
  onSave,
  onLike,
  onShare,
  savedNewsIds = [],
  likedNewsIds = []
}: AdvancedNewsCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenViewed, setHasBeenViewed] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const isSaved = savedNewsIds.includes(news.id)
  const isLiked = likedNewsIds.includes(news.id)

  // Intersection Observer for visibility tracking
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
        if (entry.isIntersecting && !hasBeenViewed) {
          setHasBeenViewed(true)
          // Track view analytics
          trackNewsView(news.id)
        }
      },
      { threshold: 0.5 }
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [news.id, hasBeenViewed])

  const trackNewsView = (newsId: string) => {
    // Analytics tracking
    console.log(`News viewed: ${newsId}`)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'regulation': return 'bg-red-100 text-red-800 border-red-200'
      case 'safety': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'technology': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'urban_mobility': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
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
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Agora'
    if (diffInHours < 24) return `${diffInHours}h`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  const formatViews = (views: number) => {
    if (views < 1000) return views.toString()
    if (views < 1000000) return `${(views / 1000).toFixed(1)}K`
    return `${(views / 1000000).toFixed(1)}M`
  }

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200
    const words = text.split(' ').length
    return Math.ceil(words / wordsPerMinute)
  }

  const handleSave = () => {
    onSave?.(news.id)
    toast({
      title: isSaved ? "Removido dos salvos" : "Salvo com sucesso",
      description: isSaved ? "Notícia removida da sua lista." : "Notícia adicionada à sua lista.",
    })
  }

  const handleLike = () => {
    onLike?.(news.id)
    toast({
      title: isLiked ? "Like removido" : "Like adicionado",
      description: isLiked ? "Sua reação foi removida." : "Obrigado pela sua reação!",
    })
  }

  const handleShare = (platform?: string) => {
    const url = encodeURIComponent(news.url)
    const title = encodeURIComponent(news.title)
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(news.url)
        toast({
          title: "Link copiado",
          description: "O link foi copiado para a área de transferência.",
        })
        break
      default:
        onShare?.(news)
    }
    setIsShareOpen(false)
  }

  const getCardClassName = () => {
    const baseClasses = "news-card group relative overflow-hidden bg-white border border-gray-200 transition-all duration-300 hover:shadow-xl hover:border-primary/20"
    
    switch (variant) {
      case 'compact':
        return cn(baseClasses, "flex flex-row h-32")
      case 'featured':
        return cn(baseClasses, "row-span-2 col-span-2")
      case 'minimal':
        return cn(baseClasses, "shadow-none border-0 bg-transparent")
      default:
        return cn(baseClasses, "flex flex-col h-full")
    }
  }

  const getImageClassName = () => {
    switch (variant) {
      case 'compact':
        return "w-32 h-full flex-shrink-0"
      case 'featured':
        return "h-64"
      case 'minimal':
        return "h-40"
      default:
        return "h-48"
    }
  }

  return (
    <Card
      ref={cardRef}
      className={getCardClassName()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover Overlay */}
      {isHovered && showPreview && (
        <div className="absolute inset-0 bg-black/20 z-10 transition-opacity duration-300" />
      )}

      {/* News Image */}
      <div className={cn("relative bg-gray-100 overflow-hidden", getImageClassName())}>
        {news.image_url && (
          <Image
            src={news.image_url}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20">
          <Badge className={cn("text-xs font-medium", getCategoryColor(news.category))}>
            {getCategoryLabel(news.category)}
          </Badge>
          
          {news.relevance_score >= 90 && (
            <Badge className="bg-red-600 text-white text-xs font-medium">
              <TrendingUp className="h-3 w-3 mr-1" />
              TRENDING
            </Badge>
          )}
        </div>

        {/* Hover Actions */}
        {isHovered && showActions && (
          <div className="absolute bottom-3 right-3 flex gap-2 z-20">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsPreviewOpen(true)}
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white backdrop-blur-sm"
            >
              <Eye className="h-4 w-4" />
            </Button>
            
            <Button
              size="sm"
              variant="secondary"
              onClick={handleSave}
              className={cn(
                "h-8 w-8 p-0 backdrop-blur-sm",
                isSaved ? "bg-primary text-white" : "bg-white/90 hover:bg-white"
              )}
            >
              {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </Button>
          </div>
        )}

        {/* Reading Progress Bar */}
        {readingProgress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* News Content */}
      <div className={cn("flex-1 p-4", variant === 'compact' ? "py-2" : "")}>
        {/* News Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{formatDate(news.published_at)}</span>
            {news.reading_time && (
              <>
                <span>•</span>
                <BookOpen className="h-4 w-4" />
                <span>{news.reading_time} min</span>
              </>
            )}
          </div>
          
          {showActions && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={cn(
                  "h-8 w-8 p-0",
                  isLiked ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Heart className={cn("h-4 w-4", isLiked ? "fill-current" : "")} />
              </Button>
              
              <Popover open={isShareOpen} onOpenChange={setIsShareOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3" align="end">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('facebook')}
                      className="justify-start"
                    >
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('twitter')}
                      className="justify-start"
                    >
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('linkedin')}
                      className="justify-start"
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare('copy')}
                      className="justify-start"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* News Title */}
        <Link href={news.url} target="_blank" rel="noopener noreferrer">
          <h3 className={cn(
            "font-semibold text-gray-900 hover:text-primary transition-colors cursor-pointer",
            variant === 'compact' ? "text-sm line-clamp-2" : "text-lg line-clamp-2 mb-2"
          )}>
            {news.title}
          </h3>
        </Link>

        {/* News Description */}
        {variant !== 'compact' && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">
            {news.description}
          </p>
        )}

        {/* News Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <User className="h-3 w-3" />
            <span>{news.author || news.source}</span>
          </div>
          
          {showMetrics && (
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {news.views && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{formatViews(news.views)}</span>
                </div>
              )}
              {news.likes && (
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{news.likes}</span>
                </div>
              )}
              {news.comments && (
                <div className="flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" />
                  <span>{news.comments}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tags */}
        {news.tags && news.tags.length > 0 && variant !== 'compact' && (
          <div className="flex items-center gap-1 mt-3">
            <Tag className="h-3 w-3 text-gray-400" />
            <div className="flex flex-wrap gap-1">
              {news.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
              {news.tags.length > 3 && (
                <span className="text-xs text-gray-500">+{news.tags.length - 3}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {news.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* News Image */}
            {news.image_url && (
              <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={news.image_url}
                  alt={news.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* News Meta */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <Badge className={getCategoryColor(news.category)}>
                  {getCategoryLabel(news.category)}
                </Badge>
                <span>{news.source}</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(news.published_at)}</span>
                </div>
                {news.reading_time && (
                  <span>{news.reading_time} min de leitura</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleShare()}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                  className={isSaved ? "bg-primary text-white" : ""}
                >
                  {isSaved ? <BookmarkCheck className="h-4 w-4 mr-2" /> : <Bookmark className="h-4 w-4 mr-2" />}
                  {isSaved ? "Salvo" : "Salvar"}
                </Button>
                
                <Link href={news.url} target="_blank" rel="noopener noreferrer">
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
                {news.description}
              </p>
            </div>

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <div className="flex items-center gap-2 pt-4 border-t">
                <Tag className="h-4 w-4 text-gray-400" />
                <div className="flex flex-wrap gap-2">
                  {news.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

// Grid component for Advanced News Cards
export function AdvancedNewsGrid({ 
  news, 
  variant = 'default',
  showActions = true,
  showMetrics = true,
  showPreview = true
}: {
  news: NewsItem[]
  variant?: 'default' | 'compact' | 'featured' | 'minimal'
  showActions?: boolean
  showMetrics?: boolean
  showPreview?: boolean
}) {
  const [savedNews, setSavedNews] = useState<string[]>([])
  const [likedNews, setLikedNews] = useState<string[]>([])

  const handleSave = (newsId: string) => {
    setSavedNews(prev => 
      prev.includes(newsId) 
        ? prev.filter(id => id !== newsId)
        : [...prev, newsId]
    )
  }

  const handleLike = (newsId: string) => {
    setLikedNews(prev => 
      prev.includes(newsId) 
        ? prev.filter(id => id !== newsId)
        : [...prev, newsId]
    )
  }

  const handleShare = (newsItem: NewsItem) => {
    if (navigator.share) {
      navigator.share({
        title: newsItem.title,
        text: newsItem.description,
        url: newsItem.url
      })
    } else {
      navigator.clipboard.writeText(newsItem.url)
    }
  }

  const getGridClassName = () => {
    switch (variant) {
      case 'compact':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
      case 'featured':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      case 'minimal':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    }
  }

  return (
    <div className={getGridClassName()}>
      {news.map((item) => (
        <AdvancedNewsCard
          key={item.id}
          news={item}
          variant={variant}
          showActions={showActions}
          showMetrics={showMetrics}
          showPreview={showPreview}
          onSave={handleSave}
          onLike={handleLike}
          onShare={handleShare}
          savedNewsIds={savedNews}
          likedNewsIds={likedNews}
        />
      ))}
    </div>
  )
}
'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Heart, Share2, Bookmark, ExternalLink, X, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SwipeCardProps {
  id: string
  title: string
  description: string
  image?: string
  source?: string
  category?: string
  publishedAt?: string
  url?: string
  relevanceScore?: number
  onSwipeLeft?: (id: string) => void
  onSwipeRight?: (id: string) => void
  onSwipeUp?: (id: string) => void
  onSwipeDown?: (id: string) => void
  onTap?: (id: string) => void
  className?: string
  children?: React.ReactNode
}

export function SwipeCard({
  id,
  title,
  description,
  image,
  source,
  category,
  publishedAt,
  url,
  relevanceScore,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  className,
  children
}: SwipeCardProps) {
  const [isExiting, setIsExiting] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const opacity = useTransform(
    x,
    [-200, -100, 0, 100, 200],
    [0, 1, 1, 1, 0]
  )

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 100
    const { offset } = info

    if (Math.abs(offset.x) > threshold) {
      setIsExiting(true)
      
      if (offset.x > 0) {
        onSwipeRight?.(id)
      } else {
        onSwipeLeft?.(id)
      }
    } else if (Math.abs(offset.y) > threshold) {
      setIsExiting(true)
      
      if (offset.y > 0) {
        onSwipeDown?.(id)
      } else {
        onSwipeUp?.(id)
      }
    }
  }

  const handleTap = () => {
    if (onTap) {
      onTap(id)
    } else if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffHours < 24) return `há ${diffHours}h`
    if (diffDays === 1) return 'há 1 dia'
    if (diffDays < 7) return `há ${diffDays} dias`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  const getCategoryColor = (cat: string) => {
    const colors = {
      regulation: 'bg-blue-100 text-blue-800',
      safety: 'bg-red-100 text-red-800',
      technology: 'bg-purple-100 text-purple-800',
      urban_mobility: 'bg-green-100 text-green-800',
      general: 'bg-gray-100 text-gray-800'
    }
    return colors[cat as keyof typeof colors] || colors.general
  }

  return (
    <motion.div
      ref={cardRef}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      onTap={handleTap}
      style={{
        x,
        y,
        rotate,
        opacity
      }}
      animate={isExiting ? { x: 0, y: 0, opacity: 0, scale: 0.8 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "relative cursor-grab active:cursor-grabbing",
        "select-none touch-none",
        className
      )}
    >
      <Card className="overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
        {/* Swipe indicators */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Left swipe indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: useTransform(x, [-100, -50, 0], [1, 0.5, 0]),
              scale: useTransform(x, [-100, -50, 0], [1, 0.9, 0.8])
            }}
            className="absolute top-4 left-4 bg-red-500 text-white rounded-full p-2"
          >
            <X className="w-6 h-6" />
          </motion.div>

          {/* Right swipe indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: useTransform(x, [0, 50, 100], [0, 0.5, 1]),
              scale: useTransform(x, [0, 50, 100], [0.8, 0.9, 1])
            }}
            className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2"
          >
            <Check className="w-6 h-6" />
          </motion.div>

          {/* Up swipe indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: useTransform(y, [-100, -50, 0], [1, 0.5, 0]),
              scale: useTransform(y, [-100, -50, 0], [1, 0.9, 0.8])
            }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white rounded-full p-2"
          >
            <Bookmark className="w-6 h-6" />
          </motion.div>

          {/* Down swipe indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: useTransform(y, [0, 50, 100], [0, 0.5, 1]),
              scale: useTransform(y, [0, 50, 100], [0.8, 0.9, 1])
            }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white rounded-full p-2"
          >
            <Share2 className="w-6 h-6" />
          </motion.div>
        </div>

        {/* Image */}
        {image && (
          <div className="relative aspect-video overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            {/* Category badge */}
            {category && (
              <Badge
                className={cn(
                  "absolute top-4 left-4",
                  getCategoryColor(category)
                )}
              >
                {category}
              </Badge>
            )}

            {/* Relevance score */}
            {relevanceScore && relevanceScore > 80 && (
              <Badge
                variant="destructive"
                className="absolute top-4 right-4"
              >
                🔥 {relevanceScore}
              </Badge>
            )}
          </div>
        )}

        <CardContent className="p-6">
          {/* Source and date */}
          <div className="flex items-center justify-between mb-3">
            {source && (
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {source}
              </span>
            )}
            {publishedAt && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(publishedAt)}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            {description}
          </p>

          {/* Custom content */}
          {children}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle like
                }}
              >
                <Heart className="w-4 h-4 mr-1" />
                <span className="text-sm">12</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle bookmark
                }}
              >
                <Bookmark className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle share
                }}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            {url && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(url, '_blank', 'noopener,noreferrer')
                }}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Ler mais
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Swipe Card Stack Component
interface SwipeCardStackProps {
  cards: SwipeCardProps[]
  onCardSwipe?: (cardId: string, direction: 'left' | 'right' | 'up' | 'down') => void
  maxVisible?: number
  className?: string
}

export function SwipeCardStack({
  cards,
  onCardSwipe,
  maxVisible = 3,
  className
}: SwipeCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [removedCards, setRemovedCards] = useState<string[]>([])

  const handleCardSwipe = (cardId: string, direction: 'left' | 'right' | 'up' | 'down') => {
    onCardSwipe?.(cardId, direction)
    setRemovedCards(prev => [...prev, cardId])
    
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1)
    }, 300)
  }

  const visibleCards = cards
    .filter(card => !removedCards.includes(card.id))
    .slice(0, maxVisible)

  const reset = () => {
    setCurrentIndex(0)
    setRemovedCards([])
  }

  if (visibleCards.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8", className)}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Todas as notícias foram visualizadas!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Deslize para baixo para atualizar ou clique para reiniciar
          </p>
          <Button onClick={reset}>
            Reiniciar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      {visibleCards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ scale: 0.95, y: index * 4 }}
          animate={{ 
            scale: 1 - index * 0.05,
            y: index * 4,
            zIndex: maxVisible - index
          }}
          className="absolute inset-0"
        >
          <SwipeCard
            {...card}
            onSwipeLeft={() => handleCardSwipe(card.id, 'left')}
            onSwipeRight={() => handleCardSwipe(card.id, 'right')}
            onSwipeUp={() => handleCardSwipe(card.id, 'up')}
            onSwipeDown={() => handleCardSwipe(card.id, 'down')}
          />
        </motion.div>
      ))}
    </div>
  )
}

export default SwipeCard
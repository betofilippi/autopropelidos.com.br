'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface TouchCarouselItem {
  id: string
  title: string
  description?: string
  image?: string
  video?: string
  content?: React.ReactNode
  href?: string
}

interface TouchCarouselProps {
  items: TouchCarouselItem[]
  autoPlay?: boolean
  autoPlayInterval?: number
  loop?: boolean
  showArrows?: boolean
  showDots?: boolean
  className?: string
  itemClassName?: string
  onItemClick?: (item: TouchCarouselItem, index: number) => void
}

export function TouchCarousel({
  items,
  autoPlay = false,
  autoPlayInterval = 5000,
  loop = true,
  showArrows = true,
  showDots = true,
  className,
  itemClassName,
  onItemClick
}: TouchCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5])

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !isDragging) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= items.length - 1) {
            return loop ? 0 : prev
          }
          return prev + 1
        })
      }, autoPlayInterval)
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isPlaying, isDragging, items.length, loop, autoPlayInterval])

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, items.length - 1)))
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return loop ? items.length - 1 : 0
      }
      return prev - 1
    })
  }

  const goToNext = () => {
    setCurrentIndex((prev) => {
      if (prev >= items.length - 1) {
        return loop ? 0 : items.length - 1
      }
      return prev + 1
    })
  }

  const handleDragEnd = (event: any, info: any) => {
    setIsDragging(false)
    
    const threshold = 50
    const { offset } = info

    if (offset.x > threshold) {
      goToPrevious()
    } else if (offset.x < -threshold) {
      goToNext()
    }
  }

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleItemClick = (item: TouchCarouselItem, index: number) => {
    if (onItemClick) {
      onItemClick(item, index)
    } else if (item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className={cn("relative w-full", className)}>
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl"
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{ x, opacity }}
          className="flex cursor-grab active:cursor-grabbing"
          animate={{ x: -currentIndex * 100 + '%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className={cn(
                "w-full flex-shrink-0",
                itemClassName
              )}
              onClick={() => handleItemClick(item, index)}
            >
              <Card className="h-full overflow-hidden">
                {/* Image/Video */}
                {item.image && (
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    
                    {/* Play button for videos */}
                    {item.video && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </motion.button>
                    )}
                  </div>
                )}

                {/* Content */}
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  
                  {item.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {item.description}
                    </p>
                  )}

                  {/* Custom content */}
                  {item.content}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Navigation arrows */}
        {showArrows && items.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Auto-play control */}
        {autoPlay && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleAutoPlay}
            className="absolute top-2 right-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
        )}
      </div>

      {/* Dots indicator */}
      {showDots && items.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                index === currentIndex
                  ? "bg-blue-600 dark:bg-blue-400 w-6"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
              )}
            />
          ))}
        </div>
      )}

      {/* Progress indicator */}
      <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-1 overflow-hidden">
        <motion.div
          className="h-full bg-blue-600 dark:bg-blue-400"
          animate={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}

// Compact Touch Carousel for smaller spaces
interface CompactTouchCarouselProps {
  items: TouchCarouselItem[]
  visibleItems?: number
  className?: string
  onItemClick?: (item: TouchCarouselItem, index: number) => void
}

export function CompactTouchCarousel({
  items,
  visibleItems = 2.5,
  className,
  onItemClick
}: CompactTouchCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const itemWidth = 100 / visibleItems

  const handleItemClick = (item: TouchCarouselItem, index: number) => {
    if (onItemClick) {
      onItemClick(item, index)
    } else if (item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className={cn("relative", className)}>
      <div
        ref={containerRef}
        className="overflow-x-auto scrollbar-hide"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div className="flex space-x-4 p-4">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              className="flex-shrink-0"
              style={{ width: `${itemWidth}%` }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleItemClick(item, index)}
            >
              <Card className="h-full cursor-pointer">
                {item.image && (
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2">
                    {item.title}
                  </h4>
                  
                  {item.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TouchCarousel
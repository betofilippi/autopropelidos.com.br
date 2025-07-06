'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { RefreshCw, ArrowDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  threshold?: number
  className?: string
  disabled?: boolean
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 100,
  className,
  disabled = false
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [canRefresh, setCanRefresh] = useState(false)
  const [refreshComplete, setRefreshComplete] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)
  const currentY = useRef(0)
  const isDragging = useRef(false)
  
  const y = useMotionValue(0)
  const opacity = useTransform(y, [0, threshold], [0, 1])
  const scale = useTransform(y, [0, threshold], [0.8, 1])
  const rotate = useTransform(y, [0, threshold], [0, 180])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return
    
    const touch = e.touches[0]
    startY.current = touch.clientY
    currentY.current = touch.clientY
    isDragging.current = true
    
    // Check if we're at the top of the page
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    if (scrollTop > 0) {
      isDragging.current = false
      return
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || disabled || isRefreshing) return
    
    const touch = e.touches[0]
    currentY.current = touch.clientY
    const deltaY = currentY.current - startY.current
    
    // Only allow pulling down
    if (deltaY < 0) {
      isDragging.current = false
      return
    }
    
    // Prevent default scrolling when pulling
    e.preventDefault()
    
    // Apply resistance to the pull
    const resistance = 0.5
    const adjustedDelta = deltaY * resistance
    
    y.set(Math.min(adjustedDelta, threshold * 1.2))
    setCanRefresh(adjustedDelta >= threshold)
    
    // Haptic feedback when threshold is reached
    if (adjustedDelta >= threshold && !canRefresh) {
      if (navigator.vibrate) {
        navigator.vibrate(30)
      }
    }
  }

  const handleTouchEnd = async () => {
    if (!isDragging.current || disabled || isRefreshing) return
    
    isDragging.current = false
    
    if (canRefresh) {
      setIsRefreshing(true)
      
      try {
        await onRefresh()
        setRefreshComplete(true)
        
        // Show success feedback
        if (navigator.vibrate) {
          navigator.vibrate([50, 100, 50])
        }
        
        setTimeout(() => {
          setRefreshComplete(false)
        }, 1000)
      } catch (error) {
        console.error('Refresh failed:', error)
      } finally {
        setIsRefreshing(false)
        setCanRefresh(false)
      }
    }
    
    // Reset position
    y.set(0)
  }

  // Handle scroll restoration after refresh
  useEffect(() => {
    if (!isRefreshing && !canRefresh) {
      y.set(0)
    }
  }, [isRefreshing, canRefresh])

  const getRefreshIcon = () => {
    if (refreshComplete) {
      return <Check className="w-6 h-6 text-green-500" />
    }
    
    if (isRefreshing) {
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-6 h-6 text-blue-500" />
        </motion.div>
      )
    }
    
    return (
      <motion.div style={{ rotate }}>
        <ArrowDown className="w-6 h-6 text-gray-500" />
      </motion.div>
    )
  }

  const getRefreshText = () => {
    if (refreshComplete) return "Atualizado!"
    if (isRefreshing) return "Atualizando..."
    if (canRefresh) return "Solte para atualizar"
    return "Puxe para atualizar"
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Refresh indicator */}
      <AnimatePresence>
        <motion.div
          style={{ y, opacity, scale }}
          className="absolute top-0 left-0 right-0 z-10 flex flex-col items-center justify-center py-4"
        >
          <div className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-700">
            {getRefreshIcon()}
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "mt-2 text-sm font-medium transition-colors",
              refreshComplete && "text-green-600 dark:text-green-400",
              isRefreshing && "text-blue-600 dark:text-blue-400",
              canRefresh && "text-purple-600 dark:text-purple-400",
              !canRefresh && !isRefreshing && !refreshComplete && "text-gray-600 dark:text-gray-400"
            )}
          >
            {getRefreshText()}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <motion.div
        style={{ y }}
        className="relative z-0"
      >
        {children}
      </motion.div>
    </div>
  )
}

// Simpler pull-to-refresh for basic use cases
interface SimplePullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
  className?: string
}

export function SimplePullToRefresh({
  onRefresh,
  children,
  className
}: SimplePullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    if (isRefreshing) return
    
    setIsRefreshing(true)
    
    try {
      await onRefresh()
    } catch (error) {
      console.error('Refresh failed:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <PullToRefresh
      onRefresh={handleRefresh}
      className={className}
      disabled={isRefreshing}
    >
      {children}
    </PullToRefresh>
  )
}

export default PullToRefresh
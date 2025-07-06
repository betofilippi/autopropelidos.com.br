'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface VirtualScrollItem {
  id: string
  height?: number
  data: any
}

interface VirtualScrollProps {
  items: VirtualScrollItem[]
  renderItem: (item: VirtualScrollItem, index: number) => React.ReactNode
  itemHeight?: number
  containerHeight?: number
  overscan?: number
  onLoadMore?: () => Promise<void>
  hasMore?: boolean
  loading?: boolean
  error?: string
  className?: string
  itemClassName?: string
  onRetry?: () => void
}

export function VirtualScroll({
  items,
  renderItem,
  itemHeight = 200,
  containerHeight = 600,
  overscan = 3,
  onLoadMore,
  hasMore = false,
  loading = false,
  error,
  className,
  itemClassName,
  onRetry
}: VirtualScrollProps) {
  const [scrollTop, setScrollTop] = useState(0)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const itemHeights = useRef<Map<string, number>>(new Map())
  
  // Calculate total height
  const totalHeight = useMemo(() => {
    return items.reduce((total, item) => {
      const height = itemHeights.current.get(item.id) || item.height || itemHeight
      return total + height
    }, 0)
  }, [items, itemHeight])

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const viewportHeight = containerHeight
    let startIndex = 0
    let endIndex = 0
    let currentHeight = 0
    
    // Find start index
    for (let i = 0; i < items.length; i++) {
      const height = itemHeights.current.get(items[i].id) || items[i].height || itemHeight
      if (currentHeight + height > scrollTop) {
        startIndex = Math.max(0, i - overscan)
        break
      }
      currentHeight += height
    }
    
    // Find end index
    currentHeight = 0
    for (let i = 0; i < items.length; i++) {
      const height = itemHeights.current.get(items[i].id) || items[i].height || itemHeight
      currentHeight += height
      
      if (currentHeight > scrollTop + viewportHeight) {
        endIndex = Math.min(items.length - 1, i + overscan)
        break
      }
      
      if (i === items.length - 1) {
        endIndex = i
      }
    }
    
    return { startIndex, endIndex }
  }, [items, scrollTop, containerHeight, itemHeight, overscan])

  // Calculate offset for visible items
  const offsetY = useMemo(() => {
    let offset = 0
    for (let i = 0; i < visibleRange.startIndex; i++) {
      const height = itemHeights.current.get(items[i].id) || items[i].height || itemHeight
      offset += height
    }
    return offset
  }, [visibleRange.startIndex, items, itemHeight])

  // Get visible items
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1)
  }, [items, visibleRange])

  // Handle scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    setScrollTop(scrollTop)
    
    // Check if we need to load more
    if (
      onLoadMore &&
      hasMore &&
      !isLoadingMore &&
      !loading &&
      scrollTop + containerHeight >= totalHeight - 200
    ) {
      loadMore()
    }
  }

  // Load more items
  const loadMore = async () => {
    if (!onLoadMore || isLoadingMore) return
    
    setIsLoadingMore(true)
    try {
      await onLoadMore()
    } catch (error) {
      console.error('Failed to load more items:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }

  // Update item height when measured
  const updateItemHeight = (id: string, height: number) => {
    if (itemHeights.current.get(id) !== height) {
      itemHeights.current.set(id, height)
    }
  }

  // Item wrapper component for height measurement
  const ItemWrapper = ({ item, index }: { item: VirtualScrollItem; index: number }) => {
    const itemRef = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
      if (itemRef.current) {
        const height = itemRef.current.offsetHeight
        updateItemHeight(item.id, height)
      }
    }, [item.id])
    
    return (
      <div
        ref={itemRef}
        className={cn("w-full", itemClassName)}
        style={{ minHeight: item.height || itemHeight }}
      >
        {renderItem(item, visibleRange.startIndex + index)}
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height: containerHeight }}
        onScroll={handleScroll}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              top: offsetY,
              left: 0,
              right: 0
            }}
          >
            <AnimatePresence mode="popLayout">
              {visibleItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ItemWrapper item={item} index={index} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Loading more indicator */}
        {(isLoadingMore || loading) && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Carregando mais itens...
            </span>
          </div>
        )}
        
        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {error}
            </p>
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar novamente
              </Button>
            )}
          </motion.div>
        )}
        
        {/* End of list */}
        {!hasMore && !loading && items.length > 0 && (
          <div className="flex items-center justify-center py-8">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Você chegou ao final da lista
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// Infinite scroll component using virtual scrolling
interface InfiniteScrollProps {
  items: VirtualScrollItem[]
  renderItem: (item: VirtualScrollItem, index: number) => React.ReactNode
  onLoadMore: () => Promise<void>
  hasMore: boolean
  loading: boolean
  error?: string
  className?: string
  itemHeight?: number
  containerHeight?: number
}

export function InfiniteScroll({
  items,
  renderItem,
  onLoadMore,
  hasMore,
  loading,
  error,
  className,
  itemHeight = 200,
  containerHeight = 600
}: InfiniteScrollProps) {
  const handleRetry = () => {
    if (onLoadMore) {
      onLoadMore()
    }
  }

  return (
    <VirtualScroll
      items={items}
      renderItem={renderItem}
      itemHeight={itemHeight}
      containerHeight={containerHeight}
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      loading={loading}
      error={error}
      className={className}
      onRetry={handleRetry}
    />
  )
}

// Grid virtual scroll for multiple columns
interface VirtualGridProps {
  items: VirtualScrollItem[]
  renderItem: (item: VirtualScrollItem, index: number) => React.ReactNode
  columns?: number
  itemHeight?: number
  gap?: number
  containerHeight?: number
  onLoadMore?: () => Promise<void>
  hasMore?: boolean
  loading?: boolean
  className?: string
}

export function VirtualGrid({
  items,
  renderItem,
  columns = 2,
  itemHeight = 200,
  gap = 16,
  containerHeight = 600,
  onLoadMore,
  hasMore = false,
  loading = false,
  className
}: VirtualGridProps) {
  // Convert items to grid format
  const gridItems = useMemo(() => {
    const rows: VirtualScrollItem[][] = []
    
    for (let i = 0; i < items.length; i += columns) {
      rows.push(items.slice(i, i + columns))
    }
    
    return rows.map((row, rowIndex) => ({
      id: `row-${rowIndex}`,
      height: itemHeight + gap,
      data: row
    }))
  }, [items, columns, itemHeight, gap])

  const renderRow = (rowItem: VirtualScrollItem, index: number) => {
    const row = rowItem.data as VirtualScrollItem[]
    
    return (
      <div 
        className="grid gap-4"
        style={{ 
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: gap
        }}
      >
        {row.map((item, itemIndex) => (
          <div key={item.id}>
            {renderItem(item, index * columns + itemIndex)}
          </div>
        ))}
        
        {/* Fill empty slots */}
        {Array.from({ length: columns - row.length }).map((_, emptyIndex) => (
          <div key={`empty-${index}-${emptyIndex}`} />
        ))}
      </div>
    )
  }

  return (
    <VirtualScroll
      items={gridItems}
      renderItem={renderRow}
      itemHeight={itemHeight + gap}
      containerHeight={containerHeight}
      onLoadMore={onLoadMore}
      hasMore={hasMore}
      loading={loading}
      className={className}
    />
  )
}

export default VirtualScroll
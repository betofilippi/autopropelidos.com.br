'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useMobileAdvanced } from '@/hooks/use-mobile-advanced'

// Lazy Loading Image Component
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  placeholder?: string
  className?: string
  onLoad?: () => void
  onError?: () => void
  threshold?: number
}

export function LazyImage({
  src,
  alt,
  placeholder = '/images/placeholder-news.jpg',
  className,
  onLoad,
  onError,
  threshold = 0.1,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const { shouldOptimizeForPerformance } = useMobileAdvanced()

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.unobserve(img)
        }
      },
      { threshold }
    )

    observer.observe(img)

    return () => {
      observer.unobserve(img)
    }
  }, [threshold])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  // Use lower quality images for slow connections
  const optimizedSrc = shouldOptimizeForPerformance 
    ? src.replace(/\.(jpg|jpeg|png)$/i, '.webp?q=70&w=800')
    : src

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      <img
        ref={imgRef}
        src={placeholder}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        loading="lazy"
      />
      
      {/* Main image */}
      {isInView && (
        <img
          src={hasError ? placeholder : optimizedSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          {...props}
        />
      )}

      {/* Loading indicator */}
      {!isLoaded && isInView && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

// Resource Preloader
interface PreloadResource {
  url: string
  type: 'image' | 'script' | 'style' | 'font'
  priority?: 'high' | 'low'
}

export function useResourcePreloader() {
  const [preloadedResources, setPreloadedResources] = useState<Set<string>>(new Set())
  const { shouldOptimizeForPerformance, isSlowNetwork } = useMobileAdvanced()

  const preloadResource = useCallback((resource: PreloadResource) => {
    if (preloadedResources.has(resource.url)) return

    // Skip preloading on slow networks for low priority resources
    if (isSlowNetwork && resource.priority === 'low') return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = resource.url

    switch (resource.type) {
      case 'image':
        link.as = 'image'
        break
      case 'script':
        link.as = 'script'
        break
      case 'style':
        link.as = 'style'
        break
      case 'font':
        link.as = 'font'
        link.crossOrigin = 'anonymous'
        break
    }

    document.head.appendChild(link)
    setPreloadedResources(prev => new Set([...prev, resource.url]))
  }, [preloadedResources, isSlowNetwork])

  const preloadImages = useCallback((urls: string[]) => {
    urls.forEach(url => {
      preloadResource({
        url,
        type: 'image',
        priority: 'low'
      })
    })
  }, [preloadResource])

  const preloadCriticalResources = useCallback((resources: PreloadResource[]) => {
    resources.forEach(resource => {
      preloadResource({
        ...resource,
        priority: 'high'
      })
    })
  }, [preloadResource])

  return {
    preloadResource,
    preloadImages,
    preloadCriticalResources,
    preloadedResources: Array.from(preloadedResources)
  }
}

// Memory Usage Monitor
export function useMemoryMonitor() {
  const [memoryInfo, setMemoryInfo] = useState({
    used: 0,
    total: 0,
    limit: 0,
    isLowMemory: false
  })

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        const used = memory.usedJSHeapSize / 1024 / 1024 // MB
        const total = memory.totalJSHeapSize / 1024 / 1024 // MB
        const limit = memory.jsHeapSizeLimit / 1024 / 1024 // MB
        
        setMemoryInfo({
          used,
          total,
          limit,
          isLowMemory: used > limit * 0.8 // Alert when using > 80% of limit
        })
      }
    }

    updateMemoryInfo()
    const interval = setInterval(updateMemoryInfo, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const cleanupMemory = useCallback(() => {
    // Force garbage collection if available
    if (window.gc) {
      window.gc()
    }

    // Clear unused caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name.includes('old') || name.includes('temp')) {
            caches.delete(name)
          }
        })
      })
    }
  }, [])

  return {
    memoryInfo,
    cleanupMemory
  }
}

// Network Quality Monitor
export function useNetworkQuality() {
  const [networkQuality, setNetworkQuality] = useState({
    effectiveType: '4g',
    downlink: 10,
    rtt: 50,
    saveData: false,
    quality: 'good' as 'poor' | 'fair' | 'good' | 'excellent'
  })

  useEffect(() => {
    const updateNetworkQuality = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

      if (connection) {
        const { effectiveType, downlink, rtt, saveData } = connection
        
        let quality: 'poor' | 'fair' | 'good' | 'excellent' = 'good'
        
        if (effectiveType === 'slow-2g' || effectiveType === '2g') {
          quality = 'poor'
        } else if (effectiveType === '3g') {
          quality = 'fair'
        } else if (effectiveType === '4g' && downlink > 5) {
          quality = 'excellent'
        }

        setNetworkQuality({
          effectiveType,
          downlink,
          rtt,
          saveData,
          quality
        })
      }
    }

    updateNetworkQuality()

    const connection = (navigator as any).connection
    if (connection) {
      connection.addEventListener('change', updateNetworkQuality)
      return () => connection.removeEventListener('change', updateNetworkQuality)
    }
  }, [])

  return networkQuality
}

// Critical CSS Injector
export function CriticalCSS({ css }: { css: string }) {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = css
    style.setAttribute('data-critical', 'true')
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [css])

  return null
}

// Performance Budget Monitor
export function usePerformanceBudget() {
  const [metrics, setMetrics] = useState({
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    budgetExceeded: false
  })

  const budgets = {
    fcp: 1800, // 1.8s
    lcp: 2500, // 2.5s
    fid: 100,  // 100ms
    cls: 0.1,  // 0.1
    ttfb: 600  // 600ms
  }

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach((entry) => {
        let newMetrics = { ...metrics }
        
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          newMetrics.fcp = entry.startTime
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          newMetrics.lcp = entry.startTime
        }
        
        if (entry.entryType === 'first-input') {
          newMetrics.fid = (entry as any).processingStart - entry.startTime
        }
        
        if (entry.entryType === 'layout-shift') {
          newMetrics.cls += (entry as any).value
        }
        
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          newMetrics.ttfb = navEntry.responseStart - navEntry.requestStart
        }

        // Check if any budget is exceeded
        const budgetExceeded = 
          newMetrics.fcp > budgets.fcp ||
          newMetrics.lcp > budgets.lcp ||
          newMetrics.fid > budgets.fid ||
          newMetrics.cls > budgets.cls ||
          newMetrics.ttfb > budgets.ttfb

        setMetrics({ ...newMetrics, budgetExceeded })
      })
    })

    observer.observe({ type: 'paint', buffered: true })
    observer.observe({ type: 'largest-contentful-paint', buffered: true })
    observer.observe({ type: 'first-input', buffered: true })
    observer.observe({ type: 'layout-shift', buffered: true })
    observer.observe({ type: 'navigation', buffered: true })

    return () => observer.disconnect()
  }, [])

  return {
    metrics,
    budgets,
    isWithinBudget: !metrics.budgetExceeded
  }
}

// Adaptive Loading Component
interface AdaptiveLoadingProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  condition?: 'slow-network' | 'low-memory' | 'save-data' | 'low-battery'
}

export function AdaptiveLoading({ 
  children, 
  fallback = null, 
  condition = 'slow-network' 
}: AdaptiveLoadingProps) {
  const { shouldOptimizeForPerformance, isSlowNetwork, isLowBattery } = useMobileAdvanced()
  const { memoryInfo } = useMemoryMonitor()
  const networkQuality = useNetworkQuality()

  const shouldShowFallback = () => {
    switch (condition) {
      case 'slow-network':
        return isSlowNetwork || networkQuality.quality === 'poor'
      case 'low-memory':
        return memoryInfo.isLowMemory
      case 'save-data':
        return networkQuality.saveData
      case 'low-battery':
        return isLowBattery
      default:
        return shouldOptimizeForPerformance
    }
  }

  return shouldShowFallback() ? <>{fallback}</> : <>{children}</>
}

// Bundle Size Analyzer (Development only)
export function BundleSizeAnalyzer() {
  const [bundleInfo, setBundleInfo] = useState({
    totalSize: 0,
    gzippedSize: 0,
    chunkSizes: {} as Record<string, number>
  })

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Analyze bundle size using webpack stats
      fetch('/_next/static/chunks/webpack.js')
        .then(response => response.text())
        .then(content => {
          const size = new Blob([content]).size
          setBundleInfo(prev => ({
            ...prev,
            totalSize: prev.totalSize + size
          }))
        })
        .catch(console.error)
    }
  }, [])

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-2 rounded text-xs z-50">
      Bundle: {(bundleInfo.totalSize / 1024).toFixed(1)}KB
    </div>
  )
}

export default LazyImage
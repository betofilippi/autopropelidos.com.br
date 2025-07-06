import { unstable_cache } from 'next/cache'
import { revalidateTag } from 'next/cache'

// Configurações de cache ISR otimizadas para portal de notícias
export const CACHE_CONFIGS = {
  // Notícias principais - cache mais curto
  news_featured: {
    revalidate: 900, // 15 minutos
    tags: ['news', 'featured'],
  },
  
  // Lista de notícias por categoria
  news_category: {
    revalidate: 1800, // 30 minutos
    tags: ['news', 'category'],
  },
  
  // Notícia individual
  news_single: {
    revalidate: 3600, // 1 hora
    tags: ['news', 'single'],
  },
  
  // Notícias relacionadas
  news_related: {
    revalidate: 3600, // 1 hora
    tags: ['news', 'related'],
  },
  
  // Estatísticas e contadores
  news_stats: {
    revalidate: 3600, // 1 hora
    tags: ['news', 'stats'],
  },
  
  // Sitemap e feeds
  sitemap: {
    revalidate: 3600, // 1 hora
    tags: ['sitemap'],
  },
  
  rss: {
    revalidate: 1800, // 30 minutos
    tags: ['rss'],
  },
  
  // Conteúdo estático
  static_content: {
    revalidate: 86400, // 24 horas
    tags: ['static'],
  }
}

// Função para criar cache com configuração específica
export function createCachedFunction<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  cacheConfig: keyof typeof CACHE_CONFIGS,
  keyFn?: (...args: T) => string
) {
  const config = CACHE_CONFIGS[cacheConfig]
  
  return unstable_cache(
    fn,
    keyFn ? undefined : [fn.name],
    {
      revalidate: config.revalidate,
      tags: config.tags,
    }
  )
}

// Sistema de invalidação de cache inteligente
export class CacheManager {
  static async invalidateNews(newsId?: string) {
    try {
      // Invalidar cache geral de notícias
      revalidateTag('news')
      
      // Se for uma notícia específica, invalidar caches relacionados
      if (newsId) {
        revalidateTag(`news-${newsId}`)
        revalidateTag('news-related')
      }
      
      // Invalidar sitemap e RSS
      revalidateTag('sitemap')
      revalidateTag('rss')
      
      console.log(`Cache invalidated for news${newsId ? ` (${newsId})` : ''}`)
    } catch (error) {
      console.error('Error invalidating cache:', error)
    }
  }
  
  static async invalidateCategory(category: string) {
    try {
      revalidateTag('news')
      revalidateTag('category')
      revalidateTag(`category-${category}`)
      revalidateTag('rss')
      
      console.log(`Cache invalidated for category: ${category}`)
    } catch (error) {
      console.error('Error invalidating category cache:', error)
    }
  }
  
  static async invalidateAll() {
    try {
      // Invalidar todos os tags principais
      const tags = ['news', 'sitemap', 'rss', 'category', 'stats', 'related']
      
      for (const tag of tags) {
        revalidateTag(tag)
      }
      
      console.log('All caches invalidated')
    } catch (error) {
      console.error('Error invalidating all caches:', error)
    }
  }
}

// Preloader para otimização de performance
export class ResourcePreloader {
  private static preloadedResources = new Set<string>()
  
  static preloadImage(src: string, priority: 'high' | 'low' = 'low') {
    if (this.preloadedResources.has(src)) return
    
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    link.fetchPriority = priority
    
    document.head.appendChild(link)
    this.preloadedResources.add(src)
  }
  
  static preloadFont(href: string, type: string = 'font/woff2') {
    if (this.preloadedResources.has(href)) return
    
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.type = type
    link.href = href
    link.crossOrigin = 'anonymous'
    
    document.head.appendChild(link)
    this.preloadedResources.add(href)
  }
  
  static preloadCriticalNews(newsItems: any[]) {
    // Precarregar imagens das primeiras notícias
    newsItems.slice(0, 3).forEach(news => {
      if (news.image_url) {
        this.preloadImage(news.image_url, 'high')
      }
    })
  }
}

// Sistema de lazy loading inteligente
export class LazyLoadManager {
  private static observer: IntersectionObserver | null = null
  private static elementsToLoad = new Map<Element, () => void>()
  
  static init() {
    if (typeof window === 'undefined' || this.observer) return
    
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const loadFn = this.elementsToLoad.get(entry.target)
            if (loadFn) {
              loadFn()
              this.observer?.unobserve(entry.target)
              this.elementsToLoad.delete(entry.target)
            }
          }
        })
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
    )
  }
  
  static observe(element: Element, loadFn: () => void) {
    if (!this.observer) this.init()
    
    this.elementsToLoad.set(element, loadFn)
    this.observer?.observe(element)
  }
  
  static unobserve(element: Element) {
    this.observer?.unobserve(element)
    this.elementsToLoad.delete(element)
  }
}

// Métricas de performance para notícias
export class NewsPerformanceMetrics {
  private static metrics = new Map<string, number>()
  
  static startTimer(key: string) {
    this.metrics.set(key, performance.now())
  }
  
  static endTimer(key: string): number {
    const start = this.metrics.get(key)
    if (!start) return 0
    
    const duration = performance.now() - start
    this.metrics.delete(key)
    return duration
  }
  
  static measureNewsLoad(newsId: string, startTime: number) {
    const loadTime = performance.now() - startTime
    
    // Enviar métricas para analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'news_load_time', {
        custom_parameter_1: newsId,
        value: Math.round(loadTime)
      })
    }
    
    return loadTime
  }
  
  static measureImageLoad(imageUrl: string, startTime: number) {
    const loadTime = performance.now() - startTime
    
    // Log para debugging em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`Image loaded in ${loadTime.toFixed(2)}ms: ${imageUrl}`)
    }
    
    return loadTime
  }
}

// Otimizador de imagens para notícias
export class ImageOptimizer {
  static generateSrcSet(baseUrl: string, sizes: number[] = [400, 800, 1200, 1600]) {
    return sizes
      .map(size => `${baseUrl}?w=${size} ${size}w`)
      .join(', ')
  }
  
  static generateSizes(breakpoints: Record<string, string> = {
    '(max-width: 640px)': '100vw',
    '(max-width: 1024px)': '50vw',
    '(max-width: 1280px)': '33vw'
  }) {
    const sizeEntries = Object.entries(breakpoints)
    const defaultSize = '25vw'
    
    return [...sizeEntries.map(([query, size]) => `${query} ${size}`), defaultSize].join(', ')
  }
  
  static getOptimizedUrl(url: string, width?: number, height?: number, quality: number = 80) {
    if (!url) return ''
    
    // Se for URL do Unsplash, usar parâmetros nativos
    if (url.includes('unsplash.com')) {
      const params = new URLSearchParams()
      if (width) params.set('w', width.toString())
      if (height) params.set('h', height.toString())
      params.set('q', quality.toString())
      params.set('fm', 'webp')
      params.set('fit', 'crop')
      
      return `${url}${url.includes('?') ? '&' : '?'}${params.toString()}`
    }
    
    // Para outras URLs, retornar como está
    return url
  }
  
  static getBlurDataURL(color: string = '#f3f4f6'): string {
    return `data:image/svg+xml;base64,${btoa(
      `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <rect width="400" height="300" fill="${color}"/>
      </svg>`
    )}`
  }
}

// Sistema de Critical CSS para notícias
export class CriticalCSSManager {
  private static inlinedStyles = new Set<string>()
  
  static inlineCriticalCSS(css: string, id: string) {
    if (this.inlinedStyles.has(id)) return
    
    const style = document.createElement('style')
    style.id = `critical-${id}`
    style.innerHTML = css
    document.head.appendChild(style)
    
    this.inlinedStyles.add(id)
  }
  
  static async loadNonCriticalCSS(href: string) {
    return new Promise<void>((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.media = 'print'
      link.onload = () => {
        link.media = 'all'
        resolve()
      }
      link.onerror = reject
      
      document.head.appendChild(link)
    })
  }
  
  // CSS crítico para páginas de notícias
  static getNewsPageCriticalCSS(): string {
    return `
      /* Critical CSS for news pages */
      .news-header { display: block; margin-bottom: 1rem; }
      .news-title { font-size: 2rem; font-weight: bold; line-height: 1.2; margin-bottom: 1rem; }
      .news-meta { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; color: #6b7280; }
      .news-image { width: 100%; height: auto; border-radius: 0.5rem; }
      .news-content { line-height: 1.6; }
      .news-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
      .news-tag { background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem; }
      
      /* Layout crítico */
      .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
      .grid { display: grid; gap: 1.5rem; }
      .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
      
      @media (min-width: 768px) {
        .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      
      @media (min-width: 1024px) {
        .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      }
    `
  }
}

// Web Vitals monitoring específico para notícias
export class WebVitalsMonitor {
  private static metrics: Record<string, number> = {}
  
  static init() {
    if (typeof window === 'undefined') return
    
    // Monitorar LCP (Largest Contentful Paint)
    this.observeLCP()
    
    // Monitorar FID (First Input Delay)
    this.observeFID()
    
    // Monitorar CLS (Cumulative Layout Shift)
    this.observeCLS()
  }
  
  private static observeLCP() {
    if (!window.PerformanceObserver) return
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      
      this.metrics.lcp = lastEntry.startTime
      this.sendMetric('LCP', lastEntry.startTime)
    })
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] })
  }
  
  private static observeFID() {
    if (!window.PerformanceObserver) return
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach(entry => {
        this.metrics.fid = entry.processingStart - entry.startTime
        this.sendMetric('FID', entry.processingStart - entry.startTime)
      })
    })
    
    observer.observe({ entryTypes: ['first-input'] })
  }
  
  private static observeCLS() {
    if (!window.PerformanceObserver) return
    
    let clsValue = 0
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value
        }
      }
      
      this.metrics.cls = clsValue
      this.sendMetric('CLS', clsValue)
    })
    
    observer.observe({ entryTypes: ['layout-shift'] })
  }
  
  private static sendMetric(name: string, value: number) {
    // Enviar para Google Analytics
    if (window.gtag) {
      window.gtag('event', name, {
        event_category: 'Web Vitals',
        value: Math.round(value),
        custom_parameter_1: window.location.pathname
      })
    }
    
    // Log em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log(`Web Vital ${name}:`, value)
    }
  }
  
  static getMetrics() {
    return { ...this.metrics }
  }
}

// Declaração de tipos para window.gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

export {
  CacheManager,
  ResourcePreloader,
  LazyLoadManager,
  NewsPerformanceMetrics,
  ImageOptimizer,
  CriticalCSSManager,
  WebVitalsMonitor
}
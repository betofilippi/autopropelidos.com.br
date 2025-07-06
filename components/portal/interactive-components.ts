// Interactive Portal Components Index
// Exporta todos os componentes interativos avançados criados para o portal

// Enhanced Breaking News Bar
export { default as EnhancedBreakingNewsBar, useEnhancedBreakingNews } from './enhanced-breaking-news-bar'

// Advanced News Cards
export { default as AdvancedNewsCard, AdvancedNewsGrid } from './advanced-news-cards'

// Trending Sidebar
export { default as TrendingSidebar } from './trending-sidebar'

// Interactive Video Player
export { default as InteractiveVideoPlayer, useVideoData } from './interactive-video-player'

// Advanced Search & Filter System
export { default as AdvancedSearchFilter } from './advanced-search-filter'

// Mobile-First Components
export { 
  default as MobileFirstPortal,
  PullToRefresh,
  SwipeableNewsCard,
  MobileFilterSheet,
  StickyMobileHeader,
  InfiniteScrollContainer,
  useSwipeGestures
} from './mobile-first-components'

// Types and Interfaces
export interface NewsItem {
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

export interface BreakingNewsItem {
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

export interface Video {
  id: string
  title: string
  description: string
  youtube_id: string
  thumbnail: string
  duration: number
  views: number
  likes: number
  dislikes: number
  published_at: string
  category: string
  tags: string[]
  author: {
    name: string
    avatar: string
    subscribers: number
  }
  chapters?: {
    time: number
    title: string
    description: string
  }[]
}

export interface SearchResult {
  id: string
  title: string
  description: string
  url: string
  type: 'article' | 'video' | 'tool' | 'regulation'
  category: string
  source: string
  author: string
  published_at: string
  views: number
  likes: number
  comments: number
  reading_time?: number
  tags: string[]
  relevance_score: number
  thumbnail?: string
  location?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  status?: 'active' | 'draft' | 'archived'
}

export interface TrendingTopic {
  id: string
  title: string
  hashtag: string
  posts: number
  growth: number
  category: string
  url: string
}

export interface PopularArticle {
  id: string
  title: string
  views: number
  timeframe: 'hour' | 'day' | 'week'
  url: string
  category: string
  author: string
  published_at: string
  reading_time: number
}

// Component Configuration Types
export interface ComponentConfig {
  enhancedBreakingNews: {
    enableSound?: boolean
    autoRotate?: boolean
    rotationSpeed?: number
    showFullDescription?: boolean
    enableNotifications?: boolean
  }
  
  advancedNewsCards: {
    variant?: 'default' | 'compact' | 'featured' | 'minimal'
    showActions?: boolean
    showMetrics?: boolean
    showPreview?: boolean
  }
  
  interactiveVideoPlayer: {
    autoplay?: boolean
    showPlaylist?: boolean
    showChapters?: boolean
    showRelated?: boolean
    enableSharing?: boolean
  }
  
  mobileComponents: {
    enableSwipeGestures?: boolean
    enablePullToRefresh?: boolean
    enableInfiniteScroll?: boolean
    itemsPerPage?: number
  }
}

// Default Configurations
export const DEFAULT_CONFIG: ComponentConfig = {
  enhancedBreakingNews: {
    enableSound: true,
    autoRotate: true,
    rotationSpeed: 5000,
    showFullDescription: false,
    enableNotifications: true
  },
  
  advancedNewsCards: {
    variant: 'default',
    showActions: true,
    showMetrics: true,
    showPreview: true
  },
  
  interactiveVideoPlayer: {
    autoplay: false,
    showPlaylist: true,
    showChapters: true,
    showRelated: true,
    enableSharing: true
  },
  
  mobileComponents: {
    enableSwipeGestures: true,
    enablePullToRefresh: true,
    enableInfiniteScroll: true,
    itemsPerPage: 10
  }
}

// Utility Functions
export const formatViews = (views: number): string => {
  if (views < 1000) return views.toString()
  if (views < 1000000) return `${(views / 1000).toFixed(1)}K`
  return `${(views / 1000000).toFixed(1)}M`
}

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Agora'
  if (diffInHours < 24) return `${diffInHours}h`
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'regulation': return 'bg-red-100 text-red-800 border-red-200'
    case 'safety': return 'bg-orange-100 text-orange-800 border-orange-200'
    case 'technology': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'urban_mobility': return 'bg-green-100 text-green-800 border-green-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export const getCategoryLabel = (category: string): string => {
  switch (category) {
    case 'regulation': return 'Regulamentação'
    case 'safety': return 'Segurança'
    case 'technology': return 'Tecnologia'
    case 'urban_mobility': return 'Mobilidade Urbana'
    default: return 'Geral'
  }
}

// Performance and Analytics Utilities
export const trackEvent = (eventName: string, properties?: Record<string, any>): void => {
  // Analytics tracking implementation
  console.log(`Event: ${eventName}`, properties)
}

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = reject
    img.src = src
  })
}

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }
}

// Accessibility Helpers
export const announceToScreenReader = (message: string): void => {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  document.body.appendChild(announcement)
  setTimeout(() => document.body.removeChild(announcement), 1000)
}

// Constants
export const SUPPORTED_VIDEO_PLATFORMS = ['youtube', 'vimeo', 'dailymotion'] as const
export const SUPPORTED_IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'avif'] as const
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 768,
  desktop: 1024,
  wide: 1280
} as const

// Export all components as a single object for convenience
export const InteractivePortalComponents = {
  EnhancedBreakingNewsBar,
  AdvancedNewsCard,
  AdvancedNewsGrid,
  TrendingSidebar,
  InteractiveVideoPlayer,
  AdvancedSearchFilter,
  MobileFirstPortal,
  PullToRefresh,
  SwipeableNewsCard,
  MobileFilterSheet,
  StickyMobileHeader,
  InfiniteScrollContainer
}

// Hook exports
export const InteractiveHooks = {
  useEnhancedBreakingNews,
  useVideoData,
  useSwipeGestures
}

// Utility exports
export const InteractiveUtils = {
  formatViews,
  formatTime,
  getCategoryColor,
  getCategoryLabel,
  trackEvent,
  preloadImage,
  debounce,
  announceToScreenReader
}
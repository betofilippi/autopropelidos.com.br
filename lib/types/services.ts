// Types para os serviços aprimorados
export interface CacheConfig {
  ttl: number // Time to live em segundos
  maxSize: number // Tamanho máximo do cache
  strategy: 'memory' | 'redis' | 'file'
}

export interface SearchFilters {
  category?: string | string[]
  dateRange?: {
    start: string
    end: string
  }
  tags?: string[]
  minRelevanceScore?: number
  source?: string
  sortBy?: 'relevance' | 'date' | 'views' | 'alphabetical'
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationOptions {
  page: number
  limit: number
  offset?: number
}

export interface SearchResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrevious: boolean
  totalPages: number
}

export interface NewsItem {
  id: string
  title: string
  description: string
  content?: string
  url: string
  source: string
  published_at: string
  category: string
  tags: string[]
  image_url?: string
  relevance_score: number
  author?: string
  read_time?: number
}

export interface VideoItem {
  id: string
  youtube_id: string
  title: string
  description: string
  channel_name: string
  channel_id: string
  thumbnail_url: string
  published_at: string
  duration: string
  view_count: number
  category: string
  tags: string[]
  relevance_score: number
  likes?: number
  dislikes?: number
}

export interface VehicleItem {
  id: string
  name: string
  brand: string
  model: string
  type: 'patinete' | 'bicicleta' | 'ciclomotor'
  price_min: number
  price_max: number
  max_speed: number
  range: number
  weight: number
  max_load: number
  battery_capacity: number
  charging_time: number
  features: string[]
  images: string[]
  description: string
  category: string
  availability: 'disponível' | 'em_falta' | 'descontinuado'
  rating: number
  reviews_count: number
  created_at: string
  updated_at: string
}

export interface RegulationItem {
  id: string
  title: string
  description: string
  type: 'lei' | 'resolução' | 'portaria' | 'decreto'
  number: string
  date: string
  scope: 'federal' | 'estadual' | 'municipal'
  region?: string
  status: 'vigente' | 'revogado' | 'em_tramitacao'
  content: string
  url?: string
  tags: string[]
  summary: string
  importance: 'alta' | 'media' | 'baixa'
  created_at: string
  updated_at: string
}

export interface AnalyticsData {
  period: string
  metrics: {
    total_visits: number
    unique_visitors: number
    page_views: number
    bounce_rate: number
    average_session_duration: number
    top_pages: Array<{
      path: string
      views: number
      unique_views: number
    }>
    top_search_terms: Array<{
      term: string
      count: number
    }>
    user_demographics: {
      age_groups: Record<string, number>
      regions: Record<string, number>
      devices: Record<string, number>
    }
    content_performance: {
      most_viewed_news: NewsItem[]
      most_watched_videos: VideoItem[]
      popular_categories: Record<string, number>
    }
  }
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
  cached?: boolean
  cache_expires?: string
}

export interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  service: string
  action: string
  message: string
  metadata?: Record<string, any>
  user_id?: string
  ip_address?: string
}

export interface RateLimitConfig {
  requests: number
  window: number // em segundos
  message?: string
}

export interface ServiceError {
  code: string
  message: string
  details?: Record<string, any>
  timestamp: string
}
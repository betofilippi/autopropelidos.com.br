// Portal components exports
export { default as BreakingNewsBar, useBreakingNews } from './breaking-news-bar'
export { default as HeroNews, useHeroNews } from './hero-news'
export { default as NewsGrid, NewsCategoriesFilter, NewsStats } from './news-grid'
export { default as PortalSidebar, useSidebarData } from './portal-sidebar'

// Types
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
  relevance_score: number
  views?: number
  tags: string[]
}

export interface BreakingNewsItem {
  id: string
  title: string
  url: string
  timestamp: string
  priority: 'urgent' | 'high' | 'normal'
}

export interface TrendingItem {
  id: string
  title: string
  url: string
  views: number
  category: string
}

export interface QuickLink {
  id: string
  title: string
  url: string
  icon: any
  description: string
}

export interface NewsletterStats {
  subscribers: number
  growth: string
}
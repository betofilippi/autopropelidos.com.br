import { cacheManager } from '@/lib/utils/cache'
import { analyticsLogger } from '@/lib/utils/logger'
import type { AnalyticsData, NewsItem, VideoItem } from '@/lib/types/services'
import { getLatestNews, getNewsStats } from './news'
import { getLatestVideos } from './youtube'
import { getVehicleStats } from './vehicles'
import { getRegulationStats } from './regulations'

// Função para gerar dados mock de analytics
function generateMockAnalytics(): AnalyticsData {
  const now = new Date()
  const period = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  
  return {
    period,
    metrics: {
      total_visits: Math.floor(Math.random() * 50000) + 25000,
      unique_visitors: Math.floor(Math.random() * 30000) + 15000,
      page_views: Math.floor(Math.random() * 150000) + 75000,
      bounce_rate: Math.random() * 0.3 + 0.25, // 25% - 55%
      average_session_duration: Math.floor(Math.random() * 300) + 120, // 2-7 minutos
      top_pages: [
        {
          path: '/resolucao-996',
          views: Math.floor(Math.random() * 15000) + 8000,
          unique_views: Math.floor(Math.random() * 10000) + 5000
        },
        {
          path: '/ferramentas/verificador-conformidade',
          views: Math.floor(Math.random() * 12000) + 6000,
          unique_views: Math.floor(Math.random() * 8000) + 4000
        },
        {
          path: '/noticias',
          views: Math.floor(Math.random() * 10000) + 5000,
          unique_views: Math.floor(Math.random() * 7000) + 3500
        },
        {
          path: '/videos',
          views: Math.floor(Math.random() * 8000) + 4000,
          unique_views: Math.floor(Math.random() * 6000) + 3000
        },
        {
          path: '/veiculos',
          views: Math.floor(Math.random() * 7000) + 3500,
          unique_views: Math.floor(Math.random() * 5000) + 2500
        },
        {
          path: '/ferramentas',
          views: Math.floor(Math.random() * 6000) + 3000,
          unique_views: Math.floor(Math.random() * 4000) + 2000
        },
        {
          path: '/regulamentacoes',
          views: Math.floor(Math.random() * 5000) + 2500,
          unique_views: Math.floor(Math.random() * 3500) + 1750
        }
      ],
      top_search_terms: [
        {
          term: 'contran 996',
          count: Math.floor(Math.random() * 3000) + 1500
        },
        {
          term: 'patinete elétrico',
          count: Math.floor(Math.random() * 2500) + 1200
        },
        {
          term: 'bicicleta elétrica',
          count: Math.floor(Math.random() * 2000) + 1000
        },
        {
          term: 'ciclomotor',
          count: Math.floor(Math.random() * 1500) + 800
        },
        {
          term: 'mobilidade urbana',
          count: Math.floor(Math.random() * 1200) + 600
        },
        {
          term: 'segurança trânsito',
          count: Math.floor(Math.random() * 1000) + 500
        },
        {
          term: 'lei patinete',
          count: Math.floor(Math.random() * 800) + 400
        },
        {
          term: 'capacete obrigatório',
          count: Math.floor(Math.random() * 600) + 300
        },
        {
          term: 'multa patinete',
          count: Math.floor(Math.random() * 500) + 250
        },
        {
          term: 'documentação ciclomotor',
          count: Math.floor(Math.random() * 400) + 200
        }
      ],
      user_demographics: {
        age_groups: {
          '18-24': Math.floor(Math.random() * 8000) + 4000,
          '25-34': Math.floor(Math.random() * 12000) + 8000,
          '35-44': Math.floor(Math.random() * 10000) + 6000,
          '45-54': Math.floor(Math.random() * 6000) + 3000,
          '55-64': Math.floor(Math.random() * 3000) + 1500,
          '65+': Math.floor(Math.random() * 1000) + 500
        },
        regions: {
          'São Paulo': Math.floor(Math.random() * 15000) + 10000,
          'Rio de Janeiro': Math.floor(Math.random() * 8000) + 5000,
          'Minas Gerais': Math.floor(Math.random() * 6000) + 3000,
          'Paraná': Math.floor(Math.random() * 4000) + 2000,
          'Rio Grande do Sul': Math.floor(Math.random() * 3500) + 1750,
          'Santa Catarina': Math.floor(Math.random() * 3000) + 1500,
          'Bahia': Math.floor(Math.random() * 2500) + 1250,
          'Distrito Federal': Math.floor(Math.random() * 2000) + 1000,
          'Goiás': Math.floor(Math.random() * 1500) + 750,
          'Outros': Math.floor(Math.random() * 3000) + 1500
        },
        devices: {
          'Desktop': Math.floor(Math.random() * 15000) + 8000,
          'Mobile': Math.floor(Math.random() * 20000) + 15000,
          'Tablet': Math.floor(Math.random() * 5000) + 2000
        }
      },
      content_performance: {
        most_viewed_news: [],
        most_watched_videos: [],
        popular_categories: {
          'regulation': Math.floor(Math.random() * 10000) + 8000,
          'safety': Math.floor(Math.random() * 8000) + 6000,
          'urban_mobility': Math.floor(Math.random() * 7000) + 5000,
          'technology': Math.floor(Math.random() * 5000) + 3000,
          'general': Math.floor(Math.random() * 3000) + 1500
        }
      }
    }
  }
}

export async function getAnalytics(period?: string): Promise<AnalyticsData> {
  const cacheKey = `analytics:${period || 'current'}`
  
  const cached = cacheManager.analytics.get<AnalyticsData>(cacheKey)
  if (cached) {
    analyticsLogger.cacheHit(cacheKey)
    return cached
  }
  
  analyticsLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    // Gera dados mock de analytics
    const analyticsData = generateMockAnalytics()
    
    // Busca conteúdo real para completar os dados
    const [latestNews, latestVideos] = await Promise.all([
      getLatestNews('all', 5),
      getLatestVideos('all', 5)
    ])
    
    // Adiciona conteúdo real aos dados de performance
    analyticsData.metrics.content_performance.most_viewed_news = latestNews
    analyticsData.metrics.content_performance.most_watched_videos = latestVideos
    
    // Salva no cache por 15 minutos
    cacheManager.analytics.set(cacheKey, analyticsData, 900)
    
    const duration = Date.now() - startTime
    analyticsLogger.info('GET_ANALYTICS', `Generated analytics data for period ${period || 'current'}`, {
      period: period || 'current',
      total_visits: analyticsData.metrics.total_visits,
      unique_visitors: analyticsData.metrics.unique_visitors,
      duration_ms: duration,
      cached: false
    })
    
    return analyticsData
  } catch (error) {
    analyticsLogger.error('GET_ANALYTICS', 'Error generating analytics data', {
      period: period || 'current',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export async function getTrafficStats(): Promise<{
  daily_visits: Array<{ date: string; visits: number; unique_visitors: number }>
  hourly_distribution: Array<{ hour: number; visits: number }>
  referral_sources: Array<{ source: string; visits: number; percentage: number }>
  search_engines: Array<{ engine: string; visits: number; percentage: number }>
}> {
  const cacheKey = 'traffic:stats'
  
  const cached = cacheManager.analytics.get<any>(cacheKey)
  if (cached) {
    analyticsLogger.cacheHit(cacheKey)
    return cached
  }
  
  analyticsLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    // Gera dados mock de tráfego para os últimos 30 dias
    const dailyVisits = []
    const now = new Date()
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      dailyVisits.push({
        date: date.toISOString().split('T')[0],
        visits: Math.floor(Math.random() * 3000) + 1000,
        unique_visitors: Math.floor(Math.random() * 2000) + 700
      })
    }
    
    // Distribuição por hora (0-23)
    const hourlyDistribution = []
    for (let hour = 0; hour < 24; hour++) {
      let baseVisits = 100
      
      // Picos de tráfego em horários comerciais
      if (hour >= 8 && hour <= 11) baseVisits = 300 // Manhã
      if (hour >= 13 && hour <= 17) baseVisits = 400 // Tarde
      if (hour >= 19 && hour <= 22) baseVisits = 250 // Noite
      
      hourlyDistribution.push({
        hour,
        visits: baseVisits + Math.floor(Math.random() * 100)
      })
    }
    
    const totalReferralVisits = Math.floor(Math.random() * 10000) + 5000
    
    const referralSources = [
      { source: 'Google Orgânico', visits: Math.floor(totalReferralVisits * 0.45) },
      { source: 'Direto', visits: Math.floor(totalReferralVisits * 0.25) },
      { source: 'Facebook', visits: Math.floor(totalReferralVisits * 0.08) },
      { source: 'YouTube', visits: Math.floor(totalReferralVisits * 0.06) },
      { source: 'Instagram', visits: Math.floor(totalReferralVisits * 0.05) },
      { source: 'LinkedIn', visits: Math.floor(totalReferralVisits * 0.04) },
      { source: 'WhatsApp', visits: Math.floor(totalReferralVisits * 0.03) },
      { source: 'Outros', visits: Math.floor(totalReferralVisits * 0.04) }
    ].map(item => ({
      ...item,
      percentage: (item.visits / totalReferralVisits) * 100
    }))
    
    const searchEngines = [
      { engine: 'Google', visits: Math.floor(totalReferralVisits * 0.85) },
      { engine: 'Bing', visits: Math.floor(totalReferralVisits * 0.08) },
      { engine: 'Yahoo', visits: Math.floor(totalReferralVisits * 0.04) },
      { engine: 'DuckDuckGo', visits: Math.floor(totalReferralVisits * 0.02) },
      { engine: 'Outros', visits: Math.floor(totalReferralVisits * 0.01) }
    ].map(item => ({
      ...item,
      percentage: (item.visits / totalReferralVisits) * 100
    }))
    
    const trafficStats = {
      daily_visits: dailyVisits,
      hourly_distribution: hourlyDistribution,
      referral_sources: referralSources,
      search_engines: searchEngines
    }
    
    cacheManager.analytics.set(cacheKey, trafficStats, 1800) // 30 minutos
    
    const duration = Date.now() - startTime
    analyticsLogger.info('GET_TRAFFIC_STATS', `Generated traffic statistics`, {
      days: dailyVisits.length,
      total_referral_visits: totalReferralVisits,
      duration_ms: duration,
      cached: false
    })
    
    return trafficStats
  } catch (error) {
    analyticsLogger.error('GET_TRAFFIC_STATS', 'Error generating traffic statistics', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export async function getContentAnalytics(): Promise<{
  news: {
    total_views: number
    most_viewed: NewsItem[]
    engagement_rate: number
    avg_time_on_page: number
  }
  videos: {
    total_views: number
    most_watched: VideoItem[]
    engagement_rate: number
    avg_watch_time: number
  }
  searches: {
    total_searches: number
    top_terms: Array<{ term: string; count: number }>
    zero_results: number
    avg_results_per_search: number
  }
}> {
  const cacheKey = 'content:analytics'
  
  const cached = cacheManager.analytics.get<any>(cacheKey)
  if (cached) {
    analyticsLogger.cacheHit(cacheKey)
    return cached
  }
  
  analyticsLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    const [latestNews, latestVideos, newsStats] = await Promise.all([
      getLatestNews('all', 10),
      getLatestVideos('all', 10),
      getNewsStats()
    ])
    
    const contentAnalytics = {
      news: {
        total_views: Math.floor(Math.random() * 100000) + 50000,
        most_viewed: latestNews.slice(0, 5),
        engagement_rate: Math.random() * 0.3 + 0.6, // 60-90%
        avg_time_on_page: Math.floor(Math.random() * 180) + 120 // 2-5 minutos
      },
      videos: {
        total_views: Math.floor(Math.random() * 80000) + 40000,
        most_watched: latestVideos.slice(0, 5),
        engagement_rate: Math.random() * 0.25 + 0.65, // 65-90%
        avg_watch_time: Math.floor(Math.random() * 300) + 180 // 3-8 minutos
      },
      searches: {
        total_searches: Math.floor(Math.random() * 20000) + 10000,
        top_terms: [
          { term: 'contran 996', count: Math.floor(Math.random() * 2000) + 1000 },
          { term: 'patinete elétrico', count: Math.floor(Math.random() * 1500) + 800 },
          { term: 'bicicleta elétrica', count: Math.floor(Math.random() * 1200) + 600 },
          { term: 'ciclomotor', count: Math.floor(Math.random() * 1000) + 500 },
          { term: 'mobilidade urbana', count: Math.floor(Math.random() * 800) + 400 },
          { term: 'segurança', count: Math.floor(Math.random() * 600) + 300 },
          { term: 'regulamentação', count: Math.floor(Math.random() * 500) + 250 },
          { term: 'capacete', count: Math.floor(Math.random() * 400) + 200 }
        ],
        zero_results: Math.floor(Math.random() * 500) + 100,
        avg_results_per_search: Math.random() * 10 + 5 // 5-15 resultados
      }
    }
    
    cacheManager.analytics.set(cacheKey, contentAnalytics, 1800)
    
    const duration = Date.now() - startTime
    analyticsLogger.info('GET_CONTENT_ANALYTICS', `Generated content analytics`, {
      news_total_views: contentAnalytics.news.total_views,
      videos_total_views: contentAnalytics.videos.total_views,
      total_searches: contentAnalytics.searches.total_searches,
      duration_ms: duration,
      cached: false
    })
    
    return contentAnalytics
  } catch (error) {
    analyticsLogger.error('GET_CONTENT_ANALYTICS', 'Error generating content analytics', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export async function getDashboardSummary(): Promise<{
  overview: {
    total_visitors_today: number
    total_page_views_today: number
    avg_session_duration: number
    bounce_rate: number
    growth_visitors: number // % de crescimento
    growth_page_views: number // % de crescimento
  }
  content_stats: {
    total_news: number
    total_videos: number
    total_vehicles: number
    total_regulations: number
  }
  recent_activity: Array<{
    type: 'news' | 'video' | 'search' | 'visit'
    description: string
    timestamp: string
    value?: number
  }>
  alerts: Array<{
    type: 'info' | 'warning' | 'error' | 'success'
    message: string
    timestamp: string
  }>
}> {
  const cacheKey = 'dashboard:summary'
  
  const cached = cacheManager.analytics.get<any>(cacheKey)
  if (cached) {
    analyticsLogger.cacheHit(cacheKey)
    return cached
  }
  
  analyticsLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    const [newsStats, vehicleStats, regulationStats] = await Promise.all([
      getNewsStats(),
      getVehicleStats(),
      getRegulationStats()
    ])
    
    const summary = {
      overview: {
        total_visitors_today: Math.floor(Math.random() * 2000) + 800,
        total_page_views_today: Math.floor(Math.random() * 8000) + 3000,
        avg_session_duration: Math.floor(Math.random() * 300) + 180,
        bounce_rate: Math.random() * 0.2 + 0.3, // 30-50%
        growth_visitors: Math.random() * 20 - 5, // -5% a +15%
        growth_page_views: Math.random() * 25 - 5 // -5% a +20%
      },
      content_stats: {
        total_news: newsStats.total,
        total_videos: 18, // Baseado no mock data
        total_vehicles: vehicleStats.total,
        total_regulations: regulationStats.total
      },
      recent_activity: [
        {
          type: 'news' as const,
          description: 'Nova notícia publicada: "Análise: impacto econômico da regulamentação"',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min atrás
          value: 1
        },
        {
          type: 'search' as const,
          description: 'Pico de buscas por "contran 996"',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min atrás
          value: 156
        },
        {
          type: 'visit' as const,
          description: 'Tráfego elevado na página de verificador de conformidade',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1h atrás
          value: 342
        },
        {
          type: 'video' as const,
          description: 'Vídeo sobre segurança com patinetes ganhou 500+ visualizações',
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(), // 1.5h atrás
          value: 523
        }
      ],
      alerts: [
        {
          type: 'success' as const,
          message: 'Cache funcionando corretamente - taxa de hit de 87%',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString()
        },
        {
          type: 'info' as const,
          message: 'Novo conteúdo disponível para indexação',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
        },
        {
          type: 'warning' as const,
          message: 'Aumento de 25% em buscas com zero resultados',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString()
        }
      ]
    }
    
    cacheManager.analytics.set(cacheKey, summary, 600) // 10 minutos
    
    const duration = Date.now() - startTime
    analyticsLogger.info('GET_DASHBOARD_SUMMARY', `Generated dashboard summary`, {
      visitors_today: summary.overview.total_visitors_today,
      page_views_today: summary.overview.total_page_views_today,
      total_content: summary.content_stats.total_news + summary.content_stats.total_videos + summary.content_stats.total_vehicles + summary.content_stats.total_regulations,
      duration_ms: duration,
      cached: false
    })
    
    return summary
  } catch (error) {
    analyticsLogger.error('GET_DASHBOARD_SUMMARY', 'Error generating dashboard summary', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export function invalidateAnalyticsCache(pattern?: string): number {
  const invalidated = cacheManager.analytics.invalidate(pattern || '.*')
  analyticsLogger.info('INVALIDATE_CACHE', `Invalidated ${invalidated} cache entries`, {
    pattern: pattern || 'all'
  })
  return invalidated
}
import { cacheManager } from '@/lib/utils/cache'
import { searchLogger } from '@/lib/utils/logger'
import { quickSearch, searchEngine } from '@/lib/utils/search'
import type { SearchFilters, PaginationOptions, SearchResult } from '@/lib/types/services'
import { searchNews, getLatestNews } from './news'
import { searchVideos, getLatestVideos } from './youtube'
import { searchVehicles, getAllVehicles } from './vehicles'
import { searchRegulations, getAllRegulations } from './regulations'

export interface UnifiedSearchResult {
  query: string
  total_results: number
  results_by_type: {
    news: SearchResult<any>
    videos: SearchResult<any>
    vehicles: SearchResult<any>
    regulations: SearchResult<any>
  }
  suggestions: string[]
  search_time_ms: number
  cached: boolean
}

export interface SearchSuggestion {
  term: string
  type: 'news' | 'video' | 'vehicle' | 'regulation' | 'general'
  relevance: number
}

export async function unifiedSearch(
  query: string,
  options: {
    types?: Array<'news' | 'videos' | 'vehicles' | 'regulations'>
    filters?: SearchFilters
    pagination?: PaginationOptions
    includeSuggestions?: boolean
  } = {}
): Promise<UnifiedSearchResult> {
  const { 
    types = ['news', 'videos', 'vehicles', 'regulations'],
    filters,
    pagination,
    includeSuggestions = true
  } = options
  
  const cacheKey = `unified:${query}:${JSON.stringify({ types, filters, pagination })}`
  
  // Tenta buscar do cache primeiro
  const cached = cacheManager.analytics.get<UnifiedSearchResult>(cacheKey)
  if (cached) {
    searchLogger.cacheHit(cacheKey)
    searchLogger.searchQuery(query, filters || {}, cached.total_results)
    return { ...cached, cached: true }
  }
  
  searchLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    // Executa buscas em paralelo para todos os tipos solicitados
    const searchPromises: Promise<any>[] = []
    const searchTypes: string[] = []
    
    if (types.includes('news')) {
      searchPromises.push(searchNews(query, filters, pagination))
      searchTypes.push('news')
    }
    
    if (types.includes('videos')) {
      searchPromises.push(searchVideos(query, filters, pagination))
      searchTypes.push('videos')
    }
    
    if (types.includes('vehicles')) {
      searchPromises.push(searchVehicles(query, filters, pagination))
      searchTypes.push('vehicles')
    }
    
    if (types.includes('regulations')) {
      searchPromises.push(searchRegulations(query, filters, pagination))
      searchTypes.push('regulations')
    }
    
    const searchResults = await Promise.all(searchPromises)
    
    // Organiza os resultados por tipo
    const resultsByType: any = {
      news: { items: [], total: 0, page: 1, limit: 0, hasNext: false, hasPrevious: false, totalPages: 0 },
      videos: { items: [], total: 0, page: 1, limit: 0, hasNext: false, hasPrevious: false, totalPages: 0 },
      vehicles: { items: [], total: 0, page: 1, limit: 0, hasNext: false, hasPrevious: false, totalPages: 0 },
      regulations: { items: [], total: 0, page: 1, limit: 0, hasNext: false, hasPrevious: false, totalPages: 0 }
    }
    
    searchResults.forEach((result, index) => {
      const type = searchTypes[index]
      resultsByType[type] = result
    })
    
    // Calcula o total de resultados
    const totalResults = Object.values(resultsByType).reduce((sum: number, result: any) => sum + result.total, 0)
    
    // Gera sugestões se solicitado
    let suggestions: string[] = []
    if (includeSuggestions) {
      suggestions = await generateSearchSuggestions(query, types)
    }
    
    const searchTime = Date.now() - startTime
    
    const unifiedResult: UnifiedSearchResult = {
      query,
      total_results: totalResults,
      results_by_type: resultsByType,
      suggestions,
      search_time_ms: searchTime,
      cached: false
    }
    
    // Salva no cache por 10 minutos
    cacheManager.analytics.set(cacheKey, unifiedResult, 600)
    
    // Log da operação
    searchLogger.searchQuery(query, filters || {}, totalResults)
    searchLogger.info('UNIFIED_SEARCH', `Search completed across ${types.length} content types`, {
      query,
      types: types.join(','),
      total_results: totalResults,
      search_time_ms: searchTime,
      cached: false
    })
    
    return unifiedResult
  } catch (error) {
    searchLogger.error('UNIFIED_SEARCH', 'Error performing unified search', {
      query,
      types: types.join(','),
      filters,
      pagination,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export async function generateSearchSuggestions(
  query: string,
  types: Array<'news' | 'videos' | 'vehicles' | 'regulations'> = ['news', 'videos', 'vehicles', 'regulations']
): Promise<string[]> {
  const cacheKey = `suggestions:${query}:${types.join(',')}`
  
  const cached = cacheManager.analytics.get<string[]>(cacheKey)
  if (cached) {
    searchLogger.cacheHit(cacheKey)
    return cached
  }
  
  searchLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    // Coleta vocabulário de todos os tipos de conteúdo
    const vocabularyPromises: Promise<any[]>[] = []
    
    if (types.includes('news')) {
      vocabularyPromises.push(getLatestNews('all', 100))
    }
    if (types.includes('videos')) {
      vocabularyPromises.push(getLatestVideos('all', 100))
    }
    if (types.includes('vehicles')) {
      vocabularyPromises.push(getAllVehicles({}, { page: 1, limit: 100 }).then(r => r.items))
    }
    if (types.includes('regulations')) {
      vocabularyPromises.push(getAllRegulations({}, { page: 1, limit: 100 }).then(r => r.items))
    }
    
    const vocabularyResults = await Promise.all(vocabularyPromises)
    const allContent = vocabularyResults.flat()
    
    // Extrai termos populares
    const textFields = ['title', 'description', 'content', 'tags', 'name', 'summary']
    const suggestions = searchEngine.generateSearchSuggestions(query, allContent, textFields, 8)
    
    // Adiciona sugestões pré-definidas relevantes
    const predefinedSuggestions = [
      'contran 996',
      'patinete elétrico',
      'bicicleta elétrica',
      'ciclomotor',
      'mobilidade urbana',
      'segurança trânsito',
      'capacete obrigatório',
      'ciclofaixa',
      'regulamentação municipal',
      'multa patinete',
      'documentação ciclomotor',
      'velocidade máxima',
      'idade mínima',
      'equipamentos obrigatórios',
      'área de circulação'
    ]
    
    const relevantPredefined = predefinedSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(query.toLowerCase()) ||
      query.toLowerCase().includes(suggestion.toLowerCase())
    )
    
    // Combina e remove duplicatas
    const combinedSuggestions = [...new Set([...suggestions, ...relevantPredefined])]
      .slice(0, 10)
    
    cacheManager.analytics.set(cacheKey, combinedSuggestions, 1800) // 30 minutos
    
    const duration = Date.now() - startTime
    searchLogger.info('GENERATE_SUGGESTIONS', `Generated ${combinedSuggestions.length} suggestions`, {
      query,
      types: types.join(','),
      suggestions_count: combinedSuggestions.length,
      duration_ms: duration,
      cached: false
    })
    
    return combinedSuggestions
  } catch (error) {
    searchLogger.error('GENERATE_SUGGESTIONS', 'Error generating search suggestions', {
      query,
      types: types.join(','),
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return []
  }
}

export async function getPopularSearches(): Promise<Array<{
  term: string
  count: number
  growth: number // % de crescimento na última semana
  category: string
}>> {
  const cacheKey = 'popular:searches'
  
  const cached = cacheManager.analytics.get<any[]>(cacheKey)
  if (cached) {
    searchLogger.cacheHit(cacheKey)
    return cached
  }
  
  searchLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    // Mock data de buscas populares
    const popularSearches = [
      {
        term: 'contran 996',
        count: Math.floor(Math.random() * 5000) + 3000,
        growth: Math.random() * 50 + 10, // 10-60% de crescimento
        category: 'regulation'
      },
      {
        term: 'patinete elétrico',
        count: Math.floor(Math.random() * 4000) + 2500,
        growth: Math.random() * 30 + 5,
        category: 'vehicle'
      },
      {
        term: 'bicicleta elétrica',
        count: Math.floor(Math.random() * 3500) + 2000,
        growth: Math.random() * 25 + 0,
        category: 'vehicle'
      },
      {
        term: 'segurança trânsito',
        count: Math.floor(Math.random() * 2500) + 1500,
        growth: Math.random() * 40 + 15,
        category: 'safety'
      },
      {
        term: 'capacete obrigatório',
        count: Math.floor(Math.random() * 2000) + 1200,
        growth: Math.random() * 35 + 8,
        category: 'safety'
      },
      {
        term: 'ciclomotor documentação',
        count: Math.floor(Math.random() * 1800) + 1000,
        growth: Math.random() * 45 + 20,
        category: 'regulation'
      },
      {
        term: 'mobilidade urbana',
        count: Math.floor(Math.random() * 1500) + 800,
        growth: Math.random() * 20 + 5,
        category: 'general'
      },
      {
        term: 'velocidade máxima patinete',
        count: Math.floor(Math.random() * 1200) + 700,
        growth: Math.random() * 30 + 10,
        category: 'regulation'
      },
      {
        term: 'multa patinete elétrico',
        count: Math.floor(Math.random() * 1000) + 600,
        growth: Math.random() * 60 + 25,
        category: 'regulation'
      },
      {
        term: 'ciclofaixa uso',
        count: Math.floor(Math.random() * 800) + 500,
        growth: Math.random() * 25 + 0,
        category: 'infrastructure'
      }
    ]
    
    // Ordena por contagem
    popularSearches.sort((a, b) => b.count - a.count)
    
    cacheManager.analytics.set(cacheKey, popularSearches, 3600) // 1 hora
    
    const duration = Date.now() - startTime
    searchLogger.info('GET_POPULAR_SEARCHES', `Retrieved ${popularSearches.length} popular searches`, {
      searches_count: popularSearches.length,
      top_search: popularSearches[0]?.term,
      top_count: popularSearches[0]?.count,
      duration_ms: duration,
      cached: false
    })
    
    return popularSearches
  } catch (error) {
    searchLogger.error('GET_POPULAR_SEARCHES', 'Error retrieving popular searches', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export async function getSearchStats(): Promise<{
  total_searches_today: number
  total_searches_week: number
  avg_results_per_search: number
  zero_results_rate: number
  top_categories: Array<{ category: string; searches: number }>
  search_trends: Array<{ date: string; searches: number }>
}> {
  const cacheKey = 'search:stats'
  
  const cached = cacheManager.analytics.get<any>(cacheKey)
  if (cached) {
    searchLogger.cacheHit(cacheKey)
    return cached
  }
  
  searchLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    // Gera dados mock de estatísticas de busca
    const searchStats = {
      total_searches_today: Math.floor(Math.random() * 2000) + 800,
      total_searches_week: Math.floor(Math.random() * 12000) + 6000,
      avg_results_per_search: Math.random() * 10 + 5,
      zero_results_rate: Math.random() * 0.15 + 0.05, // 5-20%
      top_categories: [
        { category: 'regulation', searches: Math.floor(Math.random() * 3000) + 2000 },
        { category: 'vehicle', searches: Math.floor(Math.random() * 2500) + 1500 },
        { category: 'safety', searches: Math.floor(Math.random() * 2000) + 1000 },
        { category: 'general', searches: Math.floor(Math.random() * 1500) + 800 },
        { category: 'infrastructure', searches: Math.floor(Math.random() * 1000) + 500 }
      ],
      search_trends: []
    }
    
    // Gera tendências de busca dos últimos 7 dias
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      
      searchStats.search_trends.push({
        date: date.toISOString().split('T')[0],
        searches: Math.floor(Math.random() * 2000) + 800
      })
    }
    
    cacheManager.analytics.set(cacheKey, searchStats, 1800) // 30 minutos
    
    const duration = Date.now() - startTime
    searchLogger.info('GET_SEARCH_STATS', `Generated search statistics`, {
      searches_today: searchStats.total_searches_today,
      searches_week: searchStats.total_searches_week,
      zero_results_rate: searchStats.zero_results_rate,
      duration_ms: duration,
      cached: false
    })
    
    return searchStats
  } catch (error) {
    searchLogger.error('GET_SEARCH_STATS', 'Error generating search statistics', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export function invalidateSearchCache(pattern?: string): number {
  const invalidated = cacheManager.analytics.invalidate(pattern || 'unified.*|suggestions.*|popular.*|search.*')
  searchLogger.info('INVALIDATE_CACHE', `Invalidated ${invalidated} search cache entries`, {
    pattern: pattern || 'search-related'
  })
  return invalidated
}
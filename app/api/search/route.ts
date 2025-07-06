import { NextRequest, NextResponse } from 'next/server'
import { 
  unifiedSearch, 
  generateSearchSuggestions, 
  getPopularSearches, 
  getSearchStats,
  invalidateSearchCache
} from '@/lib/services/unified-search'
import type { SearchFilters, PaginationOptions } from '@/lib/types/services'
import { logger } from '@/lib/utils/logger'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const action = searchParams.get('action')
    
    // Se a ação é 'suggestions', gera sugestões
    if (action === 'suggestions') {
      const types = searchParams.get('types')?.split(',') as any[] || ['news', 'videos', 'vehicles', 'regulations']
      const suggestions = await generateSearchSuggestions(query || '', types)
      
      return NextResponse.json({
        success: true,
        data: suggestions,
        timestamp: new Date().toISOString()
      })
    }
    
    // Se a ação é 'popular', retorna buscas populares
    if (action === 'popular') {
      const popularSearches = await getPopularSearches()
      
      return NextResponse.json({
        success: true,
        data: popularSearches,
        timestamp: new Date().toISOString()
      })
    }
    
    // Se a ação é 'stats', retorna estatísticas de busca
    if (action === 'stats') {
      const stats = await getSearchStats()
      
      return NextResponse.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      })
    }
    
    // Se não tem query, retorna erro
    if (!query) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Query parameter (q) is required for search',
          timestamp: new Date().toISOString()
        },
        { status: 400 }
      )
    }

    // Parâmetros de busca
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const types = searchParams.get('types')?.split(',') as any[] || ['news', 'videos', 'vehicles', 'regulations']
    const category = searchParams.get('category')
    const sortBy = searchParams.get('sortBy') as any
    const sortOrder = searchParams.get('sortOrder') as any
    const includeSuggestions = searchParams.get('includeSuggestions') === 'true'
    
    // Configura filtros
    const filters: SearchFilters = {}
    if (category) filters.category = category
    if (sortBy) filters.sortBy = sortBy
    if (sortOrder) filters.sortOrder = sortOrder
    
    // Configura paginação
    const pagination: PaginationOptions = { page, limit }
    
    // Executa busca unificada
    const result = await unifiedSearch(query, {
      types,
      filters,
      pagination,
      includeSuggestions
    })
    
    const duration = Date.now() - startTime
    
    logger.apiResponse('GET', '/api/search', 200, duration)
    
    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        query,
        types: types.join(','),
        filters_applied: Object.keys(filters).length,
        response_time_ms: duration
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    const duration = Date.now() - startTime
    
    logger.error('API_SEARCH', 'Error in search endpoint', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration_ms: duration
    })
    
    logger.apiResponse('GET', '/api/search', 500, duration)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const action = body.action
    
    switch (action) {
      case 'track_search':
        // Tracking de busca para analytics
        const { query, results_count, user_id } = body
        
        logger.searchQuery(query, {}, results_count)
        if (user_id) {
          logger.userAction('search', user_id, { query, results_count })
        }
        
        return NextResponse.json({
          success: true,
          message: 'Search tracked successfully',
          timestamp: new Date().toISOString()
        })
        
      case 'report_results':
        // Reportar problemas com resultados de busca
        const { search_query, issue_type, description } = body
        
        logger.info('SEARCH_ISSUE_REPORT', `Issue reported for search: ${search_query}`, {
          search_query,
          issue_type,
          description,
          timestamp: new Date().toISOString()
        })
        
        return NextResponse.json({
          success: true,
          message: 'Issue report submitted successfully',
          timestamp: new Date().toISOString()
        })
        
      case 'invalidate_cache':
        // Invalidar cache de busca (apenas para administradores)
        const pattern = body.pattern
        const invalidated = invalidateSearchCache(pattern)
        
        return NextResponse.json({
          success: true,
          message: `Invalidated ${invalidated} search cache entries`,
          data: { invalidated_count: invalidated },
          timestamp: new Date().toISOString()
        })
        
      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
            available_actions: ['track_search', 'report_results', 'invalidate_cache'],
            timestamp: new Date().toISOString()
          },
          { status: 400 }
        )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request body',
        timestamp: new Date().toISOString()
      },
      { status: 400 }
    )
  }
}
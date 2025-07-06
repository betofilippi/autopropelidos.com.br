import { NextRequest, NextResponse } from 'next/server'
import { getAllRegulations, searchRegulations, getRegulationById, getRegulationsByScope, getRegulationsByRegion, getRegulationStats } from '@/lib/services/regulations'
import type { SearchFilters, PaginationOptions } from '@/lib/types/services'
import { logger } from '@/lib/utils/logger'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const search = searchParams.get('search')
    const action = searchParams.get('action')
    
    // Se tem ID, busca uma regulamentação específica
    if (id) {
      const regulation = await getRegulationById(id)
      
      if (!regulation) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Regulation not found',
            timestamp: new Date().toISOString()
          },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        data: regulation,
        timestamp: new Date().toISOString()
      })
    }
    
    // Se a ação é 'stats', retorna estatísticas
    if (action === 'stats') {
      const stats = await getRegulationStats()
      
      return NextResponse.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      })
    }
    
    // Parâmetros de busca e filtros
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const scope = searchParams.get('scope') as any // federal, estadual, municipal
    const region = searchParams.get('region')
    const type = searchParams.get('type') // lei, resolução, portaria, decreto
    const status = searchParams.get('status') // vigente, revogado, em_tramitacao
    const importance = searchParams.get('importance') // alta, media, baixa
    const sortBy = searchParams.get('sortBy') as any
    const sortOrder = searchParams.get('sortOrder') as any
    
    // Se tem escopo específico, usa função otimizada
    if (scope && !search && !region && !type) {
      const regulations = await getRegulationsByScope(scope)
      
      // Aplica paginação manual
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedRegulations = regulations.slice(startIndex, endIndex)
      
      return NextResponse.json({
        success: true,
        data: {
          items: paginatedRegulations,
          total: regulations.length,
          page,
          limit,
          hasNext: endIndex < regulations.length,
          hasPrevious: page > 1,
          totalPages: Math.ceil(regulations.length / limit)
        },
        timestamp: new Date().toISOString()
      })
    }
    
    // Se tem região específica, usa função otimizada
    if (region && !search && !type) {
      const regulations = await getRegulationsByRegion(region)
      
      // Aplica paginação manual
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedRegulations = regulations.slice(startIndex, endIndex)
      
      return NextResponse.json({
        success: true,
        data: {
          items: paginatedRegulations,
          total: regulations.length,
          page,
          limit,
          hasNext: endIndex < regulations.length,
          hasPrevious: page > 1,
          totalPages: Math.ceil(regulations.length / limit)
        },
        timestamp: new Date().toISOString()
      })
    }
    
    // Configura filtros
    const filters: SearchFilters = {}
    
    if (scope === 'federal' || scope === 'estadual' || scope === 'municipal') {
      // Filtro por escopo será aplicado no serviço
    }
    if (sortBy) filters.sortBy = sortBy
    if (sortOrder) filters.sortOrder = sortOrder
    
    // Configura paginação
    const pagination: PaginationOptions = { page, limit }
    
    let result
    
    // Se tem termo de busca, usa busca textual
    if (search) {
      result = await searchRegulations(search, filters, pagination)
    } else {
      // Caso contrário, lista todas com filtros
      result = await getAllRegulations(filters, pagination)
    }
    
    const duration = Date.now() - startTime
    
    logger.apiResponse('GET', '/api/regulations', 200, duration)
    
    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        search_term: search || undefined,
        filters_applied: Object.keys(filters).length,
        response_time_ms: duration
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    const duration = Date.now() - startTime
    
    logger.error('API_REGULATIONS', 'Error in regulations endpoint', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration_ms: duration
    })
    
    logger.apiResponse('GET', '/api/regulations', 500, duration)
    
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

// Método POST para futuras implementações (como bookmarks, alertas de atualização, etc.)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const action = body.action
    
    switch (action) {
      case 'bookmark':
        // Implementar sistema de favoritos para regulamentações
        return NextResponse.json({
          success: true,
          message: 'Bookmark feature coming soon',
          timestamp: new Date().toISOString()
        })
        
      case 'subscribe_updates':
        // Implementar alertas para atualizações de regulamentações
        return NextResponse.json({
          success: true,
          message: 'Update subscription feature coming soon',
          timestamp: new Date().toISOString()
        })
        
      case 'report_issue':
        // Implementar sistema para reportar problemas com regulamentações
        return NextResponse.json({
          success: true,
          message: 'Issue reporting feature coming soon',
          timestamp: new Date().toISOString()
        })
        
      default:
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid action',
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
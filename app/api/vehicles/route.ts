import { NextRequest, NextResponse } from 'next/server'
import { getAllVehicles, searchVehicles, getVehicleById, getVehiclesByType, getVehicleStats } from '@/lib/services/vehicles'
import type { SearchFilters, PaginationOptions } from '@/lib/types/services'
import { logger } from '@/lib/utils/logger'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const search = searchParams.get('search')
    const action = searchParams.get('action')
    
    // Se tem ID, busca um veículo específico
    if (id) {
      const vehicle = await getVehicleById(id)
      
      if (!vehicle) {
        return NextResponse.json(
          { 
            success: false,
            error: 'Vehicle not found',
            timestamp: new Date().toISOString()
          },
          { status: 404 }
        )
      }
      
      return NextResponse.json({
        success: true,
        data: vehicle,
        timestamp: new Date().toISOString()
      })
    }
    
    // Se a ação é 'stats', retorna estatísticas
    if (action === 'stats') {
      const stats = await getVehicleStats()
      
      return NextResponse.json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      })
    }
    
    // Parâmetros de busca e filtros
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const type = searchParams.get('type') as any
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const availability = searchParams.get('availability')
    const sortBy = searchParams.get('sortBy') as any
    const sortOrder = searchParams.get('sortOrder') as any
    
    // Se tem tipo específico, usa função otimizada
    if (type && !search && !category && !brand) {
      const vehicles = await getVehiclesByType(type)
      
      // Aplica paginação manual
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit
      const paginatedVehicles = vehicles.slice(startIndex, endIndex)
      
      return NextResponse.json({
        success: true,
        data: {
          items: paginatedVehicles,
          total: vehicles.length,
          page,
          limit,
          hasNext: endIndex < vehicles.length,
          hasPrevious: page > 1,
          totalPages: Math.ceil(vehicles.length / limit)
        },
        timestamp: new Date().toISOString()
      })
    }
    
    // Configura filtros
    const filters: SearchFilters = {}
    
    if (category) filters.category = category
    if (sortBy) filters.sortBy = sortBy
    if (sortOrder) filters.sortOrder = sortOrder
    
    // Configura paginação
    const pagination: PaginationOptions = { page, limit }
    
    let result
    
    // Se tem termo de busca, usa busca textual
    if (search) {
      result = await searchVehicles(search, filters, pagination)
    } else {
      // Caso contrário, lista todos com filtros
      result = await getAllVehicles(filters, pagination)
    }
    
    const duration = Date.now() - startTime
    
    logger.apiResponse('GET', '/api/vehicles', 200, duration)
    
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
    
    logger.error('API_VEHICLES', 'Error in vehicles endpoint', {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration_ms: duration
    })
    
    logger.apiResponse('GET', '/api/vehicles', 500, duration)
    
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

// Método POST para futuras implementações (como favoritos, comparações, etc.)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const action = body.action
    
    switch (action) {
      case 'compare':
        // Implementar comparação de veículos
        return NextResponse.json({
          success: true,
          message: 'Vehicle comparison feature coming soon',
          timestamp: new Date().toISOString()
        })
        
      case 'favorite':
        // Implementar sistema de favoritos
        return NextResponse.json({
          success: true,
          message: 'Favorites feature coming soon',
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
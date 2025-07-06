import { cacheManager } from '@/lib/utils/cache'
import { vehiclesLogger } from '@/lib/utils/logger'
import { quickSearch } from '@/lib/utils/search'
import type { SearchFilters, PaginationOptions, SearchResult, VehicleItem } from '@/lib/types/services'

// Mock data de veículos/equipamentos autopropelidos
const mockVehicles: VehicleItem[] = [
  {
    id: '1',
    name: 'Patinete Elétrico Xiaomi Mi Pro 2',
    brand: 'Xiaomi',
    model: 'Mi Pro 2',
    type: 'patinete',
    price_min: 2500,
    price_max: 3200,
    max_speed: 25,
    range: 45,
    weight: 14.2,
    max_load: 100,
    battery_capacity: 474,
    charging_time: 8.5,
    features: [
      'Display LED',
      'Freios a disco',
      'Aplicativo conectado',
      'Dobra em 3 segundos',
      'Pneus tubeless 8.5"',
      'Resistente à água IPX4'
    ],
    images: [
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544191696-15693072b1d8?w=600&h=400&fit=crop'
    ],
    description: 'O patinete elétrico mais popular do mercado brasileiro, com excelente custo-benefício e recursos avançados.',
    category: 'premium',
    availability: 'disponível',
    rating: 4.5,
    reviews_count: 1247,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-06-20T14:30:00Z'
  },
  {
    id: '2',
    name: 'Bicicleta Elétrica Caloi E-Vibe Urban',
    brand: 'Caloi',
    model: 'E-Vibe Urban',
    type: 'bicicleta',
    price_min: 4500,
    price_max: 5800,
    max_speed: 25,
    range: 60,
    weight: 22.5,
    max_load: 120,
    battery_capacity: 504,
    charging_time: 6,
    features: [
      'Motor central 250W',
      'Bateria removível',
      'Freios hidráulicos',
      'Câmbio Shimano 8 velocidades',
      'Pneus anti-furo',
      'Sistema de iluminação LED'
    ],
    images: [
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=400&fit=crop'
    ],
    description: 'Bicicleta elétrica urbana ideal para deslocamentos diários, com tecnologia nacional e excelente autonomia.',
    category: 'urbana',
    availability: 'disponível',
    rating: 4.7,
    reviews_count: 89,
    created_at: '2024-02-10T09:15:00Z',
    updated_at: '2024-06-18T11:45:00Z'
  },
  {
    id: '3',
    name: 'Ciclomotor Elétrico Voltz EVS',
    brand: 'Voltz',
    model: 'EVS',
    type: 'ciclomotor',
    price_min: 8900,
    price_max: 12500,
    max_speed: 50,
    range: 80,
    weight: 78,
    max_load: 150,
    battery_capacity: 1800,
    charging_time: 4,
    features: [
      'Motor 1500W',
      'Dupla suspensão',
      'Freios ABS',
      'Painel digital completo',
      'Compartimento sob o assento',
      'Homologação CONTRAN'
    ],
    images: [
      'https://images.unsplash.com/photo-1609178669106-2c8c5f2d0c68?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-1c0c6c9a9a7a?w=600&h=400&fit=crop'
    ],
    description: 'Ciclomotor elétrico nacional com design moderno e performance superior para mobilidade urbana.',
    category: 'premium',
    availability: 'disponível',
    rating: 4.3,
    reviews_count: 156,
    created_at: '2024-03-05T16:20:00Z',
    updated_at: '2024-06-15T09:30:00Z'
  },
  {
    id: '4',
    name: 'Patinete Elétrico Turboant X7 Pro',
    brand: 'Turboant',
    model: 'X7 Pro',
    type: 'patinete',
    price_min: 1800,
    price_max: 2400,
    max_speed: 32,
    range: 50,
    weight: 17.5,
    max_load: 120,
    battery_capacity: 468,
    charging_time: 6.5,
    features: [
      'Pneus 10 polegadas',
      'Dupla suspensão',
      'Display LCD',
      'Freios duplos',
      'Luzes LED integradas',
      'App para smartphone'
    ],
    images: [
      'https://images.unsplash.com/photo-1544191696-15693072b1d8?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop'
    ],
    description: 'Patinete elétrico robusto com excelente desempenho off-road e urbano.',
    category: 'performance',
    availability: 'disponível',
    rating: 4.4,
    reviews_count: 342,
    created_at: '2024-01-28T13:45:00Z',
    updated_at: '2024-06-10T15:20:00Z'
  },
  {
    id: '5',
    name: 'Bicicleta Elétrica Trek Verve+ 2',
    brand: 'Trek',
    model: 'Verve+ 2',
    type: 'bicicleta',
    price_min: 7800,
    price_max: 9200,
    max_speed: 25,
    range: 75,
    weight: 25.8,
    max_load: 136,
    battery_capacity: 625,
    charging_time: 5,
    features: [
      'Motor Bosch Performance',
      'Bateria integrada 625Wh',
      'Display Purion',
      'Freios hidráulicos Tektro',
      'Pneus Bontrager H5',
      'Suporte para bagageiro'
    ],
    images: [
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop'
    ],
    description: 'E-bike premium da Trek com motor Bosch e construção de alta qualidade.',
    category: 'premium',
    availability: 'disponível',
    rating: 4.8,
    reviews_count: 67,
    created_at: '2024-02-20T11:30:00Z',
    updated_at: '2024-06-22T16:10:00Z'
  },
  {
    id: '6',
    name: 'Patinete Elétrico Ninebot Max G30',
    brand: 'Segway-Ninebot',
    model: 'Max G30',
    type: 'patinete',
    price_min: 3500,
    price_max: 4200,
    max_speed: 25,
    range: 65,
    weight: 18.7,
    max_load: 100,
    battery_capacity: 551,
    charging_time: 6,
    features: [
      'Autonomia de até 65km',
      'Pneus pneumáticos 10"',
      'Sistema antifurto',
      'Conectividade Bluetooth',
      'Certificação IPX5',
      'Recuperação de energia'
    ],
    images: [
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1544191696-15693072b1d8?w=600&h=400&fit=crop'
    ],
    description: 'Patinete elétrico com maior autonomia do mercado, ideal para longas distâncias.',
    category: 'premium',
    availability: 'disponível',
    rating: 4.6,
    reviews_count: 892,
    created_at: '2024-01-12T08:20:00Z',
    updated_at: '2024-06-25T12:40:00Z'
  },
  {
    id: '7',
    name: 'Ciclomotor Elétrico Dafra Citycom',
    brand: 'Dafra',
    model: 'Citycom S',
    type: 'ciclomotor',
    price_min: 12500,
    price_max: 15800,
    max_speed: 50,
    range: 100,
    weight: 95,
    max_load: 180,
    battery_capacity: 2400,
    charging_time: 3.5,
    features: [
      'Motor 3000W',
      'Carregamento rápido',
      'Freios ABS/CBS',
      'Painel TFT colorido',
      'Baú de 28 litros',
      'Sistema keyless'
    ],
    images: [
      'https://images.unsplash.com/photo-1609178669106-2c8c5f2d0c68?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-1c0c6c9a9a7a?w=600&h=400&fit=crop'
    ],
    description: 'Ciclomotor elétrico nacional com tecnologia avançada e design sofisticado.',
    category: 'premium',
    availability: 'disponível',
    rating: 4.5,
    reviews_count: 234,
    created_at: '2024-03-18T14:15:00Z',
    updated_at: '2024-06-28T10:25:00Z'
  },
  {
    id: '8',
    name: 'Bicicleta Elétrica Sense Impulse E-Urban',
    brand: 'Sense',
    model: 'Impulse E-Urban',
    type: 'bicicleta',
    price_min: 5200,
    price_max: 6800,
    max_speed: 25,
    range: 55,
    weight: 24.3,
    max_load: 125,
    battery_capacity: 418,
    charging_time: 5.5,
    features: [
      'Motor traseiro 250W',
      'Bateria Samsung',
      'Freios Shimano',
      'Câmbio interno 3v',
      'Para-lamas inclusos',
      'Farol e lanterna LED'
    ],
    images: [
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=400&fit=crop'
    ],
    description: 'E-bike urbana da Sense com design clean e componentes de qualidade.',
    category: 'urbana',
    availability: 'disponível',
    rating: 4.2,
    reviews_count: 145,
    created_at: '2024-02-14T10:50:00Z',
    updated_at: '2024-06-12T17:35:00Z'
  },
  {
    id: '9',
    name: 'Patinete Elétrico Kaabo Wolf Warrior',
    brand: 'Kaabo',
    model: 'Wolf Warrior 11',
    type: 'patinete',
    price_min: 15500,
    price_max: 18900,
    max_speed: 70,
    range: 90,
    weight: 43,
    max_load: 150,
    battery_capacity: 1680,
    charging_time: 8,
    features: [
      'Motor duplo 5400W',
      'Pneus 11 polegadas',
      'Suspensão hidráulica',
      'Freios hidráulicos',
      'Display OLED',
      'Luzes de alta potência'
    ],
    images: [
      'https://images.unsplash.com/photo-1544191696-15693072b1d8?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=400&fit=crop'
    ],
    description: 'Patinete elétrico de alta performance para uso extremo e off-road.',
    category: 'performance',
    availability: 'em_falta',
    rating: 4.9,
    reviews_count: 78,
    created_at: '2024-04-02T12:10:00Z',
    updated_at: '2024-06-30T14:55:00Z'
  },
  {
    id: '10',
    name: 'Ciclomotor Elétrico Shineray SE1',
    brand: 'Shineray',
    model: 'SE1',
    type: 'ciclomotor',
    price_min: 6800,
    price_max: 8900,
    max_speed: 45,
    range: 70,
    weight: 68,
    max_load: 140,
    battery_capacity: 1296,
    charging_time: 6,
    features: [
      'Motor 1000W',
      'Bateria removível',
      'Freios a disco',
      'Painel LCD',
      'Porta-objetos',
      'Garantia 2 anos'
    ],
    images: [
      'https://images.unsplash.com/photo-1609178669106-2c8c5f2d0c68?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-1c0c6c9a9a7a?w=600&h=400&fit=crop'
    ],
    description: 'Ciclomotor elétrico com excelente custo-benefício e design moderno.',
    category: 'básica',
    availability: 'disponível',
    rating: 4.1,
    reviews_count: 298,
    created_at: '2024-03-25T09:40:00Z',
    updated_at: '2024-06-20T11:15:00Z'
  }
]

export async function getAllVehicles(
  filters?: SearchFilters,
  pagination?: PaginationOptions
): Promise<SearchResult<VehicleItem>> {
  const cacheKey = `all:${JSON.stringify(filters)}:${JSON.stringify(pagination)}`
  
  const cached = cacheManager.vehicles.get<SearchResult<VehicleItem>>(cacheKey)
  if (cached) {
    vehiclesLogger.cacheHit(cacheKey)
    return cached
  }
  
  vehiclesLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    const result = quickSearch(
      mockVehicles,
      '',
      ['name', 'brand', 'model', 'description', 'features'],
      { filters, pagination }
    )
    
    cacheManager.vehicles.set(cacheKey, result, 3600)
    
    const duration = Date.now() - startTime
    vehiclesLogger.info('GET_ALL_VEHICLES', `Retrieved ${result.total} vehicles`, {
      filters,
      pagination,
      duration_ms: duration,
      cached: false
    })
    
    return result
  } catch (error) {
    vehiclesLogger.error('GET_ALL_VEHICLES', 'Error retrieving vehicles', {
      filters,
      pagination,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export async function searchVehicles(
  searchTerm: string,
  filters?: SearchFilters,
  pagination?: PaginationOptions
): Promise<SearchResult<VehicleItem>> {
  const cacheKey = `search:${searchTerm}:${JSON.stringify(filters)}:${JSON.stringify(pagination)}`
  
  const cached = cacheManager.vehicles.get<SearchResult<VehicleItem>>(cacheKey)
  if (cached) {
    vehiclesLogger.cacheHit(cacheKey)
    return cached
  }
  
  vehiclesLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    const result = quickSearch(
      mockVehicles,
      searchTerm,
      ['name', 'brand', 'model', 'description', 'features'],
      { filters, pagination }
    )
    
    cacheManager.vehicles.set(cacheKey, result, 1800)
    
    const duration = Date.now() - startTime
    vehiclesLogger.searchQuery(searchTerm, filters || {}, result.total)
    vehiclesLogger.info('SEARCH_VEHICLES', `Search completed`, {
      search_term: searchTerm,
      results_count: result.total,
      duration_ms: duration,
      cached: false
    })
    
    return result
  } catch (error) {
    vehiclesLogger.error('SEARCH_VEHICLES', 'Error searching vehicles', {
      search_term: searchTerm,
      filters,
      pagination,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export async function getVehicleById(id: string): Promise<VehicleItem | null> {
  const cacheKey = `vehicle:${id}`
  
  const cached = cacheManager.vehicles.get<VehicleItem>(cacheKey)
  if (cached) {
    vehiclesLogger.cacheHit(cacheKey)
    vehiclesLogger.contentAccess('vehicle', id)
    return cached
  }
  
  vehiclesLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    const vehicle = mockVehicles.find(v => v.id === id) || null
    
    if (vehicle) {
      cacheManager.vehicles.set(cacheKey, vehicle, 3600)
    }
    
    const duration = Date.now() - startTime
    vehiclesLogger.contentAccess('vehicle', id)
    vehiclesLogger.info('GET_VEHICLE_BY_ID', `Retrieved vehicle ${id}`, {
      vehicle_id: id,
      found: !!vehicle,
      duration_ms: duration,
      cached: false
    })
    
    return vehicle
  } catch (error) {
    vehiclesLogger.error('GET_VEHICLE_BY_ID', 'Error retrieving vehicle', {
      vehicle_id: id,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export async function getVehiclesByType(type: VehicleItem['type']): Promise<VehicleItem[]> {
  const cacheKey = `type:${type}`
  
  const cached = cacheManager.vehicles.get<VehicleItem[]>(cacheKey)
  if (cached) {
    vehiclesLogger.cacheHit(cacheKey)
    return cached
  }
  
  vehiclesLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    const vehicles = mockVehicles.filter(v => v.type === type)
    
    cacheManager.vehicles.set(cacheKey, vehicles, 3600)
    
    const duration = Date.now() - startTime
    vehiclesLogger.info('GET_VEHICLES_BY_TYPE', `Retrieved ${vehicles.length} vehicles of type ${type}`, {
      type,
      count: vehicles.length,
      duration_ms: duration,
      cached: false
    })
    
    return vehicles
  } catch (error) {
    vehiclesLogger.error('GET_VEHICLES_BY_TYPE', 'Error retrieving vehicles by type', {
      type,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export async function getVehicleStats(): Promise<{
  total: number
  by_type: Record<string, number>
  by_brand: Record<string, number>
  by_category: Record<string, number>
  by_availability: Record<string, number>
  price_ranges: {
    budget: number
    mid_range: number
    premium: number
  }
  average_rating: number
}> {
  const cacheKey = 'stats:vehicles'
  
  const cached = cacheManager.vehicles.get<any>(cacheKey)
  if (cached) {
    vehiclesLogger.cacheHit(cacheKey)
    return cached
  }
  
  vehiclesLogger.cacheMiss(cacheKey)
  const startTime = Date.now()
  
  try {
    const stats = {
      total: mockVehicles.length,
      by_type: {} as Record<string, number>,
      by_brand: {} as Record<string, number>,
      by_category: {} as Record<string, number>,
      by_availability: {} as Record<string, number>,
      price_ranges: {
        budget: 0,
        mid_range: 0,
        premium: 0
      },
      average_rating: 0
    }
    
    let totalRating = 0
    
    for (const vehicle of mockVehicles) {
      // Contagem por tipo
      stats.by_type[vehicle.type] = (stats.by_type[vehicle.type] || 0) + 1
      
      // Contagem por marca
      stats.by_brand[vehicle.brand] = (stats.by_brand[vehicle.brand] || 0) + 1
      
      // Contagem por categoria
      stats.by_category[vehicle.category] = (stats.by_category[vehicle.category] || 0) + 1
      
      // Contagem por disponibilidade
      stats.by_availability[vehicle.availability] = (stats.by_availability[vehicle.availability] || 0) + 1
      
      // Faixas de preço
      const avgPrice = (vehicle.price_min + vehicle.price_max) / 2
      if (avgPrice < 3000) {
        stats.price_ranges.budget++
      } else if (avgPrice < 8000) {
        stats.price_ranges.mid_range++
      } else {
        stats.price_ranges.premium++
      }
      
      totalRating += vehicle.rating
    }
    
    stats.average_rating = totalRating / mockVehicles.length
    
    cacheManager.vehicles.set(cacheKey, stats, 3600)
    
    const duration = Date.now() - startTime
    vehiclesLogger.info('GET_VEHICLE_STATS', `Generated vehicle statistics`, {
      total: stats.total,
      types: Object.keys(stats.by_type).length,
      brands: Object.keys(stats.by_brand).length,
      duration_ms: duration,
      cached: false
    })
    
    return stats
  } catch (error) {
    vehiclesLogger.error('GET_VEHICLE_STATS', 'Error generating vehicle statistics', {
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    throw error
  }
}

export function invalidateVehiclesCache(pattern?: string): number {
  const invalidated = cacheManager.vehicles.invalidate(pattern || '.*')
  vehiclesLogger.info('INVALIDATE_CACHE', `Invalidated ${invalidated} cache entries`, {
    pattern: pattern || 'all'
  })
  return invalidated
}
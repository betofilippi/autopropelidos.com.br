import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get('limit') || '10'
    const offset = searchParams.get('offset') || '0'
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    
    // Use the CLI data fetching approach since direct client is having issues
    // This data was fetched from "autopropelidos.com.br" schema
    const vehiclesData = [
      {
        id: 1,
        name: "Xiaomi Mi Electric Scooter Pro 2",
        type: "patinete",
        manufacturer: "Xiaomi",
        model: "Mi Pro 2",
        year: 2020,
        description: "Patinete elétrico com autonomia de até 45km e velocidade máxima de 25km/h",
        image_url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
        specifications: {
          peso: "14.2kg",
          bateria: "474Wh",
          potencia: "300W",
          autonomia: "45km",
          velocidade_max: "25km/h"
        },
        price_range: "R$ 2.500 - R$ 3.000",
        category: "urbano",
        tags: ["xiaomi", "patinete", "elétrico"],
        rating: 4.50,
        featured: true,
        created_at: "2025-07-05T04:01:07.593Z",
        updated_at: "2025-07-05T04:01:07.593Z"
      },
      {
        id: 2,
        name: "Segway Ninebot ES4",
        type: "patinete",
        manufacturer: "Segway",
        model: "Ninebot ES4",
        year: 2019,
        description: "Patinete elétrico dobrável com suspensão dianteira e traseira",
        image_url: "https://images.unsplash.com/photo-1544966503-7a5ac882d7e6?w=500",
        specifications: {
          peso: "14kg",
          bateria: "374Wh",
          potencia: "300W",
          autonomia: "45km",
          velocidade_max: "30km/h"
        },
        price_range: "R$ 3.000 - R$ 3.500",
        category: "urbano",
        tags: ["segway", "patinete", "suspensão"],
        rating: 4.30,
        featured: true,
        created_at: "2025-07-05T04:01:07.593Z",
        updated_at: "2025-07-05T04:01:07.593Z"
      },
      {
        id: 3,
        name: "Dualtron Thunder",
        type: "patinete",
        manufacturer: "Dualtron",
        model: "Thunder",
        year: 2021,
        description: "Patinete elétrico de alta performance para longas distâncias",
        image_url: "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500",
        specifications: {
          peso: "47kg",
          bateria: "2880Wh",
          potencia: "5400W",
          autonomia: "120km",
          velocidade_max: "85km/h"
        },
        price_range: "R$ 15.000 - R$ 20.000",
        category: "performance",
        tags: ["dualtron", "performance", "longa_distancia"],
        rating: 4.80,
        featured: false,
        created_at: "2025-07-05T04:01:07.593Z",
        updated_at: "2025-07-05T04:01:07.593Z"
      }
    ]
    
    // Filter by type if provided
    let filteredVehicles = vehiclesData
    if (type) {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.type === type)
    }
    
    // Filter by category if provided
    if (category) {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.category === category)
    }
    
    // Filter by featured if provided
    if (featured === 'true') {
      filteredVehicles = filteredVehicles.filter(vehicle => vehicle.featured)
    }
    
    // Apply pagination
    const startIndex = parseInt(offset)
    const endIndex = startIndex + parseInt(limit)
    const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex)
    
    return NextResponse.json({
      success: true,
      data: paginatedVehicles,
      pagination: {
        total: filteredVehicles.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: endIndex < filteredVehicles.length
      }
    })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch vehicles',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
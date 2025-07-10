import { createClient } from '@/lib/supabase/client'
import { Vehicle } from '@/lib/types'

// Type aliases for consistency
type VehicleInsert = Omit<Vehicle, 'id' | 'created_at'>
type VehicleUpdate = Partial<VehicleInsert>

import type { SupabaseClient } from '@supabase/supabase-js'

export interface VehicleFilters {
  category?: Vehicle['category']
  brand?: string
  year?: number
  minYear?: number
  maxYear?: number
  minPower?: number
  maxPower?: number
  minSpeed?: number
  maxSpeed?: number
  hasPedalAssist?: boolean
  hasThrottle?: boolean
  compliant996?: boolean
  minPrice?: number
  maxPrice?: number
  searchQuery?: string
  limit?: number
  offset?: number
}

export interface VehicleResponse {
  data: Vehicle[]
  count: number
  error?: string
}

export interface VehicleStatistics {
  totalVehicles: number
  compliantVehicles: number
  averagePrice: number
  averagePower: number
  averageSpeed: number
  categoryCounts: Record<Vehicle['category'], number>
}

class VehicleService {
  private getClient() {
    if (typeof window === 'undefined') {
      try {
        return createClient()
      } catch {
        return createClient()
      }
    }
    return createClient()
  }

  async getAll(filters?: VehicleFilters): Promise<VehicleResponse> {
    try {
      const supabase = this.getClient()
      let query = supabase.from('vehicles').select('*', { count: 'exact' })

      // Apply filters
      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      if (filters?.brand) {
        query = query.ilike('brand', `%${filters.brand}%`)
      }
      if (filters?.year) {
        query = query.eq('year', filters.year)
      }
      if (filters?.minYear) {
        query = query.gte('year', filters.minYear)
      }
      if (filters?.maxYear) {
        query = query.lte('year', filters.maxYear)
      }
      if (filters?.minPower) {
        query = query.gte('motor_power_watts', filters.minPower)
      }
      if (filters?.maxPower) {
        query = query.lte('motor_power_watts', filters.maxPower)
      }
      if (filters?.minSpeed) {
        query = query.gte('max_speed_kmh', filters.minSpeed)
      }
      if (filters?.maxSpeed) {
        query = query.lte('max_speed_kmh', filters.maxSpeed)
      }
      if (filters?.hasPedalAssist !== undefined) {
        query = query.eq('has_pedal_assist', filters.hasPedalAssist)
      }
      if (filters?.hasThrottle !== undefined) {
        query = query.eq('has_throttle', filters.hasThrottle)
      }
      if (filters?.compliant996 !== undefined) {
        query = query.eq('compliant_996', filters.compliant996)
      }
      if (filters?.minPrice) {
        query = query.gte('price_brl', filters.minPrice)
      }
      if (filters?.maxPrice) {
        query = query.lte('price_brl', filters.maxPrice)
      }
      if (filters?.searchQuery) {
        query = query.or(`brand.ilike.%${filters.searchQuery}%,model.ilike.%${filters.searchQuery}%`)
      }

      // Apply ordering
      query = query
        .order('compliant_996', { ascending: false })
        .order('year', { ascending: false })
        .order('brand', { ascending: true })
        .order('model', { ascending: true })

      // Apply pagination
      const limit = filters?.limit || 20
      const offset = filters?.offset || 0
      query = query.range(offset, offset + limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      return {
        data: data || [],
        count: count || 0,
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Failed to fetch vehicles',
      }
    }
  }

  async getById(id: string): Promise<Vehicle | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching vehicle by id:', error)
      return null
    }
  }

  async getByBrandModel(brand: string, model: string): Promise<Vehicle[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('brand', brand)
        .eq('model', model)
        .order('year', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching vehicles by brand and model:', error)
      return []
    }
  }

  async create(vehicle: VehicleInsert): Promise<Vehicle | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('vehicles')
        .insert(vehicle)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating vehicle:', error)
      return null
    }
  }

  async update(id: string, updates: VehicleUpdate): Promise<Vehicle | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating vehicle:', error)
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting vehicle:', error)
      return false
    }
  }

  async search(query: string, limit = 20): Promise<Vehicle[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .or(`brand.ilike.%${query}%,model.ilike.%${query}%,compliance_notes.ilike.%${query}%`)
        .order('compliant_996', { ascending: false })
        .order('year', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching vehicles:', error)
      return []
    }
  }

  async getCompliant(): Promise<Vehicle[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('compliant_996', true)
        .order('brand', { ascending: true })
        .order('model', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching compliant vehicles:', error)
      return []
    }
  }

  async getNonCompliant(): Promise<Vehicle[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('compliant_996', false)
        .order('brand', { ascending: true })
        .order('model', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching non-compliant vehicles:', error)
      return []
    }
  }

  async getBrands(): Promise<string[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('vehicles')
        .select('brand')
        .order('brand')

      if (error) throw error
      
      // Extract unique brands
      const brands = new Set(data?.map(item => item.brand) || [])
      return Array.from(brands)
    } catch (error) {
      console.error('Error fetching vehicle brands:', error)
      return []
    }
  }

  async getModelsByBrand(brand: string): Promise<string[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('vehicles')
        .select('model')
        .eq('brand', brand)
        .order('model')

      if (error) throw error
      
      // Extract unique models
      const models = new Set(data?.map(item => item.model) || [])
      return Array.from(models)
    } catch (error) {
      console.error('Error fetching models by brand:', error)
      return []
    }
  }

  async getByCategory(category: Vehicle['category']): Promise<Vehicle[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('category', category)
        .order('compliant_996', { ascending: false })
        .order('brand', { ascending: true })
        .order('model', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching vehicles by category:', error)
      return []
    }
  }

  async getStatistics(): Promise<VehicleStatistics | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')

      if (error) throw error
      if (!data || data.length === 0) return null

      const stats: VehicleStatistics = {
        totalVehicles: data.length,
        compliantVehicles: data.filter(v => v.compliant_996).length,
        averagePrice: 0,
        averagePower: 0,
        averageSpeed: 0,
        categoryCounts: {
          electric_bicycle: 0,
          moped: 0,
          self_propelled: 0,
          other: 0,
        },
      }

      let priceCount = 0
      let totalPrice = 0
      let totalPower = 0
      let totalSpeed = 0

      data.forEach(vehicle => {
        // Calculate averages
        if (vehicle.price_brl) {
          totalPrice += vehicle.price_brl
          priceCount++
        }
        totalPower += vehicle.motor_power_watts
        totalSpeed += vehicle.max_speed_kmh

        // Count categories
        if (vehicle.category in stats.categoryCounts) {
          (stats.categoryCounts as any)[vehicle.category]++
        }
      })

      stats.averagePrice = priceCount > 0 ? totalPrice / priceCount : 0
      stats.averagePower = totalPower / data.length
      stats.averageSpeed = totalSpeed / data.length

      return stats
    } catch (error) {
      console.error('Error calculating vehicle statistics:', error)
      return null
    }
  }

  async getSimilar(vehicleId: string, limit = 6): Promise<Vehicle[]> {
    try {
      const supabase = this.getClient()
      
      // First get the current vehicle
      const currentVehicle = await this.getById(vehicleId)
      if (!currentVehicle) return []

      // Find similar vehicles by category and specifications
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .neq('id', vehicleId)
        .eq('category', currentVehicle.category)
        .gte('motor_power_watts', currentVehicle.motor_power_watts * 0.8)
        .lte('motor_power_watts', currentVehicle.motor_power_watts * 1.2)
        .gte('max_speed_kmh', currentVehicle.max_speed_kmh * 0.8)
        .lte('max_speed_kmh', currentVehicle.max_speed_kmh * 1.2)
        .order('compliant_996', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching similar vehicles:', error)
      return []
    }
  }

  async checkCompliance(vehicle: Partial<Vehicle>): Promise<{ compliant: boolean; reasons: string[] }> {
    const reasons: string[] = []

    // Check Resolution 996 compliance
    if (vehicle.motor_power_watts && vehicle.motor_power_watts > 1000) {
      reasons.push('Motor power exceeds 1000W limit')
    }
    if (vehicle.max_speed_kmh && vehicle.max_speed_kmh > 32) {
      reasons.push('Maximum speed exceeds 32 km/h limit')
    }
    if (vehicle.width_cm && vehicle.width_cm > 100) {
      reasons.push('Width exceeds 100cm limit')
    }
    if (vehicle.wheelbase_cm && vehicle.wheelbase_cm > 130) {
      reasons.push('Wheelbase exceeds 130cm limit')
    }
    if (vehicle.category === 'self_propelled' && !vehicle.has_pedal_assist) {
      reasons.push('Self-propelled vehicles must have pedal assist')
    }

    return {
      compliant: reasons.length === 0,
      reasons,
    }
  }
}

export const vehicleService = new VehicleService()
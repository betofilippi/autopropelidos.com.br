import { createClient, createServerSupabaseClient, type Regulation, type RegulationInsert, type RegulationUpdate } from '@/lib/supabase/client'
import { SupabaseClient } from '@supabase/supabase-js'

export interface RegulationFilters {
  regulationType?: Regulation['regulation_type']
  country?: string
  state?: string
  city?: string
  searchQuery?: string
  effectiveAfter?: string
  effectiveBefore?: string
  limit?: number
  offset?: number
}

export interface RegulationResponse {
  data: Regulation[]
  count: number
  error?: string
}

export interface RegulationLocation {
  city: string | null
  state: string
  country: string
  count: number
}

class RegulationService {
  private getClient(): SupabaseClient {
    if (typeof window === 'undefined') {
      try {
        return createServerSupabaseClient()
      } catch {
        return createClient()
      }
    }
    return createClient()
  }

  async getAll(filters?: RegulationFilters): Promise<RegulationResponse> {
    try {
      const supabase = this.getClient()
      let query = supabase.from('regulations').select('*', { count: 'exact' })

      // Apply filters
      if (filters?.regulationType) {
        query = query.eq('regulation_type', filters.regulationType)
      }
      if (filters?.country) {
        query = query.eq('country', filters.country)
      }
      if (filters?.state) {
        query = query.eq('state', filters.state)
      }
      if (filters?.city) {
        query = query.eq('city', filters.city)
      }
      if (filters?.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,description.ilike.%${filters.searchQuery}%`)
      }
      if (filters?.effectiveAfter) {
        query = query.gte('effective_date', filters.effectiveAfter)
      }
      if (filters?.effectiveBefore) {
        query = query.lte('effective_date', filters.effectiveBefore)
      }

      // Apply ordering - most recent and by type (federal > state > municipal)
      query = query
        .order('effective_date', { ascending: false })
        .order('regulation_type', { ascending: false })

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
      console.error('Error fetching regulations:', error)
      return {
        data: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Failed to fetch regulations',
      }
    }
  }

  async getById(id: string): Promise<Regulation | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('regulations')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching regulation by id:', error)
      return null
    }
  }

  async create(regulation: RegulationInsert): Promise<Regulation | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('regulations')
        .insert({
          ...regulation,
          last_updated: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating regulation:', error)
      return null
    }
  }

  async update(id: string, updates: RegulationUpdate): Promise<Regulation | null> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('regulations')
        .update({
          ...updates,
          last_updated: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating regulation:', error)
      return null
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const supabase = this.getClient()
      const { error } = await supabase
        .from('regulations')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting regulation:', error)
      return false
    }
  }

  async search(query: string, limit = 20): Promise<Regulation[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('regulations')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%`)
        .order('effective_date', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error searching regulations:', error)
      return []
    }
  }

  async getByLocation(state: string, city?: string): Promise<Regulation[]> {
    try {
      const supabase = this.getClient()
      let query = supabase
        .from('regulations')
        .select('*')
        .eq('state', state)

      if (city) {
        query = query.eq('city', city)
      }

      query = query.order('regulation_type', { ascending: false })
                   .order('effective_date', { ascending: false })

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching regulations by location:', error)
      return []
    }
  }

  async getActive(date?: string): Promise<Regulation[]> {
    try {
      const supabase = this.getClient()
      const effectiveDate = date || new Date().toISOString()

      const { data, error } = await supabase
        .from('regulations')
        .select('*')
        .lte('effective_date', effectiveDate)
        .order('regulation_type', { ascending: false })
        .order('effective_date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching active regulations:', error)
      return []
    }
  }

  async getUpcoming(days = 30): Promise<Regulation[]> {
    try {
      const supabase = this.getClient()
      const today = new Date()
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + days)

      const { data, error } = await supabase
        .from('regulations')
        .select('*')
        .gt('effective_date', today.toISOString())
        .lte('effective_date', futureDate.toISOString())
        .order('effective_date', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching upcoming regulations:', error)
      return []
    }
  }

  async getLocations(): Promise<RegulationLocation[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('regulations')
        .select('city, state, country')

      if (error) throw error

      // Group by location
      const locationMap = new Map<string, RegulationLocation>()
      data?.forEach(reg => {
        const key = `${reg.country}-${reg.state}-${reg.city || 'all'}`
        const existing = locationMap.get(key)
        if (existing) {
          existing.count++
        } else {
          locationMap.set(key, {
            city: reg.city,
            state: reg.state,
            country: reg.country,
            count: 1,
          })
        }
      })

      return Array.from(locationMap.values())
        .sort((a, b) => {
          // Sort by country, then state, then city
          if (a.country !== b.country) return a.country.localeCompare(b.country)
          if (a.state !== b.state) return a.state.localeCompare(b.state)
          if (a.city && b.city) return a.city.localeCompare(b.city)
          return a.city ? 1 : -1 // Cities after states
        })
    } catch (error) {
      console.error('Error fetching regulation locations:', error)
      return []
    }
  }

  async getByType(type: Regulation['regulation_type']): Promise<Regulation[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('regulations')
        .select('*')
        .eq('regulation_type', type)
        .order('effective_date', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching regulations by type:', error)
      return []
    }
  }

  async checkDuplicates(title: string, location: { state: string; city?: string }): Promise<boolean> {
    try {
      const supabase = this.getClient()
      let query = supabase
        .from('regulations')
        .select('id')
        .ilike('title', `%${title}%`)
        .eq('state', location.state)

      if (location.city) {
        query = query.eq('city', location.city)
      }

      const { data, error } = await query

      if (error) throw error
      return (data?.length || 0) > 0
    } catch (error) {
      console.error('Error checking for duplicate regulations:', error)
      return false
    }
  }

  async getComplianceRequirements(regulationId: string): Promise<any> {
    try {
      const regulation = await this.getById(regulationId)
      if (!regulation) return null

      return regulation.requirements
    } catch (error) {
      console.error('Error fetching compliance requirements:', error)
      return null
    }
  }

  async getRecentlyUpdated(limit = 10): Promise<Regulation[]> {
    try {
      const supabase = this.getClient()
      const { data, error } = await supabase
        .from('regulations')
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching recently updated regulations:', error)
      return []
    }
  }
}

export const regulationService = new RegulationService()
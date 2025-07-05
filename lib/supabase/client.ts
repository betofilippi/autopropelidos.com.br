import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

// Browser client for client-side operations
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      db: {
        schema: 'autopropelidos.com.br'
      },
      auth: {
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  )
}

// Server client for server-side operations
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
      db: {
        schema: 'autopropelidos.com.br'
      }
    }
  )
}

// Admin client with service role for administrative operations
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      db: {
        schema: 'autopropelidos.com.br'
      }
    }
  )
}

// Export types for convenience
export type { Database } from './database.types'
export type Tables = Database['autopropelidos.com.br']['Tables']
export type News = Tables['news']['Row']
export type NewsInsert = Tables['news']['Insert']
export type NewsUpdate = Tables['news']['Update']
export type Video = Tables['videos']['Row']
export type VideoInsert = Tables['videos']['Insert']
export type VideoUpdate = Tables['videos']['Update']
export type Regulation = Tables['regulations']['Row']
export type RegulationInsert = Tables['regulations']['Insert']
export type RegulationUpdate = Tables['regulations']['Update']
export type Vehicle = Tables['vehicles']['Row']
export type VehicleInsert = Tables['vehicles']['Insert']
export type VehicleUpdate = Tables['vehicles']['Update']
export type User = Tables['users']['Row']
export type UserInsert = Tables['users']['Insert']
export type UserUpdate = Tables['users']['Update']
export type Analytics = Tables['analytics']['Row']
export type AnalyticsInsert = Tables['analytics']['Insert']
export type AnalyticsUpdate = Tables['analytics']['Update']
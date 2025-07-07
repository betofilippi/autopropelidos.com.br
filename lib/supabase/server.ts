import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

export async function createClient() {
  // Durante o build, sempre usar mock client
  if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
    // Durante o build estático, não tentar conectar ao Supabase
    throw new Error('Supabase disabled during static generation - using mock data')
  }

  // Valores de ambiente com fallback para desenvolvimento
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key'
  
  // Se não tiver variáveis configuradas, falhar para usar mock data
  if (supabaseUrl === 'https://dummy.supabase.co' || supabaseKey === 'dummy_anon_key') {
    throw new Error('Supabase environment not configured - using fallback mock data')
  }

  const cookieStore = await cookies()

  return createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
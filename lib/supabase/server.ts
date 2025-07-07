import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

export async function createClient() {
  // Durante o build no Vercel, usar valores dummy se as variáveis não estiverem configuradas
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_anon_key'
  
  // Se usar valores dummy, não conectar realmente
  if (supabaseUrl === 'https://dummy.supabase.co' || supabaseKey === 'dummy_anon_key') {
    // Durante o build, falha silenciosamente para usar fallback
    if (typeof window === 'undefined') {
      throw new Error('Supabase disabled during build process - using fallback data')
    }
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
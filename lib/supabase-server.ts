import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

/**
 * Create a Supabase client for server-side operations
 * This client uses cookies to maintain authentication state
 */
export async function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  const cookieStore = await cookies()
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      // Get session from cookies if available
      getSession: async () => {
        const accessToken = cookieStore.get('sb-access-token')?.value
        const refreshToken = cookieStore.get('sb-refresh-token')?.value
        
        if (!accessToken) {
          return { data: { session: null }, error: null }
        }
        
        // Return a session-like object (simplified - you may need to adjust this)
        return {
          data: {
            session: {
              access_token: accessToken,
              refresh_token: refreshToken,
              expires_at: Date.now() + 3600 * 1000, // 1 hour from now
            },
          },
          error: null,
        }
      },
    },
  })
}


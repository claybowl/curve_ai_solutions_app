import { cookies } from 'next/headers'

/**
 * Creates a Supabase client for server-side operations
 * @returns A server-side Supabase client that uses cookies
 */
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables in createServerSupabaseClient')
    // For build time, return a minimal mock client
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        updateUser: () => Promise.resolve({ error: null }),
        signOut: () => Promise.resolve({ error: null })
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: null, error: null }),
            single: () => Promise.resolve({ data: null, error: null })
          })
        }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null })
      })
    } as any
  }

  // Dynamic import to avoid build-time issues
  const { createServerClient } = require('@supabase/ssr')
  const { CookieOptions } = require('@supabase/ssr')

  const cookieStore = cookies()
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

/**
 * Verifies if the current user has admin role
 * @returns boolean indicating if the user has admin role
 */
export async function verifyAdminRole() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  return !!(session && session.user.user_metadata?.role === "admin")
}

/**
 * Gets the current session if it exists
 * @returns The current session or null
 */
export async function getServerSession() {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  
  return session
}

/**
 * Gets the current user if authenticated
 * @returns The current user or null
 */
export async function getServerUser() {
  const session = await getServerSession()
  return session?.user || null
}
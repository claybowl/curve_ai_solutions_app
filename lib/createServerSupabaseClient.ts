import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { CookieOptions } from '@supabase/ssr'

/**
 * Creates a Supabase client for server-side operations
 * @returns A server-side Supabase client that uses cookies
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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
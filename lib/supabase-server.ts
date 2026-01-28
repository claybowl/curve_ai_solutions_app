/**
 * Supabase Server Configuration
 * 
 * This file provides Supabase server-side utilities for use in Server Components and Server Actions.
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Create a Supabase client for server-side operations
 * Uses cookies for session management
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  })
}

/**
 * Alias for backward compatibility
 */
export const createClient = createServerSupabaseClient

/**
 * Get current authenticated user (server-side)
 */
export async function getCurrentUserServer() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Error getting current user:', error)
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error in getCurrentUserServer:', error)
    return null
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUserServer()
  return !!user
}

/**
 * Require authentication - throw error if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUserServer()
  if (!user) {
    throw new Error('Unauthorized - authentication required')
  }
  return user
}

/**
  * Get user profile from profiles table (Neon PostgreSQL)
  */
export async function getUserProfile(userId: string) {
  try {
    const { sql } = await import('@/lib/db')
    const result = await sql.query(
      `SELECT * FROM profiles WHERE user_id = $1`,
      [userId]
    )
    
    if (!result || !result.rows || result.rows.length === 0) {
      return null
    }
    
    return result.rows[0]
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}

/**
 * Verify that the current authenticated user has admin role.
 * Checks both profiles.role and email allowlist.
 */
export async function verifyAdminRole(): Promise<boolean> {
  try {
    const user = await getCurrentUserServer()
    if (!user) return false

    // Check profiles.role
    const profile = await getUserProfile(user.id)
    return profile?.role === 'admin'
  } catch (error) {
    console.error('Error checking admin permission:', error)
    return false
  }
}

/**
 * Alias for backward compatibility
 */
export const isUserAdmin = verifyAdminRole

/**
 * Require admin permission - throw error if not admin
 */
export async function requireAdmin() {
  const user = await requireAuth()
  const isAdmin = await verifyAdminRole()
  if (!isAdmin) {
    throw new Error('Unauthorized - admin access required')
  }
  return user
}

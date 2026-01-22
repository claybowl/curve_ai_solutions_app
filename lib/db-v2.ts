/**
 * Database utilities for V2 schema
 * DEPRECATED: This file previously used Supabase. Now uses Stack Auth for auth and Neon PostgreSQL for database.
 * 
 * This file is kept for backward compatibility but should be migrated to use:
 * - Stack Auth: @/lib/stack-auth-server for authentication
 * - Neon PostgreSQL: @/lib/db.ts for database operations
 */

import { getCurrentUserServer } from './supabase-server'

/**
 * Get a database client for database operations
 * DEPRECATED: Use Neon PostgreSQL directly from @/lib/db.ts
 */
export async function getSupabaseClient(): Promise<any> {
  throw new Error(
    'Supabase is not used. Please use Neon PostgreSQL (from "@/lib/db.ts") for database operations.'
  )
}

/**
 * Generic helper for Supabase queries with error handling
 */
export async function executeSupabaseQuery<T>(
  queryFn: (client: SupabaseClient) => Promise<{ data: T | null; error: any }>
): Promise<T | null> {
  try {
    const client = await getSupabaseClient()
    const { data, error } = await queryFn(client)
    
    if (error) {
      console.error('Supabase query error:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Database operation error:', error)
    return null
  }
}

/**
 * Helper for Supabase queries that should throw on error
 */
export async function executeSupabaseQueryStrict<T>(
  queryFn: (client: SupabaseClient) => Promise<{ data: T | null; error: any }>
): Promise<T> {
  const client = await getSupabaseClient()
  const { data, error } = await queryFn(client)
  
  if (error) {
    console.error('Supabase query error:', error)
    throw new Error(`Database error: ${error.message || 'Unknown error'}`)
  }
  
  if (data === null) {
    throw new Error('No data returned from query')
  }
  
  return data
}

/**
 * Test Supabase connection
 */
export async function testSupabaseConnection() {
  try {
    const client = await getSupabaseClient()
    const { data, error } = await client
      .from('profiles')
      .select('id')
      .limit(1)
    
    return { connected: !error, error }
  } catch (error) {
    console.error('Supabase connection test failed:', error)
    return { connected: false, error }
  }
}

/**
 * Get current user from Stack Auth
 * DEPRECATED: Use getCurrentUserServer from @/lib/stack-auth-server instead
 */
export async function getCurrentSupabaseUser() {
  try {
    const user = await getCurrentUserServer()
    
    if (!user) {
      return null
    }
    
    // Transform Stack Auth user to match expected format
    return {
      id: user.id,
      email: user.primaryEmail,
      // Add other properties as needed
    }
  } catch (error) {
    console.error('[getCurrentSupabaseUser] Exception:', error)
    return null
  }
}

/**
 * Get user profile with auth data
 */
export async function getUserProfile(userId?: string) {
  if (!userId) {
    const user = await getCurrentSupabaseUser()
    if (!user) return null
    userId = user.id
  }
  
  return await executeSupabaseQuery(async (client) => {
    return await client
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
  })
}

/**
 * Check if user has admin role
 */
export async function isUserAdmin(userId?: string): Promise<boolean> {
  const profile = await getUserProfile(userId)
  return profile?.role === 'admin'
}

/**
 * Check if user has specific role
 */
export async function hasUserRole(role: string, userId?: string): Promise<boolean> {
  const profile = await getUserProfile(userId)
  return profile?.role === role
}
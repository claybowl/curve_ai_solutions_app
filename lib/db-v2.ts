/**
 * Database utilities for V2 schema (Supabase)
 * This file provides standardized database operations for the new V2 schema
 */

import { createServerSupabaseClient } from './supabase-server'
import type { Database } from '@/types/supabase' // We'll create this next

// Helper type for Supabase client
type SupabaseClient = Awaited<ReturnType<typeof createServerSupabaseClient>>

/**
 * Get a Supabase client for database operations
 */
export async function getSupabaseClient(): Promise<SupabaseClient> {
  return await createServerSupabaseClient()
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
 * Get current user from Supabase auth
 */
export async function getCurrentSupabaseUser() {
  const client = await getSupabaseClient()
  const { data: { user }, error } = await client.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
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
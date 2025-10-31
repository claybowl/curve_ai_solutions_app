"use client"

import { createClient } from '@supabase/supabase-js'

// Get Supabase URL and anon key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Supabase client will not work properly.')
}

// Create a browser Supabase client
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: 'supabase.auth.token',
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : (() => {
      // Return a mock client in case of missing env vars (for build-time)
      return {
        auth: {
          getUser: async () => ({ data: { user: null }, error: { message: 'Supabase not configured' } }),
          getSession: async () => ({ data: { session: null }, error: { message: 'Supabase not configured' } }),
          signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
          signOut: async () => ({ error: { message: 'Supabase not configured' } }),
        },
        from: () => ({
          select: () => ({ data: null, error: { message: 'Supabase not configured' } }),
          insert: () => ({ data: null, error: { message: 'Supabase not configured' } }),
          update: () => ({ data: null, error: { message: 'Supabase not configured' } }),
          delete: () => ({ data: null, error: { message: 'Supabase not configured' } }),
        }),
        channel: () => ({
          on: () => ({ subscribe: () => {} }),
          subscribe: () => {},
        }),
      } as any
    })()

/**
 * Get the current authenticated user
 */
export async function getCurrentUser() {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return null
    }
    
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }
    
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Update user metadata
 */
export async function updateUserMetadata(updates: Record<string, any>) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase not configured')
    }
    
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    })
    
    if (error) {
      throw error
    }
    
    return data
  } catch (error) {
    console.error('Error updating user metadata:', error)
    throw error
  }
}


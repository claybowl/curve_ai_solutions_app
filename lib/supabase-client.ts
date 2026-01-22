"use client"

/**
 * Supabase Client Configuration
 * 
 * This file initializes Supabase for client-side operations.
 */

import { createBrowserClient } from '@supabase/ssr'

// Create a singleton Supabase client for client-side usage
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

// Legacy export for backward compatibility
export const supabase = {
  get auth() {
    return createClient().auth
  },
  from(table: string) {
    return createClient().from(table)
  },
  channel(name: string) {
    return createClient().channel(name)
  },
}

/**
 * Get current user from Supabase Auth
 */
export async function getCurrentUser() {
  const client = createClient()
  const { data: { user }, error } = await client.auth.getUser()
  if (error) {
    console.error('Error getting current user:', error)
    return null
  }
  return user
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string) {
  const client = createClient()
  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata: { displayName?: string; firstName?: string; lastName?: string } = {}
) {
  const client = createClient()
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: metadata.displayName,
        first_name: metadata.firstName,
        last_name: metadata.lastName,
      },
    },
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

/**
 * Sign out current user
 */
export async function signOut() {
  const client = createClient()
  const { error } = await client.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
}

/**
 * Sign in with OAuth provider
 */
export async function signInWithOAuth(provider: 'google' | 'github') {
  const client = createClient()
  const { data, error } = await client.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

/**
 * Update user metadata
 */
export async function updateUserMetadata(updates: Record<string, unknown>) {
  const client = createClient()
  const { data, error } = await client.auth.updateUser({
    data: updates,
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

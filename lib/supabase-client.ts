"use client"

import { createClient } from '@supabase/supabase-js'

// Mock client for build time or when environment variables are missing
const createMockClient = () => {
  const mockResponse = async () => ({ data: null, error: null })
  
  const createChainableMock = () => {
    const mock = {
      select: () => createChainableMock(),
      eq: () => createChainableMock(),
      order: () => createChainableMock(),
      limit: () => createChainableMock(),
      single: mockResponse,
      insert: () => createChainableMock(),
      update: () => createChainableMock(),
      delete: () => createChainableMock(),
      upsert: () => createChainableMock(),
      filter: () => createChainableMock(),
      match: () => createChainableMock(),
      range: () => createChainableMock(),
      then: (resolve: any) => resolve({ data: null, error: null })
    }
    return mock
  }

  return {
    auth: {
      signInWithPassword: mockResponse,
      signUp: mockResponse,
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithOtp: mockResponse,
      resetPasswordForEmail: mockResponse,
      updateUser: mockResponse,
      refreshSession: mockResponse,
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => createChainableMock()
  }
}

function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables, using mock client')
    return createMockClient()
  }

  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'implicit'
      }
    })
  } catch (error) {
    console.warn('Failed to create Supabase client, using mock client:', error)
    return createMockClient()
  }
}

// Create a client-side supabase client for use in browser
export const supabase = createSupabaseClient()

// Client-side authentication functions
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  return { data, error }
}

export async function signUpWithEmail(
  email: string, 
  password: string, 
  profileData: {
    firstName: string
    lastName: string
    companyName?: string
    role?: 'admin' | 'client'
  }
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        companyName: profileData.companyName,
        role: profileData.role || 'client'
      },
    },
  })
  
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser()
  return { user: data.user, error }
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  return { session: data.session, error }
}

export async function signInWithMagicLink(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  
  return { data, error }
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
  })
  
  return { data, error }
}

// Client-side function to get user profile
export async function getUserProfile(userId?: string) {
  const { user } = await getCurrentUser()
  const targetUserId = userId || user?.id
  
  if (!targetUserId) {
    return { profile: null, error: 'No user ID provided' }
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', targetUserId)
    .single()

  return { profile, error }
}

// Update user metadata
export async function updateUserMetadata(metadata: any) {
  const { data, error } = await supabase.auth.updateUser({
    data: metadata
  })
  
  return { data, error }
}

// Check if user is admin
export async function isUserAdmin() {
  const { user } = await getCurrentUser()
  if (!user) return false
  
  // Check metadata first (faster)
  const userRole = user.user_metadata?.role || user.app_metadata?.role
  if (userRole === 'admin') return true
  
  // If not found in metadata, check profiles table
  try {
    const { profile } = await getUserProfile(user.id)
    return profile?.role === 'admin'
  } catch (error) {
    console.error('Error checking profile role:', error)
    return false
  }
}
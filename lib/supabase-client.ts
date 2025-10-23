"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

// Lightweight mock to keep components from crashing during build/static analysis
const createMockClient = () => {
  const mockResponse = async () => ({ data: null, error: null })

  const createChainableMock = () => {
    const mock = {
      select: () => createChainableMock(),
      eq: () => createChainableMock(),
      order: () => createChainableMock(),
      limit: () => createChainableMock(),
      single: mockResponse,
      maybeSingle: mockResponse,
      insert: () => createChainableMock(),
      update: () => createChainableMock(),
      delete: () => createChainableMock(),
      upsert: () => createChainableMock(),
      filter: () => createChainableMock(),
      match: () => createChainableMock(),
      range: () => createChainableMock(),
      then: (resolve: any) => resolve({ data: null, error: null }),
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
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    from: () => createChainableMock(),
  } as unknown as SupabaseClient<Database>
}

let cachedClient: SupabaseClient<Database> | null = null

function ensureClient(): SupabaseClient<Database> {
  if (cachedClient) {
    return cachedClient
  }

  try {
    cachedClient = createClientComponentClient<Database>()
  } catch (error) {
    console.warn('Falling back to mock Supabase client:', error)
    cachedClient = createMockClient()
  }

  return cachedClient
}

export const supabase = ensureClient()

export async function signInWithEmail(email: string, password: string) {
  const client = ensureClient()
  const { data, error } = await client.auth.signInWithPassword({
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
  const client = ensureClient()
  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        companyName: profileData.companyName,
        role: profileData.role || 'client',
      },
    },
  })

  return { data, error }
}

export async function signOut() {
  const client = ensureClient()
  const { error } = await client.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const client = ensureClient()
  const { data, error } = await client.auth.getUser()
  return { user: data.user, error }
}

export async function getSession() {
  const client = ensureClient()
  const { data, error } = await client.auth.getSession()
  return { session: data.session, error }
}

export async function signInWithMagicLink(email: string) {
  const client = ensureClient()
  const { data, error } = await client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  return { data, error }
}

export async function resetPassword(email: string) {
  const client = ensureClient()
  const { data, error } = await client.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
  })

  return { data, error }
}

export async function getUserProfile(userId?: string) {
  const { user } = await getCurrentUser()
  const targetUserId = userId || user?.id

  if (!targetUserId) {
    return { profile: null, error: 'No user ID provided' }
  }

  const client = ensureClient()
  const { data: profile, error } = await client
    .from('profiles')
    .select('*')
    .eq('user_id', targetUserId)
    .single()

  return { profile, error }
}

export async function updateUserMetadata(metadata: any) {
  const client = ensureClient()
  const { data, error } = await client.auth.updateUser({
    data: metadata,
  })

  return { data, error }
}

export async function isUserAdmin() {
  const { user } = await getCurrentUser()
  if (!user) return false

  const userRole = user.user_metadata?.role || user.app_metadata?.role
  if (userRole === 'admin') return true

  try {
    const { profile } = await getUserProfile(user.id)
    return profile?.role === 'admin'
  } catch (error) {
    console.error('Error checking profile role:', error)
    return false
  }
}

export type UserMetadata = {
  role?: 'admin' | 'client'
  firstName?: string
  lastName?: string
}

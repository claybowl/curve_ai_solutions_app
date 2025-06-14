"use client"

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a client-side supabase client for use in browser
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

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
  
  const userRole = user.user_metadata?.role || user.app_metadata?.role
  return userRole === 'admin'
}
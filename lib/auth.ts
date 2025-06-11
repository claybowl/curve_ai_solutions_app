/**
 * Clean Supabase Authentication System
 * All authentication is handled through Supabase Auth
 */

import { createServerSupabaseClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export type UserRole = 'admin' | 'client'

export interface UserProfile {
  id: string
  user_id: string
  email: string
  first_name: string
  last_name: string
  company_name?: string
  role: UserRole
  created_at: string
  updated_at: string
}

/**
 * Get the current authenticated user from Supabase
 */
export async function getCurrentUser(): Promise<{ user: User | null; error: any }> {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

/**
 * Get the current user's profile data
 */
export async function getCurrentUserProfile(): Promise<{ profile: UserProfile | null; error: any }> {
  const { user, error: userError } = await getCurrentUser()
  if (userError || !user) {
    return { profile: null, error: userError }
  }

  const supabase = await createServerSupabaseClient()
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return { profile, error }
}

/**
 * Check if the current user has admin role
 */
export async function isUserAdmin(): Promise<boolean> {
  const { profile } = await getCurrentUserProfile()
  return profile?.role === 'admin'
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { user } = await getCurrentUser()
  return !!user
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth(): Promise<User> {
  const { user } = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

/**
 * Require admin role - redirect if not admin
 */
export async function requireAdmin(): Promise<UserProfile> {
  const { profile } = await getCurrentUserProfile()
  if (!profile || profile.role !== 'admin') {
    redirect('/login')
  }
  return profile
}

/**
 * Create user profile after signup
 */
export async function createUserProfile(userData: {
  userId: string
  email: string
  firstName: string
  lastName: string
  companyName?: string
  role?: UserRole
}): Promise<{ profile: UserProfile | null; error: any }> {
  const supabase = await createServerSupabaseClient()
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      user_id: userData.userId,
      email: userData.email,
      first_name: userData.firstName,
      last_name: userData.lastName,
      company_name: userData.companyName,
      role: userData.role || 'client'
    })
    .select()
    .single()

  return { profile, error }
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string, 
  updates: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at'>>
): Promise<{ profile: UserProfile | null; error: any }> {
  const supabase = await createServerSupabaseClient()
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single()

  return { profile, error }
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string): Promise<{ profile: UserProfile | null; error: any }> {
  const supabase = await createServerSupabaseClient()
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  return { profile, error }
}
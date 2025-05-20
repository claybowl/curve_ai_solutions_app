/**
 * Auth compatibility layer for NextAuth to Supabase migration
 * 
 * This file provides backward compatibility for components that
 * still import from the old NextAuth-based authentication system
 */

import { getCurrentUser, isUserAdmin } from '@/lib/supabase'

// Re-export types and functions from existing auth system
export type { User, UserRole } from '@/lib/supabase'

// Compatibility function for checking if user is authenticated
export async function isAuthenticated() {
  const { user, error } = await getCurrentUser()
  return !!user && !error
}

// Compatibility function for checking admin role
export async function isAdmin() {
  return await isUserAdmin()
}

// Temporary compatibility functions to prevent import errors
export const getUserById = async () => null
export const getUserByEmail = async () => null
export const createUser = async () => null
export const updateUser = async () => null
export const deleteUser = async () => null
export const getUserRoles = async () => ['admin', 'client']
export const checkEmailExists = async () => false
export const resetUserPassword = async () => false

// Auth options compatibility
export const authOptions = {
  providers: [],
  callbacks: {
    async session() {
      return { user: null, expires: '' }
    },
    async jwt() {
      return { token: {} }
    }
  }
}

// NextAuth session getter compatibility 
export async function getSession() {
  const { user } = await getCurrentUser()
  if (!user) return null
  
  return {
    user: {
      id: user.id,
      email: user.email,
      name: `${user.user_metadata?.firstName || ''} ${user.user_metadata?.lastName || ''}`.trim(),
      role: user.user_metadata?.role || 'client'
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  }
}
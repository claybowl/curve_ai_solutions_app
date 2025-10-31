"use client"

/**
 * DEPRECATED: This project uses Stack Auth for authentication and Neon PostgreSQL for database.
 * This file exists only for backward compatibility with legacy imports.
 * 
 * Please migrate to:
 * - Stack Auth: import from '@/lib/stack-auth-client' or '@/stack/client'
 * - Database: import from '@/lib/db.ts' (Neon PostgreSQL)
 */

// Create a minimal mock that won't break during build
const mockClient = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Use Stack Auth instead' } }),
    signOut: async () => ({ error: null }),
  },
  from: () => ({
    select: () => ({ data: null, error: { message: 'Use Neon PostgreSQL instead' } }),
    insert: () => ({ data: null, error: { message: 'Use Neon PostgreSQL instead' } }),
    update: () => ({ data: null, error: { message: 'Use Neon PostgreSQL instead' } }),
    delete: () => ({ data: null, error: { message: 'Use Neon PostgreSQL instead' } }),
  }),
  channel: () => ({
    on: () => ({ subscribe: () => {} }),
    subscribe: () => {},
  }),
}

export const supabase = mockClient as any

export async function getCurrentUser() {
  const { getCurrentUserClient } = await import('@/lib/stack-auth-client')
  return getCurrentUserClient()
}

export async function updateUserMetadata(updates: Record<string, any>) {
  throw new Error('Supabase is not used. Please use Stack Auth user management APIs instead.')
}

export async function signInWithEmail(email: string, password: string) {
  const { signInWithEmail: stackSignIn } = await import('@/lib/stack-auth-client')
  return stackSignIn(email, password)
}

export async function signUpWithEmail(
  email: string,
  password: string,
  metadata: Record<string, any> = {}
) {
  const { signUpWithEmail: stackSignUp } = await import('@/lib/stack-auth-client')
  return stackSignUp(email, password, metadata.displayName)
}

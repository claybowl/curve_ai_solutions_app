/**
 * DEPRECATED: This project uses Stack Auth for authentication and Neon PostgreSQL for database.
 * This file exists only for backward compatibility with legacy imports.
 * 
 * Please migrate to:
 * - Stack Auth Server: import from '@/lib/stack-auth-server'
 * - Database: import from '@/lib/db.ts' (Neon PostgreSQL)
 */

/**
 * Create a Supabase client for server-side operations
 * DEPRECATED: Use Stack Auth or Neon PostgreSQL instead
 */
export async function createServerSupabaseClient() {
  throw new Error(
    'Supabase is not used in this project. ' +
    'Please use Stack Auth server APIs (from "@/lib/stack-auth-server") ' +
    'or Neon PostgreSQL (from "@/lib/db.ts") for database operations.'
  )
}

/**
 * Backward-compatible alias expected by server actions
 * DEPRECATED: Use Stack Auth or Neon PostgreSQL instead
 */
export async function createClient() {
  throw new Error(
    'Supabase is not used. Please use Stack Auth server APIs or Neon PostgreSQL instead.'
  )
}

/**
 * Verify that the current authenticated user has admin role.
 * DEPRECATED: Use Stack Auth admin checks instead
 */
export async function verifyAdminRole(): Promise<boolean> {
  try {
    const { verifyAdminRole: stackVerifyAdmin } = await import('@/lib/stack-auth-server')
    return await stackVerifyAdmin()
  } catch {
    // Fallback to false if Stack Auth not available
    return false
  }
}

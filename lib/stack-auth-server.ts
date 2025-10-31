/**
 * Stack Auth Server-Side Utilities
 * 
 * Server-side authentication and authorization helpers using Stack Auth.
 */

import { stackServerApp } from "@/stack/server"

/**
 * Get current authenticated user (server-side)
 */
export async function getCurrentUserServer() {
  try {
    const user = await stackServerApp.getUser()
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUserServer()
  return !!user
}

/**
 * Require authentication - throw error if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUserServer()
  if (!user) {
    throw new Error('Unauthorized - authentication required')
  }
  return user
}

/**
 * Check if user has admin permission
 * Stack Auth uses a permission system - configure 'admin' permission in Stack Auth dashboard
 */
export async function isUserAdmin(): Promise<boolean> {
  try {
    const user = await getCurrentUserServer()
    if (!user) return false
    
    // Stack Auth permissions are checked via user.permissions
    // Configure 'admin' permission in Stack Auth dashboard and assign to admin users
    // Note: Stack Auth user object structure may vary - adjust as needed
    const permissions = (user as any).permissions || []
    return Array.isArray(permissions) && permissions.includes('admin')
  } catch (error) {
    console.error("Error checking admin permission:", error)
    return false
  }
}

/**
 * Require admin permission - throw error if not admin
 */
export async function requireAdmin() {
  const user = await requireAuth()
  const isAdmin = await isUserAdmin()
  if (!isAdmin) {
    throw new Error('Unauthorized - admin access required')
  }
  return user
}

/**
 * Verify admin role (alias for isUserAdmin for backward compatibility)
 */
export async function verifyAdminRole(): Promise<boolean> {
  return await isUserAdmin()
}


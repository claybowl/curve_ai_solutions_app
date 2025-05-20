/**
 * Utility functions for authentication - compatibility layer for Supabase Auth
 */
import { loadSession, isUserAdmin, clearSession } from "./session-storage"
import { signOut } from "@/lib/supabase"
import type { UserMetadata } from "@/lib/supabase"

// CLIENT-SIDE AUTHENTICATION UTILITIES

/**
 * Hook to check if the current user is an admin
 * @returns boolean indicating if user is admin
 */
export function useIsAdmin(): boolean {
  if (typeof window === "undefined") return false
  const session = loadSession()
  return session?.user?.user_metadata?.role === "admin"
}

/**
 * Hook to get the current user's ID
 * @returns string | null - User ID if available
 */
export function useUserId(): string | null {
  if (typeof window === "undefined") return null
  const session = loadSession()
  return session?.user?.id || null
}

/**
 * Hook to get the current user's role
 * @returns string | null - User role if available
 */
export function useUserRole(): string | null {
  if (typeof window === "undefined") return null
  const session = loadSession()
  return session?.user?.user_metadata?.role || null
}

/**
 * Function to check if user is admin (for use in useEffect or non-hook contexts)
 */
export function isAdminUser(): boolean {
  if (typeof window === "undefined") return false
  return isUserAdmin()
}

/**
 * Function to get user ID (for use in useEffect or non-hook contexts)
 */
export function getCurrentUserIdClient(): string | null {
  if (typeof window === "undefined") return null
  const session = loadSession()
  return session?.user?.id || null
}

/**
 * Function to get user role (for use in useEffect or non-hook contexts)
 */
export function getCurrentUserRole(): string | null {
  if (typeof window === "undefined") return null
  const session = loadSession()
  return session?.user?.user_metadata?.role || null
}

/**
 * Perform a logout operation
 */
export async function logoutUser(router?: any): Promise<void> {
  try {
    // Clean up local storage for backward compatibility
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin-token")
      sessionStorage.removeItem("user-data")
      clearSession()
    }
    
    // Use Supabase signOut
    await signOut()
  } catch (error) {
    console.error("Error during logout:", error)
  } finally {
    // Redirect if router is provided
    if (router) {
      router.push("/")
    } else if (typeof window !== "undefined") {
      window.location.href = "/"
    }
  }
}

// SERVER-SIDE AUTHENTICATION UTILITIES - STUBS FOR COMPATIBILITY

/**
 * Authorization utility to check if user has required permissions
 * This is a stub for compatibility - server-side auth now requires Supabase middleware
 */
export async function authorizeUser(permissionName?: string) {
  console.warn("authorizeUser is a stub - use Supabase Auth directly instead")
  return { authorized: false, error: "Not implemented", userId: null }
}

/**
 * Helper function to check if user is authorized to manage a specific content
 * This is a stub for compatibility - server-side auth now requires Supabase middleware
 */
export async function canManageContent(
  contentAuthorId: number, 
  permissionName: string,
  adminPermissionName?: string
) {
  console.warn("canManageContent is a stub - use Supabase Auth directly instead")
  return { authorized: false, error: "Not implemented", userId: null }
}

/**
 * Helper to safely extract a user ID - stub for compatibility
 */
export async function getCurrentUserId(): Promise<number | null> {
  console.warn("getCurrentUserId is a stub - use Supabase Auth directly instead")
  return null
}

/**
 * Check if the current user is an admin - stub for compatibility
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  console.warn("isCurrentUserAdmin is a stub - use Supabase Auth directly instead")
  return false
}

/**
 * Check if the current user has a specific permission - stub for compatibility
 */
export async function currentUserHasPermission(permissionName: string): Promise<boolean> {
  console.warn("currentUserHasPermission is a stub - use Supabase Auth directly instead")
  return false
}
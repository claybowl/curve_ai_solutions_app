/**
 * Utility functions for authentication using NextAuth session
 */
import { signOut, useSession } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth"
import { checkUserPermission } from "./db-permissions"

// CLIENT-SIDE AUTHENTICATION UTILITIES

/**
 * Hook to check if the current user is an admin
 * @returns boolean indicating if user is admin
 */
export function useIsAdmin(): boolean {
  const { data: session } = useSession()
  return session?.user?.role === "admin"
}

/**
 * Hook to get the current user's ID
 * @returns string | null - User ID if available
 */
export function useUserId(): string | null {
  const { data: session } = useSession()
  return session?.user?.id || null
}

/**
 * Hook to get the current user's role
 * @returns string | null - User role if available
 */
export function useUserRole(): string | null {
  const { data: session } = useSession()
  return session?.user?.role || null
}

/**
 * Function to check if user is admin (for use in useEffect or non-hook contexts)
 * @deprecated Use useIsAdmin() hook instead for client components
 */
export function isAdminUser(): boolean {
  // For compatibility with existing code - should migrate to useIsAdmin hook
  if (typeof window === "undefined") return false

  try {
    // Check localStorage for backward compatibility
    const token = localStorage.getItem("admin-token")
    if (token) {
      const [_, role] = token.split(":")
      return role === "admin"
    }
    return false
  } catch (error) {
    console.error("Error checking admin status:", error)
    return false
  }
}

/**
 * Function to get user ID (for use in useEffect or non-hook contexts)
 * @deprecated Use useUserId() hook instead for client components
 */
export function getCurrentUserIdClient(): string | null {
  // For compatibility with existing code - should migrate to useUserId hook
  if (typeof window === "undefined") return null

  try {
    const token = localStorage.getItem("admin-token")
    if (!token) return null

    const [userId, _] = token.split(":")
    return userId
  } catch (error) {
    console.error("Error getting user ID:", error)
    return null
  }
}

/**
 * Function to get user role (for use in useEffect or non-hook contexts)
 * @deprecated Use useUserRole() hook instead for client components
 */
export function getCurrentUserRole(): string | null {
  // For compatibility with existing code - should migrate to useUserRole hook
  if (typeof window === "undefined") return null

  try {
    const token = localStorage.getItem("admin-token")
    if (!token) return null

    const [_, role] = token.split(":")
    return role
  } catch (error) {
    console.error("Error getting user role:", error)
    return null
  }
}

/**
 * Perform a logout operation using NextAuth
 */
export async function logoutUser(router?: any): Promise<void> {
  try {
    // Clean up local storage for backward compatibility
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin-token")
      sessionStorage.removeItem("user-data")
    }
    
    // Use NextAuth signOut
    await signOut({ redirect: false })
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

// SERVER-SIDE AUTHENTICATION UTILITIES

/**
 * Authorization utility to check if user has required permissions
 * Can be used in server actions and API routes
 * 
 * @param permissionName - Optional permission to check for 
 * @returns Authorization result with userId
 */
export async function authorizeUser(permissionName?: string) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return { authorized: false, error: "Authentication required", userId: null }
  }
  
  // Admin role has all permissions (legacy support)
  if (session.user.role === "admin") {
    return { 
      authorized: true, 
      userId: parseInt(session.user.id), 
      isAdmin: true 
    }
  }
  
  // If specific permission is required, check it
  if (permissionName) {
    const userId = parseInt(session.user.id)
    const hasPermission = await checkUserPermission(userId, permissionName)
    
    if (!hasPermission) {
      return { 
        authorized: false, 
        error: `You don't have permission to ${permissionName.replace(/_/g, ' ')}`, 
        userId 
      }
    }
    
    return { authorized: true, userId, isAdmin: false }
  }
  
  // No specific permission required, just need to be authenticated
  return { 
    authorized: true, 
    userId: parseInt(session.user.id), 
    isAdmin: false 
  }
}

/**
 * Helper function to check if user is authorized to manage a specific content
 * where content has an authorId field
 * 
 * @param contentAuthorId - The ID of the author of the content being accessed
 * @param permissionName - Permission required to manage this type of content
 * @param adminPermissionName - Optional different permission for admins (defaults to permissionName)
 */
export async function canManageContent(
  contentAuthorId: number, 
  permissionName: string,
  adminPermissionName?: string
) {
  const { authorized, userId, isAdmin, error } = await authorizeUser()
  
  if (!authorized) {
    return { authorized, error, userId }
  }
  
  // If user is the author, check if they have the permission to manage their own content
  if (contentAuthorId === userId) {
    const hasPermission = await checkUserPermission(userId!, permissionName)
    
    if (hasPermission) {
      return { authorized: true, userId, isAdmin }
    }
  }
  
  // If user is not the author, they need admin permission to manage others' content
  const adminPermission = adminPermissionName || permissionName
  const hasAdminPermission = await checkUserPermission(userId!, adminPermission)
  
  if (!hasAdminPermission && !isAdmin) {
    return { 
      authorized: false, 
      error: "You don't have permission to manage this content", 
      userId 
    }
  }
  
  return { authorized: true, userId, isAdmin }
}

/**
 * Helper to safely extract a user ID from the session on server side
 * Returns null if no session exists
 */
export async function getCurrentUserId(): Promise<number | null> {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return null
  }
  
  return parseInt(session.user.id)
}

/**
 * Check if the current user is an admin (server-side)
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return false
  }
  
  return session.user.role === "admin"
}

/**
 * Check if the current user has a specific permission (server-side)
 */
export async function currentUserHasPermission(permissionName: string): Promise<boolean> {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return false
  }
  
  // Admin role has all permissions
  if (session.user.role === "admin") {
    return true
  }
  
  const userId = parseInt(session.user.id)
  return await checkUserPermission(userId, permissionName)
}
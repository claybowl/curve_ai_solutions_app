/**
 * Stack Auth Admin Operations
 * 
 * Administrative operations for user management using Stack Auth Admin API.
 */

import { stackServerApp } from "@/stack/server"

/**
 * Get all users (admin operation)
 */
export async function getAllUsers(options?: {
  limit?: number
  offset?: number
  search?: string
}) {
  try {
    // Stack Auth provides user listing through the server app
    const users = await stackServerApp.listUsers({
      limit: options?.limit || 100,
      offset: options?.offset || 0,
    })
    return users
  } catch (error) {
    console.error("Error fetching users:", error)
    throw error
  }
}

/**
 * Get user by ID (admin operation)
 */
export async function getUserById(userId: string) {
  try {
    const user = await stackServerApp.getUserById(userId)
    return user
  } catch (error) {
    console.error("Error fetching user:", error)
    throw error
  }
}

/**
 * Update user (admin operation)
 */
export async function updateUser(userId: string, updates: {
  displayName?: string
  email?: string
  customData?: Record<string, any>
  emailVerified?: boolean
}) {
  try {
    const user = await stackServerApp.updateUser(userId, updates)
    return user
  } catch (error) {
    console.error("Error updating user:", error)
    throw error
  }
}

/**
 * Delete user (admin operation)
 */
export async function deleteUser(userId: string) {
  try {
    await stackServerApp.deleteUser(userId)
  } catch (error) {
    console.error("Error deleting user:", error)
    throw error
  }
}

/**
 * Create user (admin operation)
 */
export async function createUser(data: {
  email: string
  password: string
  displayName?: string
  emailVerified?: boolean
  customData?: Record<string, any>
}) {
  try {
    const user = await stackServerApp.createUser({
      email: data.email,
      password: data.password,
      displayName: data.displayName,
      emailVerified: data.emailVerified || false,
      customData: data.customData,
    })
    return user
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

/**
 * Assign permission to user (admin operation)
 * Stack Auth uses a permission system - configure permissions in Stack Auth dashboard
 */
export async function assignPermissionToUser(userId: string, permission: string) {
  try {
    const user = await stackServerApp.getUserById(userId)
    const currentPermissions = user.permissions || []
    
    if (!currentPermissions.includes(permission)) {
      await stackServerApp.updateUser(userId, {
        permissions: [...currentPermissions, permission],
      })
    }
  } catch (error) {
    console.error("Error assigning permission:", error)
    throw error
  }
}

/**
 * Remove permission from user (admin operation)
 */
export async function removePermissionFromUser(userId: string, permission: string) {
  try {
    const user = await stackServerApp.getUserById(userId)
    const currentPermissions = user.permissions || []
    
    await stackServerApp.updateUser(userId, {
      permissions: currentPermissions.filter(p => p !== permission),
    })
  } catch (error) {
    console.error("Error removing permission:", error)
    throw error
  }
}

// Legacy function names for compatibility
export const assignRoleToUser = assignPermissionToUser
export const removeRoleFromUser = removePermissionFromUser


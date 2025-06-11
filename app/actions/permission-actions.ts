"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { 
  getAllPermissions,
  getPermissionsByCategory,
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getUserPermissions,
  assignRolesToUser,
  setUserPermission,
  removeUserPermission,
  checkUserPermission
} from "@/lib/db-permissions"
import type {
  Permission,
  PermissionCategory,
  Role,
  RoleFormData,
  UserWithRoles
} from "@/types/permissions"

// Schema validation for role data
const roleSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string(),
  isDefault: z.boolean().optional().default(false),
  permissionIds: z.array(z.number()).default([])
})

// Helper function to get current user
async function getCurrentUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new Error("Not authenticated")
  }
  
  return user
}

// Get all permissions
export async function getAllPermissionsAction(): Promise<Permission[]> {
  try {
    // Check authorization
    const user = await getCurrentUser()
    
    // Check permission
    const hasPermission = await checkUserPermission(
      user.id,
      "view:permissions"
    )
    
    if (!hasPermission) {
      throw new Error("Not authorized to view permissions")
    }
    
    return await getAllPermissions()
  } catch (error) {
    console.error("Error fetching permissions:", error)
    return []
  }
}

// Get permissions by category
export async function getPermissionsByCategoryAction(): Promise<PermissionCategory[]> {
  try {
    // Check authorization
    const user = await getCurrentUser()
    
    // Check permission
    const hasPermission = await checkUserPermission(
      user.id,
      "view:permissions"
    )
    
    if (!hasPermission) {
      throw new Error("Not authorized to view permissions")
    }
    
    return await getPermissionsByCategory()
  } catch (error) {
    console.error("Error fetching permissions by category:", error)
    return []
  }
}

// Get all roles with their permissions
export async function getAllRolesAction(): Promise<Role[]> {
  try {
    // Check authorization
    const user = await getCurrentUser()
    
    // Check permission
    const hasPermission = await checkUserPermission(
      user.id,
      "view:roles"
    )
    
    if (!hasPermission) {
      throw new Error("Not authorized to view roles")
    }
    
    return await getAllRoles()
  } catch (error) {
    console.error("Error fetching roles:", error)
    return []
  }
}

// Get a role by ID
export async function getRoleByIdAction(roleId: number): Promise<Role | null> {
  try {
    // Check authorization
    const user = await getCurrentUser()
    
    // Check permission
    const hasPermission = await checkUserPermission(
      user.id,
      "view:roles"
    )
    
    if (!hasPermission) {
      throw new Error("Not authorized to view roles")
    }
    
    return await getRoleById(roleId)
  } catch (error) {
    console.error(`Error fetching role ${roleId}:`, error)
    return null
  }
}

// Create a new role
export async function createRoleAction(
  formData: FormData
): Promise<{ success: boolean; error?: string; roleId?: number }> {
  try {
    // Check authorization
    const user = await getCurrentUser()
    
    // Check permission
    const hasPermission = await checkUserPermission(
      user.id,
      "create:roles"
    )
    
    if (!hasPermission) {
      return { success: false, error: "Not authorized to create roles" }
    }
    
    // Extract form data
    const roleData: RoleFormData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      isDefault: formData.get("isDefault") === "true",
      permissionIds: []
    }
    
    // Extract permission IDs from form data
    const permissionIds = formData.getAll("permissionIds")
    if (permissionIds.length > 0) {
      roleData.permissionIds = permissionIds.map(id => 
        typeof id === "string" ? parseInt(id, 10) : id as number
      )
    }
    
    // Validate data
    const validatedData = roleSchema.safeParse(roleData)
    if (!validatedData.success) {
      return { 
        success: false, 
        error: "Invalid role data: " + validatedData.error.message 
      }
    }
    
    // Create role
    const roleId = await createRole(validatedData.data)
    
    // Revalidate paths
    revalidatePath("/admin/permissions")
    revalidatePath("/admin/users")
    
    return { success: true, roleId }
  } catch (error) {
    console.error("Error creating role:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error creating role" 
    }
  }
}

// Update an existing role
export async function updateRoleAction(
  roleId: number,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check authorization
    const user = await getCurrentUser()
    
    // Check permission
    const hasPermission = await checkUserPermission(
      user.id,
      "update:roles"
    )
    
    if (!hasPermission) {
      return { success: false, error: "Not authorized to update roles" }
    }
    
    // Extract form data
    const roleData: RoleFormData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      isDefault: formData.get("isDefault") === "true",
      permissionIds: []
    }
    
    // Extract permission IDs from form data
    const permissionIds = formData.getAll("permissionIds")
    if (permissionIds.length > 0) {
      roleData.permissionIds = permissionIds.map(id => 
        typeof id === "string" ? parseInt(id, 10) : id as number
      )
    }
    
    // Validate data
    const validatedData = roleSchema.safeParse(roleData)
    if (!validatedData.success) {
      return { 
        success: false, 
        error: "Invalid role data: " + validatedData.error.message 
      }
    }
    
    // Update role
    const success = await updateRole(roleId, validatedData.data)
    
    if (!success) {
      return { success: false, error: "Failed to update role" }
    }
    
    // Revalidate paths
    revalidatePath("/admin/permissions")
    revalidatePath("/admin/users")
    
    return { success: true }
  } catch (error) {
    console.error(`Error updating role ${roleId}:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error updating role" 
    }
  }
}

// Delete a role
export async function deleteRoleAction(
  roleId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check authorization
    const user = await getCurrentUser()
    
    // Check permission
    const hasPermission = await checkUserPermission(
      user.id,
      "delete:roles"
    )
    
    if (!hasPermission) {
      return { success: false, error: "Not authorized to delete roles" }
    }
    
    // Delete role
    const success = await deleteRole(roleId)
    
    if (!success) {
      return { 
        success: false, 
        error: "Failed to delete role. System roles cannot be deleted." 
      }
    }
    
    // Revalidate paths
    revalidatePath("/admin/permissions")
    revalidatePath("/admin/users")
    
    return { success: true }
  } catch (error) {
    console.error(`Error deleting role ${roleId}:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error deleting role" 
    }
  }
}

// Get user permissions and roles
export async function getUserPermissionsAction(
  userId: number
): Promise<{ roles: Role[]; permissions: Permission[] } | null> {
  try {
    // Check authorization
    const user = await getCurrentUser()
    
    // Check permission (can view own permissions or has admin permission)
    const isOwnUser = user.id === userId
    const canManageUsers = await checkUserPermission(
      user.id,
      "manage:users"
    )
    
    if (!isOwnUser && !canManageUsers) {
      throw new Error("Not authorized to view this user's permissions")
    }
    
    return await getUserPermissions(userId)
  } catch (error) {
    console.error(`Error fetching permissions for user ${userId}:`, error)
    return null
  }
}

// Get currently authenticated user's permissions and roles
export async function getCurrentUserPermissionsAction(): Promise<{ 
  roles: Role[]; 
  permissions: Permission[] 
} | null> {
  try {
    // Check authorization
    const user = await getCurrentUser()
    
    return await getUserPermissions(user.id)
  } catch (error) {
    console.error(`Error fetching current user permissions:`, error)
    return null
  }
}

// Assign roles to a user
export async function assignRolesToUserAction(
  userId: number,
  roleIds: number[]
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check authorization
    const user = await getCurrentUser()
    
    // Check permission
    const hasPermission = await checkUserPermission(
      user.id,
      "manage:users"
    )
    
    if (!hasPermission) {
      return { success: false, error: "Not authorized to manage user roles" }
    }
    
    // Assign roles
    const success = await assignRolesToUser(userId, roleIds)
    
    if (!success) {
      return { success: false, error: "Failed to assign roles to user" }
    }
    
    // Revalidate paths
    revalidatePath("/admin/users")
    revalidatePath("/admin/permissions")
    revalidatePath(`/admin/users/${userId}`)
    revalidatePath(`/users/${userId}`)
    
    return { success: true }
  } catch (error) {
    console.error(`Error assigning roles to user ${userId}:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error assigning roles" 
    }
  }
}

// Set user permission override
export async function setUserPermissionAction(
  userId: number,
  permissionId: number,
  granted: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check authorization
    const user = await getCurrentUser()
    
    // Check permission
    const hasPermission = await checkUserPermission(
      user.id,
      "manage:users"
    )
    
    if (!hasPermission) {
      return { success: false, error: "Not authorized to manage user permissions" }
    }
    
    // Set permission
    const success = await setUserPermission(userId, permissionId, granted)
    
    if (!success) {
      return { success: false, error: "Failed to set user permission" }
    }
    
    // Revalidate paths
    revalidatePath("/admin/users")
    revalidatePath("/admin/permissions")
    revalidatePath(`/admin/users/${userId}`)
    revalidatePath(`/users/${userId}`)
    
    return { success: true }
  } catch (error) {
    console.error(`Error setting permission for user ${userId}:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error setting permission" 
    }
  }
}

// Remove user permission override
export async function removeUserPermissionAction(
  userId: number,
  permissionId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check authorization
    const user = await getCurrentUser()
    
    // Check permission
    const hasPermission = await checkUserPermission(
      user.id,
      "manage:users"
    )
    
    if (!hasPermission) {
      return { success: false, error: "Not authorized to manage user permissions" }
    }
    
    // Remove permission
    const success = await removeUserPermission(userId, permissionId)
    
    if (!success) {
      return { success: false, error: "Failed to remove user permission" }
    }
    
    // Revalidate paths
    revalidatePath("/admin/users")
    revalidatePath("/admin/permissions")
    revalidatePath(`/admin/users/${userId}`)
    revalidatePath(`/users/${userId}`)
    
    return { success: true }
  } catch (error) {
    console.error(`Error removing permission for user ${userId}:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error removing permission" 
    }
  }
}

// Check if current user has a specific permission
export async function checkCurrentUserPermissionAction(
  permissionName: string
): Promise<boolean> {
  try {
    // Check authorization
    const user = await getCurrentUser()
    
    return await checkUserPermission(user.id, permissionName)
  } catch (error) {
    console.error(`Error checking permission ${permissionName}:`, error)
    return false
  }
}
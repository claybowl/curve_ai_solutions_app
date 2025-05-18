"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { checkUserPermission } from "@/lib/db-permissions"
import { 
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
  getUserRoles,
  checkEmailExists,
  UserFilter,
  UserFormData
} from "@/lib/db-users"

// Schema validation for user data
const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  companyName: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  password: z.string().optional()
})

// Get all users with optional filtering
export async function getAllUsersAction(filter?: UserFilter) {
  try {
    // Check authorization
    const session = await auth()
    if (!session?.user) {
      throw new Error("Not authenticated")
    }
    
    // Check permission
    const hasPermission = await checkUserPermission(
      session.user.id,
      "view:users"
    )
    
    if (!hasPermission) {
      throw new Error("Not authorized to view users")
    }
    
    return await getAllUsers(filter)
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

// Get user by ID
export async function getUserByIdAction(userId: number) {
  try {
    // Check authorization
    const session = await auth()
    if (!session?.user) {
      throw new Error("Not authenticated")
    }
    
    // Check permission (can view own profile or has admin permission)
    const isOwnUser = session.user.id === userId
    const canManageUsers = await checkUserPermission(
      session.user.id,
      "manage:users"
    )
    
    if (!isOwnUser && !canManageUsers) {
      throw new Error("Not authorized to view this user's profile")
    }
    
    return await getUserById(userId)
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error)
    return null
  }
}

// Create a new user
export async function createUserAction(
  formData: FormData
): Promise<{ success: boolean; error?: string; userId?: number }> {
  try {
    // Check authorization
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: "Not authenticated" }
    }
    
    // Check permission
    const hasPermission = await checkUserPermission(
      session.user.id,
      "create:users"
    )
    
    if (!hasPermission) {
      return { success: false, error: "Not authorized to create users" }
    }
    
    // Extract form data
    const userData: UserFormData = {
      email: formData.get("email") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      companyName: formData.get("companyName") as string || undefined,
      role: formData.get("role") as string,
      password: formData.get("password") as string || undefined
    }
    
    // Validate data
    const validatedData = userSchema.safeParse(userData)
    if (!validatedData.success) {
      return { 
        success: false, 
        error: "Invalid user data: " + validatedData.error.message 
      }
    }
    
    // Create user
    const userId = await createUser(userData)
    
    // Revalidate paths
    revalidatePath("/admin/users")
    revalidatePath("/admin/users/management")
    
    return { success: true, userId }
  } catch (error) {
    console.error("Error creating user:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error creating user" 
    }
  }
}

// Update an existing user
export async function updateUserAction(
  userId: number,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check authorization
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: "Not authenticated" }
    }
    
    // Check permission (can update own profile or has admin permission)
    const isOwnUser = session.user.id === userId
    const canManageUsers = await checkUserPermission(
      session.user.id,
      "manage:users"
    )
    
    if (!isOwnUser && !canManageUsers) {
      return { success: false, error: "Not authorized to update this user" }
    }
    
    // If not admin, can only update specific fields of own profile
    if (isOwnUser && !canManageUsers) {
      // Create a modified form data with only allowed fields
      const safeFormData = new FormData()
      safeFormData.append("email", formData.get("email") as string)
      safeFormData.append("firstName", formData.get("firstName") as string)
      safeFormData.append("lastName", formData.get("lastName") as string)
      safeFormData.append("companyName", formData.get("companyName") as string || "")
      
      // Use the original role
      const user = await getUserById(userId)
      safeFormData.append("role", user?.role || "client")
      
      // Replace formData with safeFormData
      formData = safeFormData
    }
    
    // Extract form data
    const userData: UserFormData = {
      email: formData.get("email") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      companyName: formData.get("companyName") as string || undefined,
      role: formData.get("role") as string,
      password: formData.get("password") as string || undefined
    }
    
    // Validate data
    const validatedData = userSchema.safeParse(userData)
    if (!validatedData.success) {
      return { 
        success: false, 
        error: "Invalid user data: " + validatedData.error.message 
      }
    }
    
    // Update user
    const success = await updateUser(userId, userData)
    
    if (!success) {
      return { success: false, error: "Failed to update user" }
    }
    
    // Revalidate paths
    revalidatePath("/admin/users")
    revalidatePath("/admin/users/management")
    revalidatePath(`/admin/users/${userId}`)
    revalidatePath(`/profile`)
    
    return { success: true }
  } catch (error) {
    console.error(`Error updating user ${userId}:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error updating user" 
    }
  }
}

// Delete a user
export async function deleteUserAction(
  userId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check authorization
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: "Not authenticated" }
    }
    
    // Check permission
    const hasPermission = await checkUserPermission(
      session.user.id,
      "delete:users"
    )
    
    if (!hasPermission) {
      return { success: false, error: "Not authorized to delete users" }
    }
    
    // Cannot delete self
    if (session.user.id === userId) {
      return { success: false, error: "Cannot delete your own account" }
    }
    
    // Delete user
    const success = await deleteUser(userId)
    
    if (!success) {
      return { success: false, error: "Failed to delete user" }
    }
    
    // Revalidate paths
    revalidatePath("/admin/users")
    revalidatePath("/admin/users/management")
    
    return { success: true }
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error deleting user" 
    }
  }
}

// Reset user password
export async function resetUserPasswordAction(
  userId: number,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check authorization
    const session = await auth()
    if (!session?.user) {
      return { success: false, error: "Not authenticated" }
    }
    
    // Check permission (can reset own password or has admin permission)
    const isOwnUser = session.user.id === userId
    const canManageUsers = await checkUserPermission(
      session.user.id,
      "manage:users"
    )
    
    if (!isOwnUser && !canManageUsers) {
      return { success: false, error: "Not authorized to reset this user's password" }
    }
    
    // Validate password
    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: "Password must be at least 8 characters" }
    }
    
    // Reset password
    const success = await resetUserPassword(userId, newPassword)
    
    if (!success) {
      return { success: false, error: "Failed to reset password" }
    }
    
    return { success: true }
  } catch (error) {
    console.error(`Error resetting password for user ${userId}:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error resetting password" 
    }
  }
}

// Get available user roles for dropdown
export async function getUserRolesAction(): Promise<string[]> {
  try {
    // Check authorization
    const session = await auth()
    if (!session?.user) {
      return []
    }
    
    // Check permission
    const hasPermission = await checkUserPermission(
      session.user.id,
      "view:users"
    )
    
    if (!hasPermission) {
      return []
    }
    
    return await getUserRoles()
  } catch (error) {
    console.error("Error fetching user roles:", error)
    return ["admin", "client"] // Default roles
  }
}

// Check if email exists (for registration)
export async function checkEmailExistsAction(email: string): Promise<boolean> {
  try {
    return await checkEmailExists(email)
  } catch (error) {
    console.error(`Error checking if email ${email} exists:`, error)
    return false
  }
}
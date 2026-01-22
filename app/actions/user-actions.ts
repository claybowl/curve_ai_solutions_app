"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getCurrentUserServer, requireAdmin, isUserAdmin } from "@/lib/supabase-server"

// TODO: Implement these user management functions for Supabase
// These are stub functions - the real implementation needs Supabase Admin API or direct DB queries
async function getAllUsers(_options?: { limit?: number; offset?: number; search?: string }): Promise<any[]> {
  console.warn('getAllUsers not yet implemented for Supabase')
  return []
}

async function getUserById(_userId: string): Promise<any | null> {
  console.warn('getUserById not yet implemented for Supabase')
  return null
}

async function createUser(_userData: Record<string, unknown>): Promise<any> {
  throw new Error('createUser not yet implemented for Supabase')
}

async function updateUser(_userId: string, _userData: Record<string, unknown>): Promise<any> {
  throw new Error('updateUser not yet implemented for Supabase')
}

async function deleteUser(_userId: string): Promise<void> {
  throw new Error('deleteUser not yet implemented for Supabase')
}

async function assignPermissionToUser(_userId: string, _permission: string): Promise<void> {
  throw new Error('assignPermissionToUser not yet implemented for Supabase')
}

async function removePermissionFromUser(_userId: string, _permission: string): Promise<void> {
  throw new Error('removePermissionFromUser not yet implemented for Supabase')
}

import type { 
  UserProfile, 
  UserSummary, 
  UserProfileFormData, 
  UserRegistrationFormData,
  UserFilter 
} from "@/types/users"

// Schema validation for user profile data
const userProfileSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  first_name: z.string().min(2, "First name must be at least 2 characters").optional(),
  last_name: z.string().min(2, "Last name must be at least 2 characters").optional(),
  company_name: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['admin', 'client', 'consultant']).optional(),
  industry: z.string().optional(),
  company_size: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']).optional(),
  job_title: z.string().optional(),
  timezone: z.string().optional(),
  subscription_status: z.enum(['free', 'basic', 'premium', 'enterprise']).optional()
})

// Schema validation for user registration
const userRegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  company_name: z.string().optional(),
  phone: z.string().optional(),
  industry: z.string().optional(),
  company_size: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+']).optional(),
  job_title: z.string().optional()
})

// Get all users with optional filtering (Admin only)
export async function getAllUsersAction(filter?: UserFilter) {
  try {
    // Require admin access
    await requireAdmin()

    // Get users from Stack Auth
    const users = await getAllUsers({
      limit: filter?.limit || 100,
      offset: filter?.offset || 0,
      search: filter?.search_term,
    })
    
    // Transform Stack Auth users to match UserSummary type
    // Note: Stack Auth user structure may differ - adjust as needed
    return users.map((user: any) => ({
      id: user.id,
      user_id: user.id,
      email: user.email,
      first_name: user.customData?.firstName || user.displayName?.split(' ')[0] || '',
      last_name: user.customData?.lastName || user.displayName?.split(' ')[1] || '',
      company_name: user.customData?.companyName,
      phone: user.customData?.phone,
      role: user.permissions?.includes('admin') ? 'admin' : 'client',
      industry: user.customData?.industry,
      company_size: user.customData?.companySize,
      job_title: user.customData?.jobTitle,
      timezone: user.customData?.timezone,
      subscription_status: user.customData?.subscriptionStatus || 'free',
      onboarding_completed: user.customData?.onboardingCompleted || false,
      created_at: user.createdAtMillis ? new Date(user.createdAtMillis).toISOString() : new Date().toISOString(),
      updated_at: user.updatedAtMillis ? new Date(user.updatedAtMillis).toISOString() : new Date().toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

// Get user profile by ID or current user
export async function getUserProfileAction(userId?: string) {
  try {
    const currentUser = await getCurrentUserServer()
    
    if (!currentUser) {
      throw new Error("Authentication required")
    }

    // If no userId provided, get current user's profile
    const targetUserId = userId || currentUser.id

    // Check if user can access this profile
    const isOwnProfile = targetUserId === currentUser.id
    const userIsAdmin = await isUserAdmin()
    
    if (!isOwnProfile && !userIsAdmin) {
      throw new Error("Not authorized to view this user's profile")
    }

    // Get user from Stack Auth
    const user = await getUserById(targetUserId)
    
    if (!user) return null
    
    // Transform Stack Auth user to match UserProfile type
    return {
      id: user.id,
      user_id: user.id,
      email: user.email,
      first_name: user.customData?.firstName || user.displayName?.split(' ')[0] || '',
      last_name: user.customData?.lastName || user.displayName?.split(' ')[1] || '',
      company_name: user.customData?.companyName,
      phone: user.customData?.phone,
      role: user.permissions?.includes('admin') ? 'admin' : 'client',
      industry: user.customData?.industry,
      company_size: user.customData?.companySize,
      job_title: user.customData?.jobTitle,
      timezone: user.customData?.timezone,
      subscription_status: user.customData?.subscriptionStatus || 'free',
      onboarding_completed: user.customData?.onboardingCompleted || false,
      created_at: user.createdAtMillis ? new Date(user.createdAtMillis).toISOString() : new Date().toISOString(),
      updated_at: user.updatedAtMillis ? new Date(user.updatedAtMillis).toISOString() : new Date().toISOString(),
    }
  } catch (error) {
    console.error(`Error fetching user profile:`, error)
    return null
  }
}

// Get current user's profile
export async function getCurrentUserProfileAction() {
  try {
    const user = await getCurrentUserServer()
    
    if (!user) {
      return null
    }

    // Stack Auth provides user data directly, transform to match expected format
    if (!user) return null
    
    return {
      id: user.id,
      user_id: user.id,
      email: user.email,
      first_name: user.customData?.firstName || user.displayName?.split(' ')[0] || '',
      last_name: user.customData?.lastName || user.displayName?.split(' ')[1] || '',
      company_name: user.customData?.companyName,
      phone: user.customData?.phone,
      role: user.permissions?.includes('admin') ? 'admin' : 'client',
      industry: user.customData?.industry,
      company_size: user.customData?.companySize,
      job_title: user.customData?.jobTitle,
      timezone: user.customData?.timezone,
      subscription_status: user.customData?.subscriptionStatus || 'free',
      onboarding_completed: user.customData?.onboardingCompleted || false,
      created_at: user.createdAtMillis ? new Date(user.createdAtMillis).toISOString() : new Date().toISOString(),
      updated_at: user.updatedAtMillis ? new Date(user.updatedAtMillis).toISOString() : new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error fetching current user profile:", error)
    return null
  }
}

// Register a new user (public registration)
// NOTE: Public registration should typically be handled client-side via Stack Auth signup component
// This server action is kept for admin-created users or if custom registration flow is needed
export async function registerUserAction(
  formData: FormData
): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    // Extract form data
    const userData: UserRegistrationFormData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      first_name: formData.get("firstName") as string,
      last_name: formData.get("lastName") as string,
      company_name: formData.get("companyName") as string || undefined,
      phone: formData.get("phone") as string || undefined,
      industry: formData.get("industry") as string || undefined,
      company_size: formData.get("companySize") as any || undefined,
      job_title: formData.get("jobTitle") as string || undefined
    }
    
    // Validate data
    const validatedData = userRegistrationSchema.safeParse(userData)
    if (!validatedData.success) {
      return { 
        success: false, 
        error: "Invalid user data: " + validatedData.error.errors.map(e => e.message).join(", ")
      }
    }

    // Create user with Stack Auth
    const newUser = await createUser({
      email: userData.email,
      password: userData.password,
      displayName: `${userData.first_name} ${userData.last_name}`,
      emailVerified: false, // Email verification handled by Stack Auth
      customData: {
        firstName: userData.first_name,
        lastName: userData.last_name,
        companyName: userData.company_name,
        phone: userData.phone,
        industry: userData.industry,
        companySize: userData.company_size,
        jobTitle: userData.job_title,
      }
    })
    
    revalidatePath("/admin/users")
    return { success: true, userId: newUser.id }
  } catch (error) {
    console.error("Error registering user:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error creating user" 
    }
  }
}

// Create a new user (Admin only)
export async function createUserAction(
  formData: FormData
): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    // Require admin access
    await requireAdmin()
    
    // Extract form data
    const userData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      first_name: formData.get("firstName") as string,
      last_name: formData.get("lastName") as string,
      company_name: formData.get("companyName") as string || undefined,
      phone: formData.get("phone") as string || undefined,
      role: formData.get("role") as 'admin' | 'client' | 'consultant' || 'client',
      industry: formData.get("industry") as string || undefined,
      company_size: formData.get("companySize") as any || undefined,
      job_title: formData.get("jobTitle") as string || undefined
    }
    
    // Basic validation
    if (!userData.email || !userData.password || !userData.first_name || !userData.last_name) {
      return { 
        success: false, 
        error: "Email, password, first name, and last name are required"
      }
    }

    // Create user with Stack Auth
    const newUser = await createUser({
      email: userData.email,
      password: userData.password,
      displayName: `${userData.first_name} ${userData.last_name}`,
      emailVerified: true, // Auto-verify for admin-created users
      customData: {
        firstName: userData.first_name,
        lastName: userData.last_name,
        companyName: userData.company_name,
        phone: userData.phone,
        industry: userData.industry,
        companySize: userData.company_size,
        jobTitle: userData.job_title,
      }
    })
    
    // Assign admin permission if needed
    if (userData.role === 'admin') {
      await assignPermissionToUser(newUser.id, 'admin')
    }
    
    revalidatePath("/admin/users")
    revalidatePath("/admin/users/management")
    
    return { success: true, userId: newUser.id }
  } catch (error) {
    console.error("Error creating user:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error creating user" 
    }
  }
}

// Update user profile
export async function updateUserProfileAction(
  userId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getCurrentUserServer()
    
    if (!currentUser) {
      return { success: false, error: "Authentication required" }
    }
    
    // Check permission (can update own profile or has admin permission)
    const isOwnProfile = currentUser.id === userId
    const userIsAdmin = await isUserAdmin()
    
    if (!isOwnProfile && !userIsAdmin) {
      return { success: false, error: "Not authorized to update this user" }
    }
    
    // Extract form data
    const profileData: Partial<UserProfileFormData> = {}
    
    // Fields that users can update for themselves
    if (formData.get("first_name")) profileData.first_name = formData.get("first_name") as string
    if (formData.get("last_name")) profileData.last_name = formData.get("last_name") as string
    if (formData.get("company_name")) profileData.company_name = formData.get("company_name") as string
    if (formData.get("phone")) profileData.phone = formData.get("phone") as string
    if (formData.get("industry")) profileData.industry = formData.get("industry") as string
    if (formData.get("company_size")) profileData.company_size = formData.get("company_size") as any
    if (formData.get("job_title")) profileData.job_title = formData.get("job_title") as string
    if (formData.get("timezone")) profileData.timezone = formData.get("timezone") as string
    
    // Admin-only fields
    if (userIsAdmin) {
      if (formData.get("email")) profileData.email = formData.get("email") as string
      if (formData.get("role")) profileData.role = formData.get("role") as any
      if (formData.get("subscription_status")) profileData.subscription_status = formData.get("subscription_status") as any
    }
    
    // Validate data
    const validatedData = userProfileSchema.safeParse(profileData)
    if (!validatedData.success) {
      return { 
        success: false, 
        error: "Invalid profile data: " + validatedData.error.errors.map(e => e.message).join(", ")
      }
    }

    // Update user with Stack Auth
    const customData: Record<string, any> = {}
    if (profileData.first_name) customData.firstName = profileData.first_name
    if (profileData.last_name) customData.lastName = profileData.last_name
    if (profileData.company_name) customData.companyName = profileData.company_name
    if (profileData.phone) customData.phone = profileData.phone
    if (profileData.industry) customData.industry = profileData.industry
    if (profileData.company_size) customData.companySize = profileData.company_size
    if (profileData.job_title) customData.jobTitle = profileData.job_title
    if (profileData.timezone) customData.timezone = profileData.timezone
    
    await updateUser(userId, {
      displayName: profileData.first_name && profileData.last_name 
        ? `${profileData.first_name} ${profileData.last_name}` 
        : undefined,
      email: profileData.email,
      customData: Object.keys(customData).length > 0 ? customData : undefined,
    })
    
    // Update admin permission if role changed
    if (profileData.role) {
      const currentUser = await getUserById(userId)
      const isCurrentlyAdmin = currentUser?.permissions?.includes('admin') || false
      const shouldBeAdmin = profileData.role === 'admin'
      
      if (shouldBeAdmin && !isCurrentlyAdmin) {
        await assignPermissionToUser(userId, 'admin')
      } else if (!shouldBeAdmin && isCurrentlyAdmin) {
        await removePermissionFromUser(userId, 'admin')
      }
    }
    
    revalidatePath("/admin/users")
    revalidatePath("/admin/users/management")
    revalidatePath("/profile")
    
    return { success: true }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error updating profile" 
    }
  }
}

// Delete a user (Admin only)
export async function deleteUserAction(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    
    const currentUser = await getCurrentUserServer()
    
    // Cannot delete self
    if (currentUser && currentUser.id === userId) {
      return { success: false, error: "Cannot delete your own account" }
    }
    
    // Delete user with Stack Auth
    await deleteUser(userId)
    
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

// Update user role (Admin only)
export async function updateUserRoleAction(
  userId: string,
  newRole: 'admin' | 'client' | 'consultant'
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin()
    
    // Update role using Stack Auth permission system
    if (newRole === 'admin') {
      await assignPermissionToUser(userId, 'admin')
    } else {
      // Remove admin permission for non-admin roles
      await removePermissionFromUser(userId, 'admin')
    }
    
    revalidatePath("/admin/users")
    revalidatePath("/admin/users/management")
    
    return { success: true }
  } catch (error) {
    console.error(`Error updating role for user ${userId}:`, error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error updating role" 
    }
  }
}

// Complete user onboarding
export async function completeOnboardingAction(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUserServer()
    
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const onboardingData = {
      company_name: formData.get("company_name") as string,
      industry: formData.get("industry") as string,
      company_size: formData.get("company_size") as any,
      job_title: formData.get("job_title") as string,
      timezone: formData.get("timezone") as string || 'America/Chicago',
      onboarding_completed: true
    }

    // Update user with onboarding data
    await updateUser(user.id, {
      customData: {
        companyName: onboardingData.company_name,
        industry: onboardingData.industry,
        companySize: onboardingData.company_size,
        jobTitle: onboardingData.job_title,
        timezone: onboardingData.timezone,
        onboardingCompleted: true,
      }
    })

    revalidatePath("/profile")
    revalidatePath("/dashboard")
    
    return { success: true }
  } catch (error) {
    console.error("Error completing onboarding:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error completing onboarding" 
    }
  }
}

// Get available user roles
export async function getUserRolesAction(): Promise<{ label: string; value: string }[]> {
  return [
    { label: 'Administrator', value: 'admin' },
    { label: 'Client', value: 'client' },
    { label: 'Consultant', value: 'consultant' }
  ]
}

// Check if email exists (for registration validation)
export async function checkEmailExistsAction(email: string): Promise<boolean> {
  try {
    // Check if email exists using Stack Auth
    // Note: Stack Auth may not have a direct getByEmail method
    // We can try to get users and filter, or use a different approach
    try {
      const users = await getAllUsers({ search: email, limit: 1 })
      return users.some((u: any) => u.email === email)
    } catch (error) {
      console.error("Error checking email:", error)
      return false
    }
  } catch (error) {
    console.error(`Error checking if email ${email} exists:`, error)
    return false
  }
}

// Update user's last login timestamp
export async function updateLastLoginAction() {
  try {
    const user = await getCurrentUserServer()
    
    if (!user) {
      return
    }

    // Update last login timestamp in custom data
    // Stack Auth may track this automatically, but we store it in customData for our records
    const currentUser = await getUserById(user.id)
    const currentCustomData = currentUser?.customData || {}
    
    await updateUser(user.id, {
      customData: {
        ...currentCustomData,
        lastLoginAt: new Date().toISOString(),
      }
    })
  } catch (error) {
    console.error("Error updating last login:", error)
    // Non-critical error, don't throw
  }
}

// Backward compatibility exports
export const updateUserAction = updateUserProfileAction
export async function resetUserPasswordAction(userId: string) {
  return { success: true, message: "Password reset functionality not implemented yet" }
}
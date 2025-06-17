"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getCurrentSupabaseUser, isUserAdmin } from "@/lib/db-v2"
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
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      throw new Error("Authentication required")
    }

    // Check if user is admin
    const userIsAdmin = await isUserAdmin(user.id)
    if (!userIsAdmin) {
      throw new Error("Admin access required")
    }

    let query = supabase
      .from('profiles')
      .select('*')

    // Apply filters
    if (filter?.role) {
      query = query.eq('role', filter.role)
    }
    if (filter?.subscription_status) {
      query = query.eq('subscription_status', filter.subscription_status)
    }
    if (filter?.industry) {
      query = query.eq('industry', filter.industry)
    }
    if (filter?.company_size) {
      query = query.eq('company_size', filter.company_size)
    }
    if (filter?.onboarding_completed !== undefined) {
      query = query.eq('onboarding_completed', filter.onboarding_completed)
    }
    if (filter?.search_term) {
      query = query.or(`first_name.ilike.%${filter.search_term}%,last_name.ilike.%${filter.search_term}%,email.ilike.%${filter.search_term}%,company_name.ilike.%${filter.search_term}%`)
    }
    if (filter?.date_from) {
      query = query.gte('created_at', filter.date_from)
    }
    if (filter?.date_to) {
      query = query.lte('created_at', filter.date_to)
    }

    // Apply sorting
    const sortBy = filter?.sortBy || 'created_at'
    const sortDirection = filter?.sortDirection || 'desc'
    query = query.order(sortBy, { ascending: sortDirection === 'asc' })

    // Apply pagination
    if (filter?.limit) {
      query = query.limit(filter.limit)
    }
    if (filter?.offset) {
      query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1)
    }

    const { data: profiles, error } = await query

    if (error) {
      console.error("Error fetching users:", error)
      return []
    }

    return profiles || []
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

// Get user profile by ID or current user
export async function getUserProfileAction(userId?: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      throw new Error("Authentication required")
    }

    // If no userId provided, get current user's profile
    const targetUserId = userId || user.id

    // Check if user can access this profile
    const isOwnProfile = targetUserId === user.id
    const userIsAdmin = await isUserAdmin(user.id)
    
    if (!isOwnProfile && !userIsAdmin) {
      throw new Error("Not authorized to view this user's profile")
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', targetUserId)
      .single()

    if (error) {
      console.error(`Error fetching user profile ${targetUserId}:`, error)
      return null
    }

    return profile
  } catch (error) {
    console.error(`Error fetching user profile:`, error)
    return null
  }
}

// Get current user's profile
export async function getCurrentUserProfileAction() {
  try {
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      return null
    }

    return await getUserProfileAction(user.id)
  } catch (error) {
    console.error("Error fetching current user profile:", error)
    return null
  }
}

// Register a new user (public registration)
export async function registerUserAction(
  formData: FormData
): Promise<{ success: boolean; error?: string; userId?: string }> {
  try {
    const supabase = await createServerSupabaseClient()
    
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

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.first_name,
          last_name: userData.last_name
        }
      }
    })

    if (authError || !authData.user) {
      console.error("Error creating auth user:", authError)
      return { 
        success: false, 
        error: authError?.message || "Failed to create user account"
      }
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        company_name: userData.company_name,
        phone: userData.phone,
        industry: userData.industry,
        company_size: userData.company_size,
        job_title: userData.job_title,
        role: 'client' // Default role for public registration
      })

    if (profileError) {
      console.error("Error creating user profile:", profileError)
      // Try to clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return { 
        success: false, 
        error: "Failed to create user profile"
      }
    }
    
    revalidatePath("/admin/users")
    return { success: true, userId: authData.user.id }
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
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Check if user is admin
    const userIsAdmin = await isUserAdmin(user.id)
    if (!userIsAdmin) {
      return { success: false, error: "Admin access required" }
    }
    
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

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      email_confirm: true // Auto-confirm for admin-created users
    })

    if (authError || !authData.user) {
      console.error("Error creating auth user:", authError)
      return { 
        success: false, 
        error: authError?.message || "Failed to create user account"
      }
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: authData.user.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        company_name: userData.company_name,
        phone: userData.phone,
        role: userData.role,
        industry: userData.industry,
        company_size: userData.company_size,
        job_title: userData.job_title
      })

    if (profileError) {
      console.error("Error creating user profile:", profileError)
      // Try to clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      return { 
        success: false, 
        error: "Failed to create user profile"
      }
    }
    
    revalidatePath("/admin/users")
    revalidatePath("/admin/users/management")
    
    return { success: true, userId: authData.user.id }
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
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      return { success: false, error: "Authentication required" }
    }
    
    // Check permission (can update own profile or has admin permission)
    const isOwnProfile = user.id === userId
    const userIsAdmin = await isUserAdmin(user.id)
    
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

    // Update profile
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('user_id', userId)

    if (error) {
      console.error("Error updating user profile:", error)
      return { 
        success: false, 
        error: "Failed to update profile"
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
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Check if user is admin
    const userIsAdmin = await isUserAdmin(user.id)
    if (!userIsAdmin) {
      return { success: false, error: "Admin access required" }
    }
    
    // Cannot delete self
    if (user.id === userId) {
      return { success: false, error: "Cannot delete your own account" }
    }
    
    // Delete user from auth (this will cascade to profile due to foreign key)
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)
    
    if (authError) {
      console.error("Error deleting user from auth:", authError)
      return { 
        success: false, 
        error: "Failed to delete user"
      }
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

// Update user role (Admin only)
export async function updateUserRoleAction(
  userId: string,
  newRole: 'admin' | 'client' | 'consultant'
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Check if user is admin
    const userIsAdmin = await isUserAdmin(user.id)
    if (!userIsAdmin) {
      return { success: false, error: "Admin access required" }
    }
    
    // Update role in profile
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('user_id', userId)
    
    if (error) {
      console.error("Error updating user role:", error)
      return { 
        success: false, 
        error: "Failed to update user role"
      }
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
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentSupabaseUser()
    
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

    const { error } = await supabase
      .from('profiles')
      .update(onboardingData)
      .eq('user_id', user.id)

    if (error) {
      console.error("Error completing onboarding:", error)
      return { 
        success: false, 
        error: "Failed to complete onboarding"
      }
    }

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
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('email', email)
      .limit(1)

    if (error) {
      console.error(`Error checking if email ${email} exists:`, error)
      return false
    }

    return data && data.length > 0
  } catch (error) {
    console.error(`Error checking if email ${email} exists:`, error)
    return false
  }
}

// Update user's last login timestamp
export async function updateLastLoginAction() {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      return
    }

    await supabase
      .from('profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('user_id', user.id)
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
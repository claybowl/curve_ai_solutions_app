"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getCurrentSupabaseUser } from "@/lib/db-v2"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import type { 
  PromptFilter, 
  PromptFormData, 
  Prompt,
  PromptCategory,
  UserPromptCollection
} from "@/types/prompts"

// Validation schema for prompt form data
const promptSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  prompt_text: z.string().min(10, "Prompt text must be at least 10 characters"),
  category_id: z.string().uuid().optional(),
  tags: z.array(z.string()).optional(),
  is_public: z.boolean(),
  is_featured: z.boolean().optional(),
  use_case: z.string().optional(),
  industry: z.array(z.string()).optional(),
  ai_model: z.string().optional(),
  complexity_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  example_output: z.string().optional(),
})

/**
 * Check if the user is authorized to manage prompts
 */
async function checkPromptAuthorization(permissionName = "manage_prompts") {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new Error("Authentication required")
  }
  
  // Get user role from metadata
  const userRole = user.user_metadata?.role || user.app_metadata?.role
  
  // Check if user is admin (for backward compatibility)
  if (userRole === "admin") {
    return { authorized: true, userId: user.id }
  }
  
  // Check permissions
  const hasPermission = await checkUserPermission(user.id, permissionName)
  
  if (!hasPermission) {
    throw new Error(`You don't have permission to ${permissionName.replace('_', ' ')}`)
  }

  return { authorized: true, userId: user.id }
}

/**
 * Get all prompts with optional filtering
 */
export async function getPromptsAction(filter?: PromptFilter) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // If filter includes isPublic=false, check permissions
    if (filter?.isPublic === false) {
      await checkPromptAuthorization()
    }
    
    // Get user role from metadata
    const userRole = user?.user_metadata?.role || user?.app_metadata?.role
    
    // If not filtering by authorId and not admin, only get public prompts
    if (!filter?.authorId && (!user || userRole !== "admin")) {
      filter = { ...filter, isPublic: true }
    }
    
    // Get the prompts
    return await getPrompts(filter)
  } catch (error) {
    console.error("Error in getPromptsAction:", error)
    throw new Error(`Failed to fetch prompts: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Get a prompt by ID
 */
export async function getPromptByIdAction(id: number) {
  try {
    const prompt = await getPromptById(id)
    
    // If prompt is not public, check permissions
    if (prompt && !prompt.isPublic) {
      const supabase = await createServerSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      // Only allow access if:
      // 1. User is the author, OR
      // 2. User has manage_prompts permission
      if (!user) {
        throw new Error("Authentication required to access non-public prompts")
      }
      
      const userRole = user.user_metadata?.role || user.app_metadata?.role
      
      if (prompt.authorId !== user.id && userRole !== "admin") {
        const hasPermission = await checkUserPermission(user.id, "manage_prompts")
        
        if (!hasPermission) {
          throw new Error("You don't have permission to access this prompt")
        }
      }
    }
    
    return prompt
  } catch (error) {
    console.error("Error in getPromptByIdAction:", error)
    throw new Error(`Failed to fetch prompt: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Create a new prompt
 */
export async function createPromptAction(formData: FormData) {
  try {
    // Check authorization
    const { authorized, userId } = await checkPromptAuthorization()
    
    // Parse form data
    const promptData: PromptFormData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string || undefined,
      content: formData.get("content") as string,
      category: formData.get("category") as string,
      tags: formData.getAll("tags").map(tag => tag as string),
      isPublic: formData.get("isPublic") === "true",
      isFeatured: formData.get("isFeatured") === "true",
    }
    
    // Validate data
    const validationResult = promptSchema.safeParse(promptData)
    
    if (!validationResult.success) {
      const formatted = validationResult.error.format()
      throw new Error(`Validation error: ${JSON.stringify(formatted)}`)
    }
    
    // If setting as featured, check if user has permission
    if (promptData.isFeatured) {
      const hasPublishPermission = await checkUserPermission(userId, "publish_prompts")
      
      if (!hasPublishPermission) {
        throw new Error("You don't have permission to feature prompts")
      }
    }
    
    // Create the prompt
    const promptId = await createPrompt(promptData, userId)
    
    // Revalidate the prompts pages
    revalidatePath("/prompts")
    
    return { success: true, promptId }
  } catch (error) {
    console.error("Error in createPromptAction:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Update an existing prompt
 */
export async function updatePromptAction(id: number, formData: FormData) {
  try {
    // Check authorization
    const { authorized, userId } = await checkPromptAuthorization()
    
    // Parse form data
    const promptData: PromptFormData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string || undefined,
      content: formData.get("content") as string,
      category: formData.get("category") as string,
      tags: formData.getAll("tags").map(tag => tag as string),
      isPublic: formData.get("isPublic") === "true",
      isFeatured: formData.get("isFeatured") === "true",
    }
    
    // Validate data
    const validationResult = promptSchema.safeParse(promptData)
    
    if (!validationResult.success) {
      const formatted = validationResult.error.format()
      throw new Error(`Validation error: ${JSON.stringify(formatted)}`)
    }
    
    // If setting as featured, check if user has permission
    if (promptData.isFeatured) {
      const hasPublishPermission = await checkUserPermission(userId, "publish_prompts")
      
      if (!hasPublishPermission) {
        throw new Error("You don't have permission to feature prompts")
      }
    }
    
    // Update the prompt
    const success = await updatePrompt(id, promptData, userId)
    
    if (!success) {
      throw new Error("Failed to update prompt. Prompt not found or you don't have permission to update it.")
    }
    
    // Revalidate the prompts pages
    revalidatePath("/prompts")
    
    return { success: true }
  } catch (error) {
    console.error("Error in updatePromptAction:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Delete a prompt
 */
export async function deletePromptAction(id: number) {
  try {
    // Check authorization
    const { authorized, userId } = await checkPromptAuthorization()
    
    // Delete the prompt
    const success = await deletePrompt(id, userId)
    
    if (!success) {
      throw new Error("Failed to delete prompt. Prompt not found or you don't have permission to delete it.")
    }
    
    // Revalidate the prompts pages
    revalidatePath("/prompts")
    
    return { success: true }
  } catch (error) {
    console.error("Error in deletePromptAction:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Update prompt category
 */
export async function updatePromptCategoryAction(categoryId: string, name: string) {
  // Implementation for updating prompt category
  return { success: true, message: "Category update functionality not implemented yet" }
}

/**
 * Get prompt categories
 */
export async function getPromptCategoriesAction() {
  try {
    return await getPromptCategories()
  } catch (error) {
    console.error("Error in getPromptCategoriesAction:", error)
    throw new Error(`Failed to fetch prompt categories: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Save a prompt for the current user
 */
export async function savePromptForUserAction(promptId: number) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      throw new Error("Authentication required")
    }
    
    const success = await savePromptForUser(promptId, user.id)
    
    // Revalidate the user's saved prompts page
    revalidatePath("/prompts/saved")
    
    return { success }
  } catch (error) {
    console.error("Error in savePromptForUserAction:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Remove a saved prompt for the current user
 */
export async function removeSavedPromptAction(promptId: number) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      throw new Error("Authentication required")
    }
    
    const success = await removeSavedPrompt(promptId, user.id)
    
    // Revalidate the user's saved prompts page
    revalidatePath("/prompts/saved")
    
    return { success }
  } catch (error) {
    console.error("Error in removeSavedPromptAction:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Get saved prompts for the current user
 */
export async function getUserSavedPromptsAction() {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      throw new Error("Authentication required")
    }
    
    return await getUserSavedPrompts(user.id)
  } catch (error) {
    console.error("Error in getUserSavedPromptsAction:", error)
    throw new Error(`Failed to fetch saved prompts: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Toggle the public status of a prompt
 */
export async function togglePromptPublicStatusAction(id: number, currentStatus: boolean) {
  try {
    // Check authorization
    const { authorized, userId } = await checkPromptAuthorization()
    
    // If making public, check if user has publish permission
    if (!currentStatus) {
      const hasPublishPermission = await checkUserPermission(userId, "publish_prompts")
      
      if (!hasPublishPermission) {
        throw new Error("You don't have permission to publish prompts")
      }
    }
    
    // Get the current prompt
    const prompt = await getPromptById(id)
    
    if (!prompt) {
      throw new Error("Prompt not found")
    }
    
    // Check if user is the author or has manage_prompts permission
    if (prompt.authorId !== userId) {
      const isAdmin = await checkUserPermission(userId, "manage_prompts")
      
      if (!isAdmin) {
        throw new Error("You don't have permission to modify this prompt")
      }
    }
    
    // Update just the public status
    const promptData: PromptFormData = {
      title: prompt.title,
      description: prompt.description,
      content: prompt.content,
      category: prompt.category,
      tags: prompt.tags,
      isPublic: !currentStatus, // Toggle status
      isFeatured: prompt.isFeatured,
    }
    
    const success = await updatePrompt(id, promptData, userId)
    
    if (!success) {
      throw new Error("Failed to update prompt status")
    }
    
    // Revalidate paths
    revalidatePath("/prompts")
    
    return { success: true, newStatus: !currentStatus }
  } catch (error) {
    console.error("Error in togglePromptPublicStatusAction:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}
"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import {
  getPrompts,
  getPromptById,
  createPrompt,
  updatePrompt,
  deletePrompt,
  getPromptCategories,
  savePromptForUser,
  removeSavedPrompt,
  getUserSavedPrompts
} from "@/lib/db-prompts"
import { checkUserPermission } from "@/lib/db-permissions"
import type { PromptFilter, PromptFormData } from "@/types/prompts"

// Validation schema for prompt form data
const promptSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.string().min(2, "Category must be at least 2 characters"),
  tags: z.array(z.string()).optional(),
  isPublic: z.boolean(),
  isFeatured: z.boolean().optional(),
})

/**
 * Check if the user is authorized to manage prompts
 */
async function checkPromptAuthorization(permissionName = "manage_prompts") {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw new Error("Authentication required")
  }
  
  // Check if user is admin (for backward compatibility)
  if (session.user.role === "admin") {
    return { authorized: true, userId: parseInt(session.user.id) }
  }
  
  // Check permissions
  const userId = parseInt(session.user.id)
  const hasPermission = await checkUserPermission(userId, permissionName)
  
  if (!hasPermission) {
    throw new Error(`You don't have permission to ${permissionName.replace('_', ' ')}`)
  }

  return { authorized: true, userId }
}

/**
 * Get all prompts with optional filtering
 */
export async function getPromptsAction(filter?: PromptFilter) {
  try {
    const session = await getServerSession(authOptions)
    
    // If filter includes isPublic=false, check permissions
    if (filter?.isPublic === false) {
      await checkPromptAuthorization()
    }
    
    // If not filtering by authorId and not admin, only get public prompts
    if (!filter?.authorId && (!session || session.user.role !== "admin")) {
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
      const session = await getServerSession(authOptions)
      
      // Only allow access if:
      // 1. User is the author, OR
      // 2. User has manage_prompts permission
      if (!session) {
        throw new Error("Authentication required to access non-public prompts")
      }
      
      const userId = parseInt(session.user.id)
      
      if (prompt.authorId !== userId && session.user.role !== "admin") {
        const hasPermission = await checkUserPermission(userId, "manage_prompts")
        
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
    const session = await getServerSession(authOptions)
    
    if (!session) {
      throw new Error("Authentication required")
    }
    
    const userId = parseInt(session.user.id)
    const success = await savePromptForUser(promptId, userId)
    
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
    const session = await getServerSession(authOptions)
    
    if (!session) {
      throw new Error("Authentication required")
    }
    
    const userId = parseInt(session.user.id)
    const success = await removeSavedPrompt(promptId, userId)
    
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
    const session = await getServerSession(authOptions)
    
    if (!session) {
      throw new Error("Authentication required")
    }
    
    const userId = parseInt(session.user.id)
    return await getUserSavedPrompts(userId)
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
"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import {
  getAllTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool,
  getToolCategories,
  getRecommendedTools
} from "@/lib/db-tools"
import { checkUserPermission } from "@/lib/db-permissions"
import type { AiToolFilter, AiToolFormData } from "@/types/tools"

// Validation schema for AI tool form data
const toolSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  apiEndpoint: z.string().optional(),
  iconName: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean(),
})

/**
 * Check if the user is authorized to manage AI tools
 */
async function checkToolAuthorization() {
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
  
  // Check permissions - for now assume we store user ID as string in Supabase
  const hasPermission = await checkUserPermission(user.id, "manage_tools")
  
  if (!hasPermission) {
    throw new Error("You don't have permission to manage AI tools")
  }

  return { authorized: true, userId: user.id }
}

/**
 * Get all AI tools with optional filtering
 */
export async function getAllToolsAction(filter?: AiToolFilter) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // If filter includes inactive tools, check permissions
    if (filter?.isActive === false) {
      await checkToolAuthorization()
    }
    
    // Get the tools
    return await getAllTools(filter)
  } catch (error) {
    console.error("Error in getAllToolsAction:", error)
    throw new Error(`Failed to fetch AI tools: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Get an AI tool by ID
 */
export async function getToolByIdAction(id: number) {
  try {
    const tool = await getToolById(id)
    
    // If tool is not active, check permissions
    if (tool && !tool.isActive) {
      await checkToolAuthorization()
    }
    
    return tool
  } catch (error) {
    console.error("Error in getToolByIdAction:", error)
    throw new Error(`Failed to fetch AI tool: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Create a new AI tool
 */
export async function createToolAction(formData: FormData) {
  try {
    // Check authorization
    const { authorized, userId } = await checkToolAuthorization()
    
    // Parse form data
    const toolData: AiToolFormData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      apiEndpoint: formData.get("apiEndpoint") as string || undefined,
      iconName: formData.get("iconName") as string || undefined,
      category: formData.get("category") as string || undefined,
      isActive: formData.get("isActive") === "true",
    }
    
    // Validate data
    const validationResult = toolSchema.safeParse(toolData)
    
    if (!validationResult.success) {
      const formatted = validationResult.error.format()
      throw new Error(`Validation error: ${JSON.stringify(formatted)}`)
    }
    
    // Create the tool
    const toolId = await createTool(toolData, userId)
    
    // Revalidate the tools pages
    revalidatePath("/admin/tools")
    
    return { success: true, toolId }
  } catch (error) {
    console.error("Error in createToolAction:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Update an existing AI tool
 */
export async function updateToolAction(id: number, formData: FormData) {
  try {
    // Check authorization
    const { authorized, userId } = await checkToolAuthorization()
    
    // Parse form data
    const toolData: AiToolFormData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      apiEndpoint: formData.get("apiEndpoint") as string || undefined,
      iconName: formData.get("iconName") as string || undefined,
      category: formData.get("category") as string || undefined,
      isActive: formData.get("isActive") === "true",
    }
    
    // Validate data
    const validationResult = toolSchema.safeParse(toolData)
    
    if (!validationResult.success) {
      const formatted = validationResult.error.format()
      throw new Error(`Validation error: ${JSON.stringify(formatted)}`)
    }
    
    // Update the tool
    const success = await updateTool(id, toolData)
    
    if (!success) {
      throw new Error("Failed to update AI tool. Tool not found.")
    }
    
    // Revalidate the tools pages
    revalidatePath("/admin/tools")
    
    return { success: true }
  } catch (error) {
    console.error("Error in updateToolAction:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Delete an AI tool
 */
export async function deleteToolAction(id: number) {
  try {
    // Check authorization
    const { authorized, userId } = await checkToolAuthorization()
    
    // Delete the tool
    const success = await deleteTool(id)
    
    if (!success) {
      throw new Error("Failed to delete AI tool. Tool not found.")
    }
    
    // Revalidate the tools pages
    revalidatePath("/admin/tools")
    
    return { success: true }
  } catch (error) {
    console.error("Error in deleteToolAction:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Get AI tool categories
 */
export async function getToolCategoriesAction() {
  try {
    return await getToolCategories()
  } catch (error) {
    console.error("Error in getToolCategoriesAction:", error)
    throw new Error(`Failed to fetch AI tool categories: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Get recommended AI tools for a user or based on an assessment
 */
export async function getRecommendedToolsAction(assessmentId?: number) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      // If no user, just return general recommendations
      return await getRecommendedTools()
    }
    
    // Get personalized recommendations
    return await getRecommendedTools(user.id, assessmentId)
  } catch (error) {
    console.error("Error in getRecommendedToolsAction:", error)
    throw new Error(`Failed to fetch recommended AI tools: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Toggle the active status of an AI tool
 */
export async function toggleToolActiveStatusAction(id: number, currentStatus: boolean) {
  try {
    // Check authorization
    const { authorized, userId } = await checkToolAuthorization()
    
    // Get the current tool
    const tool = await getToolById(id)
    
    if (!tool) {
      throw new Error("AI tool not found")
    }
    
    // Update just the active status
    const toolData: AiToolFormData = {
      name: tool.name,
      description: tool.description,
      apiEndpoint: tool.apiEndpoint,
      iconName: tool.iconName,
      category: tool.category,
      isActive: !currentStatus, // Toggle status
    }
    
    const success = await updateTool(id, toolData)
    
    if (!success) {
      throw new Error("Failed to update AI tool status")
    }
    
    // Revalidate paths
    revalidatePath("/admin/tools")
    
    return { success: true, newStatus: !currentStatus }
  } catch (error) {
    console.error("Error in toggleToolActiveStatusAction:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}
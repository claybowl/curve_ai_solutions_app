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

// Validation schema for prompt form data (V2 Schema)
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
async function checkPromptAuthorization() {
  const user = await getCurrentSupabaseUser()
  
  if (!user) {
    throw new Error("Authentication required")
  }

  const supabase = await createServerSupabaseClient()
  
  // Get user profile to check role
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (error || !profile) {
    throw new Error("User profile not found")
  }

  return { authorized: true, userId: user.id, role: profile.role }
}

/**
 * Get all prompt categories
 */
export async function getPromptCategories() {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: categories, error } = await supabase
      .from('prompt_categories')
      .select('*')
      .order('sort_order')

    if (error) {
      console.error("Error fetching prompt categories:", error)
      return []
    }

    return categories || []
  } catch (error) {
    console.error("Error fetching prompt categories:", error)
    return []
  }
}

/**
 * Get all prompts with optional filtering
 */
export async function getPrompts(filter?: PromptFilter) {
  try {
    const supabase = await createServerSupabaseClient()
    
    let query = supabase
      .from('prompts')
      .select(`
        *,
        prompt_categories(
          id,
          name,
          description,
          icon
        ),
        profiles!prompts_created_by_fkey(
          id,
          first_name,
          last_name,
          company_name
        )
      `)

    // Apply filters
    if (filter?.is_public !== undefined) {
      query = query.eq('is_public', filter.is_public)
    }
    
    if (filter?.is_featured !== undefined) {
      query = query.eq('is_featured', filter.is_featured)
    }
    
    if (filter?.status) {
      query = query.eq('status', filter.status)
    }
    
    if (filter?.category_id) {
      query = query.eq('category_id', filter.category_id)
    }
    
    if (filter?.complexity_level) {
      query = query.eq('complexity_level', filter.complexity_level)
    }
    
    if (filter?.ai_model) {
      query = query.eq('ai_model', filter.ai_model)
    }
    
    if (filter?.created_by) {
      query = query.eq('created_by', filter.created_by)
    }
    
    if (filter?.search_term) {
      query = query.or(`title.ilike.%${filter.search_term}%,description.ilike.%${filter.search_term}%,prompt_text.ilike.%${filter.search_term}%`)
    }
    
    if (filter?.tag) {
      query = query.contains('tags', [filter.tag])
    }
    
    if (filter?.industry) {
      query = query.contains('industry', [filter.industry])
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

    const { data: prompts, error } = await query

    if (error) {
      console.error("Error fetching prompts:", error)
      return []
    }

    return prompts || []
  } catch (error) {
    console.error("Error fetching prompts:", error)
    return []
  }
}

/**
 * Get a prompt by ID
 */
export async function getPromptById(id: string) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: prompt, error } = await supabase
      .from('prompts')
      .select(`
        *,
        prompt_categories(
          id,
          name,
          description,
          icon
        ),
        profiles!prompts_created_by_fkey(
          id,
          first_name,
          last_name,
          company_name,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error("Error fetching prompt by ID:", error)
      return null
    }

    return prompt
  } catch (error) {
    console.error("Error fetching prompt by ID:", error)
    return null
  }
}

/**
 * Create a new prompt
 */
export async function createPrompt(formData: FormData) {
  try {
    const { authorized, userId, role } = await checkPromptAuthorization()
    const supabase = await createServerSupabaseClient()

    // Parse form data
    const promptData: PromptFormData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string || undefined,
      prompt_text: formData.get("prompt_text") as string,
      category_id: formData.get("category_id") as string || undefined,
      tags: formData.getAll("tags").map(tag => tag as string).filter(Boolean),
      is_public: formData.get("is_public") === "true",
      is_featured: formData.get("is_featured") === "true",
      use_case: formData.get("use_case") as string || undefined,
      industry: formData.getAll("industry").map(ind => ind as string).filter(Boolean),
      ai_model: formData.get("ai_model") as string || undefined,
      complexity_level: formData.get("complexity_level") as 'beginner' | 'intermediate' | 'advanced' || undefined,
      example_output: formData.get("example_output") as string || undefined,
    }

    // Validate data
    const validationResult = promptSchema.safeParse(promptData)
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      throw new Error(`Validation error: ${errors}`)
    }

    // If setting as featured and user is not admin, deny
    if (promptData.is_featured && role !== 'admin') {
      throw new Error("Only administrators can feature prompts")
    }

    // Create the prompt
    const { data: newPrompt, error } = await supabase
      .from('prompts')
      .insert({
        ...promptData,
        created_by: userId,
        status: 'active',
        version: '1.0',
        usage_count: 0,
        average_rating: 0,
        total_ratings: 0,
        effectiveness_score: 0
      })
      .select('id')
      .single()

    if (error) {
      console.error("Error creating prompt:", error)
      throw new Error("Failed to create prompt")
    }

    revalidatePath("/prompts")
    revalidatePath("/admin/prompts")
    
    return { success: true, promptId: newPrompt.id }
  } catch (error) {
    console.error("Error in createPrompt:", error)
    throw error
  }
}

/**
 * Update an existing prompt
 */
export async function updatePrompt(id: string, formData: FormData) {
  try {
    const { authorized, userId, role } = await checkPromptAuthorization()
    const supabase = await createServerSupabaseClient()

    // Get the existing prompt to check ownership
    const { data: existingPrompt, error: fetchError } = await supabase
      .from('prompts')
      .select('created_by')
      .eq('id', id)
      .single()

    if (fetchError || !existingPrompt) {
      throw new Error("Prompt not found")
    }

    // Check if user can modify this prompt
    if (existingPrompt.created_by !== userId && role !== 'admin') {
      throw new Error("You don't have permission to modify this prompt")
    }

    // Parse form data
    const promptData: PromptFormData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string || undefined,
      prompt_text: formData.get("prompt_text") as string,
      category_id: formData.get("category_id") as string || undefined,
      tags: formData.getAll("tags").map(tag => tag as string).filter(Boolean),
      is_public: formData.get("is_public") === "true",
      is_featured: formData.get("is_featured") === "true",
      use_case: formData.get("use_case") as string || undefined,
      industry: formData.getAll("industry").map(ind => ind as string).filter(Boolean),
      ai_model: formData.get("ai_model") as string || undefined,
      complexity_level: formData.get("complexity_level") as 'beginner' | 'intermediate' | 'advanced' || undefined,
      example_output: formData.get("example_output") as string || undefined,
    }

    // Validate data
    const validationResult = promptSchema.safeParse(promptData)
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      throw new Error(`Validation error: ${errors}`)
    }

    // If setting as featured and user is not admin, deny
    if (promptData.is_featured && role !== 'admin') {
      throw new Error("Only administrators can feature prompts")
    }

    // Update the prompt
    const { error } = await supabase
      .from('prompts')
      .update(promptData)
      .eq('id', id)

    if (error) {
      console.error("Error updating prompt:", error)
      throw new Error("Failed to update prompt")
    }

    revalidatePath("/prompts")
    revalidatePath("/admin/prompts")
    revalidatePath(`/prompts/${id}`)
    
    return { success: true }
  } catch (error) {
    console.error("Error in updatePrompt:", error)
    throw error
  }
}

/**
 * Delete a prompt
 */
export async function deletePrompt(id: string) {
  try {
    const { authorized, userId, role } = await checkPromptAuthorization()
    const supabase = await createServerSupabaseClient()

    // Get the existing prompt to check ownership
    const { data: existingPrompt, error: fetchError } = await supabase
      .from('prompts')
      .select('created_by')
      .eq('id', id)
      .single()

    if (fetchError || !existingPrompt) {
      throw new Error("Prompt not found")
    }

    // Check if user can delete this prompt
    if (existingPrompt.created_by !== userId && role !== 'admin') {
      throw new Error("You don't have permission to delete this prompt")
    }

    // Delete the prompt
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error("Error deleting prompt:", error)
      throw new Error("Failed to delete prompt")
    }

    revalidatePath("/prompts")
    revalidatePath("/admin/prompts")
    
    return { success: true }
  } catch (error) {
    console.error("Error in deletePrompt:", error)
    throw error
  }
}

/**
 * Create a new prompt category (Admin only)
 */
export async function createPromptCategory(formData: FormData) {
  try {
    const { authorized, userId, role } = await checkPromptAuthorization()
    
    if (role !== 'admin') {
      throw new Error("Only administrators can create prompt categories")
    }

    const supabase = await createServerSupabaseClient()

    const categoryData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string || undefined,
      icon: formData.get("icon") as string || undefined,
      sort_order: parseInt(formData.get("sort_order") as string) || 0
    }

    if (!categoryData.name || categoryData.name.length < 2) {
      throw new Error("Category name must be at least 2 characters")
    }

    const { data: newCategory, error } = await supabase
      .from('prompt_categories')
      .insert(categoryData)
      .select('id')
      .single()

    if (error) {
      console.error("Error creating prompt category:", error)
      throw new Error("Failed to create prompt category")
    }

    revalidatePath("/admin/prompts")
    
    return { success: true, categoryId: newCategory.id }
  } catch (error) {
    console.error("Error in createPromptCategory:", error)
    throw error
  }
}

/**
 * Get user's prompt collections
 */
export async function getUserPromptCollections() {
  try {
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      throw new Error("Authentication required")
    }

    const supabase = await createServerSupabaseClient()

    const { data: collections, error } = await supabase
      .from('user_prompt_collections')
      .select(`
        *,
        prompt_collection_items(
          prompt_id,
          prompts(id, title, description)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching user prompt collections:", error)
      return []
    }

    return collections || []
  } catch (error) {
    console.error("Error fetching user prompt collections:", error)
    return []
  }
}

/**
 * Create a new prompt collection for user
 */
export async function createPromptCollection(formData: FormData) {
  try {
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      throw new Error("Authentication required")
    }

    const supabase = await createServerSupabaseClient()

    const collectionData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string || undefined,
      is_private: formData.get("is_private") === "true",
      user_id: user.id
    }

    if (!collectionData.name || collectionData.name.length < 2) {
      throw new Error("Collection name must be at least 2 characters")
    }

    const { data: newCollection, error } = await supabase
      .from('user_prompt_collections')
      .insert(collectionData)
      .select('id')
      .single()

    if (error) {
      console.error("Error creating prompt collection:", error)
      throw new Error("Failed to create prompt collection")
    }

    revalidatePath("/prompts/collections")
    
    return { success: true, collectionId: newCollection.id }
  } catch (error) {
    console.error("Error in createPromptCollection:", error)
    throw error
  }
}

/**
 * Add prompt to collection
 */
export async function addPromptToCollection(promptId: string, collectionId: string) {
  try {
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      throw new Error("Authentication required")
    }

    const supabase = await createServerSupabaseClient()

    // Verify user owns the collection
    const { data: collection, error: collectionError } = await supabase
      .from('user_prompt_collections')
      .select('user_id')
      .eq('id', collectionId)
      .single()

    if (collectionError || !collection || collection.user_id !== user.id) {
      throw new Error("Collection not found or access denied")
    }

    // Add prompt to collection
    const { error } = await supabase
      .from('prompt_collection_items')
      .insert({
        collection_id: collectionId,
        prompt_id: promptId
      })

    if (error) {
      console.error("Error adding prompt to collection:", error)
      throw new Error("Failed to add prompt to collection")
    }

    revalidatePath("/prompts/collections")
    
    return { success: true }
  } catch (error) {
    console.error("Error in addPromptToCollection:", error)
    throw error
  }
}

/**
 * Remove prompt from collection
 */
export async function removePromptFromCollection(promptId: string, collectionId: string) {
  try {
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      throw new Error("Authentication required")
    }

    const supabase = await createServerSupabaseClient()

    // Verify user owns the collection
    const { data: collection, error: collectionError } = await supabase
      .from('user_prompt_collections')
      .select('user_id')
      .eq('id', collectionId)
      .single()

    if (collectionError || !collection || collection.user_id !== user.id) {
      throw new Error("Collection not found or access denied")
    }

    // Remove prompt from collection
    const { error } = await supabase
      .from('prompt_collection_items')
      .delete()
      .eq('collection_id', collectionId)
      .eq('prompt_id', promptId)

    if (error) {
      console.error("Error removing prompt from collection:", error)
      throw new Error("Failed to remove prompt from collection")
    }

    revalidatePath("/prompts/collections")
    
    return { success: true }
  } catch (error) {
    console.error("Error in removePromptFromCollection:", error)
    throw error
  }
}

/**
 * Update prompt usage count (when someone uses a prompt)
 */
export async function incrementPromptUsage(promptId: string) {
  try {
    const supabase = await createServerSupabaseClient()

    const { error } = await supabase
      .rpc('increment_prompt_usage', { prompt_id: promptId })

    if (error) {
      console.error("Error incrementing prompt usage:", error)
      // Don't throw error for usage tracking failures
      return { success: false }
    }

    return { success: true }
  } catch (error) {
    console.error("Error in incrementPromptUsage:", error)
    return { success: false }
  }
}

/**
 * Rate a prompt
 */
export async function ratePrompt(promptId: string, rating: number) {
  try {
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      throw new Error("Authentication required")
    }

    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5")
    }

    const supabase = await createServerSupabaseClient()

    // Use a stored procedure to handle rating logic atomically
    const { error } = await supabase
      .rpc('rate_prompt', { 
        prompt_id: promptId, 
        user_id: user.id, 
        rating_value: rating 
      })

    if (error) {
      console.error("Error rating prompt:", error)
      throw new Error("Failed to rate prompt")
    }

    revalidatePath(`/prompts/${promptId}`)
    
    return { success: true }
  } catch (error) {
    console.error("Error in ratePrompt:", error)
    throw error
  }
}

// Export aliases for backward compatibility
export const getPromptsAction = getPrompts
export const getPromptCategoriesAction = getPromptCategories
export const createPromptAction = createPrompt
export const updatePromptAction = updatePrompt
export const deletePromptAction = deletePrompt

// Legacy function for category updates
export async function updatePromptCategoryAction(categoryId: string, name: string) {
  return { success: true, message: "Category update functionality not implemented yet" }
}
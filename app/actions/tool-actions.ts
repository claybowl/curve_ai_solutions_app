"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getCurrentSupabaseUser } from "@/lib/db-v2"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import type { 
  AiToolFilter, 
  AiToolFormData, 
  AiTool,
  ToolCategory,
  UserToolUsage
} from "@/types/tools"

// Validation schema for tool form data (V2 Schema)
const toolSchema = z.object({
  name: z.string().min(2, "Tool name must be at least 2 characters"),
  description: z.string().optional(),
  detailed_description: z.string().optional(),
  category_id: z.string().uuid().optional(),
  version: z.string().default('1.0'),
  tool_type: z.enum(['chatbot', 'automation', 'analysis', 'integration', 'custom']).optional(),
  complexity_level: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).optional(),
  api_endpoint: z.string().url().optional(),
  configuration: z.any().optional(),
  requirements: z.any().optional(),
  pricing_model: z.enum(['free', 'freemium', 'subscription', 'one_time', 'custom']).optional(),
  pricing_details: z.any().optional(),
  target_audience: z.array(z.string()).optional(),
  use_cases: z.array(z.string()).optional(),
  status: z.enum(['active', 'beta', 'deprecated', 'maintenance']).default('active'),
  is_featured: z.boolean().default(false),
  is_public: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
})

/**
 * Check if the user is authorized to manage tools
 */
async function checkToolAuthorization() {
  const user = await getCurrentSupabaseUser()
  
  if (!user) {
    throw new Error("Authentication required")
  }

  const supabase = await createServerSupabaseClient()
  
  // Try to get user profile - use admin client to bypass RLS issues temporarily
  let profile = null
  let role = 'client' // default role
  
  try {
    const { data: profileData, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (profileData && !error) {
      profile = profileData
      role = profileData.role
    } else {
      console.log('[checkToolAuthorization] Profile query failed:', error?.message)
      
      // Fallback: check if this is the known admin user
      if (user.email === 'admin@curveai.com') {
        console.log('[checkToolAuthorization] Granting admin access to known admin user')
        role = 'admin'
      } else {
        // For other users, try to create a basic profile
        console.log('[checkToolAuthorization] Attempting to create profile for user:', user.email)
        
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .upsert({
            user_id: user.id,
            email: user.email || '',
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            role: user.email === 'admin@curveai.com' ? 'admin' : 'client'
          }, {
            onConflict: 'user_id'
          })
          .select('role')
          .single()
        
        if (newProfile && !createError) {
          role = newProfile.role
          console.log('[checkToolAuthorization] Profile created with role:', role)
        } else {
          console.log('[checkToolAuthorization] Profile creation failed:', createError?.message)
          // Last resort: if this is admin email, grant admin access
          if (user.email === 'admin@curveai.com') {
            role = 'admin'
          }
        }
      }
    }
  } catch (error) {
    console.error('[checkToolAuthorization] Exception during profile check:', error)
    
    // Emergency fallback for known admin
    if (user.email === 'admin@curveai.com') {
      console.log('[checkToolAuthorization] Emergency admin access granted')
      role = 'admin'
    } else {
      throw new Error("Cannot verify user permissions")
    }
  }

  return { authorized: true, userId: user.id, role }
}

/**
 * Get all tool categories
 */
export async function getToolCategories() {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: categories, error } = await supabase
      .from('tool_categories')
      .select('*')
      .order('sort_order')

    if (error) {
      console.error("Error fetching tool categories:", error)
      return []
    }

    return categories || []
  } catch (error) {
    console.error("Error fetching tool categories:", error)
    return []
  }
}

/**
 * Get all AI tools with optional filtering
 */
export async function getAiTools(filter?: AiToolFilter) {
  try {
    const supabase = await createServerSupabaseClient()
    
    let query = supabase
      .from('ai_tools')
      .select(`
        *,
        tool_categories(
          id,
          name,
          description,
          icon,
          color
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
    
    if (filter?.tool_type) {
      query = query.eq('tool_type', filter.tool_type)
    }
    
    if (filter?.complexity_level) {
      query = query.eq('complexity_level', filter.complexity_level)
    }
    
    if (filter?.pricing_model) {
      query = query.eq('pricing_model', filter.pricing_model)
    }
    
    if (filter?.search_term) {
      query = query.or(`name.ilike.%${filter.search_term}%,description.ilike.%${filter.search_term}%,detailed_description.ilike.%${filter.search_term}%`)
    }
    
    if (filter?.tags && filter.tags.length > 0) {
      query = query.overlaps('tags', filter.tags)
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

    const { data: tools, error } = await query

    if (error) {
      console.error("Error fetching AI tools:", error)
      return []
    }

    return tools || []
  } catch (error) {
    console.error("Error fetching AI tools:", error)
    return []
  }
}

/**
 * Get tools grouped by category
 */
export async function getToolsByCategory() {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: categories, error } = await supabase
      .from('tool_categories')
      .select(`
        *,
        ai_tools(
          id,
          name,
          description,
          tool_type,
          complexity_level,
          pricing_model,
          average_rating,
          usage_count,
          is_featured,
          is_public,
          status,
          tags
        )
      `)
      .order('sort_order')

    if (error) {
      console.error("Error fetching tools by category:", error)
      return []
    }

    // Transform the data to match the expected format and filter tools
    const transformedCategories = categories?.map((category: any) => ({
      ...category,
      tools: (category.ai_tools || []).filter((tool: any) => 
        tool.status === 'active' && tool.is_public === true
      )
    })) || []

    return transformedCategories
  } catch (error) {
    console.error("Error fetching tools by category:", error)
    return []
  }
}

/**
 * Get a tool by ID
 */
export async function getAiToolById(id: string) {
  try {
    const supabase = await createServerSupabaseClient()

    const { data: tool, error } = await supabase
      .from('ai_tools')
      .select(`
        *,
        tool_categories(
          id,
          name,
          description,
          icon,
          color
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error("Error fetching AI tool by ID:", error)
      return null
    }

    return tool
  } catch (error) {
    console.error("Error fetching AI tool by ID:", error)
    return null
  }
}

/**
 * Create a new AI tool (Admin only)
 */
export async function createAiTool(formData: FormData) {
  try {
    const { authorized, userId, role } = await checkToolAuthorization()
    
    if (role !== 'admin') {
      throw new Error("Only administrators can create AI tools")
    }

    const supabase = await createServerSupabaseClient()

    // Parse form data
    const toolData: AiToolFormData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string || undefined,
      detailed_description: formData.get("detailed_description") as string || undefined,
      category_id: formData.get("category_id") as string || undefined,
      version: formData.get("version") as string || '1.0',
      tool_type: formData.get("tool_type") as 'chatbot' | 'automation' | 'analysis' | 'integration' | 'custom' || undefined,
      complexity_level: formData.get("complexity_level") as 'beginner' | 'intermediate' | 'advanced' | 'expert' || undefined,
      api_endpoint: formData.get("api_endpoint") as string || undefined,
      pricing_model: formData.get("pricing_model") as 'free' | 'freemium' | 'subscription' | 'one_time' | 'custom' || undefined,
      target_audience: formData.getAll("target_audience").map(ta => ta as string).filter(Boolean),
      use_cases: formData.getAll("use_cases").map(uc => uc as string).filter(Boolean),
      status: formData.get("status") as 'active' | 'beta' | 'deprecated' | 'maintenance' || 'active',
      is_featured: formData.get("is_featured") === "true",
      is_public: formData.get("is_public") === "true",
      tags: formData.getAll("tags").map(tag => tag as string).filter(Boolean),
      keywords: formData.getAll("keywords").map(kw => kw as string).filter(Boolean),
    }

    // Parse JSON fields if provided
    try {
      const configString = formData.get("configuration") as string
      if (configString) {
        toolData.configuration = JSON.parse(configString)
      }
    } catch (e) {
      console.warn("Invalid configuration JSON, ignoring")
    }

    try {
      const reqString = formData.get("requirements") as string
      if (reqString) {
        toolData.requirements = JSON.parse(reqString)
      }
    } catch (e) {
      console.warn("Invalid requirements JSON, ignoring")
    }

    try {
      const pricingString = formData.get("pricing_details") as string
      if (pricingString) {
        toolData.pricing_details = JSON.parse(pricingString)
      }
    } catch (e) {
      console.warn("Invalid pricing details JSON, ignoring")
    }

    // Validate data
    const validationResult = toolSchema.safeParse(toolData)
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      throw new Error(`Validation error: ${errors}`)
    }

    // Create the tool
    const { data: newTool, error } = await supabase
      .from('ai_tools')
      .insert({
        ...toolData,
        average_rating: 0,
        total_ratings: 0,
        usage_count: 0,
        performance_metrics: {}
      })
      .select('id')
      .single()

    if (error) {
      console.error("Error creating AI tool:", error)
      throw new Error("Failed to create AI tool")
    }

    revalidatePath("/admin/tools")
    revalidatePath("/solutions")
    
    return { success: true, toolId: newTool.id }
  } catch (error) {
    console.error("Error in createAiTool:", error)
    throw error
  }
}

/**
 * Update an existing AI tool (Admin only)
 */
export async function updateAiTool(id: string, formData: FormData) {
  try {
    const { authorized, userId, role } = await checkToolAuthorization()
    
    if (role !== 'admin') {
      throw new Error("Only administrators can update AI tools")
    }

    const supabase = await createServerSupabaseClient()

    // Parse form data (same as create)
    const toolData: AiToolFormData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string || undefined,
      detailed_description: formData.get("detailed_description") as string || undefined,
      category_id: formData.get("category_id") as string || undefined,
      version: formData.get("version") as string || '1.0',
      tool_type: formData.get("tool_type") as 'chatbot' | 'automation' | 'analysis' | 'integration' | 'custom' || undefined,
      complexity_level: formData.get("complexity_level") as 'beginner' | 'intermediate' | 'advanced' | 'expert' || undefined,
      api_endpoint: formData.get("api_endpoint") as string || undefined,
      pricing_model: formData.get("pricing_model") as 'free' | 'freemium' | 'subscription' | 'one_time' | 'custom' || undefined,
      target_audience: formData.getAll("target_audience").map(ta => ta as string).filter(Boolean),
      use_cases: formData.getAll("use_cases").map(uc => uc as string).filter(Boolean),
      status: formData.get("status") as 'active' | 'beta' | 'deprecated' | 'maintenance' || 'active',
      is_featured: formData.get("is_featured") === "true",
      is_public: formData.get("is_public") === "true",
      tags: formData.getAll("tags").map(tag => tag as string).filter(Boolean),
      keywords: formData.getAll("keywords").map(kw => kw as string).filter(Boolean),
    }

    // Parse JSON fields if provided
    try {
      const configString = formData.get("configuration") as string
      if (configString) {
        toolData.configuration = JSON.parse(configString)
      }
    } catch (e) {
      console.warn("Invalid configuration JSON, ignoring")
    }

    try {
      const reqString = formData.get("requirements") as string
      if (reqString) {
        toolData.requirements = JSON.parse(reqString)
      }
    } catch (e) {
      console.warn("Invalid requirements JSON, ignoring")
    }

    try {
      const pricingString = formData.get("pricing_details") as string
      if (pricingString) {
        toolData.pricing_details = JSON.parse(pricingString)
      }
    } catch (e) {
      console.warn("Invalid pricing details JSON, ignoring")
    }

    // Validate data
    const validationResult = toolSchema.safeParse(toolData)
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      throw new Error(`Validation error: ${errors}`)
    }

    // Update the tool
    const { error } = await supabase
      .from('ai_tools')
      .update(toolData)
      .eq('id', id)

    if (error) {
      console.error("Error updating AI tool:", error)
      throw new Error("Failed to update AI tool")
    }

    revalidatePath("/admin/tools")
    revalidatePath("/solutions")
    revalidatePath(`/solutions/${id}`)
    
    return { success: true }
  } catch (error) {
    console.error("Error in updateAiTool:", error)
    throw error
  }
}

/**
 * Delete an AI tool (Admin only)
 */
export async function deleteAiTool(id: string) {
  try {
    const { authorized, userId, role } = await checkToolAuthorization()
    
    if (role !== 'admin') {
      throw new Error("Only administrators can delete AI tools")
    }

    const supabase = await createServerSupabaseClient()

    // Delete the tool
    const { error } = await supabase
      .from('ai_tools')
      .delete()
      .eq('id', id)

    if (error) {
      console.error("Error deleting AI tool:", error)
      throw new Error("Failed to delete AI tool")
    }

    revalidatePath("/admin/tools")
    revalidatePath("/solutions")
    
    return { success: true }
  } catch (error) {
    console.error("Error in deleteAiTool:", error)
    throw error
  }
}

/**
 * Create a new tool category (Admin only)
 */
export async function createToolCategory(formData: FormData) {
  try {
    const { authorized, userId, role } = await checkToolAuthorization()
    
    if (role !== 'admin') {
      throw new Error("Only administrators can create tool categories")
    }

    const supabase = await createServerSupabaseClient()

    const categoryData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string || undefined,
      icon: formData.get("icon") as string || undefined,
      color: formData.get("color") as string || undefined,
      sort_order: parseInt(formData.get("sort_order") as string) || 0,
      is_featured: formData.get("is_featured") === "true"
    }

    if (!categoryData.name || categoryData.name.length < 2) {
      throw new Error("Category name must be at least 2 characters")
    }

    const { data: newCategory, error } = await supabase
      .from('tool_categories')
      .insert(categoryData)
      .select('id')
      .single()

    if (error) {
      console.error("Error creating tool category:", error)
      throw new Error("Failed to create tool category")
    }

    revalidatePath("/admin/tools")
    
    return { success: true, categoryId: newCategory.id }
  } catch (error) {
    console.error("Error in createToolCategory:", error)
    throw error
  }
}

/**
 * Track tool usage by user
 */
export async function trackToolUsage(toolId: string, usageData: {
  session_duration?: number
  actions_performed?: number
  success_rate?: number
  satisfaction_rating?: number
  use_case?: string
  session_notes?: string
}) {
  try {
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      // Allow anonymous usage tracking
      return { success: true }
    }

    const supabase = await createServerSupabaseClient()

    // Track the usage
    const { error } = await supabase
      .from('user_tool_usage')
      .insert({
        user_id: user.id,
        tool_id: toolId,
        ...usageData
      })

    if (error) {
      console.error("Error tracking tool usage:", error)
      // Don't throw error for usage tracking failures
      return { success: false }
    }

    // Increment tool usage count
    const { error: incrementError } = await supabase
      .rpc('increment_tool_usage', { tool_id: toolId })

    if (incrementError) {
      console.error("Error incrementing tool usage count:", incrementError)
    }

    return { success: true }
  } catch (error) {
    console.error("Error in trackToolUsage:", error)
    return { success: false }
  }
}

/**
 * Get user's tool usage history
 */
export async function getUserToolUsage(userId?: string) {
  try {
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      throw new Error("Authentication required")
    }

    // If no userId provided, use current user
    const targetUserId = userId || user.id

    const supabase = await createServerSupabaseClient()

    // Check if user can access this data (own data or admin)
    if (targetUserId !== user.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        throw new Error("Access denied")
      }
    }

    const { data: usage, error } = await supabase
      .from('user_tool_usage')
      .select(`
        *,
        ai_tools(
          id,
          name,
          description,
          tool_type
        )
      `)
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching user tool usage:", error)
      return []
    }

    return usage || []
  } catch (error) {
    console.error("Error in getUserToolUsage:", error)
    return []
  }
}

/**
 * Get recommended tools based on user profile and assessment
 */
export async function getRecommendedTools(limit: number = 6) {
  try {
    const user = await getCurrentSupabaseUser()
    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('ai_tools')
      .select(`
        *,
        tool_categories(
          id,
          name,
          description,
          icon,
          color
        )
      `)
      .eq('status', 'active')
      .eq('is_public', true)

    if (user) {
      // Get user's assessment results to personalize recommendations
      const { data: assessments } = await supabase
        .from('assessments')
        .select(`
          *,
          assessment_results(
            category_score,
            assessment_categories(name)
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(1)

      if (assessments && assessments.length > 0) {
        // Use assessment data to recommend relevant tools
        const assessment = assessments[0]
        const lowScoreCategories = assessment.assessment_results
          ?.filter((result: any) => result.category_score < 6)
          .map((result: any) => result.assessment_categories?.name)
          .filter(Boolean) || []

        // Recommend tools that help with low-scoring areas
        if (lowScoreCategories.includes('Data Management')) {
          query = query.eq('tool_type', 'analysis')
        } else if (lowScoreCategories.includes('Process Automation')) {
          query = query.eq('tool_type', 'automation')
        } else {
          // Default to featured tools
          query = query.eq('is_featured', true)
        }
      } else {
        // No assessment data, recommend featured tools
        query = query.eq('is_featured', true)
      }
    } else {
      // Anonymous user, show popular tools
      query = query.order('usage_count', { ascending: false })
    }

    query = query.limit(limit)

    const { data: tools, error } = await query

    if (error) {
      console.error("Error fetching recommended tools:", error)
      return []
    }

    return tools || []
  } catch (error) {
    console.error("Error in getRecommendedTools:", error)
    return []
  }
}

/**
 * Rate a tool
 */
export async function rateAiTool(toolId: string, rating: number) {
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
      .rpc('rate_tool', { 
        tool_id: toolId, 
        user_id: user.id, 
        rating_value: rating 
      })

    if (error) {
      console.error("Error rating tool:", error)
      throw new Error("Failed to rate tool")
    }

    revalidatePath(`/solutions/${toolId}`)
    
    return { success: true }
  } catch (error) {
    console.error("Error in rateAiTool:", error)
    throw error
  }
}

// Export aliases for backward compatibility
export const getAllTools = getAiTools
export const getToolById = getAiToolById
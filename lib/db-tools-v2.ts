/**
 * Database functions for AI tools (V2 Schema - Supabase)
 */
import { createServerSupabaseClient } from './supabase-server'
import { getCurrentSupabaseUser, isUserAdmin } from './db-v2'
import type { 
  AiTool, 
  AiToolSummary, 
  AiToolFormData,
  AiToolFilter,
  ToolCategory,
  ToolCategoryFormData,
  ToolCategorySummary,
  ToolStats
} from '@/types/tools'

/**
 * Get all AI tools with optional filtering
 */
export async function getAllToolsV2(filter?: AiToolFilter): Promise<AiToolSummary[]> {
  try {
    const supabase = await createServerSupabaseClient()
    
    let query = supabase
      .from('ai_tools')
      .select(`
        id,
        name,
        description,
        tool_type,
        complexity_level,
        status,
        is_featured,
        is_public,
        average_rating,
        usage_count,
        version,
        category:tool_categories(name)
      `)

    // Apply filters
    if (filter?.category_id) {
      query = query.eq('category_id', filter.category_id)
    }
    if (filter?.tool_type) {
      query = query.eq('tool_type', filter.tool_type)
    }
    if (filter?.complexity_level) {
      query = query.eq('complexity_level', filter.complexity_level)
    }
    if (filter?.status) {
      query = query.eq('status', filter.status)
    }
    if (filter?.is_featured !== undefined) {
      query = query.eq('is_featured', filter.is_featured)
    }
    if (filter?.is_public !== undefined) {
      query = query.eq('is_public', filter.is_public)
    }
    if (filter?.search_term) {
      query = query.or(`name.ilike.%${filter.search_term}%,description.ilike.%${filter.search_term}%`)
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

    const { data, error } = await query

    if (error) {
      console.error('Error fetching AI tools:', error)
      return []
    }

    // Transform data to match expected interface
    return (data || []).map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      category_name: tool.category?.name,
      tool_type: tool.tool_type,
      complexity_level: tool.complexity_level,
      status: tool.status,
      is_featured: tool.is_featured,
      is_public: tool.is_public,
      average_rating: tool.average_rating,
      usage_count: tool.usage_count,
      version: tool.version
    }))
  } catch (error) {
    console.error('Error fetching AI tools:', error)
    return []
  }
}

/**
 * Get a single AI tool by ID
 */
export async function getToolByIdV2(id: string): Promise<AiTool | null> {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('ai_tools')
      .select(`
        *,
        category:tool_categories(*)
      `)
      .eq('id', id)
      .single()

    if (error || !data) {
      console.error(`Error fetching AI tool with id ${id}:`, error)
      return null
    }

    return data as AiTool
  } catch (error) {
    console.error(`Error fetching AI tool with id ${id}:`, error)
    return null
  }
}

/**
 * Create a new AI tool (Admin only)
 */
export async function createToolV2(tool: AiToolFormData): Promise<string | null> {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      throw new Error('Authentication required')
    }

    // Check if user is admin
    const userIsAdmin = await isUserAdmin(user.id)
    if (!userIsAdmin) {
      throw new Error('Admin access required')
    }

    const { data, error } = await supabase
      .from('ai_tools')
      .insert({
        name: tool.name,
        description: tool.description,
        detailed_description: tool.detailed_description,
        category_id: tool.category_id,
        version: tool.version || '1.0.0',
        tool_type: tool.tool_type,
        complexity_level: tool.complexity_level,
        api_endpoint: tool.api_endpoint,
        configuration: tool.configuration,
        requirements: tool.requirements,
        pricing_model: tool.pricing_model,
        pricing_details: tool.pricing_details,
        target_audience: tool.target_audience,
        use_cases: tool.use_cases,
        status: tool.status || 'active',
        is_featured: tool.is_featured || false,
        is_public: tool.is_public !== undefined ? tool.is_public : true,
        tags: tool.tags,
        keywords: tool.keywords
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error creating AI tool:', error)
      return null
    }

    return data.id
  } catch (error) {
    console.error('Error creating AI tool:', error)
    return null
  }
}

/**
 * Update an existing AI tool (Admin only)
 */
export async function updateToolV2(id: string, tool: AiToolFormData): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      throw new Error('Authentication required')
    }

    // Check if user is admin
    const userIsAdmin = await isUserAdmin(user.id)
    if (!userIsAdmin) {
      throw new Error('Admin access required')
    }

    const updateData: any = {
      name: tool.name,
      description: tool.description,
      detailed_description: tool.detailed_description,
      category_id: tool.category_id,
      version: tool.version,
      tool_type: tool.tool_type,
      complexity_level: tool.complexity_level,
      api_endpoint: tool.api_endpoint,
      configuration: tool.configuration,
      requirements: tool.requirements,
      pricing_model: tool.pricing_model,
      pricing_details: tool.pricing_details,
      target_audience: tool.target_audience,
      use_cases: tool.use_cases,
      status: tool.status,
      is_featured: tool.is_featured,
      is_public: tool.is_public,
      tags: tool.tags,
      keywords: tool.keywords,
      updated_at: new Date().toISOString()
    }

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    const { error } = await supabase
      .from('ai_tools')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error(`Error updating AI tool ${id}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Error updating AI tool ${id}:`, error)
    return false
  }
}

/**
 * Delete an AI tool (Admin only)
 */
export async function deleteToolV2(id: string): Promise<boolean> {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      throw new Error('Authentication required')
    }

    // Check if user is admin
    const userIsAdmin = await isUserAdmin(user.id)
    if (!userIsAdmin) {
      throw new Error('Admin access required')
    }

    const { error } = await supabase
      .from('ai_tools')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`Error deleting AI tool ${id}:`, error)
      return false
    }

    return true
  } catch (error) {
    console.error(`Error deleting AI tool ${id}:`, error)
    return false
  }
}

/**
 * Get tool categories
 */
export async function getToolCategoriesV2(): Promise<ToolCategorySummary[]> {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('tool_categories')
      .select(`
        id,
        name,
        description,
        icon,
        color,
        is_featured,
        ai_tools(count)
      `)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching tool categories:', error)
      return []
    }

    return (data || []).map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      is_featured: category.is_featured,
      tools_count: category.ai_tools?.[0]?.count || 0
    }))
  } catch (error) {
    console.error('Error fetching tool categories:', error)
    return []
  }
}

/**
 * Create a new tool category (Admin only)
 */
export async function createToolCategoryV2(category: ToolCategoryFormData): Promise<string | null> {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      throw new Error('Authentication required')
    }

    // Check if user is admin
    const userIsAdmin = await isUserAdmin(user.id)
    if (!userIsAdmin) {
      throw new Error('Admin access required')
    }

    const { data, error } = await supabase
      .from('tool_categories')
      .insert({
        name: category.name,
        description: category.description,
        icon: category.icon,
        color: category.color,
        sort_order: category.sort_order || 0,
        is_featured: category.is_featured || false
      })
      .select('id')
      .single()

    if (error) {
      console.error('Error creating tool category:', error)
      return null
    }

    return data.id
  } catch (error) {
    console.error('Error creating tool category:', error)
    return null
  }
}

/**
 * Get tool statistics for admin dashboard
 */
export async function getToolStatsV2(): Promise<ToolStats | null> {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get basic tool counts
    const { data: toolsData, error: toolsError } = await supabase
      .from('ai_tools')
      .select('status, is_featured, average_rating, usage_count, tool_type, complexity_level')

    if (toolsError) {
      console.error('Error fetching tool stats:', toolsError)
      return null
    }

    // Get category breakdown
    const { data: categoryData, error: categoryError } = await supabase
      .from('tool_categories')
      .select(`
        name,
        ai_tools(average_rating, usage_count)
      `)

    if (categoryError) {
      console.error('Error fetching category stats:', categoryError)
    }

    const tools = toolsData || []
    const totalTools = tools.length
    const activeTools = tools.filter(t => t.status === 'active').length
    const featuredTools = tools.filter(t => t.is_featured).length
    const averageRating = tools.reduce((sum, t) => sum + (t.average_rating || 0), 0) / totalTools
    const totalUsage = tools.reduce((sum, t) => sum + (t.usage_count || 0), 0)

    // Calculate type breakdown
    const typeBreakdown = tools.reduce((acc: any, tool) => {
      const type = tool.tool_type || 'custom'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})

    // Calculate complexity breakdown
    const complexityBreakdown = tools.reduce((acc: any, tool) => {
      const level = tool.complexity_level || 'beginner'
      acc[level] = (acc[level] || 0) + 1
      return acc
    }, {})

    return {
      total_tools: totalTools,
      active_tools: activeTools,
      featured_tools: featuredTools,
      average_rating: Number(averageRating.toFixed(2)),
      total_usage: totalUsage,
      categories_breakdown: (categoryData || []).map(cat => ({
        category_name: cat.name,
        tool_count: cat.ai_tools?.length || 0,
        average_rating: cat.ai_tools?.reduce((sum, t) => sum + (t.average_rating || 0), 0) / (cat.ai_tools?.length || 1) || 0,
        total_usage: cat.ai_tools?.reduce((sum, t) => sum + (t.usage_count || 0), 0) || 0
      })),
      type_breakdown: Object.entries(typeBreakdown).map(([tool_type, count]) => ({
        tool_type,
        count: count as number
      })),
      complexity_breakdown: Object.entries(complexityBreakdown).map(([level, count]) => ({
        level,
        count: count as number
      }))
    }
  } catch (error) {
    console.error('Error fetching tool stats:', error)
    return null
  }
}

/**
 * Get recommended tools for homepage/dashboard
 */
export async function getRecommendedToolsV2(limit: number = 3): Promise<AiToolSummary[]> {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('ai_tools')
      .select(`
        id,
        name,
        description,
        tool_type,
        complexity_level,
        status,
        is_featured,
        is_public,
        average_rating,
        usage_count,
        version,
        category:tool_categories(name)
      `)
      .eq('status', 'active')
      .eq('is_public', true)
      .eq('is_featured', true)
      .order('average_rating', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching recommended tools:', error)
      return []
    }

    return (data || []).map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description,
      category_name: tool.category?.name,
      tool_type: tool.tool_type,
      complexity_level: tool.complexity_level,
      status: tool.status,
      is_featured: tool.is_featured,
      is_public: tool.is_public,
      average_rating: tool.average_rating,
      usage_count: tool.usage_count,
      version: tool.version
    }))
  } catch (error) {
    console.error('Error fetching recommended tools:', error)
    return []
  }
}
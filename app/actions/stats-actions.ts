"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getCurrentSupabaseUser, isUserAdmin } from "@/lib/db-v2"

// Type definitions for dashboard stats
export interface DashboardStats {
  userCount: number
  assessmentCount: number
  pendingAssessments: number
  completedAssessments: number
  consultationCount: number
  pendingConsultations: number
  completedConsultations: number
  toolCount: number
  activeTools: number
  promptCount: number
  publicPrompts: number
  totalPageViews: number
  totalUsageSessions: number
}

export interface UserGrowthData {
  date: string
  newUsers: number
  totalUsers: number
}

export interface ActivityData {
  date: string
  assessments: number
  consultations: number
  toolUsage: number
}

export interface CategoryBreakdown {
  category: string
  count: number
  percentage: number
}

export interface ToolUsageData {
  toolName: string
  usageCount: number
  averageRating: number
  category: string
}

/**
 * Get comprehensive dashboard statistics (Admin only)
 */
export async function getDashboardStatsAction(): Promise<DashboardStats | null> {
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

    // Get user count
    const { count: userCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Get assessments count
    const { count: assessmentCount } = await supabase
      .from('assessments')
      .select('*', { count: 'exact', head: true })

    // Get pending assessments
    const { count: pendingAssessments } = await supabase
      .from('assessments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    // Get completed assessments  
    const { count: completedAssessments } = await supabase
      .from('assessments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    // Get consultations count
    const { count: consultationCount } = await supabase
      .from('consultations')
      .select('*', { count: 'exact', head: true })

    // Get pending consultations
    const { count: pendingConsultations } = await supabase
      .from('consultations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    // Get completed consultations
    const { count: completedConsultations } = await supabase
      .from('consultations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    // Get tools count
    const { count: toolCount } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact', head: true })

    // Get active tools
    const { count: activeTools } = await supabase
      .from('ai_tools')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Get prompts count
    const { count: promptCount } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })

    // Get public prompts
    const { count: publicPrompts } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
      .eq('is_public', true)

    return {
      userCount: userCount || 0,
      assessmentCount: assessmentCount || 0,
      pendingAssessments: pendingAssessments || 0,
      completedAssessments: completedAssessments || 0,
      consultationCount: consultationCount || 0,
      pendingConsultations: pendingConsultations || 0,
      completedConsultations: completedConsultations || 0,
      toolCount: toolCount || 0,
      activeTools: activeTools || 0,
      promptCount: promptCount || 0,
      publicPrompts: publicPrompts || 0,
      totalPageViews: 0, // Would need analytics table
      totalUsageSessions: 0 // Would need usage tracking table
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return null
  }
}

/**
 * Get user growth data over time (Admin only)
 */
export async function getUserGrowthDataAction(): Promise<UserGrowthData[]> {
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

    // Get user registration data for the last 30 days
    const { data, error } = await supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true })

    if (error) {
      console.error("Error fetching user growth data:", error)
      return []
    }

    // Group by date and calculate running totals
    const growthData: { [key: string]: number } = {}
    data?.forEach((user) => {
      const date = new Date(user.created_at).toISOString().split('T')[0]
      growthData[date] = (growthData[date] || 0) + 1
    })

    // Convert to array with running totals
    let runningTotal = 0
    return Object.entries(growthData).map(([date, newUsers]) => {
      runningTotal += newUsers
      return {
        date,
        newUsers,
        totalUsers: runningTotal
      }
    })
  } catch (error) {
    console.error("Error fetching user growth data:", error)
    return []
  }
}

/**
 * Get recent activity data (Admin only)
 */
export async function getRecentActivityDataAction(): Promise<ActivityData[]> {
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

    // For now, return mock data since we need to implement activity tracking
    const mockData: ActivityData[] = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      mockData.push({
        date: date.toISOString().split('T')[0],
        assessments: Math.floor(Math.random() * 10),
        consultations: Math.floor(Math.random() * 5),
        toolUsage: Math.floor(Math.random() * 20)
      })
    }

    return mockData
  } catch (error) {
    console.error("Error fetching recent activity data:", error)
    return []
  }
}

/**
 * Get assessment category breakdown (Admin only)
 */
export async function getAssessmentCategoryBreakdownAction(): Promise<CategoryBreakdown[]> {
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

    // Get assessment categories
    const { data, error } = await supabase
      .from('assessment_categories')
      .select(`
        name,
        assessments(count)
      `)

    if (error) {
      console.error("Error fetching assessment categories:", error)
      return []
    }

    // Calculate total for percentages
    const total = data?.reduce((sum, cat) => sum + (cat.assessments?.[0]?.count || 0), 0) || 0

    return data?.map(category => ({
      category: category.name,
      count: category.assessments?.[0]?.count || 0,
      percentage: total > 0 ? Math.round(((category.assessments?.[0]?.count || 0) / total) * 100) : 0
    })) || []
  } catch (error) {
    console.error("Error fetching assessment category breakdown:", error)
    return []
  }
}

/**
 * Get tool usage data (Admin only)
 */
export async function getToolUsageDataAction(): Promise<ToolUsageData[]> {
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

    // Get tool usage data
    const { data, error } = await supabase
      .from('ai_tools')
      .select(`
        name,
        usage_count,
        average_rating,
        tool_categories(name)
      `)
      .eq('status', 'active')
      .order('usage_count', { ascending: false })
      .limit(10)

    if (error) {
      console.error("Error fetching tool usage data:", error)
      return []
    }

    return data?.map(tool => ({
      toolName: tool.name,
      usageCount: tool.usage_count || 0,
      averageRating: tool.average_rating || 0,
      category: tool.tool_categories?.name || 'Uncategorized'
    })) || []
  } catch (error) {
    console.error("Error fetching tool usage data:", error)
    return []
  }
}
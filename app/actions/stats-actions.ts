"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getCurrentSupabaseUser } from "@/lib/db-v2"
import type { DashboardOverview } from "@/types/database-v2"

/**
 * Check if the user is authorized to view stats
 */
async function checkStatsAuthorization() {
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

  if (profile.role !== 'admin') {
    throw new Error("Admin access required to view statistics")
  }

  return { authorized: true, userId: user.id, role: profile.role }
}

/**
 * Get comprehensive dashboard overview stats
 */
export async function getDashboardStats(): Promise<DashboardOverview | null> {
  try {
    const { authorized } = await checkStatsAuthorization()
    const supabase = await createServerSupabaseClient()

    // Get all stats in parallel for better performance
    const [
      usersResult,
      assessmentsResult,
      consultationsResult,
      toolsResult,
      promptsResult,
      blogResult
    ] = await Promise.all([
      // User stats
      supabase.from('profiles').select('created_at').order('created_at', { ascending: false }),
      
      // Assessment stats
      supabase.from('assessments').select('status, overall_score, completed_at'),
      
      // Consultation stats
      supabase.from('consultations').select('status'),
      
      // Tool stats
      supabase.from('ai_tools').select('status, usage_count'),
      
      // Prompt stats
      supabase.from('prompts').select('is_public, usage_count'),
      
      // Blog stats
      supabase.from('blog_posts').select('status, view_count')
    ])

    // Process user stats
    const users = usersResult.data || []
    const thisMonth = new Date()
    thisMonth.setDate(1)
    thisMonth.setHours(0, 0, 0, 0)
    
    const newUsersThisMonth = users.filter(user => 
      new Date(user.created_at) >= thisMonth
    ).length

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const activeUsers = users.filter(user => 
      new Date(user.created_at) >= thirtyDaysAgo
    ).length

    // Process assessment stats
    const assessments = assessmentsResult.data || []
    const completedAssessments = assessments.filter(a => a.status === 'completed')
    const avgScore = completedAssessments.length > 0 
      ? completedAssessments.reduce((sum, a) => sum + (a.overall_score || 0), 0) / completedAssessments.length
      : 0
    const completionRate = assessments.length > 0 
      ? (completedAssessments.length / assessments.length) * 100
      : 0

    // Process consultation stats
    const consultations = consultationsResult.data || []
    const pendingConsultations = consultations.filter(c => c.status === 'pending').length
    const inProgressConsultations = consultations.filter(c => c.status === 'in_progress').length
    const completedConsultations = consultations.filter(c => c.status === 'completed').length

    // Process tool stats
    const tools = toolsResult.data || []
    const activeTools = tools.filter(t => t.status === 'active').length
    const totalToolUsage = tools.reduce((sum, t) => sum + (t.usage_count || 0), 0)

    // Process prompt stats
    const prompts = promptsResult.data || []
    const publicPrompts = prompts.filter(p => p.is_public).length
    const totalPromptUsage = prompts.reduce((sum, p) => sum + (p.usage_count || 0), 0)

    // Process blog stats
    const blogPosts = blogResult.data || []
    const publishedPosts = blogPosts.filter(b => b.status === 'published').length
    const totalViews = blogPosts.reduce((sum, b) => sum + (b.view_count || 0), 0)

    return {
      users: {
        total: users.length,
        new_this_month: newUsersThisMonth,
        active_users: activeUsers
      },
      assessments: {
        total: assessments.length,
        completed: completedAssessments.length,
        average_score: Math.round(avgScore * 10) / 10,
        completion_rate: Math.round(completionRate * 10) / 10
      },
      consultations: {
        total: consultations.length,
        pending: pendingConsultations,
        in_progress: inProgressConsultations,
        completed: completedConsultations
      },
      tools: {
        total: tools.length,
        active: activeTools,
        total_usage: totalToolUsage
      },
      prompts: {
        total: prompts.length,
        public: publicPrompts,
        total_usage: totalPromptUsage
      },
      blog: {
        total_posts: blogPosts.length,
        published: publishedPosts,
        total_views: totalViews
      }
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return null
  }
}

/**
 * Get user growth data for charts (last 30 days)
 */
export async function getUserGrowthData() {
  try {
    const { authorized } = await checkStatsAuthorization()
    const supabase = await createServerSupabaseClient()

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { data: users, error } = await supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', thirtyDaysAgo.toISOString())
      .order('created_at')

    if (error) {
      console.error("Error fetching user growth data:", error)
      return []
    }

    // Group by date
    const dailyCounts = new Map<string, number>()
    
    // Initialize all dates with 0
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      const dateStr = date.toISOString().split('T')[0]
      dailyCounts.set(dateStr, 0)
    }

    // Count actual registrations
    users?.forEach(user => {
      const dateStr = user.created_at.split('T')[0]
      const currentCount = dailyCounts.get(dateStr) || 0
      dailyCounts.set(dateStr, currentCount + 1)
    })

    // Convert to array format
    return Array.from(dailyCounts.entries()).map(([date, count]) => ({
      date,
      count
    }))
  } catch (error) {
    console.error("Error fetching user growth data:", error)
    return []
  }
}

/**
 * Get recent activity data for dashboard
 */
export async function getRecentActivityData() {
  try {
    const { authorized } = await checkStatsAuthorization()
    const supabase = await createServerSupabaseClient()

    const last7Days = new Date()
    last7Days.setDate(last7Days.getDate() - 7)
    const dateFilter = last7Days.toISOString()

    const [
      newUsersResult,
      newAssessmentsResult,
      newConsultationsResult,
      toolUsageResult
    ] = await Promise.all([
      supabase
        .from('profiles')
        .select('id')
        .gte('created_at', dateFilter),
      
      supabase
        .from('assessments')
        .select('id')
        .gte('created_at', dateFilter),
      
      supabase
        .from('consultations')
        .select('id')
        .gte('created_at', dateFilter),
      
      supabase
        .from('user_tool_usage')
        .select('id')
        .gte('created_at', dateFilter)
    ])

    return [
      { category: 'New Users', count: newUsersResult.data?.length || 0 },
      { category: 'Assessments', count: newAssessmentsResult.data?.length || 0 },
      { category: 'Consultations', count: newConsultationsResult.data?.length || 0 },
      { category: 'Tool Usage', count: toolUsageResult.data?.length || 0 }
    ]
  } catch (error) {
    console.error("Error fetching recent activity data:", error)
    return [
      { category: 'New Users', count: 0 },
      { category: 'Assessments', count: 0 },
      { category: 'Consultations', count: 0 },
      { category: 'Tool Usage', count: 0 }
    ]
  }
}

/**
 * Get assessment category breakdown
 */
export async function getAssessmentCategoryBreakdown() {
  try {
    const { authorized } = await checkStatsAuthorization()
    const supabase = await createServerSupabaseClient()

    const { data: results, error } = await supabase
      .from('assessment_results')
      .select(`
        category_score,
        assessment_categories(name)
      `)

    if (error) {
      console.error("Error fetching assessment category breakdown:", error)
      return []
    }

    // Group by category and calculate stats
    const categoryStats = new Map<string, { totalScore: number, count: number }>()
    
    results?.forEach(result => {
      const categoryName = result.assessment_categories?.name
      if (categoryName) {
        const current = categoryStats.get(categoryName) || { totalScore: 0, count: 0 }
        current.totalScore += result.category_score
        current.count += 1
        categoryStats.set(categoryName, current)
      }
    })

    const totalAssessments = Array.from(categoryStats.values()).reduce((sum, stat) => sum + stat.count, 0)

    return Array.from(categoryStats.entries()).map(([name, stats]) => ({
      name,
      count: stats.count,
      percentage: totalAssessments > 0 ? Math.round((stats.count / totalAssessments) * 100) : 0,
      average_score: Math.round((stats.totalScore / stats.count) * 10) / 10
    }))
  } catch (error) {
    console.error("Error fetching assessment category breakdown:", error)
    return []
  }
}

/**
 * Get tool usage data
 */
export async function getToolUsageData() {
  try {
    const { authorized } = await checkStatsAuthorization()
    const supabase = await createServerSupabaseClient()

    const { data: tools, error } = await supabase
      .from('ai_tools')
      .select('name, usage_count')
      .eq('status', 'active')
      .eq('is_public', true)
      .order('usage_count', { ascending: false })
      .limit(10)

    if (error) {
      console.error("Error fetching tool usage data:", error)
      return []
    }

    return tools?.map(tool => ({
      name: tool.name,
      count: tool.usage_count || 0
    })) || []
  } catch (error) {
    console.error("Error fetching tool usage data:", error)
    return []
  }
}

/**
 * Get consultation analytics
 */
export async function getConsultationAnalytics() {
  try {
    const { authorized } = await checkStatsAuthorization()
    const supabase = await createServerSupabaseClient()

    const { data: consultations, error } = await supabase
      .from('consultations')
      .select('status, consultation_type, urgency, created_at, completed_at')

    if (error) {
      console.error("Error fetching consultation analytics:", error)
      return null
    }

    const total = consultations?.length || 0
    const completed = consultations?.filter(c => c.status === 'completed').length || 0
    const pending = consultations?.filter(c => c.status === 'pending').length || 0
    const inProgress = consultations?.filter(c => c.status === 'in_progress').length || 0

    // Calculate average resolution time
    const completedConsultations = consultations?.filter(c => c.status === 'completed' && c.completed_at) || []
    const avgResolutionTime = completedConsultations.length > 0 
      ? completedConsultations.reduce((acc, c) => {
          const created = new Date(c.created_at)
          const completed = new Date(c.completed_at!)
          return acc + (completed.getTime() - created.getTime())
        }, 0) / completedConsultations.length / (1000 * 60 * 60 * 24) // Convert to days
      : 0

    // Type breakdown
    const typeBreakdown = ['strategy', 'implementation', 'assessment', 'training', 'other'].map(type => ({
      type,
      count: consultations?.filter(c => c.consultation_type === type).length || 0
    }))

    // Urgency breakdown
    const urgencyBreakdown = ['critical', 'high', 'medium', 'low'].map(urgency => ({
      urgency,
      count: consultations?.filter(c => c.urgency === urgency).length || 0
    }))

    return {
      total,
      completed,
      pending,
      in_progress: inProgress,
      completion_rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      average_resolution_days: Math.round(avgResolutionTime * 10) / 10,
      type_breakdown: typeBreakdown,
      urgency_breakdown: urgencyBreakdown
    }
  } catch (error) {
    console.error("Error fetching consultation analytics:", error)
    return null
  }
}

/**
 * Get prompt library analytics
 */
export async function getPromptAnalytics() {
  try {
    const { authorized } = await checkStatsAuthorization()
    const supabase = await createServerSupabaseClient()

    const { data: prompts, error } = await supabase
      .from('prompts')
      .select(`
        is_public, 
        is_featured, 
        usage_count, 
        average_rating, 
        complexity_level,
        prompt_categories(name)
      `)
      .eq('status', 'active')

    if (error) {
      console.error("Error fetching prompt analytics:", error)
      return null
    }

    const total = prompts?.length || 0
    const publicPrompts = prompts?.filter(p => p.is_public).length || 0
    const featuredPrompts = prompts?.filter(p => p.is_featured).length || 0
    const totalUsage = prompts?.reduce((sum, p) => sum + (p.usage_count || 0), 0) || 0
    const avgRating = prompts?.filter(p => p.average_rating > 0).reduce((sum, p, _, arr) => 
      sum + (p.average_rating / arr.length), 0) || 0

    // Category breakdown
    const categoryStats = new Map<string, number>()
    prompts?.forEach(prompt => {
      const categoryName = prompt.prompt_categories?.name || 'Uncategorized'
      categoryStats.set(categoryName, (categoryStats.get(categoryName) || 0) + 1)
    })

    const categoryBreakdown = Array.from(categoryStats.entries()).map(([name, count]) => ({
      category: name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }))

    // Complexity breakdown
    const complexityStats = new Map<string, number>()
    prompts?.forEach(prompt => {
      const level = prompt.complexity_level || 'unknown'
      complexityStats.set(level, (complexityStats.get(level) || 0) + 1)
    })

    const complexityBreakdown = Array.from(complexityStats.entries()).map(([level, count]) => ({
      level,
      count
    }))

    return {
      total,
      public: publicPrompts,
      featured: featuredPrompts,
      total_usage: totalUsage,
      average_rating: Math.round(avgRating * 10) / 10,
      category_breakdown: categoryBreakdown,
      complexity_breakdown: complexityBreakdown
    }
  } catch (error) {
    console.error("Error fetching prompt analytics:", error)
    return null
  }
}

/**
 * Get user engagement metrics
 */
export async function getUserEngagementMetrics() {
  try {
    const { authorized } = await checkStatsAuthorization()
    const supabase = await createServerSupabaseClient()

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [
      assessmentActivity,
      consultationActivity,
      toolActivity,
      promptActivity
    ] = await Promise.all([
      supabase
        .from('assessments')
        .select('user_id')
        .gte('created_at', thirtyDaysAgo.toISOString()),
      
      supabase
        .from('consultations')
        .select('user_id')
        .gte('created_at', thirtyDaysAgo.toISOString()),
      
      supabase
        .from('user_tool_usage')
        .select('user_id')
        .gte('created_at', thirtyDaysAgo.toISOString()),
      
      supabase
        .from('prompt_collection_items')
        .select('prompt_collection_items.user_prompt_collections(user_id)')
        .gte('added_at', thirtyDaysAgo.toISOString())
    ])

    // Calculate unique active users
    const activeUserIds = new Set<string>()
    
    assessmentActivity.data?.forEach(a => activeUserIds.add(a.user_id))
    consultationActivity.data?.forEach(c => activeUserIds.add(c.user_id))
    toolActivity.data?.forEach(t => activeUserIds.add(t.user_id))

    const { data: totalUsers } = await supabase
      .from('profiles')
      .select('user_id')

    const totalUserCount = totalUsers?.length || 0
    const activeUserCount = activeUserIds.size
    const engagementRate = totalUserCount > 0 ? Math.round((activeUserCount / totalUserCount) * 100) : 0

    return {
      total_users: totalUserCount,
      active_users_30d: activeUserCount,
      engagement_rate: engagementRate,
      assessment_users: new Set(assessmentActivity.data?.map(a => a.user_id) || []).size,
      consultation_users: new Set(consultationActivity.data?.map(c => c.user_id) || []).size,
      tool_users: new Set(toolActivity.data?.map(t => t.user_id) || []).size
    }
  } catch (error) {
    console.error("Error fetching user engagement metrics:", error)
    return null
  }
}

// Export aliases for backward compatibility
export const getDashboardStatsAction = getDashboardStats
export const getUserGrowthDataAction = getUserGrowthData
export const getRecentActivityDataAction = getRecentActivityData
export const getAssessmentCategoryBreakdownAction = getAssessmentCategoryBreakdown
export const getToolUsageDataAction = getToolUsageData
"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { checkUserPermission } from "@/lib/db-permissions"
import { 
  getAdminDashboardStats,
  getUserGrowthData,
  getRecentActivityData,
  getAssessmentCategoryBreakdown,
  getToolUsageData
} from "@/lib/db-stats"

// Helper function to get current user
async function getCurrentUser() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new Error("Not authenticated")
  }
  
  return user
}

/**
 * Get overall dashboard statistics
 */
export async function getDashboardStatsAction() {
  try {
    // Check authorization
    const user = await getCurrentUser()
    
    // Check permission
    const hasPermission = await checkUserPermission(
      user.id,
      "view:analytics"
    )
    
    if (!hasPermission) {
      throw new Error("Not authorized to view analytics")
    }
    
    return await getAdminDashboardStats()
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return null
  }
}

/**
 * Get user growth data (for charts)
 */
export async function getUserGrowthDataAction() {
  try {
    // Check authorization
    const user = await getCurrentUser()
    
    // Check permission
    const hasPermission = await checkUserPermission(
      user.id,
      "view:analytics"
    )
    
    if (!hasPermission) {
      throw new Error("Not authorized to view analytics")
    }
    
    return await getUserGrowthData()
  } catch (error) {
    console.error("Error fetching user growth data:", error)
    // Return mock data if there's an error
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        count: Math.floor(Math.random() * 5)
      };
    });
  }
}

/**
 * Get recent activity data
 */
export async function getRecentActivityDataAction() {
  try {
    // Check authorization
    const user = await getCurrentUser()
    
    // Check permission
    const hasPermission = await checkUserPermission(
      user.id,
      "view:analytics"
    )
    
    if (!hasPermission) {
      throw new Error("Not authorized to view analytics")
    }
    
    return await getRecentActivityData()
  } catch (error) {
    console.error("Error fetching recent activity data:", error)
    // Return mock data if there's an error
    return [
      { category: 'New Users', count: 12 },
      { category: 'Assessments', count: 25 },
      { category: 'Consultations', count: 18 },
      { category: 'Blog Views', count: 45 }
    ];
  }
}

/**
 * Get assessment category breakdown
 */
export async function getAssessmentCategoryBreakdownAction() {
  try {
    // Check authorization
    const user = await getCurrentUser()
    
    // Check permission
    const hasPermission = await checkUserPermission(
      user.id,
      "view:analytics"
    )
    
    if (!hasPermission) {
      throw new Error("Not authorized to view analytics")
    }
    
    return await getAssessmentCategoryBreakdown()
  } catch (error) {
    console.error("Error fetching assessment category breakdown:", error)
    // Return mock data if there's an error
    return [
      { name: 'Business Strategy', count: 35, percentage: 45 },
      { name: 'AI Implementation', count: 20, percentage: 25 },
      { name: 'Data Architecture', count: 15, percentage: 20 },
      { name: 'Other', count: 8, percentage: 10 }
    ];
  }
}

/**
 * Get tool usage data
 */
export async function getToolUsageDataAction() {
  try {
    // Check authorization
    const user = await getCurrentUser()
    
    // Check permission
    const hasPermission = await checkUserPermission(
      user.id,
      "view:analytics"
    )
    
    if (!hasPermission) {
      throw new Error("Not authorized to view analytics")
    }
    
    return await getToolUsageData()
  } catch (error) {
    console.error("Error fetching tool usage data:", error)
    // Return mock data if there's an error
    return [
      { name: 'Agent Builder', count: 24 },
      { name: 'DataLens', count: 18 },
      { name: 'Strategy Analyzer', count: 15 },
      { name: 'n8n Integration', count: 12 },
      { name: 'Canvas Designer', count: 10 }
    ];
  }
}
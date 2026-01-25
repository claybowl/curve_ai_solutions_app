"use server"

/**
 * Dashboard Server Actions
 * 
 * Data layer for the user dashboard. All functions return standardized
 * { success: boolean, data?: T, error?: string } format.
 * 
 * Handles cases where user has no data (new users) gracefully by returning
 * empty arrays or default values instead of errors.
 */

import { getCurrentUserServer } from "@/lib/supabase-server"
import { sql } from "@/lib/db"

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

/** Dashboard overview statistics */
interface DashboardOverview {
  daysSinceSignup: number
  assessmentsCompleted: number
  toolsExplored: number
  subscriptionStatus: string
  firstName: string | null
  lastName: string | null
}

/** Assessment data with scores and history */
interface UserAssessmentData {
  latestAssessment: {
    id: string
    title: string | null
    overallScore: number | null
    completedAt: string | null
    status: string
  } | null
  categoryScores: Array<{
    categoryId: string
    categoryName: string
    score: number
  }>
  assessmentHistory: Array<{
    id: string
    title: string | null
    status: string
    overallScore: number | null
    createdAt: string
  }>
}

/** Featured AI tool */
interface FeaturedTool {
  id: string
  name: string
  description: string | null
  categoryName: string | null
  complexityLevel: string | null
  averageRating: number
  usageCount: number
}

/** Recent tool usage entry */
interface RecentToolUsage {
  id: string
  toolId: string
  toolName: string
  usedAt: string
  sessionDuration: number | null
  satisfactionRating: number | null
}

/** Featured prompt */
interface FeaturedPrompt {
  id: string
  title: string
  description: string | null
  categoryName: string | null
  complexityLevel: string | null
  usageCount: number
  averageRating: number
}

/** User prompt collection */
interface UserCollection {
  id: string
  name: string
  description: string | null
  promptCount: number
  createdAt: string
}

/** Active consultation */
interface ActiveConsultation {
  id: string
  subject: string
  consultationType: string | null
  status: string
  urgency: string
  createdAt: string
  scheduledAt: string | null
}

/** Activity timeline event */
interface ActivityEvent {
  id: string
  type: "assessment" | "tool" | "consultation"
  title: string
  description: string | null
  createdAt: string
}

/** User notification */
interface UserNotification {
  id: string
  title: string
  message: string
  notificationType: string | null
  isRead: boolean
  relatedEntityType: string | null
  actionUrl: string | null
  createdAt: string
}

/** Standard response type */
interface ActionResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// =============================================================================
// SERVER ACTIONS
// =============================================================================

/**
 * Get dashboard overview statistics
 * 
 * Aggregates key metrics for the dashboard header:
 * - Days since signup (from profiles.created_at)
 * - Completed assessments count
 * - Distinct tools explored count
 * - Current subscription status
 * 
 * @returns Dashboard overview data or error
 */
export async function getDashboardOverview(): Promise<ActionResponse<DashboardOverview>> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const profileResult = await sql.query(
      `SELECT 
        first_name,
        last_name,
        subscription_status,
        created_at
      FROM profiles 
      WHERE user_id = $1`,
      [user.id]
    )

    const profile = profileResult?.[0]
    
    let daysSinceSignup = 0
    if (profile?.created_at) {
      const signupDate = new Date(profile.created_at)
      const now = new Date()
      daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24))
    }

    const assessmentsResult = await sql.query(
      `SELECT COUNT(*) as count 
      FROM assessments 
      WHERE user_id = $1 AND status = 'completed'`,
      [user.id]
    )
    const assessmentsCompleted = parseInt(assessmentsResult?.[0]?.count || "0", 10)

    const toolsResult = await sql.query(
      `SELECT COUNT(DISTINCT tool_id) as count 
      FROM user_tool_usage 
      WHERE user_id = $1`,
      [user.id]
    )
    const toolsExplored = parseInt(toolsResult?.[0]?.count || "0", 10)

    return {
      success: true,
      data: {
        daysSinceSignup,
        assessmentsCompleted,
        toolsExplored,
        subscriptionStatus: profile?.subscription_status || "free",
        firstName: profile?.first_name || null,
        lastName: profile?.last_name || null
      }
    }
  } catch (error) {
    console.error("Error in getDashboardOverview:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch dashboard overview" 
    }
  }
}

/**
 * Get user assessment data
 * 
 * Retrieves:
 * - Latest completed assessment with overall score
 * - Category scores from assessment_results
 * - Assessment history list
 * 
 * @returns Assessment data or error
 */
export async function getUserAssessmentData(): Promise<ActionResponse<UserAssessmentData>> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const latestResult = await sql.query(
      `SELECT 
        id,
        title,
        overall_score,
        completed_at,
        status
      FROM assessments 
      WHERE user_id = $1 AND status = 'completed'
      ORDER BY completed_at DESC NULLS LAST
      LIMIT 1`,
      [user.id]
    )

    const latestAssessment = latestResult?.[0] ? {
      id: latestResult[0].id,
      title: latestResult[0].title,
      overallScore: latestResult[0].overall_score ? parseFloat(latestResult[0].overall_score) : null,
      completedAt: latestResult[0].completed_at,
      status: latestResult[0].status
    } : null

    let categoryScores: Array<{ categoryId: string; categoryName: string; score: number }> = []
    if (latestAssessment) {
      const categoryResult = await sql.query(
        `SELECT 
          ar.category_id,
          ac.name as category_name,
          ar.category_score
        FROM assessment_results ar
        JOIN assessment_categories ac ON ar.category_id = ac.id
        WHERE ar.assessment_id = $1
        ORDER BY ac.sort_order`,
        [latestAssessment.id]
      )

      categoryScores = (categoryResult || []).map((row: any) => ({
        categoryId: row.category_id,
        categoryName: row.category_name,
        score: parseFloat(row.category_score)
      }))
    }

    const historyResult = await sql.query(
      `SELECT 
        id,
        title,
        status,
        overall_score,
        created_at
      FROM assessments 
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 10`,
      [user.id]
    )

    const assessmentHistory = (historyResult || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      status: row.status,
      overallScore: row.overall_score ? parseFloat(row.overall_score) : null,
      createdAt: row.created_at
    }))

    return {
      success: true,
      data: {
        latestAssessment,
        categoryScores,
        assessmentHistory
      }
    }
  } catch (error) {
    console.error("Error in getUserAssessmentData:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch assessment data" 
    }
  }
}

/**
 * Get featured AI tools
 * 
 * Returns list of featured tools with category info and ratings.
 * 
 * @returns Featured tools list or error
 */
export async function getFeaturedTools(): Promise<ActionResponse<FeaturedTool[]>> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const result = await sql.query(
      `SELECT 
        t.id,
        t.name,
        t.description,
        tc.name as category_name,
        t.complexity_level,
        t.average_rating,
        t.usage_count
      FROM ai_tools t
      LEFT JOIN tool_categories tc ON t.category_id = tc.id
      WHERE t.is_featured = true AND t.status = 'active' AND t.is_public = true
      ORDER BY t.average_rating DESC, t.usage_count DESC
      LIMIT 6`,
      []
    )

    const tools: FeaturedTool[] = (result || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      categoryName: row.category_name,
      complexityLevel: row.complexity_level,
      averageRating: parseFloat(row.average_rating || "0"),
      usageCount: parseInt(row.usage_count || "0", 10)
    }))

    return { success: true, data: tools }
  } catch (error) {
    console.error("Error in getFeaturedTools:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch featured tools" 
    }
  }
}

/**
 * Get user's recent tool usage
 * 
 * Returns the last 5 tools the user has interacted with.
 * 
 * @returns Recent tool usage list or error
 */
export async function getRecentToolUsage(): Promise<ActionResponse<RecentToolUsage[]>> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const result = await sql.query(
      `SELECT 
        utu.id,
        utu.tool_id,
        t.name as tool_name,
        utu.created_at as used_at,
        utu.session_duration,
        utu.satisfaction_rating
      FROM user_tool_usage utu
      JOIN ai_tools t ON utu.tool_id = t.id
      WHERE utu.user_id = $1
      ORDER BY utu.created_at DESC
      LIMIT 5`,
      [user.id]
    )

    const usage: RecentToolUsage[] = (result || []).map((row: any) => ({
      id: row.id,
      toolId: row.tool_id,
      toolName: row.tool_name,
      usedAt: row.used_at,
      sessionDuration: row.session_duration ? parseInt(row.session_duration, 10) : null,
      satisfactionRating: row.satisfaction_rating ? parseInt(row.satisfaction_rating, 10) : null
    }))

    return { success: true, data: usage }
  } catch (error) {
    console.error("Error in getRecentToolUsage:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch recent tool usage" 
    }
  }
}

/**
 * Get featured prompts from library
 * 
 * Returns 3 featured prompts for the dashboard.
 * 
 * @returns Featured prompts list or error
 */
export async function getFeaturedPrompts(): Promise<ActionResponse<FeaturedPrompt[]>> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const result = await sql.query(
      `SELECT 
        p.id,
        p.title,
        p.description,
        pc.name as category_name,
        p.complexity_level,
        p.usage_count,
        p.average_rating
      FROM prompts p
      LEFT JOIN prompt_categories pc ON p.category_id = pc.id
      WHERE p.is_featured = true AND p.status = 'active' AND p.is_public = true
      ORDER BY p.average_rating DESC, p.usage_count DESC
      LIMIT 3`,
      []
    )

    const prompts: FeaturedPrompt[] = (result || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      categoryName: row.category_name,
      complexityLevel: row.complexity_level,
      usageCount: parseInt(row.usage_count || "0", 10),
      averageRating: parseFloat(row.average_rating || "0")
    }))

    return { success: true, data: prompts }
  } catch (error) {
    console.error("Error in getFeaturedPrompts:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch featured prompts" 
    }
  }
}

/**
 * Get user's saved prompt collections
 * 
 * Returns user's collections with prompt counts.
 * 
 * @returns User collections list or error
 */
export async function getUserCollections(): Promise<ActionResponse<UserCollection[]>> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const result = await sql.query(
      `SELECT 
        upc.id,
        upc.name,
        upc.description,
        upc.created_at,
        COUNT(pci.id) as prompt_count
      FROM user_prompt_collections upc
      LEFT JOIN prompt_collection_items pci ON upc.id = pci.collection_id
      WHERE upc.user_id = $1
      GROUP BY upc.id, upc.name, upc.description, upc.created_at
      ORDER BY upc.created_at DESC`,
      [user.id]
    )

    const collections: UserCollection[] = (result || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      promptCount: parseInt(row.prompt_count || "0", 10),
      createdAt: row.created_at
    }))

    return { success: true, data: collections }
  } catch (error) {
    console.error("Error in getUserCollections:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch user collections" 
    }
  }
}

/**
 * Get user's active consultations
 * 
 * Returns consultations that are not completed or cancelled.
 * 
 * @returns Active consultations list or error
 */
export async function getActiveConsultations(): Promise<ActionResponse<ActiveConsultation[]>> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const result = await sql.query(
      `SELECT 
        id,
        subject,
        consultation_type,
        status,
        urgency,
        created_at,
        scheduled_at
      FROM consultations 
      WHERE user_id = $1 AND status NOT IN ('completed', 'cancelled')
      ORDER BY 
        CASE urgency 
          WHEN 'critical' THEN 1 
          WHEN 'high' THEN 2 
          WHEN 'medium' THEN 3 
          WHEN 'low' THEN 4 
        END,
        created_at DESC`,
      [user.id]
    )

    const consultations: ActiveConsultation[] = (result || []).map((row: any) => ({
      id: row.id,
      subject: row.subject,
      consultationType: row.consultation_type,
      status: row.status,
      urgency: row.urgency,
      createdAt: row.created_at,
      scheduledAt: row.scheduled_at
    }))

    return { success: true, data: consultations }
  } catch (error) {
    console.error("Error in getActiveConsultations:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch active consultations" 
    }
  }
}

/**
 * Get recent activity timeline
 * 
 * Aggregates recent activity from:
 * - Assessments (type='assessment')
 * - Tool usage (type='tool')
 * - Consultations (type='consultation')
 * 
 * Sorted by created_at DESC, limited to 10 events.
 * 
 * @returns Activity timeline or error
 */
export async function getRecentActivity(): Promise<ActionResponse<ActivityEvent[]>> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const result = await sql.query(
      `SELECT * FROM (
        -- Assessments
        SELECT 
          id,
          'assessment' as type,
          COALESCE(title, 'AI Readiness Assessment') as title,
          CASE status 
            WHEN 'completed' THEN 'Completed assessment'
            WHEN 'in_progress' THEN 'Started assessment'
            ELSE 'Assessment ' || status
          END as description,
          created_at
        FROM assessments 
        WHERE user_id = $1
        
        UNION ALL
        
        -- Tool usage
        SELECT 
          utu.id,
          'tool' as type,
          t.name as title,
          'Used tool' as description,
          utu.created_at
        FROM user_tool_usage utu
        JOIN ai_tools t ON utu.tool_id = t.id
        WHERE utu.user_id = $1
        
        UNION ALL
        
        -- Consultations
        SELECT 
          id,
          'consultation' as type,
          subject as title,
          CASE status 
            WHEN 'pending' THEN 'Requested consultation'
            WHEN 'scheduled' THEN 'Consultation scheduled'
            WHEN 'in_progress' THEN 'Consultation in progress'
            WHEN 'completed' THEN 'Consultation completed'
            ELSE 'Consultation ' || status
          END as description,
          created_at
        FROM consultations 
        WHERE user_id = $1
      ) activity
      ORDER BY created_at DESC
      LIMIT 10`,
      [user.id]
    )

    const events: ActivityEvent[] = (result || []).map((row: any) => ({
      id: row.id,
      type: row.type as "assessment" | "tool" | "consultation",
      title: row.title,
      description: row.description,
      createdAt: row.created_at
    }))

    return { success: true, data: events }
  } catch (error) {
    console.error("Error in getRecentActivity:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch recent activity" 
    }
  }
}

/**
 * Get unread notifications for user
 * 
 * Returns notifications ordered by creation date, unread first.
 * 
 * @returns Notifications list or error
 */
export async function getNotifications(): Promise<ActionResponse<UserNotification[]>> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const result = await sql.query(
      `SELECT 
        id,
        title,
        message,
        notification_type,
        is_read,
        related_entity_type,
        action_url,
        created_at
      FROM user_notifications 
      WHERE user_id = $1
      ORDER BY is_read ASC, created_at DESC
      LIMIT 20`,
      [user.id]
    )

    const notifications: UserNotification[] = (result || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      message: row.message,
      notificationType: row.notification_type,
      isRead: row.is_read,
      relatedEntityType: row.related_entity_type,
      actionUrl: row.action_url,
      createdAt: row.created_at
    }))

    return { success: true, data: notifications }
  } catch (error) {
    console.error("Error in getNotifications:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to fetch notifications" 
    }
  }
}

"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getCurrentUserServer, isUserAdmin } from "@/lib/supabase-server"
import { sql } from "@/lib/db"
import type { ConsultationSessionSummary, CreateSummaryInput } from "@/types/consultations"

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

const createSummarySchema = z.object({
  consultation_id: z.string().uuid(),
  summary: z.string().optional(),
  notes: z.string().optional(),
  action_items: z.array(z.object({
    item: z.string(),
    completed: z.boolean().optional(),
    due_date: z.string().optional(),
  })).optional(),
  key_decisions: z.array(z.string()).optional(),
  follow_up_tasks: z.array(z.string()).optional(),
  resources_shared: z.array(z.string()).optional(),
})

const updateSummarySchema = z.object({
  summary_id: z.string().uuid(),
  summary: z.string().optional(),
  notes: z.string().optional(),
  action_items: z.array(z.object({
    item: z.string(),
    completed: z.boolean().optional(),
    due_date: z.string().optional(),
  })).optional(),
  key_decisions: z.array(z.string()).optional(),
  follow_up_tasks: z.array(z.string()).optional(),
  resources_shared: z.array(z.string()).optional(),
  status: z.enum(["draft", "final", "archived"]).optional(),
})

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Verify user has access to consultation (participant or admin)
 */
async function verifyConsultationAccess(
  consultationId: string,
  userId: string
): Promise<{ authorized: boolean; isConsultant: boolean }> {
  const admin = await isUserAdmin()
  if (admin) {
    return { authorized: true, isConsultant: true }
  }

  const result = await sql.query(
    `SELECT user_id, assigned_consultant_id 
     FROM consultations 
     WHERE id = $1`,
    [consultationId]
  )

  if (result.rows.length === 0) {
    return { authorized: false, isConsultant: false }
  }

  const consultation = result.rows[0]
  const isConsultant = consultation.assigned_consultant_id === userId
  const isClient = consultation.user_id === userId

  return { 
    authorized: isConsultant || isClient, 
    isConsultant 
  }
}

// =============================================================================
// SUMMARY CRUD
// =============================================================================

/**
 * Create a new consultation summary
 */
export async function createSummary(
  input: CreateSummaryInput
): Promise<{
  success: boolean
  summary?: ConsultationSessionSummary
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const validated = createSummarySchema.parse(input)

    // Verify access - only consultants can create summaries
    const access = await verifyConsultationAccess(validated.consultation_id, user.id)
    if (!access.authorized) {
      return { success: false, error: "Not authorized to access this consultation" }
    }
    if (!access.isConsultant) {
      return { success: false, error: "Only consultants can create summaries" }
    }

    // Check if summary already exists
    const existingResult = await sql.query(
      `SELECT id FROM consultation_summaries 
       WHERE consultation_id = $1 AND status != 'archived'`,
      [validated.consultation_id]
    )

    if (existingResult.rows.length > 0) {
      return { 
        success: false, 
        error: "A summary already exists for this consultation. Edit or archive it first." 
      }
    }

    // Create summary
    const insertResult = await sql.query(
      `INSERT INTO consultation_summaries (
        consultation_id,
        created_by,
        summary,
        notes,
        action_items,
        key_decisions,
        follow_up_tasks,
        resources_shared,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'draft')
      RETURNING *`,
      [
        validated.consultation_id,
        user.id,
        validated.summary || null,
        validated.notes || null,
        JSON.stringify(validated.action_items || []),
        JSON.stringify(validated.key_decisions || []),
        JSON.stringify(validated.follow_up_tasks || []),
        JSON.stringify(validated.resources_shared || []),
      ]
    )

    revalidatePath(`/consultation/room/${validated.consultation_id}`)

    return {
      success: true,
      summary: insertResult.rows[0] as ConsultationSessionSummary,
    }
  } catch (error) {
    console.error("Error creating summary:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create summary",
    }
  }
}

/**
 * Get summary for a consultation
 */
export async function getSummary(
  consultationId: string
): Promise<{
  success: boolean
  summary?: ConsultationSessionSummary
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Verify access
    const access = await verifyConsultationAccess(consultationId, user.id)
    if (!access.authorized) {
      return { success: false, error: "Not authorized to access this consultation" }
    }

    const result = await sql.query(
      `SELECT * FROM consultation_summaries 
       WHERE consultation_id = $1 AND status != 'archived'
       ORDER BY created_at DESC
       LIMIT 1`,
      [consultationId]
    )

    if (result.rows.length === 0) {
      return { success: true, summary: undefined }
    }

    return {
      success: true,
      summary: result.rows[0] as ConsultationSessionSummary,
    }
  } catch (error) {
    console.error("Error getting summary:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get summary",
    }
  }
}

/**
 * Update a consultation summary
 */
export async function updateSummary(
  input: z.infer<typeof updateSummarySchema>
): Promise<{
  success: boolean
  summary?: ConsultationSessionSummary
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const validated = updateSummarySchema.parse(input)

    // Get existing summary
    const existingResult = await sql.query(
      `SELECT s.*, c.assigned_consultant_id 
       FROM consultation_summaries s
       JOIN consultations c ON s.consultation_id = c.id
       WHERE s.id = $1`,
      [validated.summary_id]
    )

    if (existingResult.rows.length === 0) {
      return { success: false, error: "Summary not found" }
    }

    const existing = existingResult.rows[0]

    // Only creator or consultant can update
    const admin = await isUserAdmin()
    if (!admin && existing.created_by !== user.id && existing.assigned_consultant_id !== user.id) {
      return { success: false, error: "Not authorized to update this summary" }
    }

    // Build update query
    const updates: string[] = []
    const values: unknown[] = []
    let paramIndex = 1

    if (validated.summary !== undefined) {
      updates.push(`summary = $${paramIndex++}`)
      values.push(validated.summary)
    }
    if (validated.notes !== undefined) {
      updates.push(`notes = $${paramIndex++}`)
      values.push(validated.notes)
    }
    if (validated.action_items !== undefined) {
      updates.push(`action_items = $${paramIndex++}`)
      values.push(JSON.stringify(validated.action_items))
    }
    if (validated.key_decisions !== undefined) {
      updates.push(`key_decisions = $${paramIndex++}`)
      values.push(JSON.stringify(validated.key_decisions))
    }
    if (validated.follow_up_tasks !== undefined) {
      updates.push(`follow_up_tasks = $${paramIndex++}`)
      values.push(JSON.stringify(validated.follow_up_tasks))
    }
    if (validated.resources_shared !== undefined) {
      updates.push(`resources_shared = $${paramIndex++}`)
      values.push(JSON.stringify(validated.resources_shared))
    }
    if (validated.status !== undefined) {
      updates.push(`status = $${paramIndex++}`)
      values.push(validated.status)
    }

    updates.push(`updated_at = NOW()`)
    values.push(validated.summary_id)

    const updateResult = await sql.query(
      `UPDATE consultation_summaries 
       SET ${updates.join(", ")}
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    )

    revalidatePath(`/consultation/room/${existing.consultation_id}`)

    return {
      success: true,
      summary: updateResult.rows[0] as ConsultationSessionSummary,
    }
  } catch (error) {
    console.error("Error updating summary:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update summary",
    }
  }
}

/**
 * Toggle action item completion status
 */
export async function toggleActionItem(
  summaryId: string,
  itemIndex: number
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Get existing summary
    const existingResult = await sql.query(
      `SELECT s.*, c.user_id, c.assigned_consultant_id 
       FROM consultation_summaries s
       JOIN consultations c ON s.consultation_id = c.id
       WHERE s.id = $1`,
      [summaryId]
    )

    if (existingResult.rows.length === 0) {
      return { success: false, error: "Summary not found" }
    }

    const existing = existingResult.rows[0]

    // Verify access
    const isParticipant = 
      existing.user_id === user.id || 
      existing.assigned_consultant_id === user.id
    
    if (!isParticipant) {
      return { success: false, error: "Not authorized" }
    }

    // Parse and update action items
    const actionItems = existing.action_items || []
    if (itemIndex < 0 || itemIndex >= actionItems.length) {
      return { success: false, error: "Invalid action item index" }
    }

    actionItems[itemIndex].completed = !actionItems[itemIndex].completed

    await sql.query(
      `UPDATE consultation_summaries 
       SET action_items = $1, updated_at = NOW()
       WHERE id = $2`,
      [JSON.stringify(actionItems), summaryId]
    )

    revalidatePath(`/consultation/room/${existing.consultation_id}`)

    return { success: true }
  } catch (error) {
    console.error("Error toggling action item:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle action item",
    }
  }
}

/**
 * Archive a summary
 */
export async function archiveSummary(
  summaryId: string
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Get existing summary
    const existingResult = await sql.query(
      `SELECT s.*, c.assigned_consultant_id 
       FROM consultation_summaries s
       JOIN consultations c ON s.consultation_id = c.id
       WHERE s.id = $1`,
      [summaryId]
    )

    if (existingResult.rows.length === 0) {
      return { success: false, error: "Summary not found" }
    }

    const existing = existingResult.rows[0]

    // Only consultant can archive
    const admin = await isUserAdmin()
    if (!admin && existing.assigned_consultant_id !== user.id) {
      return { success: false, error: "Only consultants can archive summaries" }
    }

    await sql.query(
      `UPDATE consultation_summaries 
       SET status = 'archived', updated_at = NOW()
       WHERE id = $1`,
      [summaryId]
    )

    revalidatePath(`/consultation/room/${existing.consultation_id}`)

    return { success: true }
  } catch (error) {
    console.error("Error archiving summary:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to archive summary",
    }
  }
}

/**
 * Get all summaries for a user (their consultations)
 */
export async function getUserSummaries(): Promise<{
  success: boolean
  summaries?: Array<{
    id: string
    consultation_id: string
    consultation_subject: string
    status: string
    created_at: string
    updated_at: string
  }>
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const result = await sql.query(
      `SELECT 
        s.id, s.consultation_id, s.status, s.created_at, s.updated_at,
        c.subject as consultation_subject
       FROM consultation_summaries s
       JOIN consultations c ON s.consultation_id = c.id
       WHERE (c.user_id = $1 OR c.assigned_consultant_id = $1)
         AND s.status != 'archived'
       ORDER BY s.updated_at DESC`,
      [user.id]
    )

    return {
      success: true,
      summaries: result.rows,
    }
  } catch (error) {
    console.error("Error getting user summaries:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get summaries",
    }
  }
}

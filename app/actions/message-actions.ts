"use server"

/**
 * Server Actions for Consultation Messaging
 * 
 * Handles private messaging between consultant and client during consultations.
 * Messages are persisted in consultation_messages table and synced via Supabase Realtime.
 */

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getCurrentUserServer, isUserAdmin } from "@/lib/supabase-server"
import { sql } from "@/lib/db"
import type { 
  ConsultationMessage, 
  ConsultationMessageWithSender,
  SendMessageInput 
} from "@/types/consultations"

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

// Custom UUID validator that also accepts "demo" for demo mode
const uuidOrDemo = z.string().refine(
  (val) => val === "demo" || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val),
  { message: "Invalid UUID or demo" }
)

const sendMessageSchema = z.object({
  consultation_id: uuidOrDemo,
  content: z.string().min(1).max(10000),
  message_type: z.enum(["text", "system", "file_share", "code_snippet", "sandbox_output"]).optional(),
  metadata: z.record(z.unknown()).optional(),
})

const getMessagesSchema = z.object({
  consultation_id: uuidOrDemo,
  limit: z.number().min(1).max(100).optional(),
  before_id: z.string().uuid().optional(),
})

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Verify user has access to the consultation
 */
async function verifyConsultationAccess(
  consultationId: string,
  userId: string
): Promise<{ authorized: boolean; role: "consultant" | "client" | "admin" }> {
  const admin = await isUserAdmin()
  if (admin) {
    return { authorized: true, role: "admin" }
  }

  const result = await sql.query(
    `SELECT user_id, assigned_consultant_id 
     FROM consultations 
     WHERE id = $1`,
    [consultationId]
  )

  if (!result || result.length === 0) {
    return { authorized: false, role: "client" }
  }

  const consultation = result[0]
  if (consultation.user_id === userId) {
    return { authorized: true, role: "client" }
  }
  if (consultation.assigned_consultant_id === userId) {
    return { authorized: true, role: "consultant" }
  }

  return { authorized: false, role: "client" }
}

// =============================================================================
// MESSAGE ACTIONS
// =============================================================================

/**
 * Send a message in a consultation
 */
export async function sendMessage(
  input: SendMessageInput
): Promise<{
  success: boolean
  message?: ConsultationMessage
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const validated = sendMessageSchema.parse(input)

    // Demo mode - return mock message without saving
    if (validated.consultation_id === "demo") {
      const demoMessage: ConsultationMessage = {
        id: "demo-msg-" + Date.now(),
        consultation_id: "demo",
        sender_id: user.id,
        content: validated.content,
        message_type: validated.message_type ?? "text",
        metadata: validated.metadata ?? {},
        created_at: new Date().toISOString(),
      }
      return { success: true, message: demoMessage }
    }

    // Verify access
    const access = await verifyConsultationAccess(validated.consultation_id, user.id)
    if (!access.authorized) {
      return { success: false, error: "Not authorized to send messages in this consultation" }
    }

    // Insert message
    const result = await sql.query(
      `INSERT INTO consultation_messages (
        consultation_id,
        sender_id,
        content,
        message_type,
        metadata
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        validated.consultation_id,
        user.id,
        validated.content,
        validated.message_type ?? "text",
        JSON.stringify(validated.metadata ?? {}),
      ]
    )

    // Revalidate - Supabase Realtime will handle live updates
    revalidatePath(`/consultation/room/${validated.consultation_id}`)

    return {
      success: true,
      message: result.rows[0] as ConsultationMessage,
    }
  } catch (error) {
    console.error("Error sending message:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send message",
    }
  }
}

/**
 * Get messages for a consultation
 */
export async function getMessages(
  input: z.infer<typeof getMessagesSchema>
): Promise<{
  success: boolean
  messages?: ConsultationMessageWithSender[]
  hasMore?: boolean
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const validated = getMessagesSchema.parse(input)
    const limit = validated.limit ?? 50

    // Demo mode - return empty array
    if (validated.consultation_id === "demo") {
      return { success: true, messages: [], hasMore: false }
    }

    // Verify access
    const access = await verifyConsultationAccess(validated.consultation_id, user.id)
    if (!access.authorized) {
      return { success: false, error: "Not authorized to view messages in this consultation" }
    }

    // Build query
    let query = `
      SELECT 
        m.*,
        p.first_name,
        p.last_name,
        p.email,
        p.avatar_url
      FROM consultation_messages m
      LEFT JOIN profiles p ON m.sender_id = p.user_id
      WHERE m.consultation_id = $1
    `
    const params: unknown[] = [validated.consultation_id]

    if (validated.before_id) {
      query += ` AND m.id < $2`
      params.push(validated.before_id)
    }

    query += ` ORDER BY m.created_at DESC LIMIT $${params.length + 1}`
    params.push(limit + 1) // Fetch one extra to check if there's more

    const result = await sql.query(query, params)

    const hasMore = result && result.length > limit
    const messages = (result || []).slice(0, limit).map((row: Record<string, unknown>) => ({
      id: row.id,
      consultation_id: row.consultation_id,
      sender_id: row.sender_id,
      content: row.content,
      message_type: row.message_type,
      metadata: row.metadata,
      is_read: row.is_read,
      read_at: row.read_at,
      created_at: row.created_at,
      updated_at: row.updated_at,
      sender: row.first_name || row.email ? {
        id: row.sender_id,
        first_name: row.first_name,
        last_name: row.last_name,
        email: row.email,
        avatar_url: row.avatar_url,
      } : undefined,
    })) as ConsultationMessageWithSender[]

    // Reverse to get chronological order
    messages.reverse()

    return {
      success: true,
      messages,
      hasMore,
    }
  } catch (error) {
    console.error("Error getting messages:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get messages",
    }
  }
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(
  consultationId: string,
  messageIds?: string[]
): Promise<{
  success: boolean
  count?: number
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
      return { success: false, error: "Not authorized" }
    }

    let result
    if (messageIds && messageIds.length > 0) {
      // Mark specific messages as read
      result = await sql.query(
        `UPDATE consultation_messages 
         SET is_read = true, read_at = NOW()
         WHERE consultation_id = $1 
         AND sender_id != $2
         AND id = ANY($3)
         AND is_read = false`,
        [consultationId, user.id, messageIds]
      )
    } else {
      // Mark all unread messages in this consultation as read
      result = await sql.query(
        `UPDATE consultation_messages 
         SET is_read = true, read_at = NOW()
         WHERE consultation_id = $1 
         AND sender_id != $2
         AND is_read = false`,
        [consultationId, user.id]
      )
    }

    return {
      success: true,
      count: result?.length ?? 0,
    }
  } catch (error) {
    console.error("Error marking messages as read:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to mark messages as read",
    }
  }
}

/**
 * Get unread message count for a consultation
 */
export async function getUnreadCount(
  consultationId: string
): Promise<{
  success: boolean
  count?: number
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const result = await sql.query(
      `SELECT COUNT(*) as count
       FROM consultation_messages
       WHERE consultation_id = $1
       AND sender_id != $2
       AND is_read = false`,
      [consultationId, user.id]
    )

    return {
      success: true,
      count: parseInt(result?.[0]?.count ?? "0", 10),
    }
  } catch (error) {
    console.error("Error getting unread count:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get unread count",
    }
  }
}

/**
 * Delete a message (only sender can delete)
 */
export async function deleteMessage(
  messageId: string
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Check ownership
    const message = await sql.query(
      `SELECT consultation_id, sender_id FROM consultation_messages WHERE id = $1`,
      [messageId]
    )

    if (!message || message.length === 0) {
      return { success: false, error: "Message not found" }
    }

    const isAdmin = await isUserAdmin()
    if (message[0].sender_id !== user.id && !isAdmin) {
      return { success: false, error: "Can only delete your own messages" }
    }

    await sql.query(`DELETE FROM consultation_messages WHERE id = $1`, [messageId])

    revalidatePath(`/consultation/room/${message[0].consultation_id}`)

    return { success: true }
  } catch (error) {
    console.error("Error deleting message:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete message",
    }
  }
}

// =============================================================================
// CONSULTATION HISTORY ACTIONS
// =============================================================================

/**
 * Get user's consultation history with message stats
 */
export async function getUserConsultationHistory(options?: {
  limit?: number
  offset?: number
  status?: string
}): Promise<{
  success: boolean
  consultations?: Array<{
    id: string
    subject: string
    status: string
    consultation_type: string | null
    scheduled_at: string | null
    created_at: string
    updated_at: string
    message_count: number
    unread_count: number
    last_message_at: string | null
    consultant?: {
      id: string
      first_name: string | null
      last_name: string | null
      email: string
    }
  }>
  total?: number
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const limit = options?.limit ?? 20
    const offset = options?.offset ?? 0

    // Build query with message stats
    let query = `
      SELECT 
        c.*,
        p.first_name as consultant_first_name,
        p.last_name as consultant_last_name,
        p.email as consultant_email,
        COALESCE(msg_stats.message_count, 0) as message_count,
        COALESCE(msg_stats.unread_count, 0) as unread_count,
        msg_stats.last_message_at
      FROM consultations c
      LEFT JOIN profiles p ON c.assigned_consultant_id = p.user_id
      LEFT JOIN LATERAL (
        SELECT 
          COUNT(*) as message_count,
          COUNT(*) FILTER (WHERE is_read = false AND sender_id != $1) as unread_count,
          MAX(created_at) as last_message_at
        FROM consultation_messages
        WHERE consultation_id = c.id
      ) msg_stats ON true
      WHERE c.user_id = $1
    `
    const params: unknown[] = [user.id]
    let paramIndex = 2

    if (options?.status) {
      query += ` AND c.status = $${paramIndex}`
      params.push(options.status)
      paramIndex++
    }

    query += ` ORDER BY c.updated_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const result = await sql.query(query, params)

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM consultations WHERE user_id = $1`
    const countParams: unknown[] = [user.id]
    if (options?.status) {
      countQuery += ` AND status = $2`
      countParams.push(options.status)
    }
    const countResult = await sql.query(countQuery, countParams)
    const total = parseInt(countResult?.[0]?.total ?? "0", 10)

    const consultations = (result || []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      subject: row.subject as string,
      status: row.status as string,
      consultation_type: row.consultation_type as string | null,
      scheduled_at: row.scheduled_at as string | null,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      message_count: parseInt(String(row.message_count), 10),
      unread_count: parseInt(String(row.unread_count), 10),
      last_message_at: row.last_message_at as string | null,
      consultant: row.consultant_email ? {
        id: row.assigned_consultant_id as string,
        first_name: row.consultant_first_name as string | null,
        last_name: row.consultant_last_name as string | null,
        email: row.consultant_email as string,
      } : undefined,
    }))

    return {
      success: true,
      consultations,
      total,
    }
  } catch (error) {
    console.error("Error getting consultation history:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get consultation history",
    }
  }
}

/**
 * Get summary of user's consultation activity
 */
export async function getUserConsultationStats(): Promise<{
  success: boolean
  stats?: {
    total_consultations: number
    active_consultations: number
    completed_consultations: number
    total_messages: number
    unread_messages: number
  }
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const result = await sql.query(
      `SELECT 
        COUNT(*) as total_consultations,
        COUNT(*) FILTER (WHERE status IN ('scheduled', 'in_progress', 'in_review')) as active_consultations,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_consultations
      FROM consultations
      WHERE user_id = $1`,
      [user.id]
    )

    const messageStats = await sql.query(
      `SELECT 
        COUNT(*) as total_messages,
        COUNT(*) FILTER (WHERE is_read = false AND sender_id != $1) as unread_messages
      FROM consultation_messages m
      JOIN consultations c ON m.consultation_id = c.id
      WHERE c.user_id = $1`,
      [user.id]
    )

    return {
      success: true,
      stats: {
        total_consultations: parseInt(result?.[0]?.total_consultations ?? "0", 10),
        active_consultations: parseInt(result?.[0]?.active_consultations ?? "0", 10),
        completed_consultations: parseInt(result?.[0]?.completed_consultations ?? "0", 10),
        total_messages: parseInt(messageStats?.[0]?.total_messages ?? "0", 10),
        unread_messages: parseInt(messageStats?.[0]?.unread_messages ?? "0", 10),
      },
    }
  } catch (error) {
    console.error("Error getting consultation stats:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get consultation stats",
    }
  }
}

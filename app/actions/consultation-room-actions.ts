"use server"

/**
 * Consultation Room Data Actions
 * 
 * Fetches all data needed for the consultation room view.
 * This complements the existing consultation-actions.ts with room-specific queries.
 */

import { getCurrentUserServer } from "@/lib/supabase-server"
import { sql } from "@/lib/db"
import type { ConsultationRoomData, ConsultationWithDetails } from "@/types/consultations"

// =============================================================================
// ROOM DATA FETCHING
// =============================================================================

/**
 * Get complete consultation room data
 * Returns all information needed to render the room
 */
export async function getConsultationRoomData(
  consultationId: string
): Promise<{
  success: boolean
  data?: ConsultationRoomData
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Demo mode - return mock data
    if (consultationId === "demo") {
      return {
        success: true,
        data: {
          consultation: {
            id: "demo",
            user_id: user.id,
            subject: "Demo Consultation Room",
            description: "This is a demo consultation room for testing video, whiteboard, and collaboration features.",
            consultation_type: "strategy",
            status: "in_progress",
            urgency: "medium",
            scheduled_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            user: {
              id: user.id,
              first_name: "Demo",
              last_name: "User",
              email: user.email || "",
            },
            assigned_consultant: {
              id: "demo-consultant",
              first_name: "AI",
              last_name: "Assistant",
              email: "ai@donjon.com",
            },
          },
          messages: [],
          files: [],
          sandbox: {
            id: "demo-sandbox",
            consultation_id: "demo",
            files: [],
            status: "ready",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          whiteboard: {
            id: "demo-whiteboard",
            consultation_id: "demo",
            data: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          summary: null,
        },
      }
    }

    // Get consultation with user and consultant details
    const consultationResult = await sql.query(
      `SELECT 
        c.*,
        u.id as user_id_ref,
        u.first_name as user_first_name,
        u.last_name as user_last_name,
        u.email as user_email,
        u.company_name as user_company_name,
        u.phone as user_phone,
        cons.id as consultant_id_ref,
        cons.first_name as consultant_first_name,
        cons.last_name as consultant_last_name,
        cons.email as consultant_email
      FROM consultations c
      LEFT JOIN profiles u ON c.user_id = u.id
      LEFT JOIN profiles cons ON c.assigned_consultant_id = cons.id
      WHERE c.id = $1`,
      [consultationId]
    )

    if (consultationResult.rows.length === 0) {
      return { success: false, error: "Consultation not found" }
    }

    const row = consultationResult.rows[0]
    
    // Check authorization
    const isParticipant = 
      row.user_id === user.id || 
      row.assigned_consultant_id === user.id
    
    // TODO: Add admin check when Stack Auth integrated
    // const isAdmin = await isUserAdmin()
    const isAdmin = false

    if (!isParticipant && !isAdmin) {
      return { success: false, error: "Not authorized to view this consultation" }
    }

    const consultation: ConsultationWithDetails = {
      ...row,
      user: row.user_id_ref ? {
        id: row.user_id_ref,
        first_name: row.user_first_name,
        last_name: row.user_last_name,
        email: row.user_email,
        company_name: row.user_company_name,
        phone: row.user_phone,
      } : undefined,
      assigned_consultant: row.consultant_id_ref ? {
        id: row.consultant_id_ref,
        first_name: row.consultant_first_name,
        last_name: row.consultant_last_name,
        email: row.consultant_email,
      } : undefined,
    }

    // Get messages with sender info
    const messagesResult = await sql.query(
      `SELECT 
        m.*,
        p.first_name as sender_first_name,
        p.last_name as sender_last_name,
        p.email as sender_email,
        p.avatar_url as sender_avatar_url
      FROM consultation_messages m
      LEFT JOIN profiles p ON m.sender_id = p.id
      WHERE m.consultation_id = $1
      ORDER BY m.created_at ASC
      LIMIT 100`,
      [consultationId]
    )

    const messages = messagesResult.rows.map((row: Record<string, unknown>) => ({
      ...row,
      sender: row.sender_first_name ? {
        id: row.sender_id,
        first_name: row.sender_first_name,
        last_name: row.sender_last_name,
        email: row.sender_email,
        avatar_url: row.sender_avatar_url,
      } : undefined,
    }))

    // Get files with uploader info
    const filesResult = await sql.query(
      `SELECT 
        f.*,
        p.first_name as uploader_first_name,
        p.last_name as uploader_last_name,
        p.email as uploader_email
      FROM consultation_files f
      LEFT JOIN profiles p ON f.uploaded_by = p.id
      WHERE f.consultation_id = $1 AND f.deleted_at IS NULL
      ORDER BY f.created_at DESC`,
      [consultationId]
    )

    const files = filesResult.rows.map((row: Record<string, unknown>) => ({
      ...row,
      uploader: row.uploader_first_name ? {
        id: row.uploaded_by,
        first_name: row.uploader_first_name,
        last_name: row.uploader_last_name,
        email: row.uploader_email,
      } : undefined,
    }))

    // Get active sandbox session
    const sandboxResult = await sql.query(
      `SELECT * FROM sandbox_sessions 
      WHERE consultation_id = $1 
      AND status IN ('creating', 'running', 'paused')
      ORDER BY created_at DESC
      LIMIT 1`,
      [consultationId]
    )

    const sandbox = sandboxResult.rows[0] || undefined

    // Get current whiteboard snapshot
    const whiteboardResult = await sql.query(
      `SELECT * FROM whiteboard_snapshots 
      WHERE consultation_id = $1 AND is_current = true
      ORDER BY version DESC
      LIMIT 1`,
      [consultationId]
    )

    const whiteboard = whiteboardResult.rows[0] || undefined

    // Get latest summary
    const summaryResult = await sql.query(
      `SELECT * FROM consultation_summaries 
      WHERE consultation_id = $1 AND status != 'archived'
      ORDER BY updated_at DESC
      LIMIT 1`,
      [consultationId]
    )

    const summary = summaryResult.rows[0] || undefined

    // Get active video call
    const videoResult = await sql.query(
      `SELECT * FROM video_call_logs 
      WHERE consultation_id = $1 AND status = 'active'
      ORDER BY started_at DESC
      LIMIT 1`,
      [consultationId]
    )

    const video_call = videoResult.rows[0] || undefined

    const roomData: ConsultationRoomData = {
      consultation,
      messages,
      files,
      sandbox,
      whiteboard,
      summary,
      video_call,
    }

    return { success: true, data: roomData }
  } catch (error) {
    console.error("Error loading consultation room data:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to load room data",
    }
  }
}

/**
 * Check if user can join consultation room
 */
export async function canJoinConsultationRoom(
  consultationId: string
): Promise<{
  success: boolean
  canJoin: boolean
  isConsultant: boolean
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, canJoin: false, isConsultant: false, error: "Authentication required" }
    }

    // Demo mode - allow access without a real consultation
    if (consultationId === "demo") {
      return { success: true, canJoin: true, isConsultant: false }
    }

    const result = await sql.query(
      `SELECT user_id, assigned_consultant_id, status 
       FROM consultations WHERE id = $1`,
      [consultationId]
    )

    if (result.rows.length === 0) {
      return { success: false, canJoin: false, isConsultant: false, error: "Consultation not found" }
    }

    const { user_id, assigned_consultant_id, status } = result.rows[0]

    // Only scheduled or in-progress consultations can be joined
    if (status !== "scheduled" && status !== "in_progress") {
      return { 
        success: true, 
        canJoin: false, 
        isConsultant: false, 
        error: "Consultation is not currently active" 
      }
    }

    const isConsultant = assigned_consultant_id === user.id
    const isClient = user_id === user.id
    // TODO: Add admin check
    const isAdmin = false

    return {
      success: true,
      canJoin: isConsultant || isClient || isAdmin,
      isConsultant,
    }
  } catch (error) {
    console.error("Error checking room access:", error)
    return {
      success: false,
      canJoin: false,
      isConsultant: false,
      error: error instanceof Error ? error.message : "Failed to check access",
    }
  }
}

/**
 * Mark consultation as in progress when room is joined
 */
export async function startConsultationSession(
  consultationId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    await sql.query(
      `UPDATE consultations 
       SET status = 'in_progress', updated_at = NOW()
       WHERE id = $1 AND status = 'scheduled'`,
      [consultationId]
    )

    return { success: true }
  } catch (error) {
    console.error("Error starting consultation:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to start consultation",
    }
  }
}

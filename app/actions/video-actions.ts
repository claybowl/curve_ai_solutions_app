"use server"

import { revalidatePath } from "next/cache"
import { getCurrentUserServer } from "@/lib/supabase-server"
import { sql } from "@/lib/db"
import { 
  createDailyRoom, 
  getDailyRoom, 
  deleteDailyRoom, 
  createMeetingToken,
  type DailyRoomInfo 
} from "@/lib/daily-client"

// =============================================================================
// TYPES
// =============================================================================

export interface VideoRoomResult {
  success: boolean
  room?: DailyRoomInfo
  token?: string
  error?: string
}

export interface VideoCallLogInput {
  consultation_id: string
  room_name: string
  room_url: string
}

export interface VideoCallLogResult {
  success: boolean
  log_id?: string
  error?: string
}

export interface EndVideoCallInput {
  log_id: string
  screen_shared?: boolean
  screen_share_duration_seconds?: number
  audio_only?: boolean
  avg_video_quality?: "poor" | "fair" | "good" | "excellent"
  connection_issues?: Array<{
    timestamp: string
    issue: string
    resolved?: boolean
  }>
}

// =============================================================================
// ROOM MANAGEMENT
// =============================================================================

/**
 * Create a new video room for a consultation
 * Returns room info and a meeting token for the current user
 */
export async function createVideoRoom(
  consultationId: string
): Promise<VideoRoomResult> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    // Verify user has access to this consultation
    const consultationResult = await sql.query(
      `SELECT id, user_id, assigned_consultant_id 
       FROM consultations 
       WHERE id = $1`,
      [consultationId]
    )

    if (consultationResult.rows.length === 0) {
      return { success: false, error: "Consultation not found" }
    }

    const consultation = consultationResult.rows[0]
    const isParticipant = 
      consultation.user_id === user.id || 
      consultation.assigned_consultant_id === user.id

    if (!isParticipant) {
      return { success: false, error: "You are not a participant in this consultation" }
    }

    // Create a new room with consultation-specific name
    const roomName = `consult-${consultationId.substring(0, 8)}-${Date.now()}`
    
    const room = await createDailyRoom({
      name: roomName,
      privacy: "private",
      properties: {
        max_participants: 2,
        enable_screenshare: true,
        enable_chat: false, // We use our own chat
        exp: Math.floor(Date.now() / 1000) + 4 * 60 * 60, // 4 hour max duration
        eject_at_room_exp: true,
      },
    })

    // Get user profile for display name
    const profileResult = await sql.query(
      `SELECT first_name, last_name, email FROM profiles WHERE id = $1`,
      [user.id]
    )
    const profile = profileResult.rows[0]
    const userName = profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.email || "Participant"

    // Create meeting token for this user
    const token = await createMeetingToken({
      room_name: room.name,
      user_name: userName,
      user_id: user.id,
      is_owner: consultation.assigned_consultant_id === user.id,
      enable_screenshare: true,
    })

    return { success: true, room, token }
  } catch (error) {
    console.error("Error creating video room:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to create video room" 
    }
  }
}

/**
 * Join an existing video room
 * Returns a meeting token for the current user
 */
export async function joinVideoRoom(
  consultationId: string,
  roomName: string
): Promise<VideoRoomResult> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    // Verify user has access to this consultation
    const consultationResult = await sql.query(
      `SELECT id, user_id, assigned_consultant_id 
       FROM consultations 
       WHERE id = $1`,
      [consultationId]
    )

    if (consultationResult.rows.length === 0) {
      return { success: false, error: "Consultation not found" }
    }

    const consultation = consultationResult.rows[0]
    const isParticipant = 
      consultation.user_id === user.id || 
      consultation.assigned_consultant_id === user.id

    if (!isParticipant) {
      return { success: false, error: "You are not a participant in this consultation" }
    }

    // Get room info
    const room = await getDailyRoom(roomName)
    if (!room) {
      return { success: false, error: "Video room not found or has expired" }
    }

    // Get user profile for display name
    const profileResult = await sql.query(
      `SELECT first_name, last_name, email FROM profiles WHERE id = $1`,
      [user.id]
    )
    const profile = profileResult.rows[0]
    const userName = profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.email || "Participant"

    // Create meeting token for this user
    const token = await createMeetingToken({
      room_name: room.name,
      user_name: userName,
      user_id: user.id,
      is_owner: consultation.assigned_consultant_id === user.id,
      enable_screenshare: true,
    })

    return { success: true, room, token }
  } catch (error) {
    console.error("Error joining video room:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to join video room" 
    }
  }
}

/**
 * End/delete a video room
 */
export async function endVideoRoom(roomName: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    await deleteDailyRoom(roomName)
    return { success: true }
  } catch (error) {
    console.error("Error ending video room:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to end video room" 
    }
  }
}

// =============================================================================
// VIDEO CALL LOGGING
// =============================================================================

/**
 * Log the start of a video call
 */
export async function logVideoCallStart(input: VideoCallLogInput): Promise<VideoCallLogResult> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const result = await sql.query(
      `INSERT INTO video_call_logs (
        consultation_id,
        initiated_by,
        participants,
        started_at,
        screen_shared,
        screen_share_duration_seconds,
        audio_only,
        connection_issues,
        ice_candidates_used,
        signaling_server,
        status
      ) VALUES ($1, $2, $3, NOW(), false, 0, false, '[]'::jsonb, '[]'::jsonb, $4, 'active')
      RETURNING id`,
      [
        input.consultation_id,
        user.id,
        JSON.stringify([user.id]),
        input.room_url,
      ]
    )

    revalidatePath(`/consultation/room/${input.consultation_id}`)

    return { success: true, log_id: result.rows[0].id }
  } catch (error) {
    console.error("Error logging video call start:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to log video call" 
    }
  }
}

/**
 * Add a participant to the video call log
 */
export async function addVideoCallParticipant(
  logId: string,
  participantId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    await sql.query(
      `UPDATE video_call_logs 
       SET participants = participants || $1::jsonb
       WHERE id = $2 AND status = 'active'`,
      [JSON.stringify([participantId]), logId]
    )

    return { success: true }
  } catch (error) {
    console.error("Error adding video call participant:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to add participant" 
    }
  }
}

/**
 * Log the end of a video call
 */
export async function logVideoCallEnd(input: EndVideoCallInput): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    // Calculate duration
    const callResult = await sql.query(
      `SELECT started_at, consultation_id FROM video_call_logs WHERE id = $1`,
      [input.log_id]
    )

    if (callResult.rows.length === 0) {
      return { success: false, error: "Video call log not found" }
    }

    const startedAt = new Date(callResult.rows[0].started_at)
    const endedAt = new Date()
    const durationSeconds = Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000)

    await sql.query(
      `UPDATE video_call_logs 
       SET 
         ended_at = NOW(),
         duration_seconds = $1,
         screen_shared = $2,
         screen_share_duration_seconds = $3,
         audio_only = $4,
         avg_video_quality = $5,
         connection_issues = $6::jsonb,
         status = 'ended',
         end_reason = 'user_ended'
       WHERE id = $7`,
      [
        durationSeconds,
        input.screen_shared ?? false,
        input.screen_share_duration_seconds ?? 0,
        input.audio_only ?? false,
        input.avg_video_quality ?? "good",
        JSON.stringify(input.connection_issues ?? []),
        input.log_id,
      ]
    )

    revalidatePath(`/consultation/room/${callResult.rows[0].consultation_id}`)

    return { success: true }
  } catch (error) {
    console.error("Error logging video call end:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to log video call end" 
    }
  }
}

/**
 * Log connection issue during video call
 */
export async function logConnectionIssue(
  logId: string,
  issue: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const issueData = {
      timestamp: new Date().toISOString(),
      issue,
      resolved: false,
    }

    await sql.query(
      `UPDATE video_call_logs 
       SET connection_issues = connection_issues || $1::jsonb
       WHERE id = $2 AND status = 'active'`,
      [JSON.stringify([issueData]), logId]
    )

    return { success: true }
  } catch (error) {
    console.error("Error logging connection issue:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to log connection issue" 
    }
  }
}

/**
 * Get video call history for a consultation
 */
export async function getVideoCallHistory(
  consultationId: string
): Promise<{ 
  success: boolean
  calls?: Array<{
    id: string
    started_at: string
    ended_at?: string
    duration_seconds?: number
    screen_shared: boolean
    status: string
  }>
  error?: string 
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    const result = await sql.query(
      `SELECT id, started_at, ended_at, duration_seconds, screen_shared, status
       FROM video_call_logs
       WHERE consultation_id = $1
       ORDER BY started_at DESC
       LIMIT 20`,
      [consultationId]
    )

    return { success: true, calls: result.rows }
  } catch (error) {
    console.error("Error getting video call history:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to get video call history" 
    }
  }
}

"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getCurrentUserServer } from "@/lib/supabase-server"
import { sql } from "@/lib/db"
import type { CalendarConnection, CalendarProvider } from "@/types/consultations"

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

const connectCalendarSchema = z.object({
  provider: z.enum(["google", "outlook", "apple"]),
  code: z.string().min(1), // OAuth authorization code
  redirect_uri: z.string().url(),
})

const createEventSchema = z.object({
  consultation_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  attendees: z.array(z.string().email()).optional(),
})

// =============================================================================
// OAUTH CONFIGURATION
// =============================================================================

const GOOGLE_CONFIG = {
  tokenUrl: "https://oauth2.googleapis.com/token",
  calendarUrl: "https://www.googleapis.com/calendar/v3",
  scopes: ["https://www.googleapis.com/auth/calendar.events"],
}

const OUTLOOK_CONFIG = {
  tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
  calendarUrl: "https://graph.microsoft.com/v1.0/me/calendar",
  scopes: ["Calendars.ReadWrite"],
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Exchange authorization code for tokens
 */
async function exchangeCodeForTokens(
  provider: CalendarProvider,
  code: string,
  redirectUri: string
): Promise<{
  access_token: string
  refresh_token?: string
  expires_in: number
  token_type: string
}> {
  const clientId = provider === "google" 
    ? process.env.GOOGLE_CLIENT_ID 
    : process.env.MICROSOFT_CLIENT_ID
  const clientSecret = provider === "google"
    ? process.env.GOOGLE_CLIENT_SECRET
    : process.env.MICROSOFT_CLIENT_SECRET
  const tokenUrl = provider === "google" 
    ? GOOGLE_CONFIG.tokenUrl 
    : OUTLOOK_CONFIG.tokenUrl

  if (!clientId || !clientSecret) {
    throw new Error(`${provider} OAuth credentials not configured`)
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  })

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to exchange code: ${error}`)
  }

  return response.json()
}

/**
 * Refresh an access token
 */
async function refreshAccessToken(
  connection: CalendarConnection
): Promise<{
  access_token: string
  expires_in: number
}> {
  if (!connection.refresh_token) {
    throw new Error("No refresh token available")
  }

  const clientId = connection.provider === "google"
    ? process.env.GOOGLE_CLIENT_ID
    : process.env.MICROSOFT_CLIENT_ID
  const clientSecret = connection.provider === "google"
    ? process.env.GOOGLE_CLIENT_SECRET
    : process.env.MICROSOFT_CLIENT_SECRET
  const tokenUrl = connection.provider === "google"
    ? GOOGLE_CONFIG.tokenUrl
    : OUTLOOK_CONFIG.tokenUrl

  if (!clientId || !clientSecret) {
    throw new Error(`${connection.provider} OAuth credentials not configured`)
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: connection.refresh_token,
    grant_type: "refresh_token",
  })

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to refresh token: ${error}`)
  }

  return response.json()
}

/**
 * Get valid access token (refresh if needed)
 */
async function getValidAccessToken(connection: CalendarConnection): Promise<string> {
  const expiresAt = connection.expires_at ? new Date(connection.expires_at) : null
  
  // If token is still valid (with 5 min buffer), use it
  if (expiresAt && expiresAt.getTime() > Date.now() + 5 * 60 * 1000) {
    return connection.access_token
  }

  // Need to refresh
  const tokens = await refreshAccessToken(connection)
  
  // Update in database
  const newExpiresAt = new Date(Date.now() + tokens.expires_in * 1000)
  await sql.query(
    `UPDATE calendar_connections 
     SET access_token = $1, expires_at = $2, updated_at = NOW()
     WHERE id = $3`,
    [tokens.access_token, newExpiresAt.toISOString(), connection.id]
  )

  return tokens.access_token
}

// =============================================================================
// CALENDAR CONNECTION ACTIONS
// =============================================================================

/**
 * Get OAuth authorization URL
 */
export async function getOAuthUrl(
  provider: CalendarProvider,
  redirectUri: string
): Promise<{
  success: boolean
  url?: string
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    let authUrl: string
    
    if (provider === "google") {
      const clientId = process.env.GOOGLE_CLIENT_ID
      if (!clientId) {
        return { success: false, error: "Google OAuth not configured" }
      }
      
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: GOOGLE_CONFIG.scopes.join(" "),
        access_type: "offline",
        prompt: "consent",
        state: user.id, // For verification
      })
      
      authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    } else if (provider === "outlook") {
      const clientId = process.env.MICROSOFT_CLIENT_ID
      if (!clientId) {
        return { success: false, error: "Microsoft OAuth not configured" }
      }
      
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: OUTLOOK_CONFIG.scopes.join(" ") + " offline_access",
        state: user.id,
      })
      
      authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params.toString()}`
    } else {
      return { success: false, error: "Provider not supported" }
    }

    return { success: true, url: authUrl }
  } catch (error) {
    console.error("Error getting OAuth URL:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get OAuth URL",
    }
  }
}

/**
 * Complete OAuth connection
 */
export async function connectCalendar(
  input: z.infer<typeof connectCalendarSchema>
): Promise<{
  success: boolean
  connection?: CalendarConnection
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const validated = connectCalendarSchema.parse(input)

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(
      validated.provider,
      validated.code,
      validated.redirect_uri
    )

    // Calculate expiration
    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000)

    // Check for existing connection
    const existingResult = await sql.query(
      `SELECT id FROM calendar_connections 
       WHERE user_id = $1 AND provider = $2`,
      [user.id, validated.provider]
    )

    let connectionId: string

    if (existingResult.rows.length > 0) {
      // Update existing connection
      connectionId = existingResult.rows[0].id
      await sql.query(
        `UPDATE calendar_connections 
         SET access_token = $1, refresh_token = $2, token_type = $3, 
             expires_at = $4, sync_enabled = true, updated_at = NOW()
         WHERE id = $5`,
        [
          tokens.access_token,
          tokens.refresh_token || null,
          tokens.token_type,
          expiresAt.toISOString(),
          connectionId,
        ]
      )
    } else {
      // Create new connection
      const insertResult = await sql.query(
        `INSERT INTO calendar_connections (
          user_id,
          provider,
          access_token,
          refresh_token,
          token_type,
          expires_at,
          sync_enabled
        ) VALUES ($1, $2, $3, $4, $5, $6, true)
        RETURNING *`,
        [
          user.id,
          validated.provider,
          tokens.access_token,
          tokens.refresh_token || null,
          tokens.token_type,
          expiresAt.toISOString(),
        ]
      )
      connectionId = insertResult.rows[0].id
    }

    // Get the connection
    const connectionResult = await sql.query(
      `SELECT * FROM calendar_connections WHERE id = $1`,
      [connectionId]
    )

    revalidatePath("/profile")

    return {
      success: true,
      connection: connectionResult.rows[0] as CalendarConnection,
    }
  } catch (error) {
    console.error("Error connecting calendar:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to connect calendar",
    }
  }
}

/**
 * Disconnect calendar
 */
export async function disconnectCalendar(
  provider: CalendarProvider
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    await sql.query(
      `DELETE FROM calendar_connections 
       WHERE user_id = $1 AND provider = $2`,
      [user.id, provider]
    )

    revalidatePath("/profile")

    return { success: true }
  } catch (error) {
    console.error("Error disconnecting calendar:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to disconnect calendar",
    }
  }
}

/**
 * Get user's calendar connections
 */
export async function getCalendarConnections(): Promise<{
  success: boolean
  connections?: Array<{
    id: string
    provider: CalendarProvider
    provider_email?: string
    sync_enabled: boolean
    last_synced_at?: string
  }>
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const result = await sql.query(
      `SELECT id, provider, provider_email, sync_enabled, last_synced_at
       FROM calendar_connections
       WHERE user_id = $1`,
      [user.id]
    )

    return {
      success: true,
      connections: result.rows,
    }
  } catch (error) {
    console.error("Error getting calendar connections:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get connections",
    }
  }
}

// =============================================================================
// CALENDAR EVENT ACTIONS
// =============================================================================

/**
 * Create a calendar event for a consultation
 */
export async function createCalendarEvent(
  input: z.infer<typeof createEventSchema>
): Promise<{
  success: boolean
  eventId?: string
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const validated = createEventSchema.parse(input)

    // Get user's calendar connection (prefer Google, then Outlook)
    const connectionResult = await sql.query(
      `SELECT * FROM calendar_connections 
       WHERE user_id = $1 AND sync_enabled = true
       ORDER BY CASE provider WHEN 'google' THEN 1 WHEN 'outlook' THEN 2 ELSE 3 END
       LIMIT 1`,
      [user.id]
    )

    if (connectionResult.rows.length === 0) {
      return { success: false, error: "No calendar connected" }
    }

    const connection = connectionResult.rows[0] as CalendarConnection
    const accessToken = await getValidAccessToken(connection)

    let eventId: string

    if (connection.provider === "google") {
      // Create Google Calendar event
      const response = await fetch(
        `${GOOGLE_CONFIG.calendarUrl}/calendars/primary/events`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            summary: validated.title,
            description: validated.description,
            start: {
              dateTime: validated.start_time,
              timeZone: "UTC",
            },
            end: {
              dateTime: validated.end_time,
              timeZone: "UTC",
            },
            attendees: validated.attendees?.map((email) => ({ email })),
          }),
        }
      )

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to create Google event: ${error}`)
      }

      const event = await response.json()
      eventId = event.id
    } else if (connection.provider === "outlook") {
      // Create Outlook Calendar event
      const response = await fetch(
        `${OUTLOOK_CONFIG.calendarUrl}/events`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: validated.title,
            body: {
              contentType: "text",
              content: validated.description || "",
            },
            start: {
              dateTime: validated.start_time,
              timeZone: "UTC",
            },
            end: {
              dateTime: validated.end_time,
              timeZone: "UTC",
            },
            attendees: validated.attendees?.map((email) => ({
              emailAddress: { address: email },
              type: "required",
            })),
          }),
        }
      )

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to create Outlook event: ${error}`)
      }

      const event = await response.json()
      eventId = event.id
    } else {
      return { success: false, error: "Unsupported calendar provider" }
    }

    // Update consultation with scheduled_at
    await sql.query(
      `UPDATE consultations SET scheduled_at = $1 WHERE id = $2`,
      [validated.start_time, validated.consultation_id]
    )

    revalidatePath(`/consultation/room/${validated.consultation_id}`)

    return { success: true, eventId }
  } catch (error) {
    console.error("Error creating calendar event:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create event",
    }
  }
}

/**
 * Get available time slots (mock implementation)
 * In production, this would query the calendar API for busy times
 */
export async function getAvailableSlots(
  date: string, // YYYY-MM-DD
  durationMinutes: number = 60
): Promise<{
  success: boolean
  slots?: Array<{
    start: string
    end: string
  }>
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Mock available slots (9 AM - 5 PM, every hour)
    const slots: Array<{ start: string; end: string }> = []
    const startHour = 9
    const endHour = 17

    for (let hour = startHour; hour < endHour; hour++) {
      const start = new Date(`${date}T${hour.toString().padStart(2, "0")}:00:00Z`)
      const end = new Date(start.getTime() + durationMinutes * 60 * 1000)
      
      slots.push({
        start: start.toISOString(),
        end: end.toISOString(),
      })
    }

    return { success: true, slots }
  } catch (error) {
    console.error("Error getting available slots:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get slots",
    }
  }
}

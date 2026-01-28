/**
 * Daily.co Client Helper
 * Server-side utilities for Daily.co room management
 */

const DAILY_API_BASE = "https://api.daily.co/v1"

/**
 * Room configuration for Daily.co
 */
export interface DailyRoomConfig {
  name?: string
  privacy?: "public" | "private"
  properties?: {
    max_participants?: number
    enable_screenshare?: boolean
    enable_chat?: boolean
    start_video_off?: boolean
    start_audio_off?: boolean
    exp?: number // Unix timestamp for room expiration
    eject_at_room_exp?: boolean
    enable_knocking?: boolean
    enable_prejoin_ui?: boolean
  }
}

/**
 * Room info returned from Daily.co API
 */
export interface DailyRoomInfo {
  id: string
  name: string
  api_created: boolean
  privacy: "public" | "private"
  url: string
  created_at: string
  config: {
    max_participants: number
    enable_screenshare: boolean
    enable_chat: boolean
    start_video_off: boolean
    start_audio_off: boolean
    exp?: number
    eject_at_room_exp: boolean
    enable_knocking: boolean
    enable_prejoin_ui: boolean
  }
}

/**
 * Meeting token configuration
 */
export interface DailyTokenConfig {
  room_name: string
  user_name?: string
  user_id?: string
  is_owner?: boolean
  enable_screenshare?: boolean
  start_video_off?: boolean
  start_audio_off?: boolean
  exp?: number // Token expiration (Unix timestamp)
}

/**
 * Token info returned from Daily.co API
 */
export interface DailyTokenInfo {
  token: string
}

/**
 * Get API key - must be called server-side only
 */
function getApiKey(): string {
  const apiKey = process.env.DAILY_API_KEY
  if (!apiKey) {
    throw new Error("DAILY_API_KEY environment variable is not set")
  }
  return apiKey
}

/**
 * Create a new Daily.co room
 */
export async function createDailyRoom(config: DailyRoomConfig = {}): Promise<DailyRoomInfo> {
  const apiKey = getApiKey()
  
  // Generate unique room name if not provided
  const roomName = config.name || `consultation-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
  
  // Set room to expire in 24 hours by default
  const expiration = config.properties?.exp || Math.floor(Date.now() / 1000) + 24 * 60 * 60
  
  const response = await fetch(`${DAILY_API_BASE}/rooms`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      name: roomName,
      privacy: config.privacy || "private",
      properties: {
        max_participants: 2, // 1-on-1 only
        enable_screenshare: true,
        enable_chat: false, // We have our own chat
        start_video_off: false,
        start_audio_off: false,
        exp: expiration,
        eject_at_room_exp: true,
        enable_knocking: false,
        enable_prejoin_ui: false,
        ...config.properties,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create Daily.co room: ${response.status} ${error}`)
  }

  return response.json()
}

/**
 * Get room info by name
 */
export async function getDailyRoom(roomName: string): Promise<DailyRoomInfo | null> {
  const apiKey = getApiKey()
  
  const response = await fetch(`${DAILY_API_BASE}/rooms/${roomName}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to get Daily.co room: ${response.status} ${error}`)
  }

  return response.json()
}

/**
 * Delete a Daily.co room
 */
export async function deleteDailyRoom(roomName: string): Promise<boolean> {
  const apiKey = getApiKey()
  
  const response = await fetch(`${DAILY_API_BASE}/rooms/${roomName}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })

  if (response.status === 404) {
    return false
  }

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to delete Daily.co room: ${response.status} ${error}`)
  }

  return true
}

/**
 * Create a meeting token for a room
 * Tokens provide secure access and can set user-specific properties
 */
export async function createMeetingToken(config: DailyTokenConfig): Promise<string> {
  const apiKey = getApiKey()
  
  // Token expires in 1 hour by default
  const expiration = config.exp || Math.floor(Date.now() / 1000) + 60 * 60
  
  const response = await fetch(`${DAILY_API_BASE}/meeting-tokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      properties: {
        room_name: config.room_name,
        user_name: config.user_name,
        user_id: config.user_id,
        is_owner: config.is_owner ?? false,
        enable_screenshare: config.enable_screenshare ?? true,
        start_video_off: config.start_video_off ?? false,
        start_audio_off: config.start_audio_off ?? false,
        exp: expiration,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to create meeting token: ${response.status} ${error}`)
  }

  const data: DailyTokenInfo = await response.json()
  return data.token
}

/**
 * List all active rooms
 */
export async function listDailyRooms(): Promise<DailyRoomInfo[]> {
  const apiKey = getApiKey()
  
  const response = await fetch(`${DAILY_API_BASE}/rooms`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to list Daily.co rooms: ${response.status} ${error}`)
  }

  const data = await response.json()
  return data.data || []
}

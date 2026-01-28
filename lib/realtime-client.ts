"use client"

/**
 * Supabase Realtime Client
 * 
 * Provides real-time functionality for:
 * - Consultation room messaging
 * - User presence (Board Room online status)
 * - Sandbox output streaming
 * - Whiteboard sync
 * 
 * Uses Supabase Realtime with:
 * - Postgres Changes (database triggers)
 * - Broadcast (ephemeral events)
 * - Presence (online status)
 */

import { createClient } from "@/lib/supabase-client"
import type { RealtimeChannel, RealtimePostgresChangesPayload } from "@supabase/supabase-js"
import type { 
  ConsultationMessage, 
  BoardRoomPost, 
  UserPresence,
  WhiteboardSnapshot,
  SandboxSession
} from "@/types/consultations"

// =============================================================================
// TYPES
// =============================================================================

export type PresenceState = {
  [key: string]: UserPresence[]
}

export type MessagePayload = RealtimePostgresChangesPayload<ConsultationMessage>
export type BoardRoomPayload = RealtimePostgresChangesPayload<BoardRoomPost>
export type WhiteboardPayload = RealtimePostgresChangesPayload<WhiteboardSnapshot>
export type SandboxPayload = RealtimePostgresChangesPayload<SandboxSession>

export interface RealtimeCallbacks {
  onMessage?: (payload: MessagePayload) => void
  onPresenceSync?: (state: PresenceState) => void
  onPresenceJoin?: (key: string, presence: UserPresence) => void
  onPresenceLeave?: (key: string, presence: UserPresence) => void
  onBroadcast?: (event: string, payload: unknown) => void
  onError?: (error: Error) => void
}

export interface ChannelConfig {
  channelName: string
  callbacks: RealtimeCallbacks
  userId?: string
  userPresence?: Partial<UserPresence>
}

// Broadcast payload types
interface TypingPayload {
  userId: string
  isTyping: boolean
}

interface AnnouncementPayload {
  message: string
}

interface SandboxOutputPayload {
  type: "stdout" | "stderr"
  data: string
}

interface SandboxStatusPayload {
  status: SandboxSession["status"]
}

interface WhiteboardDrawPayload {
  userId: string
  elements: unknown[]
}

interface WhiteboardCursorPayload {
  userId: string
  x: number
  y: number
}

// =============================================================================
// CHANNEL FACTORY
// =============================================================================

/**
 * Creates a Supabase Realtime channel with configured subscriptions
 */
export function createRealtimeChannel(config: ChannelConfig): RealtimeChannel {
  const supabase = createClient()
  const channel = supabase.channel(config.channelName)

  return channel
}

// =============================================================================
// CONSULTATION ROOM CHANNEL
// =============================================================================

/**
 * Creates a channel for a specific consultation room
 * Handles: messages, typing indicators, presence
 */
export function createConsultationChannel(
  consultationId: string,
  userId: string,
  callbacks: {
    onMessage?: (message: ConsultationMessage, eventType: "INSERT" | "UPDATE" | "DELETE") => void
    onTyping?: (userId: string, isTyping: boolean) => void
    onPresenceSync?: (users: UserPresence[]) => void
    onSandboxUpdate?: (sandbox: SandboxSession) => void
    onWhiteboardUpdate?: (snapshot: WhiteboardSnapshot) => void
    onError?: (error: Error) => void
  }
): RealtimeChannel {
  const supabase = createClient()
  const channelName = `consultation:${consultationId}`
  
  const channel = supabase.channel(channelName, {
    config: {
      presence: {
        key: userId,
      },
    },
  })

  // Subscribe to new messages
  channel.on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "consultation_messages",
      filter: `consultation_id=eq.${consultationId}`,
    },
    (payload: RealtimePostgresChangesPayload<ConsultationMessage>) => {
      if (callbacks.onMessage) {
        callbacks.onMessage(
          payload.new as ConsultationMessage,
          payload.eventType as "INSERT" | "UPDATE" | "DELETE"
        )
      }
    }
  )

  // Subscribe to sandbox updates
  channel.on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "sandbox_sessions",
      filter: `consultation_id=eq.${consultationId}`,
    },
    (payload: RealtimePostgresChangesPayload<SandboxSession>) => {
      if (callbacks.onSandboxUpdate) {
        callbacks.onSandboxUpdate(payload.new as SandboxSession)
      }
    }
  )

  // Subscribe to whiteboard updates
  channel.on(
    "postgres_changes",
    {
      event: "INSERT",
      schema: "public",
      table: "whiteboard_snapshots",
      filter: `consultation_id=eq.${consultationId}`,
    },
    (payload: RealtimePostgresChangesPayload<WhiteboardSnapshot>) => {
      if (callbacks.onWhiteboardUpdate) {
        callbacks.onWhiteboardUpdate(payload.new as WhiteboardSnapshot)
      }
    }
  )

  // Handle typing indicators via broadcast
  channel.on("broadcast", { event: "typing" }, (message: { payload: TypingPayload }) => {
    if (callbacks.onTyping) {
      callbacks.onTyping(message.payload.userId, message.payload.isTyping)
    }
  })

  // Handle presence
  channel.on("presence", { event: "sync" }, () => {
    if (callbacks.onPresenceSync) {
      const state = channel.presenceState()
      const users = Object.values(state).flat() as UserPresence[]
      callbacks.onPresenceSync(users)
    }
  })

  return channel
}

/**
 * Helper to broadcast typing status
 */
export function broadcastTyping(
  channel: RealtimeChannel,
  userId: string,
  isTyping: boolean
): void {
  channel.send({
    type: "broadcast",
    event: "typing",
    payload: { userId, isTyping },
  })
}

/**
 * Helper to track user presence in consultation
 */
export async function trackConsultationPresence(
  channel: RealtimeChannel,
  presence: Partial<UserPresence>
): Promise<void> {
  await channel.track(presence)
}

// =============================================================================
// BOARD ROOM CHANNEL
// =============================================================================

/**
 * Creates a channel for the Board Room (social lounge)
 * Handles: posts, presence, announcements
 */
export function createBoardRoomChannel(
  userId: string,
  callbacks: {
    onPost?: (post: BoardRoomPost, eventType: "INSERT" | "UPDATE" | "DELETE") => void
    onPresenceSync?: (users: UserPresence[]) => void
    onPresenceJoin?: (user: UserPresence) => void
    onPresenceLeave?: (user: UserPresence) => void
    onAnnouncement?: (message: string) => void
    onError?: (error: Error) => void
  }
): RealtimeChannel {
  const supabase = createClient()
  const channelName = "board-room"
  
  const channel = supabase.channel(channelName, {
    config: {
      presence: {
        key: userId,
      },
    },
  })

  // Subscribe to new posts
  channel.on(
    "postgres_changes",
    {
      event: "*",
      schema: "public",
      table: "board_room_posts",
    },
    (payload: RealtimePostgresChangesPayload<BoardRoomPost>) => {
      if (callbacks.onPost) {
        callbacks.onPost(
          payload.new as BoardRoomPost,
          payload.eventType as "INSERT" | "UPDATE" | "DELETE"
        )
      }
    }
  )

  // Handle presence sync
  channel.on("presence", { event: "sync" }, () => {
    if (callbacks.onPresenceSync) {
      const state = channel.presenceState()
      const users = Object.values(state).flat() as UserPresence[]
      callbacks.onPresenceSync(users)
    }
  })

  // Handle presence join
  channel.on("presence", { event: "join" }, ({ key, newPresences }: { key: string; newPresences: unknown[] }) => {
    if (callbacks.onPresenceJoin && newPresences.length > 0) {
      callbacks.onPresenceJoin(newPresences[0] as UserPresence)
    }
  })

  // Handle presence leave
  channel.on("presence", { event: "leave" }, ({ key, leftPresences }: { key: string; leftPresences: unknown[] }) => {
    if (callbacks.onPresenceLeave && leftPresences.length > 0) {
      callbacks.onPresenceLeave(leftPresences[0] as UserPresence)
    }
  })

  // Handle system announcements via broadcast
  channel.on("broadcast", { event: "announcement" }, (message: { payload: AnnouncementPayload }) => {
    if (callbacks.onAnnouncement) {
      callbacks.onAnnouncement(message.payload.message)
    }
  })

  return channel
}

/**
 * Track presence in Board Room
 */
export async function trackBoardRoomPresence(
  channel: RealtimeChannel,
  presence: Partial<UserPresence>
): Promise<void> {
  await channel.track(presence)
}

/**
 * Broadcast announcement to Board Room
 */
export function broadcastAnnouncement(
  channel: RealtimeChannel,
  message: string
): void {
  channel.send({
    type: "broadcast",
    event: "announcement",
    payload: { message },
  })
}

// =============================================================================
// SANDBOX OUTPUT CHANNEL
// =============================================================================

/**
 * Creates a channel for streaming sandbox output
 * Used for real-time terminal output during code execution
 */
export function createSandboxOutputChannel(
  sandboxSessionId: string,
  callbacks: {
    onOutput?: (output: { type: "stdout" | "stderr"; data: string }) => void
    onStatus?: (status: SandboxSession["status"]) => void
    onError?: (error: Error) => void
  }
): RealtimeChannel {
  const supabase = createClient()
  const channelName = `sandbox:${sandboxSessionId}`
  
  const channel = supabase.channel(channelName)

  // Handle output broadcast
  channel.on("broadcast", { event: "output" }, (message: { payload: SandboxOutputPayload }) => {
    if (callbacks.onOutput) {
      callbacks.onOutput(message.payload)
    }
  })

  // Handle status broadcast
  channel.on("broadcast", { event: "status" }, (message: { payload: SandboxStatusPayload }) => {
    if (callbacks.onStatus) {
      callbacks.onStatus(message.payload.status)
    }
  })

  return channel
}

/**
 * Broadcast sandbox output (called from server action via separate mechanism)
 * Note: This is typically called from the server, but we expose for client-side testing
 */
export function broadcastSandboxOutput(
  channel: RealtimeChannel,
  output: { type: "stdout" | "stderr"; data: string }
): void {
  channel.send({
    type: "broadcast",
    event: "output",
    payload: output,
  })
}

// =============================================================================
// WHITEBOARD CHANNEL
// =============================================================================

/**
 * Creates a channel for real-time whiteboard collaboration
 */
export function createWhiteboardChannel(
  consultationId: string,
  callbacks: {
    onDraw?: (data: { userId: string; elements: unknown[] }) => void
    onCursor?: (data: { userId: string; x: number; y: number }) => void
    onClear?: () => void
    onError?: (error: Error) => void
  }
): RealtimeChannel {
  const supabase = createClient()
  const channelName = `whiteboard:${consultationId}`
  
  const channel = supabase.channel(channelName)

  // Handle draw events
  channel.on("broadcast", { event: "draw" }, (message: { payload: WhiteboardDrawPayload }) => {
    if (callbacks.onDraw) {
      callbacks.onDraw(message.payload)
    }
  })

  // Handle cursor position updates
  channel.on("broadcast", { event: "cursor" }, (message: { payload: WhiteboardCursorPayload }) => {
    if (callbacks.onCursor) {
      callbacks.onCursor(message.payload)
    }
  })

  // Handle clear events
  channel.on("broadcast", { event: "clear" }, () => {
    if (callbacks.onClear) {
      callbacks.onClear()
    }
  })

  return channel
}

/**
 * Broadcast whiteboard draw event
 */
export function broadcastWhiteboardDraw(
  channel: RealtimeChannel,
  userId: string,
  elements: unknown[]
): void {
  channel.send({
    type: "broadcast",
    event: "draw",
    payload: { userId, elements },
  })
}

/**
 * Broadcast cursor position
 */
export function broadcastCursor(
  channel: RealtimeChannel,
  userId: string,
  x: number,
  y: number
): void {
  channel.send({
    type: "broadcast",
    event: "cursor",
    payload: { userId, x, y },
  })
}

// =============================================================================
// CHANNEL LIFECYCLE HELPERS
// =============================================================================

/**
 * Subscribe to a channel
 */
export async function subscribeChannel(channel: RealtimeChannel): Promise<void> {
  return new Promise((resolve, reject) => {
    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        resolve()
      } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
        reject(new Error(`Channel subscription failed: ${status}`))
      }
    })
  })
}

/**
 * Unsubscribe from a channel
 */
export async function unsubscribeChannel(channel: RealtimeChannel): Promise<void> {
  const supabase = createClient()
  await supabase.removeChannel(channel)
}

/**
 * Get all active channels
 */
export function getActiveChannels(): RealtimeChannel[] {
  const supabase = createClient()
  return supabase.getChannels()
}

/**
 * Remove all channels (cleanup)
 */
export async function removeAllChannels(): Promise<void> {
  const supabase = createClient()
  await supabase.removeAllChannels()
}

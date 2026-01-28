"use client"

/**
 * React Hooks for Supabase Realtime
 * 
 * Provides easy-to-use hooks for real-time features:
 * - useConsultationRoom: Messages, presence, typing
 * - useBoardRoom: Posts, online users
 * - useSandboxOutput: Terminal streaming
 * - useWhiteboard: Collaborative drawing
 */

import { useEffect, useRef, useState, useCallback } from "react"
import type { RealtimeChannel } from "@supabase/supabase-js"
import {
  createConsultationChannel,
  createBoardRoomChannel,
  createSandboxOutputChannel,
  createWhiteboardChannel,
  subscribeChannel,
  unsubscribeChannel,
  broadcastTyping,
  broadcastWhiteboardDraw,
  broadcastCursor,
  trackConsultationPresence,
  trackBoardRoomPresence,
} from "@/lib/realtime-client"
import type {
  ConsultationMessage,
  BoardRoomPost,
  UserPresence,
  SandboxSession,
  WhiteboardSnapshot,
} from "@/types/consultations"

// =============================================================================
// CONSULTATION ROOM HOOK
// =============================================================================

export interface UseConsultationRoomOptions {
  consultationId: string
  userId: string
  userPresence?: Partial<UserPresence>
  onMessage?: (message: ConsultationMessage, eventType: "INSERT" | "UPDATE" | "DELETE") => void
  onSandboxUpdate?: (sandbox: SandboxSession) => void
  onWhiteboardUpdate?: (snapshot: WhiteboardSnapshot) => void
}

export interface UseConsultationRoomReturn {
  isConnected: boolean
  error: Error | null
  typingUsers: string[]
  onlineUsers: UserPresence[]
  sendTypingIndicator: (isTyping: boolean) => void
}

export function useConsultationRoom(
  options: UseConsultationRoomOptions
): UseConsultationRoomReturn {
  const { consultationId, userId, userPresence, onMessage, onSandboxUpdate, onWhiteboardUpdate } = options
  
  const channelRef = useRef<RealtimeChannel | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([])

  // Initialize channel
  useEffect(() => {
    if (!consultationId || !userId) return

    const channel = createConsultationChannel(consultationId, userId, {
      onMessage,
      onTyping: (typingUserId, isTyping) => {
        setTypingUsers((prev) => {
          if (isTyping && !prev.includes(typingUserId)) {
            return [...prev, typingUserId]
          }
          if (!isTyping) {
            return prev.filter((id) => id !== typingUserId)
          }
          return prev
        })
      },
      onPresenceSync: setOnlineUsers,
      onSandboxUpdate,
      onWhiteboardUpdate,
      onError: setError,
    })

    channelRef.current = channel

    // Subscribe and track presence
    subscribeChannel(channel)
      .then(() => {
        setIsConnected(true)
        if (userPresence) {
          trackConsultationPresence(channel, userPresence)
        }
      })
      .catch(setError)

    // Cleanup
    return () => {
      if (channelRef.current) {
        unsubscribeChannel(channelRef.current)
        channelRef.current = null
        setIsConnected(false)
      }
    }
  }, [consultationId, userId])

  // Send typing indicator
  const sendTypingIndicator = useCallback(
    (isTyping: boolean) => {
      if (channelRef.current && isConnected) {
        broadcastTyping(channelRef.current, userId, isTyping)
      }
    },
    [userId, isConnected]
  )

  return {
    isConnected,
    error,
    typingUsers,
    onlineUsers,
    sendTypingIndicator,
  }
}

// =============================================================================
// BOARD ROOM HOOK
// =============================================================================

export interface UseBoardRoomOptions {
  userId: string
  userPresence?: Partial<UserPresence>
  onPost?: (post: BoardRoomPost, eventType: "INSERT" | "UPDATE" | "DELETE") => void
  onAnnouncement?: (message: string) => void
}

export interface UseBoardRoomReturn {
  isConnected: boolean
  error: Error | null
  onlineUsers: UserPresence[]
}

export function useBoardRoom(options: UseBoardRoomOptions): UseBoardRoomReturn {
  const { userId, userPresence, onPost, onAnnouncement } = options
  
  const channelRef = useRef<RealtimeChannel | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [onlineUsers, setOnlineUsers] = useState<UserPresence[]>([])

  useEffect(() => {
    if (!userId) return

    const channel = createBoardRoomChannel(userId, {
      onPost,
      onPresenceSync: setOnlineUsers,
      onPresenceJoin: (user) => {
        setOnlineUsers((prev) => [...prev.filter((u) => u.user_id !== user.user_id), user])
      },
      onPresenceLeave: (user) => {
        setOnlineUsers((prev) => prev.filter((u) => u.user_id !== user.user_id))
      },
      onAnnouncement,
      onError: setError,
    })

    channelRef.current = channel

    subscribeChannel(channel)
      .then(() => {
        setIsConnected(true)
        if (userPresence) {
          trackBoardRoomPresence(channel, userPresence)
        }
      })
      .catch(setError)

    return () => {
      if (channelRef.current) {
        unsubscribeChannel(channelRef.current)
        channelRef.current = null
        setIsConnected(false)
      }
    }
  }, [userId])

  return {
    isConnected,
    error,
    onlineUsers,
  }
}

// =============================================================================
// SANDBOX OUTPUT HOOK
// =============================================================================

export interface UseSandboxOutputOptions {
  sandboxSessionId: string | null
  onOutput?: (output: { type: "stdout" | "stderr"; data: string }) => void
  onStatus?: (status: SandboxSession["status"]) => void
}

export interface UseSandboxOutputReturn {
  isConnected: boolean
  error: Error | null
  outputHistory: Array<{ type: "stdout" | "stderr"; data: string; timestamp: Date }>
  clearOutput: () => void
}

export function useSandboxOutput(options: UseSandboxOutputOptions): UseSandboxOutputReturn {
  const { sandboxSessionId, onOutput, onStatus } = options
  
  const channelRef = useRef<RealtimeChannel | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [outputHistory, setOutputHistory] = useState<
    Array<{ type: "stdout" | "stderr"; data: string; timestamp: Date }>
  >([])

  useEffect(() => {
    if (!sandboxSessionId) {
      setIsConnected(false)
      return
    }

    const channel = createSandboxOutputChannel(sandboxSessionId, {
      onOutput: (output) => {
        setOutputHistory((prev) => [...prev, { ...output, timestamp: new Date() }])
        onOutput?.(output)
      },
      onStatus,
      onError: setError,
    })

    channelRef.current = channel

    subscribeChannel(channel)
      .then(() => setIsConnected(true))
      .catch(setError)

    return () => {
      if (channelRef.current) {
        unsubscribeChannel(channelRef.current)
        channelRef.current = null
        setIsConnected(false)
      }
    }
  }, [sandboxSessionId])

  const clearOutput = useCallback(() => {
    setOutputHistory([])
  }, [])

  return {
    isConnected,
    error,
    outputHistory,
    clearOutput,
  }
}

// =============================================================================
// WHITEBOARD HOOK
// =============================================================================

export interface UseWhiteboardOptions {
  consultationId: string
  userId: string
  onDraw?: (data: { userId: string; elements: unknown[] }) => void
  onCursor?: (data: { userId: string; x: number; y: number }) => void
  onClear?: () => void
}

export interface UseWhiteboardReturn {
  isConnected: boolean
  error: Error | null
  remoteCursors: Map<string, { x: number; y: number }>
  sendDraw: (elements: unknown[]) => void
  sendCursor: (x: number, y: number) => void
  sendClear: () => void
}

export function useWhiteboard(options: UseWhiteboardOptions): UseWhiteboardReturn {
  const { consultationId, userId, onDraw, onCursor, onClear } = options
  
  const channelRef = useRef<RealtimeChannel | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [remoteCursors, setRemoteCursors] = useState<Map<string, { x: number; y: number }>>(
    new Map()
  )

  useEffect(() => {
    if (!consultationId || !userId) return

    const channel = createWhiteboardChannel(consultationId, {
      onDraw,
      onCursor: (data) => {
        if (data.userId !== userId) {
          setRemoteCursors((prev) => {
            const newMap = new Map(prev)
            newMap.set(data.userId, { x: data.x, y: data.y })
            return newMap
          })
        }
        onCursor?.(data)
      },
      onClear,
      onError: setError,
    })

    channelRef.current = channel

    subscribeChannel(channel)
      .then(() => setIsConnected(true))
      .catch(setError)

    return () => {
      if (channelRef.current) {
        unsubscribeChannel(channelRef.current)
        channelRef.current = null
        setIsConnected(false)
      }
    }
  }, [consultationId, userId])

  const sendDraw = useCallback(
    (elements: unknown[]) => {
      if (channelRef.current && isConnected) {
        broadcastWhiteboardDraw(channelRef.current, userId, elements)
      }
    },
    [userId, isConnected]
  )

  const sendCursor = useCallback(
    (x: number, y: number) => {
      if (channelRef.current && isConnected) {
        broadcastCursor(channelRef.current, userId, x, y)
      }
    },
    [userId, isConnected]
  )

  const sendClear = useCallback(() => {
    if (channelRef.current && isConnected) {
      channelRef.current.send({
        type: "broadcast",
        event: "clear",
        payload: {},
      })
    }
  }, [isConnected])

  return {
    isConnected,
    error,
    remoteCursors,
    sendDraw,
    sendCursor,
    sendClear,
  }
}

// =============================================================================
// PRESENCE HOOK (Generic)
// =============================================================================

export interface UsePresenceOptions {
  channelName: string
  userId: string
  presence?: Record<string, unknown>
}

export interface UsePresenceReturn {
  isConnected: boolean
  presenceState: Record<string, unknown[]>
  updatePresence: (presence: Record<string, unknown>) => void
}

export function usePresence(options: UsePresenceOptions): UsePresenceReturn {
  const { channelName, userId, presence } = options
  
  const channelRef = useRef<RealtimeChannel | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [presenceState, setPresenceState] = useState<Record<string, unknown[]>>({})

  useEffect(() => {
    if (!channelName || !userId) return

    const supabase = require("@/lib/supabase-client").createClient()
    
    const channel = supabase.channel(channelName, {
      config: {
        presence: {
          key: userId,
        },
      },
    })

    channel.on("presence", { event: "sync" }, () => {
      setPresenceState(channel.presenceState())
    })

    channelRef.current = channel

    channel.subscribe((status: string) => {
      if (status === "SUBSCRIBED") {
        setIsConnected(true)
        if (presence) {
          channel.track(presence)
        }
      }
    })

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
        setIsConnected(false)
      }
    }
  }, [channelName, userId])

  const updatePresence = useCallback(
    (newPresence: Record<string, unknown>) => {
      if (channelRef.current && isConnected) {
        channelRef.current.track(newPresence)
      }
    },
    [isConnected]
  )

  return {
    isConnected,
    presenceState,
    updatePresence,
  }
}

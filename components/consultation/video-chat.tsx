"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { DailyProvider, useMeetingState, useParticipantIds, useScreenShare, useDaily } from "@daily-co/daily-react"
import { Video, VideoOff, Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ParticipantVideo, ScreenShareVideo } from "./participant-video"
import { VideoControls } from "./video-controls"
import { 
  createVideoRoom, 
  joinVideoRoom, 
  endVideoRoom,
  logVideoCallStart,
  logVideoCallEnd
} from "@/app/actions/video-actions"

// =============================================================================
// TYPES
// =============================================================================

interface VideoChatProps {
  consultationId: string
  currentUserId: string
  className?: string
  onCallStart?: () => void
  onCallEnd?: () => void
}

interface VideoRoomState {
  roomUrl: string | null
  roomName: string | null
  token: string | null
  callLogId: string | null
}

// =============================================================================
// INNER COMPONENT (Uses Daily hooks - must be inside DailyProvider)
// =============================================================================

interface VideoChatInnerProps {
  consultationId: string
  currentUserId: string
  roomUrl: string
  roomName: string
  callLogId: string | null
  onLeave: () => void
  className?: string
}

function VideoChatInner({ 
  consultationId,
  currentUserId,
  roomUrl, 
  roomName, 
  callLogId,
  onLeave,
  className 
}: VideoChatInnerProps) {
  const meetingState = useMeetingState()
  const daily = useDaily()
  const participantIds = useParticipantIds({ filter: "remote" })
  const localParticipantIds = useParticipantIds({ filter: "local" })
  const { screens } = useScreenShare()
  const [isLeaving, setIsLeaving] = useState(false)
  const screenShareStartTime = useRef<number | null>(null)
  const [screenShareDuration, setScreenShareDuration] = useState(0)

  // Track screen share duration
  useEffect(() => {
    if (screens.length > 0 && !screenShareStartTime.current) {
      screenShareStartTime.current = Date.now()
    } else if (screens.length === 0 && screenShareStartTime.current) {
      const duration = Math.floor((Date.now() - screenShareStartTime.current) / 1000)
      setScreenShareDuration(prev => prev + duration)
      screenShareStartTime.current = null
    }
  }, [screens.length])

  const handleLeave = useCallback(async () => {
    setIsLeaving(true)
    
    // Log the call end
    if (callLogId) {
      const finalScreenShareDuration = screenShareStartTime.current 
        ? screenShareDuration + Math.floor((Date.now() - screenShareStartTime.current) / 1000)
        : screenShareDuration

      await logVideoCallEnd({
        log_id: callLogId,
        screen_shared: finalScreenShareDuration > 0,
        screen_share_duration_seconds: finalScreenShareDuration,
      })
    }

    // Leave the call
    if (daily) {
      await daily.leave()
    }
    
    onLeave()
  }, [daily, callLogId, screenShareDuration, onLeave])

  // Get local participant session ID
  const localSessionId = localParticipantIds[0]
  // Get active screen share session ID (if any)
  // screens array contains { oderId: string, session_id: string, screenId: number }
  const screenShareSession = screens[0]?.session_id

  // Connection states
  if (meetingState === "joining-meeting") {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full gap-4", className)}>
        <Loader2 className="h-12 w-12 animate-spin text-sky-400" />
        <p className="text-slate-400">Joining video call...</p>
      </div>
    )
  }

  if (meetingState === "error") {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full gap-4", className)}>
        <AlertCircle className="h-12 w-12 text-red-400" />
        <p className="text-red-400">Failed to connect to video call</p>
        <Button onClick={onLeave} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  if (meetingState === "left-meeting") {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full gap-4", className)}>
        <VideoOff className="h-12 w-12 text-slate-400" />
        <p className="text-slate-400">Call ended</p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Video grid */}
      <div className="flex-1 p-4 relative">
        {/* Screen share takes priority when active */}
        {screenShareSession && (
          <div className="absolute inset-4 flex flex-col gap-4">
            <ScreenShareVideo 
              sessionId={screenShareSession} 
              className="flex-1 min-h-0"
            />
            {/* Small video tiles when screen sharing */}
            <div className="flex gap-2 h-32">
              {localSessionId && (
                <ParticipantVideo 
                  sessionId={localSessionId} 
                  isLocal 
                  className="w-48"
                />
              )}
              {participantIds.map(id => (
                <ParticipantVideo 
                  key={id} 
                  sessionId={id} 
                  className="w-48"
                />
              ))}
            </div>
          </div>
        )}

        {/* Normal video layout when no screen share */}
        {!screenShareSession && (
          <div className="h-full flex gap-4">
            {/* Remote participant (or waiting message) */}
            <div className="flex-1 min-w-0">
              {participantIds.length > 0 ? (
                <ParticipantVideo 
                  sessionId={participantIds[0]} 
                  className="h-full"
                />
              ) : (
                <div className="h-full rounded-xl bg-slate-800/50 border border-white/10 flex flex-col items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
                    <Video className="h-10 w-10 text-slate-500" />
                  </div>
                  <p className="text-slate-400 text-lg">Waiting for other participant...</p>
                  <p className="text-slate-500 text-sm mt-2">Share this room link to invite them</p>
                </div>
              )}
            </div>

            {/* Local participant (smaller, picture-in-picture style) */}
            {localSessionId && (
              <div className="w-64 flex-shrink-0">
                <ParticipantVideo 
                  sessionId={localSessionId} 
                  isLocal 
                  className="h-full"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 flex justify-center">
        <VideoControls 
          onLeave={handleLeave}
          isLeaving={isLeaving}
        />
      </div>
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function VideoChat({ 
  consultationId, 
  currentUserId,
  className,
  onCallStart,
  onCallEnd
}: VideoChatProps) {
  const [roomState, setRoomState] = useState<VideoRoomState>({
    roomUrl: null,
    roomName: null,
    token: null,
    callLogId: null,
  })
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInCall, setIsInCall] = useState(false)

  // Start a new video call
  const startCall = async () => {
    setIsCreating(true)
    setError(null)

    try {
      const result = await createVideoRoom(consultationId)
      
      if (!result.success || !result.room || !result.token) {
        setError(result.error || "Failed to create video room")
        setIsCreating(false)
        return
      }

      // Log the call start
      const logResult = await logVideoCallStart({
        consultation_id: consultationId,
        room_name: result.room.name,
        room_url: result.room.url,
      })

      setRoomState({
        roomUrl: result.room.url,
        roomName: result.room.name,
        token: result.token,
        callLogId: logResult.success ? logResult.log_id || null : null,
      })
      setIsInCall(true)
      onCallStart?.()
    } catch (err) {
      console.error("Error starting call:", err)
      setError(err instanceof Error ? err.message : "Failed to start video call")
    } finally {
      setIsCreating(false)
    }
  }

  // Join an existing video call
  const joinCall = async (roomName: string) => {
    setIsCreating(true)
    setError(null)

    try {
      const result = await joinVideoRoom(consultationId, roomName)
      
      if (!result.success || !result.room || !result.token) {
        setError(result.error || "Failed to join video room")
        setIsCreating(false)
        return
      }

      // Log the call start
      const logResult = await logVideoCallStart({
        consultation_id: consultationId,
        room_name: result.room.name,
        room_url: result.room.url,
      })

      setRoomState({
        roomUrl: result.room.url,
        roomName: result.room.name,
        token: result.token,
        callLogId: logResult.success ? logResult.log_id || null : null,
      })
      setIsInCall(true)
      onCallStart?.()
    } catch (err) {
      console.error("Error joining call:", err)
      setError(err instanceof Error ? err.message : "Failed to join video call")
    } finally {
      setIsCreating(false)
    }
  }

  // End the call and cleanup
  const endCall = useCallback(async () => {
    if (roomState.roomName) {
      await endVideoRoom(roomState.roomName)
    }
    
    setRoomState({
      roomUrl: null,
      roomName: null,
      token: null,
      callLogId: null,
    })
    setIsInCall(false)
    onCallEnd?.()
  }, [roomState.roomName, onCallEnd])

  // Not in a call - show start button
  if (!isInCall || !roomState.roomUrl || !roomState.token) {
    return (
      <div className={cn("flex flex-col h-full", className)}>
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-semibold text-slate-50">Video Call</h3>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
          <div className="h-24 w-24 rounded-full bg-sky-500/10 flex items-center justify-center">
            <Video className="h-12 w-12 text-sky-400" />
          </div>
          
          <div className="text-center">
            <h4 className="text-xl font-semibold text-slate-50 mb-2">
              Start Video Consultation
            </h4>
            <p className="text-slate-400 max-w-md">
              Connect face-to-face with your consultant. Includes screen sharing 
              for demonstrations and collaborative work.
            </p>
          </div>

          {error && (
            <div className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <Button
            onClick={startCall}
            disabled={isCreating}
            className="bg-sky-500 hover:bg-sky-400 text-white px-8 py-6 text-lg"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Video className="h-5 w-5 mr-2" />
                Start Video Call
              </>
            )}
          </Button>

          <p className="text-xs text-slate-500">
            Video calls are limited to 2 participants • 4 hour maximum duration
          </p>
        </div>
      </div>
    )
  }

  // In a call - show video interface
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <DailyProvider
        url={roomState.roomUrl}
        token={roomState.token}
      >
        <VideoChatInner
          consultationId={consultationId}
          currentUserId={currentUserId}
          roomUrl={roomState.roomUrl}
          roomName={roomState.roomName!}
          callLogId={roomState.callLogId}
          onLeave={endCall}
          className="flex-1 min-h-0"
        />
      </DailyProvider>
    </div>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export { VideoControls } from "./video-controls"
export { ParticipantVideo, ScreenShareVideo } from "./participant-video"

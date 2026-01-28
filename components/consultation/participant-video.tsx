"use client"

import { useParticipantProperty, DailyVideo } from "@daily-co/daily-react"
import { User, Mic, MicOff, Video, VideoOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface ParticipantVideoProps {
  sessionId: string
  isLocal?: boolean
  className?: string
}

export function ParticipantVideo({ sessionId, isLocal = false, className }: ParticipantVideoProps) {
  const userName = useParticipantProperty(sessionId, "user_name")
  const videoState = useParticipantProperty(sessionId, "tracks.video.state")
  const audioState = useParticipantProperty(sessionId, "tracks.audio.state")
  const isScreenShare = useParticipantProperty(sessionId, "tracks.screenVideo.state")
  
  const hasVideo = videoState === "playable" || videoState === "loading"
  const hasAudio = audioState === "playable" || audioState === "loading"
  const isSharingScreen = isScreenShare === "playable" || isScreenShare === "loading"

  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden bg-slate-800/50 border border-white/10",
        isLocal && "ring-2 ring-sky-500/50",
        className
      )}
    >
      {/* Video or placeholder */}
      {hasVideo ? (
        <DailyVideo
          sessionId={sessionId}
          type="video"
          automirror={isLocal}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
          <div className="flex flex-col items-center gap-2">
            <div className="h-16 w-16 rounded-full bg-slate-700 flex items-center justify-center">
              <User className="h-8 w-8 text-slate-400" />
            </div>
            <span className="text-sm text-slate-400">Camera Off</span>
          </div>
        </div>
      )}

      {/* Screen share indicator */}
      {isSharingScreen && (
        <div className="absolute top-2 left-2 px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/30">
          <span className="text-xs text-emerald-400 font-medium">Sharing Screen</span>
        </div>
      )}

      {/* Participant info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white truncate max-w-[150px]">
              {userName || (isLocal ? "You" : "Participant")}
              {isLocal && <span className="text-xs text-slate-400 ml-1">(You)</span>}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            {/* Audio indicator */}
            <div
              className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center",
                hasAudio ? "bg-slate-700/80" : "bg-red-500/20"
              )}
            >
              {hasAudio ? (
                <Mic className="h-3 w-3 text-white" />
              ) : (
                <MicOff className="h-3 w-3 text-red-400" />
              )}
            </div>
            
            {/* Video indicator */}
            <div
              className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center",
                hasVideo ? "bg-slate-700/80" : "bg-red-500/20"
              )}
            >
              {hasVideo ? (
                <Video className="h-3 w-3 text-white" />
              ) : (
                <VideoOff className="h-3 w-3 text-red-400" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Screen share video component
 */
interface ScreenShareVideoProps {
  sessionId: string
  className?: string
}

export function ScreenShareVideo({ sessionId, className }: ScreenShareVideoProps) {
  const userName = useParticipantProperty(sessionId, "user_name")
  
  return (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden bg-slate-900 border border-emerald-500/30",
        className
      )}
    >
      <DailyVideo
        sessionId={sessionId}
        type="screenVideo"
        className="w-full h-full object-contain"
      />
      
      {/* Label */}
      <div className="absolute top-2 left-2 px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/30">
        <span className="text-xs text-emerald-400 font-medium">
          {userName ? `${userName}'s screen` : "Screen Share"}
        </span>
      </div>
    </div>
  )
}

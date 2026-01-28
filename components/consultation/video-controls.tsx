"use client"

import { useDaily, useLocalParticipant, useScreenShare } from "@daily-co/daily-react"
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  MonitorUp, 
  MonitorOff,
  PhoneOff,
  Settings,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface VideoControlsProps {
  onLeave: () => void
  isLeaving?: boolean
  className?: string
}

export function VideoControls({ onLeave, isLeaving = false, className }: VideoControlsProps) {
  const daily = useDaily()
  const localParticipant = useLocalParticipant()
  const { startScreenShare, stopScreenShare, isSharingScreen } = useScreenShare()

  const audioState = localParticipant?.tracks?.audio?.state
  const videoState = localParticipant?.tracks?.video?.state
  
  const isMuted = audioState !== "playable" && audioState !== "loading"
  const isVideoOff = videoState !== "playable" && videoState !== "loading"

  const toggleAudio = () => {
    if (!daily) return
    daily.setLocalAudio(!isMuted ? false : true)
  }

  const toggleVideo = () => {
    if (!daily) return
    daily.setLocalVideo(!isVideoOff ? false : true)
  }

  const toggleScreenShare = async () => {
    if (isSharingScreen) {
      stopScreenShare()
    } else {
      await startScreenShare()
    }
  }

  return (
    <TooltipProvider>
      <div className={cn(
        "flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900/80 backdrop-blur-sm border border-white/10",
        className
      )}>
        {/* Mute/Unmute */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleAudio}
              className={cn(
                "h-12 w-12 rounded-full transition-colors",
                isMuted
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : "bg-slate-700/50 text-white hover:bg-slate-700"
              )}
            >
              {isMuted ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isMuted ? "Unmute" : "Mute"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Video On/Off */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleVideo}
              className={cn(
                "h-12 w-12 rounded-full transition-colors",
                isVideoOff
                  ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  : "bg-slate-700/50 text-white hover:bg-slate-700"
              )}
            >
              {isVideoOff ? (
                <VideoOff className="h-5 w-5" />
              ) : (
                <Video className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isVideoOff ? "Turn on camera" : "Turn off camera"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Screen Share */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleScreenShare}
              className={cn(
                "h-12 w-12 rounded-full transition-colors",
                isSharingScreen
                  ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                  : "bg-slate-700/50 text-white hover:bg-slate-700"
              )}
            >
              {isSharingScreen ? (
                <MonitorOff className="h-5 w-5" />
              ) : (
                <MonitorUp className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isSharingScreen ? "Stop sharing" : "Share screen"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-8 bg-white/10 mx-1" />

        {/* Leave Call */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLeave}
              disabled={isLeaving}
              className="h-12 w-12 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300"
            >
              {isLeaving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <PhoneOff className="h-5 w-5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Leave call</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}

/**
 * Minimal controls for picture-in-picture or small view
 */
interface MiniControlsProps {
  onExpand?: () => void
  className?: string
}

export function MiniVideoControls({ onExpand, className }: MiniControlsProps) {
  const daily = useDaily()
  const localParticipant = useLocalParticipant()

  const audioState = localParticipant?.tracks?.audio?.state
  const videoState = localParticipant?.tracks?.video?.state
  
  const isMuted = audioState !== "playable" && audioState !== "loading"
  const isVideoOff = videoState !== "playable" && videoState !== "loading"

  const toggleAudio = () => {
    if (!daily) return
    daily.setLocalAudio(!isMuted ? false : true)
  }

  const toggleVideo = () => {
    if (!daily) return
    daily.setLocalVideo(!isVideoOff ? false : true)
  }

  return (
    <div className={cn(
      "flex items-center gap-1 p-1 rounded-lg bg-black/60 backdrop-blur-sm",
      className
    )}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleAudio}
        className={cn(
          "h-8 w-8 rounded-full",
          isMuted ? "text-red-400" : "text-white"
        )}
      >
        {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleVideo}
        className={cn(
          "h-8 w-8 rounded-full",
          isVideoOff ? "text-red-400" : "text-white"
        )}
      >
        {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
      </Button>
      
      {onExpand && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onExpand}
          className="h-8 w-8 rounded-full text-white"
        >
          <Settings className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

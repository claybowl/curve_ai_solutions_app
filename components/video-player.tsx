"use client"

import { useState, useRef } from "react"
import { Play, Volume2, VolumeX } from "lucide-react"

interface VideoPlayerProps {
  src: string
  poster?: string
  title?: string
  description?: string
}

export function VideoPlayer({ src, poster, title, description }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="relative">
      <div className="aspect-video w-full overflow-hidden rounded-xl shadow-xl bg-black relative">
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          controls
          preload="metadata"
          poster={poster}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={src} type="video/webm" />
          Your browser does not support the video tag.
        </video>

        {!isPlaying && (
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30"
            onClick={togglePlay}
          >
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Play className="h-8 w-8 text-white fill-white" />
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-4 flex space-x-2">
          <button
            className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {(title || description) && (
        <div className="mt-6 text-center">
          {title && <h3 className="text-xl font-semibold text-[#1A365D]">{title}</h3>}
          {description && <p className="text-gray-600 mt-2">{description}</p>}
        </div>
      )}
    </div>
  )
}

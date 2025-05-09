"use client"

import { useEffect, useRef } from "react"

interface VideoAvatarProps {
  src: string
  alt: string
  className?: string
}

export function VideoAvatar({ src, alt, className = "" }: VideoAvatarProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Ensure video plays when it's loaded
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error)
      })
    }
  }, [])

  return (
    <div className={`relative overflow-hidden rounded-full ${className}`}>
      <video ref={videoRef} autoPlay loop muted playsInline className="w-full h-full object-cover" aria-label={alt}>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

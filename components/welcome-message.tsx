"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WelcomeMessage() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    // Check if this is the user's first visit
    const hasUserVisitedBefore = localStorage.getItem("hasVisitedBefore")

    if (!hasUserVisitedBefore) {
      // Show welcome message immediately
      setIsVisible(true)

      // Hide after 7 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 7000)

      return () => clearTimeout(timer)
    }
  }, [])

  // Don't render anything until client-side hydration is complete
  if (!isMounted || !isVisible) return null

  return (
    <div className="fixed bottom-24 right-6 z-40 max-w-xs bg-white rounded-lg shadow-lg p-4 border border-gray-200 animate-fade-in">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
      <p className="text-sm font-medium mb-2">Welcome to Clean Machine</p>
      <p className="text-xs text-muted-foreground">
        Our Virtual Concierge is ready to assist with scheduling, service information, and more. Click the chat icon to
        experience our white-glove digital service.
      </p>
    </div>
  )
}

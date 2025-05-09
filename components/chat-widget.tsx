"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, X, ChevronDown, ChevronUp } from "lucide-react"
import CustomChat from "./custom-chat"
import Logo from "./logo"
import { cn } from "@/lib/utils"

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasVisited, setHasVisited] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [chatKey, setChatKey] = useState(Date.now()) // Used to reset chat component when needed

  useEffect(() => {
    setIsMounted(true)

    // Check if this is the user's first visit
    const hasUserVisitedBefore = localStorage.getItem("hasVisitedBefore")

    if (!hasUserVisitedBefore) {
      // If first visit, open the chat automatically after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true)
        // Mark that the user has visited before
        localStorage.setItem("hasVisitedBefore", "true")
      }, 2000) // 2-second delay for better user experience

      return () => clearTimeout(timer)
    } else {
      setHasVisited(true)
    }
  }, [])

  // Reset chat when closed completely (not just minimized)
  const handleClose = () => {
    setIsOpen(false)
    // Reset chat component when reopened
    setTimeout(() => setChatKey(Date.now()), 300)
  }

  // Don't render anything until after client-side hydration
  if (!isMounted) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div
          className={cn(
            "bg-white rounded-lg shadow-lg w-[350px] sm:w-[400px] flex flex-col overflow-hidden border border-gray-200 animate-fade-in transition-all duration-300",
            isMinimized ? "h-[60px]" : "h-[500px]",
          )}
        >
          <div className="bg-navy-dark text-ivory p-3 flex justify-between items-center">
            <div className="flex items-center">
              <div className="mr-2 h-8 w-8 bg-white rounded-full flex items-center justify-center">
                <Logo size="small" variant="dark" linkWrapper={false} />
              </div>
              <div>
                <h3 className="font-medium text-sm">Clean Machine</h3>
                <p className="text-xs text-ivory/70">Virtual Concierge</p>
              </div>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-ivory hover:bg-navy-dark/50"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-ivory hover:bg-navy-dark/50"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex-1 overflow-hidden">
              <CustomChat key={chatKey} />
            </div>
          )}
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className={`h-14 w-14 rounded-full bg-navy-dark text-ivory hover:bg-navy-dark/90 shadow-lg flex items-center justify-center ${
            !hasVisited ? "animate-pulse" : ""
          }`}
          aria-label="Open Virtual Concierge"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}

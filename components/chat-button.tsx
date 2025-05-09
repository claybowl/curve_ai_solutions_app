"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"
import { AIChat } from "@/components/ai-chat"

export function ChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-4 right-4 z-40 rounded-full w-14 h-14 p-0 bg-[#0076FF] hover:bg-[#0076FF]/90 shadow-lg"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="sr-only">Open Chat</span>
      </Button>
      <AIChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}

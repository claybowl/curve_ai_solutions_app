"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { 
  Send, 
  Loader2, 
  MoreVertical,
  Trash2,
  Copy,
  Code,
  FileText,
  Terminal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { sendMessage, getMessages, markMessagesAsRead, deleteMessage } from "@/app/actions/message-actions"
import { useConsultationRoom } from "@/hooks/use-realtime"
import type { ConsultationMessage, ConsultationMessageWithSender } from "@/types/consultations"

interface ChatPanelProps {
  consultationId: string
  currentUserId: string
  currentUserName?: string
  className?: string
}

export function ChatPanel({ 
  consultationId, 
  currentUserId,
  currentUserName,
  className 
}: ChatPanelProps) {
  const [messages, setMessages] = useState<ConsultationMessageWithSender[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Real-time hook
  const { isConnected, typingUsers, sendTypingIndicator } = useConsultationRoom({
    consultationId,
    userId: currentUserId,
    userPresence: {
      user_id: currentUserId,
      status: "online",
      current_consultation_id: consultationId,
    },
    onMessage: (message, eventType) => {
      if (eventType === "INSERT") {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m.id === message.id)) return prev
          return [...prev, message as ConsultationMessageWithSender]
        })
        // Auto-mark as read if from other user
        if (message.sender_id !== currentUserId) {
          markMessagesAsRead(consultationId, [message.id])
        }
      } else if (eventType === "DELETE") {
        setMessages((prev) => prev.filter((m) => m.id !== message.id))
      }
    },
  })

  // Load initial messages
  useEffect(() => {
    async function loadMessages() {
      setLoading(true)
      const result = await getMessages({ consultation_id: consultationId, limit: 50 })
      if (result.success && result.messages) {
        setMessages(result.messages)
        // Mark all as read
        markMessagesAsRead(consultationId)
      } else {
        setError(result.error ?? "Failed to load messages")
      }
      setLoading(false)
    }
    loadMessages()
  }, [consultationId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    sendTypingIndicator(true)
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(false)
    }, 2000)
  }, [sendTypingIndicator])

  // Send message
  const handleSend = async () => {
    if (!newMessage.trim() || sending) return

    setSending(true)
    sendTypingIndicator(false)
    
    const result = await sendMessage({
      consultation_id: consultationId,
      content: newMessage.trim(),
    })

    if (result.success && result.message) {
      // Message will be added via realtime, but add optimistically for responsiveness
      setMessages((prev) => {
        if (prev.some((m) => m.id === result.message!.id)) return prev
        const newMsg: ConsultationMessageWithSender = {
          ...result.message!,
          sender: {
            id: currentUserId,
            first_name: currentUserName?.split(" ")[0],
            last_name: currentUserName?.split(" ")[1],
            email: "",
          },
        }
        return [...prev, newMsg]
      })
      setNewMessage("")
      textareaRef.current?.focus()
    } else {
      setError(result.error ?? "Failed to send message")
    }

    setSending(false)
  }

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Delete message
  const handleDelete = async (messageId: string) => {
    const result = await deleteMessage(messageId)
    if (result.success) {
      setMessages((prev) => prev.filter((m) => m.id !== messageId))
    }
  }

  // Copy message
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  // Format timestamp
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get message icon based on type
  const getMessageIcon = (type: string) => {
    switch (type) {
      case "code_snippet":
        return <Code className="h-3 w-3" />
      case "file_share":
        return <FileText className="h-3 w-3" />
      case "sandbox_output":
        return <Terminal className="h-3 w-3" />
      default:
        return null
    }
  }

  // Get initials for avatar
  const getInitials = (sender?: ConsultationMessageWithSender["sender"]) => {
    if (!sender) return "?"
    if (sender.first_name && sender.last_name) {
      return `${sender.first_name[0]}${sender.last_name[0]}`.toUpperCase()
    }
    if (sender.email) {
      return sender.email[0].toUpperCase()
    }
    return "?"
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.created_at).toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {} as Record<string, ConsultationMessageWithSender[]>)

  if (loading) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Connection Status */}
      <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-semibold text-slate-50">Chat</h3>
        <div className="flex items-center gap-2">
          <span className={cn(
            "h-2 w-2 rounded-full",
            isConnected ? "bg-emerald-400" : "bg-red-400"
          )} />
          <span className="text-xs text-slate-400">
            {isConnected ? "Connected" : "Connecting..."}
          </span>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 px-4 py-4">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            {/* Date divider */}
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-500 font-mono">{date}</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Messages for this date */}
            {dateMessages.map((message, index) => {
              const isOwn = message.sender_id === currentUserId
              const showAvatar = index === 0 || 
                dateMessages[index - 1]?.sender_id !== message.sender_id

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 mb-3 group",
                    isOwn ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  {/* Avatar */}
                  {showAvatar ? (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={message.sender?.avatar_url} />
                      <AvatarFallback className={cn(
                        "text-xs",
                        isOwn ? "bg-sky-500" : "bg-indigo-500"
                      )}>
                        {getInitials(message.sender)}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8 flex-shrink-0" />
                  )}

                  {/* Message bubble */}
                  <div className={cn(
                    "max-w-[70%] rounded-2xl px-4 py-2",
                    isOwn 
                      ? "bg-sky-500/20 border border-sky-500/30" 
                      : "bg-white/5 border border-white/10",
                    message.message_type !== "text" && "font-mono text-sm"
                  )}>
                    {/* Message type badge */}
                    {message.message_type !== "text" && (
                      <div className={cn(
                        "flex items-center gap-1.5 text-xs mb-1",
                        isOwn ? "text-sky-300" : "text-slate-400"
                      )}>
                        {getMessageIcon(message.message_type)}
                        <span>{message.message_type.replace("_", " ")}</span>
                      </div>
                    )}

                    {/* Content */}
                    <p className={cn(
                      "text-sm whitespace-pre-wrap break-words",
                      isOwn ? "text-slate-50" : "text-slate-200"
                    )}>
                      {message.content}
                    </p>

                    {/* Timestamp */}
                    <div className={cn(
                      "text-xs mt-1",
                      isOwn ? "text-sky-300/60" : "text-slate-500"
                    )}>
                      {formatTime(message.created_at)}
                    </div>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={isOwn ? "end" : "start"}>
                      <DropdownMenuItem onClick={() => handleCopy(message.content)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </DropdownMenuItem>
                      {isOwn && (
                        <DropdownMenuItem 
                          onClick={() => handleDelete(message.id)}
                          className="text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })}
          </div>
        ))}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
            <div className="flex gap-1">
              <span className="h-2 w-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="h-2 w-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="h-2 w-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span>
              {typingUsers.length === 1 
                ? "Someone is typing..." 
                : `${typingUsers.length} people typing...`}
            </span>
          </div>
        )}

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="h-16 w-16 rounded-full bg-sky-500/10 flex items-center justify-center mb-4">
              <Send className="h-8 w-8 text-sky-400" />
            </div>
            <h4 className="text-lg font-semibold text-slate-50 mb-2">
              Start the conversation
            </h4>
            <p className="text-sm text-slate-400 max-w-xs">
              Send a message to begin your consultation session.
            </p>
          </div>
        )}
      </ScrollArea>

      {/* Error display */}
      {error && (
        <div className="px-4 py-2 bg-red-500/10 border-t border-red-500/30">
          <p className="text-sm text-red-400">{error}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setError(null)}
            className="text-red-400 p-0 h-auto hover:bg-transparent"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value)
              handleTyping()
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[44px] max-h-32 resize-none bg-white/5 border-white/10 text-slate-50 placeholder:text-slate-500"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() || sending}
            className="bg-sky-500 hover:bg-sky-400 h-[44px] w-[44px] p-0"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}

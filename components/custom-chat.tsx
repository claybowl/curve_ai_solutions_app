"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Loader2, Calendar, MapPin, CheckCircle, CreditCard, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  type?: "welcome" | "standard" | "location" | "service" | "appointment" | "payment" | "error"
}

export default function CustomChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [conversationHistory, setConversationHistory] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")

  // Initialize chat with welcome message after component mounts
  useEffect(() => {
    setIsMounted(true)

    // Add welcome message
    setMessages([
      {
        id: "welcome-1",
        content: "Welcome to the Clean Machine Virtual Concierge.",
        sender: "bot",
        timestamp: new Date(),
        type: "welcome",
      },
      {
        id: "welcome-2",
        content: "I'm here to assist with all your premium mobile detailing needs. How may I help you today?",
        sender: "bot",
        timestamp: new Date(),
        type: "welcome",
      },
    ])

    // Initialize conversation history with welcome message
    setConversationHistory(["Welcome to the Clean Machine Virtual Concierge."])
  }, [])

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Initialize session ID
  useEffect(() => {
    // Try to get existing session ID from localStorage
    let id = ""
    if (typeof window !== "undefined") {
      id = localStorage.getItem("chatSessionId") || ""
      if (!id) {
        // Generate a new session ID if none exists
        id = `web_user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
        localStorage.setItem("chatSessionId", id)
      }
      setSessionId(id)
    }
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate input
    const messageText = inputValue.trim()
    if (!messageText) return

    // Create user message object
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: "user",
      timestamp: new Date(),
    }

    // Update UI immediately
    setMessages((prev) => [...prev, userMessage])
    setConversationHistory((prev) => [...prev, `User: ${messageText}`])
    setInputValue("")
    setIsLoading(true)
    setError(null)

    try {
      // Use our fallback responses for common queries without calling the API
      if (messageText.toLowerCase().includes("service area") || messageText.toLowerCase().includes("location")) {
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
        const botMessage: Message = {
          id: Date.now().toString(),
          content:
            "Clean Machine serves Tulsa and surrounding areas within a 25-mile radius. May I verify your address to confirm you're within our service area?",
          sender: "bot",
          timestamp: new Date(),
          type: "location",
        }
        setMessages((prev) => [...prev, botMessage])
        setConversationHistory((prev) => [...prev, `Bot: ${botMessage.content}`])
        return
      }

      if (messageText.toLowerCase().includes("appointment") || messageText.toLowerCase().includes("schedule")) {
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
        const botMessage: Message = {
          id: Date.now().toString(),
          content:
            "I'd be happy to help you schedule an appointment. We currently have availability this week on Thursday and Friday. What day works best for you?",
          sender: "bot",
          timestamp: new Date(),
          type: "appointment",
        }
        setMessages((prev) => [...prev, botMessage])
        setConversationHistory((prev) => [...prev, `Bot: ${botMessage.content}`])
        return
      }

      if (messageText.toLowerCase().includes("price") || messageText.toLowerCase().includes("cost")) {
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
        const botMessage: Message = {
          id: Date.now().toString(),
          content:
            "Our premium detailing packages start at $150 for our basic service. For a full vehicle detail including interior and exterior, prices range from $225-300 depending on vehicle size.",
          sender: "bot",
          timestamp: new Date(),
          type: "service",
        }
        setMessages((prev) => [...prev, botMessage])
        setConversationHistory((prev) => [...prev, `Bot: ${botMessage.content}`])
        return
      }

      // For other queries, try the API
      console.log("Sending message:", messageText)

      // Prepare request payload with the correct format for n8n
      const payload = {
        sessionId: sessionId,
        prompt: messageText, // Keep this for our API route
        message: messageText, // This is what n8n expects
        history: conversationHistory.slice(-5), // Send last 5 messages for context
      }

      console.log("Request payload:", payload)

      // Send request to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      })

      // Parse response
      const data = await response.json()
      console.log("API response:", data)

      if (!response.ok) {
        throw new Error(data.error || `Error: ${response.status}`)
      }

      // Get the response content
      const content =
        data.response || data.message || data.text || data.content || "I'm sorry, I couldn't process your request."

      // Determine message type based on content
      let messageType: Message["type"] = "standard"
      if (
        content.toLowerCase().includes("location") ||
        content.toLowerCase().includes("area") ||
        content.toLowerCase().includes("service radius") ||
        content.toLowerCase().includes("address")
      ) {
        messageType = "location"
      } else if (
        content.toLowerCase().includes("appointment") ||
        content.toLowerCase().includes("schedule") ||
        content.toLowerCase().includes("booking") ||
        content.toLowerCase().includes("availability")
      ) {
        messageType = "appointment"
      } else if (
        content.toLowerCase().includes("service") ||
        content.toLowerCase().includes("package") ||
        content.toLowerCase().includes("detail") ||
        content.toLowerCase().includes("price") ||
        content.toLowerCase().includes("cost")
      ) {
        messageType = "service"
      } else if (
        content.toLowerCase().includes("payment") ||
        content.toLowerCase().includes("paid") ||
        content.toLowerCase().includes("transaction") ||
        content.toLowerCase().includes("credit card") ||
        content.toLowerCase().includes("pay")
      ) {
        messageType = "payment"
      }

      // Create bot message
      const botMessage: Message = {
        id: Date.now().toString(),
        content: content,
        sender: "bot",
        timestamp: new Date(),
        type: messageType,
      }

      // Update UI with bot response
      setMessages((prev) => [...prev, botMessage])
      setConversationHistory((prev) => [...prev, `Bot: ${content}`])
      setRetryCount(0) // Reset retry count on successful message
    } catch (err) {
      console.error("Error sending message:", err)

      // Add an error message from the bot
      const errorMessage: Message = {
        id: Date.now().toString(),
        content:
          "I apologize, but I'm having trouble connecting to our systems. Would you like to try again or contact us directly at (918) 856-5304?",
        sender: "bot",
        timestamp: new Date(),
        type: "error",
      }

      setMessages((prev) => [...prev, errorMessage])
      setConversationHistory((prev) => [...prev, "Bot: [Connection Error]"])

      // Increment retry count
      setRetryCount((prev) => prev + 1)

      // If we've tried multiple times, suggest alternative contact
      if (retryCount >= 2) {
        setError("For immediate assistance, please call us at (918) 856-5304 or email contact@cleanmachinemobile.com")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render until client-side hydration is complete
  if (!isMounted) return null

  // Helper function to render the appropriate icon based on message type
  const renderMessageIcon = (type?: Message["type"]) => {
    switch (type) {
      case "location":
        return <MapPin className="h-4 w-4 text-gold" />
      case "appointment":
        return <Calendar className="h-4 w-4 text-gold" />
      case "service":
        return <CheckCircle className="h-4 w-4 text-gold" />
      case "payment":
        return <CreditCard className="h-4 w-4 text-gold" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-full bg-ivory/50">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "max-w-[85%] rounded-lg p-4 shadow-sm",
              message.sender === "user"
                ? "bg-navy-dark text-ivory ml-auto rounded-br-none"
                : message.type === "error"
                  ? "bg-red-50 border border-red-100 mr-auto rounded-bl-none"
                  : "bg-white border border-muted mr-auto rounded-bl-none",
            )}
          >
            {message.sender === "bot" && message.type && renderMessageIcon(message.type) && (
              <div className="flex items-center mb-2">
                {renderMessageIcon(message.type)}
                <span
                  className={cn(
                    "ml-2 text-xs font-medium uppercase tracking-wider",
                    message.type === "error" ? "text-red-500" : "text-gold",
                  )}
                >
                  {message.type === "location"
                    ? "Service Area"
                    : message.type === "appointment"
                      ? "Scheduling"
                      : message.type === "service"
                        ? "Services"
                        : message.type === "payment"
                          ? "Payment"
                          : message.type === "error"
                            ? "Connection Issue"
                            : message.type === "welcome"
                              ? "Welcome"
                              : ""}
                </span>
              </div>
            )}
            <p
              className={cn(
                "text-sm leading-relaxed",
                message.sender === "bot" ? (message.type === "error" ? "text-red-700" : "text-navy-dark") : "",
              )}
            >
              {message.content}
            </p>
            <p
              className={cn(
                "text-xs mt-2 text-right",
                message.sender === "user"
                  ? "text-ivory/70"
                  : message.type === "error"
                    ? "text-red-400"
                    : "text-muted-foreground",
              )}
            >
              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center justify-center py-3 px-4 bg-white rounded-lg shadow-sm border border-muted max-w-[85%] mr-auto">
            <Loader2 className="h-4 w-4 animate-spin text-gold" />
            <span className="ml-2 text-sm text-navy-dark font-medium">Virtual Concierge is responding...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-sm max-w-[85%] mr-auto shadow-sm">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="border-t border-muted p-4 bg-white">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="How can I assist you today?"
            className="flex-1 border-muted focus-visible:ring-navy-dark"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="bg-navy-dark text-ivory hover:bg-navy-dark/90"
            disabled={isLoading || !inputValue.trim()}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <div className="mt-2 text-center">
          <p className="text-xs text-muted-foreground">
            Your information remains secure and confidential at all times.
          </p>
        </div>
      </form>
    </div>
  )
}

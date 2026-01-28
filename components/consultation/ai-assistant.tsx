"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { 
  Bot, 
  Send, 
  Loader2, 
  Minimize2, 
  Maximize2,
  Sparkles,
  RefreshCw,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface AiAssistantProps {
  consultationId: string
  className?: string
  defaultMinimized?: boolean
}

export function AiAssistant({ 
  consultationId, 
  className,
  defaultMinimized = false 
}: AiAssistantProps) {
  const [isMinimized, setIsMinimized] = useState(defaultMinimized)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    reload,
    stop,
  } = useChat({
    api: "/api/consultation-chat",
    body: {
      consultationId,
    },
    onFinish: () => {
      // Scroll to bottom when message completes
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    },
  })

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current && !isMinimized) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isMinimized])

  // Handle keyboard submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  // Minimized state
  if (isMinimized) {
    return (
      <div className={cn("w-full", className)}>
        <button
          onClick={() => setIsMinimized(false)}
          className="w-full flex items-center justify-between px-4 py-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl hover:bg-indigo-500/20 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Bot className="h-4 w-4 text-indigo-400" />
            </div>
            <span className="font-medium text-slate-50">AI Assistant</span>
            {messages.length > 0 && (
              <span className="text-xs text-slate-400">
                ({messages.length} messages)
              </span>
            )}
          </div>
          <Maximize2 className="h-4 w-4 text-slate-400" />
        </button>
      </div>
    )
  }

  return (
    <div className={cn(
      "flex flex-col h-full bg-slate-900/50 rounded-xl border border-indigo-500/20",
      className
    )}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center">
            <Bot className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-50">AI Assistant</h3>
            <p className="text-xs text-slate-400">Context-aware help</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMinimized(true)}
          className="h-8 w-8 text-slate-400 hover:text-slate-50"
        >
          <Minimize2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 px-4 py-4">
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="h-16 w-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-indigo-400" />
            </div>
            <h4 className="text-lg font-semibold text-slate-50 mb-2">
              AI Assistant Ready
            </h4>
            <p className="text-sm text-slate-400 max-w-xs">
              I have context about this consultation session. Ask me anything 
              about the discussion, technical questions, or for suggestions.
            </p>
            <div className="mt-6 space-y-2">
              <p className="text-xs text-slate-500 font-mono">Try asking:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "Summarize our discussion",
                  "Suggest next steps",
                  "Explain this concept",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      const event = {
                        target: { value: suggestion },
                      } as React.ChangeEvent<HTMLTextAreaElement>
                      handleInputChange(event)
                      inputRef.current?.focus()
                    }}
                    className="px-3 py-1 text-xs bg-indigo-500/10 text-indigo-300 rounded-full hover:bg-indigo-500/20 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "mb-4 flex",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3",
                message.role === "user"
                  ? "bg-indigo-500/20 border border-indigo-500/30"
                  : "bg-slate-800/50 border border-white/10"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="h-3 w-3 text-indigo-400" />
                  <span className="text-xs text-indigo-400 font-medium">AI Assistant</span>
                </div>
              )}
              <p className="text-sm text-slate-200 whitespace-pre-wrap">
                {message.content}
              </p>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                <span className="text-sm text-slate-400">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex justify-center mb-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 flex items-center gap-3">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <span className="text-sm text-red-400">
                {error.message || "Failed to get response"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => reload()}
                className="text-red-400 hover:text-red-300"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask the AI assistant..."
            className="min-h-[44px] max-h-24 resize-none bg-white/5 border-white/10 text-slate-50 placeholder:text-slate-500"
            rows={1}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-indigo-500 hover:bg-indigo-400 h-[44px] w-[44px] p-0"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Both parties can see this AI assistant
        </p>
      </form>
    </div>
  )
}

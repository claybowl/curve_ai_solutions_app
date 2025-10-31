"use client"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Bot, Send, User, X } from "lucide-react"

export function AIChat({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('Chat error:', error)
    }
  })

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-md">
      <Card className="border-2 border-[#0076FF] shadow-xl">
        <CardHeader className="bg-gradient-to-r from-[#0076FF] to-[#1A365D] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <CardTitle>Curve AI Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <CardDescription className="text-gray-100">
            Powered by Donjon AI Agent - Ask me anything about AI solutions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 h-[400px] overflow-y-auto flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg">
              <p className="text-sm font-medium">Error: {error.message}</p>
            </div>
          )}
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <Bot className="h-12 w-12 mb-4 text-[#0076FF]" />
              <p className="text-lg font-medium">How can I help you today?</p>
              <p className="text-sm">Ask me about AI solutions, data analysis, or business optimization.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-2 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-[#0076FF] text-white rounded-l-lg rounded-br-lg"
                      : "bg-gray-100 text-gray-800 rounded-r-lg rounded-bl-lg"
                  } p-3`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className="whitespace-pre-wrap">
                    {typeof message.content === 'string' 
                      ? message.content 
                      : JSON.stringify(message.content, null, 2)}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
        <CardFooter className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

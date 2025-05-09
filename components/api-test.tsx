"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ApiTest() {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [rawRequest, setRawRequest] = useState("")
  const [rawResponse, setRawResponse] = useState("")

  const testApi = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    setError("")
    setResponse("")
    setRawResponse("")

    try {
      // Prepare the request payload
      const sessionId = `test_user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      const payload = {
        prompt: prompt.trim(), // Keep this for backward compatibility
        message: prompt.trim(), // This is what n8n expects
        phoneNumber: sessionId, // This is what n8n uses for session tracking
        sessionId: sessionId,
        history: [],
      }

      setRawRequest(JSON.stringify(payload, null, 2))

      // Send the request
      const result = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      // Get the raw response
      const rawText = await result.text()
      setRawResponse(rawText)

      // Try to parse as JSON
      try {
        const data = JSON.parse(rawText)
        if (result.ok) {
          setResponse(data.response || data.message || data.text || data.content || JSON.stringify(data))
        } else {
          throw new Error(data.error || `HTTP error! status: ${result.status}`)
        }
      } catch (parseError) {
        throw new Error(`Failed to parse response: ${rawText}`)
      }
    } catch (err) {
      console.error("API test error:", err)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-xl mx-auto my-8">
      <CardHeader>
        <CardTitle>API Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Test Prompt</label>
            <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter a test message" />
          </div>

          <Button onClick={testApi} disabled={isLoading || !prompt.trim()} className="w-full">
            {isLoading ? "Testing..." : "Test API"}
          </Button>

          {rawRequest && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Raw Request:</label>
              <pre className="p-3 bg-gray-50 border rounded text-sm overflow-auto max-h-40">{rawRequest}</pre>
            </div>
          )}

          {rawResponse && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Raw Response:</label>
              <pre className="p-3 bg-gray-50 border rounded text-sm overflow-auto max-h-40">{rawResponse}</pre>
            </div>
          )}

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

          {response && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Parsed Response:</label>
              <div className="p-3 bg-gray-50 border rounded text-sm">{response}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

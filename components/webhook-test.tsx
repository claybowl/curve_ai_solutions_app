"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function WebhookTest() {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const testWebhook = async () => {
    if (!prompt.trim()) return

    setIsLoading(true)
    setError("")

    try {
      // Test direct webhook call
      const result = await fetch("https://claydonjon.app.n8n.cloud/webhook/226821eb-fb06-4837-a708-36d2166f5d29/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          history: [],
        }),
      })

      if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`)
      }

      const data = await result.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (err) {
      console.error("Webhook test error:", err)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Webhook Test</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Test Prompt</label>
            <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter a test message" />
          </div>

          <Button onClick={testWebhook} disabled={isLoading || !prompt.trim()} className="w-full">
            {isLoading ? "Testing..." : "Test Webhook"}
          </Button>

          {error && <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

          {response && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Response:</label>
              <pre className="p-3 bg-gray-50 border rounded text-sm overflow-auto max-h-60">{response}</pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DirectWebhookTest() {
  const [prompt, setPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [rawRequest, setRawRequest] = useState("")
  const [rawResponse, setRawResponse] = useState("")
  const [customPayload, setCustomPayload] = useState(`{
  "prompt": "Hello",
  "history": []
}`)

  const testWebhook = async (useCustomPayload = false) => {
    if (!useCustomPayload && !prompt.trim()) return

    setIsLoading(true)
    setError("")
    setResponse("")
    setRawResponse("")

    try {
      // Prepare the request payload
      let payload

      if (useCustomPayload) {
        try {
          payload = JSON.parse(customPayload)
        } catch (e) {
          throw new Error("Invalid JSON in custom payload")
        }
      } else {
        payload = {
          prompt: prompt.trim(),
          history: [],
        }
      }

      setRawRequest(JSON.stringify(payload, null, 2))

      // Send the request directly to the webhook
      const result = await fetch("https://claydonjon.app.n8n.cloud/webhook/226821eb-fb06-4837-a708-36d2166f5d29/chat", {
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
      console.error("Webhook test error:", err)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Direct Webhook Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="simple">
          <TabsList className="mb-4">
            <TabsTrigger value="simple">Simple Test</TabsTrigger>
            <TabsTrigger value="advanced">Advanced (Custom JSON)</TabsTrigger>
          </TabsList>

          <TabsContent value="simple" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Test Prompt</label>
              <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter a test message" />
            </div>

            <Button onClick={() => testWebhook(false)} disabled={isLoading || !prompt.trim()} className="w-full">
              {isLoading ? "Testing..." : "Test Webhook Directly"}
            </Button>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Custom JSON Payload</label>
              <Textarea
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                placeholder="Enter custom JSON payload"
                className="font-mono text-sm min-h-[150px]"
              />
            </div>

            <Button onClick={() => testWebhook(true)} disabled={isLoading} className="w-full">
              {isLoading ? "Testing..." : "Send Custom Payload"}
            </Button>
          </TabsContent>
        </Tabs>

        {rawRequest && (
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Raw Request:</label>
            <pre className="p-3 bg-gray-50 border rounded text-sm overflow-auto max-h-40">{rawRequest}</pre>
          </div>
        )}

        {rawResponse && (
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Raw Response:</label>
            <pre className="p-3 bg-gray-50 border rounded text-sm overflow-auto max-h-40">{rawResponse}</pre>
          </div>
        )}

        {error && <div className="p-3 mt-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">{error}</div>}

        {response && (
          <div className="space-y-2 mt-4">
            <label className="text-sm font-medium">Parsed Response:</label>
            <div className="p-3 bg-gray-50 border rounded text-sm">{response}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

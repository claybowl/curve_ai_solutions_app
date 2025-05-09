"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ApiTestPage() {
  const [endpoint, setEndpoint] = useState("/api/test")
  const [response, setResponse] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const testEndpoint = async () => {
    setLoading(true)
    setResponse("")
    setError("")

    try {
      const res = await fetch(endpoint)
      const text = await res.text()

      try {
        // Try to parse as JSON
        const json = JSON.parse(text)
        setResponse(JSON.stringify(json, null, 2))
      } catch {
        // If not JSON, show as text
        setResponse(text)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>API Endpoint Tester</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input value={endpoint} onChange={(e) => setEndpoint(e.target.value)} placeholder="/api/endpoint" />
            <Button onClick={testEndpoint} disabled={loading}>
              {loading ? "Testing..." : "Test"}
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setEndpoint("/api/test")}>
              Test
            </Button>
            <Button variant="outline" size="sm" onClick={() => setEndpoint("/api/check-schema")}>
              Check Schema
            </Button>
            <Button variant="outline" size="sm" onClick={() => setEndpoint("/api/setup")}>
              Setup
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 dark:bg-red-900/20 dark:border-red-900 dark:text-red-300">
              <p className="font-medium">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {response && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto">
              <pre className="text-xs">{response}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DebugLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@curveai.com")
  const [password, setPassword] = useState("admin123")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResponse("Sending request...")

    try {
      const res = await fetch("/api/auth/direct-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))

      if (res.ok && data.success) {
        router.push("/admin")
        router.refresh()
      }
    } catch (error) {
      setResponse(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md mb-4">
        <CardHeader>
          <CardTitle>Debug Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="debug-email">Email</Label>
              <Input id="debug-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="debug-password">Password</Label>
              <Input
                id="debug-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Testing..." : "Test Login"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {response && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto text-xs">{response}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

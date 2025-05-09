"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function AdminResetPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [details, setDetails] = useState<any>(null)

  const resetAdminPassword = async () => {
    setStatus("loading")
    setMessage("Resetting admin password...")

    try {
      const res = await fetch("/api/reset-admin")
      const data = await res.json()

      if (res.ok) {
        setStatus("success")
        setMessage("Admin password reset successfully!")
        setDetails(data)
      } else {
        setStatus("error")
        setMessage(`Failed to reset password: ${data.error}`)
        setDetails(data)
      }
    } catch (error) {
      setStatus("error")
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`)
      setDetails({ error: String(error) })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Admin Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Click the button below to reset the admin password to <strong>admin123</strong>
          </p>

          <Button onClick={resetAdminPassword} disabled={status === "loading"} className="w-full">
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Admin Password"
            )}
          </Button>

          {status === "success" && (
            <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {details && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto text-xs">
              <pre>{JSON.stringify(details, null, 2)}</pre>
            </div>
          )}

          {status === "success" && (
            <Button variant="outline" onClick={() => (window.location.href = "/login")} className="w-full">
              Go to Login Page
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

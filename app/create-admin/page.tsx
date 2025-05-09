"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function CreateAdminPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [details, setDetails] = useState<any>(null)

  const createAdmin = async () => {
    setStatus("loading")
    setMessage("Creating admin user...")

    try {
      const res = await fetch("/api/setup")
      const data = await res.json()

      if (res.ok) {
        setStatus("success")
        setMessage("Admin user created or already exists!")
        setDetails(data)
      } else {
        setStatus("error")
        setMessage(`Failed to create admin: ${data.error}`)
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
          <CardTitle>Create Admin User</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Click the button below to create the admin user with email <strong>admin@curveai.com</strong> and password{" "}
            <strong>admin123</strong>
          </p>

          <Button onClick={createAdmin} disabled={status === "loading"} className="w-full">
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Admin User"
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
            <div className="space-y-2">
              <Button variant="outline" onClick={() => (window.location.href = "/admin-reset")} className="w-full">
                Reset Admin Password
              </Button>

              <Button variant="outline" onClick={() => (window.location.href = "/login")} className="w-full">
                Go to Login Page
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

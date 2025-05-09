"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function SetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [details, setDetails] = useState<any>(null)
  const [steps, setSteps] = useState([
    { name: "Database Connection", status: "pending" },
    { name: "Check Users Table", status: "pending" },
    { name: "Check Admin User", status: "pending" },
    { name: "Create Admin User", status: "pending" },
  ])

  const runSetup = async () => {
    setStatus("loading")
    setMessage("Running setup...")

    try {
      // Update steps
      setSteps((prev) => prev.map((step, i) => (i === 0 ? { ...step, status: "loading" } : step)))

      const response = await fetch("/api/setup")
      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message || "Setup completed successfully")
        setDetails(data)

        // Update all steps to success
        setSteps((prev) => prev.map((step) => ({ ...step, status: "success" })))
      } else {
        setStatus("error")
        setMessage(data.error || "Setup failed")
        setDetails(data)

        // Update steps based on error
        if (data.error?.includes("Database connection")) {
          setSteps((prev) => prev.map((step, i) => (i === 0 ? { ...step, status: "error" } : step)))
        } else if (data.error?.includes("Users table")) {
          setSteps((prev) =>
            prev.map((step, i) =>
              i === 0 ? { ...step, status: "success" } : i === 1 ? { ...step, status: "error" } : step,
            ),
          )
        } else if (data.error?.includes("admin user exists")) {
          setSteps((prev) =>
            prev.map((step, i) =>
              i <= 1 ? { ...step, status: "success" } : i === 2 ? { ...step, status: "error" } : step,
            ),
          )
        } else {
          setSteps((prev) =>
            prev.map((step, i) =>
              i <= 2 ? { ...step, status: "success" } : i === 3 ? { ...step, status: "error" } : step,
            ),
          )
        }
      }
    } catch (error) {
      setStatus("error")
      setMessage(`Client-side error: ${error instanceof Error ? error.message : String(error)}`)
      setDetails({ clientError: String(error) })

      // Set first step to error
      setSteps((prev) => prev.map((step, i) => (i === 0 ? { ...step, status: "error" } : step)))
    }
  }

  useEffect(() => {
    // Auto-run setup when page loads
    runSetup()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Curve AI Admin Setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3">
                {step.status === "success" ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : step.status === "error" ? (
                  <XCircle className="h-6 w-6 text-red-500" />
                ) : step.status === "loading" ? (
                  <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                ) : (
                  <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                )}
                <span
                  className={`font-medium ${
                    step.status === "success"
                      ? "text-green-600"
                      : step.status === "error"
                        ? "text-red-600"
                        : step.status === "loading"
                          ? "text-blue-600"
                          : ""
                  }`}
                >
                  {step.name}
                </span>
              </div>
            ))}
          </div>

          {status === "success" && (
            <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {details && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto text-xs">
              <pre>{JSON.stringify(details, null, 2)}</pre>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => (window.location.href = "/login")} disabled={status === "loading"}>
              Go to Login
            </Button>
            <Button onClick={runSetup} disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                "Run Setup Again"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

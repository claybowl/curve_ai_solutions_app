"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    // Listen for NextAuth errors
    const handleError = (event: ErrorEvent) => {
      if (event.error?.toString().includes("NextAuth") || event.message?.includes("NextAuth")) {
        setHasError(true)
        setErrorMessage("Authentication error. Please try again later.")
        console.error("NextAuth error:", event.error || event.message)
      }
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  if (hasError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="ml-3 text-sm text-red-700">{errorMessage}</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

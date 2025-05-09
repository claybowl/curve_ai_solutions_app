"use client"

import { useState, useEffect } from "react"
import { Database, AlertCircle, CheckCircle } from "lucide-react"

export function DatabaseStatus() {
  const [status, setStatus] = useState<"checking" | "connected" | "disconnected">("checking")

  useEffect(() => {
    async function checkDatabaseStatus() {
      try {
        const res = await fetch("/api/db-check")
        if (res.ok) {
          setStatus("connected")
        } else {
          setStatus("disconnected")
        }
      } catch (error) {
        console.error("Error checking database status:", error)
        setStatus("disconnected")
      }
    }

    checkDatabaseStatus()
  }, [])

  if (status === "checking") {
    return (
      <div className="flex items-center text-gray-500 text-xs">
        <Database className="h-3 w-3 mr-1" />
        <span>Checking database...</span>
      </div>
    )
  }

  if (status === "connected") {
    return (
      <div className="flex items-center text-green-500 text-xs">
        <CheckCircle className="h-3 w-3 mr-1" />
        <span>Database connected</span>
      </div>
    )
  }

  return (
    <div className="flex items-center text-amber-500 text-xs">
      <AlertCircle className="h-3 w-3 mr-1" />
      <span>Database offline (using local data)</span>
    </div>
  )
}

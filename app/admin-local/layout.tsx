"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { hasValidSession, isUserAdmin } from "@/lib/session-storage"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    // Verify authentication and admin role
    if (!hasValidSession()) {
      console.log("No valid session found, redirecting to login")
      router.push('/login-local')
      return
    }
    
    // Check if user is admin
    if (!isUserAdmin()) {
      console.log("User is not an admin, redirecting to dashboard")
      router.push('/dashboard-local')
      return
    }
  }, [router])

  return (
    <div className="h-full">
      {children}
    </div>
  )
}
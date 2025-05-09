"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SimpleLoginRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the main auth page
    router.replace("/auth/signin")
  }, [router])

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Redirecting to login page...</p>
    </div>
  )
}

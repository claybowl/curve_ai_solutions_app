"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear local storage
    localStorage.removeItem("admin-token")

    // Clear server-side cookies
    fetch("/api/logout", { method: "POST" })
      .catch((err) => console.error("Error during logout:", err))
      .finally(() => {
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/auth/signin")
        }, 1000)
      })
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Logging Out</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin mb-4 text-[#0076FF]" />
          <p className="text-center">Signing you out securely...</p>
        </CardContent>
      </Card>
    </div>
  )
}

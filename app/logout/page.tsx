"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { signOut } from "@/lib/supabase"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    async function handleLogout() {
      try {
        // Sign out from Supabase
        const { error } = await signOut()
        
        if (error) {
          console.error("Error during logout:", error.message)
        }
      } catch (err) {
        console.error("Unexpected error during logout:", err)
      } finally {
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push("/login")
          router.refresh() // Force a refresh to clear any cached pages
        }, 1000)
      }
    }
    
    handleLogout()
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
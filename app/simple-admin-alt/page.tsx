"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function SimpleAdminAltPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Try to get token from localStorage
        const token = localStorage.getItem("admin-token")

        if (!token) {
          setError("No authentication token found")
          router.push("/simple-login")
          return
        }

        // Parse token
        const [userId, role] = token.split(":")

        if (role !== "admin") {
          setError("Not authorized as admin")
          router.push("/simple-login")
          return
        }

        // Fetch user data
        const res = await fetch(`/api/user/${userId}`)

        if (!res.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data = await res.json()
        setUser(data.user)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "Failed to authenticate"}</p>
            <Button className="mt-4 w-full" onClick={() => router.push("/simple-login")}>
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Dashboard (Alternative)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              Welcome, {user.first_name} {user.last_name}!
            </p>
            <p>
              Your role is: <strong>{user.role}</strong>
            </p>
            <p>Your email is: {user.email}</p>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
              <p className="text-green-800 dark:text-green-300">You have successfully logged in to the admin area!</p>
            </div>

            <div className="flex flex-col space-y-2">
              <Button onClick={() => router.push("/admin-dashboard")}>Go to Full Admin Dashboard</Button>
              <Button variant="outline" onClick={() => router.push("/")}>
                Go to Home Page
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("admin-token")
                  router.push("/simple-login")
                }}
              >
                Log Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

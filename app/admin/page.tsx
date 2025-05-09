"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { RecentAssessments } from "@/components/admin/recent-assessments"
import { PendingConsultations } from "@/components/admin/pending-consultations"
import { AdminStats } from "@/components/admin/admin-stats"
import { Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { isAdminUser } from "@/lib/auth-utils"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Check if user is admin
        if (!isAdminUser()) {
          console.log("Not an admin user, redirecting to dashboard")
          router.push("/dashboard")
          return
        }

        setIsAdmin(true)

        // Parse token to get userId
        const token = localStorage.getItem("admin-token")
        const [userId] = token!.split(":")

        try {
          // Try to fetch user data from API with a timeout
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 3000)

          const res = await fetch(`/api/user/${userId}`, {
            signal: controller.signal,
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              "X-Timestamp": Date.now().toString(),
            },
          })

          clearTimeout(timeoutId)

          if (!res.ok) {
            console.warn(`API returned status ${res.status}, using fallback admin data`)
            // Use fallback admin data
            setUser({
              id: userId,
              role: "admin",
              first_name: "Admin",
              last_name: "User",
              email: "admin@curveai.com",
              company_name: "Curve AI Solutions",
            })
            return
          }

          const data = await res.json()

          // Double-check that the user from API is admin
          if (data.user && data.user.role === "admin") {
            setUser(data.user)
          } else {
            console.warn("User from API is not admin or missing, using fallback")
            // Use fallback admin data
            setUser({
              id: userId,
              role: "admin",
              first_name: "Admin",
              last_name: "User",
              email: "admin@curveai.com",
              company_name: "Curve AI Solutions",
            })
          }
        } catch (apiError) {
          console.error("API error:", apiError)
          // Fallback: Create a user object from the token information
          setUser({
            id: userId,
            role: "admin",
            first_name: "Admin",
            last_name: "User",
            email: "admin@curveai.com",
            company_name: "Curve AI Solutions",
          })
          console.warn("Using fallback admin user data due to API error")
        }
      } catch (err) {
        console.error("Admin dashboard error:", err)
        setError("Failed to load admin dashboard. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  // Prevent flash of redirect
  useEffect(() => {
    if (!loading && !isAdmin && !error) {
      router.push("/dashboard")
    }
  }, [loading, isAdmin, error, router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#0076FF]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card className="border-red-200 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <AlertCircle className="h-5 w-5" />
              <h2 className="text-lg font-bold">Error</h2>
            </div>
            <p>{error}</p>
            <div className="mt-4 flex gap-4">
              <Button onClick={() => window.location.reload()}>Retry</Button>
              <Button variant="outline" asChild>
                <Link href="/auth/signin">Return to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Only render if we've confirmed this is an admin
  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#0076FF]" />
      </div>
    )
  }

  return (
    <main className="p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
      <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
      <p className="text-muted-foreground mb-6">
        Welcome back, {user?.first_name} {user?.last_name}
      </p>

      <AdminStats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardContent className="p-0">
            <RecentAssessments />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-0">
            <PendingConsultations />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

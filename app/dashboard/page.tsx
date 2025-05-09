"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  PlusCircle,
  BarChart,
  Bot,
  LineChart,
  Database,
  User,
  AlertCircle,
  RefreshCw,
  LogOut,
} from "lucide-react"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Get token from localStorage
        const token = localStorage.getItem("admin-token")

        if (!token) {
          console.log("No token found, redirecting to login")
          router.push("/auth/signin")
          return
        }

        // Create a fallback user object from the token
        const [userId, role] = token.split(":")
        const fallbackUser = {
          id: userId || "1", // Default to ID 1 if parsing fails
          role: role || "client",
          first_name: "Demo",
          last_name: "User",
          email: "demo@curveai.com",
          company_name: "Curve AI Demo",
        }

        try {
          // Add a timeout to the fetch request
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 3000)

          // Try to fetch user data from API with error handling
          const res = await fetch(`/api/user/${userId || "1"}`, {
            signal: controller.signal,
            // Add cache: 'no-store' to prevent caching issues
            cache: "no-store",
            // Add a timestamp to prevent caching
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
              "X-Timestamp": Date.now().toString(),
            },
          })

          clearTimeout(timeoutId)

          if (!res.ok) {
            console.warn(`API returned status ${res.status}, using fallback user data`)
            setUser(fallbackUser)
            return
          }

          const data = await res.json()

          if (data.user) {
            setUser(data.user)
            if (data._fallback) {
              console.warn("Using fallback data from API")
            }
          } else {
            console.warn("API response missing user data, using fallback")
            setUser(fallbackUser)
          }
        } catch (apiError) {
          console.error("API error:", apiError)
          // Use fallback user data on API error
          setUser(fallbackUser)
          console.warn("Using fallback user data due to API error")
        }
      } catch (err) {
        console.error("Dashboard error:", err)
        setError("Failed to load dashboard. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router, retryCount])

  const handleRetry = () => {
    setLoading(true)
    setError("")
    setRetryCount((prev) => prev + 1)
  }

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("admin-token")
    sessionStorage.removeItem("user-data")

    // Call the logout API to clear cookies
    fetch("/api/logout", { method: "POST" })
      .catch((err) => console.error("Error during logout:", err))
      .finally(() => {
        // Redirect to home page
        router.push("/")
      })
  }

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
              <Button onClick={handleRetry}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
              <Button variant="outline" asChild>
                <Link href="/auth/signin">Return to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1A365D]">Dashboard</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
          <Button asChild className="bg-[#0076FF] hover:bg-[#0076FF]/90 text-white">
            <Link href="/assessments/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Assessment
            </Link>
          </Button>
        </div>
      </div>

      {/* Welcome card with user info */}
      <Card className="mb-8 border-2 border-[#0076FF]/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#0076FF] flex items-center justify-center text-white">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                Welcome, {user?.first_name} {user?.last_name}
              </h2>
              <p className="text-gray-500">{user?.company_name || "Your Company"}</p>
            </div>
          </div>
          <p className="text-gray-600">
            Your personal dashboard gives you quick access to AI readiness assessments, recommended tools, and insights
            for your business.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>AI Readiness</CardTitle>
            <CardDescription>Your current AI readiness score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <div className="w-32 h-32 rounded-full bg-[#0076FF] text-white flex items-center justify-center text-4xl font-bold">
                75%
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/assessments/1/results">
                <BarChart className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
            <CardDescription>Your assessment history</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-[#0076FF]" />
                  <span>Assessment #1</span>
                </div>
                <Link href="/assessments/1/results" className="text-[#0076FF] hover:underline text-sm">
                  View
                </Link>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-[#0076FF]" />
                  <span>Assessment #2</span>
                </div>
                <Link href="/assessments/2/results" className="text-[#0076FF] hover:underline text-sm">
                  View
                </Link>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/assessments/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Start New Assessment
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Tools</CardTitle>
            <CardDescription>AI tools based on your assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-8 h-8 rounded bg-[#0076FF]/10 flex items-center justify-center mr-3">
                  <Bot className="h-4 w-4 text-[#0076FF]" />
                </div>
                <div>
                  <p className="font-medium">AI Agent Builder</p>
                  <p className="text-sm text-gray-500">Create custom AI agents</p>
                </div>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 rounded bg-[#7928CA]/10 flex items-center justify-center mr-3">
                  <LineChart className="h-4 w-4 text-[#7928CA]" />
                </div>
                <div>
                  <p className="font-medium">Trading Analytics</p>
                  <p className="text-sm text-gray-500">Advanced trading metrics</p>
                </div>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 rounded bg-[#FF7F00]/10 flex items-center justify-center mr-3">
                  <Database className="h-4 w-4 text-[#FF7F00]" />
                </div>
                <div>
                  <p className="font-medium">Data Integration</p>
                  <p className="text-sm text-gray-500">Connect your data sources</p>
                </div>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/solutions">Explore All Tools</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

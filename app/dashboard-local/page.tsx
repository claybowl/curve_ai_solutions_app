"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
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

export default function LocalStorageDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error("Session error:", sessionError)
          setError("Failed to load session. Please log in again.")
          setLoading(false)
          return
        }
        
        if (!session) {
          console.log("No session found, redirecting to login")
          router.push('/login')
          return
        }
        
        setUser(session.user)
        setLoading(false)
      } catch (err) {
        console.error("Error loading session:", err)
        setError("An error occurred while loading your session.")
        setLoading(false)
      }
    }
    
    getSession()
  }, [router, supabase.auth])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#0076FF] mb-4" />
        <p>Loading dashboard...</p>
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
              <h2 className="text-lg font-bold">Error Loading Dashboard</h2>
            </div>
            <p>{error}</p>
            <div className="mt-4 flex gap-4">
              <Button asChild>
                <Link href="/login">Return to Login</Link>
              </Button>
              <Button onClick={() => window.location.href = "/last-resort"} variant="outline">
                Try Last Resort Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User is authenticated, show the dashboard
  return (
    <div className="container py-8">
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md mb-6">
        <h3 className="font-bold text-yellow-800 dark:text-yellow-200">LocalStorage Authentication</h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          You are using the localStorage-based authentication system to bypass cookie issues.
        </p>
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1A365D]">Dashboard (LocalStorage)</h1>
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
                Welcome, {user?.user_metadata?.firstName || 'User'} {user?.user_metadata?.lastName || ''}
              </h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
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
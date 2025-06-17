"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase-client"
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
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function checkSession() {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Session error:", error.message)
          window.location.href = "/login"
          return
        }
        
        if (data?.session) {
          setSession(data.session)
        } else {
          // No session, redirect to login
          window.location.href = "/login"
          return
        }
      } catch (err) {
        console.error("Error checking session:", err)
        window.location.href = "/login"
        return
      } finally {
        setLoading(false)
      }
    }
    
    checkSession()
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Simple loading check - no complex screens
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#0076FF]" />
      </div>
    )
  }

  // If no session, redirect will happen automatically
  if (!session) {
    return null
  }

  // User is authenticated, show the dashboard
  const user = session?.user

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
                Welcome, {user?.user_metadata?.firstName || user?.name?.split(' ')[0]} {user?.user_metadata?.lastName || user?.name?.split(' ')[1] || ''}
              </h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Your personal dashboard gives you quick access to AI readiness assessments, recommended tools, and insights
            for your business.
          </p>
          
          {/* Role info handled by admin user management */}
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
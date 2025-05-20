"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { loadSession, clearSession, hasValidSession, isUserAdmin } from "@/lib/session-storage"
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  BookText,
  Wrench,
  LogOut,
  BarChart3,
  AlertTriangle
} from "lucide-react"
import { Loader2 } from "lucide-react"

export default function AdminLocalPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check for valid session
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
    
    // Load the session data
    const session = loadSession()
    if (!session || !session.user) {
      setError("Session data is incomplete. Please log in again.")
      setLoading(false)
      return
    }
    
    // Set user data from session
    setUser(session.user)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    // Clear the session from localStorage
    clearSession()
    
    // Redirect to login page
    router.push('/login-local')
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#0076FF] mb-4" />
        <p>Loading admin dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <Card className="border-red-200 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <AlertTriangle className="h-5 w-5" />
              <h2 className="text-lg font-bold">Error Loading Admin Dashboard</h2>
            </div>
            <p>{error}</p>
            <div className="mt-4 flex gap-4">
              <Button asChild>
                <Link href="/login-local">Return to Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Admin dashboard UI
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Admin Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Curve AI</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Admin Portal (LocalStorage)</p>
        </div>

        <nav className="px-4 py-2 space-y-1">
          <Link
            href="/admin-local"
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-[#0076FF]"
          >
            <LayoutDashboard className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/admin-local/users"
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Users className="mr-3 h-5 w-5" />
            Users
          </Link>
          <Link
            href="/admin-local/blog"
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <BookText className="mr-3 h-5 w-5" />
            Blog
          </Link>
          <Link
            href="/admin-local/assessments"
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <FileText className="mr-3 h-5 w-5" />
            Assessments
          </Link>
          <Link
            href="/admin-local/tools"
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Wrench className="mr-3 h-5 w-5" />
            Tools
          </Link>
          <Link
            href="/admin-local/analytics"
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <BarChart3 className="mr-3 h-5 w-5" />
            Analytics
          </Link>
          <Link
            href="/admin-local/settings"
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Link>

          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="py-6 px-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
          </div>
        </header>

        <main className="p-8">
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md mb-6">
            <h3 className="font-bold text-yellow-800 dark:text-yellow-200">LocalStorage Authentication</h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              You are using the localStorage-based authentication system with admin access.
            </p>
          </div>

          {/* User Info Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Admin User Information</CardTitle>
              <CardDescription>
                You are logged in with admin privileges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Email:</span> {user?.email}
                </div>
                <div>
                  <span className="font-medium">User ID:</span> {user?.id}
                </div>
                <div>
                  <span className="font-medium">Role:</span> {user?.user_metadata?.role || 'Not set'}
                </div>
                {user?.user_metadata?.firstName && (
                  <div>
                    <span className="font-medium">Name:</span> {user.user_metadata.firstName} {user.user_metadata.lastName || ''}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">128</div>
                <p className="text-sm text-gray-500 mt-1">+14 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Assessments Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">89</div>
                <p className="text-sm text-gray-500 mt-1">+7 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Consultations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">16</div>
                <p className="text-sm text-gray-500 mt-1">+3 this week</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">New user registration</p>
                    <p className="text-sm text-gray-500">John Smith joined the platform</p>
                    <p className="text-xs text-gray-400 mt-1">15 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Assessment completed</p>
                    <p className="text-sm text-gray-500">Company XYZ finished their AI readiness assessment</p>
                    <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <BookText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Blog post published</p>
                    <p className="text-sm text-gray-500">New article: "AI Strategies for Small Businesses"</p>
                    <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
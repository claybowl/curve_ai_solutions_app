"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SupabaseUserList } from "@/components/admin/supabase-user-list"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function UsersPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        // Check if user is authenticated and is an admin
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error("Error getting session:", error)
          setError("Authentication error. Please log in again.")
          setLoading(false)
          return
        }
        
        if (!data?.session) {
          // Not authenticated, redirect to login
          router.push("/login?callbackUrl=/admin/users")
          return
        }
        
        // Check if user is an admin
        const userRole = data.session.user.user_metadata?.role
        
        if (userRole !== "admin") {
          setError("You do not have admin access to view this page.")
          setLoading(false)
          return
        }
        
        setIsAdmin(true)
        setLoading(false)
      } catch (err: any) {
        console.error("Error checking admin status:", err)
        setError(err.message || "An unexpected error occurred")
        setLoading(false)
      }
    }
    
    checkAdminStatus()
  }, [router])

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Users</h1>
          </div>
          <div className="flex justify-center items-center h-[500px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
          <Card className="border-red-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <CardTitle className="text-red-500">Access Error</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{error}</p>
              <div className="flex gap-4">
                <Button onClick={() => router.push("/dashboard")}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => router.push("/login?callbackUrl=/admin/users")}>
                  Log In Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Supabase Users</CardTitle>
          </CardHeader>
          <CardContent>
            <SupabaseUserList />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

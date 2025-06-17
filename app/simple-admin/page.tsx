"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, User, Settings, Users } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

export default function SimpleAdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      console.log("Checking authentication...")
      
      const { data, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error("Session error:", sessionError)
        setError("Session error: " + sessionError.message)
        setLoading(false)
        return
      }

      if (!data.session?.user) {
        console.log("No session found, redirecting to simple-login")
        window.location.href = "/simple-login"
        return
      }

      const currentUser = data.session.user
      console.log("User found:", currentUser.id, currentUser.email)
      console.log("User metadata:", currentUser.user_metadata)
      console.log("App metadata:", currentUser.app_metadata)

      // Check if admin
      let isAdmin = false
      
      // Check metadata first
      if (currentUser.user_metadata?.role === 'admin' || currentUser.app_metadata?.role === 'admin') {
        isAdmin = true
        console.log("Admin status confirmed via metadata")
      } else {
        // Check profiles table
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, email')
            .eq('user_id', currentUser.id)
            .single()
          
          console.log("Profile data:", profile)
          
          if (profileError) {
            console.error("Profile error:", profileError)
          } else if (profile?.role === 'admin') {
            isAdmin = true
            console.log("Admin status confirmed via profile")
          }
        } catch (profileErr) {
          console.error("Profile check failed:", profileErr)
        }
      }

      console.log("Final admin status:", isAdmin)

      if (!isAdmin) {
        setError("Access denied: You are not an administrator")
        setLoading(false)
        return
      }

      setUser(currentUser)
      setLoading(false)

    } catch (err) {
      console.error("Auth check error:", err)
      setError("Authentication check failed: " + String(err))
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/simple-login"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error}</p>
            <div className="space-y-2">
              <Button onClick={() => window.location.reload()} className="w-full">
                Retry
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = "/simple-login"}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Simple Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, {user?.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Access</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">✓ Verified</div>
              <p className="text-xs text-muted-foreground">
                You have admin privileges
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Management</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => window.location.href = "/admin/users"}
              >
                Manage Users
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Settings</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = "/admin"}
              >
                Full Admin Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>User ID:</strong> {user?.id}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>User Metadata Role:</strong> {user?.user_metadata?.role || 'None'}</p>
                <p><strong>App Metadata Role:</strong> {user?.app_metadata?.role || 'None'}</p>
                <p><strong>Login Method:</strong> Simple login system</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

export default function SimpleLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log("Attempting login for:", email)
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error("Sign in error:", signInError)
        setError(signInError.message)
        setLoading(false)
        return
      }

      if (!data.user) {
        setError("Login failed - no user returned")
        setLoading(false)
        return
      }

      console.log("Login successful for user:", data.user.id)
      console.log("User metadata:", data.user.user_metadata)
      
      // Simple role check - check metadata first, then profiles table
      let isAdmin = false
      
      // Check metadata
      if (data.user.user_metadata?.role === 'admin' || data.user.app_metadata?.role === 'admin') {
        isAdmin = true
      } else {
        // Check profiles table as backup
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', data.user.id)
            .single()
          
          if (profile?.role === 'admin') {
            isAdmin = true
          }
        } catch (profileError) {
          console.log("Profile check failed, assuming not admin:", profileError)
        }
      }

      console.log("User is admin:", isAdmin)
      
      // Simple redirect based on role
      if (isAdmin) {
        console.log("Redirecting admin to /admin")
        window.location.href = "/admin"
      } else {
        console.log("Redirecting user to /dashboard")
        window.location.href = "/dashboard"
      }

    } catch (err) {
      console.error("Unexpected login error:", err)
      setError("An unexpected error occurred during login")
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Simple Login</CardTitle>
          <CardDescription>
            Enter your email and password to sign in.
          </CardDescription>
          {error && (
            <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded">
              {error}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-sm text-center text-gray-500">
            <p>Admin test: curveai.solutions@gmail.com</p>
            <p>This is a simplified login for testing.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
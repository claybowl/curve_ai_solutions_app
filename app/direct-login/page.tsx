"use client"

import React, { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { createClient } from '@supabase/supabase-js'

// Create a direct Supabase client without any complex configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function DirectLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      console.log("Direct login attempt for:", email)
      
      // Simple sign in
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

      if (!data.user || !data.session) {
        setError("Login failed - no session created")
        setLoading(false)
        return
      }

      console.log("✓ Login successful!")
      console.log("User ID:", data.user.id)
      console.log("Email:", data.user.email)
      console.log("Session:", !!data.session)
      
      setSuccess("Login successful! You are now authenticated.")
      
      // Show user info for debugging
      const userInfo = {
        id: data.user.id,
        email: data.user.email,
        metadata: data.user.user_metadata,
        appMetadata: data.user.app_metadata,
        sessionExpires: data.session.expires_at
      }
      
      console.log("User info:", userInfo)
      
      setLoading(false)
      
    } catch (err) {
      console.error("Unexpected login error:", err)
      setError("An unexpected error occurred during login: " + String(err))
      setLoading(false)
    }
  }

  const checkSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setError("Session check error: " + error.message)
        return
      }
      
      if (data.session) {
        setSuccess("Session found! User: " + data.session.user.email)
        console.log("Current session:", data.session)
      } else {
        setError("No active session found")
      }
    } catch (err) {
      setError("Session check failed: " + String(err))
    }
  }

  const testRedirect = (destination: string) => {
    console.log("Redirecting to:", destination)
    window.location.href = destination
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Direct Login Test</CardTitle>
          <CardDescription>
            Direct Supabase authentication without middleware interference.
          </CardDescription>
          {error && (
            <div className="mt-2 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded">
              {success}
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
          
          <div className="mt-4 space-y-2">
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={checkSession}
            >
              Check Current Session
            </Button>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => testRedirect("/simple-admin")}
              >
                → Admin
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => testRedirect("/simple-dashboard")}
              >
                → Dashboard
              </Button>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-center text-gray-500">
            <p><strong>Test Accounts:</strong></p>
            <p>Admin: curveai.solutions@gmail.com</p>
            <p>User: claybowlbooks@gmail.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
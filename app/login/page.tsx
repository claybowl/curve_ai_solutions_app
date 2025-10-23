"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase-client"

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrlFromParams = searchParams?.get("callbackUrl")
  const errorMessage = searchParams?.get("error")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(errorMessage)
  // Simplified - no pre-checking session, just show login form

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log("Login attempt for:", email)
      
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

      console.log("Login successful!")
      console.log("User ID:", data.user.id)
      console.log("Email:", data.user.email)

      // Check user role and redirect
      try {
        // Check user metadata first (faster)
        const userRole = data.user.user_metadata?.role || data.user.app_metadata?.role
        let isAdmin = userRole === 'admin'

        // If not found in metadata, check profiles table
        if (!isAdmin) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('user_id', data.user.id)
            .single()

          if (!profileError && profile) {
            isAdmin = profile.role === 'admin'
          }
        }

        const finalRedirectUrl = isAdmin ? '/admin-dashboard' : (callbackUrlFromParams || "/dashboard");
        console.log(`Signed in, admin: ${isAdmin}, redirecting to ${finalRedirectUrl}`)

        // Use window.location.href for full page reload to trigger server-side auth
        window.location.href = finalRedirectUrl

      } catch (roleError) {
        console.error("Error checking user role:", roleError)
        // Default to dashboard if role check fails
        window.location.href = callbackUrlFromParams || "/dashboard"
      }
      
    } catch (err) {
      console.error("Unexpected login error:", err)
      setError("An unexpected error occurred during login: " + String(err))
      setLoading(false)
    }
  }

  // No loading screen, just show login form directly

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Sign in to your account</CardTitle>
          <CardDescription>
            Enter your email and password or use a social provider to sign in.
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
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </div>
          <div className="mt-2 text-sm text-center text-gray-500">
            <p>Admin users will be redirected to the admin dashboard.</p>
            <p>Regular users will access client features.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return <LoginContent />
}

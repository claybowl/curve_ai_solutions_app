"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInWithEmail, supabase } from "@/lib/supabase"

export function SupabaseLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      console.log("Attempting login with email:", email)
      const { data, error } = await signInWithEmail(email, password)

      if (error) {
        console.error("Login error:", error.message)
        setError(error.message || "Authentication failed")
        setLoading(false)
        return
      }

      if (data?.session) {
        console.log("Login successful, session established with user ID:", data.session.user.id)
        console.log("User email:", data.session.user.email)
        console.log("User role:", data.session.user.user_metadata?.role || 'none')
        
        // Get redirect URL from query parameters or default to dashboard
        const params = new URLSearchParams(window.location.search)
        const redirectTo = params.get('callbackUrl') || '/dashboard'
        console.log("Redirecting to:", redirectTo)
        
        try {
          // Force session refresh before redirect
          const refreshResult = await supabase.auth.refreshSession()
          console.log("Session refresh result:", !!refreshResult.data.session)
          
          // Add a slight delay to ensure cookies are properly set
          setTimeout(() => {
            // Redirect on success
            router.push(redirectTo)
            router.refresh()
          }, 300)
        } catch (refreshError) {
          console.error("Error refreshing session:", refreshError)
          setError("Login successful but failed to refresh session. Please try again.")
          setLoading(false)
        }
      } else {
        console.error("Login returned without error but no session data")
        setError("Authentication succeeded but session not established. Please try again.")
        setLoading(false)
      }
    } catch (err) {
      console.error("Unexpected login error:", err)
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  )
}
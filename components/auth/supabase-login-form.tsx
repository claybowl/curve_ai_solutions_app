"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInWithEmail, supabase } from "@/lib/supabase-client"

export function SupabaseLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")
  const router = useRouter()

  // Get parameters from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const errorParam = params.get('error')
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    }
    
    // Debug mode via URL
    if (params.get('debug') === 'true') {
      setDebugMode(true)
    }
  }, [])

  // Add debug info
  const addDebugInfo = (info: string) => {
    if (debugMode) {
      setDebugInfo(prev => `${prev}\n${info}`)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      addDebugInfo(`Attempting login with email: ${email}`)
      
      // Login through the unified client (auth helpers handle cookies)
      const { data, error: authError } = await signInWithEmail(email, password)

      if (authError) {
        addDebugInfo(`Login error: ${authError.message}`)
        setError(authError.message || "Authentication failed")
        setLoading(false)
        return
      }

      if (data?.session) {
        addDebugInfo(`Login successful, session established with user ID: ${data.session.user.id}`)
        addDebugInfo(`User email: ${data.session.user.email}`)
        addDebugInfo(`User role: ${data.session.user.user_metadata?.role || 'none'}`)
        
        // Get redirect URL from query parameters or default to dashboard
        const params = new URLSearchParams(window.location.search)
        const redirectTo = params.get('callbackUrl') || '/dashboard'
        addDebugInfo(`Redirecting to: ${redirectTo}`)
        
        try {
          // Force session refresh before redirect
          addDebugInfo("Refreshing session before redirect")
          await supabase.auth.refreshSession()
          
          // Check cookies
          addDebugInfo("Checking cookies...")
          const cookiesFound = document.cookie.split(';').some(c => 
            c.trim().startsWith('sb-') || c.trim().startsWith('sb_auth')
          )
          addDebugInfo(`Supabase cookies found: ${cookiesFound}`)
          
          // Short delay to ensure cookies are properly set
          setTimeout(() => {
            // Use window.location for a hard redirect that will include cookies
            window.location.href = redirectTo
          }, 500)
        } catch (refreshError) {
          addDebugInfo(`Error refreshing session: ${refreshError}`)
          setError("Login successful but failed to refresh session. Please try again.")
          setLoading(false)
        }
      } else {
        addDebugInfo("Login returned without error but no session data")
        setError("Authentication succeeded but session not established. Please try again.")
        setLoading(false)
      }
    } catch (err) {
      addDebugInfo(`Unexpected login error: ${err}`)
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
      {debugMode && debugInfo && (
        <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
          <pre className="whitespace-pre-wrap">{debugInfo}</pre>
        </div>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
      
      {/* Toggle debug mode */}
      <div className="pt-2 text-center">
        <button 
          type="button"
          onClick={() => setDebugMode(!debugMode)} 
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          {debugMode ? "Hide Debug Info" : "Show Debug Info"}
        </button>
      </div>
    </form>
  )
}

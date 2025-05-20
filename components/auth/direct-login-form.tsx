"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from '@supabase/supabase-js'
import { Loader2 } from "lucide-react"

// This is a simplified login form that uses direct URL navigation
// to avoid issues with Next.js router and session persistence
export function DirectLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [debugMessages, setDebugMessages] = useState<string[]>([])

  // Helper to add debug messages
  const addDebug = (message: string) => {
    setDebugMessages(prev => [...prev, message])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    
    addDebug(`Attempting login with email: ${email}`)

    try {
      // Create a fresh Supabase client for login
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables')
      }
      
      addDebug('Creating Supabase client')
      
      // Create a client with explicit cookie settings
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          detectSessionInUrl: true,
          flowType: 'pkce',
          autoRefreshToken: true,
          debug: true // Enable auth debugging
        }
      })
      
      addDebug('Calling signInWithPassword')
      
      // Sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        addDebug(`Login error: ${error.message}`)
        setError(error.message)
        setLoading(false)
        return
      }

      if (!data.session) {
        addDebug('No session returned from login')
        setError("Failed to establish session. Please try again.")
        setLoading(false)
        return
      }
      
      addDebug(`Login successful, session established with user ID: ${data.session.user.id}`)
      addDebug(`Redirecting to dashboard...`)
      
      // We'll use a form submission to do a full page reload to /dashboard
      // This avoids issues with client-side routing and session persistence
      const form = document.createElement('form')
      form.method = 'GET'
      form.action = '/dashboard'
      
      // Add auth success flag
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = 'auth_success'
      input.value = 'true'
      form.appendChild(input)
      
      // Add a timestamp to prevent caching
      const timestampInput = document.createElement('input')
      timestampInput.type = 'hidden'
      timestampInput.name = 'ts'
      timestampInput.value = Date.now().toString()
      form.appendChild(timestampInput)
      
      document.body.appendChild(form)
      form.submit()
      
    } catch (err) {
      const errorMessage = (err as Error).message
      addDebug(`Unexpected error: ${errorMessage}`)
      setError(`An unexpected error occurred: ${errorMessage}`)
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-md text-sm">
        <p className="font-medium">Direct Login Form</p>
        <p>This is a simplified login form that uses a full page reload to avoid session persistence issues.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm rounded">
            {error}
          </div>
        )}
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : "Sign In"}
        </Button>
      </form>
      
      {debugMessages.length > 0 && (
        <div className="mt-4 p-3 border rounded bg-gray-50 dark:bg-gray-800">
          <p className="text-xs font-medium mb-1">Debug Log:</p>
          <div className="max-h-40 overflow-y-auto">
            {debugMessages.map((msg, i) => (
              <div key={i} className="text-xs mb-1">{msg}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
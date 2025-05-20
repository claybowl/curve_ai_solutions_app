"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from '@supabase/supabase-js'
import { saveSession, isUserAdmin } from "@/lib/session-storage"

export function LocalStorageLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    try {
      setMessage("Creating Supabase client...")
      
      // Get Supabase credentials
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables')
      }
      
      // Create a client specifically for login
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false, // Disable built-in persistence
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      })
      
      setMessage("Logging in with Supabase...")
      
      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error("Login error:", error.message)
        setError(error.message || "Authentication failed")
        setMessage("")
        setLoading(false)
        return
      }

      if (data?.session) {
        console.log("Login successful with user ID:", data.session.user.id)
        const isAdmin = data.session.user.user_metadata?.role === 'admin'
        setMessage(`Login successful! User role: ${isAdmin ? 'admin' : 'client'}`)
        
        // Save session to localStorage
        saveSession(data.session)
        
        setMessage("Session saved, redirecting...")
        
        // Short delay to ensure everything is saved
        setTimeout(() => {
          // Check if user is admin to determine redirect
          if (isAdmin) {
            router.push('/admin-local')
          } else {
            router.push('/dashboard-local')
          }
        }, 500)
      } else {
        setError("Authentication succeeded but session not established. Please try again.")
        setMessage("")
        setLoading(false)
      }
    } catch (err) {
      console.error("Unexpected login error:", err)
      setError("An unexpected error occurred")
      setMessage("")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 bg-yellow-50 rounded-md text-sm text-yellow-800 mb-4">
        This login form uses localStorage to persist your session instead of cookies.
        Admin users will be redirected to the admin dashboard.
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-blue-500 text-sm">{message}</p>}
      
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In with LocalStorage"}
      </Button>
    </form>
  )
}
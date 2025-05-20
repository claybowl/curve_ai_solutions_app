"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { supabaseDebug } from "@/lib/supabase-debug"
import { Loader2 } from "lucide-react"

export default function LoginDebugPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [debugLogs, setDebugLogs] = useState<string[]>([])

  // Add a log message with timestamp
  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0]
    setDebugLogs(prev => [`[${timestamp}] ${message}`, ...prev])
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    
    addLog(`Attempting login with email: ${email}`)
    
    try {
      // Use the diagnostic client
      const { data, error } = await supabaseDebug.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        addLog(`Login error: ${error.message}`)
        setError(error.message)
        setLoading(false)
        return
      }
      
      if (data?.session) {
        addLog(`Login successful, session established with user ID: ${data.session.user.id}`)
        addLog(`User email: ${data.session.user.email}`)
        addLog(`User role: ${data.session.user.user_metadata?.role || 'none'}`)
        
        // Check if cookies are set
        setTimeout(async () => {
          addLog('Checking cookies and session state after 1 second delay')
          
          // Inspect current cookies
          document.cookie.split(';').forEach(cookie => {
            if (cookie.trim().startsWith('sb-')) {
              addLog(`Found Supabase cookie: ${cookie.trim()}`)
            }
          })
          
          // Verify session was stored
          try {
            const { data: sessionData } = await supabaseDebug.auth.getSession()
            if (sessionData.session) {
              addLog(`Session verification successful`)
              setSuccess(`Login successful! User: ${data.session.user.email}`)
              
              // Add navigation options but don't automatically redirect
              addLog('Login complete - manual navigation options provided')
            } else {
              addLog(`Session verification failed - no session found after login`)
              setError('Authentication succeeded but session was not persisted correctly')
            }
          } catch (verifyError) {
            addLog(`Session verification error: ${verifyError}`)
            setError('Error verifying session')
          }
          
          setLoading(false)
        }, 1000)
      } else {
        addLog("Login returned without error but no session data")
        setError("Authentication succeeded but session not established")
        setLoading(false)
      }
    } catch (err) {
      const errorMessage = (err as Error).message
      addLog(`Unexpected login error: ${errorMessage}`)
      setError(`An unexpected error occurred: ${errorMessage}`)
      setLoading(false)
    }
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-12">
      <Card className="w-full max-w-md mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Debug Login</CardTitle>
          <CardDescription>
            This page uses a diagnostic Supabase client with enhanced logging
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-3 bg-green-50 text-green-700 rounded-md">
                {success}
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
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {success && (
            <div className="grid grid-cols-2 gap-3 w-full">
              <Button asChild variant="outline" size="sm">
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="/debug-supabase">Session Debug</a>
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Debug Logs</span>
            <Button 
              onClick={() => setDebugLogs([])} 
              variant="ghost" 
              size="sm"
            >
              Clear
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-80 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-3 rounded border font-mono text-sm">
            {debugLogs.length > 0 ? (
              debugLogs.map((log, i) => (
                <div key={i} className="pb-1">{log}</div>
              ))
            ) : (
              <p className="text-gray-500">No logs yet. Login to see debug information.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, LogOut } from "lucide-react"

export default function DebugSupabasePage() {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)
  const [cookies, setCookies] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  // Add a log entry with timestamp
  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0]
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev])
  }

  // Check Supabase session
  const checkSession = async () => {
    setLoading(true)
    addLog("Checking session...")
    
    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        addLog(`Session error: ${error.message}`)
        setError(error.message)
      } else if (data.session) {
        addLog(`Session found: ${data.session.user.id}`)
        setSession(data.session)
      } else {
        addLog("No session found")
        setSession(null)
      }
    } catch (err) {
      const errorMessage = (err as Error).message
      addLog(`Error checking session: ${errorMessage}`)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Refresh session
  const refreshSession = async () => {
    addLog("Refreshing session...")
    
    try {
      const { data, error } = await supabase.auth.refreshSession()
      
      if (error) {
        addLog(`Refresh error: ${error.message}`)
        setError(error.message)
      } else if (data.session) {
        addLog(`Session refreshed: ${data.session.user.id}`)
        setSession(data.session)
      } else {
        addLog("No session after refresh")
        setSession(null)
      }
    } catch (err) {
      const errorMessage = (err as Error).message
      addLog(`Error refreshing session: ${errorMessage}`)
      setError(errorMessage)
    }
  }

  // Check cookies
  const checkCookies = () => {
    addLog("Checking cookies...")
    const allCookies = document.cookie.split(';').map(cookie => cookie.trim())
    setCookies(allCookies)
    
    // Look for Supabase specific cookies
    const supabaseCookies = allCookies.filter(
      cookie => cookie.startsWith('sb-') || cookie.toLowerCase().includes('supabase')
    )
    
    if (supabaseCookies.length > 0) {
      addLog(`Found ${supabaseCookies.length} Supabase cookies`)
    } else {
      addLog("No Supabase cookies found")
    }
  }

  // Sign out
  const handleSignOut = async () => {
    addLog("Signing out...")
    
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        addLog(`Sign out error: ${error.message}`)
        setError(error.message)
      } else {
        addLog("Signed out successfully")
        setSession(null)
      }
    } catch (err) {
      const errorMessage = (err as Error).message
      addLog(`Error signing out: ${errorMessage}`)
      setError(errorMessage)
    }
  }

  // Run initial checks on load
  useEffect(() => {
    checkSession()
    checkCookies()
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      addLog(`Auth event: ${event}`)
      if (session) {
        setSession(session)
      } else if (event === 'SIGNED_OUT') {
        setSession(null)
      }
    })
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Supabase Auth Debug</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500 mr-2" />
                <span>Checking session...</span>
              </div>
            ) : session ? (
              <div className="space-y-4">
                <div>
                  <p><strong>User ID:</strong> {session.user.id}</p>
                  <p><strong>Email:</strong> {session.user.email}</p>
                  <p><strong>Role:</strong> {session.user.user_metadata?.role || 'Not set'}</p>
                  <p><strong>Expires:</strong> {new Date(session.expires_at! * 1000).toLocaleString()}</p>
                </div>
                
                <div className="pt-4 border-t flex space-x-4">
                  <Button onClick={refreshSession} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh Session
                  </Button>
                  <Button onClick={handleSignOut} variant="outline" size="sm" className="text-red-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="mb-4">No active session found. You are not logged in.</p>
                <Button
                  onClick={() => window.location.href = '/login'} 
                  variant="default"
                >
                  Go to Login
                </Button>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                <p className="font-medium">Error:</p>
                <p>{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <span>Cookies</span>
              <Button onClick={checkCookies} variant="ghost" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cookies.length > 0 ? (
              <div className="text-sm">
                <p className="mb-2 text-gray-500">Found {cookies.length} cookies:</p>
                <div className="h-48 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-3 rounded border">
                  {cookies.map((cookie, index) => (
                    <div key={index} className={cookie.startsWith('sb-') ? 'text-blue-600 font-medium' : ''}>
                      {cookie}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No cookies found</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Debug Log</span>
            <Button onClick={() => setLogs([])} variant="ghost" size="sm">
              Clear
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-3 rounded border font-mono text-sm">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="pb-1">
                  {log}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No logs yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6 flex space-x-4">
        <Button onClick={checkSession} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh All
        </Button>
        <Button
          onClick={() => window.location.href = '/login'} 
          variant="outline"
        >
          Go to Login
        </Button>
        <Button
          onClick={() => window.location.href = '/dashboard'} 
          variant="outline"
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}
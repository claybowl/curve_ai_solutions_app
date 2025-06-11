"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase-client"
import {
  FileText,
  PlusCircle,
  BarChart,
  Bot,
  LineChart,
  Database,
  User,
  AlertCircle,
  RefreshCw,
  LogOut,
} from "lucide-react"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [debugInfo, setDebugInfo] = useState("")

  // Add debug information with timestamp
  const addDebugInfo = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setDebugInfo(prev => `${prev}[${timestamp}] ${message}\n`)
  }

  useEffect(() => {
    let mounted = true
    
    async function initialSessionCheck() {
      try {
        addDebugInfo("Initial session check...")
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          addDebugInfo(`Session error: ${error.message}`)
          if (mounted) setError(error.message)
          return false
        }
        
        if (data?.session) {
          addDebugInfo(`Session found: ${data.session.user.id}`)
          if (mounted) setSession(data.session)
          return true
        } else {
          addDebugInfo("No session found in initial check")
          return false
        }
      } catch (err) {
        addDebugInfo(`Error in initial check: ${(err as Error).message}`)
        return false
      } finally {
        if (mounted) setCheckingAuth(false)
      }
    }
    
    async function trySessionRefresh() {
      try {
        addDebugInfo("Attempting session refresh...")
        const { data, error } = await supabase.auth.refreshSession()
        
        if (error) {
          addDebugInfo(`Refresh error: ${error.message}`)
          return false
        }
        
        if (data?.session) {
          addDebugInfo(`Session refreshed: ${data.session.user.id}`)
          if (mounted) setSession(data.session)
          return true
        } else {
          addDebugInfo("No session after refresh")
          return false
        }
      } catch (err) {
        addDebugInfo(`Error refreshing: ${(err as Error).message}`)
        return false
      }
    }
    
    // Initial checks
    initialSessionCheck().then(async (hasSession) => {
      if (!hasSession) {
        // Try a refresh if no session found
        await trySessionRefresh()
      }
      
      // Regardless of result, we've done what we can
      if (mounted) setLoading(false)
    })
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        addDebugInfo(`Auth state event: ${event}`)
        
        if (event === 'SIGNED_OUT') {
          if (mounted) {
            setSession(null)
            window.location.href = "/login"
          }
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (mounted && newSession) {
            setSession(newSession)
          }
        }
      }
    )
    
    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const handleRetry = async () => {
    setLoading(true)
    setError("")
    setDebugInfo("")
    
    try {
      addDebugInfo("Manual retry - checking session")
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        addDebugInfo(`Session error: ${error.message}`)
        setError(error.message)
        return
      }
      
      if (data?.session) {
        addDebugInfo(`Session found: ${data.session.user.id}`)
        setSession(data.session)
      } else {
        addDebugInfo("No session found, attempting refresh")
        
        // Try refresh
        const refreshResult = await supabase.auth.refreshSession()
        
        if (refreshResult.error) {
          addDebugInfo(`Refresh error: ${refreshResult.error.message}`)
          setError("Failed to refresh session. Please log in again.")
        } else if (refreshResult.data.session) {
          addDebugInfo(`Session refreshed: ${refreshResult.data.session.user.id}`)
          setSession(refreshResult.data.session)
        } else {
          addDebugInfo("No session after refresh")
          setError("No active session. Please log in again.")
        }
      }
    } catch (err) {
      const errorMessage = (err as Error).message
      addDebugInfo(`Unexpected error: ${errorMessage}`)
      setError(`An unexpected error occurred: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    addDebugInfo("Logging out...")
    try {
      await supabase.auth.signOut()
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
      setError("Error signing out. Please try again.")
    }
  }

  // If waiting for initial auth check
  if (checkingAuth) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#0076FF] mb-4" />
        <p>Checking authentication...</p>
      </div>
    )
  }

  // If still loading after auth check
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#0076FF] mb-4" />
        <p>Loading dashboard...</p>
      </div>
    )
  }

  // If there's an error
  if (error) {
    return (
      <div className="container py-8">
        <Card className="border-red-200 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600 mb-4">
              <AlertCircle className="h-5 w-5" />
              <h2 className="text-lg font-bold">Error Loading Dashboard</h2>
            </div>
            <p>{error}</p>
            
            {debugInfo && (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                <p className="font-medium mb-1">Debug Information:</p>
                <pre className="whitespace-pre-wrap">{debugInfo}</pre>
              </div>
            )}
            
            <div className="mt-4 flex gap-4">
              <Button onClick={handleRetry}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
              <Button variant="outline" asChild>
                <Link href="/direct-login">Try Direct Login</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // If not authenticated
  if (!session) {
    return (
      <div className="container py-8">
        <Card className="border-yellow-200 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-600 mb-4">
              <AlertCircle className="h-5 w-5" />
              <h2 className="text-lg font-bold">Authentication Required</h2>
            </div>
            <p>You need to be logged in to view this page. Please log in to continue.</p>
            
            {debugInfo && (
              <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                <p className="font-medium mb-1">Debug Information:</p>
                <pre className="whitespace-pre-wrap">{debugInfo}</pre>
              </div>
            )}
            
            <div className="mt-4 flex gap-4">
              <Button asChild>
                <Link href="/direct-login">
                  Try Direct Login
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User is authenticated, show the dashboard
  const user = session?.user

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#1A365D]">Dashboard</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
          <Button asChild className="bg-[#0076FF] hover:bg-[#0076FF]/90 text-white">
            <Link href="/assessments/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Assessment
            </Link>
          </Button>
        </div>
      </div>

      {/* Welcome card with user info */}
      <Card className="mb-8 border-2 border-[#0076FF]/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#0076FF] flex items-center justify-center text-white">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                Welcome, {user?.user_metadata?.firstName || user?.name?.split(' ')[0]} {user?.user_metadata?.lastName || user?.name?.split(' ')[1] || ''}
              </h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            Your personal dashboard gives you quick access to AI readiness assessments, recommended tools, and insights
            for your business.
          </p>
          
          {/* Role info and fix */}
          {!user?.user_metadata?.role && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
              <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">User Role Missing</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                Your account doesn't have a role assigned, which may affect your access to features.
              </p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/auth/set-role', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ role: 'client' })
                      });
                      
                      if (response.ok) {
                        alert('Role set successfully! Please refresh the page.');
                        window.location.reload();
                      } else {
                        const data = await response.json();
                        alert('Error: ' + (data.error || 'Failed to set role'));
                      }
                    } catch (error) {
                      console.error('Error setting role:', error);
                      alert('An unexpected error occurred');
                    }
                  }}
                >
                  Set as Client
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/auth/set-role', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ role: 'admin' })
                      });
                      
                      if (response.ok) {
                        alert('Admin role set successfully! Please refresh the page.');
                        window.location.reload();
                      } else {
                        const data = await response.json();
                        alert('Error: ' + (data.error || 'Failed to set role'));
                      }
                    } catch (error) {
                      console.error('Error setting role:', error);
                      alert('An unexpected error occurred');
                    }
                  }}
                >
                  Set as Admin
                </Button>
              </div>
            </div>
          )}
          
          {debugInfo && (
            <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
              <details>
                <summary className="font-medium mb-1 cursor-pointer">Debug Information</summary>
                <pre className="whitespace-pre-wrap mt-2">{debugInfo}</pre>
              </details>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>AI Readiness</CardTitle>
            <CardDescription>Your current AI readiness score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
              <div className="w-32 h-32 rounded-full bg-[#0076FF] text-white flex items-center justify-center text-4xl font-bold">
                75%
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/assessments/1/results">
                <BarChart className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
            <CardDescription>Your assessment history</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-[#0076FF]" />
                  <span>Assessment #1</span>
                </div>
                <Link href="/assessments/1/results" className="text-[#0076FF] hover:underline text-sm">
                  View
                </Link>
              </li>
              <li className="flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="mr-2 h-4 w-4 text-[#0076FF]" />
                  <span>Assessment #2</span>
                </div>
                <Link href="/assessments/2/results" className="text-[#0076FF] hover:underline text-sm">
                  View
                </Link>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/assessments/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Start New Assessment
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Tools</CardTitle>
            <CardDescription>AI tools based on your assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-8 h-8 rounded bg-[#0076FF]/10 flex items-center justify-center mr-3">
                  <Bot className="h-4 w-4 text-[#0076FF]" />
                </div>
                <div>
                  <p className="font-medium">AI Agent Builder</p>
                  <p className="text-sm text-gray-500">Create custom AI agents</p>
                </div>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 rounded bg-[#7928CA]/10 flex items-center justify-center mr-3">
                  <LineChart className="h-4 w-4 text-[#7928CA]" />
                </div>
                <div>
                  <p className="font-medium">Trading Analytics</p>
                  <p className="text-sm text-gray-500">Advanced trading metrics</p>
                </div>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 rounded bg-[#FF7F00]/10 flex items-center justify-center mr-3">
                  <Database className="h-4 w-4 text-[#FF7F00]" />
                </div>
                <div>
                  <p className="font-medium">Data Integration</p>
                  <p className="text-sm text-gray-500">Connect your data sources</p>
                </div>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/solutions">Explore All Tools</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
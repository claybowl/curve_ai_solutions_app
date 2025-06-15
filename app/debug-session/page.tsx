"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugSessionPage() {
  const [sessionData, setSessionData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    setLoading(true)
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      console.log("Session data:", sessionData)
      console.log("Session error:", sessionError)
      
      if (sessionData?.session) {
        // Also check profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', sessionData.session.user.id)
          .single()
        
        console.log("Profile data:", profile)
        console.log("Profile error:", profileError)
        
        setSessionData({
          session: sessionData.session,
          profile: profile,
          profileError: profileError
        })
      } else {
        setSessionData({ session: null, error: sessionError })
      }
    } catch (error) {
      console.error("Debug error:", error)
      setSessionData({ error: String(error) })
    }
    setLoading(false)
  }

  const refreshSession = async () => {
    console.log("Refreshing session...")
    const { data, error } = await supabase.auth.refreshSession()
    console.log("Refresh result:", { data, error })
    checkSession()
  }

  const forceReAuth = async () => {
    console.log("Forcing re-authentication...")
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  if (loading) {
    return <div className="p-8">Loading session debug info...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Session Debug Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={checkSession}>Refresh Data</Button>
            <Button onClick={refreshSession} variant="outline">Refresh Session</Button>
            <Button onClick={forceReAuth} variant="destructive">Force Re-login</Button>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Session Data:</h3>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(sessionData, null, 2)}
            </pre>
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Cookies:</h3>
            <pre className="text-xs overflow-auto">
              {document.cookie}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
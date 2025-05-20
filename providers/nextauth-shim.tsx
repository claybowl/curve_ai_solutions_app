"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { loadSession } from "@/lib/session-storage"

// Define the session shape to match NextAuth
interface User {
  id: string
  email: string
  name?: string
  role?: string
  image?: string
}

interface Session {
  user: User
  expires: string
}

interface SessionContextValue {
  data: Session | null
  status: "loading" | "authenticated" | "unauthenticated"
  update: () => Promise<void>
}

// Create context
const SessionContext = createContext<SessionContextValue>({
  data: null,
  status: "loading",
  update: async () => {}
})

// SessionProvider component
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionData, setSessionData] = useState<Session | null>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")

  // Load session from localStorage on mount
  useEffect(() => {
    loadSessionData()
  }, [])

  const loadSessionData = () => {
    setStatus("loading")
    
    // Get session from localStorage
    const savedSession = loadSession()
    
    if (savedSession?.user) {
      // Convert to NextAuth format
      const nextAuthSession: Session = {
        user: {
          id: savedSession.user.id,
          email: savedSession.user.email,
          name: `${savedSession.user.user_metadata?.firstName || ''} ${savedSession.user.user_metadata?.lastName || ''}`.trim(),
          role: savedSession.user.user_metadata?.role || 'client',
          image: savedSession.user.user_metadata?.image
        },
        expires: new Date(savedSession.expires_at * 1000).toISOString()
      }
      
      setSessionData(nextAuthSession)
      setStatus("authenticated")
    } else {
      setSessionData(null)
      setStatus("unauthenticated")
    }
  }

  // Update session (for compatibility)
  const update = async () => {
    loadSessionData()
    return Promise.resolve()
  }

  const value: SessionContextValue = {
    data: sessionData,
    status,
    update
  }

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}

// Hook to access the session (replaces useSession from next-auth/react)
export function useSession() {
  return useContext(SessionContext)
}

// Dummy signIn function for compatibility
export const signIn = async () => {
  console.warn("next-auth signIn is stubbed - use Supabase Auth directly")
  window.location.href = "/login-local"
  return Promise.resolve()
}

// Dummy signOut function for compatibility
export const signOut = async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("curve_ai_auth_session")
  }
  window.location.href = "/"
  return Promise.resolve()
}
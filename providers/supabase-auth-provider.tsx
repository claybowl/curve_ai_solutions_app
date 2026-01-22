"use client"

/**
 * Supabase Auth Provider
 * 
 * Provides authentication context to the entire application using Supabase Auth.
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // Function to refresh user state
  const refreshUserState = React.useCallback(async () => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error getting session:', error)
        setUser(null)
        setSession(null)
      } else {
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
      }
    } catch (error) {
      console.error('Error refreshing user state:', error)
      setUser(null)
      setSession(null)
    } finally {
      setLoading(false)
    }
  }, [supabase.auth])

  useEffect(() => {
    // Initialize auth state on mount
    refreshUserState()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, currentSession: Session | null) => {
        setSession(currentSession)
        setUser(currentSession?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [refreshUserState, supabase.auth])

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Failed to sign out:', error)
        throw error
      }
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('Error during sign out:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    await refreshUserState()
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signOut,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to access Supabase Auth context
 * Maintains compatibility with existing code that uses useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a SupabaseAuthProvider')
  }
  return context
}

/**
 * Hook to get current user (for components that need direct user access)
 */
export function useUser() {
  const { user, loading } = useAuth()
  return { user, loading }
}

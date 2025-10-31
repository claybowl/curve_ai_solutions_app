/**
 * Stack Auth Provider
 * 
 * Provides authentication context to the entire application using Stack Auth.
 */

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { stackClientApp } from '@/stack/client'
import type { StackUser } from '@stackframe/js'

interface AuthContextType {
  user: StackUser | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function StackAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StackUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to refresh user state
  const refreshUserState = React.useCallback(async () => {
    try {
      const currentUser = await stackClientApp.getUser()
      setUser(currentUser)
      setLoading(false)
    } catch (error) {
      // User not authenticated
      setUser(null)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initialize auth state on mount
    refreshUserState()

    // Refresh auth state when window regains focus (handles OAuth redirects)
    const handleFocus = () => {
      refreshUserState()
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [refreshUserState])

  const signOut = async () => {
    try {
      await stackClientApp.signOut()
      setUser(null)
      setLoading(false)
    } catch (error) {
      console.error('Failed to sign out:', error)
      throw error
    }
  }

  const refreshUser = async () => {
    await refreshUserState()
  }

  const value: AuthContextType = {
    user,
    loading,
    signOut,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to access Stack Auth context
 * This maintains compatibility with existing code that uses useAuth()
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a StackAuthProvider')
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


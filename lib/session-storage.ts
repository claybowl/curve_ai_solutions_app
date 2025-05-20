"use client"

/**
 * A browser-only utility to handle session persistence when cookies aren't working
 */

// Session key for localStorage
const SESSION_KEY = 'curve_ai_auth_session'

/**
 * Save session data to localStorage
 */
export function saveSession(session: any) {
  if (typeof window === 'undefined') return

  try {
    // Store the session data
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_at: session.expires_at,
      user: {
        id: session.user.id,
        email: session.user.email,
        user_metadata: session.user.user_metadata
      }
    }))
    
    console.log('Session saved to localStorage')
  } catch (error) {
    console.error('Error saving session to localStorage:', error)
  }
}

/**
 * Load session data from localStorage
 */
export function loadSession() {
  if (typeof window === 'undefined') return null

  try {
    const sessionData = localStorage.getItem(SESSION_KEY)
    if (!sessionData) return null
    
    return JSON.parse(sessionData)
  } catch (error) {
    console.error('Error loading session from localStorage:', error)
    return null
  }
}

/**
 * Check if a session exists and is valid (not expired)
 */
export function hasValidSession() {
  if (typeof window === 'undefined') return false
  
  try {
    const session = loadSession()
    if (!session) return false
    
    // Check if session has expired
    const expiresAt = session.expires_at * 1000 // Convert to milliseconds
    const now = Date.now()
    
    return expiresAt > now
  } catch (error) {
    console.error('Error checking session validity:', error)
    return false
  }
}

/**
 * Check if the current user is an admin
 */
export function isUserAdmin() {
  if (typeof window === 'undefined') return false
  
  try {
    const session = loadSession()
    if (!session || !session.user) return false
    
    return session.user.user_metadata?.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Clear the stored session (logout)
 */
export function clearSession() {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(SESSION_KEY)
    console.log('Session cleared from localStorage')
  } catch (error) {
    console.error('Error clearing session from localStorage:', error)
  }
}
"use client"

import { useState } from "react"

export default function LastResortPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [showDashboard, setShowDashboard] = useState(false)

  // Add log with timestamp
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev])
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    addLog(`Attempting login with email: ${email}`)
    
    try {
      const { createClient } = await import('@supabase/supabase-js')
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables')
      }
      
      addLog(`Creating Supabase client with URL: ${supabaseUrl}`)
      
      // Create the client with minimal config
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false // Disable URL detection
        }
      })
      
      addLog('Authenticating with Supabase...')
      
      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        addLog(`Authentication error: ${error.message}`)
        setError(error.message)
        setLoading(false)
        return
      }
      
      if (!data.session) {
        addLog('No session returned after authentication')
        setError('Login successful but no session was created')
        setLoading(false)
        return
      }
      
      // Success!
      addLog(`Login successful! User ID: ${data.session.user.id}`)
      addLog(`User email: ${data.session.user.email}`)
      addLog(`Session ID: ${data.session.access_token.substring(0, 10)}...`)
      
      setUser(data.session.user)
      setSessionId(data.session.access_token)
      setShowDashboard(true)
      
      // Try to check cookies
      addLog('Checking cookies...')
      const cookies = document.cookie.split(';').map(c => c.trim())
      if (cookies.length === 0) {
        addLog('No cookies found')
      } else {
        cookies.forEach(cookie => {
          if (cookie.startsWith('sb-')) {
            addLog(`Found Supabase cookie: ${cookie}`)
          } else {
            addLog(`Other cookie: ${cookie}`)
          }
        })
      }
      
    } catch (err) {
      addLog(`Unexpected error: ${(err as Error).message}`)
      setError(`An error occurred: ${(err as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js')
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      addLog('Signing out...')
      await supabase.auth.signOut()
      addLog('Sign out complete')
      
      setUser(null)
      setSessionId(null)
      setShowDashboard(false)
      
    } catch (err) {
      addLog(`Logout error: ${(err as Error).message}`)
      setError(`Error logging out: ${(err as Error).message}`)
    }
  }

  // Function to manually navigate (only when user requests it)
  const navigateTo = (path: string) => {
    addLog(`Manually navigating to: ${path}`)
    window.location.href = path
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
        Last Resort Authentication Page
      </h1>
      
      <div style={{ 
        backgroundColor: '#FEF9C3', 
        padding: '12px', 
        borderRadius: '4px',
        marginBottom: '16px'
      }}>
        <p>This page combines login and dashboard in a single page - no redirects!</p>
      </div>
      
      {error && (
        <div style={{ 
          backgroundColor: '#FEE2E2', 
          padding: '12px', 
          borderRadius: '4px',
          color: '#B91C1C',
          marginBottom: '16px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {/* Login Form */}
      {!showDashboard && (
        <div style={{ marginBottom: '24px' }}>
          <form onSubmit={handleLogin} style={{ marginBottom: '16px' }}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                Email
              </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
                required
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                Password
              </label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#94A3B8' : '#2563EB',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>
      )}
      
      {/* Dashboard */}
      {showDashboard && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            backgroundColor: '#ECFDF5', 
            padding: '16px', 
            borderRadius: '4px',
            marginBottom: '16px'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#047857' }}>
              Authentication Successful!
            </h2>
            
            <div style={{ marginBottom: '8px' }}>
              <strong>Email:</strong> {user?.email}
            </div>
            
            <div style={{ marginBottom: '8px' }}>
              <strong>User ID:</strong> {user?.id}
            </div>
            
            <div style={{ marginBottom: '8px' }}>
              <strong>Role:</strong> {user?.user_metadata?.role || 'Not set'}
            </div>
            
            {user?.user_metadata?.firstName && (
              <div style={{ marginBottom: '8px' }}>
                <strong>Name:</strong> {user.user_metadata.firstName} {user.user_metadata.lastName || ''}
              </div>
            )}
            
            {sessionId && (
              <div style={{ marginBottom: '8px' }}>
                <strong>Session:</strong> <span style={{ fontFamily: 'monospace' }}>{sessionId.substring(0, 10)}...</span>
              </div>
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button 
              onClick={handleLogout}
              style={{
                backgroundColor: '#EF4444',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Log Out
            </button>
            
            <button 
              onClick={() => navigateTo('/dashboard')}
              style={{
                backgroundColor: '#2563EB',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Try Regular Dashboard
            </button>
          </div>
        </div>
      )}
      
      {/* Debug Logs */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Debug Logs</h3>
          <button
            onClick={() => setLogs([])}
            style={{
              backgroundColor: 'transparent',
              color: '#64748B',
              padding: '4px 8px',
              border: '1px solid #CBD5E1',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        </div>
        
        <div style={{ 
          backgroundColor: '#F1F5F9', 
          padding: '12px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '13px',
          maxHeight: '300px',
          overflow: 'auto'
        }}>
          {logs.length > 0 ? (
            logs.map((log, i) => (
              <div key={i} style={{ marginBottom: '4px' }}>{log}</div>
            ))
          ) : (
            <div style={{ color: '#64748B' }}>No logs yet</div>
          )}
        </div>
      </div>
      
      <div style={{ marginTop: '24px', color: '#64748B', fontSize: '14px' }}>
        <p>This page handles authentication without any redirects. After logging in, you'll see your user data above.</p>
        <p style={{ marginTop: '4px' }}>To try navigating to the regular dashboard, use the button after logging in.</p>
      </div>
    </div>
  )
}
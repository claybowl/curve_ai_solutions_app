"use client"

import { useEffect, useState } from "react"

export default function ManualDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState<string[]>([])

  // Add log with timestamp
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  useEffect(() => {
    // Create a new supabase client just for this page
    const loadSupabaseClient = async () => {
      try {
        addLog("Dynamically importing Supabase client...")
        const { createClient } = await import('@supabase/supabase-js')
        
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        
        if (!supabaseUrl || !supabaseAnonKey) {
          throw new Error('Missing Supabase environment variables')
        }
        
        addLog(`Creating Supabase client with URL: ${supabaseUrl}`)
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        })
        
        addLog("Checking for existing session...")
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          addLog(`Session error: ${error.message}`)
          setError(error.message)
          setLoading(false)
          return
        }
        
        if (data?.session) {
          addLog(`Session found! User ID: ${data.session.user.id}`)
          addLog(`User email: ${data.session.user.email}`)
          addLog(`User role: ${data.session.user.user_metadata?.role || 'none'}`)
          setUser(data.session.user)
        } else {
          addLog("No session found")
          setError("Not authenticated. Please log in first.")
        }
        
        setLoading(false)
      } catch (err) {
        addLog(`Error: ${(err as Error).message}`)
        setError(`An error occurred: ${(err as Error).message}`)
        setLoading(false)
      }
    }
    
    loadSupabaseClient()
  }, [])

  const handleLogout = async () => {
    try {
      addLog("Logging out...")
      const { createClient } = await import('@supabase/supabase-js')
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      
      const supabase = createClient(supabaseUrl, supabaseAnonKey)
      
      await supabase.auth.signOut()
      addLog("Logged out successfully")
      
      // Redirect to home page
      window.location.href = "/"
    } catch (err) {
      addLog(`Logout error: ${(err as Error).message}`)
      setError(`Error logging out: ${(err as Error).message}`)
    }
  }

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Loading...</h1>
        
        <div style={{ marginTop: '16px' }}>
          {logs.map((log, i) => (
            <div key={i} style={{ fontFamily: 'monospace', fontSize: '14px', marginBottom: '4px' }}>{log}</div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <div style={{ 
          backgroundColor: '#FEE2E2', 
          padding: '16px', 
          marginBottom: '20px', 
          borderRadius: '4px',
          color: '#B91C1C' 
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Error</h2>
          <p>{error}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <button 
            onClick={() => window.location.href = '/emergency-login'}
            style={{
              backgroundColor: '#2563EB',
              color: 'white',
              padding: '10px 16px',
              border: 'none',
              borderRadius: '4px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Go to Emergency Login
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              backgroundColor: 'transparent',
              color: '#64748B',
              padding: '10px 16px',
              border: '1px solid #CBD5E1',
              borderRadius: '4px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Return to Home
          </button>
        </div>
        
        <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Debug Logs</h3>
        <div style={{ 
          backgroundColor: '#F1F5F9', 
          padding: '12px',
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '14px'
        }}>
          {logs.map((log, i) => (
            <div key={i} style={{ marginBottom: '4px' }}>{log}</div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Manual Dashboard</h1>
      
      <div style={{ 
        backgroundColor: '#ECFDF5', 
        padding: '16px', 
        marginBottom: '20px', 
        borderRadius: '4px'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#047857' }}>
          You are logged in!
        </h2>
        
        <div style={{ fontSize: '16px', marginBottom: '8px' }}>
          <strong>Email:</strong> {user?.email}
        </div>
        
        <div style={{ fontSize: '16px', marginBottom: '8px' }}>
          <strong>User ID:</strong> {user?.id}
        </div>
        
        <div style={{ fontSize: '16px', marginBottom: '8px' }}>
          <strong>Role:</strong> {user?.user_metadata?.role || 'Not set'}
        </div>
        
        {user?.user_metadata?.firstName && (
          <div style={{ fontSize: '16px', marginBottom: '8px' }}>
            <strong>Name:</strong> {user.user_metadata.firstName} {user.user_metadata.lastName || ''}
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleLogout}
          style={{
            backgroundColor: '#EF4444',
            color: 'white',
            padding: '10px 16px',
            border: 'none',
            borderRadius: '4px',
            fontWeight: '500',
            cursor: 'pointer',
            marginRight: '12px'
          }}
        >
          Log Out
        </button>
        
        <button 
          onClick={() => window.location.href = '/dashboard'}
          style={{
            backgroundColor: '#0076FF',
            color: 'white',
            padding: '10px 16px',
            border: 'none',
            borderRadius: '4px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          Go to Regular Dashboard
        </button>
      </div>
      
      <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Debug Logs</h3>
      <div style={{ 
        backgroundColor: '#F1F5F9', 
        padding: '12px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        fontSize: '14px',
        maxHeight: '300px',
        overflow: 'auto'
      }}>
        {logs.map((log, i) => (
          <div key={i} style={{ marginBottom: '4px' }}>{log}</div>
        ))}
      </div>
      
      <div style={{ marginTop: '24px', fontSize: '14px', color: '#64748B' }}>
        <p>This is a minimalist dashboard page that bypasses most of the UI components to verify authentication.</p>
        <p style={{ marginTop: '8px' }}>
          It uses a fresh Supabase client and minimal dependencies to troubleshoot issues.
        </p>
      </div>
    </div>
  )
}
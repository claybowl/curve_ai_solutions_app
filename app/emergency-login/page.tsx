"use client"

import { useState } from "react"
import { createClient } from '@supabase/supabase-js'

export default function EmergencyLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  // Add log message
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`])
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    addLog(`Login attempt with email: ${email}`)
    
    try {
      // Get environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables')
      }
      
      addLog(`Using Supabase URL: ${supabaseUrl}`)
      
      // Create a fresh Supabase client for this login only
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      })
      
      addLog('Authenticating with Supabase...')
      
      // Sign in
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
      
      // Login successful!
      addLog(`Login successful! User ID: ${data.session.user.id}`)
      addLog(`User email: ${data.session.user.email}`)
      addLog(`Session expires: ${new Date(data.session.expires_at! * 1000).toLocaleString()}`)
      
      // Redirect with native browser navigation
      addLog('Redirecting to dashboard with native navigation...')
      
      // Wait a moment to allow cookies to be set
      setTimeout(() => {
        // Use direct browser navigation to dashboard
        window.location.href = '/dashboard'
      }, 1000)
      
    } catch (err) {
      addLog(`Unexpected error: ${(err as Error).message}`)
      setError(`An error occurred: ${(err as Error).message}`)
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Emergency Login</h1>
      
      {error && (
        <div style={{ 
          backgroundColor: '#FEE2E2', 
          padding: '10px', 
          marginBottom: '16px', 
          borderRadius: '4px',
          color: '#B91C1C' 
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
            Email
          </label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '4px', fontWeight: '500' }}>
            Password
          </label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px' 
            }}
          />
        </div>
        
        <button 
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: loading ? '#94A3B8' : '#2563EB',
            color: 'white',
            padding: '10px 16px',
            border: 'none',
            borderRadius: '4px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%'
          }}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      
      {logs.length > 0 && (
        <div style={{ marginTop: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' }}>Debug Logs</h2>
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
        </div>
      )}
      
      <div style={{ marginTop: '24px', fontSize: '14px', color: '#64748B' }}>
        <p>This is an emergency login page that bypasses all the normal UI components to troubleshoot authentication issues.</p>
        <p style={{ marginTop: '8px' }}>
          After successful login, you'll be redirected to the dashboard with a full page reload.
        </p>
      </div>
    </div>
  )
}
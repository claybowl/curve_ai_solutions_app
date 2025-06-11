"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function FixProfilePage() {
  const [usersWithoutProfiles, setUsersWithoutProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const checkUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/create-profile')
      const data = await response.json()
      
      if (data.success) {
        setUsersWithoutProfiles(data.usersWithoutProfiles)
        setMessage(`Found ${data.usersWithoutProfiles.length} users without profiles (${data.totalProfiles} profiles for ${data.totalUsers} users)`)
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`Error: ${error}`)
    }
    setLoading(false)
  }

  const deleteUser = async (user: any) => {
    if (!confirm(`Are you sure you want to delete user ${user.email}?`)) {
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch('/api/admin/debug-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          userIds: [user.id]
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage(`User ${user.email} deleted successfully`)
        // Refresh the list
        checkUsers()
      } else {
        setMessage(`Error deleting user: ${data.error}`)
      }
    } catch (error) {
      setMessage(`Error: ${error}`)
    }
    setLoading(false)
  }

  const createProfile = async (user: any) => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          firstName: user.user_metadata?.firstName || user.user_metadata?.first_name || 'User',
          lastName: user.user_metadata?.lastName || user.user_metadata?.last_name || '',
          companyName: user.user_metadata?.companyName || user.user_metadata?.company_name || '',
          role: user.user_metadata?.role || 'client'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setMessage(`Profile created for ${user.email}`)
        // Refresh the list
        checkUsers()
      } else {
        setMessage(`Error creating profile: ${data.error}`)
      }
    } catch (error) {
      setMessage(`Error: ${error}`)
    }
    setLoading(false)
  }

  useEffect(() => {
    checkUsers()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Fix User Profiles</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Users Without Profiles</CardTitle>
            <CardDescription>
              Create missing profiles for authenticated users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={checkUsers}
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Refresh Users'}
            </Button>
            
            {message && (
              <Alert>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}
            
            {usersWithoutProfiles.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Users Missing Profiles ({usersWithoutProfiles.length}):</h3>
                {usersWithoutProfiles.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-3 border rounded bg-white">
                    <div className="flex-1">
                      <p className="font-medium">{user.email || 'No email'}</p>
                      <p className="text-sm text-gray-600">ID: {user.id}</p>
                      <p className="text-sm text-gray-600">
                        Created: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Metadata: {JSON.stringify(user.user_metadata || {})}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button 
                        onClick={() => createProfile(user)}
                        disabled={loading}
                        size="sm"
                        className="whitespace-nowrap"
                      >
                        Create Profile
                      </Button>
                      <Button 
                        onClick={() => deleteUser(user)}
                        disabled={loading}
                        size="sm"
                        variant="destructive"
                        className="whitespace-nowrap"
                      >
                        Delete User
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {usersWithoutProfiles.length === 0 && !loading && (
              <Alert>
                <AlertDescription>
                  All users have profiles! ✅
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
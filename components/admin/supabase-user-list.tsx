"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, Search, UserPlus, RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Updated type to match V2 schema (profiles table)
type User = {
  user_id: string
  email: string
  first_name: string
  last_name: string
  role: 'admin' | 'client' | 'consultant'
  company_name?: string
  created_at: string
  last_login_at?: string
}

export function SupabaseUserList() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error',
    message: string
  } | null>(null)

  // Fetch users directly from Supabase (since we're client-side)
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Fetching users from Supabase...')
      
      const supabase = createClientComponentClient()
      
      // Check if current user is authenticated and is admin
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Please log in to access this feature')
      }

      // Check if current user is admin
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single()

      if (currentProfile?.role !== 'admin') {
        throw new Error('Admin access required. You do not have permission to view this page.')
      }
      
      // Fetch all users from profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (profilesError) {
        console.error('Supabase Error:', profilesError)
        throw new Error(profilesError.message || 'Failed to fetch users')
      }
      
      console.log('Users data:', profiles)
      setUsers(profiles || [])
    } catch (err: any) {
      console.error('Error fetching users:', err)
      setError(err.message || 'An error occurred while fetching users')
    } finally {
      setLoading(false)
    }
  }

  // Update user role
  const updateUserRole = async (userId: string, role: 'admin' | 'client' | 'consultant') => {
    try {
      const supabase = createClientComponentClient()
      
      // Update role in profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('user_id', userId)
      
      if (error) {
        console.error('Supabase Error:', error)
        throw new Error(error.message || 'Failed to update user role')
      }
      
      // Update local user data
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.user_id === userId 
            ? { ...user, role } 
            : user
        )
      )
      
      setNotification({
        type: 'success',
        message: `User role updated to ${role} successfully.`
      })
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
      
    } catch (err: any) {
      console.error('Error updating user role:', err)
      setNotification({
        type: 'error',
        message: err.message || 'Failed to update user role'
      })
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000)
    }
  }

  // Filter users based on search term and role
  useEffect(() => {
    let filtered = users;
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.company_name || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => 
        user.role === roleFilter
      )
    }
    
    setFilteredUsers(filtered)
  }, [users, searchTerm, roleFilter])

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="space-y-4">
      {notification && (
        <div className={`p-4 mb-4 rounded-md flex items-center gap-2 ${
          notification.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <p>{notification.message}</p>
          <button 
            className="ml-auto text-sm font-medium"
            onClick={() => setNotification(null)}
          >
            Dismiss
          </button>
        </div>
      )}
      
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="client">Client</option>
          <option value="consultant">Consultant</option>
        </select>
        <Button
          variant="outline"
          onClick={fetchUsers}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 p-4 bg-red-50 text-red-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-medium">Error loading users</h3>
          </div>
          <p>{error}</p>
          <Button 
            onClick={fetchUsers}
            variant="outline"
            size="sm"
            className="mt-3"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <div className="rounded-md border overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Sign In
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created At
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center space-x-2">
                      <RefreshCw className="h-5 w-5 animate-spin text-blue-500" />
                      <span>Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <p className="text-gray-500">No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.user_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      {user.company_name && (
                        <div className="text-xs text-gray-400">{user.company_name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={user.role === "admin" ? "destructive" : "default"}
                        className={user.role === "admin" ? "bg-purple-500" : user.role === "consultant" ? "bg-blue-500" : ""}
                      >
                        {user.role === "admin" ? "Admin" : user.role === "client" ? "Client" : user.role === "consultant" ? "Consultant" : "Unknown"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_login_at ? new Date(user.last_login_at).toLocaleString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Dialog open={isRoleDialogOpen && selectedUser?.user_id === user.user_id} onOpenChange={(open) => {
                          if (!open) setSelectedUser(null);
                          setIsRoleDialogOpen(open);
                        }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit Role</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Set User Role</DialogTitle>
                              <DialogDescription>
                                Update the role for {selectedUser?.email}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-col gap-4 py-4">
                              <div className="flex flex-col gap-2">
                                <div className="font-medium">Current Role:</div>
                                <Badge
                                  variant={selectedUser?.role === "admin" ? "destructive" : "default"}
                                  className={`w-fit ${selectedUser?.role === "admin" ? "bg-purple-500" : selectedUser?.role === "consultant" ? "bg-blue-500" : ""}`}
                                >
                                  {selectedUser?.role === "admin" ? "Admin" : selectedUser?.role === "client" ? "Client" : selectedUser?.role === "consultant" ? "Consultant" : "Unknown"}
                                </Badge>
                              </div>
                              <div className="flex flex-col gap-2">
                                <div className="font-medium">New Role:</div>
                                <div className="flex gap-2">
                                  <Button
                                    variant={selectedUser?.role === "client" ? "outline" : "default"}
                                    onClick={() => {
                                      if (selectedUser) {
                                        updateUserRole(selectedUser.user_id, 'client');
                                        setIsRoleDialogOpen(false);
                                      }
                                    }}
                                  >
                                    Set as Client
                                  </Button>
                                  <Button
                                    variant={selectedUser?.role === "consultant" ? "outline" : "default"}
                                    onClick={() => {
                                      if (selectedUser) {
                                        updateUserRole(selectedUser.user_id, 'consultant');
                                        setIsRoleDialogOpen(false);
                                      }
                                    }}
                                  >
                                    Set as Consultant
                                  </Button>
                                  <Button
                                    variant={selectedUser?.role === "admin" ? "outline" : "destructive"}
                                    onClick={() => {
                                      if (selectedUser) {
                                        updateUserRole(selectedUser.user_id, 'admin');
                                        setIsRoleDialogOpen(false);
                                      }
                                    }}
                                  >
                                    Set as Admin
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">{filteredUsers.length}</span> of{" "}
          <span className="font-medium">{users.length}</span> users
        </div>
      </div>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, UserPlus, Edit, Trash2, Shield, User, Users, AlertCircle, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Define user types and roles
type UserRole = "admin" | "client" | "manager" | "viewer"
type MembershipTier = "free" | "basic" | "premium" | "enterprise"

interface UserData {
  id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  company_name?: string
  membership_tier?: MembershipTier
  created_at: string
  last_login?: string
  status: "active" | "inactive" | "suspended"
}

// Mock API function to fetch users
const fetchUsers = async (): Promise<UserData[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          email: "admin@curveai.com",
          first_name: "Admin",
          last_name: "User",
          role: "admin",
          company_name: "Curve AI Solutions",
          membership_tier: "enterprise",
          created_at: "2023-01-15T00:00:00Z",
          last_login: "2023-06-20T14:30:00Z",
          status: "active",
        },
        {
          id: "2",
          email: "john@example.com",
          first_name: "John",
          last_name: "Doe",
          role: "client",
          company_name: "Acme Inc",
          membership_tier: "premium",
          created_at: "2023-02-10T00:00:00Z",
          last_login: "2023-06-18T09:15:00Z",
          status: "active",
        },
        {
          id: "3",
          email: "sarah@example.com",
          first_name: "Sarah",
          last_name: "Johnson",
          role: "manager",
          company_name: "Tech Solutions",
          membership_tier: "basic",
          created_at: "2023-03-05T00:00:00Z",
          last_login: "2023-06-19T16:45:00Z",
          status: "active",
        },
        {
          id: "4",
          email: "mike@example.com",
          first_name: "Mike",
          last_name: "Brown",
          role: "viewer",
          company_name: "Brown Consulting",
          membership_tier: "free",
          created_at: "2023-04-20T00:00:00Z",
          last_login: "2023-06-15T11:30:00Z",
          status: "inactive",
        },
        {
          id: "5",
          email: "lisa@example.com",
          first_name: "Lisa",
          last_name: "Taylor",
          role: "client",
          company_name: "Taylor Industries",
          membership_tier: "premium",
          created_at: "2023-05-12T00:00:00Z",
          last_login: "2023-06-17T13:20:00Z",
          status: "suspended",
        },
      ])
    }, 1000)
  })
}

// Mock API function to update user role
const updateUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 500)
  })
}

// Mock API function to update user membership tier
const updateUserMembership = async (userId: string, tier: MembershipTier): Promise<boolean> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 500)
  })
}

// Mock API function to update user status
const updateUserStatus = async (userId: string, status: "active" | "inactive" | "suspended"): Promise<boolean> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 500)
  })
}

export default function UserManagementPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserData[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [editingRole, setEditingRole] = useState<UserRole | null>(null)
  const [editingMembership, setEditingMembership] = useState<MembershipTier | null>(null)
  const [editingStatus, setEditingStatus] = useState<"active" | "inactive" | "suspended" | null>(null)
  const [processingAction, setProcessingAction] = useState(false)

  // Fetch users on component mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        const userData = await fetchUsers()
        setUsers(userData)
        setFilteredUsers(userData)
      } catch (err) {
        setError("Failed to load users. Please try again.")
        console.error("Error loading users:", err)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Filter users when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users)
    } else {
      const lowercasedSearch = searchTerm.toLowerCase()
      const filtered = users.filter(
        (user) =>
          user.email.toLowerCase().includes(lowercasedSearch) ||
          user.first_name.toLowerCase().includes(lowercasedSearch) ||
          user.last_name.toLowerCase().includes(lowercasedSearch) ||
          (user.company_name && user.company_name.toLowerCase().includes(lowercasedSearch)),
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  // Handle role change
  const handleRoleChange = async () => {
    if (!selectedUser || !editingRole) return

    setProcessingAction(true)
    try {
      const success = await updateUserRole(selectedUser.id, editingRole)
      if (success) {
        // Update local state
        const updatedUsers = users.map((user) => (user.id === selectedUser.id ? { ...user, role: editingRole } : user))
        setUsers(updatedUsers)
        setFilteredUsers(updatedUsers)

        toast({
          title: "Role updated",
          description: `${selectedUser.first_name} ${selectedUser.last_name}'s role has been updated to ${editingRole}.`,
        })

        setEditDialogOpen(false)
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(false)
    }
  }

  // Handle membership tier change
  const handleMembershipChange = async () => {
    if (!selectedUser || !editingMembership) return

    setProcessingAction(true)
    try {
      const success = await updateUserMembership(selectedUser.id, editingMembership)
      if (success) {
        // Update local state
        const updatedUsers = users.map((user) =>
          user.id === selectedUser.id ? { ...user, membership_tier: editingMembership } : user,
        )
        setUsers(updatedUsers)
        setFilteredUsers(updatedUsers)

        toast({
          title: "Membership updated",
          description: `${selectedUser.first_name} ${selectedUser.last_name}'s membership has been updated to ${editingMembership}.`,
        })

        setEditDialogOpen(false)
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update user membership. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(false)
    }
  }

  // Handle status change
  const handleStatusChange = async () => {
    if (!selectedUser || !editingStatus) return

    setProcessingAction(true)
    try {
      const success = await updateUserStatus(selectedUser.id, editingStatus)
      if (success) {
        // Update local state
        const updatedUsers = users.map((user) =>
          user.id === selectedUser.id ? { ...user, status: editingStatus } : user,
        )
        setUsers(updatedUsers)
        setFilteredUsers(updatedUsers)

        toast({
          title: "Status updated",
          description: `${selectedUser.first_name} ${selectedUser.last_name}'s status has been updated to ${editingStatus}.`,
        })

        setEditDialogOpen(false)
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingAction(false)
    }
  }

  // Open edit dialog for role
  const openEditRoleDialog = (user: UserData) => {
    setSelectedUser(user)
    setEditingRole(user.role)
    setEditingMembership(null)
    setEditingStatus(null)
    setEditDialogOpen(true)
  }

  // Open edit dialog for membership
  const openEditMembershipDialog = (user: UserData) => {
    setSelectedUser(user)
    setEditingRole(null)
    setEditingMembership(user.membership_tier || "free")
    setEditingStatus(null)
    setEditDialogOpen(true)
  }

  // Open edit dialog for status
  const openEditStatusDialog = (user: UserData) => {
    setSelectedUser(user)
    setEditingRole(null)
    setEditingMembership(null)
    setEditingStatus(user.status)
    setEditDialogOpen(true)
  }

  // Get badge color based on role
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-red-500 hover:bg-red-600"
      case "manager":
        return "bg-purple-500 hover:bg-purple-600"
      case "client":
        return "bg-blue-500 hover:bg-blue-600"
      case "viewer":
        return "bg-gray-500 hover:bg-gray-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  // Get badge color based on membership tier
  const getMembershipBadgeColor = (tier?: MembershipTier) => {
    switch (tier) {
      case "enterprise":
        return "bg-indigo-500 hover:bg-indigo-600"
      case "premium":
        return "bg-amber-500 hover:bg-amber-600"
      case "basic":
        return "bg-green-500 hover:bg-green-600"
      case "free":
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  // Get badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500 hover:bg-green-600"
      case "inactive":
        return "bg-gray-500 hover:bg-gray-600"
      case "suspended":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-[#0076FF]" />
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex items-center text-red-500 mb-4">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h2 className="text-xl font-bold">Error</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1A365D] dark:text-white">User Management</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage user roles, permissions, and access levels</p>
          </div>
          <Button className="bg-[#0076FF] hover:bg-[#0076FF]/90">
            <UserPlus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>

        {/* Search and filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
              onChange={(e) => {
                const role = e.target.value
                if (role === "all") {
                  setFilteredUsers(users)
                } else {
                  setFilteredUsers(users.filter((user) => user.role === role))
                }
              }}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="client">Client</option>
              <option value="viewer">Viewer</option>
            </select>
            <select
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
              onChange={(e) => {
                const status = e.target.value
                if (status === "all") {
                  setFilteredUsers(users)
                } else {
                  setFilteredUsers(users.filter((user) => user.status === status))
                }
              }}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Users table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Membership</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-[#0076FF] flex items-center justify-center text-white font-medium mr-3">
                          {user.first_name[0]}
                          {user.last_name[0]}
                        </div>
                        <div>
                          <div className="font-medium">
                            {user.first_name} {user.last_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                          {user.company_name && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">{user.company_name}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`cursor-pointer ${getRoleBadgeColor(user.role)}`}
                        onClick={() => openEditRoleDialog(user)}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`cursor-pointer ${getMembershipBadgeColor(user.membership_tier)}`}
                        onClick={() => openEditMembershipDialog(user)}
                      >
                        {user.membership_tier || "free"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`cursor-pointer ${getStatusBadgeColor(user.status)}`}
                        onClick={() => openEditStatusDialog(user)}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>{formatDate(user.last_login)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditRoleDialog(user)}>
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Change Role</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditMembershipDialog(user)}>
                            <Users className="mr-2 h-4 w-4" />
                            <span>Change Membership</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEditStatusDialog(user)}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Change Status</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete User</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No users found matching your search criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Edit Role Dialog */}
        <Dialog open={editDialogOpen && editingRole !== null} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change User Role</DialogTitle>
              <DialogDescription>
                Update the role for {selectedUser?.first_name} {selectedUser?.last_name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <Button
                  variant={editingRole === "admin" ? "default" : "outline"}
                  className={editingRole === "admin" ? "bg-red-500 hover:bg-red-600" : ""}
                  onClick={() => setEditingRole("admin")}
                >
                  Admin
                </Button>
                <Button
                  variant={editingRole === "manager" ? "default" : "outline"}
                  className={editingRole === "manager" ? "bg-purple-500 hover:bg-purple-600" : ""}
                  onClick={() => setEditingRole("manager")}
                >
                  Manager
                </Button>
                <Button
                  variant={editingRole === "client" ? "default" : "outline"}
                  className={editingRole === "client" ? "bg-blue-500 hover:bg-blue-600" : ""}
                  onClick={() => setEditingRole("client")}
                >
                  Client
                </Button>
                <Button
                  variant={editingRole === "viewer" ? "default" : "outline"}
                  className={editingRole === "viewer" ? "bg-gray-500 hover:bg-gray-600" : ""}
                  onClick={() => setEditingRole("viewer")}
                >
                  Viewer
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Role Permissions:</h4>
                {editingRole === "admin" && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Full access to all features, including user management, system settings, and sensitive data.
                  </p>
                )}
                {editingRole === "manager" && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Can manage client accounts, view reports, and access most features except system settings.
                  </p>
                )}
                {editingRole === "client" && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Standard user access to features based on their membership tier.
                  </p>
                )}
                {editingRole === "viewer" && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Read-only access to specific content. Cannot make changes or access sensitive data.
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleRoleChange}
                disabled={processingAction}
                className="bg-[#0076FF] hover:bg-[#0076FF]/90"
              >
                {processingAction ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Membership Dialog */}
        <Dialog open={editDialogOpen && editingMembership !== null} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Membership Tier</DialogTitle>
              <DialogDescription>
                Update the membership tier for {selectedUser?.first_name} {selectedUser?.last_name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <Button
                  variant={editingMembership === "enterprise" ? "default" : "outline"}
                  className={editingMembership === "enterprise" ? "bg-indigo-500 hover:bg-indigo-600" : ""}
                  onClick={() => setEditingMembership("enterprise")}
                >
                  Enterprise
                </Button>
                <Button
                  variant={editingMembership === "premium" ? "default" : "outline"}
                  className={editingMembership === "premium" ? "bg-amber-500 hover:bg-amber-600" : ""}
                  onClick={() => setEditingMembership("premium")}
                >
                  Premium
                </Button>
                <Button
                  variant={editingMembership === "basic" ? "default" : "outline"}
                  className={editingMembership === "basic" ? "bg-green-500 hover:bg-green-600" : ""}
                  onClick={() => setEditingMembership("basic")}
                >
                  Basic
                </Button>
                <Button
                  variant={editingMembership === "free" ? "default" : "outline"}
                  className={editingMembership === "free" ? "bg-gray-500 hover:bg-gray-600" : ""}
                  onClick={() => setEditingMembership("free")}
                >
                  Free
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Tier Features:</h4>
                {editingMembership === "enterprise" && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Full access to all features, priority support, custom integrations, and unlimited usage.
                  </p>
                )}
                {editingMembership === "premium" && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Advanced features, priority support, and higher usage limits than basic tier.
                  </p>
                )}
                {editingMembership === "basic" && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Standard features with limited usage and regular support.
                  </p>
                )}
                {editingMembership === "free" && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Limited access to basic features with usage restrictions.
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleMembershipChange}
                disabled={processingAction}
                className="bg-[#0076FF] hover:bg-[#0076FF]/90"
              >
                {processingAction ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Status Dialog */}
        <Dialog open={editDialogOpen && editingStatus !== null} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change User Status</DialogTitle>
              <DialogDescription>
                Update the status for {selectedUser?.first_name} {selectedUser?.last_name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={editingStatus === "active" ? "default" : "outline"}
                  className={editingStatus === "active" ? "bg-green-500 hover:bg-green-600" : ""}
                  onClick={() => setEditingStatus("active")}
                >
                  Active
                </Button>
                <Button
                  variant={editingStatus === "inactive" ? "default" : "outline"}
                  className={editingStatus === "inactive" ? "bg-gray-500 hover:bg-gray-600" : ""}
                  onClick={() => setEditingStatus("inactive")}
                >
                  Inactive
                </Button>
                <Button
                  variant={editingStatus === "suspended" ? "default" : "outline"}
                  className={editingStatus === "suspended" ? "bg-red-500 hover:bg-red-600" : ""}
                  onClick={() => setEditingStatus("suspended")}
                >
                  Suspended
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Status Effects:</h4>
                {editingStatus === "active" && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    User has full access to the platform based on their role and membership tier.
                  </p>
                )}
                {editingStatus === "inactive" && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    User account is disabled but can be reactivated. User cannot log in while inactive.
                  </p>
                )}
                {editingStatus === "suspended" && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    User account is temporarily disabled due to policy violations or payment issues. Requires admin
                    review to reactivate.
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleStatusChange}
                disabled={processingAction}
                className="bg-[#0076FF] hover:bg-[#0076FF]/90"
              >
                {processingAction ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

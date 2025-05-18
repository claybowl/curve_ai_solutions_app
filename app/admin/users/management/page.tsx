"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle 
} from "@/components/ui/dialog"
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { 
  Plus, MoreVertical, Pencil, Trash2, Search, 
  User, Mail, Building, UserPlus, ShieldAlert, 
  ChevronDown, Eye, KeyRound, RotateCw
} from "lucide-react"
import {
  getAllUsersAction,
  createUserAction,
  updateUserAction,
  deleteUserAction,
  getUserRolesAction,
  resetUserPasswordAction
} from "@/app/actions/user-actions"
import { UserFilter } from "@/lib/db-users"

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  companyName?: string;
  role: string;
  createdAt: string;
}

export default function UserManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [availableRoles, setAvailableRoles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  
  // Filter and sort state
  const [filterRole, setFilterRole] = useState<string | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortColumn, setSortColumn] = useState<string>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  
  // Dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    companyName: "",
    role: "",
    password: ""
  })
  
  // Password reset state
  const [newPassword, setNewPassword] = useState("")

  useEffect(() => {
    loadUsers()
    loadRoles()
  }, [activeTab, filterRole, sortColumn, sortDirection])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      // Build filter
      const filter: UserFilter = {
        sortBy: sortColumn,
        sortDirection: sortDirection
      }
      
      if (activeTab !== "all") {
        filter.role = activeTab
      } else if (filterRole) {
        filter.role = filterRole
      }
      
      if (searchTerm) {
        filter.searchTerm = searchTerm
      }
      
      const fetchedUsers = await getAllUsersAction(filter)
      setUsers(fetchedUsers)
    } catch (err) {
      console.error("Error loading users:", err)
      setError("Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }

  const loadRoles = async () => {
    try {
      const roles = await getUserRolesAction()
      setAvailableRoles(roles)
    } catch (err) {
      console.error("Error loading roles:", err)
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new column with default desc direction
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadUsers()
  }

  const handleRoleFilter = (role: string | undefined) => {
    setFilterRole(role)
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const formDataObj = new FormData()
      formDataObj.append("email", formData.email)
      formDataObj.append("firstName", formData.firstName)
      formDataObj.append("lastName", formData.lastName)
      formDataObj.append("companyName", formData.companyName)
      formDataObj.append("role", formData.role)
      
      if (formData.password) {
        formDataObj.append("password", formData.password)
      }
      
      const result = await createUserAction(formDataObj)
      
      if (result.success) {
        toast({
          title: "User Created",
          description: `User account for ${formData.firstName} ${formData.lastName} was created successfully.`,
          variant: "default",
        })
        setIsCreateDialogOpen(false)
        resetForm()
        loadUsers()
      } else {
        toast({
          title: "Error Creating User",
          description: result.error || "An error occurred while creating the user.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error creating user:", err)
      toast({
        title: "Error",
        description: "An error occurred while creating the user.",
        variant: "destructive",
      })
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser) return
    
    try {
      const formDataObj = new FormData()
      formDataObj.append("email", formData.email)
      formDataObj.append("firstName", formData.firstName)
      formDataObj.append("lastName", formData.lastName)
      formDataObj.append("companyName", formData.companyName)
      formDataObj.append("role", formData.role)
      
      if (formData.password) {
        formDataObj.append("password", formData.password)
      }
      
      const result = await updateUserAction(currentUser.id, formDataObj)
      
      if (result.success) {
        toast({
          title: "User Updated",
          description: `User account for ${formData.firstName} ${formData.lastName} was updated successfully.`,
          variant: "default",
        })
        setIsEditDialogOpen(false)
        resetForm()
        loadUsers()
      } else {
        toast({
          title: "Error Updating User",
          description: result.error || "An error occurred while updating the user.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error updating user:", err)
      toast({
        title: "Error",
        description: "An error occurred while updating the user.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteConfirm = async () => {
    if (!currentUser) return
    
    try {
      const result = await deleteUserAction(currentUser.id)
      
      if (result.success) {
        toast({
          title: "User Deleted",
          description: `User account for ${currentUser.firstName} ${currentUser.lastName} was deleted successfully.`,
          variant: "default",
        })
        setIsDeleteDialogOpen(false)
        setCurrentUser(null)
        loadUsers()
      } else {
        toast({
          title: "Error Deleting User",
          description: result.error || "An error occurred while deleting the user.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error deleting user:", err)
      toast({
        title: "Error",
        description: "An error occurred while deleting the user.",
        variant: "destructive",
      })
    }
  }

  const handleResetPassword = async () => {
    if (!currentUser || !newPassword) return
    
    try {
      const result = await resetUserPasswordAction(currentUser.id, newPassword)
      
      if (result.success) {
        toast({
          title: "Password Reset",
          description: `Password for ${currentUser.firstName} ${currentUser.lastName} was reset successfully.`,
          variant: "default",
        })
        setIsResetPasswordDialogOpen(false)
        setNewPassword("")
        setCurrentUser(null)
      } else {
        toast({
          title: "Error Resetting Password",
          description: result.error || "An error occurred while resetting the password.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error resetting password:", err)
      toast({
        title: "Error",
        description: "An error occurred while resetting the password.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      companyName: "",
      role: "",
      password: ""
    })
    setCurrentUser(null)
  }

  const handleEditUser = (user: User) => {
    setCurrentUser(user)
    setFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName || "",
      role: user.role,
      password: "" // Empty password field for edit
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    setCurrentUser(user)
    setIsDeleteDialogOpen(true)
  }

  const handleResetPasswordDialog = (user: User) => {
    setCurrentUser(user)
    setNewPassword("")
    setIsResetPasswordDialogOpen(true)
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
      case "client":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400"
    }
  }

  return (
    <DashboardLayout
      title="User Management"
      description="Manage user accounts, roles, and permissions"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Users", href: "/admin/users" },
        { label: "Management", href: "/admin/users/management", current: true }
      ]}
      actions={
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex-1 w-full">
                <form onSubmit={handleSearch} className="flex w-full items-center space-x-2">
                  <Input
                    type="search"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="sm" variant="outline">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>
              
              <div className="flex w-full sm:w-auto">
                <Select
                  value={filterRole}
                  onValueChange={handleRoleFilter}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={undefined}>All Roles</SelectItem>
                    {availableRoles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage user accounts and permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  <p>Loading users...</p>
                </div>
              </div>
            ) : error ? (
              <div className="py-8 text-center">
                <p className="text-red-500">{error}</p>
                <Button variant="outline" className="mt-4" onClick={loadUsers}>
                  Retry
                </Button>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No users found</p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  Create Your First User
                </Button>
              </div>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="min-w-[150px]"
                        onClick={() => handleSort("email")}
                      >
                        <div className="flex items-center gap-1 cursor-pointer">
                          <Mail className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="hidden sm:inline">Email</span>
                          <span className="sm:hidden">Email</span>
                          {sortColumn === "email" && (
                            <ChevronDown className={`h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="min-w-[100px]"
                        onClick={() => handleSort("firstName")}
                      >
                        <div className="flex items-center gap-1 cursor-pointer">
                          <User className="h-4 w-4 text-muted-foreground mr-1" />
                          Name
                          {sortColumn === "firstName" && (
                            <ChevronDown className={`h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="hidden md:table-cell min-w-[120px]"
                        onClick={() => handleSort("companyName")}
                      >
                        <div className="flex items-center gap-1 cursor-pointer">
                          <Building className="h-4 w-4 text-muted-foreground mr-1" />
                          Company
                          {sortColumn === "companyName" && (
                            <ChevronDown className={`h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="min-w-[80px]"
                        onClick={() => handleSort("role")}
                      >
                        <div className="flex items-center gap-1 cursor-pointer">
                          <ShieldAlert className="h-4 w-4 text-muted-foreground mr-1" />
                          Role
                          {sortColumn === "role" && (
                            <ChevronDown className={`h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead 
                        className="hidden lg:table-cell min-w-[100px]"
                        onClick={() => handleSort("createdAt")}
                      >
                        <div className="flex items-center gap-1 cursor-pointer">
                          Created
                          {sortColumn === "createdAt" && (
                            <ChevronDown className={`h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right w-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map(user => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium truncate max-w-[200px]">
                          <span className="truncate block">{user.email}</span>
                        </TableCell>
                        <TableCell className="truncate max-w-[120px]">
                          <span className="truncate block">{user.firstName} {user.lastName}</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell truncate max-w-[150px]">
                          <span className="truncate block">{user.companyName || "-"}</span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={getRoleBadgeVariant(user.role)}
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right p-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResetPasswordDialog(user)}>
                                <KeyRound className="mr-2 h-4 w-4" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteUser(user)}
                                className="text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] w-full">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Add a new user to the system. All fields are required.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="email" className="sm:text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="sm:col-span-3"
                  required
                  type="email"
                />
              </div>
              <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="firstName" className="sm:text-right">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="sm:col-span-3"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="lastName" className="sm:text-right">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="sm:col-span-3"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="companyName" className="sm:text-right">
                  Company
                </Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="sm:col-span-3"
                />
              </div>
              <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="role" className="sm:text-right">
                  Role
                </Label>
                <div className="sm:col-span-3">
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                    required
                  >
                    <SelectTrigger id="role" className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="password" className="sm:text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="sm:col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] w-full">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user details. Leave password field empty to keep it unchanged.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="edit-email" className="sm:text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="sm:col-span-3"
                  required
                  type="email"
                />
              </div>
              <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="edit-firstName" className="sm:text-right">
                  First Name
                </Label>
                <Input
                  id="edit-firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="sm:col-span-3"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="edit-lastName" className="sm:text-right">
                  Last Name
                </Label>
                <Input
                  id="edit-lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="sm:col-span-3"
                  required
                />
              </div>
              <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="edit-companyName" className="sm:text-right">
                  Company
                </Label>
                <Input
                  id="edit-companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="sm:col-span-3"
                />
              </div>
              <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="edit-role" className="sm:text-right">
                  Role
                </Label>
                <div className="sm:col-span-3">
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                    required
                  >
                    <SelectTrigger id="edit-role" className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableRoles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
                <Label htmlFor="edit-password" className="sm:text-right">
                  Password
                </Label>
                <div className="sm:col-span-3 flex flex-col sm:flex-row gap-2">
                  <Input
                    id="edit-password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Leave empty to keep unchanged"
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      if (currentUser) handleResetPasswordDialog(currentUser)
                    }}
                    title="Reset Password"
                  >
                    <KeyRound className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] w-full">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentUser && (
            <div className="py-4">
              <h3 className="font-medium">{currentUser.firstName} {currentUser.lastName}</h3>
              <p className="text-sm text-muted-foreground mt-1">{currentUser.email}</p>
              <div className="mt-2">
                <Badge
                  variant="outline"
                  className={getRoleBadgeVariant(currentUser.role)}
                >
                  {currentUser.role}
                </Badge>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] w-full">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter a new password for this user.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {currentUser && (
              <div className="mb-4">
                <h3 className="font-medium">{currentUser.firstName} {currentUser.lastName}</h3>
                <p className="text-sm text-muted-foreground">{currentUser.email}</p>
              </div>
            )}
            
            <div className="grid sm:grid-cols-4 items-center gap-2 sm:gap-4">
              <Label htmlFor="new-password" className="sm:text-right">
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="sm:col-span-3"
                required
                placeholder="Enter new password"
              />
            </div>
            
            <div className="text-sm text-muted-foreground sm:col-span-4 sm:col-start-2 sm:ml-[1px]">
              Password must be at least 8 characters long.
            </div>
            
            <div className="sm:col-span-4 sm:col-start-2 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const randomPassword = Math.random().toString(36).slice(-10) + 
                    Math.random().toString(36).toUpperCase().slice(-2) + 
                    Math.floor(Math.random() * 10) + "!";
                  setNewPassword(randomPassword);
                }}
                className="flex gap-1"
              >
                <RotateCw className="h-4 w-4" />
                Generate
              </Button>
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsResetPasswordDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={handleResetPassword}
              disabled={!newPassword || newPassword.length < 8}
            >
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
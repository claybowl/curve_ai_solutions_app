"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Loader2, AlertCircle, Plus, Save } from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Define permission types
interface Permission {
  id: string
  name: string
  description: string
  category: string
}

interface RolePermission {
  roleId: string
  permissionId: string
}

interface Role {
  id: string
  name: string
  description: string
  isDefault: boolean
  isSystem: boolean
}

// Mock API function to fetch permissions
const fetchPermissions = async (): Promise<Permission[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          name: "user:view",
          description: "View user profiles",
          category: "User Management",
        },
        {
          id: "2",
          name: "user:edit",
          description: "Edit user profiles",
          category: "User Management",
        },
        {
          id: "3",
          name: "user:delete",
          description: "Delete users",
          category: "User Management",
        },
        {
          id: "4",
          name: "role:assign",
          description: "Assign roles to users",
          category: "User Management",
        },
        {
          id: "5",
          name: "assessment:view",
          description: "View assessments",
          category: "Assessments",
        },
        {
          id: "6",
          name: "assessment:create",
          description: "Create assessments",
          category: "Assessments",
        },
        {
          id: "7",
          name: "assessment:edit",
          description: "Edit assessments",
          category: "Assessments",
        },
        {
          id: "8",
          name: "report:view",
          description: "View reports",
          category: "Reports",
        },
        {
          id: "9",
          name: "report:generate",
          description: "Generate reports",
          category: "Reports",
        },
        {
          id: "10",
          name: "settings:view",
          description: "View system settings",
          category: "System",
        },
        {
          id: "11",
          name: "settings:edit",
          description: "Edit system settings",
          category: "System",
        },
        {
          id: "12",
          name: "billing:view",
          description: "View billing information",
          category: "Billing",
        },
        {
          id: "13",
          name: "billing:manage",
          description: "Manage billing and payments",
          category: "Billing",
        },
      ])
    }, 1000)
  })
}

// Mock API function to fetch roles
const fetchRoles = async (): Promise<Role[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          name: "Admin",
          description: "Full system access",
          isDefault: false,
          isSystem: true,
        },
        {
          id: "2",
          name: "Manager",
          description: "Can manage users and view reports",
          isDefault: false,
          isSystem: true,
        },
        {
          id: "3",
          name: "Client",
          description: "Standard user access",
          isDefault: true,
          isSystem: true,
        },
        {
          id: "4",
          name: "Viewer",
          description: "Read-only access",
          isDefault: false,
          isSystem: true,
        },
        {
          id: "5",
          name: "Support",
          description: "Customer support access",
          isDefault: false,
          isSystem: false,
        },
      ])
    }, 1000)
  })
}

// Mock API function to fetch role permissions
const fetchRolePermissions = async (): Promise<RolePermission[]> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        // Admin has all permissions
        { roleId: "1", permissionId: "1" },
        { roleId: "1", permissionId: "2" },
        { roleId: "1", permissionId: "3" },
        { roleId: "1", permissionId: "4" },
        { roleId: "1", permissionId: "5" },
        { roleId: "1", permissionId: "6" },
        { roleId: "1", permissionId: "7" },
        { roleId: "1", permissionId: "8" },
        { roleId: "1", permissionId: "9" },
        { roleId: "1", permissionId: "10" },
        { roleId: "1", permissionId: "11" },
        { roleId: "1", permissionId: "12" },
        { roleId: "1", permissionId: "13" },

        // Manager permissions
        { roleId: "2", permissionId: "1" },
        { roleId: "2", permissionId: "2" },
        { roleId: "2", permissionId: "4" },
        { roleId: "2", permissionId: "5" },
        { roleId: "2", permissionId: "6" },
        { roleId: "2", permissionId: "7" },
        { roleId: "2", permissionId: "8" },
        { roleId: "2", permissionId: "9" },
        { roleId: "2", permissionId: "12" },

        // Client permissions
        { roleId: "3", permissionId: "1" },
        { roleId: "3", permissionId: "5" },
        { roleId: "3", permissionId: "6" },
        { roleId: "3", permissionId: "8" },
        { roleId: "3", permissionId: "12" },

        // Viewer permissions
        { roleId: "4", permissionId: "1" },
        { roleId: "4", permissionId: "5" },
        { roleId: "4", permissionId: "8" },

        // Support permissions
        { roleId: "5", permissionId: "1" },
        { roleId: "5", permissionId: "5" },
        { roleId: "5", permissionId: "8" },
        { roleId: "5", permissionId: "12" },
      ])
    }, 1000)
  })
}

// Mock API function to update role permissions
const updateRolePermissions = async (roleId: string, permissionIds: string[]): Promise<boolean> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 1000)
  })
}

// Mock API function to create a new role
const createRole = async (role: Omit<Role, "id">): Promise<Role> => {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...role,
        id: Math.random().toString(36).substring(2, 9),
      })
    }, 1000)
  })
}

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null)
  const [savingPermissions, setSavingPermissions] = useState(false)

  // New role dialog state
  const [newRoleDialogOpen, setNewRoleDialogOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDescription, setNewRoleDescription] = useState("")
  const [creatingRole, setCreatingRole] = useState(false)

  // Group permissions by category
  const permissionsByCategory = permissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>,
  )

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [permissionsData, rolesData, rolePermissionsData] = await Promise.all([
          fetchPermissions(),
          fetchRoles(),
          fetchRolePermissions(),
        ])

        setPermissions(permissionsData)
        setRoles(rolesData)
        setRolePermissions(rolePermissionsData)

        // Select the first role by default
        if (rolesData.length > 0) {
          setSelectedRoleId(rolesData[0].id)
        }
      } catch (err) {
        setError("Failed to load permissions data. Please try again.")
        console.error("Error loading permissions data:", err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Check if a permission is assigned to the selected role
  const hasPermission = (permissionId: string) => {
    return rolePermissions.some((rp) => rp.roleId === selectedRoleId && rp.permissionId === permissionId)
  }

  // Toggle a permission for the selected role
  const togglePermission = (permissionId: string) => {
    if (!selectedRoleId) return

    // Check if this is a system role
    const selectedRole = roles.find((r) => r.id === selectedRoleId)
    if (selectedRole?.isSystem) {
      toast({
        title: "Cannot modify system role",
        description: "System roles cannot be modified. Create a custom role instead.",
        variant: "destructive",
      })
      return
    }

    const newRolePermissions = [...rolePermissions]
    const existingIndex = newRolePermissions.findIndex(
      (rp) => rp.roleId === selectedRoleId && rp.permissionId === permissionId,
    )

    if (existingIndex >= 0) {
      // Remove the permission
      newRolePermissions.splice(existingIndex, 1)
    } else {
      // Add the permission
      newRolePermissions.push({
        roleId: selectedRoleId,
        permissionId,
      })
    }

    setRolePermissions(newRolePermissions)
  }

  // Save role permissions
  const saveRolePermissions = async () => {
    if (!selectedRoleId) return

    try {
      setSavingPermissions(true)

      // Get all permission IDs for the selected role
      const permissionIds = rolePermissions.filter((rp) => rp.roleId === selectedRoleId).map((rp) => rp.permissionId)

      const success = await updateRolePermissions(selectedRoleId, permissionIds)

      if (success) {
        toast({
          title: "Permissions updated",
          description: "Role permissions have been updated successfully.",
        })
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update role permissions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSavingPermissions(false)
    }
  }

  // Create a new role
  const handleCreateRole = async () => {
    if (!newRoleName.trim()) {
      toast({
        title: "Role name required",
        description: "Please enter a name for the new role.",
        variant: "destructive",
      })
      return
    }

    try {
      setCreatingRole(true)

      const newRole = await createRole({
        name: newRoleName,
        description: newRoleDescription,
        isDefault: false,
        isSystem: false,
      })

      setRoles([...roles, newRole])
      setSelectedRoleId(newRole.id)
      setNewRoleDialogOpen(false)
      setNewRoleName("")
      setNewRoleDescription("")

      toast({
        title: "Role created",
        description: `The role "${newRoleName}" has been created successfully.`,
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create new role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCreatingRole(false)
    }
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
            <h1 className="text-3xl font-bold text-[#1A365D] dark:text-white">Permissions Management</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage roles and permissions for the application</p>
          </div>
          <Button className="bg-[#0076FF] hover:bg-[#0076FF]/90" onClick={() => setNewRoleDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Role
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Roles sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {roles.map((role) => (
                  <Button
                    key={role.id}
                    variant={selectedRoleId === role.id ? "default" : "outline"}
                    className={`w-full justify-start ${
                      selectedRoleId === role.id ? "bg-[#0076FF] hover:bg-[#0076FF]/90" : ""
                    } ${role.isSystem ? "border-dashed" : ""}`}
                    onClick={() => setSelectedRoleId(role.id)}
                  >
                    <div className="flex flex-col items-start">
                      <span>{role.name}</span>
                      {role.isDefault && <span className="text-xs opacity-70">Default</span>}
                      {role.isSystem && <span className="text-xs opacity-70">System Role</span>}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Permissions table */}
          <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{selectedRoleId && roles.find((r) => r.id === selectedRoleId)?.name} Permissions</CardTitle>
              <Button
                onClick={saveRolePermissions}
                disabled={savingPermissions || !selectedRoleId || roles.find((r) => r.id === selectedRoleId)?.isSystem}
                className="bg-[#0076FF] hover:bg-[#0076FF]/90"
              >
                {savingPermissions ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Permissions
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent>
              {selectedRoleId ? (
                <div className="space-y-6">
                  {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
                    <div key={category}>
                      <h3 className="text-lg font-medium text-[#1A365D] dark:text-white mb-4">{category}</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Permission</TableHead>
                            <TableHead>Description</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {categoryPermissions.map((permission) => {
                            const isChecked = hasPermission(permission.id)
                            const isSystemRole = roles.find((r) => r.id === selectedRoleId)?.isSystem

                            return (
                              <TableRow key={permission.id}>
                                <TableCell>
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={() => togglePermission(permission.id)}
                                    disabled={isSystemRole}
                                  />
                                </TableCell>
                                <TableCell className="font-medium">{permission.name}</TableCell>
                                <TableCell>{permission.description}</TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ))}

                  {roles.find((r) => r.id === selectedRoleId)?.isSystem && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 text-yellow-800 dark:text-yellow-200">
                      <p className="flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        System roles cannot be modified. Create a custom role instead.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">
                  Select a role to manage permissions
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Create New Role Dialog */}
        <Dialog open={newRoleDialogOpen} onOpenChange={setNewRoleDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>Create a new role with custom permissions</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Role Name
                </label>
                <Input
                  id="name"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  placeholder="e.g., Content Editor"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="description"
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  placeholder="e.g., Can edit content but not manage users"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewRoleDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateRole}
                disabled={creatingRole || !newRoleName.trim()}
                className="bg-[#0076FF] hover:bg-[#0076FF]/90"
              >
                {creatingRole ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Role"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

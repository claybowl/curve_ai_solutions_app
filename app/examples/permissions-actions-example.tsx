"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

import {
  getAllPermissionsAction,
  getPermissionsByCategoryAction,
  getAllRolesAction,
  getRoleByIdAction,
  createRoleAction,
  updateRoleAction,
  deleteRoleAction,
  getUserPermissionsAction,
  assignRolesToUserAction,
  setUserPermissionAction,
  removeUserPermissionAction,
  checkCurrentUserPermissionAction
} from "@/app/actions/permission-actions"

export default function PermissionsActionsExample() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<any[]>([])

  // Fetch all permissions
  const handleFetchPermissions = async () => {
    setLoading(true)
    setError(null)
    try {
      const permissions = await getAllPermissionsAction()
      setResult(permissions)
      setPermissions(permissions)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Fetch permissions by category
  const handleFetchPermissionsByCategory = async () => {
    setLoading(true)
    setError(null)
    try {
      const categories = await getPermissionsByCategoryAction()
      setResult(categories)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Fetch all roles
  const handleFetchRoles = async () => {
    setLoading(true)
    setError(null)
    try {
      const roles = await getAllRolesAction()
      setResult(roles)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Fetch role by ID
  const handleFetchRole = async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      const role = await getRoleByIdAction(id)
      setResult(role)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Create a new role
  const handleCreateRole = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(event.currentTarget)
    
    // Handle permission IDs (checkboxes)
    const checkboxes = document.querySelectorAll('input[name="permissionIds"]:checked')
    checkboxes.forEach(checkbox => {
      formData.append("permissionIds", (checkbox as HTMLInputElement).value)
    })
    
    try {
      const result = await createRoleAction(formData)
      setResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Update a role
  const handleUpdateRole = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(event.currentTarget)
    const id = parseInt(formData.get("id") as string)
    
    // Handle permission IDs (checkboxes)
    const checkboxes = document.querySelectorAll('input[name="permissionIds"]:checked')
    checkboxes.forEach(checkbox => {
      formData.append("permissionIds", (checkbox as HTMLInputElement).value)
    })
    
    try {
      const result = await updateRoleAction(id, formData)
      setResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Delete a role
  const handleDeleteRole = async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      const result = await deleteRoleAction(id)
      setResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Get user permissions
  const handleGetUserPermissions = async (userId: number) => {
    setLoading(true)
    setError(null)
    try {
      const userPermissions = await getUserPermissionsAction(userId)
      setResult(userPermissions)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Assign roles to user
  const handleAssignRoles = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(event.currentTarget)
    const userId = parseInt(formData.get("userId") as string)
    
    // Handle role IDs (checkboxes)
    const checkboxes = document.querySelectorAll('input[name="roleIds"]:checked')
    checkboxes.forEach(checkbox => {
      formData.append("roleIds", (checkbox as HTMLInputElement).value)
    })
    
    try {
      const result = await assignRolesToUserAction(userId, formData)
      setResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Set user permission
  const handleSetUserPermission = async (userId: number, permissionId: number, granted: boolean) => {
    setLoading(true)
    setError(null)
    try {
      const result = await setUserPermissionAction(userId, permissionId, granted)
      setResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Remove user permission
  const handleRemoveUserPermission = async (userId: number, permissionId: number) => {
    setLoading(true)
    setError(null)
    try {
      const result = await removeUserPermissionAction(userId, permissionId)
      setResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Check current user permission
  const handleCheckPermission = async (permissionName: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await checkCurrentUserPermissionAction(permissionName)
      setResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Permissions Actions Example</h1>

      <div className="grid gap-8">
        {/* Fetch all permissions */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Fetch Permissions</h2>
          <div className="flex gap-2">
            <Button onClick={handleFetchPermissions} disabled={loading}>
              Fetch All Permissions
            </Button>
            <Button onClick={handleFetchPermissionsByCategory} disabled={loading}>
              Fetch Permissions By Category
            </Button>
          </div>
        </div>

        {/* Fetch all roles */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Fetch Roles</h2>
          <div className="flex gap-2">
            <Button onClick={handleFetchRoles} disabled={loading}>
              Fetch All Roles
            </Button>
            <div className="flex flex-1 gap-2">
              <Input 
                id="fetch-role-id" 
                placeholder="Enter role ID"
                className="flex-1"
                type="number"
              />
              <Button 
                onClick={() => {
                  const id = parseInt((document.getElementById("fetch-role-id") as HTMLInputElement).value)
                  handleFetchRole(id)
                }} 
                disabled={loading}
              >
                Fetch Role
              </Button>
            </div>
          </div>
        </div>

        {/* Create role form */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Create Role</h2>
          <Button onClick={handleFetchPermissions} className="mb-4" variant="outline" size="sm">
            Load Permissions
          </Button>
          <form onSubmit={handleCreateRole} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={2} required />
            </div>
            
            <div className="flex items-center gap-2">
              <Switch id="isDefault" name="isDefault" value="true" />
              <Label htmlFor="isDefault">Default Role</Label>
            </div>
            
            <div className="grid gap-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center gap-2">
                    <Checkbox 
                      id={`perm-${permission.id}`}
                      name="permissionIds"
                      value={permission.id.toString()}
                    />
                    <Label htmlFor={`perm-${permission.id}`}>{permission.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Button type="submit" disabled={loading}>Create Role</Button>
          </form>
        </div>

        {/* Update role form */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Update Role</h2>
          <form onSubmit={handleUpdateRole} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="update-id">Role ID</Label>
              <Input id="update-id" name="id" required type="number" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="update-name">Name</Label>
              <Input id="update-name" name="name" required />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="update-description">Description</Label>
              <Textarea id="update-description" name="description" rows={2} required />
            </div>
            
            <div className="flex items-center gap-2">
              <Switch id="update-isDefault" name="isDefault" value="true" />
              <Label htmlFor="update-isDefault">Default Role</Label>
            </div>
            
            <div className="grid gap-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center gap-2">
                    <Checkbox 
                      id={`update-perm-${permission.id}`}
                      name="permissionIds"
                      value={permission.id.toString()}
                    />
                    <Label htmlFor={`update-perm-${permission.id}`}>{permission.name}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Button type="submit" disabled={loading}>Update Role</Button>
          </form>
        </div>

        {/* Delete role */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Delete Role</h2>
          <div className="flex gap-2">
            <Input 
              id="delete-role-id" 
              placeholder="Enter role ID"
              className="flex-1"
              type="number"
            />
            <Button 
              onClick={() => {
                const id = parseInt((document.getElementById("delete-role-id") as HTMLInputElement).value)
                handleDeleteRole(id)
              }} 
              disabled={loading}
              variant="destructive"
            >
              Delete Role
            </Button>
          </div>
        </div>

        {/* Get user permissions */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Get User Permissions</h2>
          <div className="flex gap-2">
            <Input 
              id="user-permissions-id" 
              placeholder="Enter user ID"
              className="flex-1"
              type="number"
            />
            <Button 
              onClick={() => {
                const id = parseInt((document.getElementById("user-permissions-id") as HTMLInputElement).value)
                handleGetUserPermissions(id)
              }} 
              disabled={loading}
            >
              Get Permissions
            </Button>
          </div>
        </div>

        {/* Check current user permission */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Check Current User Permission</h2>
          <div className="flex gap-2">
            <Input 
              id="check-permission-name" 
              placeholder="Enter permission name (e.g. manage_blog)"
              className="flex-1"
            />
            <Button 
              onClick={() => {
                const name = (document.getElementById("check-permission-name") as HTMLInputElement).value
                handleCheckPermission(name)
              }} 
              disabled={loading}
            >
              Check Permission
            </Button>
          </div>
        </div>

        {/* Result display */}
        {(result || error) && (
          <div className="p-4 border rounded">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            {error ? (
              <div className="text-red-500 whitespace-pre-wrap">{error}</div>
            ) : (
              <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
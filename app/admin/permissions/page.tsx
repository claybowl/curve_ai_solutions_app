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
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog"
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { 
  Plus, MoreVertical, Pencil, Trash2, ShieldCheck, 
  Check, AlertCircle, Lock, InfoIcon, Shield
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  getAllRolesAction,
  getRoleByIdAction,
  createRoleAction,
  updateRoleAction,
  deleteRoleAction,
  getPermissionsByCategoryAction
} from "@/app/actions/permission-actions"
import type {
  Permission,
  Role,
  PermissionCategory,
  RoleFormData
} from "@/types/permissions"

export default function PermissionsManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [roles, setRoles] = useState<Role[]>([])
  const [categories, setCategories] = useState<PermissionCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("roles")
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentRole, setCurrentRole] = useState<Role | null>(null)
  
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    isDefault: boolean;
    selectedPermissions: number[];
  }>({
    name: "",
    description: "",
    isDefault: false,
    selectedPermissions: []
  })

  useEffect(() => {
    loadRoles()
    loadPermissions()
  }, [])

  const loadRoles = async () => {
    setIsLoading(true)
    try {
      const fetchedRoles = await getAllRolesAction()
      setRoles(fetchedRoles)
    } catch (err) {
      console.error("Error loading roles:", err)
      setError("Failed to load roles")
    } finally {
      setIsLoading(false)
    }
  }

  const loadPermissions = async () => {
    try {
      const fetchedCategories = await getPermissionsByCategoryAction()
      setCategories(fetchedCategories)
    } catch (err) {
      console.error("Error loading permissions:", err)
    }
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const formDataObj = new FormData()
      formDataObj.append("name", formData.name)
      formDataObj.append("description", formData.description)
      formDataObj.append("isDefault", formData.isDefault.toString())
      
      formData.selectedPermissions.forEach(permId => {
        formDataObj.append("permissionIds", permId.toString())
      })
      
      const result = await createRoleAction(formDataObj)
      
      if (result.success) {
        toast({
          title: "Role Created",
          description: `The role "${formData.name}" was created successfully.`,
          variant: "default",
        })
        setIsCreateDialogOpen(false)
        resetForm()
        loadRoles()
      } else {
        toast({
          title: "Error Creating Role",
          description: result.error || "An error occurred while creating the role.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error creating role:", err)
      toast({
        title: "Error",
        description: "An error occurred while creating the role.",
        variant: "destructive",
      })
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentRole) return
    
    try {
      const formDataObj = new FormData()
      formDataObj.append("name", formData.name)
      formDataObj.append("description", formData.description)
      formDataObj.append("isDefault", formData.isDefault.toString())
      
      formData.selectedPermissions.forEach(permId => {
        formDataObj.append("permissionIds", permId.toString())
      })
      
      const result = await updateRoleAction(currentRole.id, formDataObj)
      
      if (result.success) {
        toast({
          title: "Role Updated",
          description: `The role "${formData.name}" was updated successfully.`,
          variant: "default",
        })
        setIsEditDialogOpen(false)
        resetForm()
        loadRoles()
      } else {
        toast({
          title: "Error Updating Role",
          description: result.error || "An error occurred while updating the role.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error updating role:", err)
      toast({
        title: "Error",
        description: "An error occurred while updating the role.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteConfirm = async () => {
    if (!currentRole) return
    
    try {
      const result = await deleteRoleAction(currentRole.id)
      
      if (result.success) {
        toast({
          title: "Role Deleted",
          description: `The role "${currentRole.name}" was deleted successfully.`,
          variant: "default",
        })
        setIsDeleteDialogOpen(false)
        setCurrentRole(null)
        loadRoles()
      } else {
        toast({
          title: "Error Deleting Role",
          description: result.error || "An error occurred while deleting the role.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error deleting role:", err)
      toast({
        title: "Error",
        description: "An error occurred while deleting the role.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      isDefault: false,
      selectedPermissions: []
    })
    setCurrentRole(null)
  }

  const handleEditRole = async (role: Role) => {
    setCurrentRole(role)
    
    // Populate form data with role details
    setFormData({
      name: role.name,
      description: role.description,
      isDefault: role.isDefault,
      selectedPermissions: role.permissions?.map(p => p.id) || []
    })
    
    setIsEditDialogOpen(true)
  }

  const handleDeleteRole = (role: Role) => {
    setCurrentRole(role)
    setIsDeleteDialogOpen(true)
  }

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          selectedPermissions: [...prev.selectedPermissions, permissionId]
        }
      } else {
        return {
          ...prev,
          selectedPermissions: prev.selectedPermissions.filter(id => id !== permissionId)
        }
      }
    })
  }

  const handleCategorySelectAll = (categoryPermissions: Permission[], checked: boolean) => {
    setFormData(prev => {
      let newSelectedPermissions = [...prev.selectedPermissions]
      
      if (checked) {
        // Add all permissions from this category that aren't already selected
        categoryPermissions.forEach(permission => {
          if (!newSelectedPermissions.includes(permission.id)) {
            newSelectedPermissions.push(permission.id)
          }
        })
      } else {
        // Remove all permissions from this category
        newSelectedPermissions = newSelectedPermissions.filter(
          id => !categoryPermissions.find(p => p.id === id)
        )
      }
      
      return {
        ...prev,
        selectedPermissions: newSelectedPermissions
      }
    })
  }

  const isCategoryFullySelected = (categoryPermissions: Permission[]) => {
    return categoryPermissions.every(permission => 
      formData.selectedPermissions.includes(permission.id)
    )
  }

  const isCategoryPartiallySelected = (categoryPermissions: Permission[]) => {
    return categoryPermissions.some(permission => 
      formData.selectedPermissions.includes(permission.id)
    ) && !isCategoryFullySelected(categoryPermissions)
  }

  const countPermissions = (role: Role): number => {
    return role.permissions?.length || 0
  }

  const PermissionsCategoryList = ({ 
    categories, 
    selectedPermissions, 
    onChange, 
    onCategoryChange,
    disabled = false
  }: {
    categories: PermissionCategory[],
    selectedPermissions: number[],
    onChange: (permissionId: number, checked: boolean) => void,
    onCategoryChange: (categoryPermissions: Permission[], checked: boolean) => void,
    disabled?: boolean
  }) => {
    return (
      <div className="space-y-4">
        {categories.map(category => {
          const categoryPermissions = category.permissions
          const isFullySelected = categoryPermissions.every(permission => 
            selectedPermissions.includes(permission.id)
          )
          const isPartiallySelected = categoryPermissions.some(permission => 
            selectedPermissions.includes(permission.id)
          ) && !isFullySelected
          
          return (
            <div key={category.name} className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id={`category-${category.name}`}
                  checked={isFullySelected}
                  ref={ref => {
                    if (ref) {
                      ref.indeterminate = isPartiallySelected
                    }
                  }}
                  onCheckedChange={(checked) => 
                    onCategoryChange(categoryPermissions, checked === true)
                  }
                  disabled={disabled}
                />
                <Label 
                  htmlFor={`category-${category.name}`}
                  className="font-medium text-sm"
                >
                  {category.displayName} ({categoryPermissions.length})
                </Label>
              </div>
              
              <div className="ml-6 space-y-1">
                {categoryPermissions.map(permission => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`permission-${permission.id}`}
                      checked={selectedPermissions.includes(permission.id)}
                      onCheckedChange={(checked) => 
                        onChange(permission.id, checked === true)
                      }
                      disabled={disabled}
                    />
                    <Label 
                      htmlFor={`permission-${permission.id}`}
                      className="text-sm flex-1"
                    >
                      <span className="block font-medium">{permission.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {permission.description}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <DashboardLayout
      title="Permissions Management"
      description="Manage roles and permissions for users in the system"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Permissions", href: "/admin/permissions", current: true }
      ]}
      actions={
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Role
        </Button>
      }
    >
      <Tabs 
        defaultValue="roles" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="roles" className="mt-6">
          {isLoading ? (
            <div className="py-8 flex justify-center">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                <p>Loading roles...</p>
              </div>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-red-500">{error}</p>
              <Button variant="outline" className="mt-4" onClick={loadRoles}>
                Retry
              </Button>
            </div>
          ) : roles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No roles found</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Create Your First Role
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {roles.map(role => (
                <Card key={role.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {role.name}
                          {role.isSystem && (
                            <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                              <Lock className="h-3 w-3 mr-1" />
                              System
                            </Badge>
                          )}
                          {role.isDefault && (
                            <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                              <Check className="h-3 w-3 mr-1" />
                              Default
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">{role.description}</CardDescription>
                      </div>
                      
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-4">
                          {countPermissions(role)} permissions
                        </Badge>
                        
                        {!role.isSystem && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditRole(role)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteRole(role)}
                                className="text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="permissions">
                        <AccordionTrigger className="text-sm">
                          View Permissions
                        </AccordionTrigger>
                        <AccordionContent>
                          {role.permissions && role.permissions.length > 0 ? (
                            <div className="pt-4">
                              {categories.map(category => {
                                const categoryPermissions = role.permissions!.filter(
                                  p => p.category === category.name
                                )
                                
                                if (categoryPermissions.length === 0) return null
                                
                                return (
                                  <div key={category.name} className="mb-4">
                                    <h4 className="text-sm font-medium mb-2">{category.displayName}</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                                      {categoryPermissions.map(permission => (
                                        <div 
                                          key={permission.id}
                                          className="flex items-center p-2 rounded-md border bg-muted/30"
                                        >
                                          <ShieldCheck className="h-4 w-4 text-muted-foreground mr-2 flex-shrink-0" />
                                          <div>
                                            <p className="text-sm font-medium">{permission.name}</p>
                                            <p className="text-xs text-muted-foreground">{permission.description}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground py-2">
                              This role has no permissions assigned.
                            </p>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                  
                  {role.isSystem && (
                    <CardFooter className="border-t pt-4 text-sm text-muted-foreground flex items-center">
                      <InfoIcon className="h-4 w-4 mr-2" />
                      System roles cannot be edited or deleted.
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="permissions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Permissions</CardTitle>
              <CardDescription>
                Permissions that can be assigned to roles in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading permissions...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {categories.map(category => (
                    <div key={category.name} className="pt-2">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-muted-foreground" />
                        {category.displayName}
                      </h3>
                      
                      <div className="rounded-md border overflow-x-auto w-full">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-1/3 min-w-[150px]">Permission</TableHead>
                              <TableHead className="w-1/2 min-w-[200px]">Description</TableHead>
                              <TableHead className="hidden sm:table-cell">Identifier</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {category.permissions.map(permission => (
                              <TableRow key={permission.id}>
                                <TableCell className="font-medium">
                                  {permission.name}
                                </TableCell>
                                <TableCell>
                                  {permission.description}
                                </TableCell>
                                <TableCell className="hidden sm:table-cell text-xs text-muted-foreground font-mono">
                                  {permission.name}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Create Role Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="w-[95%] sm:w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Create a new role and assign permissions to it. Roles define what actions users can perform in the system.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Content Editor"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this role is for and what permissions it should have"
                  required
                  rows={2}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
                />
                <Label htmlFor="isDefault">
                  Default role for new users
                </Label>
              </div>
              
              <div className="pt-4">
                <h3 className="text-base font-medium mb-4">Assign Permissions</h3>
                
                <PermissionsCategoryList 
                  categories={categories}
                  selectedPermissions={formData.selectedPermissions}
                  onChange={handlePermissionChange}
                  onCategoryChange={handleCategorySelectAll}
                />
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Role</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95%] sm:w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update role details and permission assignments.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Role Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Content Editor"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this role is for and what permissions it should have"
                  required
                  rows={2}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="edit-isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked })}
                />
                <Label htmlFor="edit-isDefault">
                  Default role for new users
                </Label>
              </div>
              
              <div className="pt-4">
                <h3 className="text-base font-medium mb-4">Assign Permissions</h3>
                
                <PermissionsCategoryList 
                  categories={categories}
                  selectedPermissions={formData.selectedPermissions}
                  onChange={handlePermissionChange}
                  onCategoryChange={handleCategorySelectAll}
                  disabled={currentRole?.isSystem}
                />
                
                {currentRole?.isSystem && (
                  <div className="mt-4 p-4 border rounded-md bg-amber-50 dark:bg-amber-950/20 flex items-center text-amber-800 dark:text-amber-400">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    <p className="text-sm">System roles cannot have their permissions modified.</p>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={currentRole?.isSystem}>
                Update Role
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="w-[95%] sm:w-[90%] max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this role? Any users with this role will be assigned to the default role instead.
            </DialogDescription>
          </DialogHeader>
          
          {currentRole && (
            <div className="py-4">
              <h3 className="font-medium">{currentRole.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{currentRole.description}</p>
              <div className="mt-3 p-3 border rounded-md bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-400 text-sm">
                <p className="flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  This action cannot be undone.
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
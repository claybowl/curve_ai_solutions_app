"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, MoreVertical, Pencil, Trash2, Power, 
  Search, ChevronDown, ExternalLink, Tool, Server
} from "lucide-react"
import { format } from "date-fns"
import { 
  getAllTools,
  getToolById,
  createTool,
  updateTool,
  deleteTool,
  getToolCategories
} from "@/lib/db-tools"
import type { 
  AiTool,
  AiToolSummary,
  AiToolFormData,
  AiToolFilter,
  AiToolCategory
} from "@/types/tools"

export default function ToolsManagementPage() {
  const router = useRouter()
  const [tools, setTools] = useState<AiToolSummary[]>([])
  const [categories, setCategories] = useState<AiToolCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentTool, setCurrentTool] = useState<AiToolSummary | null>(null)
  const [formData, setFormData] = useState<AiToolFormData>({
    name: "",
    description: "",
    apiEndpoint: "",
    iconName: "",
    category: "",
    isActive: true
  })
  const [sortColumn, setSortColumn] = useState<string>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    loadTools()
    loadCategories()
  }, [activeTab, sortColumn, sortDirection, selectedCategory])

  const loadTools = async () => {
    setIsLoading(true)
    try {
      // Determine filter based on active tab and selected category
      const filter: AiToolFilter = {}
      
      if (activeTab === "active") {
        filter.isActive = true
      } else if (activeTab === "inactive") {
        filter.isActive = false
      }
      
      if (selectedCategory) {
        filter.category = selectedCategory
      }
      
      // Apply search term if present
      if (searchTerm) {
        filter.searchTerm = searchTerm
      }
      
      const fetchedTools = await getAllTools(filter)
      
      // Apply sorting
      const sortedTools = [...fetchedTools].sort((a, b) => {
        const aValue = a[sortColumn as keyof AiToolSummary]
        const bValue = b[sortColumn as keyof AiToolSummary]
        
        // Handle string comparison
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortDirection === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue)
        }
        
        // Handle boolean comparison
        if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
          return sortDirection === 'asc'
            ? (aValue ? 1 : 0) - (bValue ? 1 : 0)
            : (bValue ? 1 : 0) - (aValue ? 1 : 0)
        }
        
        // Handle other types
        return 0
      })
      
      setTools(sortedTools)
    } catch (err) {
      console.error("Error loading tools:", err)
      setError("Failed to load AI tools")
    } finally {
      setIsLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const fetchedCategories = await getToolCategories()
      setCategories(fetchedCategories)
    } catch (err) {
      console.error("Error loading categories:", err)
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Set new column with default asc direction
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadTools()
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const newToolId = await createTool(formData)
      
      if (newToolId) {
        setIsCreateDialogOpen(false)
        resetForm()
        loadTools()
      } else {
        setError("Failed to create AI tool")
      }
    } catch (err) {
      console.error("Error creating tool:", err)
      setError("An error occurred while creating the AI tool")
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentTool) return
    
    try {
      const success = await updateTool(currentTool.id, formData)
      
      if (success) {
        setIsEditDialogOpen(false)
        resetForm()
        loadTools()
      } else {
        setError("Failed to update AI tool")
      }
    } catch (err) {
      console.error("Error updating tool:", err)
      setError("An error occurred while updating the AI tool")
    }
  }

  const handleDeleteConfirm = async () => {
    if (!currentTool) return
    
    try {
      const success = await deleteTool(currentTool.id)
      
      if (success) {
        setIsDeleteDialogOpen(false)
        setCurrentTool(null)
        loadTools()
      } else {
        setError("Failed to delete AI tool")
      }
    } catch (err) {
      console.error("Error deleting tool:", err)
      setError("An error occurred while deleting the AI tool")
    }
  }

  const handleToggleActive = async (tool: AiToolSummary) => {
    try {
      const updatedTool: AiToolFormData = {
        name: tool.name,
        description: tool.description,
        iconName: tool.iconName,
        category: tool.category,
        isActive: !tool.isActive
      }
      
      const success = await updateTool(tool.id, updatedTool)
      
      if (success) {
        loadTools()
      } else {
        setError("Failed to toggle tool status")
      }
    } catch (err) {
      console.error("Error toggling tool status:", err)
      setError("An error occurred while toggling the tool status")
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      apiEndpoint: "",
      iconName: "",
      category: "",
      isActive: true
    })
    setCurrentTool(null)
  }

  const handleEditTool = async (tool: AiToolSummary) => {
    setCurrentTool(tool)
    try {
      // Fetch the full tool data
      const fullTool = await getToolById(tool.id)
      if (fullTool) {
        setFormData({
          name: fullTool.name,
          description: fullTool.description,
          apiEndpoint: fullTool.apiEndpoint || "",
          iconName: fullTool.iconName || "",
          category: fullTool.category || "",
          isActive: fullTool.isActive
        })
        setIsEditDialogOpen(true)
      }
    } catch (err) {
      console.error("Error fetching tool details:", err)
      setError("Failed to load tool details for editing")
    }
  }

  const handleDeleteTool = (tool: AiToolSummary) => {
    setCurrentTool(tool)
    setIsDeleteDialogOpen(true)
  }

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return "Uncategorized"
    
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : categoryId
  }

  // Tools Table Component
  const ToolsTable = () => {
    if (isLoading) {
      return (
        <div className="py-8 flex justify-center">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
            <p>Loading AI tools...</p>
          </div>
        </div>
      )
    }
    
    if (error) {
      return (
        <div className="py-8 text-center">
          <p className="text-red-500">{error}</p>
          <Button variant="outline" className="mt-4" onClick={loadTools}>
            Retry
          </Button>
        </div>
      )
    }
    
    if (tools.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No AI tools found</p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            Create Your First Tool
          </Button>
        </div>
      )
    }
    
    return (
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%] min-w-[200px]">
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1"
                >
                  Name
                  {sortColumn === "name" && (
                    <ChevronDown className={`h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("category")}
                  className="flex items-center gap-1"
                >
                  Category
                  {sortColumn === "category" && (
                    <ChevronDown className={`h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("isActive")}
                  className="flex items-center gap-1"
                >
                  Status
                  {sortColumn === "isActive" && (
                    <ChevronDown className={`h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools.map(tool => (
              <TableRow key={tool.id}>
                <TableCell className="min-w-[200px]">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {tool.iconName ? (
                        <span className="text-muted-foreground">
                          <Tool className="h-4 w-4" />
                        </span>
                      ) : null}
                      {tool.name}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {tool.description}
                    </div>
                    {/* Show category on mobile as part of description */}
                    <div className="md:hidden mt-2">
                      {tool.category ? (
                        <Badge variant="outline" className="capitalize">
                          {getCategoryName(tool.category)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">Uncategorized</span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {tool.category ? (
                    <Badge variant="outline" className="capitalize">
                      {getCategoryName(tool.category)}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">Uncategorized</span>
                  )}
                </TableCell>
                <TableCell>
                  {tool.isActive ? (
                    <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400">
                      Inactive
                    </Badge>
                  )}
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
                      <DropdownMenuItem onClick={() => handleEditTool(tool)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {tool.apiEndpoint && (
                        <DropdownMenuItem onClick={() => window.open(tool.apiEndpoint, '_blank')}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open API Endpoint
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleToggleActive(tool)}>
                        <Power className="mr-2 h-4 w-4" />
                        {tool.isActive ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteTool(tool)}
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
    )
  }

  return (
    <DashboardLayout
      title="AI Tools"
      description="Manage your AI tools, create new tools, and control availability"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "AI Tools", href: "/admin/tools", current: true }
      ]}
      actions={
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Tool
        </Button>
      }
    >
      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">All Tools</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={undefined}>All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="truncate block">{category.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <form onSubmit={handleSearch} className="flex w-full items-center gap-2">
              <Input
                type="search"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-0"
              />
              <Button type="submit" size="sm" variant="outline" className="shrink-0">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
        
        <ToolsTable />
      </Tabs>
      
      {/* Categories Card */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Tool Categories</CardTitle>
            <CardDescription>Available categories for organizing AI tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.length > 0 ? categories.map(category => (
                <div key={category.id} className={`p-4 rounded-lg ${category.color}`}>
                  <h3 className="font-semibold text-white truncate">{category.name}</h3>
                  <p className="text-sm text-white/80 mt-1 line-clamp-2">{category.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className="bg-white/20 text-white hover:bg-white/30">
                      {category.tools.length} tools
                    </Badge>
                  </div>
                </div>
              )) : (
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 py-4 text-center text-muted-foreground">
                  No categories available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Create Tool Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="w-[95%] sm:w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New AI Tool</DialogTitle>
            <DialogDescription>
              Create a new AI tool that can be used by your clients or internal systems.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tool Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain what this tool does and how it can be used"
                  required
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiEndpoint">API Endpoint</Label>
                <Input
                  id="apiEndpoint"
                  value={formData.apiEndpoint}
                  onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                  placeholder="https://api.example.com/tool-endpoint"
                />
                <p className="text-sm text-muted-foreground">Optional: The API endpoint where this tool is hosted</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="iconName">Icon Name</Label>
                  <Input
                    id="iconName"
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    placeholder="e.g. Tool, BarChart, Code"
                  />
                  <p className="text-sm text-muted-foreground">Optional: Lucide icon name</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Tool is active and available for use</Label>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Tool</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Tool Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95%] sm:w-[90%] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit AI Tool</DialogTitle>
            <DialogDescription>
              Update the details and settings for this AI tool.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Tool Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explain what this tool does and how it can be used"
                  required
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-apiEndpoint">API Endpoint</Label>
                <Input
                  id="edit-apiEndpoint"
                  value={formData.apiEndpoint}
                  onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                  placeholder="https://api.example.com/tool-endpoint"
                />
                <p className="text-sm text-muted-foreground">Optional: The API endpoint where this tool is hosted</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-iconName">Icon Name</Label>
                  <Input
                    id="edit-iconName"
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    placeholder="e.g. Tool, BarChart, Code"
                  />
                  <p className="text-sm text-muted-foreground">Optional: Lucide icon name</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={formData.category || ""}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="edit-isActive">
                  {formData.isActive ? "Tool is active and available" : "Tool is inactive"}
                </Label>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Tool</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] w-full">
          <DialogHeader>
            <DialogTitle>Delete AI Tool</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this AI tool? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentTool && (
            <div className="py-4">
              <h3 className="font-medium truncate">{currentTool.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{currentTool.description}</p>
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
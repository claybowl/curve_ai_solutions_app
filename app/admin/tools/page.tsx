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
  Search, ChevronDown, ExternalLink, Settings, Server
} from "lucide-react"
import { format } from "date-fns"
import {
  getAiTools,
  getAiToolById,
  createAiTool,
  updateAiTool,
  deleteAiTool,
  getToolCategories
} from "@/app/actions/tool-actions"
import type { 
  AiTool,
  AiToolSummary,
  AiToolFormData,
  AiToolFilter,
  ToolCategorySummary
} from "@/types/tools"
import { useToast } from "@/hooks/use-toast"

export default function ToolsManagementPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [tools, setTools] = useState<AiTool[]>([])
  const [categories, setCategories] = useState<ToolCategorySummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentTool, setCurrentTool] = useState<AiTool | null>(null)
  const [formData, setFormData] = useState<AiToolFormData>({
    name: "",
    description: "",
    detailed_description: "",
    category_id: "",
    version: "1.0.0",
    tool_type: "custom",
    complexity_level: "beginner",
    api_endpoint: "",
    pricing_model: "free",
    status: "active",
    is_featured: false,
    is_public: true,
    tags: [],
    keywords: []
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
        filter.status = "active"
      } else if (activeTab === "inactive") {
        filter.status = "deprecated"
      }
      
      if (selectedCategory) {
        filter.category_id = selectedCategory
      }
      
      // Apply search term if present
      if (searchTerm) {
        filter.search_term = searchTerm
      }
      
      // Apply sorting
      filter.sortBy = sortColumn as any
      filter.sortDirection = sortDirection
      
      const fetchedTools = await getAiTools(filter)
      setTools(fetchedTools)
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
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => formDataObj.append(key, item))
          } else {
            formDataObj.append(key, String(value))
          }
        }
      })
      
      const result = await createAiTool(formDataObj)
      
      if (result.success) {
        setIsCreateDialogOpen(false)
        resetForm()
        loadTools()
        toast({
          title: "Success!",
          description: "AI tool created successfully.",
        })
      } else {
        setError("Failed to create AI tool")
        toast({
          title: "Error",
          description: "Failed to create AI tool",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error creating tool:", err)
      const errorMessage = err instanceof Error ? err.message : "An error occurred while creating the AI tool"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentTool) return
    
    try {
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(item => formDataObj.append(key, item))
          } else {
            formDataObj.append(key, String(value))
          }
        }
      })
      
      const result = await updateAiTool(currentTool.id, formDataObj)
      
      if (result.success) {
        setIsEditDialogOpen(false)
        resetForm()
        loadTools()
        toast({
          title: "Success!",
          description: "AI tool updated successfully.",
        })
      } else {
        setError("Failed to update AI tool")
        toast({
          title: "Error",
          description: "Failed to update AI tool",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error updating tool:", err)
      const errorMessage = err instanceof Error ? err.message : "An error occurred while updating the AI tool"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleDeleteConfirm = async () => {
    if (!currentTool) return
    
    try {
      const result = await deleteAiTool(currentTool.id)
      
      if (result.success) {
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

  const handleToggleActive = async (tool: AiTool) => {
    try {
      const newStatus = tool.status === 'active' ? 'deprecated' : 'active'
      const formDataObj = new FormData()
      formDataObj.append("name", tool.name)
      formDataObj.append("description", tool.description || "")
      formDataObj.append("status", newStatus)
      
      const result = await updateAiTool(tool.id, formDataObj)
      
      if (result.success) {
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
      detailed_description: "",
      category_id: "",
      version: "1.0.0",
      tool_type: "custom",
      complexity_level: "beginner",
      api_endpoint: "",
      pricing_model: "free",
      status: "active",
      is_featured: false,
      is_public: true,
      tags: [],
      keywords: []
    })
    setCurrentTool(null)
  }

  const handleEditTool = async (tool: AiTool) => {
    setCurrentTool(tool)
    try {
      // Use the tool data directly since it's already complete
      setFormData({
        name: tool.name,
        description: tool.description || "",
        detailed_description: tool.detailed_description || "",
        category_id: tool.category_id || "",
        version: tool.version || "1.0.0",
        tool_type: tool.tool_type || "custom",
        complexity_level: tool.complexity_level || "beginner",
        api_endpoint: tool.api_endpoint || "",
        pricing_model: tool.pricing_model || "free",
        status: tool.status || "active",
        is_featured: tool.is_featured || false,
        is_public: tool.is_public !== undefined ? tool.is_public : true,
        tags: tool.tags || [],
        keywords: tool.keywords || []
      })
      setIsEditDialogOpen(true)
    } catch (err) {
      console.error("Error setting up tool edit:", err)
      setError("Failed to load tool details for editing")
    }
  }

  const handleDeleteTool = (tool: AiTool) => {
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
                      <span className="text-muted-foreground">
                        <Settings className="h-4 w-4" />
                      </span>
                      {tool.name}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {tool.description}
                    </div>
                    {/* Show category on mobile as part of description */}
                    <div className="md:hidden mt-2">
                      {tool.category_id ? (
                        <Badge variant="outline" className="capitalize">
                          {getCategoryName(tool.category_id)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">Uncategorized</span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {tool.category_id ? (
                    <Badge variant="outline" className="capitalize">
                      {getCategoryName(tool.category_id)}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">Uncategorized</span>
                  )}
                </TableCell>
                <TableCell>
                  {tool.status === 'active' ? (
                    <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400">
                      {tool.status || 'Inactive'}
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
                      {tool.api_endpoint && (
                        <DropdownMenuItem onClick={() => window.open(tool.api_endpoint, '_blank')}>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open API Endpoint
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleToggleActive(tool)}>
                        <Power className="mr-2 h-4 w-4" />
                        {tool.status === 'active' ? "Deactivate" : "Activate"}
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
                <div key={category.id} className={`p-4 rounded-lg ${category.color || 'bg-blue-500'}`}>
                  <h3 className="font-semibold text-white truncate">{category.name}</h3>
                  <p className="text-sm text-white/80 mt-1 line-clamp-2">{category.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge className="bg-white/20 text-white hover:bg-white/30">
                      {category.tools_count} tools
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
                  placeholder="Brief description of what this tool does"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailed_description">Detailed Description</Label>
                <Textarea
                  id="detailed_description"
                  value={formData.detailed_description}
                  onChange={(e) => setFormData({ ...formData, detailed_description: e.target.value })}
                  placeholder="Detailed explanation of how this tool works and its benefits"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api_endpoint">API Endpoint</Label>
                <Input
                  id="api_endpoint"
                  value={formData.api_endpoint}
                  onChange={(e) => setFormData({ ...formData, api_endpoint: e.target.value })}
                  placeholder="https://api.example.com/tool-endpoint"
                />
                <p className="text-sm text-muted-foreground">Optional: The API endpoint where this tool is hosted</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category_id">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  >
                    <SelectTrigger id="category_id">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tool_type">Tool Type</Label>
                  <Select
                    value={formData.tool_type}
                    onValueChange={(value) => setFormData({ ...formData, tool_type: value as any })}
                  >
                    <SelectTrigger id="tool_type">
                      <SelectValue placeholder="Select tool type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chatbot">Chatbot</SelectItem>
                      <SelectItem value="automation">Automation</SelectItem>
                      <SelectItem value="analysis">Analysis</SelectItem>
                      <SelectItem value="integration">Integration</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Switch
                  id="is_featured"
                  checked={formData.is_featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Feature this tool</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_public"
                  checked={formData.is_public}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
                />
                <Label htmlFor="is_public">Make tool publicly available</Label>
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
                <Label htmlFor="edit-name">Settings Name</Label>
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
                  value={formData.api_endpoint}
                  onChange={(e) => setFormData({ ...formData, api_endpoint: e.target.value })}
                  placeholder="https://api.example.com/tool-endpoint"
                />
                <p className="text-sm text-muted-foreground">Optional: The API endpoint where this tool is hosted</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-tool-type">Tool Type</Label>
                  <Select
                    value={formData.tool_type || ""}
                    onValueChange={(value) => setFormData({ ...formData, tool_type: value as any })}
                  >
                    <SelectTrigger id="edit-tool-type">
                      <SelectValue placeholder="Select tool type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chatbot">Chatbot</SelectItem>
                      <SelectItem value="automation">Automation</SelectItem>
                      <SelectItem value="analysis">Analysis</SelectItem>
                      <SelectItem value="integration">Integration</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select
                    value={formData.category_id || ""}
                    onValueChange={(value) => setFormData({ ...formData, category_id: value })}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-is-featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label htmlFor="edit-is-featured">
                    Featured Tool
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-is-public"
                    checked={formData.is_public}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_public: checked })}
                  />
                  <Label htmlFor="edit-is-public">
                    Public Tool
                  </Label>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Settings</Button>
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
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/admin/dashboard-layout"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, MoreVertical, Pencil, Trash2, Eye, 
  Filter, Search, BarChart, ArrowRightCircle,
  Lightbulb, Zap, Star, Tag, ArrowUpDown, ChevronDown,
  Check, X, Copy, ExternalLink
} from "lucide-react"
import { 
  getPromptsAction, 
  getPromptByIdAction,
  createPromptAction,
  updatePromptAction,
  deletePromptAction,
  togglePromptPublicStatusAction,
  getPromptCategoriesAction
} from "@/app/actions/prompt-actions"
import type { PromptSummary, PromptFormData } from "@/types/prompts"

// Define available categories
const CATEGORIES = [
  "General",
  "Marketing",
  "Content Creation",
  "Data Analysis",
  "Programming",
  "Customer Service",
  "Sales",
  "Social Media",
  "Business Strategy",
  "Creative Writing",
  "Technical Writing",
  "Research",
  "AI Development",
  "Other"
]

export default function PromptLibraryPage() {
  const router = useRouter()
  const [prompts, setPrompts] = useState<PromptSummary[]>([])
  const [categories, setCategories] = useState<{category: string, count: number}[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState<PromptSummary | null>(null)
  const [promptContent, setPromptContent] = useState("")
  const [formData, setFormData] = useState<PromptFormData>({
    title: "",
    content: "",
    category: "General",
    description: "",
    isPublic: false,
    isFeatured: false,
    tags: []
  })
  const [tagInput, setTagInput] = useState("")
  const [sortColumn, setSortColumn] = useState<string>("usageCount")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    loadPrompts()
    loadCategories()
  }, [activeTab, selectedCategory, sortColumn, sortDirection])

  const loadPrompts = async () => {
    setIsLoading(true)
    try {
      // Determine filter based on active tab and selected category
      const filter: any = {}
      
      if (activeTab === "public") {
        filter.isPublic = true
      } else if (activeTab === "private") {
        filter.isPublic = false
      } else if (activeTab === "featured") {
        filter.isFeatured = true
      }
      
      if (selectedCategory) {
        filter.category = selectedCategory
      }
      
      filter.sortBy = sortColumn
      filter.sortDirection = sortDirection
      
      const fetchedPrompts = await getPromptsAction(filter)
      
      // Apply search filter if needed
      const filteredPrompts = searchTerm 
        ? fetchedPrompts.filter(prompt => 
            prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (prompt.description && prompt.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (prompt.tags && prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
            prompt.category.toLowerCase().includes(searchTerm.toLowerCase()))
          )
        : fetchedPrompts
        
      setPrompts(filteredPrompts)
    } catch (err) {
      console.error("Error loading prompts:", err)
      setError("Failed to load prompts")
    } finally {
      setIsLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const fetchedCategories = await getPromptCategoriesAction()
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
      // Set new column with default desc direction
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadPrompts()
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "tags" && Array.isArray(value)) {
          value.forEach(tag => formDataObj.append("tags", tag))
        } else if (value !== undefined) {
          formDataObj.append(key, String(value))
        }
      })
      
      const result = await createPromptAction(formDataObj)
      
      if (result.success) {
        setIsCreateDialogOpen(false)
        resetForm()
        loadPrompts()
      } else {
        setError(result.error || "Failed to create prompt")
      }
    } catch (err) {
      console.error("Error creating prompt:", err)
      setError("An error occurred while creating the prompt")
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentPrompt) return
    
    try {
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "tags" && Array.isArray(value)) {
          value.forEach(tag => formDataObj.append("tags", tag))
        } else if (value !== undefined) {
          formDataObj.append(key, String(value))
        }
      })
      
      const result = await updatePromptAction(currentPrompt.id, formDataObj)
      
      if (result.success) {
        setIsEditDialogOpen(false)
        resetForm()
        loadPrompts()
      } else {
        setError(result.error || "Failed to update prompt")
      }
    } catch (err) {
      console.error("Error updating prompt:", err)
      setError("An error occurred while updating the prompt")
    }
  }

  const handleDeleteConfirm = async () => {
    if (!currentPrompt) return
    
    try {
      const result = await deletePromptAction(currentPrompt.id)
      
      if (result.success) {
        setIsDeleteDialogOpen(false)
        setCurrentPrompt(null)
        loadPrompts()
      } else {
        setError(result.error || "Failed to delete prompt")
      }
    } catch (err) {
      console.error("Error deleting prompt:", err)
      setError("An error occurred while deleting the prompt")
    }
  }

  const handleTogglePublic = async (prompt: PromptSummary) => {
    try {
      const result = await togglePromptPublicStatusAction(prompt.id, prompt.isPublic)
      
      if (result.success) {
        loadPrompts()
      } else {
        setError(result.error || "Failed to toggle public status")
      }
    } catch (err) {
      console.error("Error toggling public status:", err)
      setError("An error occurred while toggling the public status")
    }
  }

  const handleToggleFeatured = async (prompt: PromptSummary) => {
    try {
      const updatedFormData = {
        title: prompt.title,
        content: "", // Will be populated from existing content
        category: prompt.category,
        description: prompt.description || "",
        isPublic: prompt.isPublic,
        isFeatured: !prompt.isFeatured,
        tags: prompt.tags || []
      }
      
      const formDataObj = new FormData()
      Object.entries(updatedFormData).forEach(([key, value]) => {
        if (key === "tags" && Array.isArray(value)) {
          value.forEach(tag => formDataObj.append("tags", tag))
        } else if (value !== undefined) {
          formDataObj.append(key, String(value))
        }
      })
      
      const result = await updatePromptAction(prompt.id, formDataObj)
      
      if (result.success) {
        loadPrompts()
      } else {
        setError(result.error || "Failed to toggle featured status")
      }
    } catch (err) {
      console.error("Error toggling featured status:", err)
      setError("An error occurred while toggling the featured status")
    }
  }

  const addTag = () => {
    if (!tagInput.trim()) return
    
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), tagInput.trim()]
    }))
    setTagInput("")
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      category: "General",
      description: "",
      isPublic: false,
      isFeatured: false,
      tags: []
    })
    setTagInput("")
    setCurrentPrompt(null)
  }

  const previewPrompt = async (prompt: PromptSummary) => {
    try {
      const fullPrompt = await getPromptByIdAction(prompt.id)
      if (fullPrompt) {
        setCurrentPrompt(prompt)
        setPromptContent(fullPrompt.content)
        setIsPreviewDialogOpen(true)
      }
    } catch (err) {
      console.error("Error fetching prompt content:", err)
      setError("Failed to fetch prompt content for preview")
    }
  }

  const handleEditPrompt = async (prompt: PromptSummary) => {
    try {
      const fullPrompt = await getPromptByIdAction(prompt.id)
      if (fullPrompt) {
        setCurrentPrompt(prompt)
        setFormData({
          title: prompt.title,
          content: fullPrompt.content,
          category: prompt.category,
          description: prompt.description || "",
          isPublic: prompt.isPublic,
          isFeatured: prompt.isFeatured,
          tags: prompt.tags || []
        })
        setIsEditDialogOpen(true)
      }
    } catch (err) {
      console.error("Error fetching prompt for edit:", err)
      setError("Failed to fetch prompt data for editing")
    }
  }

  const handleDeletePrompt = (prompt: PromptSummary) => {
    setCurrentPrompt(prompt)
    setIsDeleteDialogOpen(true)
  }

  const copyPromptContent = () => {
    navigator.clipboard.writeText(promptContent)
      .then(() => {
        // Show brief toast or notification
        console.log("Copied to clipboard!")
      })
      .catch(err => {
        console.error("Failed to copy:", err)
      })
  }

  return (
    <DashboardLayout
      title="Prompt Library"
      description="Manage and organize AI prompts for different use cases"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Prompt Library", href: "/admin/prompts", current: true }
      ]}
      actions={
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Prompt
        </Button>
      }
    >
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        {/* Left sidebar for filters and stats */}
        <div className="w-full lg:w-64 mb-6 lg:mb-0 space-y-6">
          <div className="flex flex-col sm:flex-row lg:flex-col gap-6">
            <Card className="flex-1 lg:flex-none w-full">
              <CardHeader className="pb-3">
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="px-4 py-2 max-h-[300px] overflow-y-auto">
                  <Button 
                    variant={selectedCategory === "" ? "default" : "ghost"} 
                    className="w-full justify-start mb-2"
                    onClick={() => setSelectedCategory("")}
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    All Categories
                  </Button>
                  {categories.map(cat => (
                    <Button 
                      key={cat.category} 
                      variant={selectedCategory === cat.category ? "default" : "ghost"} 
                      className="w-full justify-start mb-1"
                      onClick={() => setSelectedCategory(cat.category)}
                    >
                      <Tag className="mr-2 h-4 w-4" />
                      <span className="truncate">{cat.category}</span>
                      <Badge variant="outline" className="ml-auto shrink-0">
                        {cat.count}
                      </Badge>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="flex-1 lg:flex-none w-full">
              <CardHeader className="pb-3">
                <CardTitle>Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Prompts</span>
                    <span className="font-medium">{prompts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Public</span>
                    <span className="font-medium">
                      {prompts.filter(p => p.isPublic).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Private</span>
                    <span className="font-medium">
                      {prompts.filter(p => !p.isPublic).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Featured</span>
                    <span className="font-medium">
                      {prompts.filter(p => p.isFeatured).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1">
          <Tabs 
            defaultValue="all" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="all">All Prompts</TabsTrigger>
                <TabsTrigger value="public">Public</TabsTrigger>
                <TabsTrigger value="private">Private</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
              </TabsList>
              
              <form onSubmit={handleSearch} className="flex w-full sm:max-w-sm items-center space-x-2">
                <Input
                  type="search"
                  placeholder="Search prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 min-w-0"
                />
                <Button type="submit" size="sm" variant="outline" className="shrink-0">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            <TabsContent value="all" className="mt-4 overflow-x-auto">
              <div className="w-full overflow-x-auto">
                <PromptLibraryTable />
              </div>
            </TabsContent>
            
            <TabsContent value="public" className="mt-4 overflow-x-auto">
              <div className="w-full overflow-x-auto">
                <PromptLibraryTable />
              </div>
            </TabsContent>
            
            <TabsContent value="private" className="mt-4 overflow-x-auto">
              <div className="w-full overflow-x-auto">
                <PromptLibraryTable />
              </div>
            </TabsContent>
            
            <TabsContent value="featured" className="mt-4 overflow-x-auto">
              <div className="w-full overflow-x-auto">
                <PromptLibraryTable />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Create Prompt Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="w-[95%] sm:w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Prompt</DialogTitle>
            <DialogDescription>
              Create a new AI prompt. You can save it as private or make it public for users.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of what this prompt does"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Prompt Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter the prompt content here..."
                  required
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags && formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)} 
                      />
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between pt-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="public"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                  />
                  <Label htmlFor="public">Make this prompt public</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                    disabled={!formData.isPublic}
                  />
                  <Label htmlFor="featured" className={!formData.isPublic ? "text-muted-foreground" : ""}>
                    Feature this prompt
                  </Label>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Prompt</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Prompt Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95%] sm:w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Prompt</DialogTitle>
            <DialogDescription>
              Update your prompt content or settings.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {/* Same form fields as create prompt dialog */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of what this prompt does"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-content">Prompt Content</Label>
                <Textarea
                  id="edit-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter the prompt content here..."
                  required
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags && formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)} 
                      />
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between pt-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-public"
                    checked={formData.isPublic}
                    onCheckedChange={(checked) => setFormData({ ...formData, isPublic: checked })}
                  />
                  <Label htmlFor="edit-public">Make this prompt public</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-featured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                    disabled={!formData.isPublic}
                  />
                  <Label htmlFor="edit-featured" className={!formData.isPublic ? "text-muted-foreground" : ""}>
                    Feature this prompt
                  </Label>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Prompt</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] w-full">
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this prompt? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentPrompt && (
            <div className="py-4">
              <h3 className="font-medium">{currentPrompt.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{currentPrompt.description}</p>
              <div className="mt-2">
                <Badge variant="secondary">{currentPrompt.category}</Badge>
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
      
      {/* Preview Prompt Dialog */}
      <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
        <DialogContent className="w-[95%] sm:w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentPrompt?.title}</DialogTitle>
            <DialogDescription>{currentPrompt?.description}</DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex gap-2 mb-4">
              <Badge variant="outline">{currentPrompt?.category}</Badge>
              {currentPrompt?.tags?.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
            
            <div className="relative rounded-md border bg-muted p-4 font-mono text-sm">
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute top-2 right-2" 
                onClick={copyPromptContent}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <pre className="whitespace-pre-wrap">{promptContent}</pre>
            </div>
            
            <div className="flex justify-between mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart className="h-4 w-4" />
                <span>Usage count: {currentPrompt?.usageCount}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Version: {currentPrompt?.version}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsPreviewDialogOpen(false)
              if (currentPrompt) {
                handleEditPrompt(currentPrompt)
              }
            }}>
              Edit Prompt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Prompt Library Table Component */}
      function PromptLibraryTable() {
        if (isLoading) {
          return (
            <div className="py-8 flex justify-center">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                <p>Loading prompts...</p>
              </div>
            </div>
          )
        }
        
        if (error) {
          return (
            <div className="py-8 text-center">
              <p className="text-red-500">{error}</p>
              <Button variant="outline" className="mt-4" onClick={loadPrompts}>
                Retry
              </Button>
            </div>
          )
        }
        
        if (prompts.length === 0) {
          return (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No prompts found</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Create Your First Prompt
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
                      onClick={() => handleSort("title")}
                      className="flex items-center gap-1"
                    >
                      Title
                      {sortColumn === "title" && (
                        <ChevronDown className={`h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="w-[100px]">
                    <span className="sm:hidden">Status</span>
                    <span className="hidden sm:inline">Status</span>
                  </TableHead>
                  <TableHead className="hidden sm:table-cell w-[80px]">
                    <Button 
                      variant="ghost" 
                      onClick={() => handleSort("usageCount")}
                      className="flex items-center gap-1"
                    >
                      Usage
                      {sortColumn === "usageCount" && (
                        <ChevronDown className={`h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead className="text-right w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prompts.map(prompt => (
                  <TableRow key={prompt.id}>
                    <TableCell className="min-w-[200px]">
                      <div>
                        <div className="font-medium truncate">{prompt.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {prompt.description || 'No description'}
                        </div>
                        {prompt.tags && prompt.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {prompt.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {prompt.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{prompt.tags.length - 2} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{prompt.category}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {prompt.isPublic ? (
                          <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400 whitespace-nowrap">
                            Public
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400 whitespace-nowrap">
                            Private
                          </Badge>
                        )}
                        
                        {prompt.isFeatured && (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/30 whitespace-nowrap">
                            <Star className="h-3 w-3 mr-1" />
                            <span className="hidden sm:inline">Featured</span>
                            <span className="sm:hidden inline">Feat</span>
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <span>{prompt.usageCount}</span>
                      </div>
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
                          <DropdownMenuItem onClick={() => previewPrompt(prompt)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditPrompt(prompt)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTogglePublic(prompt)}>
                            {prompt.isPublic ? (
                              <>
                                <X className="mr-2 h-4 w-4" />
                                Make Private
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Make Public
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleFeatured(prompt)}>
                            {prompt.isFeatured ? (
                              <>
                                <X className="mr-2 h-4 w-4" />
                                Remove Featured
                              </>
                            ) : (
                              <>
                                <Star className="mr-2 h-4 w-4" />
                                Feature Prompt
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeletePrompt(prompt)}
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
    </DashboardLayout>
  )
}
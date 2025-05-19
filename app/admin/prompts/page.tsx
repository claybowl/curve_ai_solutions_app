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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { 
  Plus, MoreVertical, Pencil, Trash2, RefreshCw, 
  Tag, Clipboard, Tag as TagIcon, Search,
  FlaskConical, Code, FileText, Terminal, Zap,
  LayoutList, Folder, Bot
} from "lucide-react"
import {
  getPromptsAction,
  createPromptAction,
  updatePromptAction,
  deletePromptAction,
  updatePromptCategoryAction,
  getPromptCategoriesAction
} from "@/app/actions/prompt-actions"
import { Prompt, PromptCategory } from "@/types/prompts"
import { 
  ChartContainer, 
  LineChart, 
  BarChart, 
  PieChart 
} from "@/components/ui/chart"

export default function PromptsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [categories, setCategories] = useState<PromptCategory[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null)

  // Form states
  const [newPromptTitle, setNewPromptTitle] = useState("")
  const [newPromptContent, setNewPromptContent] = useState("")
  const [newPromptCategory, setNewPromptCategory] = useState("")
  const [newPromptTags, setNewPromptTags] = useState("")
  const [newPromptPublished, setNewPromptPublished] = useState(true)
  
  // Edit form states
  const [editTitle, setEditTitle] = useState("")
  const [editContent, setEditContent] = useState("")
  const [editCategory, setEditCategory] = useState("")
  const [editTags, setEditTags] = useState("")
  const [editPublished, setEditPublished] = useState(true)
  
  // New category state
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryDescription, setNewCategoryDescription] = useState("")

  useEffect(() => {
    loadPrompts()
    loadCategories()
  }, [])

  const loadPrompts = async () => {
    setIsLoading(true)
    try {
      const result = await getPromptsAction()
      if (result) {
        setPrompts(result)
      }
    } catch (error) {
      console.error("Failed to load prompts:", error)
      toast({
        title: "Error",
        description: "Failed to load prompts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const result = await getPromptCategoriesAction()
      if (result) {
        setCategories(result)
      }
    } catch (error) {
      console.error("Failed to load categories:", error)
      toast({
        title: "Error",
        description: "Failed to load prompt categories. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await createPromptAction({
        title: newPromptTitle,
        content: newPromptContent,
        category: newPromptCategory,
        tags: newPromptTags.split(",").map(tag => tag.trim()).filter(Boolean),
        published: newPromptPublished,
      })
      
      if (result) {
        setPrompts(prev => [...prev, result])
        setIsCreateDialogOpen(false)
        // Reset form
        setNewPromptTitle("")
        setNewPromptContent("")
        setNewPromptCategory("")
        setNewPromptTags("")
        setNewPromptPublished(true)
        
        toast({
          title: "Success",
          description: "Prompt created successfully",
        })
      }
    } catch (error) {
      console.error("Failed to create prompt:", error)
      toast({
        title: "Error",
        description: "Failed to create prompt. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPrompt) return
    
    try {
      const result = await updatePromptAction({
        id: currentPrompt.id,
        title: editTitle,
        content: editContent,
        category: editCategory,
        tags: editTags.split(",").map(tag => tag.trim()).filter(Boolean),
        published: editPublished,
      })
      
      if (result) {
        setPrompts(prev => prev.map(prompt => prompt.id === result.id ? result : prompt))
        setIsEditDialogOpen(false)
        setCurrentPrompt(null)
        
        toast({
          title: "Success",
          description: "Prompt updated successfully",
        })
      }
    } catch (error) {
      console.error("Failed to update prompt:", error)
      toast({
        title: "Error",
        description: "Failed to update prompt. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSubmit = async () => {
    if (!currentPrompt) return
    
    try {
      const result = await deletePromptAction(currentPrompt.id)
      
      if (result) {
        setPrompts(prev => prev.filter(prompt => prompt.id !== currentPrompt.id))
        setIsDeleteDialogOpen(false)
        setCurrentPrompt(null)
        
        toast({
          title: "Success",
          description: "Prompt deleted successfully",
        })
      }
    } catch (error) {
      console.error("Failed to delete prompt:", error)
      toast({
        title: "Error",
        description: "Failed to delete prompt. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await updatePromptCategoryAction({
        name: newCategoryName,
        description: newCategoryDescription,
      })
      
      if (result) {
        setCategories(prev => [...prev, result])
        setIsCategoryDialogOpen(false)
        // Reset form
        setNewCategoryName("")
        setNewCategoryDescription("")
        
        toast({
          title: "Success",
          description: "Category created successfully",
        })
      }
    } catch (error) {
      console.error("Failed to create category:", error)
      toast({
        title: "Error",
        description: "Failed to create category. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle edit click
  const handleEditClick = (prompt: Prompt) => {
    setCurrentPrompt(prompt)
    setEditTitle(prompt.title)
    setEditContent(prompt.content)
    setEditCategory(prompt.category || "")
    setEditTags(prompt.tags?.join(", ") || "")
    setEditPublished(prompt.published)
    setIsEditDialogOpen(true)
  }

  // Handle delete click
  const handleDeleteClick = (prompt: Prompt) => {
    setCurrentPrompt(prompt)
    setIsDeleteDialogOpen(true)
  }

  // Filter prompts based on active tab, category, and search term
  const filteredPrompts = prompts.filter(prompt => {
    // Filter by tab
    const tabFilter = 
      activeTab === "all" ? true :
      activeTab === "published" ? prompt.published :
      activeTab === "draft" ? !prompt.published : true
    
    // Filter by category
    const categoryFilter = !selectedCategory || prompt.category === selectedCategory
    
    // Filter by search term
    const search = searchTerm.toLowerCase()
    const searchFilter = !search || 
      prompt.title.toLowerCase().includes(search) || 
      prompt.content.toLowerCase().includes(search) ||
      (prompt.tags && prompt.tags.some(tag => tag.toLowerCase().includes(search)))
    
    return tabFilter && categoryFilter && searchFilter
  })

  // Prepare chart data
  const categoryUsageData = Object.entries(
    prompts.reduce((acc: Record<string, number>, prompt) => {
      const category = prompt.category || "Uncategorized"
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {})
  ).map(([name, count]) => ({ name, count }))

  return (
    <DashboardLayout
      title="Prompt Library"
      description="Manage and organize AI prompts for different use cases"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Prompts", href: "/admin/prompts", current: true }
      ]}
      actions={
        <>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Prompt
          </Button>
          <Button variant="outline" onClick={() => setIsCategoryDialogOpen(true)}>
            <Folder className="h-4 w-4 mr-2" /> Add Category
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Categories</span>
              <span className="text-xs text-muted-foreground">{categories.length}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-320px)] lg:h-auto pr-3">
              <div className="space-y-1">
                <Button 
                  variant={selectedCategory === null ? "secondary" : "ghost"} 
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory(null)}
                >
                  <LayoutList className="h-4 w-4 mr-2" />
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.name ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <TagIcon className="h-4 w-4 mr-2" />
                    {category.name}
                  </Button>
                ))}
              </div>
            </ScrollArea>
            
            <div className="mt-6">
              <CardTitle className="text-sm mb-3">Category Distribution</CardTitle>
              <div className="h-[200px] w-full">
                <ChartContainer>
                  <PieChart 
                    data={categoryUsageData} 
                    category="count"
                    index="name"
                    valueFormatter={(value) => `${value} prompts`}
                    colors={["primary", "indigo", "cyan", "amber", "rose"]}
                  />
                </ChartContainer>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Content */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center flex-wrap gap-4">
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="all">All Prompts</TabsTrigger>
                    <TabsTrigger value="published">Published</TabsTrigger>
                    <TabsTrigger value="draft">Drafts</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search prompts..."
                    className="w-[250px] pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
              </div>
            ) : filteredPrompts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                <h3 className="text-lg font-medium mb-1">No prompts found</h3>
                <p className="text-sm">Try adjusting your search or filters, or create a new prompt.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPrompts.map((prompt) => (
                      <TableRow key={prompt.id}>
                        <TableCell className="font-medium max-w-[300px] truncate">
                          {prompt.title}
                        </TableCell>
                        <TableCell>
                          {prompt.category ? (
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              {prompt.category}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">Uncategorized</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {prompt.published ? (
                            <Badge variant="default">Published</Badge>
                          ) : (
                            <Badge variant="outline">Draft</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {prompt.tags && prompt.tags.length > 0 ? (
                              prompt.tags.slice(0, 2).map((tag, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">No tags</span>
                            )}
                            {prompt.tags && prompt.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">+{prompt.tags.length - 2}</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                navigator.clipboard.writeText(prompt.content)
                                toast({
                                  title: "Copied to clipboard",
                                  description: "Prompt content copied to clipboard",
                                })
                              }}>
                                <Clipboard className="h-4 w-4 mr-2" />
                                Copy Prompt
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditClick(prompt)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteClick(prompt)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
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
      
      {/* Create Prompt Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Prompt</DialogTitle>
            <DialogDescription>
              Add a new prompt to your library. Fill out the details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newPromptTitle}
                  onChange={(e) => setNewPromptTitle(e.target.value)}
                  placeholder="My Awesome Prompt"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Prompt Content</Label>
                <Textarea
                  id="content"
                  value={newPromptContent}
                  onChange={(e) => setNewPromptContent(e.target.value)}
                  placeholder="Your prompt content here..."
                  rows={6}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select value={newPromptCategory} onValueChange={setNewPromptCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={newPromptTags}
                  onChange={(e) => setNewPromptTags(e.target.value)}
                  placeholder="ai, chatgpt, code generation"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={newPromptPublished}
                  onCheckedChange={setNewPromptPublished}
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>
            </div>
            <DialogFooter>
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Prompt</DialogTitle>
            <DialogDescription>
              Update the details of your prompt.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="editTitle">Title</Label>
                <Input
                  id="editTitle"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="My Awesome Prompt"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editContent">Prompt Content</Label>
                <Textarea
                  id="editContent"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Your prompt content here..."
                  rows={6}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editCategory">Category</Label>
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editTags">Tags (comma separated)</Label>
                <Input
                  id="editTags"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="ai, chatgpt, code generation"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="editPublished"
                  checked={editPublished}
                  onCheckedChange={setEditPublished}
                />
                <Label htmlFor="editPublished">{editPublished ? "Published" : "Draft"}</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Prompt</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Prompt Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Prompt</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this prompt? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
            <h4 className="font-medium">{currentPrompt?.title}</h4>
            <p className="text-sm text-muted-foreground mt-1 truncate">{currentPrompt?.content.substring(0, 100)}{currentPrompt?.content.length > 100 ? '...' : ''}</p>
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteSubmit}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new category to organize your prompts.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCategory}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., Development, Marketing, Content"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="categoryDescription">Description (Optional)</Label>
                <Textarea
                  id="categoryDescription"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  placeholder="A brief description of this category..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Category</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
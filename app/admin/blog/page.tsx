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
import { 
  Plus, MoreVertical, Pencil, Trash2, Eye, 
  Calendar, User, Tag, Filter, Search, ExternalLink,
  Check, X, ArrowUpDown, ChevronDown 
} from "lucide-react"
import { format } from "date-fns"
import { 
  getBlogPostsAction, 
  createBlogPostAction,
  updateBlogPostAction,
  deleteBlogPostAction,
  toggleBlogPostPublishStatusAction,
  generateSlugAction,
  getBlogTagsAction
} from "@/app/actions/blog-actions"
import type { BlogPostSummary, BlogPostFormData } from "@/types/blog"

export default function BlogManagementPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPostSummary[]>([])
  const [tags, setTags] = useState<{tag: string, count: number}[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState<BlogPostSummary | null>(null)
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: "",
    slug: "",
    content: "",
    description: "",
    published: false,
    tags: []
  })
  const [tagInput, setTagInput] = useState("")
  const [sortColumn, setSortColumn] = useState<string>("publishedAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    loadPosts()
    loadTags()
  }, [activeTab, sortColumn, sortDirection])

  const loadPosts = async () => {
    setIsLoading(true)
    try {
      // Determine filter based on active tab
      const filter: any = {}
      
      if (activeTab === "published") {
        filter.published = true
      } else if (activeTab === "drafts") {
        filter.published = false
      }
      
      filter.sortBy = sortColumn
      filter.sortDirection = sortDirection
      
      const fetchedPosts = await getBlogPostsAction(filter)
      
      // Apply search filter if needed
      const filteredPosts = searchTerm 
        ? fetchedPosts.filter(post => 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (post.description && post.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
          )
        : fetchedPosts
        
      setPosts(filteredPosts)
    } catch (err) {
      console.error("Error loading posts:", err)
      setError("Failed to load blog posts")
    } finally {
      setIsLoading(false)
    }
  }

  const loadTags = async () => {
    try {
      const fetchedTags = await getBlogTagsAction(20)
      setTags(fetchedTags)
    } catch (err) {
      console.error("Error loading tags:", err)
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
    loadPosts()
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
      
      const result = await createBlogPostAction(formDataObj)
      
      if (result.success) {
        setIsCreateDialogOpen(false)
        resetForm()
        loadPosts()
      } else {
        setError(result.error || "Failed to create blog post")
      }
    } catch (err) {
      console.error("Error creating post:", err)
      setError("An error occurred while creating the blog post")
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentPost) return
    
    try {
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "tags" && Array.isArray(value)) {
          value.forEach(tag => formDataObj.append("tags", tag))
        } else if (value !== undefined) {
          formDataObj.append(key, String(value))
        }
      })
      
      const result = await updateBlogPostAction(currentPost.id, formDataObj)
      
      if (result.success) {
        setIsEditDialogOpen(false)
        resetForm()
        loadPosts()
      } else {
        setError(result.error || "Failed to update blog post")
      }
    } catch (err) {
      console.error("Error updating post:", err)
      setError("An error occurred while updating the blog post")
    }
  }

  const handleDeleteConfirm = async () => {
    if (!currentPost) return
    
    try {
      const result = await deleteBlogPostAction(currentPost.id)
      
      if (result.success) {
        setIsDeleteDialogOpen(false)
        setCurrentPost(null)
        loadPosts()
      } else {
        setError(result.error || "Failed to delete blog post")
      }
    } catch (err) {
      console.error("Error deleting post:", err)
      setError("An error occurred while deleting the blog post")
    }
  }

  const handleTogglePublish = async (post: BlogPostSummary) => {
    try {
      const result = await toggleBlogPostPublishStatusAction(post.id, post.published)
      
      if (result.success) {
        loadPosts()
      } else {
        setError(result.error || "Failed to toggle publish status")
      }
    } catch (err) {
      console.error("Error toggling publish status:", err)
      setError("An error occurred while toggling the publish status")
    }
  }

  const handleGenerateSlug = async () => {
    if (!formData.title) return
    
    try {
      const result = await generateSlugAction(formData.title)
      setFormData(prev => ({ ...prev, slug: result.slug }))
    } catch (err) {
      console.error("Error generating slug:", err)
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
      slug: "",
      content: "",
      description: "",
      published: false,
      tags: []
    })
    setTagInput("")
    setCurrentPost(null)
  }

  const handleEditPost = (post: BlogPostSummary) => {
    // We need to fetch the full post first as the summary doesn't have content
    setCurrentPost(post)
    setFormData({
      title: post.title,
      slug: post.slug,
      content: "", // This will be populated when fetched
      description: post.description || "",
      published: post.published,
      tags: post.tags || []
    })
    setIsEditDialogOpen(true)
  }

  const handleDeletePost = (post: BlogPostSummary) => {
    setCurrentPost(post)
    setIsDeleteDialogOpen(true)
  }

  const viewPost = (slug: string) => {
    window.open(`/blog/${slug}`, '_blank')
  }

  return (
    <DashboardLayout
      title="Blog Posts"
      description="Manage your blog posts, create new content, and control publishing"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Blog Posts", href: "/admin/blog", current: true }
      ]}
      actions={
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Post
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
          <TabsList>
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSearch} className="flex w-full sm:max-w-sm items-center space-x-2">
            <Input
              type="search"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>
        
        <TabsContent value="all" className="mt-4">
          <div className="overflow-x-auto">
            <BlogPostsTable />
          </div>
        </TabsContent>
        
        <TabsContent value="published" className="mt-4">
          <div className="overflow-x-auto">
            <BlogPostsTable />
          </div>
        </TabsContent>
        
        <TabsContent value="drafts" className="mt-4">
          <div className="overflow-x-auto">
            <BlogPostsTable />
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Popular Tags Card */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Popular Tags</CardTitle>
            <CardDescription>Most frequently used tags across all blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
              {tags.map(tag => (
                <Badge key={tag.tag} variant="outline" className="flex items-center gap-1 whitespace-nowrap">
                  {tag.tag}
                  <span className="ml-1 text-xs text-gray-500">({tag.count})</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Create Post Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="w-[95%] sm:w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
            <DialogDescription>
              Create a new blog post. You can save it as a draft or publish it immediately.
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
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGenerateSlug}
                  className="whitespace-nowrap"
                >
                  Generate Slug
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of the post (optional)"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your blog post content here..."
                  required
                  rows={10}
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
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  />
                  <Label htmlFor="published">Publish immediately</Label>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Post</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[95%] sm:w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update your blog post content or settings.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditSubmit} className="space-y-4">
            {/* Same form fields as create post dialog */}
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
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="edit-slug">Slug</Label>
                  <Input
                    id="edit-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleGenerateSlug}
                  className="whitespace-nowrap"
                >
                  Generate Slug
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Short Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of the post (optional)"
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your blog post content here..."
                  required
                  rows={10}
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
              
              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="edit-published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  />
                  <Label htmlFor="edit-published">
                    {formData.published ? "Published" : "Draft"}
                  </Label>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Post</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] w-full">
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {currentPost && (
            <div className="py-4">
              <h3 className="font-medium truncate">{currentPost.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{currentPost.description}</p>
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
      
      {/* Blog Posts Table Component */}
      function BlogPostsTable() {
        if (isLoading) {
          return (
            <div className="py-8 flex justify-center">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                <p>Loading blog posts...</p>
              </div>
            </div>
          )
        }
        
        if (error) {
          return (
            <div className="py-8 text-center">
              <p className="text-red-500">{error}</p>
              <Button variant="outline" className="mt-4" onClick={loadPosts}>
                Retry
              </Button>
            </div>
          )
        }
        
        if (posts.length === 0) {
          return (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No blog posts found</p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                Create Your First Post
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
                    <TableHead className="w-[90px]">
                      <span className="sm:hidden">Status</span>
                      <span className="hidden sm:inline">Status</span>
                    </TableHead>
                    <TableHead className="hidden md:table-cell w-[90px]">
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort("publishedAt")}
                        className="flex items-center gap-1"
                      >
                        Date
                        {sortColumn === "publishedAt" && (
                          <ChevronDown className={`h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="hidden sm:table-cell w-[80px]">
                      <Button 
                        variant="ghost" 
                        onClick={() => handleSort("viewCount")}
                        className="flex items-center gap-1"
                      >
                        Views
                        {sortColumn === "viewCount" && (
                          <ChevronDown className={`h-4 w-4 ${sortDirection === "asc" ? "rotate-180" : ""}`} />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {posts.map(post => (
                  <TableRow key={post.id}>
                    <TableCell className="min-w-[200px]">
                      <div>
                        <div className="font-medium truncate">{post.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">{post.description || 'No description'}</div>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {post.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {post.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{post.tags.length - 2} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {post.published ? (
                        <Badge variant="success" className="bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                          <span className="sm:hidden">Pub</span>
                          <span className="hidden sm:inline">Published</span>
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400">
                          Draft
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell whitespace-nowrap">
                      {post.publishedAt 
                        ? format(new Date(post.publishedAt), 'MMM d, yyyy') 
                        : 'Not published'}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{post.viewCount}</TableCell>
                    <TableCell className="text-right p-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditPost(post)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => viewPost(post.slug)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTogglePublish(post)}>
                            {post.published ? (
                              <>
                                <X className="mr-2 h-4 w-4" />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Publish
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeletePost(post)}
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
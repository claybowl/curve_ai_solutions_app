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
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"
import { 
  Plus, MoreVertical, Pencil, Trash2, RefreshCw, 
  Link as LinkIcon, GanttChart, FileText, Eye, 
  ThumbsUp, Tag, Calendar, BookOpen
} from "lucide-react"
import {
  getPostsAction,
  createPostAction,
  updatePostAction,
  deletePostAction,
  syncPostsAction
} from "@/app/actions/blog-actions"
import { BlogPost } from "@/types/blog"

export default function BlogPostsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [activeTab, setActiveTab] = useState("all")

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null)

  // Form states
  const [newPostTitle, setNewPostTitle] = useState("")
  const [newPostSlug, setNewPostSlug] = useState("")
  const [newPostExcerpt, setNewPostExcerpt] = useState("")
  const [newPostTags, setNewPostTags] = useState("")
  const [newPostCoverImage, setNewPostCoverImage] = useState("")
  const [newPostPublished, setNewPostPublished] = useState(false)
  
  // Edit form states
  const [editTitle, setEditTitle] = useState("")
  const [editSlug, setEditSlug] = useState("")
  const [editExcerpt, setEditExcerpt] = useState("")
  const [editTags, setEditTags] = useState("")
  const [editCoverImage, setEditCoverImage] = useState("")
  const [editPublished, setEditPublished] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    setIsLoading(true)
    try {
      const result = await getPostsAction()
      if (result) {
        setPosts(result)
      }
    } catch (error) {
      console.error("Failed to load blog posts:", error)
      toast({
        title: "Error",
        description: "Failed to load blog posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const syncPosts = async () => {
    setIsSyncing(true)
    try {
      const result = await syncPostsAction()
      if (result) {
        setPosts(result)
        toast({
          title: "Success",
          description: `Successfully synced ${result.length} posts from Notion`,
        })
      }
    } catch (error) {
      console.error("Failed to sync blog posts:", error)
      toast({
        title: "Error",
        description: "Failed to sync blog posts from Notion. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await createPostAction({
        title: newPostTitle,
        slug: newPostSlug,
        excerpt: newPostExcerpt,
        tags: newPostTags.split(",").map(tag => tag.trim()).filter(Boolean),
        coverImage: newPostCoverImage,
        published: newPostPublished,
      })
      
      if (result) {
        setPosts(prev => [...prev, result])
        setIsCreateDialogOpen(false)
        // Reset form
        setNewPostTitle("")
        setNewPostSlug("")
        setNewPostExcerpt("")
        setNewPostTags("")
        setNewPostCoverImage("")
        setNewPostPublished(false)
        
        toast({
          title: "Success",
          description: "Blog post created successfully",
        })
      }
    } catch (error) {
      console.error("Failed to create blog post:", error)
      toast({
        title: "Error",
        description: "Failed to create blog post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPost) return
    
    try {
      const result = await updatePostAction({
        id: currentPost.id,
        title: editTitle,
        slug: editSlug,
        excerpt: editExcerpt,
        tags: editTags.split(",").map(tag => tag.trim()).filter(Boolean),
        coverImage: editCoverImage,
        published: editPublished,
      })
      
      if (result) {
        setPosts(prev => prev.map(post => post.id === result.id ? result : post))
        setIsEditDialogOpen(false)
        setCurrentPost(null)
        
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        })
      }
    } catch (error) {
      console.error("Failed to update blog post:", error)
      toast({
        title: "Error",
        description: "Failed to update blog post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSubmit = async () => {
    if (!currentPost) return
    
    try {
      const result = await deletePostAction(currentPost.id)
      
      if (result) {
        setPosts(prev => prev.filter(post => post.id !== currentPost.id))
        setIsDeleteDialogOpen(false)
        setCurrentPost(null)
        
        toast({
          title: "Success",
          description: "Blog post deleted successfully",
        })
      }
    } catch (error) {
      console.error("Failed to delete blog post:", error)
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Filter posts based on active tab
  const filteredPosts = posts.filter(post => {
    if (activeTab === "all") return true
    if (activeTab === "published") return post.published
    if (activeTab === "draft") return !post.published
    return true
  })

  // Handle edit click
  const handleEditClick = (post: BlogPost) => {
    setCurrentPost(post)
    setEditTitle(post.title)
    setEditSlug(post.slug)
    setEditExcerpt(post.excerpt || "")
    setEditTags(post.tags?.join(", ") || "")
    setEditCoverImage(post.coverImage || "")
    setEditPublished(post.published)
    setIsEditDialogOpen(true)
  }

  // Handle delete click
  const handleDeleteClick = (post: BlogPost) => {
    setCurrentPost(post)
    setIsDeleteDialogOpen(true)
  }

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
  }

  return (
    <DashboardLayout
      title="Blog Posts"
      description="Manage your blog posts, create new content, and control publishing"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Blog", href: "/admin/blog", current: true }
      ]}
      actions={
        <>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Post
          </Button>
          <Button variant="outline" onClick={syncPosts} disabled={isSyncing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
            Sync with Notion
          </Button>
        </>
      }
    >
      <Card>
        <CardHeader>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Posts</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-primary rounded-full"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-medium mb-1">No blog posts found</h3>
              <p className="text-sm">Get started by creating a new post or syncing with Notion.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {post.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[150px] truncate">
                        <div className="flex items-center gap-1">
                          <LinkIcon className="h-3 w-3" />
                          <span>{post.slug}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {post.published ? (
                          <Badge variant="default">Published</Badge>
                        ) : (
                          <Badge variant="outline">Draft</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {post.publishedAt ? format(new Date(post.publishedAt), "MMM d, yyyy") : 
                          post.updatedAt ? format(new Date(post.updatedAt), "MMM d, yyyy") : 
                          format(new Date(post.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {post.tags && post.tags.length > 0 ? (
                            post.tags.slice(0, 2).map((tag, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">No tags</span>
                          )}
                          {post.tags && post.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">+{post.tags.length - 2}</Badge>
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
                            <DropdownMenuItem asChild>
                              <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClick(post)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDeleteClick(post)} className="text-red-600">
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
      
      {/* Create Post Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Blog Post</DialogTitle>
            <DialogDescription>
              Add a new blog post to your website. Fill out the details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newPostTitle}
                  onChange={(e) => {
                    setNewPostTitle(e.target.value)
                    // Auto-generate slug if empty
                    if (!newPostSlug) {
                      setNewPostSlug(generateSlug(e.target.value))
                    }
                  }}
                  placeholder="My Awesome Blog Post"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={newPostSlug}
                  onChange={(e) => setNewPostSlug(e.target.value)}
                  placeholder="my-awesome-blog-post"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={newPostExcerpt}
                  onChange={(e) => setNewPostExcerpt(e.target.value)}
                  placeholder="A short description of your blog post"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={newPostTags}
                  onChange={(e) => setNewPostTags(e.target.value)}
                  placeholder="technology, ai, business"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  value={newPostCoverImage}
                  onChange={(e) => setNewPostCoverImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={newPostPublished}
                  onCheckedChange={setNewPostPublished}
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>
            </div>
            <DialogFooter>
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update the details of your blog post.
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
                  placeholder="My Awesome Blog Post"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editSlug">Slug</Label>
                <Input
                  id="editSlug"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  placeholder="my-awesome-blog-post"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editExcerpt">Excerpt</Label>
                <Textarea
                  id="editExcerpt"
                  value={editExcerpt}
                  onChange={(e) => setEditExcerpt(e.target.value)}
                  placeholder="A short description of your blog post"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editTags">Tags (comma separated)</Label>
                <Input
                  id="editTags"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="technology, ai, business"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editCoverImage">Cover Image URL</Label>
                <Input
                  id="editCoverImage"
                  value={editCoverImage}
                  onChange={(e) => setEditCoverImage(e.target.value)}
                  placeholder="https://example.com/image.jpg"
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
              <Button type="submit">Update Post</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Post Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
            <h4 className="font-medium">{currentPost?.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{currentPost?.excerpt || "No excerpt provided"}</p>
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
    </DashboardLayout>
  )
}
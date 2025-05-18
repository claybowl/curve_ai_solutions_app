"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import {
  getBlogPostsAction,
  getBlogPostBySlugAction,
  createBlogPostAction,
  updateBlogPostAction,
  deleteBlogPostAction,
  generateSlugAction,
  toggleBlogPostPublishStatusAction
} from "@/app/actions/blog-actions"

export default function BlogActionsExample() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch blog posts
  const handleFetchPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const posts = await getBlogPostsAction()
      setResult(posts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Fetch single blog post
  const handleFetchPost = async (slug: string) => {
    setLoading(true)
    setError(null)
    try {
      const post = await getBlogPostBySlugAction(slug)
      setResult(post)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Create a new blog post
  const handleCreatePost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(event.currentTarget)
    
    try {
      const result = await createBlogPostAction(formData)
      setResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Update a blog post
  const handleUpdatePost = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(event.currentTarget)
    const id = parseInt(formData.get("id") as string)
    
    try {
      const result = await updateBlogPostAction(id, formData)
      setResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Delete a blog post
  const handleDeletePost = async (id: number) => {
    setLoading(true)
    setError(null)
    try {
      const result = await deleteBlogPostAction(id)
      setResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Generate a slug
  const handleGenerateSlug = async (title: string) => {
    setLoading(true)
    setError(null)
    try {
      const result = await generateSlugAction(title)
      setResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  // Toggle blog post publish status
  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    setLoading(true)
    setError(null)
    try {
      const result = await toggleBlogPostPublishStatusAction(id, currentStatus)
      setResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Blog Actions Example</h1>

      <div className="grid gap-8">
        {/* Fetch all posts */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Fetch Blog Posts</h2>
          <Button onClick={handleFetchPosts} disabled={loading}>
            Fetch All Posts
          </Button>
        </div>

        {/* Fetch single post */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Fetch Single Post</h2>
          <div className="flex gap-2">
            <Input 
              id="fetch-slug" 
              placeholder="Enter post slug"
              className="flex-1"
            />
            <Button 
              onClick={() => {
                const slug = (document.getElementById("fetch-slug") as HTMLInputElement).value
                handleFetchPost(slug)
              }} 
              disabled={loading}
            >
              Fetch Post
            </Button>
          </div>
        </div>

        {/* Create post form */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Create Blog Post</h2>
          <form onSubmit={handleCreatePost} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" required />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" name="content" rows={5} required />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea id="description" name="description" rows={2} />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="featuredImage">Featured Image URL (optional)</Label>
              <Input id="featuredImage" name="featuredImage" />
            </div>
            
            <div className="flex items-center gap-2">
              <Switch id="published" name="published" value="true" />
              <Label htmlFor="published">Published</Label>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input id="tags" name="tags" placeholder="tag1, tag2, tag3" />
            </div>
            
            <Button type="submit" disabled={loading}>Create Post</Button>
          </form>
        </div>

        {/* Update post form */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Update Blog Post</h2>
          <form onSubmit={handleUpdatePost} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="update-id">Post ID</Label>
              <Input id="update-id" name="id" required type="number" />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="update-title">Title</Label>
              <Input id="update-title" name="title" required />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="update-slug">Slug</Label>
              <Input id="update-slug" name="slug" required />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="update-content">Content</Label>
              <Textarea id="update-content" name="content" rows={5} required />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="update-description">Description (optional)</Label>
              <Textarea id="update-description" name="description" rows={2} />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="update-featuredImage">Featured Image URL (optional)</Label>
              <Input id="update-featuredImage" name="featuredImage" />
            </div>
            
            <div className="flex items-center gap-2">
              <Switch id="update-published" name="published" value="true" />
              <Label htmlFor="update-published">Published</Label>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="update-tags">Tags (comma separated)</Label>
              <Input id="update-tags" name="tags" placeholder="tag1, tag2, tag3" />
            </div>
            
            <Button type="submit" disabled={loading}>Update Post</Button>
          </form>
        </div>

        {/* Delete post */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Delete Blog Post</h2>
          <div className="flex gap-2">
            <Input 
              id="delete-id" 
              placeholder="Enter post ID"
              className="flex-1"
              type="number"
            />
            <Button 
              onClick={() => {
                const id = parseInt((document.getElementById("delete-id") as HTMLInputElement).value)
                handleDeletePost(id)
              }} 
              disabled={loading}
              variant="destructive"
            >
              Delete Post
            </Button>
          </div>
        </div>

        {/* Generate slug */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Generate Slug</h2>
          <div className="flex gap-2">
            <Input 
              id="generate-title" 
              placeholder="Enter post title"
              className="flex-1"
            />
            <Button 
              onClick={() => {
                const title = (document.getElementById("generate-title") as HTMLInputElement).value
                handleGenerateSlug(title)
              }} 
              disabled={loading}
            >
              Generate Slug
            </Button>
          </div>
        </div>

        {/* Toggle publish status */}
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Toggle Publish Status</h2>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Input 
                id="toggle-id" 
                placeholder="Enter post ID"
                className="flex-1"
                type="number"
              />
              <div className="flex items-center gap-2">
                <Switch id="toggle-status" />
                <Label htmlFor="toggle-status">Currently Published</Label>
              </div>
            </div>
            <Button 
              onClick={() => {
                const id = parseInt((document.getElementById("toggle-id") as HTMLInputElement).value)
                const currentStatus = (document.getElementById("toggle-status") as HTMLInputElement).checked
                handleTogglePublish(id, currentStatus)
              }} 
              disabled={loading}
            >
              Toggle Status
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
              <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
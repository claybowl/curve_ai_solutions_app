"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

import {
  getBlogPosts,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogTags
} from "@/lib/db-blog"
import { checkUserPermission } from "@/lib/db-permissions"
import type { BlogPostFilter, BlogPostFormData } from "@/types/blog"

// Validation schema for blog post form data
const blogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  description: z.string().optional(),
  featuredImage: z.string().optional(),
  published: z.boolean(),
  tags: z.array(z.string()).optional(),
})

/**
 * Check if the user is authorized to manage blog posts
 */
async function checkBlogAuthorization() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    throw new Error("Authentication required")
  }
  
  // Get user role from metadata
  const userRole = user.user_metadata?.role || user.app_metadata?.role
  
  // Check if user is admin (for backward compatibility)
  if (userRole === "admin") {
    return { authorized: true, userId: user.id }
  }
  
  // Check permissions
  const hasPermission = await checkUserPermission(user.id, "manage_blog")
  
  if (!hasPermission) {
    throw new Error("You don't have permission to manage blog posts")
  }

  return { authorized: true, userId: user.id }
}

/**
 * Get all blog posts with optional filtering
 */
export async function getPostsAction(filter?: BlogPostFilter) {
  return getBlogPostsAction(filter)
}

export async function getBlogPostsAction(filter?: BlogPostFilter) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // If filter includes published=false, check permissions
    if (filter?.published === false) {
      await checkBlogAuthorization()
    }
    
    // Get the posts
    return await getBlogPosts(filter)
  } catch (error) {
    console.error("Error in getBlogPostsAction:", error)
    throw new Error(`Failed to fetch blog posts: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Get a blog post by slug
 */
export async function getBlogPostBySlugAction(slug: string) {
  try {
    const post = await getBlogPostBySlug(slug)
    
    // If post is not published, check permissions
    if (post && !post.published) {
      await checkBlogAuthorization()
    }
    
    return post
  } catch (error) {
    console.error("Error in getBlogPostBySlugAction:", error)
    throw new Error(`Failed to fetch blog post: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Create a new blog post
 */
export async function createPostAction(formData: FormData) {
  return createBlogPostAction(formData)
}

export async function createBlogPostAction(formData: FormData) {
  try {
    // Check authorization
    const { authorized, userId } = await checkBlogAuthorization()
    
    // Parse form data
    const postData: BlogPostFormData = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      description: formData.get("description") as string || undefined,
      featuredImage: formData.get("featuredImage") as string || undefined,
      published: formData.get("published") === "true",
      tags: formData.getAll("tags").map(tag => tag as string),
    }
    
    // Validate data
    const validationResult = blogPostSchema.safeParse(postData)
    
    if (!validationResult.success) {
      const formatted = validationResult.error.format()
      throw new Error(`Validation error: ${JSON.stringify(formatted)}`)
    }
    
    // Create the post
    const postId = await createBlogPost(postData, userId)
    
    // Revalidate the blog pages
    revalidatePath("/blog")
    
    return { success: true, postId }
  } catch (error) {
    console.error("Error in createBlogPostAction:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Update an existing blog post
 */
export async function updatePostAction(id: number, formData: FormData) {
  return updateBlogPostAction(id, formData)
}

export async function updateBlogPostAction(id: number, formData: FormData) {
  try {
    // Check authorization
    const { authorized, userId } = await checkBlogAuthorization()
    
    // Parse form data
    const postData: BlogPostFormData = {
      title: formData.get("title") as string,
      slug: formData.get("slug") as string,
      content: formData.get("content") as string,
      description: formData.get("description") as string || undefined,
      featuredImage: formData.get("featuredImage") as string || undefined,
      published: formData.get("published") === "true",
      tags: formData.getAll("tags").map(tag => tag as string),
    }
    
    // Validate data
    const validationResult = blogPostSchema.safeParse(postData)
    
    if (!validationResult.success) {
      const formatted = validationResult.error.format()
      throw new Error(`Validation error: ${JSON.stringify(formatted)}`)
    }
    
    // Update the post
    const success = await updateBlogPost(id, postData, userId)
    
    if (!success) {
      throw new Error("Failed to update blog post. Post not found or you don't have permission to update it.")
    }
    
    // Revalidate the blog pages
    revalidatePath("/blog")
    revalidatePath(`/blog/${postData.slug}`)
    
    return { success: true }
  } catch (error) {
    console.error("Error in updateBlogPostAction:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Delete a blog post
 */
export async function deletePostAction(id: number) {
  return deleteBlogPostAction(id)
}

export async function deleteBlogPostAction(id: number) {
  try {
    // Check authorization
    const { authorized, userId } = await checkBlogAuthorization()
    
    // Delete the post
    const success = await deleteBlogPost(id, userId)
    
    if (!success) {
      throw new Error("Failed to delete blog post. Post not found or you don't have permission to delete it.")
    }
    
    // Revalidate the blog pages
    revalidatePath("/blog")
    
    return { success: true }
  } catch (error) {
    console.error("Error in deleteBlogPostAction:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

/**
 * Get blog tags
 */
export async function getBlogTagsAction(limit?: number) {
  try {
    return await getBlogTags(limit)
  } catch (error) {
    console.error("Error in getBlogTagsAction:", error)
    throw new Error(`Failed to fetch blog tags: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Generate a slug from a title
 */
export async function generateSlugAction(title: string) {
  // Convert to lowercase, replace spaces with hyphens, remove special characters
  const slug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return { slug }
}

/**
 * Sync posts from external source
 */
export async function syncPostsAction() {
  // Implementation for syncing posts
  return { success: true, message: "Sync functionality not implemented yet" }
}

/**
 * Publish or unpublish a blog post
 */
export async function toggleBlogPostPublishStatusAction(id: number, currentStatus: boolean) {
  try {
    // Check authorization
    const { authorized, userId } = await checkBlogAuthorization()
    
    // Check if user has publish permission
    const hasPublishPermission = await checkUserPermission(userId, "publish_blog")
    
    if (!hasPublishPermission && !currentStatus) {
      // If user doesn't have publish permission and is trying to publish, deny
      throw new Error("You don't have permission to publish blog posts")
    }
    
    // Get the current post
    const posts = await getBlogPosts({ authorId: userId })
    const post = posts.find(p => p.id === id)
    
    if (!post) {
      throw new Error("Blog post not found or you don't have permission to update it")
    }
    
    // Update just the published status
    const postData: BlogPostFormData = {
      title: post.title,
      slug: post.slug,
      content: "", // This is required by the schema but will be fetched from DB
      description: post.description,
      featuredImage: post.featuredImage,
      published: !currentStatus, // Toggle status
      tags: post.tags,
    }
    
    // Update only the published status (content will be fetched from DB)
    const success = await updateBlogPost(id, postData, userId)
    
    if (!success) {
      throw new Error("Failed to update blog post status")
    }
    
    // Revalidate paths
    revalidatePath("/blog")
    revalidatePath(`/blog/${post.slug}`)
    
    return { success: true, newStatus: !currentStatus }
  } catch (error) {
    console.error("Error in toggleBlogPostPublishStatusAction:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}
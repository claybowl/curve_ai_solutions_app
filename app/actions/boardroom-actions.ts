"use server"

/**
 * Server Actions for Board Room (Social Lounge)
 * 
 * Handles posts, likes, and presence in the community waiting room.
 */

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getCurrentUserServer, isUserAdmin } from "@/lib/supabase-server"
import { sql } from "@/lib/db"
import type { 
  BoardRoomPost, 
  BoardRoomPostWithAuthor,
  CreateBoardRoomPostInput 
} from "@/types/consultations"

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

const createPostSchema = z.object({
  content: z.string().min(1).max(2000),
  content_type: z.enum(["text", "announcement", "question", "tip"]).optional(),
  reply_to_id: z.string().uuid().optional(),
})

const getPostsSchema = z.object({
  limit: z.number().min(1).max(50).optional(),
  offset: z.number().min(0).optional(),
  include_replies: z.boolean().optional(),
})

// =============================================================================
// POST ACTIONS
// =============================================================================

/**
 * Create a new post in the Board Room
 */
export async function createBoardRoomPost(
  input: CreateBoardRoomPostInput
): Promise<{
  success: boolean
  post?: BoardRoomPost
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const validated = createPostSchema.parse(input)

    // Calculate thread depth if this is a reply
    let threadDepth = 0
    if (validated.reply_to_id) {
      const parentResult = await sql.query(
        `SELECT thread_depth FROM board_room_posts WHERE id = $1`,
        [validated.reply_to_id]
      )
      if (parentResult && parentResult.length > 0) {
        threadDepth = (parentResult[0].thread_depth ?? 0) + 1
      }
    }

    // Only admins can create announcements
    if (validated.content_type === "announcement") {
      const admin = await isUserAdmin()
      if (!admin) {
        return { success: false, error: "Only admins can create announcements" }
      }
    }

    const result = await sql.query(
      `INSERT INTO board_room_posts (
        author_id,
        content,
        content_type,
        reply_to_id,
        thread_depth
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        user.id,
        validated.content,
        validated.content_type ?? "text",
        validated.reply_to_id ?? null,
        threadDepth,
      ]
    )

    revalidatePath("/board-room")

    return {
      success: true,
      post: result[0] as BoardRoomPost,
    }
  } catch (error) {
    console.error("Error creating post:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create post",
    }
  }
}

/**
 * Get posts for the Board Room
 */
export async function getBoardRoomPosts(
  options?: z.infer<typeof getPostsSchema>
): Promise<{
  success: boolean
  posts?: BoardRoomPostWithAuthor[]
  hasMore?: boolean
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const validated = getPostsSchema.parse(options ?? {})
    const limit = validated.limit ?? 20
    const offset = validated.offset ?? 0
    const includeReplies = validated.include_replies ?? false

    // Build query - get top-level posts first
    let query = `
      SELECT 
        p.*,
        prof.first_name,
        prof.last_name,
        prof.email,
        prof.avatar_url,
        EXISTS(
          SELECT 1 FROM board_room_post_likes 
          WHERE post_id = p.id AND user_id = $1
        ) as user_has_liked
      FROM board_room_posts p
      LEFT JOIN profiles prof ON p.author_id = prof.user_id
      WHERE p.is_hidden = false
    `

    if (!includeReplies) {
      query += ` AND p.reply_to_id IS NULL`
    }

    query += `
      ORDER BY p.is_pinned DESC, p.created_at DESC
      LIMIT $2 OFFSET $3
    `

    const result = await sql.query(query, [user.id, limit + 1, offset])

    const hasMore = result && result.length > limit
    const posts = (result || []).slice(0, limit).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      author_id: row.author_id as string,
      content: row.content as string,
      content_type: row.content_type as BoardRoomPost["content_type"],
      reply_to_id: row.reply_to_id as string | undefined,
      thread_depth: row.thread_depth as number,
      like_count: row.like_count as number,
      reply_count: row.reply_count as number,
      is_pinned: row.is_pinned as boolean,
      is_hidden: row.is_hidden as boolean,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      expires_at: row.expires_at as string,
      author: {
        id: row.author_id as string,
        first_name: row.first_name as string | undefined,
        last_name: row.last_name as string | undefined,
        email: row.email as string,
        avatar_url: row.avatar_url as string | undefined,
      },
      user_has_liked: row.user_has_liked as boolean,
    })) as BoardRoomPostWithAuthor[]

    return {
      success: true,
      posts,
      hasMore,
    }
  } catch (error) {
    console.error("Error getting posts:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get posts",
    }
  }
}

/**
 * Get replies to a specific post
 */
export async function getPostReplies(
  postId: string
): Promise<{
  success: boolean
  replies?: BoardRoomPostWithAuthor[]
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const result = await sql.query(
      `SELECT 
        p.*,
        prof.first_name,
        prof.last_name,
        prof.email,
        prof.avatar_url,
        EXISTS(
          SELECT 1 FROM board_room_post_likes 
          WHERE post_id = p.id AND user_id = $1
        ) as user_has_liked
      FROM board_room_posts p
      LEFT JOIN profiles prof ON p.author_id = prof.user_id
      WHERE p.reply_to_id = $2 AND p.is_hidden = false
      ORDER BY p.created_at ASC`,
      [user.id, postId]
    )

    const replies = (result || []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      author_id: row.author_id as string,
      content: row.content as string,
      content_type: row.content_type as BoardRoomPost["content_type"],
      reply_to_id: row.reply_to_id as string | undefined,
      thread_depth: row.thread_depth as number,
      like_count: row.like_count as number,
      reply_count: row.reply_count as number,
      is_pinned: row.is_pinned as boolean,
      is_hidden: row.is_hidden as boolean,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      expires_at: row.expires_at as string,
      author: {
        id: row.author_id as string,
        first_name: row.first_name as string | undefined,
        last_name: row.last_name as string | undefined,
        email: row.email as string,
        avatar_url: row.avatar_url as string | undefined,
      },
      user_has_liked: row.user_has_liked as boolean,
    })) as BoardRoomPostWithAuthor[]

    return {
      success: true,
      replies,
    }
  } catch (error) {
    console.error("Error getting replies:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get replies",
    }
  }
}

/**
 * Toggle like on a post
 */
export async function togglePostLike(
  postId: string
): Promise<{
  success: boolean
  liked?: boolean
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Check if already liked
    const existing = await sql.query(
      `SELECT id FROM board_room_post_likes WHERE post_id = $1 AND user_id = $2`,
      [postId, user.id]
    )

    if (existing && existing.length > 0) {
      // Unlike
      await sql.query(
        `DELETE FROM board_room_post_likes WHERE post_id = $1 AND user_id = $2`,
        [postId, user.id]
      )
      return { success: true, liked: false }
    } else {
      // Like
      await sql.query(
        `INSERT INTO board_room_post_likes (post_id, user_id) VALUES ($1, $2)`,
        [postId, user.id]
      )
      return { success: true, liked: true }
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle like",
    }
  }
}

/**
 * Delete a post (author or admin only)
 */
export async function deleteBoardRoomPost(
  postId: string
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    // Check ownership
    const post = await sql.query(
      `SELECT author_id FROM board_room_posts WHERE id = $1`,
      [postId]
    )

    if (!post || post.length === 0) {
      return { success: false, error: "Post not found" }
    }

    const isAdmin = await isUserAdmin()
    if (post[0].author_id !== user.id && !isAdmin) {
      return { success: false, error: "Can only delete your own posts" }
    }

    await sql.query(`DELETE FROM board_room_posts WHERE id = $1`, [postId])

    revalidatePath("/board-room")

    return { success: true }
  } catch (error) {
    console.error("Error deleting post:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete post",
    }
  }
}

/**
 * Pin/unpin a post (admin only)
 */
export async function togglePostPin(
  postId: string
): Promise<{
  success: boolean
  pinned?: boolean
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const isAdmin = await isUserAdmin()
    if (!isAdmin) {
      return { success: false, error: "Admin access required" }
    }

    const post = await sql.query(
      `SELECT is_pinned FROM board_room_posts WHERE id = $1`,
      [postId]
    )

    if (!post || post.length === 0) {
      return { success: false, error: "Post not found" }
    }

    const newPinned = !post[0].is_pinned
    await sql.query(
      `UPDATE board_room_posts SET is_pinned = $1 WHERE id = $2`,
      [newPinned, postId]
    )

    revalidatePath("/board-room")

    return { success: true, pinned: newPinned }
  } catch (error) {
    console.error("Error toggling pin:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle pin",
    }
  }
}

/**
 * Hide a post (admin only - for moderation)
 */
export async function hidePost(
  postId: string,
  reason: string
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const isAdmin = await isUserAdmin()
    if (!isAdmin) {
      return { success: false, error: "Admin access required" }
    }

    await sql.query(
      `UPDATE board_room_posts 
       SET is_hidden = true, hidden_reason = $1, hidden_by = $2 
       WHERE id = $3`,
      [reason, user.id, postId]
    )

    revalidatePath("/board-room")

    return { success: true }
  } catch (error) {
    console.error("Error hiding post:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to hide post",
    }
  }
}

/**
 * Get pinned posts
 */
export async function getPinnedPosts(): Promise<{
  success: boolean
  posts?: BoardRoomPostWithAuthor[]
  error?: string
}> {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return { success: false, error: "Authentication required" }
    }

    const result = await sql.query(
      `SELECT 
        p.*,
        prof.first_name,
        prof.last_name,
        prof.email,
        prof.avatar_url,
        EXISTS(
          SELECT 1 FROM board_room_post_likes 
          WHERE post_id = p.id AND user_id = $1
        ) as user_has_liked
      FROM board_room_posts p
      LEFT JOIN profiles prof ON p.author_id = prof.user_id
      WHERE p.is_pinned = true AND p.is_hidden = false
      ORDER BY p.created_at DESC`,
      [user.id]
    )

    const posts = (result || []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      author_id: row.author_id as string,
      content: row.content as string,
      content_type: row.content_type as BoardRoomPost["content_type"],
      reply_to_id: row.reply_to_id as string | undefined,
      thread_depth: row.thread_depth as number,
      like_count: row.like_count as number,
      reply_count: row.reply_count as number,
      is_pinned: row.is_pinned as boolean,
      is_hidden: row.is_hidden as boolean,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
      expires_at: row.expires_at as string,
      author: {
        id: row.author_id as string,
        first_name: row.first_name as string | undefined,
        last_name: row.last_name as string | undefined,
        email: row.email as string,
        avatar_url: row.avatar_url as string | undefined,
      },
      user_has_liked: row.user_has_liked as boolean,
    })) as BoardRoomPostWithAuthor[]

    return { success: true, posts }
  } catch (error) {
    console.error("Error getting pinned posts:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get pinned posts",
    }
  }
}

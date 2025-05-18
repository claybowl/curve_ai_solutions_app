/**
 * Database functions for blog posts
 */
import { sql } from './db';
import type { BlogPost, BlogPostSummary, BlogPostFilter, BlogPostFormData } from '@/types/blog';

/**
 * Get all blog posts with optional filtering
 */
export async function getBlogPosts(filter?: BlogPostFilter): Promise<BlogPostSummary[]> {
  try {
    let query = `
      SELECT 
        b.id, b.title, b.slug, b.description, b.featured_image as "featuredImage",
        b.published, b.tags, b.view_count as "viewCount", b.published_at as "publishedAt",
        CONCAT(u.first_name, ' ', u.last_name) as "authorName"
      FROM blog_posts b
      LEFT JOIN users u ON b.author_id = u.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 1;
    
    // Apply filters
    if (filter?.published !== undefined) {
      query += ` AND b.published = $${paramCount++}`;
      params.push(filter.published);
    }
    
    if (filter?.authorId) {
      query += ` AND b.author_id = $${paramCount++}`;
      params.push(filter.authorId);
    }
    
    if (filter?.tag) {
      query += ` AND $${paramCount++} = ANY(b.tags)`;
      params.push(filter.tag);
    }
    
    // Apply sorting
    const sortField = filter?.sortBy || 'published_at';
    const sortDirection = filter?.sortDirection || 'desc';
    const sortColumns: Record<string, string> = {
      'publishedAt': 'published_at',
      'viewCount': 'view_count',
      'createdAt': 'created_at'
    };
    
    query += ` ORDER BY b.${sortColumns[sortField] || sortField} ${sortDirection === 'asc' ? 'ASC' : 'DESC'}`;
    
    // Apply limit and offset
    if (filter?.limit) {
      query += ` LIMIT $${paramCount++}`;
      params.push(filter.limit);
      
      if (filter?.offset) {
        query += ` OFFSET $${paramCount++}`;
        params.push(filter.offset);
      }
    }
    
    const result = await sql.query(query, params);
    return result as BlogPostSummary[];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const query = `
      SELECT 
        b.id, b.title, b.slug, b.content, b.description,
        b.featured_image as "featuredImage", b.published,
        b.author_id as "authorId", b.notion_page_id as "notionPageId",
        b.tags, b.view_count as "viewCount",
        b.created_at as "createdAt", b.updated_at as "updatedAt",
        b.published_at as "publishedAt"
      FROM blog_posts b
      WHERE b.slug = $1
    `;
    
    const result = await sql.query(query, [slug]);
    
    if (result.length === 0) {
      return null;
    }
    
    // Increment view count
    await sql.query(
      'UPDATE blog_posts SET view_count = view_count + 1 WHERE id = $1',
      [result[0].id]
    );
    
    return result[0] as BlogPost;
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error);
    throw error;
  }
}

/**
 * Create a new blog post
 */
export async function createBlogPost(
  post: BlogPostFormData,
  authorId: number
): Promise<number> {
  try {
    const query = `
      INSERT INTO blog_posts (
        title, slug, content, description, featured_image,
        published, author_id, tags,
        published_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9
      ) RETURNING id
    `;
    
    const publishedAt = post.published ? new Date() : null;
    
    const result = await sql.query(query, [
      post.title,
      post.slug,
      post.content,
      post.description || null,
      post.featuredImage || null,
      post.published,
      authorId,
      post.tags || [],
      publishedAt
    ]);
    
    return result[0].id;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
}

/**
 * Update an existing blog post
 */
export async function updateBlogPost(
  id: number,
  post: BlogPostFormData,
  authorId: number
): Promise<boolean> {
  try {
    // Get current post status
    const currentPost = await sql.query(
      'SELECT published, published_at FROM blog_posts WHERE id = $1',
      [id]
    );
    
    if (currentPost.length === 0) {
      return false;
    }
    
    // Determine if we need to set published_at (when publishing for first time)
    let publishedAt = currentPost[0].published_at;
    if (!currentPost[0].published && post.published) {
      publishedAt = new Date();
    }
    
    const query = `
      UPDATE blog_posts
      SET 
        title = $1,
        slug = $2,
        content = $3,
        description = $4,
        featured_image = $5,
        published = $6,
        tags = $7,
        updated_at = CURRENT_TIMESTAMP,
        published_at = $8
      WHERE id = $9 AND author_id = $10
      RETURNING id
    `;
    
    const result = await sql.query(query, [
      post.title,
      post.slug,
      post.content,
      post.description || null,
      post.featuredImage || null,
      post.published,
      post.tags || [],
      publishedAt,
      id,
      authorId
    ]);
    
    return result.length > 0;
  } catch (error) {
    console.error(`Error updating blog post ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a blog post
 */
export async function deleteBlogPost(id: number, authorId: number): Promise<boolean> {
  try {
    const result = await sql.query(
      'DELETE FROM blog_posts WHERE id = $1 AND author_id = $2 RETURNING id',
      [id, authorId]
    );
    
    return result.length > 0;
  } catch (error) {
    console.error(`Error deleting blog post ${id}:`, error);
    throw error;
  }
}

/**
 * Get popular blog tags
 */
export async function getBlogTags(limit = 10): Promise<{tag: string, count: number}[]> {
  try {
    const query = `
      SELECT unnest(tags) as tag, count(*) as count
      FROM blog_posts
      WHERE published = true
      GROUP BY tag
      ORDER BY count DESC
      LIMIT $1
    `;
    
    return await sql.query(query, [limit]);
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    throw error;
  }
}
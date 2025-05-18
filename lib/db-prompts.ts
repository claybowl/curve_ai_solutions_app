/**
 * Database functions for prompt library
 */
import { sql } from './db';
import type { 
  Prompt, 
  PromptSummary, 
  PromptFilter, 
  PromptFormData,
  SavedPrompt
} from '@/types/prompts';

/**
 * Get all prompts with optional filtering
 */
export async function getPrompts(filter?: PromptFilter): Promise<PromptSummary[]> {
  try {
    let query = `
      SELECT 
        p.id, p.title, p.description, p.category,
        p.tags, p.is_public as "isPublic", p.is_featured as "isFeatured",
        p.usage_count as "usageCount", p.version,
        CONCAT(u.first_name, ' ', u.last_name) as "authorName"
      FROM prompts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 1;
    
    // Apply filters
    if (filter?.isPublic !== undefined) {
      query += ` AND p.is_public = $${paramCount++}`;
      params.push(filter.isPublic);
    }
    
    if (filter?.isFeatured !== undefined) {
      query += ` AND p.is_featured = $${paramCount++}`;
      params.push(filter.isFeatured);
    }
    
    if (filter?.authorId) {
      query += ` AND p.author_id = $${paramCount++}`;
      params.push(filter.authorId);
    }
    
    if (filter?.category) {
      query += ` AND p.category = $${paramCount++}`;
      params.push(filter.category);
    }
    
    if (filter?.tag) {
      query += ` AND $${paramCount++} = ANY(p.tags)`;
      params.push(filter.tag);
    }
    
    // Apply sorting
    const sortField = filter?.sortBy || 'usageCount';
    const sortDirection = filter?.sortDirection || 'desc';
    const sortColumns: Record<string, string> = {
      'usageCount': 'usage_count',
      'createdAt': 'created_at',
      'title': 'title'
    };
    
    query += ` ORDER BY p.${sortColumns[sortField] || sortField} ${sortDirection === 'asc' ? 'ASC' : 'DESC'}`;
    
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
    return result as PromptSummary[];
  } catch (error) {
    console.error('Error fetching prompts:', error);
    throw error;
  }
}

/**
 * Get a single prompt by ID
 */
export async function getPromptById(id: number): Promise<Prompt | null> {
  try {
    const query = `
      SELECT 
        id, title, description, content, category,
        tags, is_public as "isPublic", is_featured as "isFeatured",
        author_id as "authorId", version, usage_count as "usageCount",
        created_at as "createdAt", updated_at as "updatedAt"
      FROM prompts
      WHERE id = $1
    `;
    
    const result = await sql.query(query, [id]);
    
    if (result.length === 0) {
      return null;
    }
    
    // Increment usage count
    await sql.query(
      'UPDATE prompts SET usage_count = usage_count + 1 WHERE id = $1',
      [id]
    );
    
    return result[0] as Prompt;
  } catch (error) {
    console.error(`Error fetching prompt with id ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new prompt
 */
export async function createPrompt(
  prompt: PromptFormData,
  authorId: number
): Promise<number> {
  try {
    const query = `
      INSERT INTO prompts (
        title, description, content, category,
        tags, is_public, is_featured, author_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      ) RETURNING id
    `;
    
    const result = await sql.query(query, [
      prompt.title,
      prompt.description || null,
      prompt.content,
      prompt.category,
      prompt.tags || [],
      prompt.isPublic,
      prompt.isFeatured || false,
      authorId
    ]);
    
    return result[0].id;
  } catch (error) {
    console.error('Error creating prompt:', error);
    throw error;
  }
}

/**
 * Update an existing prompt
 */
export async function updatePrompt(
  id: number,
  prompt: PromptFormData,
  authorId: number
): Promise<boolean> {
  try {
    const query = `
      UPDATE prompts
      SET 
        title = $1,
        description = $2,
        content = $3,
        category = $4,
        tags = $5,
        is_public = $6,
        is_featured = $7,
        version = version + 1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $8 AND author_id = $9
      RETURNING id
    `;
    
    const result = await sql.query(query, [
      prompt.title,
      prompt.description || null,
      prompt.content,
      prompt.category,
      prompt.tags || [],
      prompt.isPublic,
      prompt.isFeatured || false,
      id,
      authorId
    ]);
    
    return result.length > 0;
  } catch (error) {
    console.error(`Error updating prompt ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a prompt
 */
export async function deletePrompt(id: number, authorId: number): Promise<boolean> {
  try {
    // First delete any saved references to this prompt
    await sql.query(
      'DELETE FROM user_saved_prompts WHERE prompt_id = $1',
      [id]
    );
    
    // Then delete the prompt itself
    const result = await sql.query(
      'DELETE FROM prompts WHERE id = $1 AND author_id = $2 RETURNING id',
      [id, authorId]
    );
    
    return result.length > 0;
  } catch (error) {
    console.error(`Error deleting prompt ${id}:`, error);
    throw error;
  }
}

/**
 * Get all prompt categories
 */
export async function getPromptCategories(): Promise<{category: string, count: number}[]> {
  try {
    const query = `
      SELECT category, COUNT(*) as count
      FROM prompts
      WHERE is_public = true
      GROUP BY category
      ORDER BY count DESC
    `;
    
    return await sql.query(query);
  } catch (error) {
    console.error('Error fetching prompt categories:', error);
    throw error;
  }
}

/**
 * Save a prompt for a user
 */
export async function savePromptForUser(promptId: number, userId: number): Promise<boolean> {
  try {
    await sql.query(
      'INSERT INTO user_saved_prompts (user_id, prompt_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, promptId]
    );
    return true;
  } catch (error) {
    console.error(`Error saving prompt ${promptId} for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Remove a saved prompt for a user
 */
export async function removeSavedPrompt(promptId: number, userId: number): Promise<boolean> {
  try {
    const result = await sql.query(
      'DELETE FROM user_saved_prompts WHERE prompt_id = $1 AND user_id = $2 RETURNING id',
      [promptId, userId]
    );
    return result.length > 0;
  } catch (error) {
    console.error(`Error removing saved prompt ${promptId} for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Get saved prompts for a user
 */
export async function getUserSavedPrompts(userId: number): Promise<SavedPrompt[]> {
  try {
    const query = `
      SELECT 
        usp.id, usp.user_id as "userId", usp.prompt_id as "promptId", 
        usp.created_at as "createdAt",
        p.title, p.description, p.category, p.tags, 
        p.is_public as "isPublic", p.is_featured as "isFeatured",
        p.version, p.usage_count as "usageCount"
      FROM user_saved_prompts usp
      JOIN prompts p ON usp.prompt_id = p.id
      WHERE usp.user_id = $1
      ORDER BY usp.created_at DESC
    `;
    
    const results = await sql.query(query, [userId]);
    
    return results.map(row => ({
      id: row.id,
      userId: row.userId,
      promptId: row.promptId,
      createdAt: row.createdAt,
      prompt: {
        id: row.promptId,
        title: row.title,
        description: row.description,
        category: row.category,
        tags: row.tags,
        isPublic: row.isPublic,
        isFeatured: row.isFeatured,
        version: row.version,
        usageCount: row.usageCount,
        authorId: 0, // Not needed for saved prompts display
        content: '', // Content is loaded separately when needed
        createdAt: new Date(),
        updatedAt: new Date()
      }
    }));
  } catch (error) {
    console.error(`Error getting saved prompts for user ${userId}:`, error);
    throw error;
  }
}
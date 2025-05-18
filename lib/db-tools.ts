/**
 * Database functions for AI tools
 */
import { sql } from './db';
import type { 
  AiTool, 
  AiToolSummary, 
  AiToolFormData,
  AiToolFilter,
  AiToolCategory
} from '@/types/tools';

/**
 * Get all AI tools
 */
export async function getAllTools(filter?: AiToolFilter): Promise<AiToolSummary[]> {
  try {
    let query = `
      SELECT 
        id, name, description, icon_name as "iconName",
        category, is_active as "isActive"
      FROM ai_tools
      WHERE 1=1
    `;
    
    const params: any[] = [];
    let paramCount = 1;
    
    // Apply filters
    if (filter?.isActive !== undefined) {
      query += ` AND is_active = $${paramCount++}`;
      params.push(filter.isActive);
    }
    
    if (filter?.category) {
      query += ` AND category = $${paramCount++}`;
      params.push(filter.category);
    }
    
    if (filter?.createdBy) {
      query += ` AND created_by = $${paramCount++}`;
      params.push(filter.createdBy);
    }
    
    if (filter?.searchTerm) {
      query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${filter.searchTerm}%`);
      paramCount++;
    }
    
    query += ` ORDER BY name ASC`;
    
    return await sql.query(query, params);
  } catch (error) {
    console.error('Error fetching AI tools:', error);
    throw error;
  }
}

/**
 * Get a single AI tool by ID
 */
export async function getToolById(id: number): Promise<AiTool | null> {
  try {
    const query = `
      SELECT 
        id, name, description, api_endpoint as "apiEndpoint",
        icon_name as "iconName", category, is_active as "isActive",
        created_by as "createdBy", created_at as "createdAt",
        updated_at as "updatedAt"
      FROM ai_tools
      WHERE id = $1
    `;
    
    const result = await sql.query(query, [id]);
    
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(`Error fetching AI tool with id ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new AI tool
 */
export async function createTool(
  tool: AiToolFormData,
  createdBy?: number
): Promise<number> {
  try {
    const query = `
      INSERT INTO ai_tools (
        name, description, api_endpoint, icon_name,
        category, is_active, created_by
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      ) RETURNING id
    `;
    
    const result = await sql.query(query, [
      tool.name,
      tool.description,
      tool.apiEndpoint || null,
      tool.iconName || null,
      tool.category || null,
      tool.isActive,
      createdBy || null
    ]);
    
    return result[0].id;
  } catch (error) {
    console.error('Error creating AI tool:', error);
    throw error;
  }
}

/**
 * Update an existing AI tool
 */
export async function updateTool(id: number, tool: AiToolFormData): Promise<boolean> {
  try {
    const query = `
      UPDATE ai_tools
      SET 
        name = $1,
        description = $2,
        api_endpoint = $3,
        icon_name = $4,
        category = $5,
        is_active = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING id
    `;
    
    const result = await sql.query(query, [
      tool.name,
      tool.description,
      tool.apiEndpoint || null,
      tool.iconName || null,
      tool.category || null,
      tool.isActive,
      id
    ]);
    
    return result.length > 0;
  } catch (error) {
    console.error(`Error updating AI tool ${id}:`, error);
    throw error;
  }
}

/**
 * Delete an AI tool
 */
export async function deleteTool(id: number): Promise<boolean> {
  try {
    const result = await sql.query(
      'DELETE FROM ai_tools WHERE id = $1 RETURNING id',
      [id]
    );
    
    return result.length > 0;
  } catch (error) {
    console.error(`Error deleting AI tool ${id}:`, error);
    throw error;
  }
}

/**
 * Get tool categories
 */
export async function getToolCategories(): Promise<AiToolCategory[]> {
  try {
    // Define categories
    const categories: AiToolCategory[] = [
      {
        id: "agent-development",
        name: "AI Agent Development",
        description: "Designing and deploying custom autonomous agents capable of complex, cross-platform automation with flexible, high-capacity agent infrastructure.",
        pattern: ["Agent", "Decision Engine"],
        color: "bg-blue-500",
        icon: "Bot",
        tools: []
      },
      {
        id: "data-visualization",
        name: "Data Visualization Suite",
        description: "Delivering actionable insights through advanced visual storytelling and analytical tools.",
        pattern: ["DataLens", "VizFlow", "InsightBoard", "Narrative"],
        color: "bg-purple-500",
        icon: "BarChart",
        tools: []
      },
      {
        id: "trading-systems",
        name: "Trading System Tools",
        description: "Advanced AI and algorithmic trading infrastructure for high-performance financial strategies.",
        pattern: ["Trade", "Market", "Strategy"],
        color: "bg-green-500",
        icon: "LineChart",
        tools: []
      },
      {
        id: "n8n-integration",
        name: "n8n Integration Tools",
        description: "Enhancing automation by embedding AI into custom and existing n8n workflows.",
        pattern: ["n8n"],
        color: "bg-orange-500",
        icon: "Workflow",
        tools: []
      },
      {
        id: "low-code",
        name: "Low-Code AI Development",
        description: "Simplified AI development through intuitive, visual interfaces and automation-first architecture.",
        pattern: ["Canvas", "Composer", "AutoAI", "BusinessLogic"],
        color: "bg-teal-500",
        icon: "Code",
        tools: []
      }
    ];
    
    // Get all tools
    const tools = await getAllTools({ isActive: true });
    
    // Categorize tools
    for (const tool of tools) {
      // Find matching category
      let matched = false;
      
      for (const category of categories) {
        for (const pattern of category.pattern) {
          if (tool.name.includes(pattern) || 
              (tool.category && tool.category === category.id)) {
            category.tools.push(tool);
            matched = true;
            break;
          }
        }
        
        if (matched) break;
      }
      
      // If no category matched, add to the first category
      if (!matched) {
        categories[0].tools.push(tool);
      }
    }
    
    // Only return categories that have tools
    return categories.filter(category => category.tools.length > 0);
  } catch (error) {
    console.error('Error categorizing tools:', error);
    throw error;
  }
}

/**
 * Get recommended tools based on user profile or assessment
 */
export async function getRecommendedTools(userId?: number, assessmentId?: number): Promise<AiToolSummary[]> {
  try {
    // This is a simple implementation that returns random tools
    // In a real implementation, you would use user data to recommend specific tools
    const query = `
      SELECT 
        id, name, description, icon_name as "iconName",
        category, is_active as "isActive"
      FROM ai_tools
      WHERE is_active = true
      ORDER BY RANDOM()
      LIMIT 3
    `;
    
    return await sql.query(query);
  } catch (error) {
    console.error('Error fetching recommended tools:', error);
    throw error;
  }
}
"use server"

/**
 * Roadmap Actions
 * 
 * Fetches roadmap data from Notion and attached files.
 * Configure NOTION_API_KEY and NOTION_ROADMAP_DATABASE_ID to enable.
 */

import { sql } from "@/lib/db"

export interface RoadmapMilestone {
  id: string
  title: string
  description: string
  quarter: string
  status: "completed" | "in_progress" | "planned"
  category: string
  files?: RoadmapFile[]
  created_at: string
  updated_at: string
}

export interface RoadmapFile {
  id: string
  name: string
  url: string
  type: string
  size: number
}

// =============================================================================
// NOTION INTEGRATION
// =============================================================================

/**
 * Fetch milestones from Notion database
 * Requires: NOTION_API_KEY and NOTION_ROADMAP_DATABASE_ID environment variables
 */
export async function getNotionMilestones(): Promise<{
  success: boolean
  milestones?: RoadmapMilestone[]
  error?: string
}> {
  const apiKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_ROADMAP_DATABASE_ID

  if (!apiKey || !databaseId) {
    return {
      success: false,
      error: "Notion credentials not configured. Set NOTION_API_KEY and NOTION_ROADMAP_DATABASE_ID."
    }
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sorts: [
          { property: "Quarter", direction: "ascending" }
        ]
      })
    })

    if (!response.ok) {
      return { success: false, error: `Notion API error: ${response.statusText}` }
    }

    const data = await response.json()

    const milestones: RoadmapMilestone[] = data.results.map((page: any) => {
      const props = page.properties
      return {
        id: page.id,
        title: props.Title?.title?.[0]?.plain_text || "Untitled",
        description: props.Description?.rich_text?.[0]?.plain_text || "",
        quarter: props.Quarter?.select?.name || "TBD",
        status: mapNotionStatus(props.Status?.select?.name),
        category: props.Category?.select?.name || "General",
        files: [], // Would need separate API call to get page files
        created_at: page.created_time,
        updated_at: page.last_edited_time,
      }
    })

    return { success: true, milestones }

  } catch (error) {
    console.error("Error fetching Notion milestones:", error)
    return { success: false, error: "Failed to fetch roadmap from Notion" }
  }
}

function mapNotionStatus(status: string | undefined): RoadmapMilestone["status"] {
  switch (status?.toLowerCase()) {
    case "done":
    case "complete":
    case "completed":
      return "completed"
    case "in progress":
    case "in_progress":
      return "in_progress"
    default:
      return "planned"
  }
}

// =============================================================================
// LOCAL DATABASE FALLBACK
// =============================================================================

/**
 * Get roadmap milestones from local database (fallback)
 */
export async function getLocalMilestones(): Promise<{
  success: boolean
  milestones?: RoadmapMilestone[]
  error?: string
}> {
  try {
    const result = await sql.query(`
      SELECT 
        id,
        title,
        description,
        quarter,
        status,
        category,
        created_at,
        updated_at
      FROM roadmap_milestones
      ORDER BY quarter ASC, created_at ASC
    `)

    const milestones = result.rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description || "",
      quarter: row.quarter || "TBD",
      status: row.status as RoadmapMilestone["status"],
      category: row.category || "General",
      files: [],
      created_at: row.created_at,
      updated_at: row.updated_at,
    }))

    return { success: true, milestones }

  } catch (error) {
    console.error("Error fetching local milestones:", error)
    return { success: false, error: "Failed to fetch milestones from database" }
  }
}

/**
 * Get combined roadmap data (Notion first, fall back to local)
 */
export async function getRoadmapMilestones(): Promise<{
  success: boolean
  milestones?: RoadmapMilestone[]
  source: "notion" | "local" | "demo"
  error?: string
}> {
  // Try Notion first if configured
  const notionResult = await getNotionMilestones()
  
  if (notionResult.success && notionResult.milestones && notionResult.milestones.length > 0) {
    return { success: true, milestones: notionResult.milestones, source: "notion" }
  }

  // Fall back to local database
  const localResult = await getLocalMilestones()
  
  if (localResult.success && localResult.milestones && localResult.milestones.length > 0) {
    return { success: true, milestones: localResult.milestones, source: "local" }
  }

  // Return demo milestones
  return {
    success: true,
    source: "demo",
    milestones: getDemoMilestones()
  }
}

function getDemoMilestones(): RoadmapMilestone[] {
  return [
    {
      id: "demo-1",
      title: "Core Infrastructure",
      description: "Deploy Basalt-X kernel with sub-ms latency for regional enterprise clusters.",
      quarter: "Q1 2024",
      status: "completed",
      category: "Infrastructure",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "demo-2",
      title: "Neural Canopy UI",
      description: "Adaptive visual feedback systems that react to real-time data flow.",
      quarter: "Q3 2024",
      status: "completed",
      category: "Product",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "demo-3",
      title: "Autonomous Dispatch",
      description: "Decentralized task management with automated service routing.",
      quarter: "Q4 2024",
      status: "in_progress",
      category: "Automation",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "demo-4",
      title: "Bioluminescent Analytics",
      description: "Real-time data visualization with adaptive UI components.",
      quarter: "Q1 2025",
      status: "in_progress",
      category: "Analytics",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "demo-5",
      title: "Singularity Peak",
      description: "Full AI autonomy with predictive decision-making capabilities.",
      quarter: "Q2 2025",
      status: "planned",
      category: "AI/ML",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ]
}

// =============================================================================
// FILE ATTACHMENTS
// =============================================================================

/**
 * Get files attached to a milestone
 */
export async function getMilestoneFiles(milestoneId: string): Promise<{
  success: boolean
  files?: RoadmapFile[]
  error?: string
}> {
  // This would integrate with Notion's file attachments or local file storage
  return { success: true, files: [] }
}

/**
 * Get all roadmap-related files (for download section)
 */
export async function getRoadmapFiles(): Promise<{
  success: boolean
  files?: RoadmapFile[]
  error?: string
}> {
  try {
    const result = await sql.query(`
      SELECT id, name, url, file_type, file_size, created_at
      FROM roadmap_files
      ORDER BY created_at DESC
    `)

    const files = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      url: row.url,
      type: row.file_type,
      size: row.file_size,
    }))

    return { success: true, files }

  } catch (error) {
    console.error("Error fetching roadmap files:", error)
    return { success: false, error: "Failed to fetch files" }
  }
}
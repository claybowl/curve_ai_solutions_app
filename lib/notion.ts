import { Client } from "@notionhq/client"
import { NotionAPI } from "notion-client"
import { cache } from "react"

// For debugging
const debugNotion = (message: string, ...args: any[]) => {
  console.log(`[NOTION DEBUG] ${message}`, ...args)
}

// Create Notion client for official API
let notion: Client
try {
  if (!process.env.NOTION_TOKEN) {
    throw new Error("NOTION_TOKEN is not defined")
  }
  
  debugNotion("Initializing Notion client with token")
  notion = new Client({
    auth: process.env.NOTION_TOKEN,
  })
  
  // Verify the client has necessary methods
  if (!notion.databases || typeof notion.databases.query !== 'function') {
    throw new Error("Notion client is missing required methods")
  }
  
  debugNotion("Notion client initialized successfully")
} catch (error) {
  console.error("[NOTION ERROR] Failed to initialize Notion client:", error)
  // Create a minimal client with dummy methods to prevent runtime errors
  notion = {
    databases: {
      query: async () => ({ results: [] })
    },
    pages: {
      retrieve: async () => ({}),
    },
    blocks: {
      children: {
        list: async () => ({ results: [] })
      }
    }
  } as unknown as Client
}

// Create Notion client for unofficial API (richer content)
let notionUnofficial: NotionAPI
try {
  if (!process.env.NOTION_TOKEN) {
    throw new Error("NOTION_TOKEN is not defined for unofficial client")
  }

  debugNotion("Initializing unofficial Notion client")
  notionUnofficial = new NotionAPI({
    authToken: process.env.NOTION_TOKEN,
  })
  debugNotion("Unofficial Notion client initialized successfully")
} catch (error) {
  console.error("[NOTION ERROR] Failed to initialize unofficial Notion client:", error)
  // Create a minimal client with dummy methods
  notionUnofficial = {
    getPage: async () => ({})
  } as unknown as NotionAPI
}

// Format ID to ensure proper UUID format with hyphens
function formatNotionId(id: string): string {
  // If ID already has hyphens, return as is
  if (id.includes('-')) {
    return id
  }
  
  // Format ID with hyphens (Notion UUID format)
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`
}

// Cache the blog posts to avoid unnecessary API calls
export const getBlogPosts = cache(async () => {
  debugNotion("getBlogPosts called")
  
  if (!process.env.NOTION_BLOG_DATABASE_ID) {
    console.error("[NOTION ERROR] NOTION_BLOG_DATABASE_ID is not defined")
    return [] // Return empty array instead of throwing to avoid crashes
  }
  
  if (!notion.databases || typeof notion.databases.query !== 'function') {
    console.error("[NOTION ERROR] Notion client or databases.query method is not available")
    return []
  }
  
  // Format the database ID properly
  const formattedDatabaseId = formatNotionId(process.env.NOTION_BLOG_DATABASE_ID)
  debugNotion("Using database ID:", formattedDatabaseId)
  
  try {
    debugNotion("Querying Notion database...")
    const response = await notion.databases.query({
      database_id: formattedDatabaseId,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    })
    
    debugNotion(`Query successful, retrieved ${response.results.length} posts`)
    return response.results
  } catch (error) {
    console.error("[NOTION ERROR] Failed to query database:", error)
    // Return empty array instead of throwing to prevent page crashes
    return []
  }
})

// Get a single blog post by ID
export async function getBlogPost(pageId: string) {
  try {
    // Format the page ID properly
    const formattedPageId = formatNotionId(pageId)
    debugNotion(`Getting blog post with ID: ${formattedPageId}`)
    
    if (!notion.pages || typeof notion.pages.retrieve !== 'function' ||
        !notion.blocks || !notion.blocks.children || typeof notion.blocks.children.list !== 'function') {
      throw new Error("Notion client is missing required methods")
    }
    
    const page = await notion.pages.retrieve({ page_id: formattedPageId })
    const blocks = await notion.blocks.children.list({ block_id: formattedPageId })
    
    return {
      page,
      blocks: blocks.results,
    }
  } catch (error) {
    console.error(`[NOTION ERROR] Failed to get blog post ${pageId}:`, error)
    throw error
  }
}

// Get rich content using unofficial API
export async function getRichContent(pageId: string) {
  try {
    // Format the page ID properly
    const formattedPageId = formatNotionId(pageId)
    debugNotion(`Getting rich content for page: ${formattedPageId}`)
    
    if (!notionUnofficial || typeof notionUnofficial.getPage !== 'function') {
      throw new Error("Unofficial Notion client is missing required methods")
    }
    
    const recordMap = await notionUnofficial.getPage(formattedPageId)
    return recordMap
  } catch (error) {
    console.error(`[NOTION ERROR] Failed to get rich content for ${pageId}:`, error)
    throw error
  }
}

// Export the clients for use in other modules
export { notion, notionUnofficial } 
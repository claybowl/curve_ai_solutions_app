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
  
  debugNotion("Using database ID:", process.env.NOTION_BLOG_DATABASE_ID)
  
  try {
    debugNotion("Querying Notion database...")
    const response = await notion.databases.query({
      database_id: process.env.NOTION_BLOG_DATABASE_ID,
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
    debugNotion(`Getting blog post with ID: ${pageId}`)
    
    if (!notion.pages || typeof notion.pages.retrieve !== 'function' ||
        !notion.blocks || !notion.blocks.children || typeof notion.blocks.children.list !== 'function') {
      throw new Error("Notion client is missing required methods")
    }
    
    const page = await notion.pages.retrieve({ page_id: pageId })
    const blocks = await notion.blocks.children.list({ block_id: pageId })
    
    return {
      page,
      blocks: blocks.results,
    }
  } catch (error) {
    console.error(`[NOTION ERROR] Failed to get blog post ${pageId}:`, error)
    throw error
  }
}

// Get rich text content using unofficial API
export async function getRichContent(pageId: string) {
  try {
    debugNotion(`Getting rich content for page: ${pageId}`)
    
    if (!notionUnofficial || typeof notionUnofficial.getPage !== 'function') {
      throw new Error("Unofficial Notion client is missing required methods")
    }
    
    const recordMap = await notionUnofficial.getPage(pageId)
    return recordMap
  } catch (error) {
    console.error(`[NOTION ERROR] Failed to get rich content for ${pageId}:`, error)
    throw error
  }
}

// Export the clients for use in other modules
export { notion, notionUnofficial } 
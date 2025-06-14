"use server"

import { sql } from "@/lib/db"

// Get all AI tools
export async function getAllTools() {
  try {
    // Skip database calls during build if no DATABASE_URL
    if (!process.env.DATABASE_URL) {
      console.log("No DATABASE_URL found, returning empty tools array")
      return []
    }
    
    // Use tagged template literal syntax
    const tools = await sql`
      SELECT * FROM ai_tools 
      WHERE is_active = true 
      ORDER BY name
    `
    return tools
  } catch (error) {
    console.error("Error fetching all tools:", error)
    return []
  }
}

// Get tools by category (based on name patterns)
export async function getToolsByCategory() {
  try {
    const allTools = await getAllTools()

    // Define categories and their identifying keywords
    const categories = [
      {
        id: "agent-development",
        name: "AI Agent Development",
        description: "Designing and deploying custom autonomous agents capable of complex, cross-platform automation with flexible, high-capacity agent infrastructure, seamless integration with phones, text, chat, and data workflows, and advanced decision-making and task orchestration.",
        pattern: ["Agent", "Decision Engine"],
        color: "bg-blue-500",
        icon: "Bot",
      },
      {
        id: "data-visualization",
        name: "Data Visualization Suite",
        description: "Delivering actionable insights through advanced visual storytelling and analytical tools, including DataLens for live data exploration, VizFlow for pattern discovery, InsightBoard for collaborative metrics sharing, and AI-assisted narrative generation tools.",
        pattern: ["DataLens", "VizFlow", "InsightBoard", "Narrative"],
        color: "bg-purple-500",
        icon: "BarChart",
      },
      {
        id: "trading-systems",
        name: "Trading System Tools",
        description: "Advanced AI and algorithmic trading infrastructure for high-performance financial strategies, built around our Know Defeat platform powered by 126 autonomous trading bots operating on NASDAQ with real-time metric-based ranking and fund allocation.",
        pattern: ["Trade", "Market", "Strategy"],
        color: "bg-green-500",
        icon: "LineChart",
      },
      {
        id: "n8n-integration",
        name: "n8n Integration Tools",
        description: "Enhancing automation by embedding AI into custom and existing n8n workflows with full-spectrum workflow automation, custom AI agent integration, plug-and-play modules, and support for both simple integrations and complex multi-system orchestration.",
        pattern: ["n8n"],
        color: "bg-orange-500",
        icon: "Workflow",
      },
      {
        id: "low-code",
        name: "Low-Code AI Development Tools",
        description: "Simplified AI development through intuitive, visual interfaces and automation-first architecture, including our Canvas Interface for drag-and-drop agent design and AiPex System (releasing June 28) with AutoAI, business logic composition, and end-to-end agent deployment.",
        pattern: ["Canvas", "Composer", "AutoAI", "BusinessLogic"],
        color: "bg-teal-500",
        icon: "Code",
      },
      {
        id: "anti-gravity",
        name: "Anti-Gravity Framework Components",
        description: "Business process optimization and acceleration through automation-first thinking, featuring prototypes like Meeting Flow Accelerator, Momentum Pulse dashboard, AutoDoc Agent, and Slack Assistant for SOPs, all designed as modular tools that integrate with your existing productivity stack.",
        pattern: ["Friction", "Orchestrator", "Gravity", "Accelerator"],
        color: "bg-red-500",
        icon: "Zap",
      },
      {
        id: "governance",
        name: "AI Governance and Transparency",
        description: "Ensuring responsible, ethical, and compliant AI deployments with transparency frameworks, bias detection and mitigation, compliance dashboards, trust and safety modules, and ethical AI playbooks. Currently in prototype phase with advisory support from ethics researchers and legal consultants.",
        pattern: ["Transparency", "Bias", "Compliance", "Trust"],
        color: "bg-indigo-500",
        icon: "Shield",
      },
      {
        id: "industry-solutions",
        name: "Specialized Industry Solutions",
        description: "Tailored AI solutions designed for specific industries including Finance, Supply Chain, Customer Service, and Healthcare, with deep industry alignment, regulatory-aware development methodologies, and integration-ready architecture for vertical-specific platforms and datasets.",
        pattern: ["Finance", "Supply", "Customer", "Healthcare"],
        color: "bg-amber-500",
        icon: "Building",
      },
    ]

    // Categorize tools
    const toolsByCategory = categories.map((category) => {
      const tools = allTools.filter((tool) => {
        return category.pattern.some(
          (pattern) => tool.name && typeof tool.name === "string" && tool.name.includes(pattern),
        )
      })

      return {
        ...category,
        tools,
      }
    })

    return toolsByCategory
  } catch (error) {
    console.error("Error categorizing tools:", error)
    return []
  }
}

// Get tool by ID
export async function getToolById(id: number | string) {
  // Check if id is a valid number
  const parsedId = Number(id)
  if (isNaN(parsedId)) {
    // Return null for non-numeric IDs
    return null
  }

  try {
    // Use parameterized query
    const result = await sql`SELECT * FROM ai_tools WHERE id = ${parsedId}`
    return result && result.length > 0 ? result[0] : null
  } catch (error) {
    console.error("Error fetching tool by ID:", error)
    return null
  }
}

// Get recommended tools based on assessment results
export async function getRecommendedTools(assessmentId: number) {
  try {
    // Use tagged template literal syntax
    const tools = await sql`
      SELECT * FROM ai_tools 
      WHERE is_active = true 
      ORDER BY RANDOM() 
      LIMIT 3
    `
    return tools
  } catch (error) {
    console.error("Error fetching recommended tools:", error)
    return []
  }
}

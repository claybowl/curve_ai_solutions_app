"use server"

import { sql } from "@/lib/db"

// Get all AI tools
export async function getAllTools() {
  try {
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
        name: "AI Agent Development Tools",
        description: "Build, deploy, and manage intelligent autonomous agents for your business.",
        pattern: ["Agent", "Decision Engine"],
        color: "bg-blue-500",
        icon: "Bot",
      },
      {
        id: "data-visualization",
        name: "Data Visualization Suite",
        description: "Transform complex data into actionable insights with our advanced visualization tools.",
        pattern: ["DataLens", "VizFlow", "InsightBoard", "Narrative"],
        color: "bg-purple-500",
        icon: "BarChart",
      },
      {
        id: "trading-systems",
        name: "Trading System Tools",
        description: "Optimize trading strategies with AI-powered analysis and execution tools.",
        pattern: ["Trade", "Market", "Strategy"],
        color: "bg-green-500",
        icon: "LineChart",
      },
      {
        id: "n8n-integration",
        name: "n8n Integration Tools",
        description: "Seamlessly integrate AI capabilities into your n8n workflows.",
        pattern: ["n8n"],
        color: "bg-orange-500",
        icon: "Workflow",
      },
      {
        id: "low-code",
        name: "Low-Code AI Development Tools",
        description: "Create sophisticated AI solutions without extensive coding knowledge.",
        pattern: ["Canvas", "Composer", "AutoAI", "BusinessLogic"],
        color: "bg-teal-500",
        icon: "Code",
      },
      {
        id: "anti-gravity",
        name: "Anti-Gravity Framework Components",
        description: "Reduce business friction and accelerate processes with our proprietary framework.",
        pattern: ["Friction", "Orchestrator", "Gravity", "Accelerator"],
        color: "bg-red-500",
        icon: "Zap",
      },
      {
        id: "governance",
        name: "AI Governance and Transparency",
        description: "Ensure your AI systems are explainable, fair, and compliant with regulations.",
        pattern: ["Transparency", "Bias", "Compliance", "Trust"],
        color: "bg-indigo-500",
        icon: "Shield",
      },
      {
        id: "industry-solutions",
        name: "Specialized Industry Solutions",
        description: "Industry-specific AI solutions tailored to your unique business challenges.",
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

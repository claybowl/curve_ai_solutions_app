"use server"

import { 
  getAiTools, 
  getAiToolById, 
  createAiTool, 
  updateAiTool, 
  deleteAiTool,
  getToolsByCategory 
} from "@/app/actions/tool-actions"
import { revalidatePath } from "next/cache"

// Solution interface that maps to ai_tools table
export interface Solution {
  id: string
  title: string // maps to name
  description: string
  detailed_description?: string
  industry: string[] // maps to target_audience
  use_cases: string[]
  complexity_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  implementation_time: string // stored in configuration.implementation_time
  roi_potential: 'low' | 'medium' | 'high' | 'very_high' // calculated from pricing_model
  technologies: string[] // maps to tags
  is_featured: boolean
  is_public: boolean
  status: 'draft' | 'published' | 'archived' // maps to tool status (active=published, etc.)
  case_studies?: CaseStudy[]
  created_at: string
  updated_at: string
}

export interface CaseStudy {
  id: string
  client_name: string
  industry: string
  challenge: string
  solution: string
  results: string
  metrics: Record<string, any>
  is_featured: boolean
}

export interface SolutionFormData {
  title: string
  description: string
  detailed_description: string
  industry: string[]
  use_cases: string[]
  complexity_level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  implementation_time: string
  roi_potential: 'low' | 'medium' | 'high' | 'very_high'
  technologies: string[]
  is_featured: boolean
  is_public: boolean
  status: 'draft' | 'published' | 'archived'
}

/**
 * Transform ai_tools data to Solution format
 */
function transformToolToSolution(tool: any): Solution {
  // Map tool status to solution status
  const statusMap = {
    'active': 'published' as const,
    'beta': 'draft' as const,
    'deprecated': 'archived' as const,
    'maintenance': 'draft' as const
  }

  // Calculate ROI potential from pricing model
  const roiMap = {
    'free': 'high' as const,
    'freemium': 'high' as const,
    'subscription': 'medium' as const,
    'one_time': 'medium' as const,
    'custom': 'very_high' as const
  }

  return {
    id: tool.id,
    title: tool.name,
    description: tool.description || '',
    detailed_description: tool.detailed_description,
    industry: tool.target_audience || [],
    use_cases: tool.use_cases || [],
    complexity_level: tool.complexity_level || 'beginner',
    implementation_time: tool.configuration?.implementation_time || 'Contact for estimate',
    roi_potential: roiMap[tool.pricing_model as keyof typeof roiMap] || 'medium',
    technologies: tool.tags || [],
    is_featured: tool.is_featured || false,
    is_public: tool.is_public !== false,
    status: statusMap[tool.status as keyof typeof statusMap] || 'draft',
    created_at: tool.created_at,
    updated_at: tool.updated_at
  }
}

/**
 * Transform solution form data to ai_tools format
 */
function transformSolutionToTool(solutionData: SolutionFormData) {
  // Map solution status to tool status
  const statusMap = {
    'published': 'active',
    'draft': 'beta',
    'archived': 'deprecated'
  }

  // Map ROI potential to pricing model
  const pricingMap = {
    'low': 'subscription',
    'medium': 'one_time',
    'high': 'freemium',
    'very_high': 'custom'
  }

  return {
    name: solutionData.title,
    description: solutionData.description,
    detailed_description: solutionData.detailed_description,
    target_audience: solutionData.industry,
    use_cases: solutionData.use_cases,
    complexity_level: solutionData.complexity_level,
    configuration: {
      implementation_time: solutionData.implementation_time,
      solution_type: true // Flag to identify this as a solution
    },
    pricing_model: pricingMap[solutionData.roi_potential],
    tags: solutionData.technologies,
    is_featured: solutionData.is_featured,
    is_public: solutionData.is_public,
    status: statusMap[solutionData.status],
    tool_type: 'custom' as const // Solutions are typically custom implementations
  }
}

/**
 * Get all solutions with optional filtering
 */
export async function getSolutions(filter?: {
  status?: 'draft' | 'published' | 'archived' | 'featured'
  search_term?: string
  industry?: string
}) {
  try {
    // Convert solution filters to tool filters
    const toolFilter: any = {}

    if (filter?.status) {
      if (filter.status === 'featured') {
        toolFilter.is_featured = true
      } else {
        const statusMap = {
          'published': 'active',
          'draft': 'beta',
          'archived': 'deprecated'
        }
        toolFilter.status = statusMap[filter.status as keyof typeof statusMap]
      }
    }

    if (filter?.search_term) {
      toolFilter.search_term = filter.search_term
    }

    // Get tools from database
    const tools = await getAiTools(toolFilter)
    
    // Transform to solutions and apply additional filters
    let solutions = tools.map(transformToolToSolution)

    // Apply industry filter (since target_audience is an array)
    if (filter?.industry) {
      solutions = solutions.filter(solution => 
        solution.industry.some(ind => 
          ind.toLowerCase().includes(filter.industry!.toLowerCase())
        )
      )
    }

    return solutions
  } catch (error) {
    console.error("Error fetching solutions:", error)
    throw error
  }
}

/**
 * Get solution by ID
 */
export async function getSolutionById(id: string) {
  try {
    const tool = await getAiToolById(id)
    
    if (!tool) {
      return null
    }

    return transformToolToSolution(tool)
  } catch (error) {
    console.error("Error fetching solution by ID:", error)
    throw error
  }
}

/**
 * Create a new solution
 */
export async function createSolution(solutionData: SolutionFormData) {
  try {
    // Transform solution data to tool format
    const toolData = transformSolutionToTool(solutionData)
    
    // Create FormData object for the tool action
    const formData = new FormData()
    
    // Add all fields to FormData
    formData.append('name', toolData.name)
    formData.append('description', toolData.description)
    formData.append('detailed_description', toolData.detailed_description || '')
    formData.append('complexity_level', toolData.complexity_level)
    formData.append('configuration', JSON.stringify(toolData.configuration))
    formData.append('pricing_model', toolData.pricing_model)
    formData.append('is_featured', toolData.is_featured.toString())
    formData.append('is_public', toolData.is_public.toString())
    formData.append('status', toolData.status)
    formData.append('tool_type', toolData.tool_type)

    // Add array fields
    toolData.target_audience.forEach(audience => {
      formData.append('target_audience', audience)
    })
    
    toolData.use_cases.forEach(useCase => {
      formData.append('use_cases', useCase)
    })
    
    toolData.tags.forEach(tag => {
      formData.append('tags', tag)
    })

    // Create the tool (solution)
    const result = await createAiTool(formData)
    
    // Revalidate solutions page
    revalidatePath('/solutions')
    
    return result
  } catch (error) {
    console.error("Error creating solution:", error)
    throw error
  }
}

/**
 * Update an existing solution
 */
export async function updateSolution(id: string, solutionData: SolutionFormData) {
  try {
    // Transform solution data to tool format
    const toolData = transformSolutionToTool(solutionData)
    
    // Create FormData object for the tool action
    const formData = new FormData()
    
    // Add all fields to FormData
    formData.append('name', toolData.name)
    formData.append('description', toolData.description)
    formData.append('detailed_description', toolData.detailed_description || '')
    formData.append('complexity_level', toolData.complexity_level)
    formData.append('configuration', JSON.stringify(toolData.configuration))
    formData.append('pricing_model', toolData.pricing_model)
    formData.append('is_featured', toolData.is_featured.toString())
    formData.append('is_public', toolData.is_public.toString())
    formData.append('status', toolData.status)
    formData.append('tool_type', toolData.tool_type)

    // Add array fields
    toolData.target_audience.forEach(audience => {
      formData.append('target_audience', audience)
    })
    
    toolData.use_cases.forEach(useCase => {
      formData.append('use_cases', useCase)
    })
    
    toolData.tags.forEach(tag => {
      formData.append('tags', tag)
    })

    // Update the tool (solution)
    const result = await updateAiTool(id, formData)
    
    // Revalidate solutions pages
    revalidatePath('/solutions')
    revalidatePath(`/solutions/${id}`)
    
    return result
  } catch (error) {
    console.error("Error updating solution:", error)
    throw error
  }
}

/**
 * Delete a solution
 */
export async function deleteSolution(id: string) {
  try {
    const result = await deleteAiTool(id)
    
    // Revalidate solutions page
    revalidatePath('/solutions')
    
    return result
  } catch (error) {
    console.error("Error deleting solution:", error)
    throw error
  }
}

/**
 * Get solutions statistics for admin dashboard
 */
export async function getSolutionsStats() {
  try {
    const allSolutions = await getSolutions()
    
    const stats = {
      total: allSolutions.length,
      published: allSolutions.filter(s => s.status === 'published').length,
      draft: allSolutions.filter(s => s.status === 'draft').length,
      featured: allSolutions.filter(s => s.is_featured).length,
      archived: allSolutions.filter(s => s.status === 'archived').length
    }
    
    return stats
  } catch (error) {
    console.error("Error fetching solutions stats:", error)
    return {
      total: 0,
      published: 0,
      draft: 0,
      featured: 0,
      archived: 0
    }
  }
}
"use server"

/**
 * MIGRATION NOTE: This file has been partially migrated to Stack Auth.
 * 
 * Authentication/user references need to be updated to use Stack Auth.
 * Business data queries (assessments, assessment_questions tables) need database migration.
 * 
 * TODO: All database queries need to be migrated to Stack Auth database or separate database.
 */

import { getCurrentUserServer } from "@/lib/stack-auth-server"
// TODO: Import business database client when implemented
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Remove Supabase imports - not used anymore
// import { createServerSupabaseClient } from './supabase-server'
// import { getCurrentSupabaseUser } from './db-v2'
import type { 
  Assessment, 
  AssessmentQuestion, 
  AssessmentResponse,
  AssessmentFormData,
  AssessmentFilter
} from "@/types/assessments"

// Get all assessment questions
export async function getAssessmentQuestions() {
  try {
    // TODO: Replace with business database client when implemented
    // const db = await getBusinessDatabaseClient()
    // const { data: questions, error } = await db.from('assessment_questions')
    
    console.warn("getAssessmentQuestions: Business database integration needed")
    return []
      .select(`
        *,
        assessment_categories(
          id,
          name,
          description,
          icon
        )
      `)
      .eq('is_active', true)
      .order('sort_order')

    if (error) {
      console.error("Error fetching assessment questions:", error)
      return []
    }

    return questions || []
  } catch (error) {
    console.error("Error fetching assessment questions:", error)
    return []
  }
}

// Get assessment questions by category
export async function getAssessmentQuestionsByCategory(categoryId?: string) {
  try {
    // TODO: Replace with business database client when implemented
    // const db = await getBusinessDatabaseClient()
    // let query = db.from('assessment_questions')
    
    console.warn("getAssessmentQuestionsByCategory: Business database integration needed")
    return []
      .select(`
        *,
        assessment_categories(
          id,
          name,
          description,
          icon
        )
      `)
      .eq('is_active', true)
      .order('sort_order')

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data: questions, error } = await query

    if (error) {
      console.error("Error fetching assessment questions by category:", error)
      return []
    }

    return questions || []
  } catch (error) {
    console.error("Error fetching assessment questions by category:", error)
    return []
  }
}

// Get all assessment categories
export async function getAssessmentCategories() {
  try {
    // TODO: Replace with business database client when implemented
    // const db = await getBusinessDatabaseClient()
    // const { data: categories, error } = await db.from('assessment_categories')
    
    console.warn("getAssessmentCategories: Business database integration needed")
    return []
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (error) {
      console.error("Error fetching assessment categories:", error)
      return []
    }

    return categories || []
  } catch (error) {
    console.error("Error fetching assessment categories:", error)
    return []
  }
}

// Submit a new assessment
export async function submitAssessment(formData: FormData) {
  try {
    // Get current user (optional - allows anonymous submissions)
    const user = await getCurrentUserServer()
    
    // Use user ID if logged in, otherwise use 'anonymous'
    const userId = user?.id || 'anonymous'

    const title = formData.get("title") as string || "AI Readiness Assessment"

    // TODO: Replace with Neon PostgreSQL database operations
    // For now, assessment submission logs a warning but allows submission
    console.warn("submitAssessment: Business database integration needed for Neon PostgreSQL")
    
    // Temporary: Return success message (actual database save disabled until database is implemented)
    // Process each question response
    const questions = await getAssessmentQuestions()
    let totalScore = 0
    let validResponses = 0

    for (const question of questions) {
      const response = formData.get(`question_${question.id}`) as string
      
      if (response) {
        const score = calculateQuestionScore(response, question)
        totalScore += score
        validResponses++

        // TODO: Save the response to Neon PostgreSQL when database is implemented
        /* 
        const { neon } = await import("@neondatabase/serverless")
        const sql = neon(process.env.DATABASE_URL!)
        await sql`
          INSERT INTO assessment_responses (assessment_id, question_id, response_value, response_score)
          VALUES (${assessmentId}, ${question.id}, ${response}, ${score})
        `
        */
      }
    }

    // Calculate completion percentage and overall score
    const completionPercentage = (validResponses / questions.length) * 100
    const overallScore = validResponses > 0 ? totalScore / validResponses : 0

    // TODO: Update the assessment with the scores in Neon PostgreSQL when database is implemented
    /*
    const { neon } = await import("@neondatabase/serverless")
    const sql = neon(process.env.DATABASE_URL!)
    await sql`
      UPDATE assessments
      SET overall_score = ${overallScore},
          completion_percentage = ${completionPercentage},
          status = ${completionPercentage === 100 ? 'completed' : 'in_progress'},
          completed_at = ${completionPercentage === 100 ? new Date().toISOString() : null}
      WHERE id = ${assessmentId}
    `
    */

    // Generate category-specific results if assessment is complete
    if (completionPercentage === 100) {
      // TODO: Implement when database is ready
      // await generateAssessmentResults(assessmentId)
    }

    // For now, return success message (redirect disabled until database is implemented)
    revalidatePath("/assessments")
    
    // Return success - in the future, redirect to results page
    // redirect(`/assessments/${assessmentId}/results`)
    
    return {
      success: true,
      message: "Assessment submitted successfully! Database integration needed to save results.",
      score: overallScore,
      completionPercentage: completionPercentage
    }
  } catch (error) {
    console.error("Error submitting assessment:", error)
    throw error
  }
}

// Helper function to calculate score based on response
function calculateQuestionScore(response: string, question: any): number {
  if (!response) return 0

  // Handle different question types
  switch (question.question_type) {
    case 'scale':
      // For scale questions, response should be a number (1-10)
      const scaleValue = parseInt(response)
      return isNaN(scaleValue) ? 0 : (scaleValue * question.weight)
    
    case 'boolean':
      // For boolean questions, 'yes' scores higher than 'no'
      const boolValue = response.toLowerCase()
      const boolScore = boolValue === 'yes' || boolValue === 'true' ? 10 : 5
      return boolScore * question.weight
    
    case 'multiple_choice':
      // For multiple choice, score based on the specific option
      if (question.options && Array.isArray(question.options)) {
        const optionIndex = question.options.indexOf(response)
        const optionScore = optionIndex >= 0 ? (optionIndex + 1) * 2 : 0
        return Math.min(10, optionScore) * question.weight
      }
      return 5 * question.weight
    
    case 'text':
    default:
      // For text responses, score based on length and complexity
      const responseLength = response.length
      
      // Score based on length (0-5)
      let lengthScore = 0
      if (responseLength > 200) lengthScore = 5
      else if (responseLength > 150) lengthScore = 4
      else if (responseLength > 100) lengthScore = 3
      else if (responseLength > 50) lengthScore = 2
      else if (responseLength > 0) lengthScore = 1

      // Score based on complexity (0-5)
      const uniqueWords = new Set(response.toLowerCase().match(/\b(\w+)\b/g) || [])
      const complexityScore = Math.min(5, Math.floor(uniqueWords.size / 5))

      const baseScore = Math.min(10, lengthScore + complexityScore)
      return baseScore * question.weight
  }
}

// Generate assessment results by category
async function generateAssessmentResults(assessmentId: string) {
  try {
    // TODO: Migrate to Neon PostgreSQL when database is implemented
    console.warn("generateAssessmentResults: Database integration needed")
    return
    // TODO: Uncomment when database is implemented
    // const { neon } = await import("@neondatabase/serverless")
    // const sql = neon(process.env.DATABASE_URL!)
    // Query assessment responses and generate results
  } catch (error) {
    console.error("Error generating assessment results:", error)
  }
}

// Helper function to generate category recommendations
function generateCategoryRecommendations(category: any, score: number, responses: any[]): any {
  const recommendations = {
    priority: score < 5 ? 'high' : score < 7 ? 'medium' : 'low',
    actions: [],
    resources: []
  }

  switch (category.name.toLowerCase()) {
    case 'ai readiness':
      if (score < 5) {
        recommendations.actions.push("Conduct AI literacy training for your team")
        recommendations.actions.push("Develop an AI strategy roadmap")
        recommendations.resources.push("AI Strategy Guide")
      } else if (score < 7) {
        recommendations.actions.push("Pilot small AI projects to build experience")
        recommendations.resources.push("AI Implementation Checklist")
      }
      break
    
    case 'data management':
      if (score < 5) {
        recommendations.actions.push("Audit your current data infrastructure")
        recommendations.actions.push("Implement data governance policies")
      }
      break
    
    default:
      recommendations.actions.push("Review current practices in this area")
      recommendations.actions.push("Identify specific improvement opportunities")
  }

  return recommendations
}

// Helper function to generate category strengths
function generateCategoryStrengths(category: any, score: number): string[] {
  if (score >= 8) {
    return [`Strong foundation in ${category.name}`, "Well-positioned for AI implementation"]
  } else if (score >= 6) {
    return [`Good progress in ${category.name}`, "Some solid foundations in place"]
  } else {
    return ["Opportunity for growth identified"]
  }
}

// Helper function to generate improvement areas
function generateCategoryImprovements(category: any, score: number): string[] {
  if (score < 5) {
    return [`Significant improvement needed in ${category.name}`, "Focus area for immediate attention"]
  } else if (score < 7) {
    return [`Room for improvement in ${category.name}`, "Consider targeted initiatives"]
  } else {
    return ["Continue current positive momentum"]
  }
}

// Get assessment by ID with responses and results
export async function getAssessmentById(id: string) {
  try {
    // TODO: Migrate to Neon PostgreSQL when database is implemented
    console.warn("getAssessmentById: Database integration needed")
    
    // TODO: Query Neon PostgreSQL database
    return null
  } catch (error) {
    console.error("Error getting assessment by ID:", error)
    return null
  }
}

// Get all assessments for current user or specified user
export async function getUserAssessments(userId?: string) {
  try {
    // TODO: Migrate to Neon PostgreSQL when database is implemented
    console.warn("getUserAssessments: Database integration needed")
    
    // If no userId provided, get current user
    if (!userId) {
      const user = await getCurrentUserServer()
      if (!user) {
        // Return empty array instead of throwing - allows non-authenticated access
        return []
      }
      userId = user.id
    }
    
    // TODO: Query Neon PostgreSQL database
    return []
  } catch (error) {
    console.error("Error getting user assessments:", error)
    return []
  }
}

// Get all assessments (admin function)
export async function getAllAssessments(filter?: AssessmentFilter) {
  try {
    // TODO: Migrate to Neon PostgreSQL when database is implemented
    console.warn("getAllAssessments: Database integration needed")
    
    const user = await getCurrentUserServer()
    
    if (!user) {
      throw new Error("Authentication required")
    }

    // Check if user is admin using Stack Auth
    const { isUserAdmin } = await import('@/lib/stack-auth-server')
    const isAdmin = await isUserAdmin()

    if (!isAdmin) {
      throw new Error("Admin access required")
    }

    // TODO: Query Neon PostgreSQL database
    return []
    
    // TODO: Uncomment when database is implemented
    // let query = supabase
    //   .from('assessments')
    //   .select(`
    //     *,
    //     profiles!inner(
    //       first_name,
    //       last_name,
    //       company_name,
    //       email
    //     )
    //   `)

    // // Apply filters
    // if (filter?.status) {
    //   query = query.eq('status', filter.status)
    // }
    // if (filter?.user_id) {
    //   query = query.eq('user_id', filter.user_id)
    // }

    // // Apply sorting
    // const sortBy = filter?.sortBy || 'created_at'
    // const sortDirection = filter?.sortDirection || 'desc'
    // query = query.order(sortBy, { ascending: sortDirection === 'asc' })

    // // Apply pagination
    // if (filter?.limit) {
    //   query = query.limit(filter.limit)
    // }
    // if (filter?.offset) {
    //   query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1)
    // }

    // const { data: assessments, error } = await query

    // if (error) {
    //   console.error("Error fetching all assessments:", error)
    //   return []
    // }

    // return assessments || []
  } catch (error) {
    console.error("Error getting all assessments:", error)
    return []
  }
}

// Update assessment status
export async function updateAssessmentStatus(
  assessmentId: string, 
  status: 'in_progress' | 'completed' | 'abandoned'
) {
  try {
    // TODO: Migrate to Neon PostgreSQL when database is implemented
    console.warn("updateAssessmentStatus: Database integration needed")
    
    const user = await getCurrentUserServer()
    
    if (!user) {
      throw new Error("Authentication required")
    }

    // TODO: Update in Neon PostgreSQL database
    revalidatePath("/assessments")
    revalidatePath(`/assessments/${assessmentId}/results`)
    
    return { success: true }
  } catch (error) {
    console.error("Error updating assessment status:", error)
    throw error
  }
}

// Delete assessment
export async function deleteAssessment(assessmentId: string) {
  try {
    // TODO: Migrate to Neon PostgreSQL when database is implemented
    console.warn("deleteAssessment: Database integration needed")
    
    const user = await getCurrentUserServer()
    
    if (!user) {
      throw new Error("Authentication required")
    }

    // TODO: Check ownership and delete from Neon PostgreSQL database
    // const { neon } = await import("@neondatabase/serverless")
    // const sql = neon(process.env.DATABASE_URL!)
    // const assessment = await sql`SELECT user_id FROM assessments WHERE id = ${assessmentId}`
    
    const { isUserAdmin } = await import('@/lib/stack-auth-server')
    const isAdmin = await isUserAdmin()
    
    // For now, allow deletion if user is admin
    if (!isAdmin) {
      throw new Error("Not authorized to delete this assessment")
    }

    // TODO: Delete from Neon PostgreSQL database
    // const { neon } = await import("@neondatabase/serverless")
    // const sql = neon(process.env.DATABASE_URL!)
    // await sql`DELETE FROM assessments WHERE id = ${assessmentId}`

    return { success: true }
    
    // TODO: Uncomment when database is implemented
    // const { error } = await supabase
    //   .from('assessments')
    //   .delete()
    //   .eq('id', assessmentId)

    // if (error) {
    //   console.error("Error deleting assessment:", error)
    //   throw new Error("Failed to delete assessment")
    // }

    // revalidatePath("/assessments")
    // return { success: true }
  } catch (error) {
    console.error("Error deleting assessment:", error)
    throw error
  }
}

// Export aliases for backward compatibility
export const getAssessments = getAllAssessments
export const getAssessmentByIdAction = getAssessmentById
export const createAssessment = submitAssessment
export const updateAssessment = updateAssessmentStatus
export const deleteAssessmentAction = deleteAssessment

// Legacy function for assessment reports
export async function generateAssessmentReport(assessmentId: string) {
  return { success: true, message: "Assessment report generation not implemented yet" }
}

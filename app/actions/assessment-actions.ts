"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getCurrentSupabaseUser } from "@/lib/db-v2"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
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
    const supabase = await createServerSupabaseClient()
    
    const { data: questions, error } = await supabase
      .from('assessment_questions')
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
    const supabase = await createServerSupabaseClient()
    
    let query = supabase
      .from('assessment_questions')
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
    const supabase = await createServerSupabaseClient()
    
    const { data: categories, error } = await supabase
      .from('assessment_categories')
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
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      throw new Error("Authentication required")
    }

    const title = formData.get("title") as string || "AI Readiness Assessment"

    // Create a new assessment
    const { data: assessmentData, error: assessmentError } = await supabase
      .from('assessments')
      .insert({
        user_id: user.id,
        title: title,
        status: 'in_progress'
      })
      .select('id')
      .single()

    if (assessmentError || !assessmentData) {
      console.error("Error creating assessment:", assessmentError)
      throw new Error("Failed to create assessment")
    }

    const assessmentId = assessmentData.id

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

        // Save the response
        const { error: responseError } = await supabase
          .from('assessment_responses')
          .insert({
            assessment_id: assessmentId,
            question_id: question.id,
            response_value: response,
            response_score: score
          })

        if (responseError) {
          console.error("Error saving assessment response:", responseError)
        }
      }
    }

    // Calculate completion percentage and overall score
    const completionPercentage = (validResponses / questions.length) * 100
    const overallScore = validResponses > 0 ? totalScore / validResponses : 0

    // Update the assessment with the scores
    const { error: updateError } = await supabase
      .from('assessments')
      .update({
        overall_score: overallScore,
        completion_percentage: completionPercentage,
        status: completionPercentage === 100 ? 'completed' : 'in_progress',
        completed_at: completionPercentage === 100 ? new Date().toISOString() : null
      })
      .eq('id', assessmentId)

    if (updateError) {
      console.error("Error updating assessment score:", updateError)
    }

    // Generate category-specific results if assessment is complete
    if (completionPercentage === 100) {
      await generateAssessmentResults(assessmentId)
    }

    revalidatePath("/assessments")
    redirect(`/assessments/${assessmentId}/results`)
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
    const supabase = await createServerSupabaseClient()
    
    // Get all responses for this assessment with questions and categories
    const { data: responses, error: responsesError } = await supabase
      .from('assessment_responses')
      .select(`
        *,
        assessment_questions!inner(
          *,
          assessment_categories(*)
        )
      `)
      .eq('assessment_id', assessmentId)

    if (responsesError || !responses) {
      console.error("Error fetching assessment responses:", responsesError)
      return
    }

    // Group responses by category
    const categoriesMap = new Map()
    
    responses.forEach((response: any) => {
      const category = response.assessment_questions.assessment_categories
      if (!category) return
      
      if (!categoriesMap.has(category.id)) {
        categoriesMap.set(category.id, {
          category,
          scores: [],
          responses: []
        })
      }
      
      categoriesMap.get(category.id).scores.push(response.response_score || 0)
      categoriesMap.get(category.id).responses.push(response)
    })

    // Calculate category scores and generate results
    for (const [categoryId, categoryData] of categoriesMap) {
      const { category, scores, responses } = categoryData
      const categoryScore = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0
      
      // Generate simple recommendations based on score
      const recommendations = generateCategoryRecommendations(category, categoryScore, responses)
      const strengths = generateCategoryStrengths(category, categoryScore)
      const improvementAreas = generateCategoryImprovements(category, categoryScore)

      // Save the category result
      await supabase
        .from('assessment_results')
        .insert({
          assessment_id: assessmentId,
          category_id: categoryId,
          category_score: categoryScore,
          recommendations,
          strengths,
          improvement_areas: improvementAreas
        })
    }
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
    const supabase = await createServerSupabaseClient()

    // Get assessment with user profile info
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .select(`
        *,
        profiles!inner(
          first_name,
          last_name,
          company_name,
          email
        )
      `)
      .eq('id', id)
      .single()

    if (assessmentError || !assessment) {
      console.error("Error fetching assessment:", assessmentError)
      return null
    }

    // Get responses with question and category details
    const { data: responses, error: responsesError } = await supabase
      .from('assessment_responses')
      .select(`
        *,
        assessment_questions!inner(
          *,
          assessment_categories(*)
        )
      `)
      .eq('assessment_id', id)

    if (responsesError) {
      console.error("Error fetching assessment responses:", responsesError)
    }

    // Get assessment results by category
    const { data: results, error: resultsError } = await supabase
      .from('assessment_results')
      .select(`
        *,
        assessment_categories(*)
      `)
      .eq('assessment_id', id)

    if (resultsError) {
      console.error("Error fetching assessment results:", resultsError)
    }

    return {
      ...assessment,
      responses: responses || [],
      results: results || []
    }
  } catch (error) {
    console.error("Error getting assessment by ID:", error)
    return null
  }
}

// Get all assessments for current user or specified user
export async function getUserAssessments(userId?: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // If no userId provided, get current user
    if (!userId) {
      const user = await getCurrentSupabaseUser()
      if (!user) {
        throw new Error("Authentication required")
      }
      userId = user.id
    }
    
    const { data: assessments, error } = await supabase
      .from('assessments')
      .select(`
        *,
        profiles!inner(
          first_name,
          last_name,
          company_name
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching user assessments:", error)
      return []
    }

    return assessments || []
  } catch (error) {
    console.error("Error getting user assessments:", error)
    return []
  }
}

// Get all assessments (admin function)
export async function getAllAssessments(filter?: AssessmentFilter) {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      throw new Error("Authentication required")
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      throw new Error("Admin access required")
    }

    let query = supabase
      .from('assessments')
      .select(`
        *,
        profiles!inner(
          first_name,
          last_name,
          company_name,
          email
        )
      `)

    // Apply filters
    if (filter?.status) {
      query = query.eq('status', filter.status)
    }
    if (filter?.user_id) {
      query = query.eq('user_id', filter.user_id)
    }

    // Apply sorting
    const sortBy = filter?.sortBy || 'created_at'
    const sortDirection = filter?.sortDirection || 'desc'
    query = query.order(sortBy, { ascending: sortDirection === 'asc' })

    // Apply pagination
    if (filter?.limit) {
      query = query.limit(filter.limit)
    }
    if (filter?.offset) {
      query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1)
    }

    const { data: assessments, error } = await query

    if (error) {
      console.error("Error fetching all assessments:", error)
      return []
    }

    return assessments || []
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
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      throw new Error("Authentication required")
    }

    const updateData: any = { status }
    
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('assessments')
      .update(updateData)
      .eq('id', assessmentId)
      .eq('user_id', user.id) // Ensure user can only update their own assessments

    if (error) {
      console.error("Error updating assessment status:", error)
      throw new Error("Failed to update assessment status")
    }

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
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentSupabaseUser()
    
    if (!user) {
      throw new Error("Authentication required")
    }

    // Check if user owns the assessment or is admin
    const { data: assessment } = await supabase
      .from('assessments')
      .select('user_id')
      .eq('id', assessmentId)
      .single()

    if (!assessment) {
      throw new Error("Assessment not found")
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    const isOwner = assessment.user_id === user.id
    const isAdmin = profile?.role === 'admin'

    if (!isOwner && !isAdmin) {
      throw new Error("Not authorized to delete this assessment")
    }

    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', assessmentId)

    if (error) {
      console.error("Error deleting assessment:", error)
      throw new Error("Failed to delete assessment")
    }

    revalidatePath("/assessments")
    return { success: true }
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

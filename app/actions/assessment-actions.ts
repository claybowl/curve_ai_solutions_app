"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Get all assessment questions
export async function getAssessmentQuestions() {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: questions, error } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('active', true)
      .order('category')
      .order('id')

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

// Submit a new assessment
export async function submitAssessment(formData: FormData) {
  try {
    const supabase = await createServerSupabaseClient()
    const userId = formData.get("userId") as string

    // Create a new assessment
    const { data: assessmentData, error: assessmentError } = await supabase
      .from('ai_assessments')
      .insert({
        user_id: userId,
        status: 'pending'
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

    for (const question of questions) {
      const response = formData.get(`question_${question.id}`) as string
      const score = calculateQuestionScore(response, question)
      totalScore += score

      // Save the response
      const { error: responseError } = await supabase
        .from('assessment_responses')
        .insert({
          assessment_id: assessmentId,
          question_id: question.id,
          response,
          score
        })

      if (responseError) {
        console.error("Error saving assessment response:", responseError)
      }
    }

    // Update the assessment with the total score
    const { error: updateError } = await supabase
      .from('ai_assessments')
      .update({
        score: totalScore,
        status: 'completed'
      })
      .eq('id', assessmentId)

    if (updateError) {
      console.error("Error updating assessment score:", updateError)
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
  // This is a simple implementation - you would customize this based on your scoring criteria

  if (!response) return 0

  // Basic scoring based on response length, complexity, and question weight
  const responseLength = response.length

  // Score based on length (0-5)
  let lengthScore = 0
  if (responseLength > 200) lengthScore = 5
  else if (responseLength > 150) lengthScore = 4
  else if (responseLength > 100) lengthScore = 3
  else if (responseLength > 50) lengthScore = 2
  else if (responseLength > 0) lengthScore = 1

  // Score based on complexity (0-5)
  // Simple heuristic: count unique words as a proxy for complexity
  const uniqueWords = new Set(response.toLowerCase().match(/\b(\w+)\b/g) || [])
  const complexityScore = Math.min(5, Math.floor(uniqueWords.size / 5))

  // Combine scores and apply question weight
  const baseScore = Math.min(10, lengthScore + complexityScore)
  return baseScore * question.weight
}

// Get assessment by ID with responses
export async function getAssessmentById(id: number) {
  try {
    const supabase = await createServerSupabaseClient()

    // Get assessment with user info
    const { data: assessment, error: assessmentError } = await supabase
      .from('ai_assessments')
      .select(`
        *,
        users!ai_assessments_user_id_fkey(
          first_name,
          last_name,
          company_name
        )
      `)
      .eq('id', id)
      .single()

    if (assessmentError || !assessment) {
      console.error("Error fetching assessment:", assessmentError)
      return null
    }

    // Get responses with question details
    const { data: responses, error: responsesError } = await supabase
      .from('assessment_responses')
      .select(`
        *,
        assessment_questions!assessment_responses_question_id_fkey(
          question_text,
          category
        )
      `)
      .eq('assessment_id', id)

    if (responsesError) {
      console.error("Error fetching assessment responses:", responsesError)
    }

    return {
      ...assessment,
      responses: responses || [],
    }
  } catch (error) {
    console.error("Error getting assessment by ID:", error)
    return null
  }
}

// Get all assessments for a user
export async function getUserAssessments(userId: string) {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data: assessments, error } = await supabase
      .from('ai_assessments')
      .select('*')
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

// Generate assessment report
export async function generateAssessmentReport(assessmentId: number) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // In a real implementation, this would call an AI service to generate a report
    // For now, we'll just update the report URL
    const reportUrl = `/reports/assessment-${assessmentId}.pdf`

    const { error } = await supabase
      .from('ai_assessments')
      .update({
        report_url: reportUrl,
        status: 'reviewed'
      })
      .eq('id', assessmentId)

    if (error) {
      console.error("Error updating assessment report:", error)
      throw new Error("Failed to generate report")
    }

    revalidatePath(`/assessments/${assessmentId}/results`)
    return reportUrl
  } catch (error) {
    console.error("Error generating assessment report:", error)
    throw error
  }
}

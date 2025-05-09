"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Get all assessment questions
export async function getAssessmentQuestions() {
  const questions = await sql`
    SELECT * FROM assessment_questions 
    WHERE active = true 
    ORDER BY category, id
  `

  return questions
}

// Submit a new assessment
export async function submitAssessment(formData: FormData) {
  const userId = Number.parseInt(formData.get("userId") as string)

  // Create a new assessment
  const assessmentResult = await sql.query(
    `
    INSERT INTO ai_assessments (user_id, status)
    VALUES ($1, 'pending')
    RETURNING id
  `,
    [userId],
  )

  const assessmentId = assessmentResult[0].id

  // Process each question response
  const questions = await getAssessmentQuestions()
  let totalScore = 0

  for (const question of questions) {
    const response = formData.get(`question_${question.id}`) as string
    const score = calculateQuestionScore(response, question)
    totalScore += score

    // Save the response
    await sql.query(
      `
      INSERT INTO assessment_responses (assessment_id, question_id, response, score)
      VALUES ($1, $2, $3, $4)
    `,
      [assessmentId, question.id, response, score],
    )
  }

  // Update the assessment with the total score
  await sql.query(
    `
    UPDATE ai_assessments
    SET score = $1, status = 'completed'
    WHERE id = $2
  `,
    [totalScore, assessmentId],
  )

  revalidatePath("/assessments")
  redirect(`/assessments/${assessmentId}/results`)
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
  const assessment = await sql.query(
    `
    SELECT a.*, u.first_name, u.last_name, u.company_name
    FROM ai_assessments a
    JOIN users u ON a.user_id = u.id
    WHERE a.id = $1
  `,
    [id],
  )

  if (!assessment || assessment.length === 0) {
    return null
  }

  const responses = await sql.query(
    `
    SELECT r.*, q.question_text, q.category
    FROM assessment_responses r
    JOIN assessment_questions q ON r.question_id = q.id
    WHERE r.assessment_id = $1
  `,
    [id],
  )

  return {
    ...assessment[0],
    responses,
  }
}

// Get all assessments for a user
export async function getUserAssessments(userId: number) {
  return sql.query(
    `
    SELECT * FROM ai_assessments
    WHERE user_id = $1
    ORDER BY created_at DESC
  `,
    [userId],
  )
}

// Generate assessment report
export async function generateAssessmentReport(assessmentId: number) {
  // In a real implementation, this would call an AI service to generate a report
  // For now, we'll just update the report URL

  const reportUrl = `/reports/assessment-${assessmentId}.pdf`

  await sql.query(
    `
    UPDATE ai_assessments
    SET report_url = $1, status = 'reviewed'
    WHERE id = $2
  `,
    [reportUrl, assessmentId],
  )

  revalidatePath(`/assessments/${assessmentId}/results`)
  return reportUrl
}

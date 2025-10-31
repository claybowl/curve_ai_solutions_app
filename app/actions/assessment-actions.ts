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

    // Return comprehensive AI Readiness Assessment questions
    return [
      // BUSINESS UNDERSTANDING & GOALS
      {
        id: "q1",
        category_id: "cat-1",
        question_text: "On a scale of 1-10, how familiar are you with what AI can actually do for businesses like yours?",
        question_type: "scale",
        options: null,
        weight: 1.0,
        sort_order: 1,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-1",
          name: "Current AI Understanding",
          description: "Understanding your team's familiarity with AI capabilities",
          icon: "brain"
        }
      },
      {
        id: "q2",
        category_id: "cat-1",
        question_text: "Have you or anyone on your team used AI tools before (like ChatGPT, Claude, or other AI assistants)?",
        question_type: "boolean",
        options: null,
        weight: 1.0,
        sort_order: 2,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-1",
          name: "Current AI Understanding",
          description: "Understanding your team's familiarity with AI capabilities",
          icon: "brain"
        }
      },
      {
        id: "q3",
        category_id: "cat-1",
        question_text: "What's the main reason you're interested in AI for your business right now?",
        question_type: "multiple_choice",
        options: [
          "Want to save time on routine tasks",
          "Looking to improve customer service",
          "Need to make better decisions from data",
          "Trying to stay ahead of competitors",
          "Heard about AI and want to explore possibilities",
          "Other (please explain below)"
        ],
        weight: 1.0,
        sort_order: 3,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-1",
          name: "Current AI Understanding",
          description: "Understanding your team's familiarity with AI capabilities",
          icon: "brain"
        }
      },

      // BUSINESS OPERATIONS
      {
        id: "q4",
        category_id: "cat-2",
        question_text: "How many people work in your business?",
        question_type: "multiple_choice",
        options: [
          "Just me (solopreneur)",
          "2-10 employees",
          "11-50 employees",
          "51-200 employees",
          "More than 200 employees"
        ],
        weight: 1.0,
        sort_order: 4,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-2",
          name: "Business Operations",
          description: "Understanding your business structure and processes",
          icon: "users"
        }
      },
      {
        id: "q5",
        category_id: "cat-2",
        question_text: "What type of work takes up most of your team's time? (Be honest - we all have them!)",
        question_type: "multiple_choice",
        options: [
          "Answering customer questions",
          "Doing paperwork and admin tasks",
          "Finding and managing information",
          "Creating reports and documents",
          "Scheduling and coordinating",
          "All of the above"
        ],
        weight: 1.0,
        sort_order: 5,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-2",
          name: "Business Operations",
          description: "Understanding your business structure and processes",
          icon: "users"
        }
      },
      {
        id: "q6",
        category_id: "cat-2",
        question_text: "If you could eliminate one repetitive task from your daily work, what would it be?",
        question_type: "text",
        options: null,
        weight: 1.0,
        sort_order: 6,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-2",
          name: "Business Operations",
          description: "Understanding your business structure and processes",
          icon: "users"
        }
      },

      // DATA & INFORMATION
      {
        id: "q7",
        category_id: "cat-3",
        question_text: "How do you currently keep track of important business information?",
        question_type: "multiple_choice",
        options: [
          "Mostly in my head or notes",
          "Paper files and folders",
          "Spreadsheets (Excel, Google Sheets)",
          "Simple software (QuickBooks, etc.)",
          "Business software with reports",
          "We don't really track it systematically"
        ],
        weight: 1.0,
        sort_order: 7,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-3",
          name: "Data & Information",
          description: "Understanding how you manage business information",
          icon: "database"
        }
      },
      {
        id: "q8",
        category_id: "cat-3",
        question_text: "When you need to make an important business decision, how do you figure out what to do?",
        question_type: "multiple_choice",
        options: [
          "Go with my gut feeling",
          "Ask trusted friends or advisors",
          "Look at basic sales numbers",
          "Check reports and trends",
          "We don't have a formal process"
        ],
        weight: 1.0,
        sort_order: 8,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-3",
          name: "Data & Information",
          description: "Understanding how you manage business information",
          icon: "database"
        }
      },
      {
        id: "q9",
        category_id: "cat-3",
        question_text: "Do you have customer information (emails, phone numbers, purchase history) that you could use better?",
        question_type: "boolean",
        options: null,
        weight: 1.0,
        sort_order: 9,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-3",
          name: "Data & Information",
          description: "Understanding how you manage business information",
          icon: "database"
        }
      },

      // TECHNICAL READINESS
      {
        id: "q10",
        category_id: "cat-4",
        question_text: "How comfortable are you with trying new software or technology?",
        question_type: "scale",
        options: null,
        weight: 1.0,
        sort_order: 10,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-4",
          name: "Technical Readiness",
          description: "Assessing your comfort with technology",
          icon: "computer"
        }
      },
      {
        id: "q11",
        category_id: "cat-4",
        question_text: "Who handles technical stuff in your business?",
        question_type: "multiple_choice",
        options: [
          "I do everything myself",
          "We have a part-time IT person",
          "We have a full-time technical person",
          "We use outside contractors",
          "We don't really have anyone technical"
        ],
        weight: 1.0,
        sort_order: 11,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-4",
          name: "Technical Readiness",
          description: "Assessing your comfort with technology",
          icon: "computer"
        }
      },
      {
        id: "q12",
        category_id: "cat-4",
        question_text: "Are your current business systems (website, email, software) all connected and working together?",
        question_type: "boolean",
        options: null,
        weight: 1.0,
        sort_order: 12,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-4",
          name: "Technical Readiness",
          description: "Assessing your comfort with technology",
          icon: "computer"
        }
      },

      // BUDGET & INVESTMENT
      {
        id: "q13",
        category_id: "cat-5",
        question_text: "How much could you realistically invest monthly to save 10 hours of work per week?",
        question_type: "multiple_choice",
        options: [
          "Less than $100/month",
          "$100-300/month",
          "$300-1000/month",
          "$1000-3000/month",
          "More than $3000/month",
          "I'd need to see the ROI first"
        ],
        weight: 1.0,
        sort_order: 13,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-5",
          name: "Budget & Investment",
          description: "Understanding your investment capacity",
          icon: "dollar-sign"
        }
      },
      {
        id: "q14",
        category_id: "cat-5",
        question_text: "How do you usually decide whether to invest in something new for your business?",
        question_type: "multiple_choice",
        options: [
          "If it saves time, I'm interested",
          "I need to see clear ROI within 3 months",
          "I think long-term (1+ years)",
          "I get advice from others first",
          "I'm pretty cautious with spending"
        ],
        weight: 1.0,
        sort_order: 14,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-5",
          name: "Budget & Investment",
          description: "Understanding your investment capacity",
          icon: "dollar-sign"
        }
      },

      // TEAM & CULTURE
      {
        id: "q15",
        category_id: "cat-6",
        question_text: "How would your team react if you suggested using AI to help with their work?",
        question_type: "multiple_choice",
        options: [
          "Excited and ready to try it",
          "Curious but a little nervous",
          "Skeptical but open-minded",
          "Worried about job security",
          "Probably resistant to change"
        ],
        weight: 1.0,
        sort_order: 15,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-6",
          name: "Team & Culture",
          description: "Understanding your team's openness to change",
          icon: "heart"
        }
      },
      {
        id: "q16",
        category_id: "cat-6",
        question_text: "What's the biggest change your business has gone through in the last 2 years?",
        question_type: "text",
        options: null,
        weight: 1.0,
        sort_order: 16,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-6",
          name: "Team & Culture",
          description: "Understanding your team's openness to change",
          icon: "heart"
        }
      },

      // CUSTOMER IMPACT
      {
        id: "q17",
        category_id: "cat-7",
        question_text: "How do your customers currently interact with your business?",
        question_type: "multiple_choice",
        options: [
          "Mostly in-person or phone calls",
          "Email and website",
          "Social media and messaging",
          "Mobile app",
          "All of the above"
        ],
        weight: 1.0,
        sort_order: 17,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-7",
          name: "Customer Experience",
          description: "Understanding your customer interactions",
          icon: "message-circle"
        }
      },
      {
        id: "q18",
        category_id: "cat-7",
        question_text: "What's one thing your customers wish you could do better or faster?",
        question_type: "text",
        options: null,
        weight: 1.0,
        sort_order: 18,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-7",
          name: "Customer Experience",
          description: "Understanding your customer interactions",
          icon: "message-circle"
        }
      },

      // FINAL THOUGHTS
      {
        id: "q19",
        category_id: "cat-8",
        question_text: "On a scale of 1-10, how urgently does your business need to work smarter, not harder?",
        question_type: "scale",
        options: null,
        weight: 1.0,
        sort_order: 19,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-8",
          name: "Priorities & Timeline",
          description: "Understanding your urgency and priorities",
          icon: "clock"
        }
      },
      {
        id: "q20",
        category_id: "cat-8",
        question_text: "What's your biggest concern or question about using AI in your business?",
        question_type: "text",
        options: null,
        weight: 1.0,
        sort_order: 20,
        is_required: true,
        is_active: true,
        created_at: new Date().toISOString(),
        assessment_categories: {
          id: "cat-8",
          name: "Priorities & Timeline",
          description: "Understanding your urgency and priorities",
          icon: "clock"
        }
      }
    ]

    // TODO: Uncomment when database is implemented
    /*
    const { data: questions, error } = await query

    if (error) {
      console.error("Error fetching assessment questions:", error)
      return []
    }

    return questions || []
    */
  } catch (error) {
    console.error("Error fetching assessment questions:", error)
    return []
  }
}

// Get assessment questions by category
export async function getAssessmentQuestionsByCategory(categoryId?: string) {
  try {
    // TODO: Replace with business database client when implemented
    console.warn("getAssessmentQuestionsByCategory: Business database integration needed")

    // Get all questions and filter by category if needed
    const allQuestions = await getAssessmentQuestions()

    if (categoryId) {
      return allQuestions.filter(q => q.category_id === categoryId)
    }

    return allQuestions
  } catch (error) {
    console.error("Error fetching assessment questions by category:", error)
    return []
  }
}

// Get all assessment categories
export async function getAssessmentCategories() {
  try {
    // TODO: Replace with business database client when implemented
    console.warn("getAssessmentCategories: Business database integration needed")

    // Return comprehensive assessment categories
    return [
      {
        id: "cat-1",
        name: "Current AI Understanding",
        description: "Understanding your team's familiarity with AI capabilities",
        icon: "brain",
        sort_order: 1,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: "cat-2",
        name: "Business Operations",
        description: "Understanding your business structure and processes",
        icon: "users",
        sort_order: 2,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: "cat-3",
        name: "Data & Information",
        description: "Understanding how you manage business information",
        icon: "database",
        sort_order: 3,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: "cat-4",
        name: "Technical Readiness",
        description: "Assessing your comfort with technology",
        icon: "computer",
        sort_order: 4,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: "cat-5",
        name: "Budget & Investment",
        description: "Understanding your investment capacity",
        icon: "dollar-sign",
        sort_order: 5,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: "cat-6",
        name: "Team & Culture",
        description: "Understanding your team's openness to change",
        icon: "heart",
        sort_order: 6,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: "cat-7",
        name: "Customer Experience",
        description: "Understanding your customer interactions",
        icon: "message-circle",
        sort_order: 7,
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: "cat-8",
        name: "Priorities & Timeline",
        description: "Understanding your urgency and priorities",
        icon: "clock",
        sort_order: 8,
        is_active: true,
        created_at: new Date().toISOString()
      }
    ]
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
    const responses: { [key: string]: string } = {}

    for (const question of questions) {
      const response = formData.get(`question_${question.id}`) as string
      
      if (response) {
        const score = calculateQuestionScore(response, question)
        totalScore += score
        validResponses++
        responses[question.id] = response

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

    // Send email notification
    try {
      await sendAssessmentEmail({
        userId,
        title,
        responses,
        questions,
        overallScore,
        completionPercentage,
        submittedAt: new Date().toISOString()
      })
    } catch (emailError) {
      console.error("Error sending assessment email:", emailError)
      // Don't fail the submission if email fails
    }

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

// Email function to send assessment results
async function sendAssessmentEmail(data: {
  userId: string
  title: string
  responses: { [key: string]: string }
  questions: any[]
  overallScore: number
  completionPercentage: number
  submittedAt: string
}) {
  try {
    // Format the assessment data for email
    const emailContent = formatAssessmentEmailContent(data)
    
    // Try using Resend API first (preferred)
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)
      
      await resend.emails.send({
        from: 'assessments@curveai.com',
        to: 'donjon.systems@gmail.com',
        subject: `New Assessment Submitted: ${data.title}`,
        html: emailContent
      })
      return
    }
    
    // Fallback to SendGrid
    if (process.env.SENDGRID_API_KEY) {
      const sgMail = await import('@sendgrid/mail')
      sgMail.default.setApiKey(process.env.SENDGRID_API_KEY)
      
      await sgMail.default.send({
        to: 'donjon.systems@gmail.com',
        from: 'assessments@curveai.com',
        subject: `New Assessment Submitted: ${data.title}`,
        html: emailContent
      })
      return
    }
    
    // If no email service is configured, log a warning
    console.warn("No email service configured. Assessment data:", {
      userId: data.userId,
      title: data.title,
      score: data.overallScore,
      completionPercentage: data.completionPercentage
    })
  } catch (error) {
    console.error("Error in sendAssessmentEmail:", error)
    throw error
  }
}

// Helper function to format assessment data as HTML email
function formatAssessmentEmailContent(data: {
  userId: string
  title: string
  responses: { [key: string]: string }
  questions: any[]
  overallScore: number
  completionPercentage: number
  submittedAt: string
}): string {
  const questionsMap = new Map(data.questions.map(q => [q.id, q]))
  
  let responsesHtml = `
    <h3>Assessment Responses:</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
      <thead style="background-color: #f5f5f5;">
        <tr>
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Question</th>
          <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Response</th>
        </tr>
      </thead>
      <tbody>
  `
  
  for (const [questionId, response] of Object.entries(data.responses)) {
    const question = questionsMap.get(questionId)
    const questionText = question?.question_text || questionId
    responsesHtml += `
      <tr>
        <td style="padding: 10px; border: 1px solid #ddd; vertical-align: top;"><strong>${questionText}</strong></td>
        <td style="padding: 10px; border: 1px solid #ddd;">${response}</td>
      </tr>
    `
  }
  
  responsesHtml += `
      </tbody>
    </table>
  `
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0076FF; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .header h1 { margin: 0; }
          .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
          .stat-box { background-color: #f9f9f9; padding: 15px; border-left: 4px solid #0076FF; border-radius: 3px; }
          .stat-box h3 { margin: 0 0 10px 0; color: #0076FF; }
          .stat-box p { margin: 0; font-size: 24px; font-weight: bold; }
          .info-box { background-color: #f0f0f0; padding: 15px; border-radius: 3px; margin-bottom: 20px; }
          .footer { color: #999; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Assessment Submitted</h1>
            <p>${data.title}</p>
          </div>
          
          <div class="info-box">
            <p><strong>Submission Time:</strong> ${new Date(data.submittedAt).toLocaleString()}</p>
            <p><strong>User ID:</strong> ${data.userId}</p>
          </div>
          
          <div class="stats">
            <div class="stat-box">
              <h3>Overall Score</h3>
              <p>${data.overallScore.toFixed(1)}/10</p>
            </div>
            <div class="stat-box">
              <h3>Completion</h3>
              <p>${data.completionPercentage.toFixed(0)}%</p>
            </div>
          </div>
          
          ${responsesHtml}
          
          <div class="footer">
            <p>This assessment was submitted through the Curve AI Solutions assessment system.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

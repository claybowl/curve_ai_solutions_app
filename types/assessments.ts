/**
 * Types for assessment system (V2 Schema)
 */

export interface AssessmentCategory {
  id: string
  name: string
  description?: string
  icon?: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface AssessmentQuestion {
  id: string
  category_id?: string
  question_text: string
  question_type: 'multiple_choice' | 'scale' | 'boolean' | 'text'
  options?: any // JSONB for multiple choice options
  weight: number
  sort_order: number
  is_required: boolean
  is_active: boolean
  created_at: string
}

export interface Assessment {
  id: string
  user_id: string
  title?: string
  status: 'in_progress' | 'completed' | 'abandoned'
  overall_score?: number
  completion_percentage: number
  started_at: string
  completed_at?: string
  created_at: string
}

export interface AssessmentResponse {
  id: string
  assessment_id: string
  question_id: string
  response_value: string
  response_score?: number
  created_at: string
}

export interface AssessmentResult {
  id: string
  assessment_id: string
  category_id: string
  category_score: number
  recommendations?: any // JSONB
  strengths?: string[]
  improvement_areas?: string[]
  created_at: string
}

// Extended interfaces for API responses
export interface AssessmentWithDetails extends Assessment {
  category?: AssessmentCategory
  responses?: AssessmentResponseWithQuestion[]
  results?: AssessmentResultWithCategory[]
  user?: {
    first_name?: string
    last_name?: string
    company_name?: string
  }
}

export interface AssessmentResponseWithQuestion extends AssessmentResponse {
  question?: AssessmentQuestion
}

export interface AssessmentResultWithCategory extends AssessmentResult {
  category?: AssessmentCategory
}

export interface AssessmentQuestionWithCategory extends AssessmentQuestion {
  category?: AssessmentCategory
}

// Form data types
export interface AssessmentFormData {
  title?: string
  responses: Record<string, string> // question_id -> response_value
}

export interface AssessmentCategoryFormData {
  name: string
  description?: string
  icon?: string
  sort_order?: number
  is_active?: boolean
}

export interface AssessmentQuestionFormData {
  category_id?: string
  question_text: string
  question_type: 'multiple_choice' | 'scale' | 'boolean' | 'text'
  options?: any
  weight?: number
  sort_order?: number
  is_required?: boolean
  is_active?: boolean
}

// Filter types
export interface AssessmentFilter {
  user_id?: string
  status?: 'in_progress' | 'completed' | 'abandoned'
  category_id?: string
  limit?: number
  offset?: number
  sortBy?: 'created_at' | 'completed_at' | 'overall_score'
  sortDirection?: 'asc' | 'desc'
}

export interface AssessmentQuestionFilter {
  category_id?: string
  question_type?: 'multiple_choice' | 'scale' | 'boolean' | 'text'
  is_active?: boolean
  is_required?: boolean
}

// Summary/list types
export interface AssessmentSummary {
  id: string
  title?: string
  status: 'in_progress' | 'completed' | 'abandoned'
  overall_score?: number
  completion_percentage: number
  started_at: string
  completed_at?: string
  user_name?: string
  categories_completed?: number
  total_categories?: number
}

export interface AssessmentStats {
  total_assessments: number
  completed_assessments: number
  in_progress_assessments: number
  average_score: number
  completion_rate: number
  categories_breakdown: {
    category_name: string
    average_score: number
    total_responses: number
  }[]
}
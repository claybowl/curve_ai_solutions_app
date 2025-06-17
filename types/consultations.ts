/**
 * Types for consultation system (V2 Schema)
 */

export interface Consultation {
  id: string
  user_id: string
  subject: string
  description: string
  consultation_type?: 'strategy' | 'implementation' | 'assessment' | 'training' | 'other'
  urgency: 'low' | 'medium' | 'high' | 'critical'
  company_size?: string
  industry?: string
  budget_range?: string
  timeline?: string
  current_ai_usage?: string
  specific_challenges?: string
  status: 'pending' | 'in_review' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  assigned_consultant_id?: string
  priority_score: number
  preferred_contact_method?: 'email' | 'phone' | 'video' | 'in_person'
  preferred_times?: any // JSONB
  scheduled_at?: string
  consultation_notes?: string
  follow_up_required: boolean
  follow_up_date?: string
  created_at: string
  updated_at: string
}

// Extended interfaces for API responses
export interface ConsultationWithDetails extends Consultation {
  user?: {
    id: string
    first_name?: string
    last_name?: string
    email: string
    company_name?: string
    phone?: string
  }
  assigned_consultant?: {
    id: string
    first_name?: string
    last_name?: string
    email: string
  }
}

// Summary/list types
export interface ConsultationSummary {
  id: string
  subject: string
  consultation_type?: 'strategy' | 'implementation' | 'assessment' | 'training' | 'other'
  urgency: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'in_review' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  user_name?: string
  company_name?: string
  assigned_consultant_name?: string
  priority_score: number
  created_at: string
  scheduled_at?: string
}

// Form data types
export interface ConsultationFormData {
  subject: string
  description: string
  consultation_type?: 'strategy' | 'implementation' | 'assessment' | 'training' | 'other'
  urgency?: 'low' | 'medium' | 'high' | 'critical'
  company_size?: string
  industry?: string
  budget_range?: string
  timeline?: string
  current_ai_usage?: string
  specific_challenges?: string
  preferred_contact_method?: 'email' | 'phone' | 'video' | 'in_person'
  preferred_times?: any
}

export interface ConsultationUpdateFormData {
  status?: 'pending' | 'in_review' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  assigned_consultant_id?: string
  priority_score?: number
  scheduled_at?: string
  consultation_notes?: string
  follow_up_required?: boolean
  follow_up_date?: string
}

// Filter types
export interface ConsultationFilter {
  user_id?: string
  consultation_type?: 'strategy' | 'implementation' | 'assessment' | 'training' | 'other'
  urgency?: 'low' | 'medium' | 'high' | 'critical'
  status?: 'pending' | 'in_review' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  assigned_consultant_id?: string
  industry?: string
  date_from?: string
  date_to?: string
  search_term?: string
  limit?: number
  offset?: number
  sortBy?: 'created_at' | 'scheduled_at' | 'priority_score' | 'urgency'
  sortDirection?: 'asc' | 'desc'
}

// Stats types
export interface ConsultationStats {
  total_consultations: number
  pending_consultations: number
  in_progress_consultations: number
  completed_consultations: number
  cancelled_consultations: number
  average_resolution_time: number // in days
  status_breakdown: {
    status: string
    count: number
    percentage: number
  }[]
  type_breakdown: {
    consultation_type: string
    count: number
  }[]
  urgency_breakdown: {
    urgency: string
    count: number
  }[]
  consultant_workload: {
    consultant_id: string
    consultant_name: string
    active_consultations: number
    completed_consultations: number
  }[]
}

// Priority and urgency helpers
export const CONSULTATION_PRIORITIES = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4
} as const

export const CONSULTATION_STATUS_COLORS = {
  pending: 'yellow',
  in_review: 'blue',
  scheduled: 'purple',
  in_progress: 'orange',
  completed: 'green',
  cancelled: 'red'
} as const

export const CONSULTATION_URGENCY_COLORS = {
  low: 'green',
  medium: 'yellow',
  high: 'orange',
  critical: 'red'
} as const
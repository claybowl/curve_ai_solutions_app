/**
 * Types for user and profile system (V2 Schema)
 */

export interface UserProfile {
  id: string
  user_id: string
  email: string
  first_name?: string
  last_name?: string
  company_name?: string
  phone?: string
  role: 'admin' | 'client' | 'consultant'
  industry?: string
  company_size?: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+'
  job_title?: string
  notification_preferences: any // JSONB
  timezone: string
  subscription_status: 'free' | 'basic' | 'premium' | 'enterprise'
  subscription_starts_at?: string
  subscription_ends_at?: string
  onboarding_completed: boolean
  last_login_at?: string
  created_at: string
  updated_at: string
}

// Extended interfaces for API responses
export interface UserProfileWithAuth extends UserProfile {
  auth_user?: {
    id: string
    email: string
    email_confirmed_at?: string
    last_sign_in_at?: string
    created_at: string
  }
}

// Summary/list types
export interface UserSummary {
  id: string
  user_id: string
  email: string
  first_name?: string
  last_name?: string
  company_name?: string
  role: 'admin' | 'client' | 'consultant'
  subscription_status: 'free' | 'basic' | 'premium' | 'enterprise'
  last_login_at?: string
  created_at: string
  full_name?: string
}

// Form data types
export interface UserProfileFormData {
  email?: string
  first_name?: string
  last_name?: string
  company_name?: string
  phone?: string
  role?: 'admin' | 'client' | 'consultant'
  industry?: string
  company_size?: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+'
  job_title?: string
  notification_preferences?: any
  timezone?: string
  subscription_status?: 'free' | 'basic' | 'premium' | 'enterprise'
  onboarding_completed?: boolean
}

export interface UserRegistrationFormData {
  email: string
  password: string
  first_name: string
  last_name: string
  company_name?: string
  phone?: string
  industry?: string
  company_size?: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+'
  job_title?: string
}

export interface UserOnboardingFormData {
  company_name?: string
  industry?: string
  company_size?: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+'
  job_title?: string
  notification_preferences?: any
  timezone?: string
}

// Filter types
export interface UserFilter {
  role?: 'admin' | 'client' | 'consultant'
  subscription_status?: 'free' | 'basic' | 'premium' | 'enterprise'
  industry?: string
  company_size?: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+'
  onboarding_completed?: boolean
  search_term?: string
  date_from?: string
  date_to?: string
  limit?: number
  offset?: number
  sortBy?: 'created_at' | 'last_login_at' | 'first_name' | 'company_name'
  sortDirection?: 'asc' | 'desc'
}

// Stats types
export interface UserStats {
  total_users: number
  active_users: number // logged in within last 30 days
  new_users_this_month: number
  subscription_breakdown: {
    status: string
    count: number
    percentage: number
  }[]
  role_breakdown: {
    role: string
    count: number
  }[]
  company_size_breakdown: {
    size: string
    count: number
  }[]
  industry_breakdown: {
    industry: string
    count: number
  }[]
  onboarding_completion_rate: number
}

// Notification preference types
export interface NotificationPreferences {
  email: boolean
  sms: boolean
  push: boolean
  in_app: boolean
  marketing_emails: boolean
  assessment_reminders: boolean
  consultation_updates: boolean
  tool_recommendations: boolean
  weekly_digest: boolean
}

// Role and permission types
export type UserRole = 'admin' | 'client' | 'consultant'
export type SubscriptionStatus = 'free' | 'basic' | 'premium' | 'enterprise'
export type CompanySize = '1-10' | '11-50' | '51-200' | '201-1000' | '1000+'

// Helper constants
export const USER_ROLES: Record<UserRole, string> = {
  admin: 'Administrator',
  client: 'Client',
  consultant: 'Consultant'
} as const

export const SUBSCRIPTION_STATUSES: Record<SubscriptionStatus, string> = {
  free: 'Free',
  basic: 'Basic',
  premium: 'Premium',
  enterprise: 'Enterprise'
} as const

export const COMPANY_SIZES: Record<CompanySize, string> = {
  '1-10': '1-10 employees',
  '11-50': '11-50 employees',
  '51-200': '51-200 employees',
  '201-1000': '201-1000 employees',
  '1000+': '1000+ employees'
} as const

export const ROLE_COLORS = {
  admin: 'red',
  client: 'blue',
  consultant: 'green'
} as const

export const SUBSCRIPTION_COLORS = {
  free: 'gray',
  basic: 'blue',
  premium: 'purple',
  enterprise: 'gold'
} as const

// Legacy compatibility types (for backward compatibility)
export interface LegacyUser {
  id: number
  email: string
  firstName: string
  lastName: string
  companyName?: string
  role: string
  createdAt: Date
  updatedAt: Date
}

export interface LegacyUserFormData {
  email: string
  password?: string
  firstName: string
  lastName: string
  companyName?: string
  role: string
}
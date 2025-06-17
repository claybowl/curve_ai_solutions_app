/**
 * Comprehensive V2 Database Schema Types
 * This file contains all types for the V2 database schema including analytics, notifications, and blog
 */

// Re-export all existing V2 types
export * from './assessments'
export * from './consultations'
export * from './prompts'
export * from './tools'
export * from './users'

// Analytics & Reporting Types
export interface AnalyticsEvent {
  id: string
  user_id?: string
  event_type: string
  event_category: string
  event_action: string
  event_label?: string
  page_url?: string
  referrer?: string
  user_agent?: string
  ip_address?: string
  session_id?: string
  event_data?: any // JSONB
  created_at: string
}

export interface UserEngagementMetrics {
  id: string
  user_id: string
  overall_engagement_score: number
  assessment_engagement: number
  tool_usage_engagement: number
  consultation_engagement: number
  total_sessions: number
  total_time_spent: number // in minutes
  last_activity_at?: string
  metric_date: string
  created_at: string
}

// Notifications Types
export interface NotificationTemplate {
  id: string
  name: string
  subject_template?: string
  body_template: string
  notification_type: 'email' | 'sms' | 'push' | 'in_app'
  variables?: any // JSONB
  is_active: boolean
  created_at: string
}

export interface UserNotification {
  id: string
  user_id: string
  title: string
  message: string
  notification_type: 'info' | 'success' | 'warning' | 'error'
  delivery_method: 'email' | 'sms' | 'push' | 'in_app'
  delivered_at?: string
  is_read: boolean
  read_at?: string
  related_entity_type?: string
  related_entity_id?: string
  action_url?: string
  created_at: string
}

// Blog/Content Management Types
export interface BlogPost {
  id: string
  author_id?: string
  title: string
  slug: string
  excerpt?: string
  content: string
  featured_image_url?: string
  meta_title?: string
  meta_description?: string
  keywords?: string[]
  category?: string
  tags?: string[]
  status: 'draft' | 'published' | 'archived'
  published_at?: string
  view_count: number
  reading_time?: number
  created_at: string
  updated_at: string
}

// Extended interfaces for API responses
export interface BlogPostWithAuthor extends BlogPost {
  author?: {
    id: string
    first_name?: string
    last_name?: string
    company_name?: string
  }
}

export interface AnalyticsEventWithUser extends AnalyticsEvent {
  user?: {
    id: string
    first_name?: string
    last_name?: string
    email: string
  }
}

export interface UserNotificationWithUser extends UserNotification {
  user?: {
    id: string
    first_name?: string
    last_name?: string
    email: string
  }
}

// Form data types
export interface BlogPostFormData {
  title: string
  slug?: string
  excerpt?: string
  content: string
  featured_image_url?: string
  meta_title?: string
  meta_description?: string
  keywords?: string[]
  category?: string
  tags?: string[]
  status?: 'draft' | 'published' | 'archived'
  published_at?: string
}

export interface NotificationTemplateFormData {
  name: string
  subject_template?: string
  body_template: string
  notification_type: 'email' | 'sms' | 'push' | 'in_app'
  variables?: any
  is_active?: boolean
}

export interface UserNotificationFormData {
  title: string
  message: string
  notification_type?: 'info' | 'success' | 'warning' | 'error'
  delivery_method?: 'email' | 'sms' | 'push' | 'in_app'
  related_entity_type?: string
  related_entity_id?: string
  action_url?: string
}

// Filter types
export interface BlogPostFilter {
  author_id?: string
  category?: string
  tag?: string
  status?: 'draft' | 'published' | 'archived'
  search_term?: string
  date_from?: string
  date_to?: string
  limit?: number
  offset?: number
  sortBy?: 'created_at' | 'published_at' | 'title' | 'view_count'
  sortDirection?: 'asc' | 'desc'
}

export interface AnalyticsEventFilter {
  user_id?: string
  event_type?: string
  event_category?: string
  date_from?: string
  date_to?: string
  limit?: number
  offset?: number
}

export interface UserNotificationFilter {
  user_id?: string
  notification_type?: 'info' | 'success' | 'warning' | 'error'
  delivery_method?: 'email' | 'sms' | 'push' | 'in_app'
  is_read?: boolean
  date_from?: string
  date_to?: string
  limit?: number
  offset?: number
}

// Stats types
export interface BlogStats {
  total_posts: number
  published_posts: number
  draft_posts: number
  total_views: number
  average_reading_time: number
  category_breakdown: {
    category: string
    post_count: number
    total_views: number
  }[]
  popular_posts: {
    id: string
    title: string
    view_count: number
    published_at?: string
  }[]
}

export interface AnalyticsStats {
  total_events: number
  unique_users: number
  popular_pages: {
    page_url: string
    event_count: number
  }[]
  event_breakdown: {
    event_type: string
    count: number
  }[]
  daily_activity: {
    date: string
    event_count: number
    unique_users: number
  }[]
}

export interface NotificationStats {
  total_notifications: number
  delivered_notifications: number
  read_notifications: number
  delivery_rate: number
  read_rate: number
  method_breakdown: {
    delivery_method: string
    count: number
    delivery_rate: number
  }[]
}

// Dashboard overview types
export interface DashboardOverview {
  users: {
    total: number
    new_this_month: number
    active_users: number
  }
  assessments: {
    total: number
    completed: number
    average_score: number
    completion_rate: number
  }
  consultations: {
    total: number
    pending: number
    in_progress: number
    completed: number
  }
  tools: {
    total: number
    active: number
    total_usage: number
  }
  prompts: {
    total: number
    public: number
    total_usage: number
  }
  blog: {
    total_posts: number
    published: number
    total_views: number
  }
}

// Common utility types
export type DatabaseTable = 
  | 'profiles'
  | 'assessment_categories'
  | 'assessment_questions' 
  | 'assessments'
  | 'assessment_responses'
  | 'assessment_results'
  | 'consultations'
  | 'tool_categories'
  | 'ai_tools'
  | 'user_tool_usage'
  | 'prompt_categories'
  | 'prompts'
  | 'user_prompt_collections'
  | 'prompt_collection_items'
  | 'analytics_events'
  | 'user_engagement_metrics'
  | 'notification_templates'
  | 'user_notifications'
  | 'blog_posts'

export type SortDirection = 'asc' | 'desc'

export interface PaginationParams {
  limit?: number
  offset?: number
  sortBy?: string
  sortDirection?: SortDirection
}

export interface DatabaseResponse<T> {
  data: T[]
  error?: string
  total?: number
  hasMore?: boolean
}

// Helper types for server actions
export interface ActionResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface CreateActionResponse<T = any> extends ActionResponse<T> {
  id?: string
}

export interface UpdateActionResponse<T = any> extends ActionResponse<T> {
  updated?: boolean
}

export interface DeleteActionResponse extends ActionResponse {
  deleted?: boolean
}

// Validation types
export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

// Export constants for easy reference
export const DATABASE_TABLES: Record<string, DatabaseTable> = {
  PROFILES: 'profiles',
  ASSESSMENT_CATEGORIES: 'assessment_categories',
  ASSESSMENT_QUESTIONS: 'assessment_questions',
  ASSESSMENTS: 'assessments',
  ASSESSMENT_RESPONSES: 'assessment_responses',
  ASSESSMENT_RESULTS: 'assessment_results',
  CONSULTATIONS: 'consultations',
  TOOL_CATEGORIES: 'tool_categories',
  AI_TOOLS: 'ai_tools',
  USER_TOOL_USAGE: 'user_tool_usage',
  PROMPT_CATEGORIES: 'prompt_categories',
  PROMPTS: 'prompts',
  USER_PROMPT_COLLECTIONS: 'user_prompt_collections',
  PROMPT_COLLECTION_ITEMS: 'prompt_collection_items',
  ANALYTICS_EVENTS: 'analytics_events',
  USER_ENGAGEMENT_METRICS: 'user_engagement_metrics',
  NOTIFICATION_TEMPLATES: 'notification_templates',
  USER_NOTIFICATIONS: 'user_notifications',
  BLOG_POSTS: 'blog_posts'
} as const
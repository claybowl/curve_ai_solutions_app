/**
 * Types for AI tools functionality (V2 Schema)
 */

export interface ToolCategory {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  sort_order: number
  is_featured: boolean
  created_at: string
}

export interface AiTool {
  id: string
  category_id?: string
  name: string
  description?: string
  detailed_description?: string
  version: string
  tool_type?: 'chatbot' | 'automation' | 'analysis' | 'integration' | 'custom'
  complexity_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  api_endpoint?: string
  configuration?: any // JSONB
  requirements?: any // JSONB
  pricing_model?: 'free' | 'freemium' | 'subscription' | 'one_time' | 'custom'
  pricing_details?: any // JSONB
  target_audience?: string[]
  use_cases?: string[]
  performance_metrics?: any // JSONB
  average_rating: number
  total_ratings: number
  usage_count: number
  status: 'active' | 'beta' | 'deprecated' | 'maintenance'
  is_featured: boolean
  is_public: boolean
  tags?: string[]
  keywords?: string[]
  created_at: string
  updated_at: string
}

export interface UserToolUsage {
  id: string
  user_id: string
  tool_id: string
  session_duration?: number
  actions_performed: number
  success_rate?: number
  satisfaction_rating?: number
  use_case?: string
  session_notes?: string
  created_at: string
}

// Extended interfaces for API responses
export interface AiToolWithCategory extends AiTool {
  category?: ToolCategory
}

export interface AiToolWithDetails extends AiTool {
  category?: ToolCategory
  recent_usage?: UserToolUsage[]
  user_rating?: number
  user_usage_count?: number
}

export interface ToolCategoryWithTools extends ToolCategory {
  tools?: AiTool[]
  tools_count?: number
}

// Summary/list types
export interface AiToolSummary {
  id: string
  name: string
  description?: string
  category_name?: string
  tool_type?: 'chatbot' | 'automation' | 'analysis' | 'integration' | 'custom'
  complexity_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  status: 'active' | 'beta' | 'deprecated' | 'maintenance'
  is_featured: boolean
  is_public: boolean
  average_rating: number
  usage_count: number
  version: string
}

export interface ToolCategorySummary {
  id: string
  name: string
  description?: string
  icon?: string
  color?: string
  tools_count: number
  is_featured: boolean
}

// Form data types
export interface AiToolFormData {
  name: string
  description?: string
  detailed_description?: string
  category_id?: string
  version?: string
  tool_type?: 'chatbot' | 'automation' | 'analysis' | 'integration' | 'custom'
  complexity_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  api_endpoint?: string
  configuration?: any
  requirements?: any
  pricing_model?: 'free' | 'freemium' | 'subscription' | 'one_time' | 'custom'
  pricing_details?: any
  target_audience?: string[]
  use_cases?: string[]
  status?: 'active' | 'beta' | 'deprecated' | 'maintenance'
  is_featured?: boolean
  is_public?: boolean
  tags?: string[]
  keywords?: string[]
}

export interface ToolCategoryFormData {
  name: string
  description?: string
  icon?: string
  color?: string
  sort_order?: number
  is_featured?: boolean
}

export interface UserToolUsageFormData {
  tool_id: string
  session_duration?: number
  actions_performed?: number
  success_rate?: number
  satisfaction_rating?: number
  use_case?: string
  session_notes?: string
}

// Filter types
export interface AiToolFilter {
  category_id?: string
  tool_type?: 'chatbot' | 'automation' | 'analysis' | 'integration' | 'custom'
  complexity_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  pricing_model?: 'free' | 'freemium' | 'subscription' | 'one_time' | 'custom'
  status?: 'active' | 'beta' | 'deprecated' | 'maintenance'
  is_featured?: boolean
  is_public?: boolean
  search_term?: string
  tags?: string[]
  limit?: number
  offset?: number
  sortBy?: 'usage_count' | 'created_at' | 'name' | 'average_rating'
  sortDirection?: 'asc' | 'desc'
}

export interface ToolCategoryFilter {
  is_featured?: boolean
  name?: string
}

export interface UserToolUsageFilter {
  user_id?: string
  tool_id?: string
  date_from?: string
  date_to?: string
  satisfaction_rating?: number
}

// Legacy compatibility types (for backward compatibility)
export interface LegacyAiTool {
  id: number
  name: string
  description: string
  apiEndpoint?: string
  iconName?: string
  category?: string
  isActive: boolean
  createdBy?: number
  createdAt: Date
  updatedAt: Date
}

export interface AiToolCategory {
  id: string
  name: string
  description: string
  pattern: string[]
  color: string
  icon: string
  tools: AiTool[]
}

// Stats types
export interface ToolStats {
  total_tools: number
  active_tools: number
  featured_tools: number
  average_rating: number
  total_usage: number
  categories_breakdown: {
    category_name: string
    tool_count: number
    average_rating: number
    total_usage: number
  }[]
  type_breakdown: {
    tool_type: string
    count: number
  }[]
  complexity_breakdown: {
    level: string
    count: number
  }[]
}
/**
 * Types for prompt library functionality (V2 Schema)
 */

export interface PromptCategory {
  id: string
  name: string
  description?: string
  icon?: string
  parent_category_id?: string
  sort_order: number
  created_at: string
}

export interface Prompt {
  id: string
  category_id?: string
  created_by?: string
  title: string
  description?: string
  prompt_text: string
  example_output?: string
  ai_model?: string
  complexity_level?: 'beginner' | 'intermediate' | 'advanced'
  estimated_tokens?: number
  use_case?: string
  industry?: string[]
  tags?: string[]
  effectiveness_score: number
  usage_count: number
  average_rating: number
  total_ratings: number
  status: 'active' | 'draft' | 'archived' | 'under_review'
  is_featured: boolean
  is_public: boolean
  version: string
  previous_version_id?: string
  created_at: string
  updated_at: string
}

export interface UserPromptCollection {
  id: string
  user_id: string
  name: string
  description?: string
  is_private: boolean
  created_at: string
}

export interface PromptCollectionItem {
  id: string
  collection_id: string
  prompt_id: string
  added_at: string
}

// Extended interfaces for API responses
export interface PromptWithAuthor extends Prompt {
  author?: {
    id: string
    first_name?: string
    last_name?: string
  }
  category?: PromptCategory
}

export interface PromptWithDetails extends Prompt {
  category?: PromptCategory
  author?: {
    id: string
    first_name?: string
    last_name?: string
    company_name?: string
  }
  collections?: UserPromptCollection[]
  is_saved?: boolean
}

export interface PromptCollectionWithItems extends UserPromptCollection {
  items?: PromptCollectionItemWithPrompt[]
  prompts_count?: number
}

export interface PromptCollectionItemWithPrompt extends PromptCollectionItem {
  prompt?: Prompt
}

// Summary/list types
export interface PromptSummary {
  id: string
  title: string
  description?: string
  category_name?: string
  tags?: string[]
  is_public: boolean
  is_featured: boolean
  author_name?: string
  usage_count: number
  average_rating: number
  version: string
  complexity_level?: 'beginner' | 'intermediate' | 'advanced'
  effectiveness_score: number
}

// Form data types
export interface PromptFormData {
  title: string
  description?: string
  prompt_text: string
  category_id?: string
  example_output?: string
  ai_model?: string
  complexity_level?: 'beginner' | 'intermediate' | 'advanced'
  estimated_tokens?: number
  use_case?: string
  industry?: string[]
  tags?: string[]
  is_public: boolean
  is_featured?: boolean
  status?: 'active' | 'draft' | 'archived' | 'under_review'
}

export interface PromptCategoryFormData {
  name: string
  description?: string
  icon?: string
  parent_category_id?: string
  sort_order?: number
}

export interface PromptCollectionFormData {
  name: string
  description?: string
  is_private?: boolean
}

// Filter types
export interface PromptFilter {
  category_id?: string
  tag?: string
  industry?: string
  created_by?: string
  is_public?: boolean
  is_featured?: boolean
  status?: 'active' | 'draft' | 'archived' | 'under_review'
  complexity_level?: 'beginner' | 'intermediate' | 'advanced'
  ai_model?: string
  search_term?: string
  limit?: number
  offset?: number
  sortBy?: 'usage_count' | 'created_at' | 'title' | 'average_rating' | 'effectiveness_score'
  sortDirection?: 'asc' | 'desc'
}

export interface PromptCategoryFilter {
  parent_category_id?: string
  name?: string
}

// Legacy compatibility types (for backward compatibility)
export interface LegacyPrompt {
  id: number
  title: string
  description?: string
  content: string
  category: string
  tags?: string[]
  isPublic: boolean
  isFeatured: boolean
  authorId: number
  version: number
  usageCount: number
  createdAt: Date
  updatedAt: Date
}

export interface SavedPrompt {
  id: string
  user_id: string
  prompt_id: string
  prompt?: Prompt
  collection_id?: string
  added_at: string
}

// Stats types
export interface PromptStats {
  total_prompts: number
  public_prompts: number
  featured_prompts: number
  average_rating: number
  total_usage: number
  categories_breakdown: {
    category_name: string
    prompt_count: number
    average_rating: number
  }[]
  complexity_breakdown: {
    level: string
    count: number
  }[]
}
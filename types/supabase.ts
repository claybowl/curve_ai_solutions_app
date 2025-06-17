/**
 * TypeScript types for Supabase V2 Database Schema
 * Generated based on database-schema-v2.sql
 */

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          email: string
          first_name: string | null
          last_name: string | null
          company_name: string | null
          phone: string | null
          role: 'admin' | 'client' | 'consultant'
          industry: string | null
          company_size: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+' | null
          job_title: string | null
          notification_preferences: any // JSONB
          timezone: string
          subscription_status: 'free' | 'basic' | 'premium' | 'enterprise'
          subscription_starts_at: string | null
          subscription_ends_at: string | null
          onboarding_completed: boolean
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          company_name?: string | null
          phone?: string | null
          role?: 'admin' | 'client' | 'consultant'
          industry?: string | null
          company_size?: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+' | null
          job_title?: string | null
          notification_preferences?: any
          timezone?: string
          subscription_status?: 'free' | 'basic' | 'premium' | 'enterprise'
          subscription_starts_at?: string | null
          subscription_ends_at?: string | null
          onboarding_completed?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          company_name?: string | null
          phone?: string | null
          role?: 'admin' | 'client' | 'consultant'
          industry?: string | null
          company_size?: '1-10' | '11-50' | '51-200' | '201-1000' | '1000+' | null
          job_title?: string | null
          notification_preferences?: any
          timezone?: string
          subscription_status?: 'free' | 'basic' | 'premium' | 'enterprise'
          subscription_starts_at?: string | null
          subscription_ends_at?: string | null
          onboarding_completed?: boolean
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      assessment_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      assessment_questions: {
        Row: {
          id: string
          category_id: string | null
          question_text: string
          question_type: 'multiple_choice' | 'scale' | 'boolean' | 'text'
          options: any | null // JSONB
          weight: number
          sort_order: number
          is_required: boolean
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          question_text: string
          question_type: 'multiple_choice' | 'scale' | 'boolean' | 'text'
          options?: any | null
          weight?: number
          sort_order?: number
          is_required?: boolean
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          question_text?: string
          question_type?: 'multiple_choice' | 'scale' | 'boolean' | 'text'
          options?: any | null
          weight?: number
          sort_order?: number
          is_required?: boolean
          is_active?: boolean
          created_at?: string
        }
      }
      assessments: {
        Row: {
          id: string
          user_id: string
          title: string | null
          status: 'in_progress' | 'completed' | 'abandoned'
          overall_score: number | null
          completion_percentage: number
          started_at: string
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          status?: 'in_progress' | 'completed' | 'abandoned'
          overall_score?: number | null
          completion_percentage?: number
          started_at?: string
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          status?: 'in_progress' | 'completed' | 'abandoned'
          overall_score?: number | null
          completion_percentage?: number
          started_at?: string
          completed_at?: string | null
          created_at?: string
        }
      }
      assessment_responses: {
        Row: {
          id: string
          assessment_id: string
          question_id: string
          response_value: string
          response_score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          question_id: string
          response_value: string
          response_score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          question_id?: string
          response_value?: string
          response_score?: number | null
          created_at?: string
        }
      }
      assessment_results: {
        Row: {
          id: string
          assessment_id: string
          category_id: string
          category_score: number
          recommendations: any | null // JSONB
          strengths: string[] | null
          improvement_areas: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          assessment_id: string
          category_id: string
          category_score: number
          recommendations?: any | null
          strengths?: string[] | null
          improvement_areas?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          assessment_id?: string
          category_id?: string
          category_score?: number
          recommendations?: any | null
          strengths?: string[] | null
          improvement_areas?: string[] | null
          created_at?: string
        }
      }
      consultations: {
        Row: {
          id: string
          user_id: string
          subject: string
          description: string
          consultation_type: 'strategy' | 'implementation' | 'assessment' | 'training' | 'other' | null
          urgency: 'low' | 'medium' | 'high' | 'critical'
          company_size: string | null
          industry: string | null
          budget_range: string | null
          timeline: string | null
          current_ai_usage: string | null
          specific_challenges: string | null
          status: 'pending' | 'in_review' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          assigned_consultant_id: string | null
          priority_score: number
          preferred_contact_method: 'email' | 'phone' | 'video' | 'in_person' | null
          preferred_times: any | null // JSONB
          scheduled_at: string | null
          consultation_notes: string | null
          follow_up_required: boolean
          follow_up_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          subject: string
          description: string
          consultation_type?: 'strategy' | 'implementation' | 'assessment' | 'training' | 'other' | null
          urgency?: 'low' | 'medium' | 'high' | 'critical'
          company_size?: string | null
          industry?: string | null
          budget_range?: string | null
          timeline?: string | null
          current_ai_usage?: string | null
          specific_challenges?: string | null
          status?: 'pending' | 'in_review' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          assigned_consultant_id?: string | null
          priority_score?: number
          preferred_contact_method?: 'email' | 'phone' | 'video' | 'in_person' | null
          preferred_times?: any | null
          scheduled_at?: string | null
          consultation_notes?: string | null
          follow_up_required?: boolean
          follow_up_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          subject?: string
          description?: string
          consultation_type?: 'strategy' | 'implementation' | 'assessment' | 'training' | 'other' | null
          urgency?: 'low' | 'medium' | 'high' | 'critical'
          company_size?: string | null
          industry?: string | null
          budget_range?: string | null
          timeline?: string | null
          current_ai_usage?: string | null
          specific_challenges?: string | null
          status?: 'pending' | 'in_review' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
          assigned_consultant_id?: string | null
          priority_score?: number
          preferred_contact_method?: 'email' | 'phone' | 'video' | 'in_person' | null
          preferred_times?: any | null
          scheduled_at?: string | null
          consultation_notes?: string | null
          follow_up_required?: boolean
          follow_up_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tool_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          color: string | null
          sort_order: number
          is_featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          color?: string | null
          sort_order?: number
          is_featured?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          color?: string | null
          sort_order?: number
          is_featured?: boolean
          created_at?: string
        }
      }
      ai_tools: {
        Row: {
          id: string
          category_id: string | null
          name: string
          description: string | null
          detailed_description: string | null
          version: string
          tool_type: 'chatbot' | 'automation' | 'analysis' | 'integration' | 'custom' | null
          complexity_level: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
          api_endpoint: string | null
          configuration: any | null // JSONB
          requirements: any | null // JSONB
          pricing_model: 'free' | 'freemium' | 'subscription' | 'one_time' | 'custom' | null
          pricing_details: any | null // JSONB
          target_audience: string[] | null
          use_cases: string[] | null
          performance_metrics: any | null // JSONB
          average_rating: number
          total_ratings: number
          usage_count: number
          status: 'active' | 'beta' | 'deprecated' | 'maintenance'
          is_featured: boolean
          is_public: boolean
          tags: string[] | null
          keywords: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          name: string
          description?: string | null
          detailed_description?: string | null
          version?: string
          tool_type?: 'chatbot' | 'automation' | 'analysis' | 'integration' | 'custom' | null
          complexity_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
          api_endpoint?: string | null
          configuration?: any | null
          requirements?: any | null
          pricing_model?: 'free' | 'freemium' | 'subscription' | 'one_time' | 'custom' | null
          pricing_details?: any | null
          target_audience?: string[] | null
          use_cases?: string[] | null
          performance_metrics?: any | null
          average_rating?: number
          total_ratings?: number
          usage_count?: number
          status?: 'active' | 'beta' | 'deprecated' | 'maintenance'
          is_featured?: boolean
          is_public?: boolean
          tags?: string[] | null
          keywords?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          detailed_description?: string | null
          version?: string
          tool_type?: 'chatbot' | 'automation' | 'analysis' | 'integration' | 'custom' | null
          complexity_level?: 'beginner' | 'intermediate' | 'advanced' | 'expert' | null
          api_endpoint?: string | null
          configuration?: any | null
          requirements?: any | null
          pricing_model?: 'free' | 'freemium' | 'subscription' | 'one_time' | 'custom' | null
          pricing_details?: any | null
          target_audience?: string[] | null
          use_cases?: string[] | null
          performance_metrics?: any | null
          average_rating?: number
          total_ratings?: number
          usage_count?: number
          status?: 'active' | 'beta' | 'deprecated' | 'maintenance'
          is_featured?: boolean
          is_public?: boolean
          tags?: string[] | null
          keywords?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      prompt_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          icon: string | null
          parent_category_id: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon?: string | null
          parent_category_id?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon?: string | null
          parent_category_id?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          category_id: string | null
          created_by: string | null
          title: string
          description: string | null
          prompt_text: string
          example_output: string | null
          ai_model: string | null
          complexity_level: 'beginner' | 'intermediate' | 'advanced' | null
          estimated_tokens: number | null
          use_case: string | null
          industry: string[] | null
          tags: string[] | null
          effectiveness_score: number
          usage_count: number
          average_rating: number
          total_ratings: number
          status: 'active' | 'draft' | 'archived' | 'under_review'
          is_featured: boolean
          is_public: boolean
          version: string
          previous_version_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id?: string | null
          created_by?: string | null
          title: string
          description?: string | null
          prompt_text: string
          example_output?: string | null
          ai_model?: string | null
          complexity_level?: 'beginner' | 'intermediate' | 'advanced' | null
          estimated_tokens?: number | null
          use_case?: string | null
          industry?: string[] | null
          tags?: string[] | null
          effectiveness_score?: number
          usage_count?: number
          average_rating?: number
          total_ratings?: number
          status?: 'active' | 'draft' | 'archived' | 'under_review'
          is_featured?: boolean
          is_public?: boolean
          version?: string
          previous_version_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string | null
          created_by?: string | null
          title?: string
          description?: string | null
          prompt_text?: string
          example_output?: string | null
          ai_model?: string | null
          complexity_level?: 'beginner' | 'intermediate' | 'advanced' | null
          estimated_tokens?: number | null
          use_case?: string | null
          industry?: string[] | null
          tags?: string[] | null
          effectiveness_score?: number
          usage_count?: number
          average_rating?: number
          total_ratings?: number
          status?: 'active' | 'draft' | 'archived' | 'under_review'
          is_featured?: boolean
          is_public?: boolean
          version?: string
          previous_version_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_prompt_collections: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          is_private: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          is_private?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          is_private?: boolean
          created_at?: string
        }
      }
      prompt_collection_items: {
        Row: {
          id: string
          collection_id: string
          prompt_id: string
          added_at: string
        }
        Insert: {
          id?: string
          collection_id: string
          prompt_id: string
          added_at?: string
        }
        Update: {
          id?: string
          collection_id?: string
          prompt_id?: string
          added_at?: string
        }
      }
      user_tool_usage: {
        Row: {
          id: string
          user_id: string
          tool_id: string
          session_duration: number | null
          actions_performed: number
          success_rate: number | null
          satisfaction_rating: number | null
          use_case: string | null
          session_notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          tool_id: string
          session_duration?: number | null
          actions_performed?: number
          success_rate?: number | null
          satisfaction_rating?: number | null
          use_case?: string | null
          session_notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          tool_id?: string
          session_duration?: number | null
          actions_performed?: number
          success_rate?: number | null
          satisfaction_rating?: number | null
          use_case?: string | null
          session_notes?: string | null
          created_at?: string
        }
      }
      analytics_events: {
        Row: {
          id: string
          user_id: string | null
          event_type: string
          event_category: string
          event_action: string
          event_label: string | null
          page_url: string | null
          referrer: string | null
          user_agent: string | null
          ip_address: string | null
          session_id: string | null
          event_data: any | null // JSONB
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          event_type: string
          event_category: string
          event_action: string
          event_label?: string | null
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          session_id?: string | null
          event_data?: any | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          event_type?: string
          event_category?: string
          event_action?: string
          event_label?: string | null
          page_url?: string | null
          referrer?: string | null
          user_agent?: string | null
          ip_address?: string | null
          session_id?: string | null
          event_data?: any | null
          created_at?: string
        }
      }
      user_engagement_metrics: {
        Row: {
          id: string
          user_id: string
          overall_engagement_score: number
          assessment_engagement: number
          tool_usage_engagement: number
          consultation_engagement: number
          total_sessions: number
          total_time_spent: number
          last_activity_at: string | null
          metric_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          overall_engagement_score?: number
          assessment_engagement?: number
          tool_usage_engagement?: number
          consultation_engagement?: number
          total_sessions?: number
          total_time_spent?: number
          last_activity_at?: string | null
          metric_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          overall_engagement_score?: number
          assessment_engagement?: number
          tool_usage_engagement?: number
          consultation_engagement?: number
          total_sessions?: number
          total_time_spent?: number
          last_activity_at?: string | null
          metric_date?: string
          created_at?: string
        }
      }
      notification_templates: {
        Row: {
          id: string
          name: string
          subject_template: string | null
          body_template: string
          notification_type: 'email' | 'sms' | 'push' | 'in_app' | null
          variables: any | null // JSONB
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          subject_template?: string | null
          body_template: string
          notification_type?: 'email' | 'sms' | 'push' | 'in_app' | null
          variables?: any | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          subject_template?: string | null
          body_template?: string
          notification_type?: 'email' | 'sms' | 'push' | 'in_app' | null
          variables?: any | null
          is_active?: boolean
          created_at?: string
        }
      }
      user_notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          notification_type: 'info' | 'success' | 'warning' | 'error' | null
          delivery_method: 'email' | 'sms' | 'push' | 'in_app' | null
          delivered_at: string | null
          is_read: boolean
          read_at: string | null
          related_entity_type: string | null
          related_entity_id: string | null
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          notification_type?: 'info' | 'success' | 'warning' | 'error' | null
          delivery_method?: 'email' | 'sms' | 'push' | 'in_app' | null
          delivered_at?: string | null
          is_read?: boolean
          read_at?: string | null
          related_entity_type?: string | null
          related_entity_id?: string | null
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          notification_type?: 'info' | 'success' | 'warning' | 'error' | null
          delivery_method?: 'email' | 'sms' | 'push' | 'in_app' | null
          delivered_at?: string | null
          is_read?: boolean
          read_at?: string | null
          related_entity_type?: string | null
          related_entity_id?: string | null
          action_url?: string | null
          created_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          author_id: string | null
          title: string
          slug: string
          excerpt: string | null
          content: string
          featured_image_url: string | null
          meta_title: string | null
          meta_description: string | null
          keywords: string[] | null
          category: string | null
          tags: string[] | null
          status: 'draft' | 'published' | 'archived'
          published_at: string | null
          view_count: number
          reading_time: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          author_id?: string | null
          title: string
          slug: string
          excerpt?: string | null
          content: string
          featured_image_url?: string | null
          meta_title?: string | null
          meta_description?: string | null
          keywords?: string[] | null
          category?: string | null
          tags?: string[] | null
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          view_count?: number
          reading_time?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          author_id?: string | null
          title?: string
          slug?: string
          excerpt?: string | null
          content?: string
          featured_image_url?: string | null
          meta_title?: string | null
          meta_description?: string | null
          keywords?: string[] | null
          category?: string | null
          tags?: string[] | null
          status?: 'draft' | 'published' | 'archived'
          published_at?: string | null
          view_count?: number
          reading_time?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
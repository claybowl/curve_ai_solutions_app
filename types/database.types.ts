export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_tools: {
        Row: {
          api_endpoint: string | null
          average_rating: number | null
          category_id: string | null
          complexity_level: string | null
          configuration: Json | null
          created_at: string | null
          description: string | null
          detailed_description: string | null
          id: string
          is_featured: boolean | null
          is_public: boolean | null
          keywords: string[] | null
          name: string
          performance_metrics: Json | null
          pricing_details: Json | null
          pricing_model: string | null
          requirements: Json | null
          status: string | null
          tags: string[] | null
          target_audience: string[] | null
          tool_type: string | null
          total_ratings: number | null
          updated_at: string | null
          usage_count: number | null
          use_cases: string[] | null
          version: string | null
        }
        Insert: {
          api_endpoint?: string | null
          average_rating?: number | null
          category_id?: string | null
          complexity_level?: string | null
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          detailed_description?: string | null
          id?: string
          is_featured?: boolean | null
          is_public?: boolean | null
          keywords?: string[] | null
          name: string
          performance_metrics?: Json | null
          pricing_details?: Json | null
          pricing_model?: string | null
          requirements?: Json | null
          status?: string | null
          tags?: string[] | null
          target_audience?: string[] | null
          tool_type?: string | null
          total_ratings?: number | null
          updated_at?: string | null
          usage_count?: number | null
          use_cases?: string[] | null
          version?: string | null
        }
        Update: {
          api_endpoint?: string | null
          average_rating?: number | null
          category_id?: string | null
          complexity_level?: string | null
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          detailed_description?: string | null
          id?: string
          is_featured?: boolean | null
          is_public?: boolean | null
          keywords?: string[] | null
          name?: string
          performance_metrics?: Json | null
          pricing_details?: Json | null
          pricing_model?: string | null
          requirements?: Json | null
          status?: string | null
          tags?: string[] | null
          target_audience?: string[] | null
          tool_type?: string | null
          total_ratings?: number | null
          updated_at?: string | null
          usage_count?: number | null
          use_cases?: string[] | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_tools_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "tool_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_workflow_executions: {
        Row: {
          completed_at: string | null
          created_at: string | null
          duration_seconds: number | null
          error_message: string | null
          id: string
          input_data: Json | null
          n8n_execution_id: string | null
          output_data: Json | null
          started_at: string | null
          status: string
          trigger_source: string | null
          triggered_by: string | null
          workflow_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          error_message?: string | null
          id?: string
          input_data?: Json | null
          n8n_execution_id?: string | null
          output_data?: Json | null
          started_at?: string | null
          status?: string
          trigger_source?: string | null
          triggered_by?: string | null
          workflow_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          error_message?: string | null
          id?: string
          input_data?: Json | null
          n8n_execution_id?: string | null
          output_data?: Json | null
          started_at?: string | null
          status?: string
          trigger_source?: string | null
          triggered_by?: string | null
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "n8n_workflow_executions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "n8n_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_workflows: {
        Row: {
          category: string | null
          color: string | null
          config: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          estimated_duration_seconds: number | null
          execution_count: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          last_executed_at: string | null
          n8n_webhook_url: string | null
          n8n_workflow_id: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          color?: string | null
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_duration_seconds?: number | null
          execution_count?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          n8n_webhook_url?: string | null
          n8n_workflow_id?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          color?: string | null
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          estimated_duration_seconds?: number | null
          execution_count?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          last_executed_at?: string | null
          n8n_webhook_url?: string | null
          n8n_workflow_id?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          company_size: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          industry: string | null
          job_title: string | null
          last_login: string | null
          last_login_at: string | null
          last_name: string | null
          notification_preferences: Json | null
          onboarding_completed: boolean | null
          phone: string | null
          role: string
          status: string
          subscription_ends_at: string | null
          subscription_starts_at: string | null
          subscription_status: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          industry?: string | null
          job_title?: string | null
          last_login?: string | null
          last_login_at?: string | null
          last_name?: string | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          phone?: string | null
          role?: string
          status?: string
          subscription_ends_at?: string | null
          subscription_starts_at?: string | null
          subscription_status?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          industry?: string | null
          job_title?: string | null
          last_login?: string | null
          last_login_at?: string | null
          last_name?: string | null
          notification_preferences?: Json | null
          onboarding_completed?: boolean | null
          phone?: string | null
          role?: string
          status?: string
          subscription_ends_at?: string | null
          subscription_starts_at?: string | null
          subscription_status?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      solutions: {
        Row: {
          category: string | null
          challenge: string
          client_industry: string | null
          client_name: string | null
          client_size: string | null
          company_size: string[] | null
          content: string | null
          created_at: string | null
          created_by: string | null
          description: string
          excerpt: string | null
          featured_image_url: string | null
          gallery_images: string[] | null
          id: string
          implementation_timeline: string | null
          industry: string[] | null
          is_featured: boolean | null
          is_public: boolean | null
          keywords: string[] | null
          meta_description: string | null
          meta_title: string | null
          metrics: Json | null
          published_at: string | null
          results_summary: string | null
          slug: string
          solution_approach: string
          status: string | null
          tags: string[] | null
          title: string
          tools_used: string[] | null
          updated_at: string | null
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          category?: string | null
          challenge: string
          client_industry?: string | null
          client_name?: string | null
          client_size?: string | null
          company_size?: string[] | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          description: string
          excerpt?: string | null
          featured_image_url?: string | null
          gallery_images?: string[] | null
          id?: string
          implementation_timeline?: string | null
          industry?: string[] | null
          is_featured?: boolean | null
          is_public?: boolean | null
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          metrics?: Json | null
          published_at?: string | null
          results_summary?: string | null
          slug: string
          solution_approach: string
          status?: string | null
          tags?: string[] | null
          title: string
          tools_used?: string[] | null
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          category?: string | null
          challenge?: string
          client_industry?: string | null
          client_name?: string | null
          client_size?: string | null
          company_size?: string[] | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string
          excerpt?: string | null
          featured_image_url?: string | null
          gallery_images?: string[] | null
          id?: string
          implementation_timeline?: string | null
          industry?: string[] | null
          is_featured?: boolean | null
          is_public?: boolean | null
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          metrics?: Json | null
          published_at?: string | null
          results_summary?: string | null
          slug?: string
          solution_approach?: string
          status?: string | null
          tags?: string[] | null
          title?: string
          tools_used?: string[] | null
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      // ... other tables types are available but truncated for brevity
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const


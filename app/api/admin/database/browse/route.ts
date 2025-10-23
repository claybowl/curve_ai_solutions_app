import { createServerSupabaseClient } from "@/lib/supabase-server"
import { NextRequest, NextResponse } from "next/server"

const ALLOWED_TABLES = [
  "profiles",
  "assessments",
  "assessment_questions",
  "assessment_responses",
  "assessment_categories",
  "assessment_results",
  "consultations",
  "ai_tools",
  "tool_categories",
  "user_tool_usage",
  "prompts",
  "prompt_categories",
  "user_prompt_collections",
  "prompt_collection_items",
  "analytics_events",
  "user_engagement_metrics",
  "notification_templates",
  "user_notifications",
  "blog_posts",
  "n8n_workflows",
  "n8n_workflow_executions",
]

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()

    // Check if user is authenticated and is admin
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (profileError || !profile || profile.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { tableName } = body

    // Validate table name
    if (!ALLOWED_TABLES.includes(tableName)) {
      return NextResponse.json(
        { error: "Invalid table name" },
        { status: 400 }
      )
    }

    // Fetch data
    const { data, error, count } = await supabase
      .from(tableName)
      .select("*", { count: "exact" })
      .limit(100)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      data: data || [],
      count: count || 0,
      tableName,
    })
  } catch (error) {
    console.error("Error browsing database:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

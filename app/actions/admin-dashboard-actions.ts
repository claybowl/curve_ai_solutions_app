'use server'

import { createServerSupabaseClient } from "@/lib/supabase-server"

export async function getAllUsers() {
  const supabase = await createServerSupabaseClient()

  try {
    // Check admin first
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: "Unauthorized", data: null }
    }

    // Check admin role
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (profileError || !profile || profile.role !== "admin") {
      return { error: "Admin access required", data: null }
    }

    // Get all users
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (usersError) {
      return { error: usersError.message, data: null }
    }

    return { error: null, data: users }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { error: "Failed to fetch users", data: null }
  }
}

export async function getAllConsultations() {
  const supabase = await createServerSupabaseClient()

  try {
    // Check admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: "Unauthorized", data: null }
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (profileError || !profile || profile.role !== "admin") {
      return { error: "Admin access required", data: null }
    }

    // Get all consultations with user info
    const { data: consultations, error: consultError } = await supabase
      .from("consultations")
      .select(
        `
        *,
        profiles:user_id (email, first_name, last_name, company_name)
      `
      )
      .order("created_at", { ascending: false })

    if (consultError) {
      return { error: consultError.message, data: null }
    }

    return { error: null, data: consultations }
  } catch (error) {
    console.error("Error fetching consultations:", error)
    return { error: "Failed to fetch consultations", data: null }
  }
}

export async function getAllAssessments() {
  const supabase = await createServerSupabaseClient()

  try {
    // Check admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return { error: "Unauthorized", data: null }
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", user.id)
      .single()

    if (profileError || !profile || profile.role !== "admin") {
      return { error: "Admin access required", data: null }
    }

    // Get all assessments with user info
    const { data: assessments, error: assessError } = await supabase
      .from("assessments")
      .select(
        `
        *,
        profiles:user_id (email, first_name, last_name, company_name)
      `
      )
      .order("created_at", { ascending: false })

    if (assessError) {
      return { error: assessError.message, data: null }
    }

    return { error: null, data: assessments }
  } catch (error) {
    console.error("Error fetching assessments:", error)
    return { error: "Failed to fetch assessments", data: null }
  }
}

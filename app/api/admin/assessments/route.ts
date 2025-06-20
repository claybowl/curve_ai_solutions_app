import { NextResponse } from "next/server"
import { getAllAssessments } from "@/app/actions/assessment-actions"
import { getCurrentSupabaseUser, isUserAdmin } from "@/lib/db-v2"

export async function GET() {
  try {
    // Verify user is authenticated and has admin role
    const user = await getCurrentSupabaseUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userIsAdmin = await isUserAdmin(user.id)
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Use server action to get assessments
    const assessments = await getAllAssessments()
    return NextResponse.json({ assessments })
  } catch (error) {
    console.error("Error fetching assessments:", error)
    return NextResponse.json({ error: "Failed to fetch assessments" }, { status: 500 })
  }
}
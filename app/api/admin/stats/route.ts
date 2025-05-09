import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    try {
      // Test connection first
      await sql`SELECT 1 as connection_test`

      // Default values in case tables don't exist yet
      let userCount = 0
      let assessmentCount = 0
      let pendingAssessments = 0
      let toolCount = 0

      // Try to get user count
      try {
        const userResult = await sql`SELECT COUNT(*) FROM users`
        userCount = userResult[0]?.count || 0
      } catch (e) {
        console.log("Users table may not exist yet")
      }

      // Try to get assessment counts
      try {
        const assessmentResult = await sql`SELECT COUNT(*) FROM ai_assessments`
        assessmentCount = assessmentResult[0]?.count || 0

        const pendingResult = await sql`SELECT COUNT(*) FROM ai_assessments WHERE status = 'pending'`
        pendingAssessments = pendingResult[0]?.count || 0
      } catch (e) {
        console.log("Assessments table may not exist yet")
      }

      // Try to get tool count
      try {
        const toolResult = await sql`SELECT COUNT(*) FROM ai_tools`
        toolCount = toolResult[0]?.count || 0
      } catch (e) {
        console.log("Tools table may not exist yet")
      }

      return NextResponse.json({
        userCount,
        assessmentCount,
        pendingAssessments,
        toolCount,
      })
    } catch (dbError) {
      console.error("Database query error:", dbError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: String(dbError),
        },
        { status: 503 },
      )
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch stats",
        message: "An unexpected error occurred while fetching admin statistics.",
      },
      { status: 500 },
    )
  }
}

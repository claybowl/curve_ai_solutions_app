import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    // Verify user is authenticated and has admin role
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sql = neon(process.env.DATABASE_URL!)

    try {
      const assessments = await sql`
        SELECT a.id, a.status, a.created_at, a.score, u.first_name, u.last_name, u.email
        FROM ai_assessments a
        JOIN users u ON a.user_id = u.id
        ORDER BY a.created_at DESC
      `

      return NextResponse.json({ assessments })
    } catch (error) {
      // If the join fails (maybe tables don't exist yet), return empty array
      console.error("Error with join query:", error)
      return NextResponse.json({ assessments: [] })
    }
  } catch (error) {
    console.error("Error fetching assessments:", error)
    return NextResponse.json({ error: "Failed to fetch assessments" }, { status: 500 })
  }
}
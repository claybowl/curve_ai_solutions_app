import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    const tools = await sql`
      SELECT id, name, description, api_endpoint, is_active
      FROM ai_tools
      ORDER BY name ASC
    `

    return NextResponse.json(tools)
  } catch (error) {
    console.error("Error fetching AI tools:", error)
    return NextResponse.json({ error: "Failed to fetch AI tools" }, { status: 500 })
  }
}

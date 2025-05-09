import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    const sql = neon(process.env.DATABASE_URL!)

    // Generate a new password hash for "admin123"
    const password = "admin123"
    const hashedPassword = await bcrypt.hash(password, 10)

    // Update the admin user's password
    const result = await sql`
      UPDATE users 
      SET password_hash = ${hashedPassword} 
      WHERE email = 'admin@curveai.com'
      RETURNING id, email
    `

    if (result.length === 0) {
      return NextResponse.json(
        {
          error: "Admin user not found",
          solution: "Please create the admin user first",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Admin password reset successfully",
      user: result[0],
      passwordHash: hashedPassword,
    })
  } catch (error) {
    console.error("Reset admin error:", error)
    return NextResponse.json(
      {
        error: "Failed to reset admin password",
        details: String(error),
      },
      { status: 500 },
    )
  }
}

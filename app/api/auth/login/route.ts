import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log(`Attempting login for ${email}`)

    const sql = neon(process.env.DATABASE_URL!)

    // Find user
    const users = await sql`
      SELECT id, email, password_hash, first_name, last_name, role
      FROM users
      WHERE email = ${email}
    `

    console.log(`Found ${users.length} users matching email`)

    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = users[0]

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    console.log(`Password match: ${passwordMatch}`)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Create token
    const token = `${user.id}:${user.role}:${Date.now()}`

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        error: "Authentication failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

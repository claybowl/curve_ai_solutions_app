import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { encode } from "next-auth/jwt"

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

    // Log the hashed password from DB for debugging
    console.log("Stored hash:", user.password_hash)
    console.log("Provided password:", password)

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    console.log(`Password match: ${passwordMatch}`)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Create session token
    const token = await encode({
      token: {
        id: user.id.toString(),
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
      secret: process.env.NEXTAUTH_SECRET || "fallback-secret",
    })

    // Set cookie
    cookies().set({
      name: "next-auth.session-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    // Also set a custom cookie for our middleware
    cookies().set({
      name: "admin-auth",
      value: `${user.id}:${user.role}`,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
    })

    return NextResponse.json({
      success: true,
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

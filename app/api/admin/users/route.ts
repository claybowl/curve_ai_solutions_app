import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sql = neon(process.env.DATABASE_URL!)

  try {
    const users = await sql`
      SELECT id, email, first_name, last_name, company_name, role, created_at
      FROM users
      ORDER BY created_at DESC
    `

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { email, password, firstName, lastName, companyName, role } = body

  if (!email || !password || !firstName || !lastName || !role) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const sql = neon(process.env.DATABASE_URL!)

  try {
    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const result = await sql`
      INSERT INTO users (email, password_hash, first_name, last_name, company_name, role)
      VALUES (${email}, ${hashedPassword}, ${firstName}, ${lastName}, ${companyName}, ${role})
      RETURNING id, email, first_name, last_name, company_name, role, created_at
    `

    return NextResponse.json({ user: result[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

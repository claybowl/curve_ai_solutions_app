import { sql } from "@/lib/db"
import { NextResponse } from "next/server"
import { hash } from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, companyName } = await request.json()

    // Validate input
    if (!firstName || !lastName || !email || !password || !companyName) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await sql`SELECT * FROM users WHERE email = ${email}`
    if (existingUsers.length > 0) {
      return NextResponse.json({ message: "Email already in use" }, { status: 409 })
    }

    // Hash password
    const passwordHash = await hash(password, 10)

    // Create user
    const result = await sql`
      INSERT INTO users (
        email, 
        password_hash, 
        first_name, 
        last_name, 
        company_name, 
        role
      )
      VALUES (
        ${email}, 
        ${passwordHash}, 
        ${firstName}, 
        ${lastName}, 
        ${companyName}, 
        'client'
      )
      RETURNING id
    `

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      userId: result[0].id,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ message: "Registration failed" }, { status: 500 })
  }
}

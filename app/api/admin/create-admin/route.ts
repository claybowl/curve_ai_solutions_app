import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hash } from "bcryptjs"

export async function POST(request: Request) {
  try {
    // This should be a protected route that only allows creation of admin users
    // by existing admins or during initial setup
    const { email, password, firstName, lastName } = await request.json()

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hash(password, 10)

    // Create admin user
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
        'Curve AI Solutions', 
        'admin'
      )
      RETURNING id
    `

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      userId: result[0].id,
    })
  } catch (error) {
    console.error("Error creating admin user:", error)
    return NextResponse.json({ message: "Failed to create admin user" }, { status: 500 })
  }
}

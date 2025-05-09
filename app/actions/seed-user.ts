"use server"

import { sql } from "@/lib/db"
import { hash } from "bcryptjs" // Changed from bcrypt to bcryptjs

export async function seedSampleUser() {
  try {
    // Check if the user already exists
    const existingUser = await sql.query(`SELECT * FROM users WHERE email = $1`, ["demo@curveai.com"])

    if (existingUser.length > 0) {
      return { success: true, message: "Sample user already exists", userId: existingUser[0].id }
    }

    // Create a hashed password
    const passwordHash = await hash("demo1234", 10)

    // Insert the user
    const result = await sql.query(
      `
      INSERT INTO users (email, password_hash, first_name, last_name, company_name, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
      `,
      ["demo@curveai.com", passwordHash, "Demo", "User", "Curve AI Demo", "client"],
    )

    return {
      success: true,
      message: "Sample user created successfully",
      userId: result[0].id,
    }
  } catch (error) {
    console.error("Error creating sample user:", error)
    return {
      success: false,
      message: "Failed to create sample user",
      userId: 1, // Provide a fallback user ID in case of database errors
    }
  }
}

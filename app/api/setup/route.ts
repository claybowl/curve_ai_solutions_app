import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

export async function GET() {
  try {
    // Test database connection first
    const sql = neon(process.env.DATABASE_URL!)

    try {
      // Simple query to test connection
      const testConnection = await sql`SELECT 1 as test`
      console.log("Database connection test:", testConnection)
    } catch (dbError) {
      console.error("Database connection error:", dbError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: String(dbError),
          databaseUrl: process.env.DATABASE_URL ? "Database URL is set" : "Database URL is missing",
        },
        { status: 500 },
      )
    }

    // Check if users table exists
    try {
      const tableCheck = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        ) as exists
      `

      if (!tableCheck[0].exists) {
        return NextResponse.json(
          {
            error: "Users table does not exist",
            solution: "Please run the database schema setup SQL first",
          },
          { status: 404 },
        )
      }
    } catch (tableError) {
      console.error("Table check error:", tableError)
      return NextResponse.json(
        {
          error: "Failed to check if users table exists",
          details: String(tableError),
        },
        { status: 500 },
      )
    }

    // Check if admin user exists
    try {
      const adminUsers = await sql`
        SELECT id FROM users WHERE email = 'admin@curveai.com'
      `

      if (adminUsers.length > 0) {
        return NextResponse.json({
          message: "Admin user already exists",
          userId: adminUsers[0].id,
        })
      }
    } catch (userCheckError) {
      console.error("User check error:", userCheckError)
      return NextResponse.json(
        {
          error: "Failed to check if admin user exists",
          details: String(userCheckError),
        },
        { status: 500 },
      )
    }

    // Create admin user
    try {
      // Test bcrypt
      const testHash = await bcrypt.hash("test", 10)
      console.log("Bcrypt test successful:", testHash.substring(0, 10) + "...")

      const hashedPassword = await bcrypt.hash("admin123", 10)
      console.log("Admin password hash generated:", hashedPassword.substring(0, 10) + "...")

      // Check users table structure
      const columns = await sql`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users' AND table_schema = 'public'
      `

      console.log("Users table columns:", columns)

      // Get column names for the INSERT statement
      const columnNames = columns.map((col) => col.column_name)
      console.log("Column names:", columnNames)

      // Dynamically build the INSERT statement based on available columns
      let insertQuery = `
        INSERT INTO users (email, password_hash, first_name, last_name
      `

      if (columnNames.includes("company_name")) {
        insertQuery += `, company_name`
      }

      if (columnNames.includes("role")) {
        insertQuery += `, role`
      }

      insertQuery += `) VALUES ('admin@curveai.com', '${hashedPassword}', 'Admin', 'User'`

      if (columnNames.includes("company_name")) {
        insertQuery += `, 'Curve AI Solutions'`
      }

      if (columnNames.includes("role")) {
        insertQuery += `, 'admin'`
      }

      insertQuery += `) RETURNING id`

      console.log("Insert query:", insertQuery)

      const result = await sql.unsafe(insertQuery)

      return NextResponse.json({
        message: "Admin user created successfully",
        userId: result[0].id,
        passwordHash: hashedPassword.substring(0, 10) + "...",
      })
    } catch (createError) {
      console.error("User creation error:", createError)
      return NextResponse.json(
        {
          error: "Failed to create admin user",
          details: String(createError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json(
      {
        error: "Setup failed",
        details: String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

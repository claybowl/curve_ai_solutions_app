import { NextResponse } from "next/server"
import { createServerSupabaseClient, verifyAdminRole } from '@/lib/createServerSupabaseClient'
import { listUsers } from "@/lib/supabase-admin"

export async function GET() {
  try {
    // Check if the current user is an admin
    if (!await verifyAdminRole()) {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 403 })
    }

    // Get the users from Supabase
    const { data, error } = await listUsers()
    
    if (error) {
      console.error("Error fetching users:", error)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    return NextResponse.json({ users: data.users })
  } catch (error: any) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to fetch users" 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check if the current user is an admin
    const supabase = createServerSupabaseClient()
    
    if (!await verifyAdminRole()) {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, firstName, lastName, role } = body

    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create the user with Supabase Admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        firstName,
        lastName,
        role,
      }
    })

    if (error) {
      console.error("Error creating user:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ user: data.user }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating user:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to create user" 
    }, { status: 500 })
  }
}

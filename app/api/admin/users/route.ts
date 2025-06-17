import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getCurrentSupabaseUser, isUserAdmin } from "@/lib/db-v2"
import { getAllUsersAction } from "@/app/actions/user-actions"

export async function GET() {
  try {
    // Check if the current user is an admin using V2 schema
    const user = await getCurrentSupabaseUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userIsAdmin = await isUserAdmin(user.id)
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 403 })
    }

    // Get the users using V2 server actions
    const users = await getAllUsersAction()
    
    return NextResponse.json({ users })
  } catch (error: any) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to fetch users" 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check if the current user is an admin using V2 schema
    const user = await getCurrentSupabaseUser()
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const userIsAdmin = await isUserAdmin(user.id)
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Unauthorized. Admin access required" }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, firstName, lastName, role } = body

    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create form data for the server action
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    formData.append('firstName', firstName)
    formData.append('lastName', lastName)
    formData.append('role', role)

    // Use the V2 server action to create the user
    const { createUserAction } = await import("@/app/actions/user-actions")
    const result = await createUserAction(formData)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, userId: result.userId }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating user:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to create user" 
    }, { status: 500 })
  }
}

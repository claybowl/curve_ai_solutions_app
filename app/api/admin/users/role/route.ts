import { NextRequest, NextResponse } from 'next/server'
import { getCurrentSupabaseUser, isUserAdmin } from "@/lib/db-v2"
import { updateUserRoleAction } from "@/app/actions/user-actions"

export async function POST(request: NextRequest) {
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
    
    // Get the userId and role from the request body
    const { userId, role } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }
    
    if (!role || !['admin', 'client', 'consultant'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "admin", "client", or "consultant"' },
        { status: 400 }
      )
    }
    
    // Update the user's role using V2 server action
    const result = await updateUserRoleAction(userId, role)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }
    
    // Return success
    return NextResponse.json({ 
      success: true,
      message: `User role updated to ${role}`
    })
  } catch (error: any) {
    console.error('Error in admin/users/role API route:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
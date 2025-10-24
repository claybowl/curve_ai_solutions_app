import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  try {
    const adminEmail = "admin@curveai.com"

    console.log("Updating admin user metadata...")

    // Get all users
    const { data: { users }, error: listError } = await supabaseAdmin().auth.admin.listUsers()

    if (listError) {
      console.error("Error listing users:", listError)
      return NextResponse.json({ error: "Failed to list users", details: listError.message }, { status: 500 })
    }

    // Find admin user
    const adminUser = users.find(user => user.email === adminEmail)

    if (!adminUser) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 })
    }

    console.log("Found admin user:", adminUser.id)

    // Update user metadata to ensure role is set
    const { data: updatedUser, error: updateError } = await supabaseAdmin().auth.admin.updateUserById(
      adminUser.id,
      {
        user_metadata: {
          ...adminUser.user_metadata,
          firstName: "Admin",
          lastName: "User",
          companyName: "Curve AI Solutions",
          role: "admin"
        }
      }
    )

    if (updateError) {
      console.error("Error updating user metadata:", updateError)
      return NextResponse.json(
        { error: "Failed to update user metadata", details: updateError.message },
        { status: 500 }
      )
    }

    console.log("User metadata updated successfully")

    return NextResponse.json({
      message: "Admin user metadata updated successfully",
      userId: updatedUser.user.id,
      email: updatedUser.user.email,
      metadata: updatedUser.user.user_metadata
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Failed to update metadata", details: String(error) },
      { status: 500 }
    )
  }
}

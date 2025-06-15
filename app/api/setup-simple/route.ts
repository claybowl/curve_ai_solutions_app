import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const adminEmail = "admin@curveai.com"
    const adminPassword = "admin123"

    console.log("Setting up admin user with Supabase...")

    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        {
          error: "Missing Supabase environment variables",
          details: {
            supabaseUrl: supabaseUrl ? "SET" : "MISSING",
            serviceRoleKey: serviceRoleKey ? "SET" : "MISSING"
          }
        },
        { status: 500 }
      )
    }

    // Create admin client directly
    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    console.log("Supabase admin client created successfully")

    // Check if admin user already exists
    try {
      console.log("Checking for existing admin user...")
      const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
      
      if (listError) {
        console.error("Error listing users:", listError)
        return NextResponse.json(
          {
            error: "Failed to check existing users",
            details: listError.message,
          },
          { status: 500 }
        )
      }

      console.log(`Found ${existingUsers.users.length} existing users`)
      const existingAdmin = existingUsers.users.find(user => user.email === adminEmail)
      
      if (existingAdmin) {
        console.log("Admin user already exists:", existingAdmin.id)
        
        // Check if admin has a profile
        const { data: profile, error: profileError } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('user_id', existingAdmin.id)
          .single()

        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Error checking profile:", profileError)
        }

        return NextResponse.json({
          message: "Admin user already exists",
          userId: existingAdmin.id,
          email: existingAdmin.email,
          hasProfile: !!profile,
          profile: profile || null
        })
      }
    } catch (checkError) {
      console.error("Error checking existing admin:", checkError)
      return NextResponse.json(
        {
          error: "Failed to check if admin user exists",
          details: String(checkError),
        },
        { status: 500 }
      )
    }

    // Create admin user
    try {
      console.log("Creating new admin user...")
      const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          firstName: "Admin",
          lastName: "User",
          companyName: "Curve AI Solutions", 
          role: "admin"
        }
      })

      if (createError) {
        console.error("Error creating auth user:", createError)
        return NextResponse.json(
          {
            error: "Failed to create admin user in auth",
            details: createError.message,
          },
          { status: 500 }
        )
      }

      console.log("Auth user created:", authUser.user.id)

      // Create profile (should be handled by trigger, but let's verify)
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for trigger

      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.user.id)
        .single()

      if (profileError) {
        console.log("Profile not found, creating manually...")
        // Create profile manually if trigger didn't work
        const { data: newProfile, error: insertError } = await supabaseAdmin
          .from('profiles')
          .insert({
            user_id: authUser.user.id,
            email: adminEmail,
            first_name: "Admin",
            last_name: "User",
            company_name: "Curve AI Solutions",
            role: "admin"
          })
          .select()
          .single()

        if (insertError) {
          console.error("Error creating profile:", insertError)
          return NextResponse.json(
            {
              error: "User created but failed to create profile",
              details: insertError.message,
              userId: authUser.user.id
            },
            { status: 500 }
          )
        }

        return NextResponse.json({
          message: "Admin user and profile created successfully",
          userId: authUser.user.id,
          email: adminEmail,
          profile: newProfile,
          password: "admin123"
        })
      }

      return NextResponse.json({
        message: "Admin user created successfully",
        userId: authUser.user.id,
        email: adminEmail,
        profile: profile,
        password: "admin123"
      })

    } catch (createError) {
      console.error("User creation error:", createError)
      return NextResponse.json(
        {
          error: "Failed to create admin user",
          details: String(createError),
        },
        { status: 500 }
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
      { status: 500 }
    )
  }
}
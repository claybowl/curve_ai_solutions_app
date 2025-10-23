import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getCurrentSupabaseUser, isUserAdmin } from "@/lib/db-v2"
import { cookies } from 'next/headers'

export async function GET() {
  try {
    console.log("=== Debug Auth Start ===")
    
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    console.log("Supabase URL exists:", !!supabaseUrl)
    console.log("Supabase Anon Key exists:", !!supabaseAnonKey)

    // Check cookies - handle cases where cookies might not be available
    let allCookies: any[] = []
    try {
      const cookieStore = await cookies()
      if (cookieStore) {
        allCookies = cookieStore.getAll()
      }
    } catch (error) {
      console.log("Failed to access cookies:", error)
    }
    console.log("Cookie count:", allCookies.length)
    console.log("Cookie names:", allCookies.map(c => c.name))
    
    // Try to create Supabase client
    const supabase = await createServerSupabaseClient()
    console.log("Supabase client created:", !!supabase)
    
    // Try to get session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    console.log("Session error:", sessionError)
    console.log("Session exists:", !!session)
    console.log("Session user:", session?.user?.id)
    
    // Try to get user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    console.log("User error:", userError)
    console.log("User exists:", !!user)
    console.log("User ID:", user?.id)
    console.log("User email:", user?.email)
    
    // Try our helper function
    const currentUser = await getCurrentSupabaseUser()
    console.log("getCurrentSupabaseUser result:", !!currentUser)
    console.log("Current user ID:", currentUser?.id)
    
    // If we have a user, check admin status
    let isAdmin = false
    if (currentUser) {
      try {
        isAdmin = await isUserAdmin(currentUser.id)
        console.log("Is admin:", isAdmin)
        
        // Try to get profile directly
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .single()
        
        console.log("Profile error:", profileError)
        console.log("Profile data:", profile)
      } catch (adminCheckError) {
        console.log("Admin check error:", adminCheckError)
      }
    }
    
    console.log("=== Debug Auth End ===")
    
    return NextResponse.json({
      hasEnvVars: !!supabaseUrl && !!supabaseAnonKey,
      cookieCount: allCookies.length,
      cookieNames: allCookies.map(c => c.name),
      sessionExists: !!session,
      sessionError: sessionError?.message,
      userExists: !!user,
      userError: userError?.message,
      userId: user?.id,
      userEmail: user?.email,
      currentUserExists: !!currentUser,
      currentUserId: currentUser?.id,
      isAdmin,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error("Debug auth error:", error)
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
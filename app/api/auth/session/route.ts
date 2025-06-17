import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getCurrentSupabaseUser, isUserAdmin } from "@/lib/db-v2"

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error("Session error:", sessionError)
      return NextResponse.json({ 
        user: null, 
        error: sessionError.message 
      })
    }
    
    if (!session) {
      return NextResponse.json({ 
        user: null,
        message: "No active session"
      })
    }
    
    // Get user profile
    const currentUser = await getCurrentSupabaseUser()
    let isAdmin = false
    let profile = null
    
    if (currentUser) {
      isAdmin = await isUserAdmin(currentUser.id)
      
      // Get profile from database
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single()
      
      profile = profileData
    }
    
    return NextResponse.json({
      user: currentUser,
      profile,
      isAdmin,
      session: {
        access_token: session.access_token,
        expires_at: session.expires_at
      }
    })
  } catch (error: any) {
    console.error("Auth session error:", error)
    return NextResponse.json({ 
      user: null, 
      error: error.message 
    }, { status: 500 })
  }
}
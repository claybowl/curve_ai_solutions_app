import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function createSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

export async function POST(req: NextRequest) {
  try {
    const { userId, email, firstName, lastName, companyName, role } = await req.json()
    
    // Create admin client
    const supabase = createSupabaseAdmin()

    // Insert profile manually
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        email: email,
        first_name: firstName || '',
        last_name: lastName || '',
        company_name: companyName || '',
        role: role || 'client'
      })
      .select()
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: `Failed to create profile: ${error.message}` 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Profile created successfully',
      profile: data[0]
    })

  } catch (error) {
    console.error('Error creating profile:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get all users without profiles
    const supabase = createSupabaseAdmin()

    // Get all auth users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      return NextResponse.json({ 
        success: false, 
        error: usersError.message 
      }, { status: 500 })
    }

    // Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('user_id')
    
    if (profilesError) {
      return NextResponse.json({ 
        success: false, 
        error: profilesError.message 
      }, { status: 500 })
    }

    const profileUserIds = new Set(profiles.map(p => p.user_id))
    
    const usersWithoutProfiles = users.users.filter(user => 
      !profileUserIds.has(user.id)
    ).map(user => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      user_metadata: user.user_metadata
    }))

    return NextResponse.json({
      success: true,
      usersWithoutProfiles,
      totalUsers: users.users.length,
      totalProfiles: profiles.length
    })

  } catch (error) {
    console.error('Error checking profiles:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { role } = await request.json()
    
    if (!role || !['admin', 'client'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "admin" or "client"' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { role }
    })

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to update user role' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, role })
  } catch (error) {
    console.error('Error setting user role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
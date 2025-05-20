import { NextRequest, NextResponse } from 'next/server'
import { setUserAsAdmin, updateUserMetadata } from '@/lib/supabase-admin'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Get the current user from the session
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    // Get the role from the request body
    const { role } = await request.json()
    
    if (!role || (role !== 'admin' && role !== 'client')) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "admin" or "client"' },
        { status: 400 }
      )
    }
    
    // Update the user's metadata with the role
    const userId = session.user.id
    let result;
    
    if (role === 'admin') {
      result = await setUserAsAdmin(userId)
    } else {
      result = await updateUserMetadata(userId, { 
        ...session.user.user_metadata,
        role: 'client'
      })
    }
    
    if (result.error) {
      console.error('Error setting user role:', result.error)
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 }
      )
    }
    
    // Return success
    return NextResponse.json({ 
      success: true,
      message: `User role set to ${role}`,
      user: result.data.user
    })
  } catch (error: any) {
    console.error('Error in set-role API route:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
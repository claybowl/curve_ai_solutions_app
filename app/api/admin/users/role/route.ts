import { NextRequest, NextResponse } from 'next/server'
import { updateUserMetadata, setUserAsAdmin } from '@/lib/supabase-admin'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Check if the current user is an admin
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session || session.user.user_metadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized. Admin access required' },
        { status: 403 }
      )
    }
    
    // Get the userId and role from the request body
    const { userId, role } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }
    
    if (!role || (role !== 'admin' && role !== 'client')) {
      return NextResponse.json(
        { error: 'Invalid role. Must be "admin" or "client"' },
        { status: 400 }
      )
    }
    
    // Update the user's role
    let result;
    
    if (role === 'admin') {
      result = await setUserAsAdmin(userId)
    } else {
      // Get current user metadata to preserve other fields
      const { data: userData } = await supabase.auth.admin.getUserById(userId)
      
      result = await updateUserMetadata(userId, { 
        ...userData?.user?.user_metadata,
        role: 'client'
      })
    }
    
    if (result.error) {
      console.error('Error updating user role:', result.error)
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
    console.error('Error in admin/users/role API route:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
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
    const { email, autoConfirm } = await req.json()
    
    // Create admin client
    const supabase = createSupabaseAdmin()

    if (autoConfirm) {
      // Find the user by email
      const { data: users, error: listError } = await supabase.auth.admin.listUsers()
      
      if (listError) {
        return NextResponse.json({ 
          success: false, 
          error: `Failed to list users: ${listError.message}` 
        }, { status: 500 })
      }

      const user = users.users.find(u => u.email === email)
      
      if (!user) {
        return NextResponse.json({ 
          success: false, 
          error: 'User not found' 
        }, { status: 404 })
      }

      // Confirm the user's email
      const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
        email_confirm: true
      })
      
      if (error) {
        return NextResponse.json({ 
          success: false, 
          error: `Failed to confirm email: ${error.message}` 
        }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: `Email confirmed for ${email}`,
        userId: user.id
      })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'autoConfirm parameter required' 
    }, { status: 400 })

  } catch (error) {
    console.error('Error confirming email:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(req: NextRequest) {
  try {
    const { action, userIds } = await req.json()
    
    // Create admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    if (action === 'delete' && userIds && Array.isArray(userIds)) {
      const results = []
      
      for (const userId of userIds) {
        const { data, error } = await supabase.auth.admin.deleteUser(userId)
        results.push({ userId, success: !error, error: error?.message })
      }
      
      return NextResponse.json({
        success: true,
        results,
        message: `Attempted to delete ${userIds.length} users`
      })
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Invalid action or missing userIds' 
    }, { status: 400 })

  } catch (error) {
    console.error('Error in user management:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    // Create admin client
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Get all users from auth.users
    const { data: users, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    // Check for duplicate emails
    const emailCounts: Record<string, number> = {}
    const duplicates: any[] = []

    users.users.forEach(user => {
      if (user.email) {
        emailCounts[user.email] = (emailCounts[user.email] || 0) + 1
        if (emailCounts[user.email] > 1) {
          duplicates.push(user)
        }
      }
    })

    return NextResponse.json({
      success: true,
      totalUsers: users.users.length,
      duplicateEmails: Object.keys(emailCounts).filter(email => emailCounts[email] > 1),
      duplicateUsers: duplicates,
      allUsers: users.users.map(user => ({
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        email_confirmed_at: user.email_confirmed_at,
        last_sign_in_at: user.last_sign_in_at,
        user_metadata: user.user_metadata
      }))
    })

  } catch (error) {
    console.error('Error checking users:', error)
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
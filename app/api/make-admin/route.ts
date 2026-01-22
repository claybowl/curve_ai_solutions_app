/**
 * Make User Admin API Route
 *
 * This endpoint allows setting a user as an admin in Supabase.
 * Should be protected and only accessible to existing admins.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, verifyAdminRole } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    // Verify current user is admin
    const isAdmin = await verifyAdminRole()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = await createServerSupabaseClient()

    // Update the user's profile to set role as admin
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: 'admin' })
      .eq('email', email.toLowerCase())
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      message: `${email} is now an admin`,
      user: {
        id: data.user_id,
        email: data.email,
        role: 'admin'
      }
    })

  } catch (error) {
    console.error('Error making user admin:', error)
    return NextResponse.json(
      { error: 'Failed to make user admin' },
      { status: 500 }
    )
  }
}

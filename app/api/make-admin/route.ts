/**
 * Make User Admin API Route
 *
 * This endpoint allows setting a user as an admin in Stack Auth.
 * Should be protected and only accessible to existing admins.
 */

import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack/server'

// This should be protected - only allow existing admins to use this
async function isCurrentUserAdmin(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser({ request })
    if (!user) return false

    // Check if user email is an admin email
    const email = user.primaryEmail || user.email
    return email === 'admin@curveai.com' || email === 'clayton@donjon.ai'
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  // Only allow admins to create other admins
  if (!(await isCurrentUserAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Get the user by email
    const user = await stackServerApp.listUsers({
      filter: { primaryEmail: email }
    })

    if (!user || user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const targetUser = user[0]

    // Update user metadata to mark as admin
    // Stack Auth stores extra data in user metadata
    await stackServerApp.updateUser(targetUser.id, {
      metadata: {
        ...targetUser.metadata,
        role: 'admin',
        madeAdminAt: new Date().toISOString()
      }
    })

    return NextResponse.json({
      success: true,
      message: `${email} is now an admin`,
      user: {
        id: targetUser.id,
        email: targetUser.primaryEmail,
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
"use server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { getCurrentSupabaseUser } from "@/lib/db-v2"
import { revalidatePath } from "next/cache"

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
}

// Submit a contact message
export async function submitContactMessage(formData: ContactFormData) {
  try {
    const supabase = await createServerSupabaseClient()

    // Get current user if logged in (optional)
    let userId = null
    try {
      const user = await getCurrentSupabaseUser()
      userId = user?.id || null
    } catch {
      // Not logged in, that's okay for contact messages
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .insert({
        user_id: userId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        company: formData.company || null,
        subject: formData.subject,
        message: formData.message,
        status: 'new'
      })
      .select()
      .single()

    if (error) {
      console.error("Error submitting contact message:", error)
      throw new Error("Failed to submit contact message")
    }

    revalidatePath("/admin/contacts")
    return { success: true, data }
  } catch (error) {
    console.error("Error in submitContactMessage:", error)
    throw error
  }
}

// Get all contact messages (admin only)
export async function getAllContactMessages() {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentSupabaseUser()

    if (!user) {
      throw new Error("Authentication required")
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      throw new Error("Admin access required")
    }

    const { data: messages, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching contact messages:", error)
      throw new Error("Failed to fetch contact messages")
    }

    return messages || []
  } catch (error) {
    console.error("Error in getAllContactMessages:", error)
    throw error
  }
}

// Update contact message status (admin only)
export async function updateContactMessageStatus(
  id: string,
  status: 'new' | 'read' | 'replied' | 'archived',
  notes?: string
) {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentSupabaseUser()

    if (!user) {
      throw new Error("Authentication required")
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      throw new Error("Admin access required")
    }

    const updateData: any = { status }
    if (notes) updateData.notes = notes

    const { error } = await supabase
      .from('contact_messages')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error("Error updating contact message:", error)
      throw new Error("Failed to update contact message")
    }

    revalidatePath("/admin/contacts")
    return { success: true }
  } catch (error) {
    console.error("Error in updateContactMessageStatus:", error)
    throw error
  }
}

// Delete contact message (admin only)
export async function deleteContactMessage(id: string) {
  try {
    const supabase = await createServerSupabaseClient()
    const user = await getCurrentSupabaseUser()

    if (!user) {
      throw new Error("Authentication required")
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      throw new Error("Admin access required")
    }

    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', id)

    if (error) {
      console.error("Error deleting contact message:", error)
      throw new Error("Failed to delete contact message")
    }

    revalidatePath("/admin/contacts")
    return { success: true }
  } catch (error) {
    console.error("Error in deleteContactMessage:", error)
    throw error
  }
}

"use server"

/**
 * MIGRATION NOTE: This file has been partially migrated to Stack Auth.
 * 
 * Authentication/user references have been updated to use Stack Auth.
 * Business data queries (consultations table) still need database migration.
 * 
 * TODO: All database queries need to be migrated to:
 * 1. Stack Auth's database (if it supports custom tables), OR
 * 2. A separate database with foreign keys to Stack Auth user IDs
 * 
 * All functions with database queries will return empty arrays/errors until database is configured.
 */

import { getCurrentUserServer, isUserAdmin } from "@/lib/stack-auth-server"
// TODO: Import business database client when implemented
// import { getBusinessDatabaseClient } from "@/lib/db-business"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import type { 
  ConsultationFilter, 
  ConsultationFormData, 
  ConsultationUpdateFormData,
  Consultation
} from "@/types/consultations"

// Validation schema for consultation form data
const consultationSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  consultation_type: z.enum(['strategy', 'implementation', 'assessment', 'training', 'other']).optional(),
  urgency: z.enum(['low', 'medium', 'high', 'critical']).default('medium'),
  company_size: z.string().optional(),
  industry: z.string().optional(),
  budget_range: z.string().optional(),
  timeline: z.string().optional(),
  current_ai_usage: z.string().optional(),
  specific_challenges: z.string().optional(),
  preferred_contact_method: z.enum(['email', 'phone', 'video', 'in_person']).optional(),
  preferred_times: z.any().optional(),
})

const consultationUpdateSchema = z.object({
  status: z.enum(['pending', 'in_review', 'scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
  assigned_consultant_id: z.string().uuid().optional(),
  priority_score: z.number().min(0).max(10).optional(),
  scheduled_at: z.string().optional(),
  consultation_notes: z.string().optional(),
  follow_up_required: z.boolean().optional(),
  follow_up_date: z.string().optional(),
})

/**
 * Check if the user is authorized to manage consultations
 */
async function checkConsultationAuthorization() {
  const user = await getCurrentUserServer()
  
  if (!user) {
    throw new Error("Authentication required")
  }

  // TODO: Replace with Stack Auth permission check when SDK is integrated
  // const isAdmin = await isUserAdmin()
  const isAdmin = false // Placeholder until Stack Auth SDK is integrated

  return { authorized: true, userId: user.id, role: isAdmin ? 'admin' : 'client' }
}

/**
 * Create a new consultation request
 */
export async function createConsultation(formData: FormData) {
  try {
    const user = await getCurrentUserServer()
    
    if (!user) {
      throw new Error("Authentication required")
    }

    // TODO: Replace with Stack Auth database or separate database connection
    // Business data tables (consultations) may need separate database if Stack Auth doesn't support custom tables
    // const db = await getDatabaseClient() // Will need to implement based on Stack Auth capabilities

    // Parse form data
    const consultationData: ConsultationFormData = {
      subject: formData.get("subject") as string,
      description: formData.get("description") as string,
      consultation_type: formData.get("consultation_type") as 'strategy' | 'implementation' | 'assessment' | 'training' | 'other' || undefined,
      urgency: formData.get("urgency") as 'low' | 'medium' | 'high' | 'critical' || 'medium',
      company_size: formData.get("company_size") as string || undefined,
      industry: formData.get("industry") as string || undefined,
      budget_range: formData.get("budget_range") as string || undefined,
      timeline: formData.get("timeline") as string || undefined,
      current_ai_usage: formData.get("current_ai_usage") as string || undefined,
      specific_challenges: formData.get("specific_challenges") as string || undefined,
      preferred_contact_method: formData.get("preferred_contact_method") as 'email' | 'phone' | 'video' | 'in_person' || undefined,
    }

    // Parse preferred times if provided
    try {
      const preferredTimesString = formData.get("preferred_times") as string
      if (preferredTimesString) {
        consultationData.preferred_times = JSON.parse(preferredTimesString)
      }
    } catch (e) {
      console.warn("Invalid preferred times JSON, ignoring")
    }

    // Validate data
    const validationResult = consultationSchema.safeParse(consultationData)
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      throw new Error(`Validation error: ${errors}`)
    }

    // Calculate priority score based on urgency and consultation type
    let priorityScore = 0
    switch (consultationData.urgency) {
      case 'critical': priorityScore += 4; break
      case 'high': priorityScore += 3; break
      case 'medium': priorityScore += 2; break
      case 'low': priorityScore += 1; break
    }

    if (consultationData.consultation_type === 'strategy') priorityScore += 2
    if (consultationData.consultation_type === 'implementation') priorityScore += 1

    // TODO: Replace with business database client when implemented
    // Business data tables need separate database or Stack Auth database integration
    // const db = await getBusinessDatabaseClient()
    // const { data: newConsultation, error } = await db
    //   .from('consultations')
    //   .insert({
    //     ...consultationData,
    //     user_id: user.id, // Stack Auth user ID
    //     status: 'pending',
    //     priority_score: priorityScore,
    //     follow_up_required: false
    //   })
    //   .select('id')
    //   .single()
    
    console.warn("createConsultation: Business database integration needed")
    throw new Error("Consultation creation requires business database setup")

    revalidatePath("/consultation")
    revalidatePath("/admin/consultations")
    
    // Redirect to success page or consultation details
    redirect(`/consultation/success?id=${newConsultation.id}`)
  } catch (error) {
    console.error("Error in createConsultation:", error)
    throw error
  }
}

/**
 * Get all consultations with optional filtering
 */
export async function getConsultations(filter?: ConsultationFilter) {
  try {
    const { authorized, userId, role } = await checkConsultationAuthorization()
    
    // TODO: Replace with business database client when implemented
    // const db = await getBusinessDatabaseClient()
    // let query = db.from('consultations')
    
    // TODO: Complete database query implementation
    // const db = await getBusinessDatabaseClient()
    // let query = db.from('consultations').select(...)
    // Note: User lookups will need to use Stack Auth user IDs, not profiles table
    
    console.warn("getConsultations: Business database integration needed")
    return []

    // Apply user-specific filtering
    if (role !== 'admin') {
      if (role === 'consultant') {
        // Consultants can see assigned consultations and unassigned ones
        query = query.or(`user_id.eq.${userId},assigned_consultant_id.eq.${userId},assigned_consultant_id.is.null`)
      } else {
        // Regular users can only see their own consultations
        query = query.eq('user_id', userId)
      }
    }

    // Apply filters
    if (filter?.consultation_type) {
      query = query.eq('consultation_type', filter.consultation_type)
    }
    
    if (filter?.urgency) {
      query = query.eq('urgency', filter.urgency)
    }
    
    if (filter?.status) {
      query = query.eq('status', filter.status)
    }
    
    if (filter?.assigned_consultant_id) {
      query = query.eq('assigned_consultant_id', filter.assigned_consultant_id)
    }
    
    if (filter?.industry) {
      query = query.eq('industry', filter.industry)
    }
    
    if (filter?.date_from) {
      query = query.gte('created_at', filter.date_from)
    }
    
    if (filter?.date_to) {
      query = query.lte('created_at', filter.date_to)
    }
    
    if (filter?.search_term) {
      query = query.or(`subject.ilike.%${filter.search_term}%,description.ilike.%${filter.search_term}%,specific_challenges.ilike.%${filter.search_term}%`)
    }

    // Apply sorting
    const sortBy = filter?.sortBy || 'created_at'
    const sortDirection = filter?.sortDirection || 'desc'
    
    if (sortBy === 'urgency') {
      // Sort by urgency priority (critical, high, medium, low)
      query = query.order('priority_score', { ascending: sortDirection === 'asc' })
    } else {
      query = query.order(sortBy, { ascending: sortDirection === 'asc' })
    }

    // Apply pagination
    if (filter?.limit) {
      query = query.limit(filter.limit)
    }
    if (filter?.offset) {
      query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1)
    }

    const { data: consultations, error } = await query

    if (error) {
      console.error("Error fetching consultations:", error)
      return []
    }

    return consultations || []
  } catch (error) {
    console.error("Error fetching consultations:", error)
    return []
  }
}

/**
 * Get a consultation by ID
 */
export async function getConsultationById(id: string) {
  try {
    const { authorized, userId, role } = await checkConsultationAuthorization()
    const supabase = await createServerSupabaseClient()

    let query = supabase
      .from('consultations')
      .select(`
        *,
        profiles!consultations_user_id_fkey(
          id,
          first_name,
          last_name,
          email,
          company_name,
          phone,
          industry,
          company_size,
          job_title
        ),
        assigned_consultant:profiles!consultations_assigned_consultant_id_fkey(
          id,
          first_name,
          last_name,
          email,
          company_name
        )
      `)
      .eq('id', id)

    // Apply access control
    if (role !== 'admin') {
      if (role === 'consultant') {
        query = query.or(`user_id.eq.${userId},assigned_consultant_id.eq.${userId}`)
      } else {
        query = query.eq('user_id', userId)
      }
    }

    const { data: consultation, error } = await query.single()

    if (error) {
      console.error("Error fetching consultation by ID:", error)
      return null
    }

    return consultation
  } catch (error) {
    console.error("Error fetching consultation by ID:", error)
    return null
  }
}

/**
 * Update a consultation (Admin and Consultant only)
 */
export async function updateConsultation(id: string, formData: FormData) {
  try {
    const { authorized, userId, role } = await checkConsultationAuthorization()
    
    if (role !== 'admin' && role !== 'consultant') {
      throw new Error("Only administrators and consultants can update consultations")
    }

    const supabase = await createServerSupabaseClient()

    // Parse form data
    const updateData: ConsultationUpdateFormData = {}
    
    const status = formData.get("status") as string
    if (status) updateData.status = status as 'pending' | 'in_review' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
    
    const assignedConsultantId = formData.get("assigned_consultant_id") as string
    if (assignedConsultantId) updateData.assigned_consultant_id = assignedConsultantId
    
    const priorityScore = formData.get("priority_score") as string
    if (priorityScore) updateData.priority_score = parseInt(priorityScore)
    
    const scheduledAt = formData.get("scheduled_at") as string
    if (scheduledAt) updateData.scheduled_at = scheduledAt
    
    const consultationNotes = formData.get("consultation_notes") as string
    if (consultationNotes) updateData.consultation_notes = consultationNotes
    
    const followUpRequired = formData.get("follow_up_required") as string
    if (followUpRequired) updateData.follow_up_required = followUpRequired === "true"
    
    const followUpDate = formData.get("follow_up_date") as string
    if (followUpDate) updateData.follow_up_date = followUpDate

    // Validate update data
    const validationResult = consultationUpdateSchema.safeParse(updateData)
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      throw new Error(`Validation error: ${errors}`)
    }

    // Check if user can update this consultation
    const { data: consultation } = await supabase
      .from('consultations')
      .select('user_id, assigned_consultant_id')
      .eq('id', id)
      .single()

    if (!consultation) {
      throw new Error("Consultation not found")
    }

    // Access control
    if (role !== 'admin') {
      if (role === 'consultant' && consultation.assigned_consultant_id !== userId) {
        throw new Error("You can only update consultations assigned to you")
      }
    }

    // Update the consultation
    const { error } = await supabase
      .from('consultations')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error("Error updating consultation:", error)
      throw new Error("Failed to update consultation")
    }

    revalidatePath("/admin/consultations")
    revalidatePath(`/consultation/${id}`)
    
    return { success: true }
  } catch (error) {
    console.error("Error in updateConsultation:", error)
    throw error
  }
}

/**
 * Assign a consultation to a consultant (Admin only)
 */
export async function assignConsultation(consultationId: string, consultantId: string) {
  try {
    const { authorized, userId, role } = await checkConsultationAuthorization()
    
    if (role !== 'admin') {
      throw new Error("Only administrators can assign consultations")
    }

    const supabase = await createServerSupabaseClient()

    // Verify the consultant exists and has the right role
    const { data: consultant, error: consultantError } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', consultantId)
      .single()

    if (consultantError || !consultant || (consultant.role !== 'consultant' && consultant.role !== 'admin')) {
      throw new Error("Invalid consultant selected")
    }

    // Update the consultation
    const { error } = await supabase
      .from('consultations')
      .update({
        assigned_consultant_id: consultantId,
        status: 'in_review'
      })
      .eq('id', consultationId)

    if (error) {
      console.error("Error assigning consultation:", error)
      throw new Error("Failed to assign consultation")
    }

    revalidatePath("/admin/consultations")
    
    return { success: true }
  } catch (error) {
    console.error("Error in assignConsultation:", error)
    throw error
  }
}

/**
 * Get consultation statistics (Admin only)
 */
export async function getConsultationStats() {
  try {
    const { authorized, userId, role } = await checkConsultationAuthorization()
    
    if (role !== 'admin') {
      throw new Error("Only administrators can view consultation statistics")
    }

    const supabase = await createServerSupabaseClient()

    // Get basic counts
    const { data: consultations, error } = await supabase
      .from('consultations')
      .select('status, consultation_type, urgency, created_at, completed_at, assigned_consultant_id')

    if (error) {
      console.error("Error fetching consultation stats:", error)
      return null
    }

    const total = consultations.length
    const pending = consultations.filter(c => c.status === 'pending').length
    const inProgress = consultations.filter(c => c.status === 'in_progress').length
    const completed = consultations.filter(c => c.status === 'completed').length
    const cancelled = consultations.filter(c => c.status === 'cancelled').length

    // Calculate average resolution time
    const completedConsultations = consultations.filter(c => c.status === 'completed' && c.completed_at)
    const avgResolutionTime = completedConsultations.length > 0 
      ? completedConsultations.reduce((acc, c) => {
          const created = new Date(c.created_at)
          const completed = new Date(c.completed_at!)
          return acc + (completed.getTime() - created.getTime())
        }, 0) / completedConsultations.length / (1000 * 60 * 60 * 24) // Convert to days
      : 0

    // Status breakdown
    const statusBreakdown = [
      { status: 'pending', count: pending, percentage: (pending / total) * 100 },
      { status: 'in_progress', count: inProgress, percentage: (inProgress / total) * 100 },
      { status: 'completed', count: completed, percentage: (completed / total) * 100 },
      { status: 'cancelled', count: cancelled, percentage: (cancelled / total) * 100 },
    ]

    // Type breakdown
    const typeBreakdown = ['strategy', 'implementation', 'assessment', 'training', 'other'].map(type => ({
      consultation_type: type,
      count: consultations.filter(c => c.consultation_type === type).length
    }))

    // Urgency breakdown
    const urgencyBreakdown = ['critical', 'high', 'medium', 'low'].map(urgency => ({
      urgency,
      count: consultations.filter(c => c.urgency === urgency).length
    }))

    // Consultant workload
    const { data: consultants, error: consultantsError } = await supabase
      .from('profiles')
      .select('user_id, first_name, last_name')
      .in('role', ['consultant', 'admin'])

    const consultantWorkload = consultants?.map(consultant => {
      const activeConsultations = consultations.filter(
        c => c.assigned_consultant_id === consultant.user_id && 
             ['in_review', 'scheduled', 'in_progress'].includes(c.status)
      ).length
      
      const completedConsultations = consultations.filter(
        c => c.assigned_consultant_id === consultant.user_id && c.status === 'completed'
      ).length

      return {
        consultant_id: consultant.user_id,
        consultant_name: `${consultant.first_name} ${consultant.last_name}`.trim(),
        active_consultations: activeConsultations,
        completed_consultations: completedConsultations
      }
    }) || []

    return {
      total_consultations: total,
      pending_consultations: pending,
      in_progress_consultations: inProgress,
      completed_consultations: completed,
      cancelled_consultations: cancelled,
      average_resolution_time: Math.round(avgResolutionTime * 10) / 10,
      status_breakdown: statusBreakdown,
      type_breakdown: typeBreakdown,
      urgency_breakdown: urgencyBreakdown,
      consultant_workload: consultantWorkload
    }
  } catch (error) {
    console.error("Error in getConsultationStats:", error)
    return null
  }
}

/**
 * Delete a consultation (Admin only)
 */
export async function deleteConsultation(id: string) {
  try {
    const { authorized, userId, role } = await checkConsultationAuthorization()
    
    if (role !== 'admin') {
      throw new Error("Only administrators can delete consultations")
    }

    const supabase = await createServerSupabaseClient()

    // Delete the consultation
    const { error } = await supabase
      .from('consultations')
      .delete()
      .eq('id', id)

    if (error) {
      console.error("Error deleting consultation:", error)
      throw new Error("Failed to delete consultation")
    }

    revalidatePath("/admin/consultations")
    
    return { success: true }
  } catch (error) {
    console.error("Error in deleteConsultation:", error)
    throw error
  }
}

/**
 * Get available consultants (Admin only)
 */
export async function getAvailableConsultants() {
  try {
    const { authorized, userId, role } = await checkConsultationAuthorization()
    
    if (role !== 'admin') {
      throw new Error("Only administrators can view available consultants")
    }

    const supabase = await createServerSupabaseClient()

    const { data: consultants, error } = await supabase
      .from('profiles')
      .select('user_id, first_name, last_name, email, company_name')
      .in('role', ['consultant', 'admin'])
      .order('first_name')

    if (error) {
      console.error("Error fetching available consultants:", error)
      return []
    }

    return consultants || []
  } catch (error) {
    console.error("Error in getAvailableConsultants:", error)
    return []
  }
}

/**
 * Mark consultation as completed
 */
export async function completeConsultation(id: string, notes?: string) {
  try {
    const { authorized, userId, role } = await checkConsultationAuthorization()
    
    if (role !== 'admin' && role !== 'consultant') {
      throw new Error("Only administrators and consultants can complete consultations")
    }

    const supabase = await createServerSupabaseClient()

    const updateData: any = {
      status: 'completed',
      completed_at: new Date().toISOString()
    }

    if (notes) {
      updateData.consultation_notes = notes
    }

    const { error } = await supabase
      .from('consultations')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error("Error completing consultation:", error)
      throw new Error("Failed to complete consultation")
    }

    revalidatePath("/admin/consultations")
    revalidatePath(`/consultation/${id}`)
    
    return { success: true }
  } catch (error) {
    console.error("Error in completeConsultation:", error)
    throw error
  }
}